-- Add role-specific website application details without changing or deleting existing candidates.
alter table public.crm_recruitment_applications
  add column if not exists role_slug text,
  add column if not exists application_data jsonb not null default '{}'::jsonb;

update public.crm_recruitment_applications set status = 'Under Review' where status = 'Reviewing';
update public.crm_recruitment_applications set status = 'Shortlisted' where status = 'Next Round';
update public.crm_recruitment_communications set message_type = 'Shortlisted' where message_type = 'Next Round';

alter table public.crm_recruitment_applications drop constraint if exists crm_recruitment_applications_status_check;
alter table public.crm_recruitment_applications add constraint crm_recruitment_applications_status_check
  check (status in ('New','Under Review','Shortlisted','Interview Scheduled','Selected','Rejected'));

alter table public.crm_recruitment_communications drop constraint if exists crm_recruitment_communications_message_type_check;
alter table public.crm_recruitment_communications add constraint crm_recruitment_communications_message_type_check
  check (message_type in ('Interview Scheduled','Shortlisted','Selected','Rejected','Rescheduled'));

create index if not exists crm_recruitment_applications_role_idx on public.crm_recruitment_applications(role_slug, applied_at desc);
