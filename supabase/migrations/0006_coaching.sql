-- Rivals Coach — espace coach : coachs, notes du coach, commentaires sur les parties.
-- Rend aussi les axes d'amélioration privés (joueur + ses coachs).
-- À exécuter après 0005_hero_portraits.sql.

-- ---------------------------------------------------------------------------
-- Coachs : les admins le sont d'office ; d'autres peuvent être nommés via SQL
--   update public.profiles set is_coach = true where id = '…';
-- ---------------------------------------------------------------------------
alter table public.profiles add column is_coach boolean not null default false;

-- ---------------------------------------------------------------------------
-- Axes d'amélioration : lisibles seulement par le joueur et ses coachs
-- ---------------------------------------------------------------------------
revoke select on public.profiles from authenticated;
grant select (id, pseudo, avatar_url, main_role, is_admin, is_coach, share_aggregates, created_at, updated_at) on public.profiles to authenticated;

create or replace function public.get_focus_areas(p_player uuid)
returns text[] language sql stable security definer set search_path = public as $$
  select focus_areas from public.profiles
  where id = p_player and (p_player = auth.uid() or public.is_coach_of(p_player));
$$;
grant execute on function public.get_focus_areas(uuid) to authenticated;
revoke execute on function public.get_focus_areas(uuid) from anon, public;

-- Un joueur ne peut choisir comme coach qu'un compte coach ou admin
drop policy coach_links_insert on public.coach_links;
create policy coach_links_insert on public.coach_links for insert to authenticated
  with check (
    player_id = auth.uid()
    and exists (select 1 from public.profiles c where c.id = coach_id and (c.is_coach or c.is_admin))
  );

-- ---------------------------------------------------------------------------
-- Notes du coach, visibles par le joueur
-- ---------------------------------------------------------------------------
create table public.coach_notes (
  id         uuid primary key default gen_random_uuid(),
  player_id  uuid not null references public.profiles (id) on delete cascade,
  coach_id   uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index coach_notes_player_idx on public.coach_notes (player_id, created_at desc);

alter table public.coach_notes enable row level security;
create policy coach_notes_select on public.coach_notes for select to authenticated
  using (player_id = auth.uid() or (coach_id = auth.uid() and public.is_coach_of(player_id)));
create policy coach_notes_insert on public.coach_notes for insert to authenticated
  with check (coach_id = auth.uid() and public.is_coach_of(player_id));
create policy coach_notes_delete on public.coach_notes for delete to authenticated
  using (coach_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Commentaires sur une partie (le joueur et ses coachs)
-- ---------------------------------------------------------------------------
create table public.match_comments (
  id         uuid primary key default gen_random_uuid(),
  match_id   uuid not null references public.matches (id) on delete cascade,
  author_id  uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index match_comments_match_idx on public.match_comments (match_id, created_at);

alter table public.match_comments enable row level security;
create policy match_comments_select on public.match_comments for select to authenticated
  using (exists (select 1 from public.matches m where m.id = match_id and (m.user_id = auth.uid() or public.is_coach_of(m.user_id))));
create policy match_comments_insert on public.match_comments for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (select 1 from public.matches m where m.id = match_id and (m.user_id = auth.uid() or public.is_coach_of(m.user_id)))
  );
create policy match_comments_delete on public.match_comments for delete to authenticated
  using (author_id = auth.uid());

revoke all on public.coach_notes, public.match_comments from anon;
