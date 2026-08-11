'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCrmNotifications } from '../lib/useCrmNotifications';

interface CrmHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  actions?: React.ReactNode;
  /** Where the "see all" link in the notification dropdown should point. */
  notificationsHref?: string;
}

export default function CrmHeader({ title, subtitle, onMenuClick, actions, notificationsHref = '/crm/notifications' }: CrmHeaderProps) {
  const router = useRouter();
  const { items, unreadCount, markRead, markAllRead } = useCrmNotifications();
  const [open, setOpen] = useState(false);

  return (
    <header className="crm-header sticky top-0 z-30 border-b border-gray-100 bg-white px-3 py-2 sm:px-4 sm:py-3">
      <div className="flex min-w-0 flex-nowrap items-center gap-2 sm:gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            onClick={onMenuClick}
            className="shrink-0 rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 active:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold leading-tight text-gray-900 sm:text-lg">{title}</h1>
            {subtitle && <p className="text-xs text-gray-400 font-medium hidden sm:block mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="crm-header-actions flex shrink-0 flex-nowrap items-center justify-end gap-1.5 sm:gap-2">
          {actions}
          <div className="relative">
            <button onClick={() => setOpen((v) => !v)} className="relative p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50" aria-label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-600 rounded-full" />}
            </button>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] rounded-2xl border border-gray-100 bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-wider text-gray-500">Notifications</p>
                    {unreadCount > 0 && <button onClick={markAllRead} className="text-[10px] font-bold text-red-600">Mark all read</button>}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {items.length === 0 ? (
                      <p className="px-4 py-8 text-center text-xs text-gray-400">Nothing yet.</p>
                    ) : items.slice(0, 8).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => { if (!n.is_read) markRead(n.id); setOpen(false); if (n.link) router.push(n.link); }}
                        className={`block w-full border-b border-gray-50 px-4 py-3 text-left last:border-0 hover:bg-gray-50 ${!n.is_read ? 'bg-red-50/40' : ''}`}
                      >
                        <p className="text-xs font-bold text-gray-800">{n.title}</p>
                        {n.body && <p className="mt-0.5 truncate text-[11px] text-gray-500">{n.body}</p>}
                        <p className="mt-1 text-[10px] text-gray-400">{new Date(n.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                      </button>
                    ))}
                  </div>
                  <Link href={notificationsHref} onClick={() => setOpen(false)} className="block border-t border-gray-100 px-4 py-2.5 text-center text-[11px] font-bold text-red-600 hover:bg-gray-50">
                    See all notifications
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
