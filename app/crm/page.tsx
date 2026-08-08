'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Users, UserSearch, ClipboardCheck, ReceiptText, Loader2, CalendarDays,
  ChevronLeft, ChevronRight, UserPlus, Cake, UserCog, ListChecks,
  CheckCircle2, Loader as LoaderIcon, Hourglass, AlertCircle,
} from 'lucide-react';
import CrmHeader from './components/CrmHeader';
import { useSidebar } from './sidebar-context';
import { crmSupabase, getVendors, getLeads } from './lib/supabase-crm';
import { getQuotations } from './quotations/quotation-data';
import { getAgreements } from './lib/supabase-crm';
import { getInvoices } from './invoices/invoice-data';
import { effectiveInvoiceStatus } from './invoices/invoice-config';
import { getStaff } from './staff/staff-data';
import { deriveConfirmedEvents, getStaffBirthdaysForYears } from './event-calendar/event-calendar-data';
import type { CalendarEvent, BirthdayEvent } from './event-calendar/event-calendar-data';
import type { StaffRecord } from './lib/types';
import { useCrmProfile } from './lib/useCrmProfile';
import { isCrmManagerRole } from '../../lib/crmSectionPermissions';

interface StaffRosterRow {
  staff: StaffRecord;
  checkIn: string | null;
  checkOut: string | null;
  pendingTasks: number;
}

