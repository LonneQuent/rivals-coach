-- Rivals Coach — lot 1 : profils, référentiels, parties, accès coach.
-- À exécuter une seule fois dans Supabase > SQL Editor > New query > Run.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type public.hero_role as enum ('Vanguard', 'Duelist', 'Strategist');

-- ---------------------------------------------------------------------------
-- Utilitaire : updated_at automatique
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- Profils (1 ligne par compte, créée automatiquement à l'inscription)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  pseudo           text check (char_length(pseudo) between 1 and 40),
  avatar_url       text,
  main_role        public.hero_role,
  is_admin         boolean not null default false,
  share_aggregates boolean not null default true,  -- contribue aux stats agrégées du groupe
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, pseudo, avatar_url)
  values (
    new.id,
    nullif(left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), 40), ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fonctions d'autorisation (security definer : lisent sans déclencher la RLS en boucle)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- ---------------------------------------------------------------------------
-- Accès coach : un joueur autorise un coach à lire ses données
-- ---------------------------------------------------------------------------
create table public.coach_links (
  coach_id   uuid not null references public.profiles (id) on delete cascade,
  player_id  uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (coach_id, player_id),
  check (coach_id <> player_id)
);

create or replace function public.is_coach_of(p_player uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.coach_links where coach_id = auth.uid() and player_id = p_player);
$$;

