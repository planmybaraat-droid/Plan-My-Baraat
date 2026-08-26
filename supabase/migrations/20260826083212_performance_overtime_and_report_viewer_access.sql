-- Authorized performance managers can inspect the submitted activity items
-- that are already visible to admins and the report owner.

drop policy if exists "Performance managers read daily report items"
  on public.crm_daily_work_report_items;

create policy "Performance managers read daily report items"
on public.crm_daily_work_report_items
for select
to authenticated
using (
  public.crm_manager_has_section('performance')
  and exists (
    select 1
    from public.crm_daily_work_reports report
    where report.id = report_id
  )
);

grant select on public.crm_daily_work_report_items to authenticated;
