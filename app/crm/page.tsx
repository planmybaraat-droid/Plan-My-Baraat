'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Users, UserSearch, Loader2, CalendarDays,
  ChevronLeft, ChevronRight, UserPlus, Cake, UserCog, ListChecks,
  CalendarRange, PartyPopper, Banknote, FileSignature, FilePlus2, IndianRupee,
} from 'lucide-react';
import CrmHeader from './components/CrmHeader';
import { useSidebar } from './sidebar-context';
import { crmSupabase, getVendors, getLeads } from './lib/supabase-crm';
import { getQuotations } from './quotations/quotation-data';
import { getAgreements } from './lib/supabase-crm';
import { getInvoices } from './invoices/invoice-data';
import { effectiveInvoiceStatus } from './invoices/invoice-config';
import { getStaff } from './staff/staff-data';
import { deriveConfirmedEvents, getCompanyHolidaysForYears, getStaffBirthdaysForYears } from './event-calendar/event-calendar-data';
import type { CalendarEvent, BirthdayEvent, HolidayEvent } from './event-calendar/event-calendar-data';
import type { StaffRecord } from './lib/types';
import { useCrmProfile } from './lib/useCrmProfile';
import { isCrmManagerRole, resolveSectionAccess } from '../../lib/crmSectionPermissions';
import type { Vendor } from './lib/types';
import DownloadCenterCard from './components/DownloadCenterCard';
import { getEventJobs, type EventJob } from './lib/event-job-data';

interface StaffRosterRow {
  staff: StaffRecord;
  checkIn: string | null;
  checkOut: string | null;
  pendingTasks: number;
}

const EVENT_CHIP_COLORS = [
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-purple-50 text-purple-700 border-purple-100',
  'bg-amber-50 text-amber-700 border-amber-100',
  'bg-pink-50 text-pink-700 border-pink-100',
];

