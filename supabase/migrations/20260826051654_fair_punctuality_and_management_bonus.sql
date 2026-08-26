-- Fair punctuality scoring and an optional management-awarded incentive bonus.
-- Existing approved snapshots remain financially unchanged after the backfill.

alter table public.crm_incentive_config
  alter column late_grace_minutes set default 10;

update public.crm_incentive_config
set late_grace_minutes = 10,
    updated_at = now()
where id = 1
  and late_grace_minutes = 0;

alter table public.crm_incentive_snapshots
  add column if not exists base_incentive_amount numeric(12,2),
  add column if not exists management_bonus_percent numeric(5,2) not null default 0,
  add column if not exists management_bonus_amount numeric(12,2) not null default 0;

update public.crm_incentive_snapshots
set base_incentive_amount = incentive_amount
where base_incentive_amount is null;

alter table public.crm_incentive_snapshots
  alter column base_incentive_amount set not null;

alter table public.crm_incentive_snapshots
  drop constraint if exists crm_incentive_management_bonus_percent_check;

alter table public.crm_incentive_snapshots
  add constraint crm_incentive_management_bonus_percent_check
  check (management_bonus_percent between 0 and 25);

alter table public.crm_incentive_snapshots
  drop constraint if exists crm_incentive_base_amount_check;

alter table public.crm_incentive_snapshots
  add constraint crm_incentive_base_amount_check
  check (base_incentive_amount >= 0);

alter table public.crm_incentive_snapshots
  drop constraint if exists crm_incentive_management_bonus_amount_check;

alter table public.crm_incentive_snapshots
  add constraint crm_incentive_management_bonus_amount_check
  check (management_bonus_amount >= 0);

comment on column public.crm_incentive_snapshots.management_bonus_percent is
  'Discretionary percentage from 0 to 25 awarded by an authorized admin or manager.';
