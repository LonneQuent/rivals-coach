-- Rivals Coach — portraits des héros.
-- Les images sont ajoutées par un admin (upload dans Admin > Héros) et stockées dans Supabase Storage.
-- À exécuter après 0004_guides_seed.sql.

alter table public.heroes add column portrait_url text check (portrait_url is null or portrait_url ~ '^https://');

-- Bucket public en lecture (les images s'affichent sans connexion), écriture réservée aux admins
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('hero-portraits', 'hero-portraits', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "hero_portraits_admin_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'hero-portraits' and public.is_admin());
create policy "hero_portraits_admin_update" on storage.objects for update to authenticated
  using (bucket_id = 'hero-portraits' and public.is_admin())
  with check (bucket_id = 'hero-portraits' and public.is_admin());
create policy "hero_portraits_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'hero-portraits' and public.is_admin());
