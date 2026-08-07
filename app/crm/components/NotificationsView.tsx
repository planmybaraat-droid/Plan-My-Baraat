'use client';

import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import CrmHeader from './CrmHeader';
import { useSidebar } from '../sidebar-context';
import { useCrmNotifications } from '../lib/useCrmNotifications';

const TYPE_DOT: Record<string, string> = {
  task_assigned: 'bg-blue-500', task_completed: 'bg-emerald-500', task_rejected: 'bg-red-500', task_needs_revision: 'bg-amber-500',
  attendance_punch_in: 'bg-emerald-500', attendance_punch_out: 'bg-gray-400',
  lead_assigned: 'bg-purple-500', quotation_submitted: 'bg-blue-500', agreement_submitted: 'bg-blue-500',
};

/** Shared full-page notification list — used by both /crm and /workspace. */
export default function NotificationsView({ notificationsHref }: { notificationsHref: string }) {
  const { open } = useSidebar();
  const { items, loading, unreadCount, markRead, markAllRead } = useCrmNotifications();

  return (
    <>
      <CrmHeader title="Notifications" subtitle={`${unreadCount} unread`} onMenuClick={open} notificationsHref={notificationsHref}
        actions={unreadCount > 0 ? <button onClick={markAllRead} className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600"><CheckCheck size={14} /> Mark all read</button> : undefined} />
      <div className="p-4 sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex h-40 items-center justify-center"><span className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-red-600" /></div>
          ) : !items.length ? (
            <div className="px-6 py-20 text-center"><Bell className="mx-auto text-red-600" size={28} /><p className="mt-4 font-black">No notifications yet</p><p className="mt-1 text-sm text-gray-400">You&apos;ll see task, attendance and approval updates here in real time.</p></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((n) => {
                const content = (
                  <>
                    <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${TYPE_DOT[n.type] || 'bg-gray-400'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900">{n.title}</p>
                      {n.body && <p className="mt-0.5 text-xs text-gray-500">{n.body}</p>}
                      <p className="mt-1 text-[11px] text-gray-400">{new Date(n.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </>
                );
                const rowClass = `flex items-start gap-3 px-4 py-4 sm:px-6 ${n.link ? 'hover:bg-gray-50' : ''} ${!n.is_read ? 'bg-red-50/30' : ''}`;
                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => !n.is_read && markRead(n.id)} className={rowClass}>{content}</Link>
                ) : (
                  <div key={n.id} onClick={() => !n.is_read && markRead(n.id)} className={rowClass}>{content}</div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
