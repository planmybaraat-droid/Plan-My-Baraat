'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, CheckSquare, Square, Plus, Flag, MessageCircle } from 'lucide-react';
import CrmHeader from '../../../crm/components/CrmHeader';
import { useSidebar } from '../../../crm/sidebar-context';
import { useCrmProfile } from '../../../crm/lib/useCrmProfile';
import {
  getTask, updateTaskStatus, updateTaskProgress, getChecklist, addChecklistItem, toggleChecklistItem,
  getComments, addComment,
  type TaskRecord, type ChecklistItem, type TaskComment, type TaskStatus,
} from '../../../crm/lib/task-data';

const MANAGER_WHATSAPP_NUMBER = '916353583148';

const NEXT_ACTIONS: Record<TaskStatus, { label: string; to: TaskStatus; tone: string }[]> = {
  Pending: [{ label: 'Accept task', to: 'Accepted', tone: 'bg-red-600' }],
  Accepted: [{ label: 'Start progress', to: 'In Progress', tone: 'bg-red-600' }],
  'In Progress': [{ label: 'Put on hold', to: 'On Hold', tone: 'bg-gray-700' }, { label: 'Mark as completed', to: 'Completed', tone: 'bg-emerald-600' }],
  'On Hold': [{ label: 'Resume', to: 'In Progress', tone: 'bg-red-600' }],
  'Needs Revision': [{ label: 'Resume work', to: 'In Progress', tone: 'bg-red-600' }],
  Completed: [], Rejected: [],
};
const STATUS_STYLE: Record<string, string> = {
  Pending: 'bg-gray-100 text-gray-600', Accepted: 'bg-blue-50 text-blue-700', 'In Progress': 'bg-amber-50 text-amber-700',
  'On Hold': 'bg-orange-50 text-orange-700', Completed: 'bg-emerald-50 text-emerald-700', Rejected: 'bg-red-50 text-red-700', 'Needs Revision': 'bg-purple-50 text-purple-700',
};

