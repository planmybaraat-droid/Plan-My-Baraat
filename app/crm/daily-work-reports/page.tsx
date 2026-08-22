'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ClipboardList, Eye, Loader2, Mail, RefreshCw, Search, Send, UserRound, X } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import { useSidebar } from '../sidebar-context';
import {
  getAdminDailyReports, getDailyReportStaff, indiaDate,
  type DailyReportStaff, type DailyWorkReport,
} from '../lib/daily-work-report-data';
import { useCrmProfile } from '../lib/useCrmProfile';

const formatDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default function AdminDailyWorkReportsPage() {
  const { open } = useSidebar();
  const { profile } = useCrmProfile();
  const [date, setDate] = useState(indiaDate());
  const [staff, setStaff] = useState<DailyReportStaff[]>([]);
  const [reports, setReports] = useState<DailyWorkReport[]>([]);
  const [staffFilter, setStaffFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<DailyWorkReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deliveryState, setDeliveryState] = useState<{settings:{recipient_email:string|null};attendance:{business_timezone:string;lock_time:string};deliveries:Array<{id:string;report_date:string;status:'PENDING'|'SENDING'|'SENT'|'FAILED';attempt_count:number;sent_at:string|null;error_message:string|null}>;providerConfigured:boolean;cronConfigured:boolean}|null>(null);
  const [deliveryBusy,setDeliveryBusy]=useState(false);
  const [deliveryMessage,setDeliveryMessage]=useState('');
  const isAdmin=profile?.role==='admin'||profile?.role==='super_admin';

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [staffRows, reportRows] = await Promise.all([getDailyReportStaff(), getAdminDailyReports(date)]);
      setStaff(staffRows); setReports(reportRows);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load daily work reports.'); }
    finally { setLoading(false); }
  }, [date]);
  useEffect(() => { load(); }, [load]);
  const loadDelivery=useCallback(async()=>{if(!isAdmin)return;try{const response=await fetch('/api/crm/daily-staff-report',{cache:'no-store'});const payload=await response.json();if(!response.ok)throw new Error(payload.error||'Unable to load email delivery history.');setDeliveryState(payload);}catch(cause){setDeliveryMessage(cause instanceof Error?cause.message:'Unable to load email delivery history.');}},[isAdmin]);
  useEffect(()=>{loadDelivery();},[loadDelivery]);
  const sendReportEmail=async()=>{setDeliveryBusy(true);setDeliveryMessage('');try{const response=await fetch('/api/crm/daily-staff-report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({report_date:date,retry_failed:true})});const payload=await response.json();if(!response.ok)throw new Error(payload.error||payload.reason||'Unable to send the report.');setDeliveryMessage(payload.skipped?payload.reason:'Daily staff report sent successfully.');await loadDelivery();}catch(cause){setDeliveryMessage(cause instanceof Error?cause.message:'Unable to send the report.');await loadDelivery();}finally{setDeliveryBusy(false)}};

  const reportByStaff = useMemo(() => new Map(reports.map((report) => [report.user_id, report])), [reports]);
  const rows = useMemo(() => staff.filter((person) => {
    const report = reportByStaff.get(person.id);
    const name = `${person.full_name || ''} ${person.email || ''}`.toLowerCase();
    if (staffFilter && person.id !== staffFilter) return false;
    if (search && !name.includes(search.toLowerCase())) return false;
    if (statusFilter === 'NOT_SUBMITTED' && report) return false;
    if (statusFilter && statusFilter !== 'NOT_SUBMITTED' && report?.report_status !== statusFilter) return false;
    return true;
  }), [staff, reportByStaff, staffFilter, statusFilter, search]);
  const submitted = reports.filter((report) => ['SUBMITTED', 'REVIEWED'].includes(report.report_status)).length;
  const pendingStaff = Math.max(0, staff.length - submitted);
  const selectedDelivery=deliveryState?.deliveries.find(item=>item.report_date===date);

  return <>
    <CrmHeader title="Daily Work Reports" subtitle="Date-wise staff activity and report status" onMenuClick={open} />
    <div className="mx-auto w-full max-w-7xl space-y-4 p-3 sm:p-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Summary label="Staff" value={staff.length} color="text-gray-950" />
        <Summary label="Submitted" value={submitted} color="text-emerald-600" />
        <Summary label="Not submitted" value={pendingStaff} color="text-amber-600" />
        <Summary label="Activities" value={reports.reduce((sum, report) => sum + report.items.length, 0)} color="text-red-600" />
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <label className="relative min-w-0"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search staff" className="h-10 w-full min-w-0 rounded-xl border border-gray-200 pl-9 pr-3 text-xs outline-none focus:border-red-500" /></label>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-10 min-w-0 rounded-xl border border-gray-200 bg-white px-3 text-xs outline-none focus:border-red-500" />
          <select value={staffFilter} onChange={(event) => setStaffFilter(event.target.value)} className="h-10 min-w-0 rounded-xl border border-gray-200 bg-white px-3 text-xs outline-none focus:border-red-500"><option value="">All Staff</option>{staff.map((person) => <option key={person.id} value={person.id}>{person.full_name || person.email}</option>)}</select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 min-w-0 rounded-xl border border-gray-200 bg-white px-3 text-xs outline-none focus:border-red-500"><option value="">All Statuses</option><option value="SUBMITTED">Submitted</option><option value="DRAFT">Draft</option><option value="REVIEWED">Reviewed</option><option value="NOT_SUBMITTED">Not Submitted</option></select>
        </div>
      </section>

      {isAdmin&&deliveryState&&<section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><Mail size={18}/></span><div className="min-w-0"><h2 className="text-sm font-black text-gray-950">Boss email delivery</h2><p className="mt-1 break-words text-[10px] text-gray-400">Automatic at 05:00 AM Asia/Kolkata · Recipient {deliveryState.settings.recipient_email||'not configured'}</p></div></div><button onClick={sendReportEmail} disabled={deliveryBusy||!deliveryState.providerConfigured||date>=indiaDate()||selectedDelivery?.status==='SENT'||selectedDelivery?.status==='SENDING'} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400">{deliveryBusy?<Loader2 size={14} className="animate-spin"/>:selectedDelivery?.status==='FAILED'?<RefreshCw size={14}/>:<Send size={14}/>} {selectedDelivery?.status==='SENT'?'Already sent':selectedDelivery?.status==='FAILED'?'Retry email':'Send email'}</button></div><div className="flex flex-wrap items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3"><span className="text-[10px] font-black uppercase tracking-wide text-gray-400">Report date to send</span><input type="date" value={date} max={indiaDate(-1)} onChange={(event) => setDate(event.target.value)} className="h-9 min-w-0 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-red-500" /><button type="button" onClick={() => setDate(indiaDate(-1))} className={`rounded-lg border px-3 py-2 text-[10px] font-bold ${date===indiaDate(-1)?'border-red-600 bg-red-50 text-red-600':'border-gray-200 text-gray-500 hover:bg-white'}`}>Yesterday</button>{date>=indiaDate()&&<span className="text-[10px] font-semibold text-amber-600">Today isn&rsquo;t locked yet — pick an earlier date to send.</span>}</div><div className="grid gap-3 p-4 sm:grid-cols-3"><DeliveryFact label="Selected date" value={formatDate(date)}/><DeliveryFact label="Email status" value={selectedDelivery?.status||'NOT GENERATED'} tone={selectedDelivery?.status}/><DeliveryFact label="Attempts / sent time" value={selectedDelivery?`${selectedDelivery.attempt_count} attempt${selectedDelivery.attempt_count===1?'':'s'}${selectedDelivery.sent_at?` · ${new Date(selectedDelivery.sent_at).toLocaleString('en-IN')}`:''}`:'—'}/></div>{(!deliveryState.providerConfigured||!deliveryState.cronConfigured||deliveryMessage||selectedDelivery?.error_message)&&<div className={`border-t px-4 py-3 text-[10px] font-semibold ${selectedDelivery?.status==='FAILED'||!deliveryState.providerConfigured?'border-red-100 bg-red-50 text-red-700':'border-gray-100 bg-gray-50 text-gray-600'}`}>{deliveryMessage||selectedDelivery?.error_message||(!deliveryState.providerConfigured?'Email SMTP credentials still need to be added to the production environment.':'Production cron secret still needs to be configured.')}</div>}</section>}

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">{error}</div>}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-4 sm:px-5"><h2 className="text-sm font-black text-gray-950">Reports for {formatDate(date)}</h2><p className="mt-1 text-[10px] text-gray-400">{rows.length} staff member{rows.length === 1 ? '' : 's'}</p></div>
        {loading ? <div className="flex h-60 items-center justify-center"><Loader2 className="animate-spin text-red-600" size={26} /></div> : !rows.length ? <div className="px-5 py-16 text-center"><ClipboardList className="mx-auto text-red-600" size={28} /><p className="mt-3 text-sm font-black">No matching staff reports</p><p className="mt-1 text-xs text-gray-400">Change the date or filters to view other reports.</p></div> : <>
          <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[720px] text-left"><thead className="bg-gray-50 text-[9px] font-black uppercase tracking-wider text-gray-400"><tr><th className="px-5 py-3">Staff</th><th className="px-4 py-3 text-center">Activities</th><th className="px-4 py-3 text-center">Done</th><th className="px-4 py-3 text-center">Pending</th><th className="px-4 py-3">Report Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{rows.map((person) => { const report = reportByStaff.get(person.id); const done = report?.items.filter((item) => item.activity_status === 'DONE').length || 0; const pending = (report?.items.length || 0) - done; return <tr key={person.id} className="hover:bg-gray-50"><td className="px-5 py-4"><p className="text-xs font-bold text-gray-900">{person.full_name || 'Staff'}</p><p className="mt-0.5 text-[10px] text-gray-400">{person.email}</p></td><td className="px-4 py-4 text-center text-xs font-bold">{report?.items.length ?? '—'}</td><td className="px-4 py-4 text-center text-xs font-bold text-emerald-600">{report ? done : '—'}</td><td className="px-4 py-4 text-center text-xs font-bold text-amber-600">{report ? pending : '—'}</td><td className="px-4 py-4"><ReportBadge value={report?.report_status || 'NOT SUBMITTED'} /></td><td className="px-5 py-4 text-right">{report ? <button onClick={() => setSelected(report)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-[10px] font-bold text-gray-700 hover:bg-gray-50"><Eye size={12} /> View</button> : <span className="text-[10px] text-gray-300">No report</span>}</td></tr>; })}</tbody></table></div>
          <div className="divide-y divide-gray-100 md:hidden">{rows.map((person) => { const report = reportByStaff.get(person.id); const done = report?.items.filter((item) => item.activity_status === 'DONE').length || 0; return <button key={person.id} disabled={!report} onClick={() => report && setSelected(report)} className="flex w-full min-w-0 items-center gap-3 p-4 text-left disabled:cursor-default"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500"><UserRound size={16} /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-gray-900">{person.full_name || 'Staff'}</p><p className="mt-1 truncate text-[10px] text-gray-400">{report ? `${report.items.length} activities · ${done} done · ${report.items.length - done} pending` : 'No report submitted'}</p></div><ReportBadge value={report?.report_status || 'NOT SUBMITTED'} /></button>; })}</div>
        </>}
      </section>
    </div>

    {selected && (() => { const person = staff.find((entry) => entry.id === selected.user_id); const done = selected.items.filter((item) => item.activity_status === 'DONE').length; return <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"><button className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} aria-label="Close report" /><div className="relative max-h-[calc(100vh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white p-4 sm:p-5"><div className="min-w-0"><h2 className="truncate text-base font-black text-gray-950">{person?.full_name || person?.email || 'Staff'}</h2><p className="mt-1 text-xs text-gray-400">Daily Work Report · {formatDate(selected.report_date)}</p></div><button onClick={() => setSelected(null)} className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X size={18} /></button></div><div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 p-4"><div className="text-center"><b className="block text-lg font-black">{selected.items.length}</b><small className="text-[9px] uppercase text-gray-400">Activities</small></div><div className="text-center"><b className="block text-lg font-black text-emerald-600">{done}</b><small className="text-[9px] uppercase text-gray-400">Done</small></div><div className="text-center"><b className="block text-lg font-black text-amber-600">{selected.items.length - done}</b><small className="text-[9px] uppercase text-gray-400">Pending</small></div></div><div className="divide-y divide-gray-100">{selected.items.map((item, index) => <article key={item.id} className="min-w-0 p-4 sm:p-5"><div className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] font-black text-gray-500">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="break-words text-sm font-black text-gray-900">{item.activity_title}</h3><ReportBadge value={item.activity_status} /></div><p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-600">{item.description}</p></div></div></article>)}</div><div className="border-t border-gray-100 p-4 text-[10px] text-gray-400">Report status: <b className="text-gray-600">{selected.report_status}</b>{selected.submitted_at && <> · Submitted {new Date(selected.submitted_at).toLocaleString('en-IN')}</>}</div></div></div>; })()}
  </>;
}

function Summary({ label, value, color }: { label: string; value: number; color: string }) {
  return <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><p className={`text-2xl font-black ${color}`}>{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</p></div>;
}

function ReportBadge({ value }: { value: string }) {
  const style = value === 'DONE' || value === 'SUBMITTED' || value === 'REVIEWED' ? 'bg-emerald-50 text-emerald-700' : value === 'PENDING' || value === 'DRAFT' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500';
  return <span className={`max-w-[7.5rem] shrink-0 truncate rounded-full px-2.5 py-1 text-[8px] font-black uppercase ${style}`}>{value}</span>;
}

function DeliveryFact({label,value,tone}:{label:string;value:string;tone?:string}){const color=tone==='SENT'?'text-emerald-700':tone==='FAILED'?'text-red-700':tone==='SENDING'?'text-amber-700':'text-gray-800';return <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3"><p className="text-[8px] font-black uppercase tracking-wider text-gray-400">{label}</p><p className={`mt-1 break-words text-xs font-bold ${color}`}>{value}</p></div>}