-- ---------------------------------------------------------------------------
-- Référentiels (éditables par les admins, jamais codés en dur dans l'app)
-- ---------------------------------------------------------------------------
create table public.heroes (
  id         serial primary key,
  slug       text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name       text not null unique,
  roles      public.hero_role[] not null check (cardinality(roles) between 1 and 3),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.game_modes (
  id     serial primary key,
  name   text not null unique,
  active boolean not null default true,
  sort   int not null default 0
);

create table public.maps (
  id           serial primary key,
  name         text not null unique,
  game_mode_id int references public.game_modes (id) on delete set null,
  active       boolean not null default true
);

create table public.queues (
  id     serial primary key,
  name   text not null unique,
  active boolean not null default true,
  sort   int not null default 0
);

create table public.ranks (
  id         serial primary key,
  name       text not null unique,
  tier_order int not null unique,  -- du plus bas au plus haut
  active     boolean not null default true
);

create table public.error_tags (
  id     serial primary key,
  name   text not null unique,
  active boolean not null default true,
  sort   int not null default 0
);

-- ---------------------------------------------------------------------------
-- Héros favoris / à entraîner
-- ---------------------------------------------------------------------------
create table public.player_heroes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  hero_id int  not null references public.heroes (id) on delete cascade,
  kind    text not null check (kind in ('main', 'train')),
  primary key (user_id, hero_id, kind)
);

-- ---------------------------------------------------------------------------
-- Parties
-- ---------------------------------------------------------------------------
create table public.matches (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  played_at    timestamptz not null default now(),
  queue_id     int references public.queues (id) on delete set null,
  game_mode_id int references public.game_modes (id) on delete set null,
  map_id       int references public.maps (id) on delete set null,
  rank_id      int references public.ranks (id) on delete set null,
  result       text not null check (result in ('win', 'loss')),
  duration_min numeric(5, 1) check (duration_min > 0 and duration_min < 120),
  feeling      smallint check (feeling between 1 and 5),
  award        text check (award in ('MVP', 'SVP')),
  note         text check (char_length(note) <= 1000),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index matches_user_played_idx on public.matches (user_id, played_at desc);
create trigger matches_updated_at before update on public.matches
  for each row execute function public.set_updated_at();

-- Un ou plusieurs héros par partie (swaps), avec les stats de chaque héros
create table public.match_heroes (
  id             uuid primary key default gen_random_uuid(),
  match_id       uuid not null references public.matches (id) on delete cascade,
  hero_id        int  not null references public.heroes (id),
  role           public.hero_role not null,
  play_minutes   numeric(5, 1) check (play_minutes >= 0),
  kills          int check (kills >= 0),
  deaths         int check (deaths >= 0),
  assists        int check (assists >= 0),
  final_hits     int check (final_hits >= 0),
  damage         int check (damage >= 0),
  damage_blocked int check (damage_blocked >= 0),
  healing        int check (healing >= 0),
  accuracy       numeric(5, 2) check (accuracy between 0 and 100),
  position       smallint not null default 0,
  unique (match_id, hero_id)
);
create index match_heroes_match_idx on public.match_heroes (match_id);

create table public.match_tags (
  match_id uuid not null references public.matches (id) on delete cascade,
  tag_id   int  not null references public.error_tags (id) on delete cascade,
  primary key (match_id, tag_id)
);

-- ---------------------------------------------------------------------------
-- Enregistrement atomique d'une partie (création ou modification)
-- security invoker : les règles RLS de l'utilisateur s'appliquent
-- ---------------------------------------------------------------------------
create or replace function public.save_match(p jsonb)
returns uuid language plpgsql security invoker set search_path = public as $$
declare
  v_id uuid := nullif(p ->> 'id', '')::uuid;
  h jsonb;
  i int := 0;
begin
  if jsonb_array_length(coalesce(p -> 'heroes', '[]'::jsonb)) = 0 then
    raise exception 'Au moins un héros est requis';
  end if;

  if v_id is null then
    insert into matches (played_at, queue_id, game_mode_id, map_id, rank_id, result, duration_min, feeling, award, note)
    values (
      coalesce((p ->> 'played_at')::timestamptz, now()),
      (p ->> 'queue_id')::int, (p ->> 'game_mode_id')::int, (p ->> 'map_id')::int, (p ->> 'rank_id')::int,
      p ->> 'result', (p ->> 'duration_min')::numeric, (p ->> 'feeling')::smallint,
      nullif(p ->> 'award', ''), nullif(p ->> 'note', '')
    )
    returning id into v_id;
  else
    update matches set
      played_at = coalesce((p ->> 'played_at')::timestamptz, played_at),
      queue_id = (p ->> 'queue_id')::int, game_mode_id = (p ->> 'game_mode_id')::int,
      map_id = (p ->> 'map_id')::int, rank_id = (p ->> 'rank_id')::int,
      result = p ->> 'result', duration_min = (p ->> 'duration_min')::numeric,
      feeling = (p ->> 'feeling')::smallint, award = nullif(p ->> 'award', ''), note = nullif(p ->> 'note', '')
    where id = v_id and user_id = auth.uid();
    if not found then
      raise exception 'Partie introuvable';
    end if;
    delete from match_heroes where match_id = v_id;
    delete from match_tags where match_id = v_id;
  end if;

  for h in select * from jsonb_array_elements(p -> 'heroes') loop
    if not exists (select 1 from heroes where id = (h ->> 'hero_id')::int and (h ->> 'role')::hero_role = any (roles)) then
      raise exception 'Rôle incompatible avec ce héros';
    end if;
    insert into match_heroes (match_id, hero_id, role, play_minutes, kills, deaths, assists, final_hits, damage, damage_blocked, healing, accuracy, position)
    values (
      v_id, (h ->> 'hero_id')::int, (h ->> 'role')::hero_role, (h ->> 'play_minutes')::numeric,
      (h ->> 'kills')::int, (h ->> 'deaths')::int, (h ->> 'assists')::int, (h ->> 'final_hits')::int,
      (h ->> 'damage')::int, (h ->> 'damage_blocked')::int, (h ->> 'healing')::int, (h ->> 'accuracy')::numeric, i
    );
    i := i + 1;
  end loop;

  insert into match_tags (match_id, tag_id)
  select v_id, value::int from jsonb_array_elements_text(coalesce(p -> 'tag_ids', '[]'::jsonb))
  on conflict do nothing;

  return v_id;
end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.coach_links   enable row level security;
alter table public.heroes        enable row level security;
alter table public.game_modes    enable row level security;
alter table public.maps          enable row level security;
alter table public.queues        enable row level security;
alter table public.ranks         enable row level security;
alter table public.error_tags    enable row level security;
alter table public.player_heroes enable row level security;
alter table public.matches       enable row level security;
alter table public.match_heroes  enable row level security;
alter table public.match_tags    enable row level security;

-- Profils : pseudo et avatar visibles des membres connectés (nécessaire pour choisir un coach)
create policy profiles_select on public.profiles for select to authenticated using (true);
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
-- Un joueur ne peut pas se donner le rôle admin : seules ces colonnes sont modifiables
revoke update on public.profiles from authenticated, anon;
grant update (pseudo, avatar_url, main_role, share_aggregates) on public.profiles to authenticated;

-- Liens coach : visibles par les deux personnes ; c'est le joueur qui accorde ou retire l'accès
create policy coach_links_select on public.coach_links for select to authenticated
  using (coach_id = auth.uid() or player_id = auth.uid());
create policy coach_links_insert on public.coach_links for insert to authenticated
  with check (player_id = auth.uid());
create policy coach_links_delete on public.coach_links for delete to authenticated
  using (player_id = auth.uid() or coach_id = auth.uid());

-- Référentiels : lecture pour tous les connectés, écriture admin
do $$
declare t text;
begin
  foreach t in array array['heroes', 'game_modes', 'maps', 'queues', 'ranks', 'error_tags'] loop
    execute format('create policy %1$s_select on public.%1$s for select to authenticated using (true)', t);
    execute format('create policy %1$s_admin_insert on public.%1$s for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy %1$s_admin_update on public.%1$s for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy %1$s_admin_delete on public.%1$s for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;

-- Héros favoris : le joueur et ses coachs lisent, le joueur écrit
create policy player_heroes_select on public.player_heroes for select to authenticated
  using (user_id = auth.uid() or public.is_coach_of(user_id));
create policy player_heroes_insert on public.player_heroes for insert to authenticated
  with check (user_id = auth.uid());
create policy player_heroes_delete on public.player_heroes for delete to authenticated
  using (user_id = auth.uid());

-- Parties : privées ; le joueur écrit, ses coachs lisent
create policy matches_select on public.matches for select to authenticated
  using (user_id = auth.uid() or public.is_coach_of(user_id));
create policy matches_insert on public.matches for insert to authenticated
  with check (user_id = auth.uid());
create policy matches_update on public.matches for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy matches_delete on public.matches for delete to authenticated
  using (user_id = auth.uid());

create policy match_heroes_select on public.match_heroes for select to authenticated
  using (exists (select 1 from public.matches m where m.id = match_id and (m.user_id = auth.uid() or public.is_coach_of(m.user_id))));
create policy match_heroes_write on public.match_heroes for all to authenticated
  using (exists (select 1 from public.matches m where m.id = match_id and m.user_id = auth.uid()))
  with check (exists (select 1 from public.matches m where m.id = match_id and m.user_id = auth.uid()));

create policy match_tags_select on public.match_tags for select to authenticated
  using (exists (select 1 from public.matches m where m.id = match_id and (m.user_id = auth.uid() or public.is_coach_of(m.user_id))));
create policy match_tags_write on public.match_tags for all to authenticated
  using (exists (select 1 from public.matches m where m.id = match_id and m.user_id = auth.uid()))
  with check (exists (select 1 from public.matches m where m.id = match_id and m.user_id = auth.uid()));

-- Les visiteurs non connectés n'ont accès à rien
revoke all on all tables in schema public from anon;
grant execute on function public.save_match(jsonb) to authenticated;
revoke execute on function public.save_match(jsonb) from anon, public;
