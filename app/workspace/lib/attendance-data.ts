import { crmSupabase } from '../../crm/lib/supabase-crm';
import type { AttendanceRecord } from '../../crm/lib/types';

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

export async function getTodayAttendance(): Promise<AttendanceRecord | null> {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await crmSupabase.from('crm_attendance').select('*').eq('attendance_date', today).maybeSingle();
  return data as AttendanceRecord | null;
}

// Used by the dashboard calendar — one row per day for the given month
// (RLS already scopes this to the signed-in staff member's own rows).
export async function getMonthAttendance(year: number, month: number) {
  const from = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const toDate = new Date(year, month + 1, 0).getDate();
  const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(toDate).padStart(2, '0')}`;
  const { data } = await crmSupabase
    .from('crm_attendance')
    .select('attendance_date, status')
    .gte('attendance_date', from)
    .lte('attendance_date', to);
  const map: Record<string, string> = {};
  (data || []).forEach((r: { attendance_date: string; status: string }) => { map[r.attendance_date] = r.status; });
  return map;
}

async function uploadSelfie(blob: Blob, suffix: 'in' | 'out') {
  const { data: { user } } = await crmSupabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');
  const path = `${user.id}/${new Date().toISOString().slice(0, 10)}-${suffix}.jpg`;
  const { error } = await crmSupabase.storage.from('attendance-selfies').upload(path, blob, { contentType: 'image/jpeg', upsert: true });
  if (error) throw new Error(error.message);
  return path;
}

export async function punchIn(selfie: Blob) {
  const path = await uploadSelfie(selfie, 'in');
  const { data, error } = await crmSupabase.rpc('punch_in', { p_selfie_url: path, p_device: detectDevice(), p_browser: detectBrowser(), p_ip: null });
  if (error) throw new Error(error.message);
  return data as AttendanceRecord;
}

export async function punchOut(selfie: Blob) {
  const path = await uploadSelfie(selfie, 'out');
  const { data, error } = await crmSupabase.rpc('punch_out', { p_selfie_url: path, p_device: detectDevice(), p_browser: detectBrowser(), p_ip: null });
  if (error) throw new Error(error.message);
  return data as AttendanceRecord;
}

export async function getSelfieUrl(path: string) {
  const { data, error } = await crmSupabase.storage.from('attendance-selfies').createSignedUrl(path, 3600);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}
