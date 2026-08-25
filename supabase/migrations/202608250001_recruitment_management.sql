-- Complete, additive Recruitment & Interview Management module.
-- This migration does not alter or remove existing CRM data.

create extension if not exists pgcrypto;

create or replace function public.crm_has_recruitment_admin_access()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.crm_users u
    where u.id = (select auth.uid())
      and u.is_active = true
      and (
        u.role in ('admin', 'super_admin')
        or (u.role = 'manager' and coalesce((u.crm_section_access ->> 'recruitment')::boolean, false))
      )
  );
$$;

create or replace function public.crm_has_recruitment_workspace_access()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.crm_users u
    where u.id = (select auth.uid())
      and u.is_active = true
      and coalesce((u.module_access ->> 'recruitment')::boolean, false)
  );
$$;

revoke all on function public.crm_has_recruitment_admin_access() from public;
revoke all on function public.crm_has_recruitment_workspace_access() from public;
grant execute on function public.crm_has_recruitment_admin_access() to authenticated;
grant execute on function public.crm_has_recruitment_workspace_access() to authenticated;

create table if not exists public.crm_recruitment_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null,
  openings integer not null default 1 check (openings > 0),
  job_type text not null default 'Full Time' check (job_type in ('Full Time','Part Time','Contract','Intern','Temporary')),
  location text,
  experience_required text,
  salary_range text,
  description text,
  required_skills text[] not null default '{}',
  application_deadline date,
  status text not null default 'Draft' check (status in ('Draft','Open','On Hold','Closed')),
  created_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_recruitment_candidates (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.crm_recruitment_jobs(id) on delete set null,
  full_name text not null,
  phone text not null,
  email text,
  location text,
  position_applied text not null,
  experience_years numeric(5,2) not null default 0 check (experience_years >= 0),
  current_company text,
  current_salary numeric(14,2),
  expected_salary numeric(14,2),
  notice_period text,
  skills text[] not null default '{}',
  source text not null default 'Other' check (source in ('Walk-in','Referral','LinkedIn','Naukri','Indeed','WhatsApp','Website','Other')),
  application_date date not null default current_date,
  status text not null default 'Applied' check (status in ('Applied','Under Review','Shortlisted','Interview Scheduled','Interview Completed','Next Round','Selected','Offer Sent','Joined','Rejected','On Hold','No Show','Withdrawn')),
  final_decision text check (final_decision is null or final_decision in ('Selected','Rejected','On Hold','Withdrawn')),
  linked_staff_id uuid references public.crm_staff(id) on delete set null,
  created_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_recruitment_resumes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.crm_recruitment_candidates(id) on delete cascade,
  file_name text not null,
  storage_path text not null unique,
  mime_type text not null,
  file_size bigint not null default 0 check (file_size >= 0),
  is_active boolean not null default true,
  uploaded_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  uploaded_at timestamptz not null default now()
);

create table if not exists public.crm_recruitment_interviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.crm_recruitment_candidates(id) on delete cascade,
  job_id uuid references public.crm_recruitment_jobs(id) on delete set null,
  round_number integer not null default 1 check (round_number > 0),
  round_name text not null default 'HR Interview',
  interviewer_id uuid references public.crm_users(id) on delete set null,
  starts_at timestamptz not null,
  duration_minutes integer not null default 45 check (duration_minutes between 10 and 480),
  interview_type text not null default 'In Person' check (interview_type in ('In Person','Phone Call','Video Call')),
  location text,
  meeting_link text,
  notes text,
  status text not null default 'Pending Confirmation' check (status in ('Scheduled','Pending Confirmation','Confirmed','Reschedule Requested','Completed','Cancelled','No Show')),
  reminder_24h boolean not null default true,
  reminder_1h boolean not null default true,
  created_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_recruitment_feedback (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.crm_recruitment_interviews(id) on delete cascade,
  candidate_id uuid not null references public.crm_recruitment_candidates(id) on delete cascade,
  job_id uuid references public.crm_recruitment_jobs(id) on delete set null,
  interviewer_id uuid not null references public.crm_users(id) on delete restrict default auth.uid(),
  communication_rating smallint not null check (communication_rating between 1 and 5),
  technical_rating smallint not null check (technical_rating between 1 and 5),
  experience_rating smallint not null check (experience_rating between 1 and 5),
  problem_solving_rating smallint not null check (problem_solving_rating between 1 and 5),
  confidence_rating smallint not null check (confidence_rating between 1 and 5),
  culture_fit_rating smallint not null check (culture_fit_rating between 1 and 5),
  overall_rating numeric(3,2) not null check (overall_rating between 1 and 5),
  recommendation text not null check (recommendation in ('Strongly Hire','Hire','Hold','Reject')),
  comments text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (interview_id, interviewer_id)
);

