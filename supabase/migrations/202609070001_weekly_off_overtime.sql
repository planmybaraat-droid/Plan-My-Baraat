-- Working on a configured weekly off (Sunday by default) is overtime.
-- This is additive: it preserves existing attendance rows and continues to
-- use the configured working_days instead of hard-coding a calendar rule.

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
  v_weekly_off boolean := false;
begin
  select * into v_staff from public.crm_staff where user_id=auth.uid() and status='Active' limit 1;
  if v_staff.id is null then raise exception 'No active staff profile.'; end if;
  select * into v_settings from public.crm_attendance_settings where id=1;
  v_date := public.crm_attendance_business_date(v_now);
  v_local_now := v_now at time zone v_settings.business_timezone;
  v_shift_start := v_date::timestamp + v_staff.shift_start;
  v_holiday := exists (select 1 from public.crm_company_holidays h where h.holiday_date=v_date);
  v_weekly_off := not (extract(isodow from v_date)::smallint = any(v_settings.working_days));
  if not (v_holiday or v_weekly_off) then
    v_late_minutes := greatest(0, floor(extract(epoch from (v_local_now-v_shift_start))/60)::integer);
  end if;
  return jsonb_build_object(
    'attendance_date',v_date,
    'is_company_holiday',v_holiday,
    'is_weekly_off',v_weekly_off,
    'is_overtime_day',v_holiday or v_weekly_off,
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
  v_weekly_off boolean := false;
  v_reason text := nullif(btrim(coalesce(p_late_reason,'')), '');
begin
  select * into s from public.crm_staff where user_id=auth.uid() and status='Active' limit 1;
  if s.id is null then raise exception 'No active staff profile.'; end if;
  select * into v_settings from public.crm_attendance_settings where id=1;
  v_date := public.crm_attendance_business_date(v_now);
  v_local_now := v_now at time zone v_settings.business_timezone;
  v_local_time := v_local_now::time;
  v_shift_start := v_date::timestamp + s.shift_start;
  v_holiday := exists (select 1 from public.crm_company_holidays h where h.holiday_date=v_date);
  v_weekly_off := not (extract(isodow from v_date)::smallint = any(v_settings.working_days));
  if not (v_holiday or v_weekly_off) then
    v_late_minutes := greatest(0, floor(extract(epoch from (v_local_now-v_shift_start))/60)::integer);
  end if;
  if v_late_minutes>0 and coalesce(length(v_reason),0)<3 then
    raise exception 'Please enter why you are late before punching in.';
  end if;

  perform pg_advisory_xact_lock(hashtext('attendance-'||s.id::text||'-'||v_date::text));
  if public.crm_attendance_is_locked(v_date,v_now) then raise exception 'Attendance for % is locked.',v_date; end if;
  if exists(select 1 from public.crm_leave_requests l where l.staff_id=s.id and l.status='Approved' and v_date between l.from_date and l.to_date) then
    raise exception 'You have approved leave for this attendance date.';
  end if;
  select * into r from public.crm_attendance where staff_id=s.id and attendance_date=v_date order by created_at desc limit 1;
  if r.id is not null and r.check_in is not null then
    if r.check_out is null then raise exception 'Attendance is already punched in.'; else raise exception 'Attendance is already completed for this business date.'; end if;
  end if;

  if r.id is null then
    insert into public.crm_attendance(created_by,staff_id,attendance_date,status,check_in,punch_in_at,punch_in_selfie_url,punch_in_device,punch_in_browser,punch_in_ip,late_minutes_at_punch_in,late_reason,late_reason_status)
    values(auth.uid(),s.id,v_date,'Present',v_local_time,v_now,p_selfie_url,p_device,p_browser,nullif(p_ip,'')::inet,v_late_minutes,v_reason,case when v_late_minutes>0 then 'Pending' else null end)
    returning * into r;
  else
    if r.status = 'On Leave' then raise exception 'Attendance is not available for this business date.'; end if;
    update public.crm_attendance set
      status='Present',check_in=v_local_time,punch_in_at=v_now,punch_in_selfie_url=p_selfie_url,punch_in_device=p_device,punch_in_browser=p_browser,punch_in_ip=nullif(p_ip,'')::inet,
      late_minutes_at_punch_in=v_late_minutes,late_reason=v_reason,late_reason_status=case when v_late_minutes>0 then 'Pending' else null end,
      late_reason_review_note=null,late_reason_reviewed_by=null,late_reason_reviewed_at=null,updated_at=v_now
    where id=r.id returning * into r;
  end if;
  return r;
end;
$$;

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
  v_settings public.crm_attendance_settings;
  v_is_overtime_day boolean:=false;
  v_non_working_day_overtime integer:=0;
begin
  select * into s from public.crm_staff where user_id=auth.uid() and status='Active' limit 1;
  if s.id is null then raise exception 'No active staff profile.'; end if;
  select * into v_settings from public.crm_attendance_settings where id=1;
  select * into r from public.crm_attendance where staff_id=s.id and check_in is not null and check_out is null and not public.crm_attendance_is_locked(attendance_date,v_now) order by attendance_date desc,created_at desc limit 1 for update;
  if r.id is null then raise exception 'No open attendance record was found. It may already be locked.'; end if;
  perform pg_advisory_xact_lock(hashtext('attendance-break-'||r.id::text));
  if exists(select 1 from public.crm_attendance_breaks where attendance_id=r.id and break_end_at is null) then raise exception 'End your active break before punching out.'; end if;
  v_local_time := (v_now at time zone v_settings.business_timezone)::time;
  v_is_overtime_day := exists(select 1 from public.crm_company_holidays h where h.holiday_date=r.attendance_date)
    or not (extract(isodow from r.attendance_date)::smallint = any(v_settings.working_days));
  if v_is_overtime_day and r.punch_in_at is not null then
    v_non_working_day_overtime := greatest(0, floor(extract(epoch from (v_now-r.punch_in_at))/60)::integer-coalesce(r.break_minutes,0));
  end if;
  update public.crm_attendance set
    check_out=v_local_time,punch_out_at=v_now,punch_out_selfie_url=p_selfie_url,punch_out_device=p_device,punch_out_browser=p_browser,punch_out_ip=nullif(p_ip,'')::inet,
    overtime_minutes=case when v_is_overtime_day then v_non_working_day_overtime else overtime_minutes end,updated_at=v_now
  where id=r.id returning * into r;
  return r;
end;
$$;

revoke all on function public.crm_get_my_punch_in_requirements() from public,anon;
revoke all on function public.crm_punch_in_with_late_reason(text,text,text,text,text) from public,anon;
grant execute on function public.crm_get_my_punch_in_requirements() to authenticated;
grant execute on function public.crm_punch_in_with_late_reason(text,text,text,text,text) to authenticated;
grant execute on function public.punch_out(text,text,text,text) to authenticated;
