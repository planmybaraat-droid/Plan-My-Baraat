-- Recruitment query/index hardening and consolidated RLS policies.
-- This migration is data-preserving: it only adds indexes and replaces
-- overlapping permissive policies with equivalent per-action policies.

create index if not exists crm_recruitment_activity_interview_idx
  on public.crm_recruitment_activity(interview_id);
create index if not exists crm_recruitment_activity_job_idx
  on public.crm_recruitment_activity(job_id);
create index if not exists crm_recruitment_activity_performed_by_idx
  on public.crm_recruitment_activity(performed_by);
create index if not exists crm_recruitment_candidates_created_by_idx
  on public.crm_recruitment_candidates(created_by);
create index if not exists crm_recruitment_candidates_linked_staff_idx
  on public.crm_recruitment_candidates(linked_staff_id);
create index if not exists crm_recruitment_candidates_updated_by_idx
  on public.crm_recruitment_candidates(updated_by);
create index if not exists crm_recruitment_communications_candidate_idx
  on public.crm_recruitment_communications(candidate_id);
create index if not exists crm_recruitment_communications_interview_idx
  on public.crm_recruitment_communications(interview_id);
create index if not exists crm_recruitment_communications_sent_by_idx
  on public.crm_recruitment_communications(sent_by);
create index if not exists crm_recruitment_feedback_candidate_idx
  on public.crm_recruitment_feedback(candidate_id);
create index if not exists crm_recruitment_feedback_interviewer_idx
  on public.crm_recruitment_feedback(interviewer_id);
create index if not exists crm_recruitment_feedback_job_idx
  on public.crm_recruitment_feedback(job_id);
create index if not exists crm_recruitment_interviews_created_by_idx
  on public.crm_recruitment_interviews(created_by);
create index if not exists crm_recruitment_interviews_job_idx
  on public.crm_recruitment_interviews(job_id);
create index if not exists crm_recruitment_interviews_updated_by_idx
  on public.crm_recruitment_interviews(updated_by);
create index if not exists crm_recruitment_jobs_created_by_idx
  on public.crm_recruitment_jobs(created_by);
create index if not exists crm_recruitment_jobs_updated_by_idx
  on public.crm_recruitment_jobs(updated_by);
create index if not exists crm_recruitment_notes_candidate_idx
  on public.crm_recruitment_notes(candidate_id);
create index if not exists crm_recruitment_notes_created_by_idx
  on public.crm_recruitment_notes(created_by);
create index if not exists crm_recruitment_resumes_candidate_idx
  on public.crm_recruitment_resumes(candidate_id);
create index if not exists crm_recruitment_resumes_uploaded_by_idx
  on public.crm_recruitment_resumes(uploaded_by);

drop policy if exists "Recruitment jobs readable by recruitment users" on public.crm_recruitment_jobs;
drop policy if exists "Recruitment jobs managed by recruitment admins" on public.crm_recruitment_jobs;
create policy "Recruitment jobs readable by authorized users"
  on public.crm_recruitment_jobs for select to authenticated
  using (public.crm_has_recruitment_admin_access() or public.crm_has_recruitment_workspace_access());
create policy "Recruitment jobs inserted by recruitment admins"
  on public.crm_recruitment_jobs for insert to authenticated
  with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment jobs updated by recruitment admins"
  on public.crm_recruitment_jobs for update to authenticated
  using (public.crm_has_recruitment_admin_access())
  with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment jobs deleted by recruitment admins"
  on public.crm_recruitment_jobs for delete to authenticated
  using (public.crm_has_recruitment_admin_access());

drop policy if exists "Recruitment candidates selectively readable" on public.crm_recruitment_candidates;
drop policy if exists "Recruitment candidates managed by recruitment admins" on public.crm_recruitment_candidates;
create policy "Recruitment candidates readable by authorized users"
  on public.crm_recruitment_candidates for select to authenticated
  using (public.crm_recruitment_candidate_visible(id));
create policy "Recruitment candidates inserted by recruitment admins"
  on public.crm_recruitment_candidates for insert to authenticated
  with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment candidates updated by recruitment admins"
  on public.crm_recruitment_candidates for update to authenticated
  using (public.crm_has_recruitment_admin_access())
  with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment candidates deleted by recruitment admins"
  on public.crm_recruitment_candidates for delete to authenticated
  using (public.crm_has_recruitment_admin_access());

drop policy if exists "Recruitment resumes selectively readable" on public.crm_recruitment_resumes;
drop policy if exists "Recruitment resumes managed by recruitment admins" on public.crm_recruitment_resumes;
create policy "Recruitment resumes readable by authorized users"
  on public.crm_recruitment_resumes for select to authenticated
  using (public.crm_recruitment_candidate_visible(candidate_id));