create table if not exists public.crm_recruitment_communications (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.crm_recruitment_candidates(id) on delete cascade,
  interview_id uuid references public.crm_recruitment_interviews(id) on delete set null,
  message_type text not null,
  channel text not null check (channel in ('WhatsApp','Email','Both')),
  subject text,
  content text not null,
  delivery_status text not null default 'Draft' check (delivery_status in ('Draft','Queued','Sent','Delivered','Failed')),
  provider_reference text,
  failure_error text,
  sent_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_recruitment_notes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.crm_recruitment_candidates(id) on delete cascade,
  content text not null check (length(trim(content)) > 0),
  created_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.crm_recruitment_activity (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.crm_recruitment_candidates(id) on delete cascade,
  job_id uuid references public.crm_recruitment_jobs(id) on delete cascade,
  interview_id uuid references public.crm_recruitment_interviews(id) on delete cascade,
  action text not null,
  details jsonb not null default '{}',
  performed_by uuid references public.crm_users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  check (candidate_id is not null or job_id is not null)
);

create table if not exists public.crm_recruitment_reminders (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references public.crm_recruitment_interviews(id) on delete cascade,
  reminder_type text not null check (reminder_type in ('24 hours','1 hour','Custom')),
  scheduled_at timestamptz not null,
  channel text not null default 'Both' check (channel in ('WhatsApp','Email','Both')),
  status text not null default 'Pending' check (status in ('Pending','Queued','Sent','Failed','Cancelled')),
  attempt_count integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  unique (interview_id, reminder_type)
);

create index if not exists crm_recruitment_jobs_status_idx on public.crm_recruitment_jobs(status);
create index if not exists crm_recruitment_candidates_job_idx on public.crm_recruitment_candidates(job_id);
create index if not exists crm_recruitment_candidates_status_idx on public.crm_recruitment_candidates(status);
create index if not exists crm_recruitment_candidates_applied_idx on public.crm_recruitment_candidates(application_date desc);
create index if not exists crm_recruitment_candidates_search_idx on public.crm_recruitment_candidates(lower(full_name), lower(coalesce(email,'')), phone);
create index if not exists crm_recruitment_interviews_candidate_idx on public.crm_recruitment_interviews(candidate_id);
create index if not exists crm_recruitment_interviews_interviewer_idx on public.crm_recruitment_interviews(interviewer_id, starts_at);
create index if not exists crm_recruitment_interviews_starts_idx on public.crm_recruitment_interviews(starts_at);
create index if not exists crm_recruitment_activity_candidate_idx on public.crm_recruitment_activity(candidate_id, created_at desc);

create or replace function public.crm_recruitment_touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists crm_recruitment_jobs_touch on public.crm_recruitment_jobs;
create trigger crm_recruitment_jobs_touch before update on public.crm_recruitment_jobs for each row execute function public.crm_recruitment_touch_updated_at();
drop trigger if exists crm_recruitment_candidates_touch on public.crm_recruitment_candidates;
create trigger crm_recruitment_candidates_touch before update on public.crm_recruitment_candidates for each row execute function public.crm_recruitment_touch_updated_at();
drop trigger if exists crm_recruitment_interviews_touch on public.crm_recruitment_interviews;
create trigger crm_recruitment_interviews_touch before update on public.crm_recruitment_interviews for each row execute function public.crm_recruitment_touch_updated_at();
drop trigger if exists crm_recruitment_feedback_touch on public.crm_recruitment_feedback;
create trigger crm_recruitment_feedback_touch before update on public.crm_recruitment_feedback for each row execute function public.crm_recruitment_touch_updated_at();

create or replace function public.crm_recruitment_candidate_visible(p_candidate uuid)
returns boolean language sql stable security invoker set search_path = public as $$
  select public.crm_has_recruitment_admin_access()
    or (public.crm_has_recruitment_workspace_access() and exists (
      select 1 from public.crm_recruitment_interviews i
      where i.candidate_id = p_candidate and i.interviewer_id = (select auth.uid())
    ));
$$;
revoke all on function public.crm_recruitment_candidate_visible(uuid) from public;
grant execute on function public.crm_recruitment_candidate_visible(uuid) to authenticated;

alter table public.crm_recruitment_jobs enable row level security;
alter table public.crm_recruitment_candidates enable row level security;
alter table public.crm_recruitment_resumes enable row level security;
alter table public.crm_recruitment_interviews enable row level security;
alter table public.crm_recruitment_feedback enable row level security;
alter table public.crm_recruitment_communications enable row level security;
alter table public.crm_recruitment_notes enable row level security;
alter table public.crm_recruitment_activity enable row level security;
alter table public.crm_recruitment_reminders enable row level security;

create policy "Recruitment jobs readable by recruitment users" on public.crm_recruitment_jobs for select to authenticated using (public.crm_has_recruitment_admin_access() or public.crm_has_recruitment_workspace_access());
create policy "Recruitment jobs managed by recruitment admins" on public.crm_recruitment_jobs for all to authenticated using (public.crm_has_recruitment_admin_access()) with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment candidates selectively readable" on public.crm_recruitment_candidates for select to authenticated using (public.crm_recruitment_candidate_visible(id));
create policy "Recruitment candidates managed by recruitment admins" on public.crm_recruitment_candidates for all to authenticated using (public.crm_has_recruitment_admin_access()) with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment resumes selectively readable" on public.crm_recruitment_resumes for select to authenticated using (public.crm_recruitment_candidate_visible(candidate_id));
create policy "Recruitment resumes managed by recruitment admins" on public.crm_recruitment_resumes for all to authenticated using (public.crm_has_recruitment_admin_access()) with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment interviews selectively readable" on public.crm_recruitment_interviews for select to authenticated using (public.crm_has_recruitment_admin_access() or (public.crm_has_recruitment_workspace_access() and interviewer_id = (select auth.uid())));
create policy "Recruitment interviews managed by recruitment admins" on public.crm_recruitment_interviews for all to authenticated using (public.crm_has_recruitment_admin_access()) with check (public.crm_has_recruitment_admin_access());
create policy "Interviewers may update assigned interviews" on public.crm_recruitment_interviews for update to authenticated using (public.crm_has_recruitment_workspace_access() and interviewer_id = (select auth.uid())) with check (public.crm_has_recruitment_workspace_access() and interviewer_id = (select auth.uid()));
create policy "Recruitment feedback readable by candidate viewers" on public.crm_recruitment_feedback for select to authenticated using (public.crm_recruitment_candidate_visible(candidate_id));
create policy "Interviewers submit own feedback" on public.crm_recruitment_feedback for insert to authenticated with check (public.crm_has_recruitment_workspace_access() and interviewer_id = (select auth.uid()) and exists (select 1 from public.crm_recruitment_interviews i where i.id = interview_id and i.interviewer_id = (select auth.uid())));
create policy "Interviewers edit own feedback" on public.crm_recruitment_feedback for update to authenticated using (interviewer_id = (select auth.uid()) and public.crm_has_recruitment_workspace_access()) with check (interviewer_id = (select auth.uid()) and public.crm_has_recruitment_workspace_access());
create policy "Recruitment feedback managed by recruitment admins" on public.crm_recruitment_feedback for all to authenticated using (public.crm_has_recruitment_admin_access()) with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment communications readable by recruitment admins" on public.crm_recruitment_communications for select to authenticated using (public.crm_has_recruitment_admin_access());
create policy "Recruitment communications managed by recruitment admins" on public.crm_recruitment_communications for all to authenticated using (public.crm_has_recruitment_admin_access()) with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment notes readable by recruitment admins" on public.crm_recruitment_notes for select to authenticated using (public.crm_has_recruitment_admin_access());
create policy "Recruitment notes managed by recruitment admins" on public.crm_recruitment_notes for all to authenticated using (public.crm_has_recruitment_admin_access()) with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment activity selectively readable" on public.crm_recruitment_activity for select to authenticated using (public.crm_has_recruitment_admin_access() or (candidate_id is not null and public.crm_recruitment_candidate_visible(candidate_id)));
create policy "Recruitment activity managed by recruitment admins" on public.crm_recruitment_activity for all to authenticated using (public.crm_has_recruitment_admin_access()) with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment reminders readable by recruitment admins" on public.crm_recruitment_reminders for select to authenticated using (public.crm_has_recruitment_admin_access());
create policy "Recruitment reminders managed by recruitment admins" on public.crm_recruitment_reminders for all to authenticated using (public.crm_has_recruitment_admin_access()) with check (public.crm_has_recruitment_admin_access());

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.crm_recruitment_jobs, public.crm_recruitment_candidates, public.crm_recruitment_resumes,
  public.crm_recruitment_interviews, public.crm_recruitment_feedback, public.crm_recruitment_communications,
  public.crm_recruitment_notes, public.crm_recruitment_activity, public.crm_recruitment_reminders to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('recruitment-files', 'recruitment-files', false, 10485760, array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Recruitment files readable by authorized users" on storage.objects for select to authenticated
using (bucket_id = 'recruitment-files' and (
  public.crm_has_recruitment_admin_access()
  or (public.crm_has_recruitment_workspace_access() and public.crm_recruitment_candidate_visible((storage.foldername(name))[1]::uuid))
));
create policy "Recruitment files uploaded by recruitment admins" on storage.objects for insert to authenticated
with check (bucket_id = 'recruitment-files' and public.crm_has_recruitment_admin_access());
create policy "Recruitment files updated by recruitment admins" on storage.objects for update to authenticated
using (bucket_id = 'recruitment-files' and public.crm_has_recruitment_admin_access())
with check (bucket_id = 'recruitment-files' and public.crm_has_recruitment_admin_access());
create policy "Recruitment files deleted by recruitment admins" on storage.objects for delete to authenticated
using (bucket_id = 'recruitment-files' and public.crm_has_recruitment_admin_access());

-- Produce reminder rows whenever a recruiter schedules/reschedules an interview.
create or replace function public.crm_recruitment_sync_reminders()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.reminder_24h and new.starts_at > now() + interval '24 hours' then
    insert into public.crm_recruitment_reminders(interview_id, reminder_type, scheduled_at)
    values (new.id, '24 hours', new.starts_at - interval '24 hours')
    on conflict (interview_id, reminder_type) do update set scheduled_at = excluded.scheduled_at, status = 'Pending';
  else
    delete from public.crm_recruitment_reminders where interview_id = new.id and reminder_type = '24 hours';
  end if;
  if new.reminder_1h and new.starts_at > now() + interval '1 hour' then
    insert into public.crm_recruitment_reminders(interview_id, reminder_type, scheduled_at)
    values (new.id, '1 hour', new.starts_at - interval '1 hour')
    on conflict (interview_id, reminder_type) do update set scheduled_at = excluded.scheduled_at, status = 'Pending';
  else
    delete from public.crm_recruitment_reminders where interview_id = new.id and reminder_type = '1 hour';
  end if;
  return new;
end;
$$;
revoke all on function public.crm_recruitment_sync_reminders() from public, anon, authenticated;
drop trigger if exists crm_recruitment_interview_reminders on public.crm_recruitment_interviews;
create trigger crm_recruitment_interview_reminders after insert or update of starts_at, reminder_24h, reminder_1h on public.crm_recruitment_interviews for each row execute function public.crm_recruitment_sync_reminders();
