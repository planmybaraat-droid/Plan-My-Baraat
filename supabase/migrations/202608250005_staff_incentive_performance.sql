-- Additive incentive configuration and monthly approval snapshots.
-- Attendance, breaks, leave and DWR remain the sole live calculation sources.

create table if not exists public.crm_incentive_config (
  id smallint primary key default 1 check (id = 1),
  attendance_weight numeric(5,2) not null default 25 check (attendance_weight >= 0),
  working_hours_weight numeric(5,2) not null default 20 check (working_hours_weight >= 0),
  punctuality_weight numeric(5,2) not null default 20 check (punctuality_weight >= 0),
  break_weight numeric(5,2) not null default 20 check (break_weight >= 0),
  daily_report_weight numeric(5,2) not null default 15 check (daily_report_weight >= 0),
  required_work_minutes integer not null default 480 check (required_work_minutes > 0),
  allowed_breaks_per_day integer not null default 2 check (allowed_breaks_per_day >= 0),
  late_grace_minutes integer not null default 0 check (late_grace_minutes >= 0),
  break_violation_deduction numeric(5,2) not null default 2 check (break_violation_deduction >= 0),
  late_rules jsonb not null default '[{"minimum":0,"maximum":0,"score":20},{"minimum":1,"maximum":1,"score":15},{"minimum":2,"maximum":2,"score":10},{"minimum":3,"maximum":null,"score":0}]'::jsonb,
  incentive_slabs jsonb not null default '[{"minimum":0,"maximum":59.99,"amount":0},{"minimum":60,"maximum":74.99,"amount":750},{"minimum":75,"maximum":84.99,"amount":1750},{"minimum":85,"maximum":94.99,"amount":2500},{"minimum":95,"maximum":100,"amount":3000}]'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint crm_incentive_weights_total check (attendance_weight + working_hours_weight + punctuality_weight + break_weight + daily_report_weight = 100),
  constraint crm_incentive_late_rules_array check (jsonb_typeof(late_rules) = 'array'),
  constraint crm_incentive_slabs_array check (jsonb_typeof(incentive_slabs) = 'array')
);

insert into public.crm_incentive_config(id) values (1) on conflict (id) do nothing;

create table if not exists public.crm_incentive_snapshots (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.crm_staff(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  attendance_score numeric(5,2) not null,
  working_hours_score numeric(5,2) not null,
  punctuality_score numeric(5,2) not null,
  break_score numeric(5,2) not null,
  daily_report_score numeric(5,2) not null,
  total_score numeric(5,2) not null,
  incentive_amount numeric(12,2) not null,
  status text not null default 'Approved' check (status in ('Approved','Paid','Rejected')),
  metrics jsonb not null default '{}'::jsonb,
  rules_snapshot jsonb not null default '{}'::jsonb,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz not null default now(),
  approval_note text,
  updated_at timestamptz not null default now(),
  unique(staff_id, period_start, period_end),
  check (period_end >= period_start),
  check (total_score between 0 and 100)
);

create index if not exists crm_incentive_snapshots_period_idx on public.crm_incentive_snapshots(period_start, period_end);
create index if not exists crm_incentive_snapshots_staff_idx on public.crm_incentive_snapshots(staff_id);

alter table public.crm_incentive_config enable row level security;
alter table public.crm_incentive_snapshots enable row level security;

grant select on public.crm_incentive_config to authenticated;
grant update on public.crm_incentive_config to authenticated;
grant select, insert, update on public.crm_incentive_snapshots to authenticated;

drop policy if exists "Authenticated users read incentive rules" on public.crm_incentive_config;
create policy "Authenticated users read incentive rules" on public.crm_incentive_config
for select to authenticated using (auth.uid() is not null);

drop policy if exists "Performance admins update incentive rules" on public.crm_incentive_config;
create policy "Performance admins update incentive rules" on public.crm_incentive_config
for update to authenticated
using (public.is_crm_admin() or public.crm_manager_has_section('performance'))
with check (public.is_crm_admin() or public.crm_manager_has_section('performance'));

drop policy if exists "Performance snapshots visible to authorized users" on public.crm_incentive_snapshots;
create policy "Performance snapshots visible to authorized users" on public.crm_incentive_snapshots
for select to authenticated using (
  public.is_crm_admin()
  or public.crm_manager_has_section('performance')
  or exists (select 1 from public.crm_staff s where s.id = staff_id and s.user_id = auth.uid())
);

drop policy if exists "Performance admins create snapshots" on public.crm_incentive_snapshots;
create policy "Performance admins create snapshots" on public.crm_incentive_snapshots
for insert to authenticated with check (
  (public.is_crm_admin() or public.crm_manager_has_section('performance')) and approved_by = auth.uid()
);

drop policy if exists "Performance admins update snapshots" on public.crm_incentive_snapshots;
create policy "Performance admins update snapshots" on public.crm_incentive_snapshots
for update to authenticated
using (public.is_crm_admin() or public.crm_manager_has_section('performance'))
with check (public.is_crm_admin() or public.crm_manager_has_section('performance'));

-- Authorized managers need read-only access to the existing source records.
drop policy if exists "Performance managers read staff" on public.crm_staff;
create policy "Performance managers read staff" on public.crm_staff for select to authenticated
using (public.crm_manager_has_section('performance'));
drop policy if exists "Performance managers read attendance" on public.crm_attendance;
create policy "Performance managers read attendance" on public.crm_attendance for select to authenticated
using (public.crm_manager_has_section('performance'));
drop policy if exists "Performance managers read breaks" on public.crm_attendance_breaks;
create policy "Performance managers read breaks" on public.crm_attendance_breaks for select to authenticated
using (public.crm_manager_has_section('performance'));
drop policy if exists "Performance managers read daily reports" on public.crm_daily_work_reports;
create policy "Performance managers read daily reports" on public.crm_daily_work_reports for select to authenticated
using (public.crm_manager_has_section('performance'));
drop policy if exists "Performance managers read leave" on public.crm_leave_requests;
create policy "Performance managers read leave" on public.crm_leave_requests for select to authenticated
using (public.crm_manager_has_section('performance'));
