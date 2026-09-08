-- Candidate-selected interview times. Existing recruitment records stay intact.
begin;
alter table public.crm_recruitment_applications
  add column if not exists scheduling_token uuid,
  add column if not exists scheduling_expires_at timestamptz;
create unique index if not exists crm_recruitment_applications_scheduling_token_idx on public.crm_recruitment_applications(scheduling_token) where scheduling_token is not null;
create index if not exists crm_recruitment_interviews_scheduled_at_idx on public.crm_recruitment_interviews(scheduled_at);
commit;
