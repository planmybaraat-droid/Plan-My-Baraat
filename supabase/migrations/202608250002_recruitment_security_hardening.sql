-- Follow-up hardening from Supabase Security Advisor.
alter function public.crm_has_recruitment_admin_access() security invoker;
alter function public.crm_has_recruitment_workspace_access() security invoker;
alter function public.crm_recruitment_candidate_visible(uuid) security invoker;
revoke all on function public.crm_has_recruitment_admin_access() from anon;
revoke all on function public.crm_has_recruitment_workspace_access() from anon;
revoke all on function public.crm_recruitment_candidate_visible(uuid) from anon;
revoke all on function public.crm_recruitment_sync_reminders() from public, anon, authenticated;