function formatPunchTime(t: string | null) {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

const EVENT_CHIP_COLORS = [
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-purple-50 text-purple-700 border-purple-100',
  'bg-amber-50 text-amber-700 border-amber-100',
  'bg-pink-50 text-pink-700 border-pink-100',
];

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function CrmDashboard() {
  const { open } = useSidebar();
  const { profile } = useCrmProfile();
  const isManager = isCrmManagerRole(profile?.role);
  const [loading, setLoading] = useState(true);

  const [vendorTotal, setVendorTotal] = useState(0);
  const [leadTotal, setLeadTotal] = useState(0);
  const [agreementsPending, setAgreementsPending] = useState(0);
  const [invoicesOverdue, setInvoicesOverdue] = useState(0);
  const [staffRoster, setStaffRoster] = useState<StaffRosterRow[]>([]);
  const [taskCounts, setTaskCounts] = useState({ completed: 0, inProgress: 0, pending: 0, overdue: 0, total: 0 });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [birthdays, setBirthdays] = useState<BirthdayEvent[]>([]);
  const [monthCursor, setMonthCursor] = useState(() => new Date());

  useEffect(() => {
    async function load() {
      try {
        const today = new Date().toISOString().slice(0, 10);
        // A Manager account can't read Vendors/Leads/Agreements/Invoices
        // (those stay Admin-only), so skip fetching them entirely rather
        // than showing misleading zeros from a blocked query.
        const [vendors, leads, _quotations, agreements, invoices, taskRows, staff, attendanceRows, taskAssigneeRows] = await Promise.all([
          isManager ? Promise.resolve([]) : getVendors(),
          isManager ? Promise.resolve([]) : getLeads(),
          isManager ? Promise.resolve([]) : getQuotations(),
          isManager ? Promise.resolve([]) : getAgreements(),
          isManager ? Promise.resolve([]) : getInvoices(),
          crmSupabase.from('crm_tasks').select('status, due_date'),
          getStaff({ status: 'Active' }),
          crmSupabase.from('crm_attendance').select('staff_id, check_in, check_out').eq('attendance_date', today),
          crmSupabase.from('crm_tasks').select('status, crm_task_assignees(staff_user_id)').not('status', 'in', '(Completed,Rejected)'),
        ]);

        setVendorTotal(vendors.length);
        setLeadTotal(leads.length);
        setAgreementsPending(agreements.filter((a) => ['Draft', 'Sent'].includes(a.status)).length);
        setInvoicesOverdue(invoices.filter((i) => effectiveInvoiceStatus(i) === 'Overdue').length);
        setEvents(deriveConfirmedEvents(agreements, invoices));

        const tasks = (taskRows.data || []) as { status: string; due_date: string | null }[];
        setTaskCounts({
          completed: tasks.filter((t) => t.status === 'Completed').length,
          inProgress: tasks.filter((t) => t.status === 'In Progress').length,
          pending: tasks.filter((t) => ['Pending', 'Accepted', 'On Hold', 'Needs Revision'].includes(t.status)).length,
          overdue: tasks.filter((t) => t.due_date && t.due_date < today && !['Completed', 'Rejected'].includes(t.status)).length,
          total: tasks.length,
        });

        // Task load per staff member — how many not-yet-done tasks are
        // currently assigned to them, so the roster shows who's free vs
        // overloaded, not just who's clocked in.
        const pendingByUser = new Map<string, number>();
        ((taskAssigneeRows.data || []) as { crm_task_assignees: { staff_user_id: string }[] }[]).forEach((row) => {
          (row.crm_task_assignees || []).forEach(({ staff_user_id }) => {
            pendingByUser.set(staff_user_id, (pendingByUser.get(staff_user_id) || 0) + 1);
          });
        });

        const attendanceByStaff = new Map<string, { check_in: string | null; check_out: string | null }>();
        ((attendanceRows.data || []) as { staff_id: string; check_in: string | null; check_out: string | null }[]).forEach((row) => {
          attendanceByStaff.set(row.staff_id, row);
        });

        const roster: StaffRosterRow[] = staff
          .map((s) => ({
            staff: s,
            checkIn: attendanceByStaff.get(s.id)?.check_in || null,
            checkOut: attendanceByStaff.get(s.id)?.check_out || null,
            pendingTasks: (s.user_id && pendingByUser.get(s.user_id)) || 0,
          }))
          .sort((a, b) => {
            const rank = (r: StaffRosterRow) => (r.checkIn && !r.checkOut ? 0 : r.checkIn ? 1 : 2);
            return rank(a) - rank(b) || a.staff.full_name.localeCompare(b.staff.full_name);
          });
        setStaffRoster(roster);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    (async () => {
      try {
        const year = new Date().getFullYear();
        setBirthdays(await getStaffBirthdaysForYears([year - 1, year, year + 1]));
      } catch (err) { console.error(err); }
    })();
  }, [isManager]);

  const monthDays = useMemo(() => {
    const first = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(gridStart);
      day.setDate(gridStart.getDate() + index);
      return day;
    });
  }, [monthCursor]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => { (map[e.event_date] ||= []).push(e); });
    return map;
  }, [events]);

  const birthdaysByDate = useMemo(() => {
    const map: Record<string, BirthdayEvent[]> = {};
    birthdays.forEach((b) => { (map[b.date] ||= []).push(b); });
    return map;
  }, [birthdays]);

  const monthLabel = monthCursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const monthPrefix = `${monthCursor.getFullYear()}-${String(monthCursor.getMonth() + 1).padStart(2, '0')}`;
  const monthEvents = events.filter((event) => event.event_date.startsWith(monthPrefix)).sort((a, b) => a.event_date.localeCompare(b.event_date));
  const monthBirthdays = birthdays.filter((birthday) => birthday.date.startsWith(monthPrefix)).sort((a, b) => a.date.localeCompare(b.date));
  const todayKey = dateKey(new Date());
  const shiftMonth = (delta: number) => setMonthCursor((cursor) => new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  const taskBar = (count: number) => (taskCounts.total ? Math.max((count / taskCounts.total) * 100, count > 0 ? 4 : 0) : 0);

  return (
    <>
      <CrmHeader
        title="Dashboard"
        subtitle={`Welcome back, ${profile?.name?.split(' ')[0] || (isManager ? 'Manager' : 'Admin')}! Here's an overview of your CRM.`}
        onMenuClick={open}
        actions={
          isManager ? undefined : (
            <div className="flex gap-2">
              <Link href="/crm/vendors/new" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                <UserPlus size={16} /> Add Vendor
              </Link>
              <Link href="/crm/leads/new" className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <UserSearch size={16} /> Add Lead
              </Link>
            </div>
          )
        }
      />

      {loading ? (
        <div className="flex h-[calc(100vh-4.75rem)] items-center justify-center">
          <Loader2 size={32} className="animate-spin text-red-500" />
        </div>
      ) : (
        <div className="space-y-4 p-4 sm:p-5">
          {/* KPI row */}
          {isManager ? (
            <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-3">
              <Link href="/crm/staff" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><UserCog size={19} /></span>
                  <div className="min-w-0"><p className="text-2xl font-black leading-tight text-gray-950 tabular-nums">{staffRoster.length}</p><p className="text-[11px] font-semibold text-gray-400">Active staff</p></div>
                </div>
                <p className="mt-2.5 text-[11px] font-bold text-red-600">View staff →</p>
              </Link>
              <Link href="/crm/attendance" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Users size={19} /></span>
                  <div className="min-w-0"><p className="text-2xl font-black leading-tight text-gray-950 tabular-nums">{staffRoster.filter((r) => r.checkIn && !r.checkOut).length}</p><p className="text-[11px] font-semibold text-gray-400">On duty now</p></div>
                </div>
                <p className="mt-2.5 text-[11px] font-bold text-emerald-600">View attendance →</p>
              </Link>
              <Link href="/crm/tasks" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><ListChecks size={19} /></span>
                  <div className="min-w-0"><p className="text-2xl font-black leading-tight text-gray-950 tabular-nums">{taskCounts.pending + taskCounts.inProgress}</p><p className="text-[11px] font-semibold text-gray-400">Open tasks</p></div>
                </div>
                <p className="mt-2.5 text-[11px] font-bold text-amber-600">View tasks →</p>
              </Link>
            </div>
          ) : (
            <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
              <Link href="/crm/vendors" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><Users size={19} /></span>
                  <div className="min-w-0"><p className="text-2xl font-black leading-tight text-gray-950 tabular-nums">{vendorTotal}</p><p className="text-[11px] font-semibold text-gray-400">Vendors</p></div>
                </div>
                <p className="mt-2.5 text-[11px] font-bold text-red-600">View all vendors →</p>
              </Link>
              <Link href="/crm/leads" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><UserSearch size={19} /></span>
                  <div className="min-w-0"><p className="text-2xl font-black leading-tight text-gray-950 tabular-nums">{leadTotal}</p><p className="text-[11px] font-semibold text-gray-400">Leads</p></div>
                </div>
                <p className="mt-2.5 text-[11px] font-bold text-blue-600">View all leads →</p>
              </Link>
              <Link href="/crm/agreements" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><ClipboardCheck size={19} /></span>
                  <div className="min-w-0"><p className="text-2xl font-black leading-tight text-gray-950 tabular-nums">{agreementsPending}</p><p className="text-[11px] font-semibold text-gray-400">Agreement Pending</p></div>
                </div>
                <p className="mt-2.5 text-[11px] font-bold text-emerald-600">View all agreements →</p>
              </Link>
              <Link href="/crm/invoices" className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><ReceiptText size={19} /></span>
                  <div className="min-w-0"><p className="text-2xl font-black leading-tight text-gray-950 tabular-nums">{invoicesOverdue}</p><p className="text-[11px] font-semibold text-gray-400">Invoices Overdue</p></div>
                </div>
                <p className="mt-2.5 text-[11px] font-bold text-amber-600">View all invoices →</p>
              </Link>
            </div>
          )}

          {/* Staff On Duty Today + Tasks Overview */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:min-h-[20rem]">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800"><UserCog size={15} className="text-emerald-500" /> Staff On Duty Today</h3>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">{staffRoster.filter((r) => r.checkIn && !r.checkOut).length} on duty</span>
                  <Link href="/crm/attendance" className="text-xs font-semibold text-red-600 hover:underline">View all</Link>
                </div>
              </div>
              <div className="crm-thin-scroll divide-y divide-gray-50 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                {!staffRoster.length ? (
                  <p className="py-10 text-center text-sm text-gray-400">No active staff yet</p>
                ) : staffRoster.map((r) => {
                  const onDuty = r.checkIn && !r.checkOut;
                  const done = r.checkIn && r.checkOut;
                  return (
                    <div key={r.staff.id} className="flex items-center gap-3 px-5 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">{r.staff.full_name.charAt(0)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">{r.staff.full_name}</p>
                        <p className="truncate text-xs text-gray-400">{r.staff.job_title || r.staff.department}{r.checkIn ? ` · In ${formatPunchTime(r.checkIn)}` : ''}{r.checkOut ? ` · Out ${formatPunchTime(r.checkOut)}` : ''}</p>
                      </div>
                      <span className={`shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-black uppercase ${r.pendingTasks >= 5 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}><ListChecks size={10} /> {r.pendingTasks}</span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-black uppercase ${onDuty ? 'bg-emerald-50 text-emerald-700' : done ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-700'}`}>{onDuty ? 'On duty' : done ? 'Done' : 'Not in yet'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:min-h-[20rem]">
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-4">
                <h3 className="text-sm font-bold text-gray-800">Tasks Overview</h3>
                <Link href="/crm/tasks" className="text-xs font-semibold text-red-600 hover:underline">View all</Link>
              </div>
              <div className="crm-thin-scroll flex flex-col gap-6 p-5 lg:min-h-0 lg:flex-1 lg:justify-around lg:gap-0 lg:overflow-y-auto">
                {[
                  { label: 'Completed', count: taskCounts.completed, icon: CheckCircle2, iconBg: 'bg-emerald-500', barColor: 'bg-emerald-500' },
                  { label: 'In Progress', count: taskCounts.inProgress, icon: LoaderIcon, iconBg: 'bg-blue-500', barColor: 'bg-blue-500' },
                  { label: 'Pending', count: taskCounts.pending, icon: Hourglass, iconBg: 'bg-amber-500', barColor: 'bg-amber-500' },
                  { label: 'Overdue', count: taskCounts.overdue, icon: AlertCircle, iconBg: 'bg-red-500', barColor: 'bg-red-500' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${row.iconBg} text-white`}><row.icon size={14} /></span>
                    <span className="w-24 shrink-0 text-sm font-semibold text-gray-700">{row.label}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100"><span className={`block h-full rounded-full ${row.barColor}`} style={{ width: `${taskBar(row.count)}%` }} /></div>
                    <span className="w-5 shrink-0 text-right text-sm font-bold text-gray-800 tabular-nums">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compact full-month calendar */}
          <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.7fr)]">
            <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5 sm:px-5">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900"><CalendarDays size={16} className="text-red-500" /> Event Calendar</h3>
                  <p className="mt-0.5 text-[11px] font-medium text-gray-400">Confirmed events and team birthdays</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setMonthCursor(new Date())} className="hidden rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] font-bold text-gray-500 hover:bg-gray-50 sm:block">Today</button>
                  <button onClick={() => shiftMonth(-1)} aria-label="Previous month" className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"><ChevronLeft size={14} /></button>
                  <span className="min-w-[8.5rem] text-center text-xs font-black text-gray-700">{monthLabel}</span>
                  <button onClick={() => shiftMonth(1)} aria-label="Next month" className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"><ChevronRight size={14} /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/70">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-2 text-center text-[9px] font-black uppercase tracking-[0.12em] text-gray-400 sm:text-[10px]">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 bg-gray-100/80 gap-px">
                {monthDays.map((day) => {
                  const key = dateKey(day);
                  const dayEvents = eventsByDate[key] || [];
                  const dayBirthdays = birthdaysByDate[key] || [];
                  const isToday = key === todayKey;
                  const inMonth = day.getMonth() === monthCursor.getMonth();
                  const visibleBirthdayCount = Math.min(1, dayBirthdays.length);
                  const visibleEventCount = Math.min(dayBirthdays.length ? 1 : 2, dayEvents.length);
                  const hiddenItems = Math.max(0, dayEvents.length + dayBirthdays.length - visibleBirthdayCount - visibleEventCount);
                  return (
                    <div key={key} className={`min-h-[4.8rem] min-w-0 p-1.5 sm:min-h-[5.6rem] sm:p-2 ${inMonth ? 'bg-white' : 'bg-gray-50/80'}`}>
                      <div className={`mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black sm:h-6 sm:w-6 sm:text-[11px] ${isToday ? 'bg-red-600 text-white shadow-sm' : inMonth ? 'text-gray-700' : 'text-gray-300'}`}>{day.getDate()}</div>
                      <div className="space-y-1">
                        {dayBirthdays.slice(0, 1).map((birthday) => (
                          <div key={`b-${birthday.staff_id}`} title={`${birthday.full_name}'s birthday`} className="flex items-center gap-1 truncate rounded bg-pink-50 px-1 py-0.5 text-[8px] font-bold text-pink-700 sm:text-[9px]">
                            <Cake size={8} className="shrink-0" /><span className="truncate">{birthday.full_name}</span>
                          </div>
                        ))}
                        {dayEvents.slice(0, dayBirthdays.length ? 1 : 2).map((event, index) => (
                          <Link key={event.agreement_id} title={event.groom_name || event.client_name} href={`/crm/agreements/${event.agreement_id}`} className={`block truncate rounded border px-1 py-0.5 text-[8px] font-bold sm:text-[9px] ${EVENT_CHIP_COLORS[index % EVENT_CHIP_COLORS.length]}`}>
                            {event.groom_name || event.client_name}
                          </Link>
                        ))}
                        {hiddenItems > 0 && <p className="truncate pl-1 text-[8px] font-bold text-gray-400 sm:text-[9px]">+{hiddenItems} more</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="flex min-h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-red-500">Month at a glance</p>
                <h3 className="mt-1 text-lg font-black tracking-tight text-gray-900">{monthLabel}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4">
                <div className="rounded-xl bg-blue-50 p-3"><p className="text-2xl font-black text-blue-700 tabular-nums">{monthEvents.length}</p><p className="mt-0.5 text-[10px] font-bold text-blue-600/70">Confirmed events</p></div>
                <div className="rounded-xl bg-pink-50 p-3"><p className="text-2xl font-black text-pink-700 tabular-nums">{monthBirthdays.length}</p><p className="mt-0.5 text-[10px] font-bold text-pink-600/70">Team birthdays</p></div>
              </div>
              <div className="min-h-0 flex-1 px-4 pb-4">
                <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-wider text-gray-400">Upcoming this month</p>
                <div className="space-y-2">
                  {!monthEvents.length && !monthBirthdays.length ? (
                    <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center"><CalendarDays size={20} className="mx-auto mb-2 text-gray-300" /><p className="text-xs font-semibold text-gray-400">No events scheduled</p></div>
                  ) : (
                    <>
                      {monthEvents.slice(0, 4).map((event) => (
                        <Link key={event.agreement_id} href={`/crm/agreements/${event.agreement_id}`} className="flex items-center gap-3 rounded-xl border border-gray-100 p-2.5 transition-colors hover:border-red-100 hover:bg-red-50/40">
                          <span className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-gray-900 text-white"><b className="text-xs leading-none">{Number(event.event_date.slice(8, 10))}</b><small className="mt-0.5 text-[7px] font-bold uppercase text-white/60">{new Date(`${event.event_date}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</small></span>
                          <span className="min-w-0"><b className="block truncate text-xs text-gray-800">{event.groom_name || event.client_name}{event.bride_name ? ` & ${event.bride_name}` : ''}</b><small className="block truncate text-[10px] font-medium text-gray-400">{event.package_name}</small></span>
                        </Link>
                      ))}
                      {monthBirthdays.slice(0, Math.max(0, 4 - monthEvents.length)).map((birthday) => (
                        <div key={birthday.staff_id} className="flex items-center gap-3 rounded-xl border border-pink-100 bg-pink-50/60 p-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600"><Cake size={15} /></span><span className="min-w-0"><b className="block truncate text-xs text-gray-800">{birthday.full_name}</b><small className="text-[10px] font-medium text-pink-500">Birthday · {Number(birthday.date.slice(8, 10))} {monthCursor.toLocaleDateString('en-IN', { month: 'short' })}</small></span></div>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <Link href="/crm/event-calendar" className="m-4 mt-0 rounded-xl bg-gray-950 px-4 py-3 text-center text-xs font-bold text-white transition-colors hover:bg-red-600">Open full event calendar →</Link>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
