-- Holiday work and auditable late-arrival explanations.
-- Additive only: raw punch times remain unchanged and approvals affect scoring only.

alter table public.crm_attendance
  add column if not exists late_minutes_at_punch_in integer not null default 0,
  add column if not exists late_reason text,
  add column if not exists late_reason_status text,
  add column if not exists late_reason_review_note text,
  add column if not exists late_reason_reviewed_by uuid references public.crm_users(id) on delete set null,
  add column if not exists late_reason_reviewed_at timestamptz;

alter table public.crm_attendance
  drop constraint if exists crm_attendance_late_minutes_check;
alter table public.crm_attendance
  add constraint crm_attendance_late_minutes_check
  check (late_minutes_at_punch_in >= 0);

alter table public.crm_attendance
  drop constraint if exists crm_attendance_late_reason_status_check;
alter table public.crm_attendance
  add constraint crm_attendance_late_reason_status_check
  check (late_reason_status is null or late_reason_status = any (array['Pending','Approved','Rejected']::text[]));

create index if not exists crm_attendance_pending_late_reason_idx
  on public.crm_attendance(attendance_date desc, staff_id)
  where late_reason_status = 'Pending';

create or replace function public.crm_get_my_punch_in_requirements()
returns jsonb
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  v_staff public.crm_staff;
  v_settings public.crm_attendance_settings;
  v_now timestamptz := now();
  v_local_now timestamp;
  v_date date;
  v_shift_start timestamp;
  v_late_minutes integer := 0;
  v_holiday boolean := false;
begin
  select * into v_staff from public.crm_staff
  where user_id=auth.uid() and status='Active' limit 1;
  if v_staff.id is null then raise exception 'No active staff profile.'; end if;
  select * into v_settings from public.crm_attendance_settings where id=1;
  v_date := public.crm_attendance_business_date(v_now);
  v_local_now := v_now at time zone v_settings.business_timezone;
  v_shift_start := v_date::timestamp + v_staff.shift_start;
  v_holiday := exists (
    select 1 from public.crm_company_holidays h where h.holiday_date=v_date
  );
  if not v_holiday then
    v_late_minutes := greatest(0, floor(extract(epoch from (v_local_now-v_shift_start))/60)::integer);
  end if;
  return jsonb_build_object(
    'attendance_date',v_date,
    'is_company_holiday',v_holiday,
    'late_minutes',v_late_minutes,
    'requires_late_reason',v_late_minutes>0
  );
end;
$$;

create or replace function public.crm_punch_in_with_late_reason(
  p_selfie_url text,
  p_late_reason text default null,
  p_device text default null,
  p_browser text default null,
  p_ip text default null
)
returns public.crm_attendance
language plpgsql
security definer
set search_path=public
as $$
declare
  s public.crm_staff;
  r public.crm_attendance;
  v_settings public.crm_attendance_settings;
  v_date date;
  v_now timestamptz := now();
  v_local_now timestamp;
  v_local_time time;
  v_shift_start timestamp;
  v_late_minutes integer := 0;
  v_holiday boolean := false;
  v_reason text := nullif(btrim(coalesce(p_late_reason,'')),'');
begin
  select * into s from public.crm_staff where user_id=auth.uid() and status='Active' limit 1;
  if s.id is null then raise exception 'No active staff profile.'; end if;
  select * into v_settings from public.crm_attendance_settings where id=1;
  v_date := public.crm_attendance_business_date(v_now);
  v_local_now := v_now at time zone v_settings.business_timezone;
  v_local_time := v_local_now::time;
  v_shift_start := v_date::timestamp + s.shift_start;
  v_holiday := exists (
    select 1 from public.crm_company_holidays h where h.holiday_date=v_date
  );
  if not v_holiday then
    v_late_minutes := greatest(0, floor(extract(epoch from (v_local_now-v_shift_start))/60)::integer);
  end if;
  if v_late_minutes>0 and coalesce(length(v_reason),0)<3 then
    raise exception 'Please enter why you are late before punching in.';
  end if;

  perform pg_advisory_xact_lock(hashtext('attendance-'||s.id::text||'-'||v_date::text));
  if public.crm_attendance_is_locked(v_date,v_now) then
    raise exception 'Attendance for % is locked.',v_date;
  end if;
  if exists(
    select 1 from public.crm_leave_requests l
    where l.staff_id=s.id and l.status='Approved' and v_date between l.from_date and l.to_date
  ) then
    raise exception 'You have approved leave for this attendance date.';
  end if;
  select * into r from public.crm_attendance
  where staff_id=s.id and attendance_date=v_date
  order by created_at desc limit 1;
  if r.id is not null and r.check_in is not null then
    if r.check_out is null then raise exception 'Attendance is already punched in.';
    else raise exception 'Attendance is already completed for this business date.'; end if;
  end if;

  if r.id is null then
    insert into public.crm_attendance(
      created_by,staff_id,attendance_date,status,check_in,punch_in_at,
      punch_in_selfie_url,punch_in_device,punch_in_browser,punch_in_ip,
      late_minutes_at_punch_in,late_reason,late_reason_status
    ) values (
      auth.uid(),s.id,v_date,'Present',v_local_time,v_now,
      p_selfie_url,p_device,p_browser,nullif(p_ip,'')::inet,
      v_late_minutes,v_reason,case when v_late_minutes>0 then 'Pending' else null end
    ) returning * into r;
  else
    if r.status = any (array['On Leave','Weekly Off']::text[]) then
      raise exception 'Attendance is not available for this business date.';
    end if;
    update public.crm_attendance set
      status='Present',check_in=v_local_time,punch_in_at=v_now,
      punch_in_selfie_url=p_selfie_url,punch_in_device=p_device,
      punch_in_browser=p_browser,punch_in_ip=nullif(p_ip,'')::inet,
      late_minutes_at_punch_in=v_late_minutes,late_reason=v_reason,
      late_reason_status=case when v_late_minutes>0 then 'Pending' else null end,
      late_reason_review_note=null,late_reason_reviewed_by=null,
      late_reason_reviewed_at=null,updated_at=v_now
    where id=r.id returning * into r;
  end if;
  return r;
