-- Ejecuta este script en el SQL Editor de Supabase y comparte los resultados.
-- Sirve para diagnosticar por que `public.requests` sigue rechazando inserts anonimos.

select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'requests';

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'requests'
order by policyname;

select
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'requests'
  and grantee in ('anon', 'authenticated', 'service_role', 'postgres', 'public')
order by grantee, privilege_type;

select
  grantee,
  privilege_type
from information_schema.role_usage_grants
where object_schema = 'public'
  and grantee in ('anon', 'authenticated', 'service_role', 'postgres', 'public')
order by grantee, privilege_type;