const currency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const WORKFLOW_STAGES = ['booking', 'confirmation', 'vendor_blocking', 'client_meeting', 'final_checklist', 'dispatch', 'event_execution', 'payment_closure', 'feedback'];
function workflowProgress(stage: string, status: EventJob['status']) {
  if (status === 'Completed') return 100;
  const index = WORKFLOW_STAGES.indexOf(stage);
  return index < 0 ? 10 : Math.max(10, Math.round(((index + 1) / WORKFLOW_STAGES.length) * 100));
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function CrmDashboard() {
  const { open } = useSidebar();
  const { profile } = useCrmProfile();
  const isManager = isCrmManagerRole(profile?.role);
  const canReviewLeave = !isManager || resolveSectionAccess(profile?.role, profile?.sectionAccess, 'leaveManagement');
  const canViewEventJobs = !isManager || resolveSectionAccess(profile?.role, profile?.sectionAccess, 'eventJobs');
  const canReviewReports = !isManager || resolveSectionAccess(profile?.role, profile?.sectionAccess, 'dailyWorkReports');
  const [loading, setLoading] = useState(true);

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [leadTotal, setLeadTotal] = useState(0);
  const [pendingLeave, setPendingLeave] = useState(0);
  const [staffRoster, setStaffRoster] = useState<StaffRosterRow[]>([]);
  const [taskCounts, setTaskCounts] = useState({ completed: 0, inProgress: 0, pending: 0, overdue: 0, total: 0 });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [eventJobs, setEventJobs] = useState<EventJob[]>([]);
  const [financials, setFinancials] = useState({ invoiced: 0, collected: 0, outstanding: 0, overdue: 0 });
  const [reportsSubmitted, setReportsSubmitted] = useState(0);
  const [birthdays, setBirthdays] = useState<BirthdayEvent[]>([]);
  const [holidays, setHolidays] = useState<HolidayEvent[]>([]);
  const [monthCursor, setMonthCursor] = useState(() => new Date());

  useEffect(() => {
    async function load() {
      try {
        const today = new Date().toISOString().slice(0, 10);
        // A Manager account can't read Vendors/Leads/Agreements/Invoices
        // (those stay Admin-only), so skip fetching them entirely rather
        // than showing misleading zeros from a blocked query.
        const [vendors, leads, _quotations, agreements, invoices, taskRows, staff, attendanceRows, taskAssigneeRows, jobRows, reportRows] = await Promise.all([
          isManager ? Promise.resolve([]) : getVendors(),
          isManager ? Promise.resolve([]) : getLeads(),
          isManager ? Promise.resolve([]) : getQuotations(),
          isManager ? Promise.resolve([]) : getAgreements(),
          isManager ? Promise.resolve([]) : getInvoices(),
          crmSupabase.from('crm_tasks').select('status, due_date'),
          getStaff({ status: 'Active' }),
          crmSupabase.from('crm_attendance').select('staff_id, check_in, check_out').eq('attendance_date', today),
          crmSupabase.from('crm_tasks').select('status, crm_task_assignees(staff_user_id)').not('status', 'in', '(Completed,Rejected)'),
          canViewEventJobs ? getEventJobs().catch(() => []) : Promise.resolve([]),
          canReviewReports ? crmSupabase.from('crm_daily_work_reports').select('report_status').eq('report_date', today) : Promise.resolve({ data: [], error: null }),
        ]);

        setVendors(vendors);
        setLeadTotal(leads.length);
        setFinancials({
          invoiced: invoices.reduce((sum, invoice) => sum + Number(invoice.total_amount || 0), 0),
          collected: invoices.reduce((sum, invoice) => sum + Number(invoice.amount_paid || 0), 0),
          outstanding: invoices.reduce((sum, invoice) => sum + Number(invoice.balance_due || 0), 0),
          overdue: invoices.filter((invoice) => effectiveInvoiceStatus(invoice) === 'Overdue').reduce((sum, invoice) => sum + Number(invoice.balance_due || 0), 0),
        });
        setEvents(deriveConfirmedEvents(agreements, invoices));
        setEventJobs(jobRows);
        setReportsSubmitted((reportRows.data || []).filter((report) => ['SUBMITTED', 'REVIEWED'].includes(String(report.report_status))).length);
        if (canReviewLeave) {
          const { count } = await crmSupabase.from('crm_leave_requests').select('id', { count: 'exact', head: true }).eq('status', 'Pending');
          setPendingLeave(count || 0);
        }

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
  }, [isManager, canReviewLeave, canReviewReports, canViewEventJobs]);

  useEffect(() => {
    (async () => {
      try {
        const year=monthCursor.getFullYear(); const years=[year-1,year,year+1];
        const [birthdayRows,holidayRows]=await Promise.all([getStaffBirthdaysForYears(years),getCompanyHolidaysForYears(years)]);
        setBirthdays(birthdayRows); setHolidays(holidayRows);
      } catch (err) { console.error(err); }
    })();
  }, [monthCursor]);

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

  const holidaysByDate = useMemo(() => {
    const map: Record<string, HolidayEvent[]> = {};
    holidays.forEach((holiday) => { (map[holiday.holiday_date] ||= []).push(holiday); });
    return map;
  }, [holidays]);

  const monthLabel = monthCursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const monthPrefix = `${monthCursor.getFullYear()}-${String(monthCursor.getMonth() + 1).padStart(2, '0')}`;
  const monthEvents = events.filter((event) => event.event_date.startsWith(monthPrefix)).sort((a, b) => a.event_date.localeCompare(b.event_date));
  const monthBirthdays = birthdays.filter((birthday) => birthday.date.startsWith(monthPrefix)).sort((a, b) => a.date.localeCompare(b.date));
  const monthHolidays = holidays.filter((holiday) => holiday.holiday_date.startsWith(monthPrefix)).sort((a, b) => a.holiday_date.localeCompare(b.holiday_date));
  const todayKey = dateKey(new Date());
  const shiftMonth = (delta: number) => setMonthCursor((cursor) => new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  const openTasks = taskCounts.pending + taskCounts.inProgress;
  const staffOnDuty = staffRoster.filter((row) => row.checkIn && !row.checkOut).length;
  const attendanceRate = staffRoster.length ? Math.round((staffRoster.filter((row) => row.checkIn).length / staffRoster.length) * 100) : 0;
  const upcomingJobs = eventJobs.filter((job) => job.event_date >= todayKey && !['Completed', 'Cancelled'].includes(job.status)).slice(0, 5);
  const upcomingEventCount = events.filter((event) => event.event_date >= todayKey).length;
  const dashboardKpis = isManager ? [
    { label: 'Upcoming Events', value: upcomingEventCount, note: 'Confirmed bookings', icon: CalendarDays, tone: 'bg-red-50 text-red-600', href: '/crm/event-calendar' },
    { label: 'Active Staff', value: staffRoster.length, note: 'Current team', icon: UserCog, tone: 'bg-blue-50 text-blue-600', href: '/crm/staff' },
    { label: 'Staff On Duty', value: `${staffOnDuty}/${staffRoster.length}`, note: 'Working now', icon: Users, tone: 'bg-emerald-50 text-emerald-600', href: '/crm/attendance' },
    { label: 'Open Tasks', value: openTasks, note: `${taskCounts.overdue} overdue`, icon: ListChecks, tone: 'bg-amber-50 text-amber-600', href: '/crm/tasks' },
    { label: 'Leave Pending', value: pendingLeave, note: 'Awaiting review', icon: CalendarRange, tone: 'bg-violet-50 text-violet-600', href: '/crm/leave' },
  ] : [
    { label: 'Upcoming Events', value: upcomingEventCount, note: 'Confirmed bookings', icon: CalendarDays, tone: 'bg-red-50 text-red-600', href: '/crm/event-calendar' },
    { label: 'Open Leads', value: leadTotal, note: 'Across all sources', icon: UserSearch, tone: 'bg-emerald-50 text-emerald-600', href: '/crm/leads' },
    { label: 'Outstanding', value: currency(financials.outstanding), note: 'Total balance due', icon: IndianRupee, tone: 'bg-amber-50 text-amber-600', href: '/crm/invoices' },
    { label: 'Staff On Duty', value: `${staffOnDuty}/${staffRoster.length}`, note: 'Working now', icon: Users, tone: 'bg-blue-50 text-blue-600', href: '/crm/attendance' },
    { label: 'Open Tasks', value: openTasks, note: `${taskCounts.overdue} overdue`, icon: ListChecks, tone: 'bg-violet-50 text-violet-600', href: '/crm/tasks' },
  ];
  const quickActions = isManager ? [
    { label: 'Attendance', href: '/crm/attendance', icon: Users },
    ...(canReviewLeave ? [{ label: 'Review Leave', href: '/crm/leave', icon: CalendarRange }] : []),
    ...(canReviewReports ? [{ label: 'Work Reports', href: '/crm/daily-work-reports', icon: FilePlus2 }] : []),
    ...(canViewEventJobs ? [{ label: 'Event Jobs', href: '/crm/event-jobs', icon: CalendarDays }] : []),
  ] : [
    { label: 'Add Lead', href: '/crm/leads/new', icon: UserPlus },
    { label: 'Create Quotation', href: '/crm/quotations/new', icon: FilePlus2 },
    { label: 'Create Agreement', href: '/crm/agreements/new', icon: FileSignature },
    { label: 'Record Payment', href: '/crm/invoices', icon: Banknote },
  ];

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
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          {/* KPI row */}
          <div className="order-1 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {dashboardKpis.map(({ label, value, note, icon: Icon, tone, href }) => (
              <Link key={label} href={href} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></span>
                  <div className="min-w-0"><p className="truncate text-xl font-black leading-tight text-gray-950 tabular-nums sm:text-2xl">{value}</p><p className="truncate text-[11px] font-bold text-gray-700">{label}</p></div>
                </div>
                <p className="mt-2.5 truncate text-[10px] font-semibold text-gray-400">{note}</p>
              </Link>
            ))}
          </div>

          <div className="order-5"><DownloadCenterCard vendors={vendors} canDownloadVendors={!isManager} /></div>

          {/* Event operations + financial/manager snapshot */}
          <div className="order-3 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(19rem,0.8fr)]">
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4"><div><h3 className="text-sm font-black text-gray-900">Upcoming Event Operations</h3><p className="mt-1 text-[10px] font-semibold text-gray-400">Live workflow status from Event Jobs</p></div>{canViewEventJobs&&<Link href="/crm/event-jobs" className="text-xs font-bold text-red-600 hover:underline">View all</Link>}</div>
              {!canViewEventJobs?<div className="px-5 py-12 text-center text-xs font-semibold text-gray-400">Event Jobs access is not enabled for this account.</div>:!upcomingJobs.length?<div className="px-5 py-12 text-center"><CalendarDays size={24} className="mx-auto text-gray-300"/><p className="mt-2 text-xs font-semibold text-gray-400">No upcoming active Event Jobs</p></div>:<><div className="hidden overflow-x-auto md:block"><table className="w-full text-left"><thead className="bg-gray-50 text-[9px] font-black uppercase tracking-wider text-gray-400"><tr><th className="px-5 py-3">Event</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Workflow</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-gray-100">{upcomingJobs.map(job=>{const progress=workflowProgress(job.current_stage_key,job.status);return <tr key={job.id} className="hover:bg-gray-50"><td className="px-5 py-3.5"><Link href={`/crm/event-jobs/${job.id}`} className="text-xs font-black text-gray-900 hover:text-red-600">{job.event_name||job.client_name}</Link><p className="mt-0.5 text-[10px] text-gray-400">{job.client_name} · {job.city||'City not set'}</p></td><td className="px-4 py-3.5 text-xs font-semibold text-gray-600">{new Date(`${job.event_date}T00:00:00`).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</td><td className="min-w-44 px-4 py-3.5"><div className="flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100"><span className="block h-full rounded-full bg-emerald-500" style={{width:`${progress}%`}}/></div><b className="text-[10px] text-gray-500">{progress}%</b></div><p className="mt-1 text-[9px] capitalize text-gray-400">{job.current_stage_key.replaceAll('_',' ')}</p></td><td className="px-5 py-3.5"><span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase ${job.status==='Blocked'||job.status==='Needs Rework'?'bg-red-50 text-red-600':'bg-emerald-50 text-emerald-700'}`}>{job.status}</span></td></tr>})}</tbody></table></div><div className="divide-y md:hidden">{upcomingJobs.map(job=><Link key={job.id} href={`/crm/event-jobs/${job.id}`} className="block p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><b className="block truncate text-xs text-gray-900">{job.event_name||job.client_name}</b><p className="mt-1 text-[10px] text-gray-400">{job.client_name} · {new Date(`${job.event_date}T00:00:00`).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}</p></div><span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[8px] font-black uppercase text-gray-600">{job.status}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100"><span className="block h-full rounded-full bg-emerald-500" style={{width:`${workflowProgress(job.current_stage_key,job.status)}%`}}/></div></Link>)}</div></>}
            </section>
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4"><h3 className="text-sm font-black text-gray-900">{isManager?'Operations Snapshot':'Financial Snapshot'}</h3><p className="mt-1 text-[10px] font-semibold text-gray-400">{isManager?'Live team compliance':'Live totals from invoices and payments'}</p></div>
              <div className="divide-y divide-gray-100 px-5">{(isManager?[['Attendance today',`${attendanceRate}%`],['Open tasks',openTasks],['Overdue tasks',taskCounts.overdue],['Reports submitted',`${reportsSubmitted}/${staffRoster.length}`],['Pending leave',pendingLeave]]:[['Total invoiced',currency(financials.invoiced)],['Collected',currency(financials.collected)],['Outstanding',currency(financials.outstanding)],['Overdue',currency(financials.overdue)]]).map(([label,value])=><div key={String(label)} className="flex items-center justify-between gap-4 py-4"><span className="text-xs font-semibold text-gray-500">{label}</span><b className={`text-sm tabular-nums ${label==='Overdue'&&Number(financials.overdue)>0?'text-red-600':'text-gray-950'}`}>{value}</b></div>)}</div>
              <Link href={isManager?'/crm/daily-work-reports':'/crm/invoices'} className="m-4 block rounded-xl bg-gray-950 px-4 py-3 text-center text-xs font-bold text-white hover:bg-red-600">{isManager?'View daily reports':'View invoices & payments'} →</Link>
            </section>
          </div>

          <div className="order-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.9fr)]">
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4"><div><h3 className="text-sm font-black text-gray-900">Team Compliance</h3><p className="mt-1 text-[10px] font-semibold text-gray-400">Today&rsquo;s attendance, reports and approvals</p></div><Link href="/crm/attendance" className="text-xs font-bold text-red-600 hover:underline">View details</Link></div>
              <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">{[
                {label:'Attendance',value:`${attendanceRate}%`,note:`${staffOnDuty} on duty`,tone:'text-emerald-600'},
                {label:'Pending Leave',value:pendingLeave,note:'Awaiting approval',tone:'text-violet-600'},
                {label:'Reports Submitted',value:reportsSubmitted,note:`of ${staffRoster.length} staff`,tone:'text-blue-600'},
                {label:'Overdue Tasks',value:taskCounts.overdue,note:'Need attention',tone:'text-red-600'},
              ].map(item=><div key={item.label} className="min-w-0 p-4 sm:p-5"><b className={`block text-2xl font-black tabular-nums ${item.tone}`}>{item.value}</b><p className="mt-2 truncate text-[10px] font-black uppercase tracking-wide text-gray-600">{item.label}</p><p className="mt-1 truncate text-[9px] font-semibold text-gray-400">{item.note}</p></div>)}</div>
            </section>
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4"><h3 className="text-sm font-black text-gray-900">Quick Actions</h3><p className="mt-1 text-[10px] font-semibold text-gray-400">Frequently used CRM actions</p></div>
              <div className="grid grid-cols-2 gap-3 p-4">{quickActions.map(({label,href,icon:Icon})=><Link key={label} href={href} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/30 p-3 text-center text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"><Icon size={20}/><span className="text-[10px] font-black">{label}</span></Link>)}</div>
            </section>
          </div>

          {/* Compact full-month calendar */}
          <div className="order-6 grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(17rem,0.7fr)]">
            <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5 sm:px-5">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900"><CalendarDays size={16} className="text-red-500" /> Event Operations Calendar</h3>
                  <p className="mt-0.5 text-[11px] font-medium text-gray-400">Confirmed events, team birthdays and company holidays</p>
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
                  const dayHolidays = holidaysByDate[key] || [];
                  const isToday = key === todayKey;
                  const inMonth = day.getMonth() === monthCursor.getMonth();
                  const visibleHolidayCount = Math.min(1, dayHolidays.length);
                  const visibleBirthdayCount = Math.min(1, dayBirthdays.length);
                  const visibleEventCount = Math.min(dayBirthdays.length || dayHolidays.length ? 1 : 2, dayEvents.length);
                  const hiddenItems = Math.max(0, dayEvents.length + dayBirthdays.length + dayHolidays.length - visibleHolidayCount - visibleBirthdayCount - visibleEventCount);
                  return (
                    <div key={key} className={`min-h-[4.8rem] min-w-0 p-1.5 sm:min-h-[5.6rem] sm:p-2 ${inMonth ? 'bg-white' : 'bg-gray-50/80'}`}>
                      <div className={`mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black sm:h-6 sm:w-6 sm:text-[11px] ${isToday ? 'bg-red-600 text-white shadow-sm' : inMonth ? 'text-gray-700' : 'text-gray-300'}`}>{day.getDate()}</div>
                      <div className="space-y-1">
                        {dayHolidays.slice(0, 1).map((holiday) => (
                          <div key={`h-${holiday.holiday_key}`} title={holiday.name} className="flex items-center gap-1 truncate rounded bg-amber-50 px-1 py-0.5 text-[8px] font-bold text-amber-800 sm:text-[9px]">
                            <PartyPopper size={8} className="shrink-0" /><span className="truncate">{holiday.name}</span>
                          </div>
                        ))}
                        {dayBirthdays.slice(0, 1).map((birthday) => (
                          <div key={`b-${birthday.staff_id}`} title={`${birthday.full_name}'s birthday`} className="flex items-center gap-1 truncate rounded bg-pink-50 px-1 py-0.5 text-[8px] font-bold text-pink-700 sm:text-[9px]">
                            <Cake size={8} className="shrink-0" /><span className="truncate">{birthday.full_name}</span>
                          </div>
                        ))}
                        {dayEvents.slice(0, dayBirthdays.length || dayHolidays.length ? 1 : 2).map((event, index) => (
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
              <div className="grid grid-cols-3 gap-2 p-4">
                <div className="rounded-xl bg-blue-50 p-3"><p className="text-2xl font-black text-blue-700 tabular-nums">{monthEvents.length}</p><p className="mt-0.5 text-[10px] font-bold text-blue-600/70">Confirmed events</p></div>
                <div className="rounded-xl bg-pink-50 p-3"><p className="text-2xl font-black text-pink-700 tabular-nums">{monthBirthdays.length}</p><p className="mt-0.5 text-[10px] font-bold text-pink-600/70">Team birthdays</p></div>
                <div className="rounded-xl bg-amber-50 p-3"><p className="text-2xl font-black text-amber-700 tabular-nums">{monthHolidays.length}</p><p className="mt-0.5 text-[10px] font-bold text-amber-700/70">Holidays</p></div>
              </div>
              <div className="min-h-0 flex-1 px-4 pb-4">
                <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-wider text-gray-400">Upcoming this month</p>
                <div className="space-y-2">
                  {!monthEvents.length && !monthBirthdays.length && !monthHolidays.length ? (
                    <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center"><CalendarDays size={20} className="mx-auto mb-2 text-gray-300" /><p className="text-xs font-semibold text-gray-400">Nothing scheduled</p></div>
                  ) : (
                    <>
                      {monthHolidays.slice(0, 2).map((holiday) => (
                        <div key={holiday.holiday_key} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700"><PartyPopper size={15} /></span><span className="min-w-0"><b className="block truncate text-xs text-gray-800">{holiday.name}</b><small className="text-[10px] font-medium text-amber-700">Company holiday · {Number(holiday.holiday_date.slice(8, 10))} {monthCursor.toLocaleDateString('en-IN', { month: 'short' })}</small></span></div>
                      ))}
                      {monthEvents.slice(0, Math.max(0, 4 - monthHolidays.length)).map((event) => (
                        <Link key={event.agreement_id} href={`/crm/agreements/${event.agreement_id}`} className="flex items-center gap-3 rounded-xl border border-gray-100 p-2.5 transition-colors hover:border-red-100 hover:bg-red-50/40">
                          <span className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-gray-900 text-white"><b className="text-xs leading-none">{Number(event.event_date.slice(8, 10))}</b><small className="mt-0.5 text-[7px] font-bold uppercase text-white/60">{new Date(`${event.event_date}T00:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</small></span>
                          <span className="min-w-0"><b className="block truncate text-xs text-gray-800">{event.groom_name || event.client_name}{event.bride_name ? ` & ${event.bride_name}` : ''}</b><small className="block truncate text-[10px] font-medium text-gray-400">{event.package_name}</small></span>
                        </Link>
                      ))}
                      {monthBirthdays.slice(0, Math.max(0, 4 - monthEvents.length - monthHolidays.length)).map((birthday) => (
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
