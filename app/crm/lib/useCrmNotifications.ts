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
export function useCrmNotifications() {
  const [items, setItems] = useState<CrmNotification[]>([]);
  const [loading, setLoading] = useState(true);
  // Multiple components (header bell, dashboard widget, notifications page)
  // can all use this hook at once — each needs its own Realtime channel
  // name, or the second .channel(sameName) call collides with the first
  // (already-subscribed) one and throws.
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;

  const load = useCallback(async () => {
    if (!isCrmSupabaseConfigured) { setLoading(false); return; }
    const { data: { user } } = await crmSupabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await crmSupabase
      .from('crm_notifications')
      .select('*')
      .neq('type', 'team_chat')
      .neq('type', 'team_chat_group')
      .order('created_at', { ascending: false })
      .limit(30);
    setItems(data || []);
    setLoading(false);
  }, []);

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
            if (!inserted.type.startsWith('team_chat')) setItems((current) => [inserted, ...current].slice(0, 30));
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
            setItems((current) => current.map((n) => (n.id === updated.id ? { ...n, ...updated } : n)));
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'crm_notifications', filter: `recipient_id=eq.${user.id}` },
          (payload) => {
            const removed = payload.old as CrmNotification;
            if (removed.type.startsWith('team_chat')) return;
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
  }, [load, instanceId]);

  const markRead = async (id: string) => {
    setItems((current) => current.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    await crmSupabase.from('crm_notifications').update({ is_read: true }).eq('id', id);
  };

  const markAllRead = async () => {
    const unreadIds = items.filter((n) => !n.is_read).map((n) => n.id);
    if (!unreadIds.length) return;
    setItems((current) => current.map((n) => ({ ...n, is_read: true })));
    await crmSupabase.from('crm_notifications').update({ is_read: true }).in('id', unreadIds);
  };

  return { items, loading, unreadCount: items.filter((n) => !n.is_read).length, markRead, markAllRead, reload: load };
}
