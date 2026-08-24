'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { crmSupabase, isCrmSupabaseConfigured } from './supabase-crm';

export interface CrmNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

/**
 * Shared by both the Admin CRM and Staff Workspace headers — one Realtime
 * subscription implementation instead of duplicating it per portal.
 */
export function useCrmNotifications(options: { paginated?: boolean; page?: number; pageSize?: number } = {}) {
  const paginated = options.paginated === true;
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(50, Math.max(10, options.pageSize || (paginated ? 10 : 30)));
  const [items, setItems] = useState<CrmNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  // Multiple components (header bell, dashboard widget, notifications page)
  // can all use this hook at once — each needs its own Realtime channel
  // name, or the second .channel(sameName) call collides with the first
  // (already-subscribed) one and throws.
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;

  const load = useCallback(async () => {
    if (!isCrmSupabaseConfigured) { setLoading(false); return; }
    const { data: { user } } = await crmSupabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    let query = crmSupabase
      .from('crm_notifications')
      .select('*', { count: 'exact' })
      .neq('type', 'team_chat')
      .neq('type', 'team_chat_group')
      .order('created_at', { ascending: false });
    query = paginated ? query.range((page - 1) * pageSize, page * pageSize - 1) : query.limit(30);
    const [{ data, count }, { count: unread }] = await Promise.all([
      query,
      crmSupabase.from('crm_notifications').select('id', { count: 'exact', head: true })
        .eq('is_read', false).neq('type', 'team_chat').neq('type', 'team_chat_group'),
    ]);
    setItems(data || []);
    setTotal(count || 0);
    setUnreadCount(unread || 0);
    setLoading(false);
  }, [page, pageSize, paginated]);

  useEffect(() => {
    let channel: ReturnType<typeof crmSupabase.channel> | null = null;
    let active = true;

    async function init() {
      await load();
      if (!isCrmSupabaseConfigured || !active) return;
      const { data: { user } } = await crmSupabase.auth.getUser();
      if (!user || !active) return;

      channel = crmSupabase
        .channel(`crm_notifications_${user.id}_${instanceId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'crm_notifications', filter: `recipient_id=eq.${user.id}` },
          (payload) => {
            const inserted = payload.new as CrmNotification;
            if (!inserted.type.startsWith('team_chat')) {
              setTotal((current) => current + 1);
              if (!inserted.is_read) setUnreadCount((current) => current + 1);
              if (!paginated || page === 1) setItems((current) => [inserted, ...current].slice(0, paginated ? pageSize : 30));
            }
          }
        )
        .on(
          // Keeps every mounted instance of this hook (sidebar badge,
          // header bell, dashboard widget, notifications page) in sync
          // whenever read-status changes anywhere — otherwise "mark all as
          // read" on the notifications page only updates that page's own
          // local state/DB rows, and the sidebar badge (a separate hook
          // instance with its own stale `items`) never finds out and stays
          // stuck showing the old unread count.
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'crm_notifications', filter: `recipient_id=eq.${user.id}` },
          (payload) => {
            const updated = payload.new as CrmNotification;
            if (updated.type.startsWith('team_chat')) return;
            setItems((current) => {
              const previous = current.find((notification) => notification.id === updated.id);
              if (previous && previous.is_read !== updated.is_read) {
                setUnreadCount((count) => Math.max(0, count + (updated.is_read ? -1 : 1)));
              }
              return current.map((notification) => (notification.id === updated.id ? { ...notification, ...updated } : notification));
            });
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'crm_notifications', filter: `recipient_id=eq.${user.id}` },
          (payload) => {
            const removed = payload.old as CrmNotification;
            if (removed.type.startsWith('team_chat')) return;
            setTotal((current) => Math.max(0, current - 1));
            setItems((current) => current.filter((n) => n.id !== removed.id));
          }
        )
        .subscribe();
    }

    init();
    return () => {
      active = false;
      if (channel) crmSupabase.removeChannel(channel);
    };
  }, [load, instanceId, page, pageSize, paginated]);

  const markRead = async (id: string) => {
    const wasUnread = items.some((n) => n.id === id && !n.is_read);
    setItems((current) => current.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    if (wasUnread) setUnreadCount((current) => Math.max(0, current - 1));
    await crmSupabase.from('crm_notifications').update({ is_read: true }).eq('id', id);
  };

  const markAllRead = async () => {
    if (!unreadCount) return;
    setItems((current) => current.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    await crmSupabase.from('crm_notifications').update({ is_read: true })
      .eq('is_read', false).neq('type', 'team_chat').neq('type', 'team_chat_group');
  };

  return { items, loading, unreadCount, total, markRead, markAllRead, reload: load };
}
