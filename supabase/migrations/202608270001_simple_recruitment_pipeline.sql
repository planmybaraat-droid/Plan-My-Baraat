-- Simple website-to-CRM recruitment pipeline.
-- Public applications are inserted only by the server-side API (service role).

create extension if not exists pgcrypto;

create or replace function public.crm_has_recruitment_access()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.crm_users u
    where u.id = (select auth.uid())
      and u.is_active = true
      and (
        u.role in ('admin', 'super_admin')
        or (u.role = 'manager' and coalesce((u.crm_section_access ->> 'recruitment')::boolean, false))
      )
  );
$$;

revoke all on function public.crm_has_recruitment_access() from public, anon;
grant execute on function public.crm_has_recruitment_access() to authenticated;

create table if not exists public.crm_recruitment_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(trim(full_name)) between 2 and 120),
  phone text not null check (length(regexp_replace(phone, '\\D', '', 'g')) between 10 and 15),
  email text not null,
  city text not null,
  position text not null,
  education text not null,
  experience_level text not null,
  skills text not null,
  availability text not null,
  resume_url text not null,
  introduction text not null,
  status text not null default 'New' check (status in ('New','Reviewing','Interview Scheduled','Next Round','Selected','Rejected')),
  source text not null default 'Website',
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.crm_users(id) on delete set null
);

create table if not exists public.crm_recruitment_interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.crm_recruitment_applications(id) on delete cascade,
  round_number integer not null default 1 check (round_number between 1 and 20),
  scheduled_at timestamptz not null,
  mode text not null check (mode in ('Office','Phone','Online')),
  location_or_link text,
  interviewer_name text not null,
  notes text,
  status text not null default 'Scheduled' check (status in ('Scheduled','Completed','Cancelled','Rescheduled')),
  created_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_recruitment_communications (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.crm_recruitment_applications(id) on delete cascade,
  interview_id uuid references public.crm_recruitment_interviews(id) on delete set null,
  message_type text not null check (message_type in ('Interview Scheduled','Next Round','Selected','Rejected','Rescheduled')),
  message_text text not null,
  delivery_status text not null default 'Prepared' check (delivery_status in ('Prepared','Sent')),
  prepared_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  prepared_at timestamptz not null default now(),
  sent_at timestamptz
);

create table if not exists public.crm_recruitment_activity (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.crm_recruitment_applications(id) on delete cascade,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  actor_id uuid references public.crm_users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists crm_recruitment_applications_status_idx on public.crm_recruitment_applications(status);
create index if not exists crm_recruitment_applications_applied_idx on public.crm_recruitment_applications(applied_at desc);
create index if not exists crm_recruitment_interviews_application_idx on public.crm_recruitment_interviews(application_id, scheduled_at desc);
create index if not exists crm_recruitment_communications_application_idx on public.crm_recruitment_communications(application_id, prepared_at desc);
create index if not exists crm_recruitment_activity_application_idx on public.crm_recruitment_activity(application_id, created_at desc);

create or replace function public.crm_recruitment_touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists crm_recruitment_applications_touch on public.crm_recruitment_applications;
create trigger crm_recruitment_applications_touch before update on public.crm_recruitment_applications
for each row execute function public.crm_recruitment_touch_updated_at();

drop trigger if exists crm_recruitment_interviews_touch on public.crm_recruitment_interviews;
create trigger crm_recruitment_interviews_touch before update on public.crm_recruitment_interviews
for each row execute function public.crm_recruitment_touch_updated_at();

create or replace function public.crm_recruitment_log_public_application()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.crm_recruitment_activity(application_id, action, details, actor_id)
  values (new.id, 'Application submitted', jsonb_build_object('source', new.source), null);
  return new;
end;
$$;
revoke all on function public.crm_recruitment_log_public_application() from public, anon, authenticated;
drop trigger if exists crm_recruitment_public_application_log on public.crm_recruitment_applications;
create trigger crm_recruitment_public_application_log after insert on public.crm_recruitment_applications
for each row execute function public.crm_recruitment_log_public_application();

alter table public.crm_recruitment_applications enable row level security;
alter table public.crm_recruitment_interviews enable row level security;
alter table public.crm_recruitment_communications enable row level security;
alter table public.crm_recruitment_activity enable row level security;

drop policy if exists "Recruitment applications managed by authorized CRM users" on public.crm_recruitment_applications;
create policy "Recruitment applications managed by authorized CRM users"
on public.crm_recruitment_applications for all to authenticated
using (public.crm_has_recruitment_access())
with check (public.crm_has_recruitment_access());

drop policy if exists "Public website applications accepted" on public.crm_recruitment_applications;
create policy "Public website applications accepted"
on public.crm_recruitment_applications for insert to anon
with check (status = 'New' and source = 'Website' and updated_by is null);

drop policy if exists "Recruitment interviews managed by authorized CRM users" on public.crm_recruitment_interviews;
create policy "Recruitment interviews managed by authorized CRM users"
on public.crm_recruitment_interviews for all to authenticated
using (public.crm_has_recruitment_access())
with check (public.crm_has_recruitment_access());

drop policy if exists "Recruitment communications managed by authorized CRM users" on public.crm_recruitment_communications;
create policy "Recruitment communications managed by authorized CRM users"
on public.crm_recruitment_communications for all to authenticated
using (public.crm_has_recruitment_access())
with check (public.crm_has_recruitment_access());

drop policy if exists "Recruitment activity managed by authorized CRM users" on public.crm_recruitment_activity;
create policy "Recruitment activity managed by authorized CRM users"
on public.crm_recruitment_activity for all to authenticated
using (public.crm_has_recruitment_access())
with check (public.crm_has_recruitment_access());

grant select, insert, update, delete on public.crm_recruitment_applications to authenticated;
grant select, insert, update, delete on public.crm_recruitment_interviews to authenticated;
grant select, insert, update, delete on public.crm_recruitment_communications to authenticated;
grant select, insert, update, delete on public.crm_recruitment_activity to authenticated;

revoke all on public.crm_recruitment_applications from anon;
revoke all on public.crm_recruitment_interviews from anon;
revoke all on public.crm_recruitment_communications from anon;
revoke all on public.crm_recruitment_activity from anon;
grant insert on public.crm_recruitment_applications to anon;
