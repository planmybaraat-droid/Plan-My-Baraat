'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ListChecks, Flag } from 'lucide-react';
import CrmHeader from '../../crm/components/CrmHeader';
import { useSidebar } from '../../crm/sidebar-context';
import { getTasks, type TaskRecord } from '../../crm/lib/task-data';

const STATUS_STYLE: Record<string, string> = {
  Pending: 'bg-gray-100 text-gray-600', Accepted: 'bg-blue-50 text-blue-700', 'In Progress': 'bg-amber-50 text-amber-700',
  'On Hold': 'bg-orange-50 text-orange-700', Completed: 'bg-emerald-50 text-emerald-700', Rejected: 'bg-red-50 text-red-700', 'Needs Revision': 'bg-purple-50 text-purple-700',
};
const PRIORITY_STYLE: Record<string, string> = { Low: 'text-gray-400', Medium: 'text-blue-500', High: 'text-amber-500', Urgent: 'text-red-600' };

export default function MyTasksPage() {
  const { open } = useSidebar();
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { getTasks().then(setTasks).finally(() => setLoading(false)); }, []);

  const filtered = filter ? tasks.filter((t) => t.status === filter) : tasks;
  const statuses = Array.from(new Set(tasks.map((t) => t.status)));

  return (
    <>
      <CrmHeader title="My Tasks" subtitle={`${tasks.length} tasks assigned to you`} onMenuClick={open} notificationsHref="/workspace/notifications" />
      <div className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter('')} className={`rounded-xl px-3.5 py-2 text-xs font-bold ${!filter ? 'bg-red-600 text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>All</button>
          {statuses.map((s) => <button key={s} onClick={() => setFilter(s)} className={`rounded-xl px-3.5 py-2 text-xs font-bold ${filter === s ? 'bg-red-600 text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>{s}</button>)}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-60 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
          ) : !filtered.length ? (
            <div className="px-6 py-20 text-center"><ListChecks className="mx-auto text-red-600" size={28} /><p className="mt-4 font-black">No tasks here</p><p className="mt-1 text-sm text-gray-400">Tasks your admin assigns to you will show up here instantly.</p></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((t) => (
                <Link key={t.id} href={`/workspace/tasks/${t.id}`} className="flex items-center justify-between gap-3 px-4 py-4 hover:bg-gray-50 sm:px-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><Flag size={12} className={PRIORITY_STYLE[t.priority]} /><p className="truncate text-sm font-bold text-gray-900">{t.title}</p></div>
                    <p className="mt-1 text-xs text-gray-400">{t.due_date ? `Due ${new Date(t.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'No due date'}</p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <div className="hidden w-24 sm:block"><div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100"><div className="h-full bg-red-600" style={{ width: `${t.progress}%` }} /></div></div>
                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${STATUS_STYLE[t.status]}`}>{t.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