create policy "Recruitment resumes inserted by recruitment admins"
  on public.crm_recruitment_resumes for insert to authenticated
  with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment resumes updated by recruitment admins"
  on public.crm_recruitment_resumes for update to authenticated
  using (public.crm_has_recruitment_admin_access())
  with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment resumes deleted by recruitment admins"
  on public.crm_recruitment_resumes for delete to authenticated
  using (public.crm_has_recruitment_admin_access());

drop policy if exists "Recruitment interviews selectively readable" on public.crm_recruitment_interviews;
drop policy if exists "Recruitment interviews managed by recruitment admins" on public.crm_recruitment_interviews;
drop policy if exists "Interviewers may update assigned interviews" on public.crm_recruitment_interviews;
create policy "Recruitment interviews readable by authorized users"
  on public.crm_recruitment_interviews for select to authenticated
  using (
    public.crm_has_recruitment_admin_access()
    or (public.crm_has_recruitment_workspace_access() and interviewer_id = (select auth.uid()))
  );
create policy "Recruitment interviews inserted by recruitment admins"
  on public.crm_recruitment_interviews for insert to authenticated
  with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment interviews updated by authorized users"
  on public.crm_recruitment_interviews for update to authenticated
  using (
    public.crm_has_recruitment_admin_access()
    or (public.crm_has_recruitment_workspace_access() and interviewer_id = (select auth.uid()))
  )
  with check (
    public.crm_has_recruitment_admin_access()
    or (public.crm_has_recruitment_workspace_access() and interviewer_id = (select auth.uid()))
  );
create policy "Recruitment interviews deleted by recruitment admins"
  on public.crm_recruitment_interviews for delete to authenticated
  using (public.crm_has_recruitment_admin_access());

drop policy if exists "Recruitment feedback readable by candidate viewers" on public.crm_recruitment_feedback;
drop policy if exists "Interviewers submit own feedback" on public.crm_recruitment_feedback;
drop policy if exists "Interviewers edit own feedback" on public.crm_recruitment_feedback;
drop policy if exists "Recruitment feedback managed by recruitment admins" on public.crm_recruitment_feedback;
create policy "Recruitment feedback readable by authorized users"
  on public.crm_recruitment_feedback for select to authenticated
  using (public.crm_has_recruitment_admin_access() or public.crm_recruitment_candidate_visible(candidate_id));
create policy "Recruitment feedback inserted by authorized users"
  on public.crm_recruitment_feedback for insert to authenticated
  with check (
    public.crm_has_recruitment_admin_access()
    or (
      public.crm_has_recruitment_workspace_access()
      and interviewer_id = (select auth.uid())
      and exists (
        select 1 from public.crm_recruitment_interviews i
        where i.id = interview_id and i.interviewer_id = (select auth.uid())
      )
    )
  );
create policy "Recruitment feedback updated by authorized users"
  on public.crm_recruitment_feedback for update to authenticated
  using (
    public.crm_has_recruitment_admin_access()
    or (public.crm_has_recruitment_workspace_access() and interviewer_id = (select auth.uid()))
  )
  with check (
    public.crm_has_recruitment_admin_access()
    or (public.crm_has_recruitment_workspace_access() and interviewer_id = (select auth.uid()))
  );
create policy "Recruitment feedback deleted by recruitment admins"
  on public.crm_recruitment_feedback for delete to authenticated
  using (public.crm_has_recruitment_admin_access());

drop policy if exists "Recruitment communications readable by recruitment admins" on public.crm_recruitment_communications;
drop policy if exists "Recruitment notes readable by recruitment admins" on public.crm_recruitment_notes;
drop policy if exists "Recruitment reminders readable by recruitment admins" on public.crm_recruitment_reminders;

drop policy if exists "Recruitment activity selectively readable" on public.crm_recruitment_activity;
drop policy if exists "Recruitment activity managed by recruitment admins" on public.crm_recruitment_activity;
create policy "Recruitment activity readable by authorized users"
  on public.crm_recruitment_activity for select to authenticated
  using (
    public.crm_has_recruitment_admin_access()
    or (candidate_id is not null and public.crm_recruitment_candidate_visible(candidate_id))
  );
create policy "Recruitment activity inserted by recruitment admins"
  on public.crm_recruitment_activity for insert to authenticated
  with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment activity updated by recruitment admins"
  on public.crm_recruitment_activity for update to authenticated
  using (public.crm_has_recruitment_admin_access())
  with check (public.crm_has_recruitment_admin_access());
create policy "Recruitment activity deleted by recruitment admins"
  on public.crm_recruitment_activity for delete to authenticated
  using (public.crm_has_recruitment_admin_access());
