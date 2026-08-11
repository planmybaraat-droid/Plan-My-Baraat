'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck2, Clock, Camera, LockKeyhole } from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import { useSidebar } from '../../crm/sidebar-context';
import { crmSupabase } from '../../crm/lib/supabase-crm';
import { getSelfieUrl } from '../lib/attendance-data';
import type { AttendanceRecord } from '../../crm/lib/types';
import { attendanceIsLocked, DEFAULT_ATTENDANCE_SETTINGS, getAttendanceSettings, type AttendanceSettings } from '../../crm/lib/attendance-policy';

const STATUS_STYLE: Record<string, string> = {
  Present: 'bg-emerald-50 text-emerald-700', Absent: 'bg-red-50 text-red-700', 'Half Day': 'bg-amber-50 text-amber-700',
  'On Leave': 'bg-blue-50 text-blue-700', 'Weekly Off': 'bg-gray-100 text-gray-500', Holiday: 'bg-purple-50 text-purple-700',
};

function formatTime(t: string | null | undefined) {
  if (!t) return '—';
  const [h, m] = t.split(':').map(Number); // Postgres returns "HH:MM:SS.ffffff" — only H/M matter for display.
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function hoursBetween(inTime: string | null, outTime: string | null) {
  if (!inTime || !outTime) return '—';
  const [ih, im] = inTime.split(':').map(Number);
  const [oh, om] = outTime.split(':').map(Number);
  let minutes = (oh * 60 + om) - (ih * 60 + im);
  if (minutes < 0) minutes += 24 * 60;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export default function MyAttendancePage() {
  const { open } = useSidebar();
  const [rows, setRows] = useState<AttendanceRecord[]>([]);
  const [settings, setSettings] = useState<AttendanceSettings>(DEFAULT_ATTENDANCE_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // RLS already scopes this to rows this staff member punched themselves
      // (created_by = auth.uid()), so no extra filtering is needed here.
      const [{ data }, loadedSettings] = await Promise.all([crmSupabase
        .from('crm_attendance')
        .select('*')
        .order('attendance_date', { ascending: false })
        .limit(60), getAttendanceSettings().catch(() => DEFAULT_ATTENDANCE_SETTINGS)]);
      setRows((data || []) as AttendanceRecord[]);
      setSettings(loadedSettings);
      setLoading(false);
    })();
  }, []);

  const present = rows.filter((r) => r.status === 'Present').length;

  return (
    <>
      <CrmHeader title="My Attendance" subtitle={`${present} present day${present === 1 ? '' : 's'} recorded`} onMenuClick={open} notificationsHref="/workspace/notifications" />
      <div className="p-4 sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-60 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
          ) : !rows.length ? (
            <div className="px-6 py-20 text-center">
              <CalendarCheck2 className="mx-auto text-red-600" size={28} />
              <p className="mt-4 font-black">No attendance recorded yet</p>
              <p className="mt-1 text-sm text-gray-400">Punch in from your dashboard to start building your attendance history.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rows.map((r) => { const locked=attendanceIsLocked(r.attendance_date,settings); return (
                <div key={r.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">{new Date(`${r.attendance_date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                      {r.check_in && <span className="flex items-center gap-1"><Clock size={11} /> In {formatTime(r.check_in)}</span>}
                      {r.check_out && <span className="flex items-center gap-1"><Clock size={11} /> Out {formatTime(r.check_out)}</span>}
                      <span className="font-semibold text-gray-500">{hoursBetween(r.check_in, r.check_out)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {r.punch_in_selfie_url && <SelfieButton path={r.punch_in_selfie_url} label="In selfie" />}
                    {r.punch_out_selfie_url && <SelfieButton path={r.punch_out_selfie_url} label="Out selfie" />}
                    {locked && <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2.5 py-1 text-[9px] font-black uppercase text-white"><LockKeyhole size={10}/> Locked</span>}
                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLE[r.status] || 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                  </div>
                </div>
              );})}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SelfieButton({ path, label }: { path: string; label: string }) {
  const [url, setUrl] = useState<string | null>(null);
  if (url) return <a href={url} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-[10px] font-bold text-red-600">Open</a>;
  return (
    <button onClick={async () => setUrl(await getSelfieUrl(path))} className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[10px] font-bold text-gray-500 hover:bg-gray-50">
      <Camera size={11} /> {label}
    </button>
  );
}
