-- Remove the Recruitment & Interview Management module.
-- The associated tables and storage bucket were confirmed empty before this
-- migration was created. No unrelated CRM schema or data is touched.

begin;

-- Remove stale access flags so Manage Access JSON stays clean.
update public.crm_users
set
  module_access = coalesce(module_access, '{}'::jsonb) - 'recruitment',
  crm_section_access = coalesce(crm_section_access, '{}'::jsonb) - 'recruitment'
where
  coalesce(module_access, '{}'::jsonb) ? 'recruitment'
  or coalesce(crm_section_access, '{}'::jsonb) ? 'recruitment';

-- Storage policies must be removed before their helper functions. The bucket
-- is already empty; bucket deletion itself must go through Supabase Storage
-- API rather than direct SQL, so the empty private bucket is left inert.
drop policy if exists "Recruitment files readable by authorized users" on storage.objects;
drop policy if exists "Recruitment files uploaded by recruitment admins" on storage.objects;
drop policy if exists "Recruitment files updated by recruitment admins" on storage.objects;
drop policy if exists "Recruitment files deleted by recruitment admins" on storage.objects;

-- Drop child tables first to keep the removal explicit and predictable.
drop table if exists public.crm_recruitment_reminders;
drop table if exists public.crm_recruitment_feedback;
drop table if exists public.crm_recruitment_communications;
drop table if exists public.crm_recruitment_notes;
drop table if exists public.crm_recruitment_resumes;
drop table if exists public.crm_recruitment_activity;
drop table if exists public.crm_recruitment_interviews;
drop table if exists public.crm_recruitment_candidates;
drop table if exists public.crm_recruitment_jobs;

drop function if exists public.crm_recruitment_sync_reminders();
drop function if exists public.crm_recruitment_candidate_visible(uuid);
drop function if exists public.crm_recruitment_touch_updated_at();
drop function if exists public.crm_has_recruitment_workspace_access();
drop function if exists public.crm_has_recruitment_admin_access();

commit;
