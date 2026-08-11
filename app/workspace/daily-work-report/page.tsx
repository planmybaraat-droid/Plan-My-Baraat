'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, Edit3,
  Loader2, Plus, Send, Trash2, XCircle,
} from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import ConfirmDialog from '../../crm/components/ConfirmDialog';
import { useSidebar } from '../../crm/sidebar-context';
import {
  getMyDailyReport, getMyDailyReportHistory, getMyRelatedTasks, indiaDate, isStaffEditableDate,
  removeDailyActivity, saveDailyActivity, shiftDate, submitMyDailyReport,
  type DailyActivityStatus, type DailyWorkReport, type DailyWorkReportItem,
} from '../../crm/lib/daily-work-report-data';

const formatDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function DailyWorkReportPage() {
  const { open } = useSidebar();
  const today = indiaDate();
  const yesterday = shiftDate(today, -1);
  const [selectedDate, setSelectedDate] = useState(today);
  const [report, setReport] = useState<DailyWorkReport | null>(null);
  const [history, setHistory] = useState<DailyWorkReport[]>([]);
  const [tasks, setTasks] = useState<{ id: string; title: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DailyWorkReportItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<DailyWorkReportItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<DailyActivityStatus>('DONE');
  const [relatedTaskId, setRelatedTaskId] = useState('');

  const editable = isStaffEditableDate(selectedDate);
  const counts = useMemo(() => ({
    total: report?.items.length || 0,
    done: report?.items.filter((item) => item.activity_status === 'DONE').length || 0,
    pending: report?.items.filter((item) => item.activity_status === 'PENDING').length || 0,
  }), [report]);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [current, reports] = await Promise.all([getMyDailyReport(selectedDate), getMyDailyReportHistory()]);
      setReport(current); setHistory(reports);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load the report.'); }
    finally { setLoading(false); }
  }, [selectedDate]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { getMyRelatedTasks().then(setTasks).catch(() => setTasks([])); }, []);

  function openForm(item?: DailyWorkReportItem) {
    setEditing(item || null); setTitle(item?.activity_title || ''); setDescription(item?.description || '');
    setStatus(item?.activity_status || 'DONE'); setRelatedTaskId(item?.related_task_id || ''); setError(''); setFormOpen(true);
  }

  async function save() {
    if (!title.trim() || !description.trim()) { setError('Task / Activity and Description are required.'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      await saveDailyActivity({ reportDate: selectedDate, id: editing?.id, title, description, status, relatedTaskId });
      setFormOpen(false); setSuccess(editing ? 'Activity updated.' : 'Activity added.'); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to save activity. Please try again.'); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (!report || !deleteItem) return;
    setSaving(true); setError('');
    try { await removeDailyActivity(report.id, deleteItem.id); setDeleteItem(null); setSuccess('Activity removed.'); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to remove activity.'); }
    finally { setSaving(false); }
  }

  async function submit() {
    setSaving(true); setError(''); setSuccess('');
    try { await submitMyDailyReport(selectedDate); setSuccess('Daily work report submitted.'); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to submit report.'); }
    finally { setSaving(false); }
  }

  return <>
    <CrmHeader title="Daily Work Report" subtitle="Record what you worked on — no time tracking" onMenuClick={open} notificationsHref="/workspace/notifications" />
    <div className="mx-auto w-full max-w-6xl space-y-4 p-3 sm:p-6">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-w-0 items-center justify-between gap-2 border-b border-gray-100 p-3 sm:p-5">
          <button onClick={() => setSelectedDate(shiftDate(selectedDate, -1))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50" aria-label="Previous day"><ChevronLeft size={17} /></button>
          <div className="min-w-0 text-center"><p className="truncate text-sm font-black text-gray-950 sm:text-base">{formatDate(selectedDate)}</p><p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">{selectedDate === today ? 'Today · Editable' : selectedDate === yesterday ? 'Yesterday · Editable' : 'Historical · Read only'}</p></div>
          <button onClick={() => setSelectedDate(shiftDate(selectedDate, 1))} disabled={selectedDate >= today} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30" aria-label="Next day"><ChevronRight size={17} /></button>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-100 p-3 sm:p-5">
          <div className="text-center"><b className="block text-xl font-black text-gray-950">{counts.total}</b><span className="text-[9px] font-bold uppercase tracking-wide text-gray-400">Activities</span></div>
          <div className="text-center"><b className="block text-xl font-black text-emerald-600">{counts.done}</b><span className="text-[9px] font-bold uppercase tracking-wide text-gray-400">Done</span></div>
          <div className="text-center"><b className="block text-xl font-black text-amber-600">{counts.pending}</b><span className="text-[9px] font-bold uppercase tracking-wide text-gray-400">Pending</span></div>
        </div>
      </section>

      {error && <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700"><XCircle size={15} className="mt-0.5 shrink-0" /><span className="break-words">{error}</span></div>}
      {success && <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700"><CheckCircle2 size={15} className="mt-0.5 shrink-0" />{success}</div>}
      {!editable && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">Report is read-only. Staff reports can be edited for today and the previous calendar day.</div>}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4">
          <div><h2 className="text-sm font-black text-gray-950">{selectedDate === today ? "Today's" : selectedDate === yesterday ? "Yesterday's" : formatDate(selectedDate)} Work Report</h2><p className="mt-0.5 text-[10px] font-semibold text-gray-400">Status: {report?.report_status || 'NOT STARTED'}</p></div>
          {editable && <button onClick={() => openForm()} className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-[11px] font-bold text-white hover:bg-red-700"><Plus size={14} /> Add Activity</button>}
        </div>
        {loading ? <div className="flex h-56 items-center justify-center"><Loader2 className="animate-spin text-red-600" size={26} /></div> : !report?.items.length ?
          <div className="px-5 py-16 text-center"><ClipboardList className="mx-auto text-red-600" size={30} /><p className="mt-3 text-sm font-black text-gray-900">No activities added for this date.</p>{editable && <button onClick={() => openForm()} className="mt-4 rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">+ Add Activity</button>}</div> :
          <div className="divide-y divide-gray-100">{report.items.map((item, index) => <article key={item.id} className="min-w-0 p-4 sm:p-5">
            <div className="flex min-w-0 items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] font-black text-gray-500">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><h3 className="min-w-0 break-words text-sm font-black text-gray-900">{item.activity_title}</h3><span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black ${item.activity_status === 'DONE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.activity_status}</span></div><p className="mt-2 whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-600">{item.description}</p>{editable && <div className="mt-3 flex gap-2"><button onClick={() => openForm(item)} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[10px] font-bold text-gray-600 hover:bg-gray-50"><Edit3 size={11} /> Edit</button><button onClick={() => setDeleteItem(item)} className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-2.5 py-1.5 text-[10px] font-bold text-red-600 hover:bg-red-50"><Trash2 size={11} /> Delete</button></div>}</div></div>
          </article>)}</div>}
        {editable && !!report?.items.length && <div className="flex justify-end border-t border-gray-100 p-4"><button onClick={submit} disabled={saving} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-black disabled:opacity-50">{saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} {report.report_status === 'SUBMITTED' ? 'Resubmit Report' : 'Submit Report'}</button></div>}
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="border-b border-gray-100 px-4 py-3 sm:px-5"><h2 className="text-sm font-black text-gray-950">Report History</h2><p className="mt-0.5 text-[10px] text-gray-400">Older reports remain available as read-only history.</p></div><div className="divide-y divide-gray-100">{history.length ? history.map((entry) => { const done = entry.items.filter((item) => item.activity_status === 'DONE').length; return <button key={entry.id} onClick={() => setSelectedDate(entry.report_date)} className="flex w-full min-w-0 items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 sm:px-5"><div className="min-w-0"><p className="truncate text-xs font-bold text-gray-900">{formatDate(entry.report_date)}</p><p className="mt-1 text-[10px] text-gray-400">{entry.items.length} Activities · {done} Done · {entry.items.length - done} Pending</p></div><span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[9px] font-black text-gray-600">{entry.report_status}</span></button>; }) : <p className="px-5 py-8 text-center text-xs text-gray-400">No previous reports yet.</p>}</div></section>
    </div>

    {formOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"><button className="absolute inset-0 bg-black/50" onClick={() => !saving && setFormOpen(false)} aria-label="Close" /><div className="relative max-h-[calc(100vh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-5"><div className="flex items-start justify-between"><div><h3 className="text-base font-black text-gray-950">{editing ? 'Edit Activity' : 'Add Task / Activity'}</h3><p className="mt-1 text-xs text-gray-400">{formatDate(selectedDate)}</p></div><button onClick={() => setFormOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><XCircle size={19} /></button></div><div className="mt-5 space-y-4"><label className="block"><span className="text-[10px] font-black uppercase tracking-wide text-gray-600">Task / Activity *</span><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} placeholder="e.g. CRM Dashboard Fix" className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red-500" /></label><label className="block"><span className="text-[10px] font-black uppercase tracking-wide text-gray-600">Description *</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} maxLength={5000} placeholder="Explain what was actually done..." className="mt-1.5 w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-red-500" /></label><div><span className="text-[10px] font-black uppercase tracking-wide text-gray-600">Status *</span><div className="mt-1.5 grid grid-cols-2 gap-2">{(['DONE', 'PENDING'] as const).map((value) => <button key={value} onClick={() => setStatus(value)} className={`rounded-xl border px-3 py-2.5 text-xs font-black ${status === value ? value === 'DONE' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-500'}`}>{value}</button>)}</div></div>{tasks.length > 0 && <label className="block"><span className="text-[10px] font-black uppercase tracking-wide text-gray-600">Related CRM Task (Optional)</span><select value={relatedTaskId} onChange={(event) => setRelatedTaskId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-red-500"><option value="">Manual activity — no related task</option>{tasks.map((task) => <option key={task.id} value={task.id}>{task.title} · {task.status}</option>)}</select></label>}</div><div className="mt-5 flex gap-2"><button onClick={() => setFormOpen(false)} disabled={saving} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600">Cancel</button><button onClick={save} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{saving && <Loader2 size={13} className="animate-spin" />} Save Activity</button></div></div></div>}
    <ConfirmDialog open={!!deleteItem} title="Delete this activity?" message="The activity will be removed from this daily report." confirmLabel="Delete" onConfirm={remove} onCancel={() => setDeleteItem(null)} loading={saving} />
  </>;
}
