'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BellRing, ExternalLink, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { crmSupabase, isCrmSupabaseConfigured } from '../../crm/lib/supabase-crm';
import type { CrmNotification } from '../../crm/lib/useCrmNotifications';

const MAX_VISIBLE_TOASTS = 3;

export default function RealtimeNotificationToast() {
  const router = useRouter();
  const [toasts, setToasts] = useState<CrmNotification[]>([]);
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;

  useEffect(() => {
    if (!isCrmSupabaseConfigured) return;
    let active = true;
    let channel: ReturnType<typeof crmSupabase.channel> | null = null;

    async function subscribe() {
      const { data: { user } } = await crmSupabase.auth.getUser();
      if (!active || !user) return;

      channel = crmSupabase
        .channel(`workspace_notification_toasts_${user.id}_${instanceId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'crm_notifications', filter: `recipient_id=eq.${user.id}` },
          (payload) => {
            const notification = payload.new as CrmNotification;
            if (notification.type.startsWith('team_chat')) return;
            setToasts((current) => [notification, ...current.filter((item) => item.id !== notification.id)].slice(0, MAX_VISIBLE_TOASTS));
          },
        )
        .subscribe();
    }

    subscribe();
    return () => {
      active = false;
      if (channel) crmSupabase.removeChannel(channel);
    };
  }, [instanceId]);

  const dismiss = (id: string) => setToasts((current) => current.filter((item) => item.id !== id));

  const openNotification = async (notification: CrmNotification) => {
    dismiss(notification.id);
    if (!notification.is_read) {
      await crmSupabase.from('crm_notifications').update({ is_read: true }).eq('id', notification.id);
    }
    router.push(notification.link || '/workspace/notifications');
  };

  return (
    <div className="pointer-events-none fixed inset-x-3 top-16 z-[95] flex flex-col items-end gap-3 sm:inset-x-auto sm:right-5 sm:top-20 sm:w-[390px]" aria-live="polite" aria-atomic="false">
      <AnimatePresence initial={false}>
        {toasts.map((notification) => (
          <motion.article
            key={notification.id}
            initial={{ opacity: 0, x: 32, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 28, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="pointer-events-auto w-full overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.20)]"
          >
            <div className="h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-400" />
            <div className="flex gap-3 p-4">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <BellRing size={19} />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-600">New notification</p>
                    <h3 className="mt-1 text-sm font-extrabold leading-5 text-gray-950">{notification.title}</h3>
                  </div>
                  <button type="button" onClick={() => dismiss(notification.id)} className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700" aria-label={`Close ${notification.title} notification`}>
                    <X size={16} />
                  </button>
                </div>
                {notification.body && <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-gray-500">{notification.body}</p>}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-medium text-gray-400">Just now</span>
                  <button type="button" onClick={() => openNotification(notification)} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-950 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-red-600">
                    View notification <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </AnimatePresence>
    </div>
  );
}
