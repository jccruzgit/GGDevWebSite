-- Aplica este parche en el SQL Editor del proyecto remoto de Supabase
-- si las solicitudes publicas del sitio fallan con:
-- `new row violates row-level security policy for table "requests"`.
--
-- Este fix cubre:
-- 1. Insercion publica en public.requests
-- 2. Lectura y actualizacion admin en public.requests
-- 3. Creacion del bucket request-assets
-- 4. Insercion publica al bucket request-assets para archivos del customizer

create extension if not exists pgcrypto;

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (request_type in ('customizer', 'advisory', 'product-order', 'product-help')),
  status text not null default 'new' check (status in ('new', 'reviewing', 'approved', 'closed')),
  customer_name text,
  customer_phone text,
  subject text,
  product_slug text,
  product_name text,
  garment_color text,
  placement text,
  size text,
  quantity integer,
  notes text,
  design_file_name text,
  design_file_path text,
  preview_scale numeric(6,2),
  preview_offset_x numeric(6,2),
  preview_offset_y numeric(6,2),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_requests_updated_at on public.requests;
create trigger set_requests_updated_at
before update on public.requests
for each row
execute function public.set_updated_at();

create or replace function public.has_any_role(allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = any (allowed_roles)
  );
$$;

alter table public.requests enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.requests to anon, authenticated;
grant select, update on table public.requests to authenticated;

drop policy if exists "requests_public_insert" on public.requests;
create policy "requests_public_insert"
on public.requests
for insert
to anon, authenticated
with check (true);

drop policy if exists "requests_admin_read_all" on public.requests;
create policy "requests_admin_read_all"
on public.requests
for select
to authenticated
using ((select public.has_any_role(array['owner', 'admin'])));

drop policy if exists "requests_admin_update" on public.requests;
create policy "requests_admin_update"
on public.requests
for update
to authenticated
using ((select public.has_any_role(array['owner', 'admin'])))
with check ((select public.has_any_role(array['owner', 'admin'])));

insert into storage.buckets (id, name, public)
values ('request-assets', 'request-assets', true)
on conflict (id) do nothing;

drop policy if exists "request_assets_public_read" on storage.objects;
create policy "request_assets_public_read"
on storage.objects
for select
to public
using (bucket_id = 'request-assets');

drop policy if exists "request_assets_public_insert" on storage.objects;
create policy "request_assets_public_insert"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'request-assets');

drop policy if exists "request_assets_admin_update" on storage.objects;
create policy "request_assets_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'request-assets'
  and (select public.has_any_role(array['owner', 'admin']))
)
with check (
  bucket_id = 'request-assets'
  and (select public.has_any_role(array['owner', 'admin']))
);

drop policy if exists "request_assets_admin_delete" on storage.objects;
create policy "request_assets_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'request-assets'
  and (select public.has_any_role(array['owner', 'admin']))
);