export default function TaskDetailPage() {
  const { open } = useSidebar();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useCrmProfile();
  const [task, setTask] = useState<TaskRecord | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [t, cl, cm] = await Promise.all([getTask(id), getChecklist(id), getComments(id)]);
    setTask(t); setChecklist(cl); setComments(cm); setNotes(t.completion_notes || '');
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // When a task is marked Completed, notify the manager over WhatsApp with
  // the staff member's name, the task name and the work summary — this
  // replaces any manual "send for review" step entirely, so completing a
  // task always reaches the manager the same way, every time.
  const notifyManagerOfCompletion = (finishedTask: TaskRecord, summary: string) => {
    const staffName = profile?.name || 'A staff member';
    const lines = [
      `✅ Task completed`,
      ``,
      `Staff: ${staffName}`,
      `Task: ${finishedTask.title}`,
    ];
    if (summary.trim()) lines.push(`Details: ${summary.trim()}`);
    const message = lines.join('\n');
    window.open(`https://wa.me/${MANAGER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const transition = async (to: TaskStatus) => {
    if (!task) return;
    setBusy(true);
    try {
      const extra: Partial<Pick<TaskRecord, 'progress' | 'completion_notes' | 'review_reason'>> =
        to === 'Completed' ? { completion_notes: notes, progress: 100 }
        : to === 'In Progress' ? { review_reason: null }
        : {};
      const updated = await updateTaskStatus(id, to, extra);
      setTask(updated);
      if (to === 'Completed') notifyManagerOfCompletion(updated, notes);
    } finally {
      setBusy(false);
    }
  };

  const changeProgress = async (value: number) => setTask(await updateTaskProgress(id, value));

  const saveNotes = async () => {
    if (!task) return;
    setTask(await updateTaskStatus(id, task.status, { completion_notes: notes }));
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    const c = await addComment(id, newComment.trim());
    setComments((cur) => [...cur, c]); setNewComment('');
  };

  const submitChecklistItem = async () => {
    if (!newChecklistItem.trim()) return;
    const item = await addChecklistItem(id, newChecklistItem.trim(), checklist.length);
    setChecklist((cur) => [...cur, item]); setNewChecklistItem('');
  };

  const toggleItem = async (item: ChecklistItem) => {
    setChecklist((cur) => cur.map((c) => (c.id === item.id ? { ...c, is_done: !c.is_done } : c)));
    await toggleChecklistItem(item.id, !item.is_done);
  };

  if (!task) return <><CrmHeader title="Task" onMenuClick={open} notificationsHref="/workspace/notifications" /><div className="p-6 text-sm text-gray-400">Loading…</div></>;

  const canEditNotes = !['Completed', 'Rejected'].includes(task.status);

  return (
    <>
      <CrmHeader title={task.title} subtitle={`Assigned to you · ${task.priority} priority`} onMenuClick={open} notificationsHref="/workspace/notifications" />
      <div className="space-y-5 p-4 sm:p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${STATUS_STYLE[task.status]}`}>{task.status}</span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500"><Flag size={13} /> {task.priority}</span>
          </div>
          {task.description && <p className="mt-4 text-sm text-gray-600">{task.description}</p>}
          <p className="mt-3 text-xs text-gray-400">{task.due_date ? `Due ${new Date(task.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'No due date'}</p>

          {(task.status === 'Needs Revision' || task.status === 'Rejected') && task.review_reason && (
            <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-700">{task.status === 'Rejected' ? 'Why this was rejected' : 'What needs to change'}</p>
              <p className="mt-1 text-sm text-purple-900">{task.review_reason}</p>
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500"><span>Progress</span><span>{task.progress}%</span></div>
            <input type="range" min={0} max={100} step={5} value={task.progress} onChange={(e) => changeProgress(Number(e.target.value))} disabled={['Completed', 'Rejected'].includes(task.status)} className="mt-1.5 w-full accent-red-600" />
          </div>

          {canEditNotes && (
            <div className="mt-4">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Work summary</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={saveNotes}
                placeholder="Describe the work you've done — this gets sent to your manager over WhatsApp when you mark the task complete…"
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400"
              />
            </div>
          )}
          {!canEditNotes && notes.trim() && (
            <div className="mt-4 rounded-xl bg-gray-50 px-3.5 py-2.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Work summary</p>
              <p className="mt-1 text-sm text-gray-700">{notes}</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {NEXT_ACTIONS[task.status]?.map((action) => (
              <button key={action.to} onClick={() => transition(action.to)} disabled={busy} className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50 ${action.tone}`}>
                {action.to === 'Completed' && <MessageCircle size={13} />}
                {action.label}
              </button>
            ))}
            <button onClick={() => router.push('/workspace/tasks')} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600">Back to tasks</button>
          </div>
          {task.status === 'In Progress' && (
            <p className="mt-2.5 text-[11px] text-gray-400">Marking this complete sends your name, the task name and your work summary to your manager on WhatsApp automatically.</p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Checklist</p>
          <div className="mt-3 space-y-1.5">
            {checklist.map((item) => (
              <button key={item.id} onClick={() => toggleItem(item)} className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-gray-50">
                {item.is_done ? <CheckSquare size={16} className="text-emerald-600" /> : <Square size={16} className="text-gray-300" />}
                <span className={`text-sm ${item.is_done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={newChecklistItem} onChange={(e) => setNewChecklistItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitChecklistItem()} placeholder="Add checklist item…" className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400" />
            <button onClick={submitChecklistItem} className="rounded-xl bg-gray-100 p-2.5 text-gray-600"><Plus size={16} /></button>
          </div>
        </div>

        {/* Comments */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Comments</p>
          <div className="mt-3 space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="rounded-xl bg-gray-50 px-3.5 py-2.5"><p className="text-sm text-gray-700">{c.comment}</p><p className="mt-1 text-[10px] text-gray-400">{new Date(c.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></div>
            ))}
            {!comments.length && <p className="py-3 text-center text-xs text-gray-400">No comments yet.</p>}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitComment()} placeholder="Write a comment…" className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-400" />
            <button onClick={submitComment} className="rounded-xl bg-red-600 p-2.5 text-white"><Send size={16} /></button>
          </div>
        </div>
      </div>
    </>
  );
}
