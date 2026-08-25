create index if not exists crm_incentive_config_updated_by_idx on public.crm_incentive_config(updated_by);
create index if not exists crm_incentive_snapshots_approved_by_idx on public.crm_incentive_snapshots(approved_by);

drop policy if exists "Authenticated users read incentive rules" on public.crm_incentive_config;
create policy "Authenticated users read incentive rules" on public.crm_incentive_config
for select to authenticated using ((select auth.uid()) is not null);

drop policy if exists "Performance snapshots visible to authorized users" on public.crm_incentive_snapshots;
create policy "Performance snapshots visible to authorized users" on public.crm_incentive_snapshots
for select to authenticated using (
  public.is_crm_admin()
  or public.crm_manager_has_section('performance')
  or exists (select 1 from public.crm_staff s where s.id = staff_id and s.user_id = (select auth.uid()))
);

drop policy if exists "Performance admins create snapshots" on public.crm_incentive_snapshots;
create policy "Performance admins create snapshots" on public.crm_incentive_snapshots
for insert to authenticated with check (
  (public.is_crm_admin() or public.crm_manager_has_section('performance'))
  and approved_by = (select auth.uid())
);
