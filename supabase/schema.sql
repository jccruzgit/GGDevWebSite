create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  role text not null default 'viewer' check (role in ('owner', 'admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  price numeric(10,2) not null default 20,
  short_description text not null,
  description text not null,
  tag text,
  featured boolean not null default false,
  active boolean not null default true,
  accent text not null default '#3AA6FF',
  glow text not null default '#7CF8D2',
  sizes text[] not null default array['S', 'M', 'L', 'XL', '2XL'],
  available_colors jsonb not null default
    '[{"name":"Negro eclipse","hex":"#111827"},{"name":"Blanco polar","hex":"#F5F7FA"},{"name":"Azul midnight","hex":"#13213B"}]'::jsonb,
  main_image_path text,
  secondary_image_paths text[] not null default '{}',
  created_by uuid references auth.users (id),
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

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
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

alter table public.profiles enable row level security;
alter table public.products enable row level security;

drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "products_public_read_active" on public.products;
create policy "products_public_read_active"
on public.products
for select
to anon, authenticated
using (active = true);

drop policy if exists "products_admin_read_all" on public.products;
create policy "products_admin_read_all"
on public.products
for select
to authenticated
using ((select public.has_any_role(array['owner', 'admin'])));

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert"
on public.products
for insert
to authenticated
with check ((select public.has_any_role(array['owner', 'admin'])));

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
on public.products
for update
to authenticated
using ((select public.has_any_role(array['owner', 'admin'])))
with check ((select public.has_any_role(array['owner', 'admin'])));

drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete"
on public.products
for delete
to authenticated
using ((select public.has_any_role(array['owner', 'admin'])));

insert into storage.buckets (id, name, public)
values ('product-mockups', 'product-mockups', true)
on conflict (id) do nothing;

drop policy if exists "product_mockups_public_read" on storage.objects;
create policy "product_mockups_public_read"
on storage.objects
for select
to public
using (bucket_id = 'product-mockups');

drop policy if exists "product_mockups_admin_insert" on storage.objects;
create policy "product_mockups_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-mockups'
  and (select public.has_any_role(array['owner', 'admin']))
);

drop policy if exists "product_mockups_admin_update" on storage.objects;
create policy "product_mockups_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-mockups'
  and (select public.has_any_role(array['owner', 'admin']))
)
with check (
  bucket_id = 'product-mockups'
  and (select public.has_any_role(array['owner', 'admin']))
);

drop policy if exists "product_mockups_admin_delete" on storage.objects;
create policy "product_mockups_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-mockups'
  and (select public.has_any_role(array['owner', 'admin']))
);
