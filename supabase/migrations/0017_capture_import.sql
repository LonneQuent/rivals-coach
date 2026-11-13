-- Rivals Coach — import d'une partie depuis une capture d'écran du tableau des scores
--   · ID de replay sur les parties : une même partie n'est jamais enregistrée deux fois chez un joueur
--   · feuille de match (les 12 héros et leurs stats, sans les pseudos) pour la review de compo
--   · empreintes apprises : bannière ou vignette de héros → héros (aucune image n'est stockée)
--   · alias de cartes : nom lu sur la capture (jeu en français) → carte du référentiel
--   · import_capture() : enregistre la partie chez le joueur ET chez ses coéquipiers membres de l'app
-- À exécuter après 0016_season_11.sql. Ré-exécutable.

-- 1. Profil : pseudo exact en jeu (appris au premier import) et accord pour les imports des coéquipiers
alter table public.profiles add column if not exists ingame_name text;
alter table public.profiles drop constraint if exists profiles_ingame_name_check;
alter table public.profiles add constraint profiles_ingame_name_check check (char_length(ingame_name) between 1 and 40);
alter table public.profiles add column if not exists accept_shared_imports boolean not null default true;
-- La lecture de profiles est accordée colonne par colonne (0006) : les nouvelles colonnes doivent l'être aussi
grant select (ingame_name, accept_shared_imports) on public.profiles to authenticated;
grant update (ingame_name, accept_shared_imports) on public.profiles to authenticated;

-- 2. Parties : replay, origine, feuille de match
alter table public.matches add column if not exists replay_id text;
alter table public.matches add column if not exists source text not null default 'manual';
alter table public.matches add column if not exists imported_by uuid references public.profiles (id) on delete set null;
alter table public.matches add column if not exists roster jsonb;
alter table public.matches drop constraint if exists matches_replay_id_check;
alter table public.matches add constraint matches_replay_id_check check (replay_id ~ '^[0-9]{6,20}$');
alter table public.matches drop constraint if exists matches_source_check;
alter table public.matches add constraint matches_source_check check (source in ('manual', 'capture'));
alter table public.matches drop constraint if exists matches_roster_check;
alter table public.matches add constraint matches_roster_check check (roster is null or (jsonb_typeof(roster) = 'array' and jsonb_array_length(roster) <= 12));
create unique index if not exists matches_user_replay_idx on public.matches (user_id, replay_id) where replay_id is not null;

-- 3. Empreintes de héros apprises par le groupe (lecture pour tous, écriture par import_capture)
create table if not exists public.capture_fingerprints (
  id         bigserial primary key,
  kind       text not null check (kind in ('banner', 'avatar')),
  hero_id    int  not null references public.heroes (id) on delete cascade,
  fp         text not null check (char_length(fp) between 100 and 800),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (kind, fp)
);
create index if not exists capture_fingerprints_hero_idx on public.capture_fingerprints (hero_id);
alter table public.capture_fingerprints enable row level security;
drop policy if exists capture_fingerprints_select on public.capture_fingerprints;
drop policy if exists capture_fingerprints_delete on public.capture_fingerprints;
create policy capture_fingerprints_select on public.capture_fingerprints for select to authenticated using (true);
create policy capture_fingerprints_delete on public.capture_fingerprints for delete to authenticated using (public.is_admin());
revoke all on public.capture_fingerprints from anon;
revoke insert, update on public.capture_fingerprints from authenticated;

-- 4. Alias de cartes
create table if not exists public.map_aliases (
  label      text primary key check (char_length(label) between 3 and 80),
  map_id     int not null references public.maps (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.map_aliases enable row level security;
drop policy if exists map_aliases_select on public.map_aliases;
drop policy if exists map_aliases_delete on public.map_aliases;
create policy map_aliases_select on public.map_aliases for select to authenticated using (true);
create policy map_aliases_delete on public.map_aliases for delete to authenticated using (public.is_admin());
revoke all on public.map_aliases from anon;
revoke insert, update on public.map_aliases from authenticated;

insert into public.map_aliases (label, map_id)
select v.label, m.id
from (values
  ('klyntar carapace celeste', 'Klyntar: Celestial Husk'),
  ('bas manhattan', 'Lower Manhattan'),
  ('hellfire gala krakoa', 'Hellfire Gala: Krakoa'),
  ('yggsgard chemin d yggdrasill', 'Yggsgard: Yggdrasill Path')
) as v (label, name)
join public.maps m on m.name = v.name
on conflict (label) do nothing;

-- 5. Import d'une capture
-- security definer : la fonction écrit aussi dans l'historique des coéquipiers, ce que les règles RLS
-- interdisent à un joueur. Garde-fous : il faut être connecté, un coéquipier peut refuser ces imports
-- (profiles.accept_shared_imports), chaque partie garde la trace de son auteur (imported_by) et son
-- propriétaire peut la modifier ou la supprimer comme n'importe quelle autre.
--
-- Doublons, pour chaque joueur concerné :
--   a. une partie porte déjà cet ID de replay → elle est mise à jour ;
--   b. sinon, une saisie manuelle sans ID de replay lui ressemble (même résultat et mêmes E/M/A sur
--      les trois derniers jours, ou, si elle n'a pas de stats, même carte et même héros à trois heures
--      près) → elle est complétée et reçoit l'ID de replay ;
--   c. sinon, la partie est créée.
-- Dans les cas a et b, le ressenti, la note, les tags, le rang et la date d'origine sont conservés.
create or replace function public.import_capture(p jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid      uuid := auth.uid();
  v_replay   text := nullif(p ->> 'replay_id', '');
  v_played   timestamptz := coalesce((p ->> 'played_at')::timestamptz, now());
  v_map      int := (p ->> 'map_id')::int;
  v_mode     int := (p ->> 'game_mode_id')::int;
  v_queue    int := (p ->> 'queue_id')::int;
  v_duration numeric := (p ->> 'duration_min')::numeric;
  v_label    text := nullif(p ->> 'map_label', '');
  pl jsonb; h jsonb; f jsonb;
  v_target uuid; v_id uuid; v_action text; v_keep boolean; v_same boolean; v_first int; i int;
  v_out jsonb := '[]'::jsonb;
begin
  if v_uid is null then
    raise exception 'Connexion requise';
  end if;
  if jsonb_array_length(coalesce(p -> 'players', '[]'::jsonb)) not between 1 and 6 then
    raise exception 'Entre un et six joueurs par import';
  end if;
  if not exists (select 1 from jsonb_array_elements(p -> 'players') x where (x ->> 'user_id')::uuid = v_uid) then
    raise exception 'Ta propre ligne doit faire partie de l''import';
  end if;

  for pl in select * from jsonb_array_elements(p -> 'players') loop
    v_target := (pl ->> 'user_id')::uuid;
    if jsonb_array_length(coalesce(pl -> 'heroes', '[]'::jsonb)) not between 1 and 6 then
      raise exception 'Chaque joueur doit avoir entre un et six héros';
    end if;
    if jsonb_array_length(coalesce(pl -> 'enemy_ids', '[]'::jsonb)) > 6 or jsonb_array_length(coalesce(pl -> 'roster', '[]'::jsonb)) > 12 then
      raise exception 'Feuille de match invalide';
    end if;
    if v_target <> v_uid and not exists (select 1 from profiles where id = v_target and accept_shared_imports) then
      v_out := v_out || jsonb_build_object('user_id', v_target, 'action', 'refused');
      continue;
    end if;
    for h in select * from jsonb_array_elements(pl -> 'heroes') loop
      if not exists (select 1 from heroes where id = (h ->> 'hero_id')::int and (h ->> 'role')::hero_role = any (roles)) then
        raise exception 'Rôle incompatible avec ce héros';
      end if;
    end loop;
    v_first := (pl -> 'heroes' -> 0 ->> 'hero_id')::int;

    -- a. même ID de replay
    v_id := null;
    v_action := 'created';
    if v_replay is not null then
      select id into v_id from matches where user_id = v_target and replay_id = v_replay;
      if v_id is not null then v_action := 'updated'; end if;
    end if;
    -- b. saisie manuelle de la même partie
    if v_id is null then
      select m.id into v_id
      from matches m
      where m.user_id = v_target and m.replay_id is null and m.result = pl ->> 'result'
        and (
          (
            m.played_at between v_played - interval '3 days' and v_played + interval '1 day'
            and (select sum(kills) from match_heroes where match_id = m.id) = (pl ->> 'kills')::int
            and (select sum(deaths) from match_heroes where match_id = m.id) = (pl ->> 'deaths')::int
            and (select sum(assists) from match_heroes where match_id = m.id) = (pl ->> 'assists')::int
          ) or (
            m.played_at between v_played - interval '3 hours' and v_played + interval '3 hours'
            and v_map is not null and m.map_id = v_map
            and not exists (select 1 from match_heroes where match_id = m.id and kills is not null)
            and exists (select 1 from match_heroes where match_id = m.id and hero_id = v_first)
          )
        )
      order by abs(extract(epoch from (m.played_at - v_played)))
      limit 1;
      if v_id is not null then v_action := 'merged'; end if;
    end if;

    if v_id is null then
      insert into matches (user_id, played_at, queue_id, game_mode_id, map_id, rank_id, result, duration_min, award, replay_id, source, imported_by, roster)
      values (
        v_target, v_played, v_queue, v_mode, v_map,
        case when v_target = v_uid then coalesce((p ->> 'rank_id')::int, (select rank_id from profiles where id = v_uid)) else (select rank_id from profiles where id = v_target) end,
        pl ->> 'result', v_duration, nullif(pl ->> 'award', ''), v_replay, 'capture', v_uid, pl -> 'roster'
      )
      returning id into v_id;
      v_keep := false;
    else
      -- La saisie existante liste plus de héros que la capture (changements en cours de partie) : on garde
      -- ses lignes et ses durées. Si ses totaux diffèrent, ceux de la capture vont sur le premier héros.
      select count(*) > jsonb_array_length(pl -> 'heroes')
         and not exists (select 1 from jsonb_array_elements(pl -> 'heroes') x where not exists (select 1 from match_heroes mh where mh.match_id = v_id and mh.hero_id = (x ->> 'hero_id')::int)),
         coalesce(sum(kills), -1) = (pl ->> 'kills')::int and coalesce(sum(deaths), -1) = (pl ->> 'deaths')::int and coalesce(sum(assists), -1) = (pl ->> 'assists')::int
      into v_keep, v_same
      from match_heroes where match_id = v_id;
      if v_keep and not v_same then
        update match_heroes set kills = null, deaths = null, assists = null, final_hits = null, damage = null, damage_blocked = null, healing = null, accuracy = null
        where match_id = v_id;
        update match_heroes set
          kills = (pl ->> 'kills')::int, deaths = (pl ->> 'deaths')::int, assists = (pl ->> 'assists')::int, final_hits = (pl ->> 'final_hits')::int,
          damage = (pl ->> 'damage')::int, damage_blocked = (pl ->> 'damage_blocked')::int, healing = (pl ->> 'healing')::int, accuracy = (pl ->> 'accuracy')::numeric
        where match_id = v_id and position = (select min(position) from match_heroes where match_id = v_id);
      end if;
      update matches set
        queue_id = coalesce(queue_id, v_queue),
        game_mode_id = coalesce(v_mode, game_mode_id),
        map_id = coalesce(v_map, map_id),
        result = pl ->> 'result',
        duration_min = coalesce(v_duration, duration_min),
        award = nullif(pl ->> 'award', ''),
        replay_id = coalesce(v_replay, replay_id),
        source = 'capture',
        imported_by = v_uid,
        roster = pl -> 'roster'
      where id = v_id;
      delete from match_opponents where match_id = v_id;
      if not v_keep then
        delete from match_heroes where match_id = v_id;
      end if;
    end if;

    if not v_keep then
      -- Le tableau des scores donne les totaux de la partie : ils sont portés par le premier héros
      i := 0;
      for h in select * from jsonb_array_elements(pl -> 'heroes') loop
        insert into match_heroes (match_id, hero_id, role, play_minutes, kills, deaths, assists, final_hits, damage, damage_blocked, healing, accuracy, position)
        values (
          v_id, (h ->> 'hero_id')::int, (h ->> 'role')::hero_role, (h ->> 'play_minutes')::numeric,
          case when i = 0 then (pl ->> 'kills')::int end, case when i = 0 then (pl ->> 'deaths')::int end,
          case when i = 0 then (pl ->> 'assists')::int end, case when i = 0 then (pl ->> 'final_hits')::int end,
          case when i = 0 then (pl ->> 'damage')::int end, case when i = 0 then (pl ->> 'damage_blocked')::int end,
          case when i = 0 then (pl ->> 'healing')::int end, case when i = 0 then (pl ->> 'accuracy')::numeric end, i
        )
        on conflict (match_id, hero_id) do nothing;
        i := i + 1;
      end loop;
    end if;

    insert into match_opponents (match_id, hero_id)
    select v_id, value::int from jsonb_array_elements_text(coalesce(pl -> 'enemy_ids', '[]'::jsonb))
    on conflict do nothing;

    -- Pseudo en jeu tel qu'il est lu sur la capture : appris une fois, modifiable ensuite dans le profil
    if nullif(pl ->> 'name', '') is not null then
      update profiles set ingame_name = left(pl ->> 'name', 40)
      where id = v_target and ingame_name is null;
    end if;

    v_out := v_out || jsonb_build_object('user_id', v_target, 'match_id', v_id, 'action', v_action);
  end loop;

  -- Ce que le groupe vient d'apprendre : empreintes de héros confirmées et nom français de la carte
  if jsonb_array_length(coalesce(p -> 'fingerprints', '[]'::jsonb)) > 40 then
    raise exception 'Trop d''empreintes';
  end if;
  for f in select * from jsonb_array_elements(coalesce(p -> 'fingerprints', '[]'::jsonb)) loop
    insert into capture_fingerprints (kind, hero_id, fp, created_by)
    values (f ->> 'kind', (f ->> 'hero_id')::int, f ->> 'fp', v_uid)
    on conflict (kind, fp) do update set hero_id = excluded.hero_id, created_by = excluded.created_by;
  end loop;
  if v_label is not null and v_map is not null then
    insert into map_aliases (label, map_id) values (left(v_label, 80), v_map)
    on conflict (label) do update set map_id = excluded.map_id;
  end if;

  return v_out;
end $$;
revoke execute on function public.import_capture(jsonb) from public, anon;
grant execute on function public.import_capture(jsonb) to authenticated;
