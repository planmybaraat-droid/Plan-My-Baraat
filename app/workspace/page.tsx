'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Camera, CheckCircle2, Clock, Coffee, ListChecks, LogOut as PunchOutIcon, UserSearch, Bell, TimerReset, ChevronLeft, ChevronRight, CalendarRange } from 'lucide-react';
import CrmHeader from '../crm/components/CrmHeader';
import { useSidebar } from '../crm/sidebar-context';
import { useCrmProfile } from '../crm/lib/useCrmProfile';
import { useCrmNotifications } from '../crm/lib/useCrmNotifications';
import { crmSupabase, getVendors } from '../crm/lib/supabase-crm';
import SelfieCapture from './components/SelfieCapture';
import { endBreak, getTodayAttendanceState, getSelfieUrl, punchIn, punchOut, getMonthAttendance, startBreak } from './lib/attendance-data';
import type { AttendanceBreakRecord, MyAttendanceState, Vendor } from '../crm/lib/types';
import { useSearchParams } from 'next/navigation';
import { resolveModuleAccess } from '../../lib/modulePermissions';
import DownloadCenterCard from '../crm/components/DownloadCenterCard';

function formatTime(t: string | null | undefined) {
  if (!t) return '—';
  const [h, m] = t.split(':').map(Number); // Postgres returns "HH:MM:SS.ffffff" — only H/M matter for display.
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatMinutes(minutes: number | null | undefined) {
  const safe = Math.max(0, Number(minutes || 0));
  return `${Math.floor(safe / 60)}h ${safe % 60}m`;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const PRIORITY_STYLE: Record<string, string> = {
  Urgent: 'bg-red-100 text-red-700',
  High: 'bg-red-50 text-red-600',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-emerald-50 text-emerald-700',
};

const DAY_STYLE: Record<string, string> = {
  Present: 'bg-emerald-500 text-white',
  Absent: 'bg-red-500 text-white',
  'Half Day': 'bg-amber-400 text-white',
  'On Leave': 'bg-blue-400 text-white',
  'Weekly Off': 'bg-gray-200 text-gray-500',
  Holiday: 'bg-purple-400 text-white',
};

export default function WorkspaceDashboard() {
  const { open } = useSidebar();
  const { profile } = useCrmProfile();
  const searchParams = useSearchParams();
  const accessDeniedModule = searchParams.get('access_denied');
  const canTasks = resolveModuleAccess(profile?.role, profile?.moduleAccess, 'tasks');
  const canLeads = resolveModuleAccess(profile?.role, profile?.moduleAccess, 'leads');
  const { items: notifications } = useCrmNotifications();
  const [attendanceState, setAttendanceState] = useState<MyAttendanceState | undefined>(undefined);
  const [capturing, setCapturing] = useState<'in' | 'out' | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState<{ id: string; title: string; status: string; due_date: string | null; progress: number; priority: string }[]>([]);
  const [leadCount, setLeadCount] = useState(0);
  const [leaveSummary, setLeaveSummary] = useState({ pending: 0, approvedDays: 0 });
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [canDownloadVendors, setCanDownloadVendors] = useState(true);
  const [monthCursor, setMonthCursor] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; });
  const [monthMap, setMonthMap] = useState<Record<string, string>>({});
  const attendance = attendanceState?.record;

  const loadAttendance = useCallback(async () => setAttendanceState(await getTodayAttendanceState()), []);

  useEffect(() => {
    loadAttendance();
    (async () => {
      const { data } = await crmSupabase.from('crm_tasks').select('id, title, status, due_date, progress, priority').order('due_date', { ascending: true }).limit(6);
      setTasks(data || []);
      const { count: leads } = await crmSupabase.from('crm_customer_leads').select('id', { count: 'exact', head: true });
      setLeadCount(leads || 0);
      const { data: leaveRows } = await crmSupabase.from('crm_leave_requests').select('status,number_of_days');
      setLeaveSummary({
        pending: (leaveRows || []).filter((row) => row.status === 'Pending').length,
        approvedDays: (leaveRows || []).filter((row) => row.status === 'Approved').reduce((sum, row) => sum + Number(row.number_of_days || 0), 0),
      });
    })();
  }, [loadAttendance]);

  useEffect(() => {
    getVendors().then(setVendors).catch(() => setCanDownloadVendors(false));
  }, []);

  useEffect(() => {
    (async () => setMonthMap(await getMonthAttendance(monthCursor.year, monthCursor.month)))();
  }, [monthCursor]);

  const handleCapture = async (blob: Blob) => {
    setBusy(true); setError('');
    try {
      if (capturing === 'in') await punchIn(blob); else await punchOut(blob);
      await loadAttendance();
      setCapturing(null);
      setMonthMap(await getMonthAttendance(monthCursor.year, monthCursor.month));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const handleBreak = async (action: 'start' | 'end') => {
    if (busy) return;
    setBusy(true); setError('');
    try {
      if (action === 'start') await startBreak(); else await endBreak();
      await loadAttendance();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update your break.');
    } finally {
      setBusy(false);
    }
  };

  const pendingTasks = tasks.filter((t) => !['Completed', 'Rejected'].includes(t.status));
  const todaysTasks = tasks.filter((t) => t.due_date === new Date().toISOString().slice(0, 10));

  const calendarDays = useMemo(() => {
    const { year, month } = monthCursor;
    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const todayKey = new Date().toISOString().slice(0, 10);
    const cells: { key: string; day: number; status?: string; isToday: boolean }[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push({ key: `pad-${i}`, day: 0, isToday: false });
    for (let d = 1; d <= totalDays; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ key, day: d, status: monthMap[key], isToday: key === todayKey });
    }
    return cells;
  }, [monthCursor, monthMap]);

  const monthLabel = new Date(monthCursor.year, monthCursor.month, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const changeMonth = (delta: number) => setMonthCursor((c) => { const d = new Date(c.year, c.month + delta, 1); return { year: d.getFullYear(), month: d.getMonth() }; });

  const monthSummary = useMemo(() => {
    const statuses = Object.values(monthMap);
    const present = statuses.filter((s) => s === 'Present').length;
    const absent = statuses.filter((s) => s === 'Absent').length;
    const halfDay = statuses.filter((s) => s === 'Half Day').length;
    const leave = statuses.filter((s) => s === 'On Leave').length;
    const marked = present + absent + halfDay + leave;
    const pct = marked ? Math.round(((present + halfDay * 0.5) / marked) * 100) : 0;
    return { present, absent, leave, pct };
  }, [monthMap]);

  return (
    <>
      <CrmHeader title={`${greeting()}, ${profile?.name?.split(' ')[0] || ''} 👋`} subtitle="Here's what's happening today" onMenuClick={open} notificationsHref="/workspace/notifications" />
      <div className="space-y-5 p-4 sm:p-6">
        {accessDeniedModule && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
            You don&apos;t have permission to access that module. Ask your Admin to grant access under Staff Management &rarr; Manage Access.
          </div>
        )}
        {/* Summary tiles */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Link href="/workspace/leave" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-gray-300 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><CalendarRange size={16} /></span>
              <div className="min-w-0">
                <p className="text-lg font-black leading-tight tracking-tight text-gray-950 tabular-nums">{leaveSummary.pending}</p>
                <p className="text-[10.5px] font-semibold leading-tight text-gray-400">Pending Leave</p>
              </div>
            </div>
            <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wide text-violet-600">{leaveSummary.approvedDays} approved day(s)</p>
          </Link>
          {canTasks && (
          <Link href="/workspace/tasks" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-gray-300 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><ListChecks size={16} /></span>
              <div className="min-w-0">
                <p className="text-lg font-black leading-tight tracking-tight text-gray-950 tabular-nums">{pendingTasks.length}</p>
                <p className="text-[10.5px] font-semibold leading-tight text-gray-400">My Tasks</p>
              </div>
            </div>
            <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wide text-red-600">{todaysTasks.length} Due today</p>
          </Link>
          )}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Clock size={16} /></span>
              <div className="min-w-0">
                <p className="text-lg font-black leading-tight tracking-tight text-gray-950 tabular-nums">{formatTime(attendance?.check_in)}</p>
                <p className="text-[10.5px] font-semibold leading-tight text-gray-400">Last Punch In</p>
              </div>
            </div>
            <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">Today</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><TimerReset size={16} /></span>
              <div className="min-w-0">
                <p className="text-lg font-black leading-tight tracking-tight text-gray-950 tabular-nums">{attendance?.check_in ? formatMinutes(attendanceState?.net_working_minutes) : '—'}</p>
                <p className="text-[10.5px] font-semibold leading-tight text-gray-400">Net Working</p>
              </div>
            </div>
            <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">Today</p>
          </div>
          {canLeads && (
          <Link href="/workspace/leads" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-gray-300 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600"><UserSearch size={16} /></span>
              <div className="min-w-0">
                <p className="text-lg font-black leading-tight tracking-tight text-gray-950 tabular-nums">{leadCount}</p>
                <p className="text-[10.5px] font-semibold leading-tight text-gray-400">Leads Assigned</p>
              </div>
            </div>
            <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wide text-purple-600">Assigned to you</p>
          </Link>
          )}
        </div>

        <DownloadCenterCard vendors={vendors} canDownloadVendors={canDownloadVendors} />

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Attendance card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <p className="text-sm font-black text-gray-950">Today&apos;s Attendance</p>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${attendanceState?.state === 'on_break' ? 'bg-amber-50 text-amber-700' : attendance?.check_in ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{attendanceState?.state === 'on_break' ? 'On Break' : attendanceState?.state === 'working' ? 'Working' : attendanceState?.state === 'completed' ? 'Day Complete' : 'Not Punched In'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 px-5 py-5 text-center">
              <div><p className="text-base font-black tracking-tight text-gray-950 tabular-nums">{formatTime(attendance?.check_in)}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Check In</p></div>
              <div><p className="text-base font-black tracking-tight text-gray-950 tabular-nums">{formatTime(attendance?.check_out)}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Check Out</p></div>
              <div><p className="text-base font-black tracking-tight text-gray-950 tabular-nums">{attendance?.check_in ? formatMinutes(attendanceState?.net_working_minutes) : '—'}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Net Working</p></div>
            </div>
            <div className="space-y-2.5 px-5 pb-5">
              {!!attendanceState?.breaks.length && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Today&apos;s breaks</p><span className="text-[10px] font-bold text-gray-500">Total {formatMinutes(attendanceState.total_break_minutes)}</span></div>
                  <div className="mt-2 space-y-2">{attendanceState.breaks.map((item: AttendanceBreakRecord, index: number) => <div key={item.id} className="flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-gray-600">Break {index + 1}</span><span className="text-right tabular-nums text-gray-500">{formatDateTime(item.break_start_at)} → {item.break_end_at ? formatDateTime(item.break_end_at) : 'Active'}{item.break_end_at ? ` · ${item.duration_minutes} min` : ''}</span></div>)}</div>
                </div>
              )}
              <div className="flex items-center gap-2">
                {attendance?.punch_in_selfie_url && <SelfieLink path={attendance.punch_in_selfie_url} label="In selfie" />}
                {attendance?.punch_out_selfie_url && <SelfieLink path={attendance.punch_out_selfie_url} label="Out selfie" />}
              </div>
              {!attendance?.check_in ? (
                <button disabled={busy} onClick={() => setCapturing('in')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs font-bold text-white disabled:opacity-50"><Camera size={15} /> Punch In</button>
              ) : attendanceState?.state === 'on_break' ? (
                <button disabled={busy} onClick={() => handleBreak('end')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold text-white disabled:opacity-50"><Coffee size={15} /> {busy ? 'Ending break...' : 'End Break'}</button>
              ) : attendanceState?.state === 'working' ? (
                <div className="grid gap-2 sm:grid-cols-2"><button disabled={busy} onClick={() => handleBreak('start')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs font-bold text-white disabled:opacity-50"><Coffee size={15} /> {busy ? 'Please wait...' : 'Start Break'}</button><button disabled={busy} onClick={() => setCapturing('out')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-xs font-bold text-white disabled:opacity-50"><PunchOutIcon size={15} /> Punch Out</button></div>
              ) : (
                <span className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700"><CheckCircle2 size={14} /> Done for today</span>
              )}
              {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">{error}</p>}
            </div>
          </div>

          {/* Today's tasks */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><p className="text-sm font-black text-gray-950">Today&apos;s Tasks</p><Link href="/workspace/tasks" className="text-[11px] font-bold text-red-600">View all</Link></div>
            <div className="mt-3 space-y-2">
              {!tasks.length ? <p className="py-8 text-center text-xs text-gray-400">No tasks assigned yet.</p> : tasks.slice(0, 5).map((t) => (
                <Link key={t.id} href={`/workspace/tasks/${t.id}`} className="flex items-center justify-between rounded-xl border border-gray-100 px-3.5 py-2.5 hover:bg-gray-50">
                  <div className="min-w-0"><p className="truncate text-[13px] font-bold leading-tight text-gray-800">{t.title}</p><p className="mt-0.5 text-[10.5px] text-gray-400">{t.status}</p></div>
                  <span className={`ml-2 flex-shrink-0 rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wide ${PRIORITY_STYLE[t.priority] || 'bg-gray-100 text-gray-600'}`}>{t.priority}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Attendance calendar */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-gray-950">Attendance Calendar</p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => changeMonth(-1)} className="rounded-lg border border-gray-200 p-1 text-gray-500 hover:bg-gray-50"><ChevronLeft size={14} /></button>
                <span className="w-28 text-center text-[11px] font-bold text-gray-600">{monthLabel}</span>
                <button onClick={() => changeMonth(1)} className="rounded-lg border border-gray-200 p-1 text-gray-500 hover:bg-gray-50"><ChevronRight size={14} /></button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl bg-gray-50 p-2.5 text-center">
              <div><p className="text-sm font-black tracking-tight text-emerald-600 tabular-nums">{monthSummary.present}</p><p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-400">Present</p></div>
              <div><p className="text-sm font-black tracking-tight text-red-600 tabular-nums">{monthSummary.absent}</p><p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-400">Absent</p></div>
              <div><p className="text-sm font-black tracking-tight text-blue-600 tabular-nums">{monthSummary.leave}</p><p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-400">On Leave</p></div>
              <div><p className="text-sm font-black tracking-tight text-gray-950 tabular-nums">{monthSummary.pct}%</p><p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-gray-400">Attendance</p></div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-gray-400">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            <div className="mt-1.5 grid grid-cols-7 gap-1.5">
              {calendarDays.map((c) => (
                <div key={c.key} className="flex aspect-square items-center justify-center">
                  {c.day > 0 && (
                    <span className={`flex h-full w-full items-center justify-center rounded-lg text-[11px] font-bold ${c.status ? DAY_STYLE[c.status] || 'bg-gray-50 text-gray-600' : 'text-gray-400'} ${c.isToday ? 'ring-2 ring-red-500 ring-offset-1' : ''}`}>{c.day}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-semibold text-gray-500">
              <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Present</span>
              <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-red-500" /> Absent</span>
              <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Half Day</span>
              <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-blue-400" /> On Leave</span>
              <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-purple-400" /> Holiday</span>
              <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-gray-200" /> Weekly Off</span>
            </div>
          </div>

          {/* Recent notifications */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><p className="text-sm font-black text-gray-950">Recent Notifications</p><Link href="/workspace/notifications" className="text-[11px] font-bold text-red-600">View all</Link></div>
            <div className="mt-3 space-y-2">
              {!notifications.length ? <p className="py-8 text-center text-xs text-gray-400">Nothing yet.</p> : notifications.slice(0, 5).map((n) => (
                <div key={n.id} className="flex items-start gap-2.5 rounded-xl border border-gray-100 px-3.5 py-2.5"><Bell size={14} className="mt-0.5 flex-shrink-0 text-red-500" /><div className="min-w-0"><p className="truncate text-xs font-bold text-gray-800">{n.title}</p><p className="text-[11px] text-gray-400">{new Date(n.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></div></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {capturing && (
        <SelfieCapture
          title={capturing === 'in' ? 'Punch in — take a selfie' : 'Punch out — take a selfie'}
          confirmLabel={capturing === 'in' ? 'Punch In' : 'Punch Out'}
          busy={busy}
          onCapture={handleCapture}
          onClose={() => setCapturing(null)}
        />
      )}
    </>
  );
}

function SelfieLink({ path, label }: { path: string; label: string }) {
  const [url, setUrl] = useState<string | null>(null);
  return (
    <button
      onClick={async () => setUrl(await getSelfieUrl(path))}
      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-bold text-gray-500 hover:bg-gray-50"
    >
      {url ? <a href={url} target="_blank" rel="noreferrer" className="text-red-600">Open {label}</a> : `View ${label}`}
    </button>
  );
}
