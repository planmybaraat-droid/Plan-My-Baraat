'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, X, Flag, Users as UsersIcon, ChevronDown, ChevronUp, UserCircle2 } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import { useSidebar } from '../sidebar-context';
import { crmSupabase } from '../lib/supabase-crm';
import { getTasks, createTask, updateTaskStatus, type TaskRecord, type TaskPriority, type TaskStatus } from '../lib/task-data';

const STATUS_STYLE: Record<string, string> = {
  Pending: 'bg-gray-100 text-gray-600', Accepted: 'bg-blue-50 text-blue-700', 'In Progress': 'bg-amber-50 text-amber-700',
  'On Hold': 'bg-orange-50 text-orange-700', Completed: 'bg-emerald-50 text-emerald-700', Rejected: 'bg-red-50 text-red-700', 'Needs Revision': 'bg-purple-50 text-purple-700',
};
const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

function NewTaskModal({ staffOptions, onClose, onCreated }: { staffOptions: { id: string; name: string }[]; onClose: () => void; onCreated: (t: TaskRecord) => void }) {
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState(''); const [assignees, setAssignees] = useState<string[]>([]); const [saving, setSaving] = useState(false); const [error, setError] = useState('');

  const toggle = (id: string) => setAssignees((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const submit = async () => {
    if (!title.trim() || !assignees.length) { setError('Title and at least one assignee are required.'); return; }
    setSaving(true); setError('');
    try { onCreated(await createTask({ title, description, priority, due_date: dueDate || null, assignees })); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not create task.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between"><h2 className="text-lg font-black text-gray-950">Assign a new task</h2><button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X size={18} /></button></div>
        <div className="mt-4 space-y-4">
          <div><label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400" /></div>
          <div><label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Priority</label><select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400">{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select></div>
            <div><label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Due date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400" /></div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Assign to</label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {staffOptions.map((s) => (
                <button key={s.id} onClick={() => toggle(s.id)} className={`rounded-xl border px-3 py-2 text-xs font-bold ${assignees.includes(s.id) ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600'}`}>{s.name}</button>
              ))}
              {!staffOptions.length && <p className="text-xs text-gray-400">No staff members yet — add one first.</p>}
            </div>
          </div>
        </div>
        {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
        <div className="mt-5 flex justify-end gap-2"><button onClick={onClose} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold">Cancel</button><button onClick={submit} disabled={saving} className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">{saving ? 'Assigning…' : 'Assign task'}</button></div>
      </div>
    </div>
  );
}

function ReasonModal({ mode, onClose, onConfirm }: { mode: 'Needs Revision' | 'Rejected'; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  const isReject = mode === 'Rejected';
  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-950">{isReject ? 'Reject task' : 'Request revision'}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X size={18} /></button>
        </div>
        <p className="mt-2 text-xs text-gray-500">{isReject ? 'Tell the staff member why this task is being rejected.' : "Tell the staff member what needs to change — they'll see this on their task."}</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          autoFocus
          placeholder={isReject ? 'e.g. Wrong vendor details, please redo with correct info…' : 'e.g. Please add the payment schedule before resubmitting…'}
          className="mt-3 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold">Cancel</button>
          <button
            onClick={() => onConfirm(reason.trim())}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white ${isReject ? 'bg-red-600' : 'bg-purple-600'}`}
          >
            {isReject ? 'Reject with reason' : 'Send back for revision'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskRow({ t, onReview }: { t: TaskRecord; onReview: (id: string, status: TaskStatus) => void }) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
      <div className="min-w-0 sm:flex-1">
        <div className="flex items-center gap-2"><Flag size={12} className="shrink-0 text-gray-400" /><p className="truncate text-sm font-bold text-gray-900">{t.title}</p></div>
        <p className="mt-1 text-xs text-gray-400">{t.due_date ? `Due ${new Date(t.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : 'No due date'} · Progress {t.progress}%</p>
        {t.review_reason && (t.status === 'Needs Revision' || t.status === 'Rejected') && (
          <p className="mt-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] text-gray-500"><span className="font-bold text-gray-600">Your note: </span>{t.review_reason}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLE[t.status]}`}>{t.status}</span>
        {t.status === 'Completed' && (
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => onReview(t.id, 'Needs Revision')} className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-[11px] font-bold text-purple-700">Request revision</button>
            <button onClick={() => onReview(t.id, 'Rejected')} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-700">Reject</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminTasksPage() {
  const { open } = useSidebar();
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [staffOptions, setStaffOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [reasonRequest, setReasonRequest] = useState<{ id: string; status: 'Needs Revision' | 'Rejected' } | null>(null);

  useEffect(() => {
    (async () => {
      const [taskRows, staffRows] = await Promise.all([
        getTasks(),
        crmSupabase.from('crm_users').select('id, full_name, role').neq('role', 'admin').neq('role', 'super_admin'),
      ]);
      setTasks(taskRows);
      setStaffOptions((staffRows.data || []).map((r) => ({ id: r.id, name: r.full_name || 'Staff' })));
      setLoading(false);
    })();
  }, []);

  const review = (id: string, status: TaskStatus) => {
    if (status === 'Needs Revision' || status === 'Rejected') {
      setReasonRequest({ id, status });
      return;
    }
    updateTaskStatus(id, status).then(() => setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, status } : t))));
  };

  const confirmReason = async (reason: string) => {
    if (!reasonRequest) return;
    const { id, status } = reasonRequest;
    setReasonRequest(null);
    const updated = await updateTaskStatus(id, status, { review_reason: reason || null });
    setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, status: updated.status, review_reason: updated.review_reason } : t)));
  };

  const groups = useMemo(() => {
    const byStaff = new Map<string, { name: string; tasks: TaskRecord[] }>();
    const unassigned: TaskRecord[] = [];
    for (const t of tasks) {
      if (!t.assignees || !t.assignees.length) { unassigned.push(t); continue; }
      for (const a of t.assignees) {
        if (!byStaff.has(a.staff_user_id)) byStaff.set(a.staff_user_id, { name: a.name, tasks: [] });
        byStaff.get(a.staff_user_id)!.tasks.push(t);
      }
    }
    const sorted = Array.from(byStaff.entries()).sort((a, b) => a[1].name.localeCompare(b[1].name));
    return { sorted, unassigned };
  }, [tasks]);

  const toggleCollapse = (id: string) => setCollapsed((cur) => ({ ...cur, [id]: !cur[id] }));

  return (
    <>
      <CrmHeader title="Tasks" subtitle="Assign and track work across your team" onMenuClick={open}
        actions={<button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white"><Plus size={15} /> <span className="hidden sm:inline">Assign task</span></button>} />
      <div className="space-y-4 p-4 sm:p-6">
        {loading ? (
          <div className="flex h-60 items-center justify-center rounded-2xl border border-gray-200 bg-white"><span className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
        ) : !tasks.length ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center"><UsersIcon className="mx-auto text-red-600" size={28} /><p className="mt-4 font-black">No tasks yet</p><button onClick={() => setShowNew(true)} className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white">Assign the first task</button></div>
        ) : (
          <>
            {groups.sorted.map(([staffId, group]) => (
              <div key={staffId} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <button onClick={() => toggleCollapse(staffId)} className="flex w-full items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/60 px-4 py-3 text-left sm:px-6">
                  <span className="flex min-w-0 items-center gap-2">
                    <UserCircle2 size={18} className="shrink-0 text-red-600" />
                    <span className="truncate text-sm font-black text-gray-900">{group.name}</span>
                    <span className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-black text-gray-600">{group.tasks.length}</span>
                  </span>
                  {collapsed[staffId] ? <ChevronDown size={16} className="shrink-0 text-gray-400" /> : <ChevronUp size={16} className="shrink-0 text-gray-400" />}
                </button>
                {!collapsed[staffId] && (
                  <div className="divide-y divide-gray-100">
                    {group.tasks.map((t) => <TaskRow key={t.id} t={t} onReview={review} />)}
                  </div>
                )}
              </div>
            ))}
            {!!groups.unassigned.length && (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/60 px-4 py-3 sm:px-6">
                  <UserCircle2 size={18} className="text-gray-400" />
                  <span className="text-sm font-black text-gray-900">Unassigned</span>
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-black text-gray-600">{groups.unassigned.length}</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {groups.unassigned.map((t) => <TaskRow key={t.id} t={t} onReview={review} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {showNew && <NewTaskModal staffOptions={staffOptions} onClose={() => setShowNew(false)} onCreated={(t) => { setTasks((cur) => [t, ...cur]); setShowNew(false); }} />}
      {reasonRequest && <ReasonModal mode={reasonRequest.status} onClose={() => setReasonRequest(null)} onConfirm={confirmReason} />}
    </>
  );
}
