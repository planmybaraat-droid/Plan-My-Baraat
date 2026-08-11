import { crmSupabase } from './supabase-crm';
import type { AttendanceRecord } from './types';

export interface AttendanceSettings {
  id: number;
  business_timezone: string;
  lock_time: string;
  punch_in_reminder_minutes: number;
  punch_out_reminder_minutes: number;
  final_reminder_minutes: number;
  daily_report_reminder_time: string;
  working_days: number[];
}

export const DEFAULT_ATTENDANCE_SETTINGS: AttendanceSettings = {
  id: 1, business_timezone: 'Asia/Kolkata', lock_time: '05:00:00', punch_in_reminder_minutes: 15,
  punch_out_reminder_minutes: 15, final_reminder_minutes: 30, daily_report_reminder_time: '21:00:00', working_days: [1,2,3,4,5,6],
};

export interface AttendanceAuditEntry {
  id: string;
  attendance_id: string;
  staff_id: string;
  attendance_date: string;
  reason: string;
  changed_at: string;
}

export async function getAttendanceSettings() {
  const { data, error } = await crmSupabase.from('crm_attendance_settings').select('*').eq('id', 1).single();
  if (error) throw new Error(error.message);
  return data as AttendanceSettings;
}

export async function saveAttendanceSettings(settings: AttendanceSettings) {
  const { data: { user } } = await crmSupabase.auth.getUser();
  const { data, error } = await crmSupabase.from('crm_attendance_settings').update({
    lock_time: settings.lock_time, punch_in_reminder_minutes: settings.punch_in_reminder_minutes,
    punch_out_reminder_minutes: settings.punch_out_reminder_minutes, final_reminder_minutes: settings.final_reminder_minutes,
    daily_report_reminder_time: settings.daily_report_reminder_time, working_days: settings.working_days,
    updated_at: new Date().toISOString(), updated_by: user?.id,
  }).eq('id', 1).select().single();
  if (error) throw new Error(error.message);
  return data as AttendanceSettings;
}

export function attendanceLockAt(date: string, settings: AttendanceSettings) {
  const next = new Date(`${date}T12:00:00Z`); next.setUTCDate(next.getUTCDate() + 1);
  const nextDate = next.toISOString().slice(0, 10);
  return new Date(`${nextDate}T${settings.lock_time.slice(0,5)}:00+05:30`);
}

export function attendanceIsLocked(date: string, settings: AttendanceSettings) {
  return Date.now() >= attendanceLockAt(date, settings).getTime();
}

export async function adminSaveAttendance(rows: AttendanceRecord[], reason?: string) {
  const payload = rows.map((row) => ({ staff_id: row.staff_id, attendance_date: row.attendance_date, status: row.status,
    check_in: row.check_in || null, check_out: row.check_out || null, break_minutes: row.break_minutes,
    overtime_minutes: row.overtime_minutes, note: row.note || null }));
  const { data, error } = await crmSupabase.rpc('crm_admin_save_attendance', { p_rows: payload, p_reason: reason?.trim() || null });
  if (error) throw new Error(error.message);
  return (data || []) as AttendanceRecord[];
}

export async function getCorrectedAttendanceIds(date: string) {
  const { data, error } = await crmSupabase.from('crm_attendance_audit').select('attendance_id').eq('attendance_date', date);
  if (error) throw new Error(error.message);
  return new Set((data || []).map((row) => String(row.attendance_id)));
}

export async function getAttendanceAudit(date: string) {
  const { data, error } = await crmSupabase.from('crm_attendance_audit')
    .select('id,attendance_id,staff_id,attendance_date,reason,changed_at')
    .eq('attendance_date', date)
    .order('changed_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []) as AttendanceAuditEntry[];
}
