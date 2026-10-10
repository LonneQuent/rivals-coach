-- Rivals Coach — guides (héros et rôles), objectifs, évaluations de compétences, axes d'amélioration.
-- À exécuter après 0002_seed.sql.

-- ---------------------------------------------------------------------------
-- Guides : une fiche par héros ou par rôle. Contenu structuré en JSON :
-- { summary, patch_note, sections: [{title, items[]}], counters: [{hero, note}],
--   synergies: [{hero, note}], sources: [{title, author, url}] }
-- ---------------------------------------------------------------------------
create table public.guides (
  id         serial primary key,
  kind       text not null check (kind in ('hero', 'role')),
  hero_id    int references public.heroes (id) on delete cascade,
  role       public.hero_role,
  content    jsonb not null default '{}'::jsonb,
  status     text not null default 'draft' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null default auth.uid(),
  check ((kind = 'hero' and hero_id is not null and role is null) or (kind = 'role' and role is not null and hero_id is null))
);
create unique index guides_hero_uniq on public.guides (hero_id) where kind = 'hero';
create unique index guides_role_uniq on public.guides (role) where kind = 'role';
create trigger guides_updated_at before update on public.guides
  for each row execute function public.set_updated_at();

alter table public.guides enable row level security;
create policy guides_select on public.guides for select to authenticated
  using (status = 'published' or public.is_admin());
create policy guides_admin_insert on public.guides for insert to authenticated with check (public.is_admin());
create policy guides_admin_update on public.guides for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy guides_admin_delete on public.guides for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Axes d'amélioration (texte libre, sur le profil)
-- ---------------------------------------------------------------------------
alter table public.profiles add column focus_areas text[] not null default '{}'
  check (cardinality(focus_areas) <= 8);
grant update (focus_areas) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Objectifs mesurables, suivis sur les dernières parties
-- ---------------------------------------------------------------------------
create table public.goals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  created_by uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  metric     text not null check (metric in ('winrate', 'kda', 'deaths', 'kills', 'deaths10', 'damage10', 'healing10', 'blocked10', 'accuracy')),
  op         text not null check (op in ('<=', '>=')),
  target     numeric not null check (target >= 0),
  role       public.hero_role,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
create index goals_user_idx on public.goals (user_id) where active;

alter table public.goals enable row level security;
create policy goals_select on public.goals for select to authenticated
  using (user_id = auth.uid() or public.is_coach_of(user_id));
create policy goals_insert on public.goals for insert to authenticated
  with check (created_by = auth.uid() and (user_id = auth.uid() or public.is_coach_of(user_id)));
create policy goals_update on public.goals for update to authenticated
  using (user_id = auth.uid() or created_by = auth.uid()) with check (user_id = auth.uid() or created_by = auth.uid());
create policy goals_delete on public.goals for delete to authenticated
  using (user_id = auth.uid() or created_by = auth.uid());

-- ---------------------------------------------------------------------------
-- Évaluations de compétences (radar) : auto-évaluation ou note du coach.
-- scores : { "aim": 7, "survival": 5, ... } valeurs de 1 à 10.
-- Chaque enregistrement crée une ligne, pour comparer dans le temps.
-- ---------------------------------------------------------------------------
create table public.skill_evaluations (
  id         uuid primary key default gen_random_uuid(),
  player_id  uuid not null references public.profiles (id) on delete cascade,
  rater_id   uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  scores     jsonb not null check (jsonb_typeof(scores) = 'object'),
  created_at timestamptz not null default now()
);
create index skill_evaluations_player_idx on public.skill_evaluations (player_id, created_at desc);

alter table public.skill_evaluations enable row level security;
create policy skill_eval_select on public.skill_evaluations for select to authenticated
  using (player_id = auth.uid() or rater_id = auth.uid() or public.is_coach_of(player_id));
create policy skill_eval_insert on public.skill_evaluations for insert to authenticated
  with check (rater_id = auth.uid() and (player_id = auth.uid() or public.is_coach_of(player_id)));
create policy skill_eval_delete on public.skill_evaluations for delete to authenticated
  using (rater_id = auth.uid());

revoke all on public.guides, public.goals, public.skill_evaluations from anon;
