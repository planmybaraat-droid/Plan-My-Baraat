-- Additive Asset Management schema. Existing CRM objects are untouched.

create or replace function public.crm_has_asset_access()
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.crm_users u
    where u.id = (select auth.uid())
      and u.is_active = true
      and (
        u.role in ('admin', 'super_admin')
        or (u.role = 'manager' and coalesce((u.crm_section_access ->> 'assetManagement')::boolean, false))
        or (u.role in ('staff', 'sales', 'accountant') and coalesce((u.module_access ->> 'assetManagement')::boolean, false))
      )
  );
$$;

create table if not exists public.crm_assets (
  id uuid primary key default gen_random_uuid(),
  asset_name text not null check (length(trim(asset_name)) between 2 and 120),
  category text not null check (category in ('Truck','DJ Truck','Car','Vintage Car','Other')),
  registration_number text not null check (length(trim(registration_number)) between 2 and 40),
  brand text,
  model text,
  manufacturing_year integer check (manufacturing_year is null or manufacturing_year between 1900 and 2200),
  color text,
  purchase_date date,
  purchase_cost numeric(14,2) check (purchase_cost is null or purchase_cost >= 0),
  odometer_reading numeric(14,1) check (odometer_reading is null or odometer_reading >= 0),
  status text not null default 'Available' check (status in ('Available','Under Maintenance','Inactive')),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists crm_assets_registration_unique on public.crm_assets (lower(trim(registration_number)));
create index if not exists crm_assets_status_idx on public.crm_assets (status);
create index if not exists crm_assets_category_idx on public.crm_assets (category);

create table if not exists public.crm_asset_maintenance (
  id uuid primary key default gen_random_uuid(),
  request_key uuid not null unique,
  asset_id uuid not null references public.crm_assets(id) on delete restrict,
  maintenance_date date not null,
  maintenance_type text not null check (maintenance_type in ('Regular Service','Repair','Emergency Repair','Parts Replacement','Other')),
  description text not null check (length(trim(description)) >= 2),
  items_changed text,
  total_cost numeric(14,2) not null default 0 check (total_cost >= 0),
  next_maintenance_date date,
  bill_path text,
  bill_name text,
  notes text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists crm_asset_maintenance_asset_date_idx on public.crm_asset_maintenance (asset_id, maintenance_date desc);
create index if not exists crm_asset_maintenance_next_date_idx on public.crm_asset_maintenance (next_maintenance_date) where next_maintenance_date is not null;

create table if not exists public.crm_asset_documents (
  id uuid primary key default gen_random_uuid(),
  request_key uuid not null unique,
  asset_id uuid not null references public.crm_assets(id) on delete restrict,
  document_type text not null check (document_type in ('RC Book','Insurance','PUC','Fitness Certificate','Permit','Other')),
  document_number text,
  issue_date date,
  expiry_date date,
  file_path text not null,
  file_name text not null,
  notes text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  check (expiry_date is null or issue_date is null or expiry_date >= issue_date)
);

create index if not exists crm_asset_documents_asset_idx on public.crm_asset_documents (asset_id, created_at desc);
create index if not exists crm_asset_documents_expiry_idx on public.crm_asset_documents (expiry_date) where expiry_date is not null;

alter table public.crm_assets enable row level security;
alter table public.crm_asset_maintenance enable row level security;
alter table public.crm_asset_documents enable row level security;

create policy "Asset records visible to authorized CRM users" on public.crm_assets for select using (public.crm_has_asset_access());
create policy "Asset records insertable by authorized CRM users" on public.crm_assets for insert with check (public.crm_has_asset_access() and created_by = auth.uid());
create policy "Asset records editable by authorized CRM users" on public.crm_assets for update using (public.crm_has_asset_access()) with check (public.crm_has_asset_access());

create policy "Asset maintenance visible to authorized CRM users" on public.crm_asset_maintenance for select using (public.crm_has_asset_access());
create policy "Asset maintenance appendable by authorized CRM users" on public.crm_asset_maintenance for insert with check (public.crm_has_asset_access() and created_by = auth.uid());

create policy "Asset documents visible to authorized CRM users" on public.crm_asset_documents for select using (public.crm_has_asset_access());
create policy "Asset documents appendable by authorized CRM users" on public.crm_asset_documents for insert with check (public.crm_has_asset_access() and created_by = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('asset-files', 'asset-files', false, 10485760, array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Asset files visible to authorized CRM users" on storage.objects for select using (bucket_id = 'asset-files' and public.crm_has_asset_access());
create policy "Asset files uploadable by authorized CRM users" on storage.objects for insert with check (bucket_id = 'asset-files' and public.crm_has_asset_access());
create policy "Asset files removable by authorized CRM users" on storage.objects for delete using (bucket_id = 'asset-files' and public.crm_has_asset_access());

revoke all on function public.crm_has_asset_access() from public;
grant execute on function public.crm_has_asset_access() to authenticated, service_role;
