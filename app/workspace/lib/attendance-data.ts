import { crmSupabase } from '../../crm/lib/supabase-crm';
import { deriveMonthAttendance, DEFAULT_WORKING_DAYS } from '../../crm/lib/attendance-calendar';
import { getCompanyHolidays } from '../../crm/lib/company-holidays';
import type { AttendanceBreakRecord, AttendanceRecord, MyAttendanceState, PunchInRequirements } from '../../crm/lib/types';

function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/') && !ua.includes('Chromium')) return 'Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  return 'Unknown browser';
}

function detectDevice() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS device';
  if (/Android/.test(ua)) return 'Android device';
  if (/Windows/.test(ua)) return 'Windows PC';
  if (/Mac/.test(ua)) return 'Mac';
  return 'Unknown device';
}

export async function getMyStaffProfile() {
  const { data: { user } } = await crmSupabase.auth.getUser();
  if (!user) return null;
  const { data } = await crmSupabase.from('crm_staff').select('*').eq('user_id', user.id).maybeSingle();
  return data;
}

export async function getTodayAttendanceState(): Promise<MyAttendanceState> {
  const { data, error } = await crmSupabase.rpc('crm_get_my_attendance_state');
  if (error) throw new Error(error.message);
  const state = (data || {}) as Partial<MyAttendanceState>;
  return {
    record: state.record || null,
    breaks: state.breaks || [],
    active_break: state.active_break || null,
    state: state.state || 'not_punched_in',
    total_break_minutes: Number(state.total_break_minutes || 0),
    shift_minutes: Number(state.shift_minutes || 0),
    net_working_minutes: Number(state.net_working_minutes || 0),
    is_locked: !!state.is_locked,
    lock_at: state.lock_at || null,
  };
}

export async function getTodayAttendance(): Promise<AttendanceRecord | null> {
  return (await getTodayAttendanceState()).record;
}

// Used by the dashboard calendar — one row per day for the given month
// (RLS already scopes this to the signed-in staff member's own rows).
export async function getMonthAttendance(year: number, month: number) {
  const from = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const toDate = new Date(year, month + 1, 0).getDate();
  const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(toDate).padStart(2, '0')}`;
  const { data: { user } } = await crmSupabase.auth.getUser();
  const staffResult = user
    ? await crmSupabase.from('crm_staff').select('id,joining_date').eq('user_id', user.id).maybeSingle()
    : { data: null, error: null };
  const leaveQuery = crmSupabase.from('crm_leave_requests').select('from_date,to_date,status')
    .eq('status', 'Approved').lte('from_date', to).gte('to_date', from);
  if (staffResult.data?.id) leaveQuery.eq('staff_id', staffResult.data.id);
  const [attendanceResult, settingsResult, leaveResult, holidays] = await Promise.all([
    crmSupabase.from('crm_attendance').select('attendance_date,status,check_in,punch_in_at').gte('attendance_date', from).lte('attendance_date', to),
    crmSupabase.from('crm_attendance_settings').select('working_days').eq('id', 1).maybeSingle(),
    leaveQuery,
    getCompanyHolidays(from, to),
  ]);
  if (attendanceResult.error) throw new Error(attendanceResult.error.message);

  return deriveMonthAttendance({
    year,
    month,
    records: attendanceResult.data || [],
    leaveRanges: leaveResult.error ? [] : leaveResult.data || [],
    workingDays: settingsResult.data?.working_days || DEFAULT_WORKING_DAYS,
    employmentStartDate: staffResult.data?.joining_date || null,
    holidayDates: holidays.map((holiday) => holiday.holiday_date),
  });
}

async function uploadSelfie(blob: Blob, suffix: 'in' | 'out') {
  const { data: { user } } = await crmSupabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');
  const path = `${user.id}/${new Date().toISOString().slice(0, 10)}-${suffix}.jpg`;
  const { error } = await crmSupabase.storage.from('attendance-selfies').upload(path, blob, { contentType: 'image/jpeg', upsert: true });
  if (error) throw new Error(error.message);
  return path;
}

// Breaks get their own uniquely-named selfie (a staff member can take up to
// 2 breaks a day, each with a start + end photo) so files never collide.
async function uploadBreakSelfie(blob: Blob, label: string) {
  const { data: { user } } = await crmSupabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');
  const path = `${user.id}/${new Date().toISOString().slice(0, 10)}-break-${label}-${Date.now()}.jpg`;
  const { error } = await crmSupabase.storage.from('attendance-selfies').upload(path, blob, { contentType: 'image/jpeg', upsert: true });
  if (error) throw new Error(error.message);
  return path;
}

export async function getPunchInRequirements(): Promise<PunchInRequirements> {
  const { data, error } = await crmSupabase.rpc('crm_get_my_punch_in_requirements');
  if (error) throw new Error(error.message);
  const value = (data || {}) as Partial<PunchInRequirements>;
  return {
    attendance_date: String(value.attendance_date || ''),
    is_company_holiday: !!value.is_company_holiday,
    late_minutes: Math.max(0, Number(value.late_minutes || 0)),
    requires_late_reason: !!value.requires_late_reason,
  };
}

export async function punchIn(selfie: Blob, lateReason?: string) {
  const path = await uploadSelfie(selfie, 'in');
  const { data, error } = await crmSupabase.rpc('crm_punch_in_with_late_reason', {
    p_selfie_url: path,
    p_late_reason: lateReason?.trim() || null,
    p_device: detectDevice(),
    p_browser: detectBrowser(),
    p_ip: null,
  });
  if (error) throw new Error(error.message);
  return data as AttendanceRecord;
}

export async function punchOut(selfie: Blob) {
  const path = await uploadSelfie(selfie, 'out');
  const { data, error } = await crmSupabase.rpc('punch_out', { p_selfie_url: path, p_device: detectDevice(), p_browser: detectBrowser(), p_ip: null });
  if (error) throw new Error(error.message);
  return data as AttendanceRecord;
}

export async function startBreak(selfie: Blob): Promise<AttendanceBreakRecord> {
  const path = await uploadBreakSelfie(selfie, 'start');
  const { data, error } = await crmSupabase.rpc('crm_start_attendance_break', { p_selfie_url: path, p_device: detectDevice(), p_browser: detectBrowser() });
  if (error) throw new Error(error.message);
  return data as AttendanceBreakRecord;
}

export async function endBreak(selfie: Blob): Promise<AttendanceBreakRecord> {
  const path = await uploadBreakSelfie(selfie, 'end');
  const { data, error } = await crmSupabase.rpc('crm_end_attendance_break', { p_selfie_url: path, p_device: detectDevice(), p_browser: detectBrowser() });
  if (error) throw new Error(error.message);
  return data as AttendanceBreakRecord;
}

export async function getSelfieUrl(path: string) {
  const { data, error } = await crmSupabase.storage.from('attendance-selfies').createSignedUrl(path, 3600);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}
