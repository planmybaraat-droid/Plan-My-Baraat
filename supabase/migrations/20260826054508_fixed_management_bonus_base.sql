-- Management bonus is always calculated from a fixed Rs. 3,000 base.
-- The earned performance incentive remains independent from this amount.

alter table public.crm_incentive_config
  add column if not exists management_bonus_base_amount numeric(12,2)
  not null default 3000;

update public.crm_incentive_config
set management_bonus_base_amount = 3000,
    updated_at = now()
where id = 1;

alter table public.crm_incentive_config
  drop constraint if exists crm_incentive_management_bonus_base_check;

alter table public.crm_incentive_config
  add constraint crm_incentive_management_bonus_base_check
  check (management_bonus_base_amount = 3000);

alter table public.crm_incentive_snapshots
  add column if not exists management_bonus_base_amount numeric(12,2)
  not null default 3000;

update public.crm_incentive_snapshots
set management_bonus_base_amount = 3000,
    management_bonus_amount = round((3000 * management_bonus_percent) / 100, 2),
    incentive_amount = base_incentive_amount +
      round((3000 * management_bonus_percent) / 100, 2)
where status <> 'Paid';

alter table public.crm_incentive_snapshots
  drop constraint if exists crm_incentive_snapshot_bonus_base_check;

alter table public.crm_incentive_snapshots
  add constraint crm_incentive_snapshot_bonus_base_check
  check (management_bonus_base_amount = 3000);

comment on column public.crm_incentive_config.management_bonus_base_amount is
  'Fixed Rs. 3,000 base used for the discretionary 0-25 percent management bonus.';

comment on column public.crm_incentive_snapshots.management_bonus_base_amount is
  'Bonus calculation base captured when the incentive snapshot is approved.';
