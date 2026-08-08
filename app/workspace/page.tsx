'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Camera, CheckCircle2, Clock, ListChecks, LogOut as PunchOutIcon, UserSearch, Bell, TimerReset, ChevronLeft, ChevronRight } from 'lucide-react';
import CrmHeader from '../crm/components/CrmHeader';
import { useSidebar } from '../crm/sidebar-context';
import { useCrmProfile } from '../crm/lib/useCrmProfile';
import { useCrmNotifications } from '../crm/lib/useCrmNotifications';
import { crmSupabase } from '../crm/lib/supabase-crm';
import SelfieCapture from './components/SelfieCapture';
import { getTodayAttendance, getSelfieUrl, punchIn, punchOut, getMonthAttendance } from './lib/attendance-data';
import type { AttendanceRecord } from '../crm/lib/types';
import { useSearchParams } from 'next/navigation';
import { resolveModuleAccess } from '../../lib/modulePermissions';

function formatTime(t: string | null | undefined) {
  if (!t) return '—';
  const [h, m] = t.split(':').map(Number); // Postgres returns "HH:MM:SS.ffffff" — only H/M matter for display.
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function workingHours(record: AttendanceRecord | null | undefined) {
  if (!record?.check_in) return null;
  const [inH, inM] = record.check_in.split(':').map(Number);
  const end = record.check_out ? record.check_out.split(':').map(Number) : (() => { const now = new Date(); return [now.getHours(), now.getMinutes()]; })();
  const minutes = (end[0] * 60 + end[1]) - (inH * 60 + inM);
  if (minutes < 0) return null;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
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
  const [attendance, setAttendance] = useState<AttendanceRecord | null | undefined>(undefined);
  const [capturing, setCapturing] = useState<'in' | 'out' | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState<{ id: string; title: string; status: string; due_date: string | null; progress: number; priority: string }[]>([]);
  const [leadCount, setLeadCount] = useState(0);
  const [monthCursor, setMonthCursor] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; });
  const [monthMap, setMonthMap] = useState<Record<string, string>>({});

  const loadAttendance = useCallback(async () => setAttendance(await getTodayAttendance()), []);

  useEffect(() => {
    loadAttendance();
    (async () => {
      const { data } = await crmSupabase.from('crm_tasks').select('id, title, status, due_date, progress, priority').order('due_date', { ascending: true }).limit(6);
      setTasks(data || []);
      const { count: leads } = await crmSupabase.from('crm_customer_leads').select('id', { count: 'exact', head: true });
      setLeadCount(leads || 0);
    })();
  }, [loadAttendance]);

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
                <p className="text-lg font-black leading-tight tracking-tight text-gray-950 tabular-nums">{workingHours(attendance) || '—'}</p>
                <p className="text-[10.5px] font-semibold leading-tight text-gray-400">Working Hours</p>
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

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Attendance card */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <p className="text-sm font-black text-gray-950">Today&apos;s Attendance</p>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${attendance?.check_in ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{attendance?.check_in ? (attendance.check_out ? 'Day Complete' : 'Punched In') : 'Not Punched In'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 px-5 py-5 text-center">
              <div><p className="text-base font-black tracking-tight text-gray-950 tabular-nums">{formatTime(attendance?.check_in)}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Check In</p></div>
              <div><p className="text-base font-black tracking-tight text-gray-950 tabular-nums">{formatTime(attendance?.check_out)}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Check Out</p></div>
              <div><p className="text-base font-black tracking-tight text-gray-950 tabular-nums">{workingHours(attendance) || '—'}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Working Hours</p></div>
            </div>
            <div className="space-y-2.5 px-5 pb-5">
              <div className="flex items-center gap-2">
                {attendance?.punch_in_selfie_url && <SelfieLink path={attendance.punch_in_selfie_url} label="In selfie" />}
                {attendance?.punch_out_selfie_url && <SelfieLink path={attendance.punch_out_selfie_url} label="Out selfie" />}
              </div>
              {!attendance?.check_in ? (
                <button onClick={() => setCapturing('in')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs font-bold text-white"><Camera size={15} /> Punch In</button>
              ) : !attendance?.check_out ? (
                <button onClick={() => setCapturing('out')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-xs font-bold text-white"><PunchOutIcon size={15} /> Punch Out</button>
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