end;
$$;

-- Keep the existing break protection and additionally persist net holiday work as overtime.
create or replace function public.punch_out(
  p_selfie_url text,p_device text default null,p_browser text default null,p_ip text default null
)
returns public.crm_attendance
language plpgsql
security definer
set search_path=public
as $$
declare
  s public.crm_staff;
  r public.crm_attendance;
  v_now timestamptz:=now();
  v_local_time time;
  v_tz text;
  v_is_holiday boolean:=false;
  v_holiday_overtime integer:=0;
begin
  select * into s from public.crm_staff where user_id=auth.uid() and status='Active' limit 1;
  if s.id is null then raise exception 'No active staff profile.'; end if;
  select business_timezone into v_tz from public.crm_attendance_settings where id=1;
  select * into r from public.crm_attendance
  where staff_id=s.id and check_in is not null and check_out is null
    and not public.crm_attendance_is_locked(attendance_date,v_now)
  order by attendance_date desc,created_at desc limit 1 for update;
  if r.id is null then raise exception 'No open attendance record was found. It may already be locked.'; end if;
  perform pg_advisory_xact_lock(hashtext('attendance-break-'||r.id::text));
  if exists(select 1 from public.crm_attendance_breaks where attendance_id=r.id and break_end_at is null) then
    raise exception 'End your active break before punching out.';
  end if;
  v_local_time := (v_now at time zone v_tz)::time;
  v_is_holiday := exists(
    select 1 from public.crm_company_holidays h where h.holiday_date=r.attendance_date
  );
  if v_is_holiday and r.punch_in_at is not null then
    v_holiday_overtime := greatest(
      0,
      floor(extract(epoch from (v_now-r.punch_in_at))/60)::integer-coalesce(r.break_minutes,0)
    );
  end if;
  update public.crm_attendance set
    check_out=v_local_time,punch_out_at=v_now,punch_out_selfie_url=p_selfie_url,
    punch_out_device=p_device,punch_out_browser=p_browser,
    punch_out_ip=nullif(p_ip,'')::inet,
    overtime_minutes=case when v_is_holiday then v_holiday_overtime else overtime_minutes end,
    updated_at=v_now
  where id=r.id returning * into r;
  return r;
end;
$$;

create or replace function public.crm_review_attendance_late_reason(
  p_attendance_id uuid,
  p_decision text,
  p_review_note text default null
)
returns public.crm_attendance
language plpgsql
security definer
set search_path=public
as $$
declare
  v_row public.crm_attendance;
  v_staff public.crm_staff;
begin
  if not (public.is_crm_admin() or public.crm_manager_has_section('performance')) then
    raise exception 'Staff Performance access is required to review late explanations.';
  end if;
  if not (p_decision = any (array['Approved','Rejected']::text[])) then
    raise exception 'Decision must be Approved or Rejected.';
  end if;
  update public.crm_attendance set
    late_reason_status=p_decision,
    late_reason_review_note=nullif(btrim(coalesce(p_review_note,'')),''),
    late_reason_reviewed_by=auth.uid(),late_reason_reviewed_at=now(),updated_at=now()
  where id=p_attendance_id and late_reason is not null
  returning * into v_row;
  if v_row.id is null then raise exception 'Late explanation was not found.'; end if;
  select * into v_staff from public.crm_staff where id=v_row.staff_id;
  if v_staff.user_id is not null then
    insert into public.crm_notifications(recipient_id,type,title,body,link,dedupe_key)
    values(
      v_staff.user_id,'late_reason_'||lower(p_decision),
      'Late explanation '||lower(p_decision),
      'Your late explanation for '||to_char(v_row.attendance_date,'DD Mon YYYY')||' was '||lower(p_decision)||'.',
      '/workspace/performance','late-reason-'||v_row.id::text||'-'||lower(p_decision)
    ) on conflict (recipient_id,dedupe_key) where dedupe_key is not null do nothing;
  end if;
  return v_row;
end;
$$;

revoke all on function public.crm_get_my_punch_in_requirements() from public,anon;
revoke all on function public.crm_punch_in_with_late_reason(text,text,text,text,text) from public,anon;
revoke all on function public.crm_review_attendance_late_reason(uuid,text,text) from public,anon;
grant execute on function public.crm_get_my_punch_in_requirements() to authenticated;
grant execute on function public.crm_punch_in_with_late_reason(text,text,text,text,text) to authenticated;
grant execute on function public.crm_review_attendance_late_reason(uuid,text,text) to authenticated;

comment on column public.crm_attendance.late_reason_status is
  'Pending/Approved/Rejected review state. Approved reasons remove only the punctuality deduction; raw punch data remains unchanged.';
