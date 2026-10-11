-- Rivals Coach — permet aux admins de lister les images envoyées (galerie Admin > Portraits).
-- À exécuter après 0006_coaching.sql.

create policy "hero_portraits_admin_select" on storage.objects for select to authenticated
  using (bucket_id = 'hero-portraits' and public.is_admin());
