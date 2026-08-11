'use client';

import { FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, CheckCheck, FileText, Loader2, MessageCircle, Paperclip,
  Plus, Search, Send, Trash2, Users, X,
} from 'lucide-react';
import { crmSupabase } from '../lib/supabase-crm';
import { initialsFrom, ROLE_LABELS } from '../lib/useCrmProfile';

interface ChatUser {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  avatar_url: string | null;
  is_active?: boolean;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  text: string;
  deleted?: boolean;
  room?: 'personal' | 'team';
  client_id?: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  attachment_size: number | null;
  attachment_url: string | null;
  is_read: boolean;
  created_at: string;
}

type Screen = 'list' | 'new' | 'chat';
const TEAM_ROOM = 'team';

function displayName(user?: ChatUser | null) {
  return user?.full_name?.trim() || user?.email?.split('@')[0] || 'Team member';
}

function timeLabel(value: string) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return 'Now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function messageTime(value: string) {
  return new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function fileSize(value: number | null) {
  if (!value) return '';
  return value < 1024 * 1024 ? `${Math.ceil(value / 1024)} KB` : `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function Avatar({ user, online, size = 'md' }: { user: ChatUser; online?: boolean; size?: 'sm' | 'md' }) {
  const name = displayName(user);
  return (
    <div className={`relative shrink-0 ${size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'}`}>
      {user.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.avatar_url} alt="" className="h-full w-full rounded-full object-cover ring-1 ring-gray-200" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#f2eaf1] text-[11px] font-black text-[#5b2347] ring-1 ring-[#e5d7e1]">
          {initialsFrom(name)}
        </div>
      )}
      <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${online ? 'bg-emerald-500' : 'bg-gray-300'}`} />
    </div>
  );
}

export default function TeamChat() {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>('list');
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [configured, setConfigured] = useState<boolean | null>(null);
  const instanceId = useRef(Math.random().toString(36).slice(2)).current;
  const fileInput = useRef<HTMLInputElement>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const response = await fetch('/api/crm/chat', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load Team Chat.');
      setConfigured(data.configured !== false);
      setCurrentUser(data.currentUser);
      setUsers(data.users || []);
      setMessages((data.messages || []).filter((message: ChatMessage) => !message.deleted));
      setError('');
    } catch (loadError) {
      setConfigured(false);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load Team Chat.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!currentUser) return;
    const channel = crmSupabase
      .channel('crm_team_chat_presence', { config: { presence: { key: currentUser.id } } })
      .on('presence', { event: 'sync' }, () => setOnlineIds(new Set(Object.keys(channel.presenceState()))))
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'crm_notifications', filter: `recipient_id=eq.${currentUser.id}` },
        (payload) => {
          const row = (payload.new || payload.old) as { type?: string };
          if (row.type?.startsWith('team_chat') || payload.eventType === 'DELETE') load(true);
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') channel.track({ user_id: currentUser.id, joined_at: new Date().toISOString(), instance: instanceId });
      });
    return () => { crmSupabase.removeChannel(channel); };
  }, [currentUser, instanceId, load]);

  const selectedUser = users.find((user) => user.id === selectedId) || null;
  const selectedMessages = useMemo(() => {
    if (!currentUser || !selectedId) return [];
    if (selectedId === TEAM_ROOM) return messages.filter((message) => message.room === 'team');
    return messages.filter((message) =>
      message.room !== 'team' &&
      (message.sender_id === currentUser.id && message.recipient_id === selectedId) ||
      (message.sender_id === selectedId && message.recipient_id === currentUser.id)
    );
  }, [currentUser, messages, selectedId]);

  const unreadTotal = useMemo(() => currentUser
    ? messages.filter((message) => message.recipient_id === currentUser.id && !message.is_read).length
    : 0, [currentUser, messages]);

  const conversations = useMemo(() => users.map((user) => {
    const relevant = currentUser ? messages.filter((message) => message.room !== 'team' &&
      (message.sender_id === currentUser.id && message.recipient_id === user.id) ||
      (message.sender_id === user.id && message.recipient_id === currentUser.id)
    ) : [];
    const last = relevant[relevant.length - 1];
    const unread = currentUser ? relevant.filter((message) => message.recipient_id === currentUser.id && !message.is_read).length : 0;
    return { user, last, unread };
  }).filter((item) => item.last).sort((a, b) =>
    new Date(b.last!.created_at).getTime() - new Date(a.last!.created_at).getTime()
  ), [currentUser, messages, users]);

  const teamMessages = useMemo(() => messages.filter((message) => message.room === 'team'), [messages]);
  const teamUnread = useMemo(() => currentUser
    ? teamMessages.filter((message) => message.recipient_id === currentUser.id && !message.is_read).length
    : 0, [currentUser, teamMessages]);
  const teamLast = teamMessages[teamMessages.length - 1];

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();
    return users.filter((user) => !term || `${displayName(user)} ${user.email || ''} ${ROLE_LABELS[user.role] || user.role}`.toLowerCase().includes(term));
  }, [query, users]);

  const openConversation = useCallback(async (id: string) => {
    setSelectedId(id);
    setScreen('chat');
    setQuery('');
    setError('');
    setMessages((items) => items.map((message) =>
      currentUser && message.recipient_id === currentUser.id && (
        id === TEAM_ROOM ? message.room === 'team' : message.room !== 'team' && message.sender_id === id
      ) ? { ...message, is_read: true } : message
    ));
    await fetch('/api/crm/chat', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ peer_id: id }),
    });
  }, [currentUser]);

  useEffect(() => {
    if (screen === 'chat') requestAnimationFrame(() => messagesEnd.current?.scrollIntoView({ block: 'end' }));
  }, [screen, selectedMessages.length]);

  const sendMessage = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!selectedId || sending || (!draft.trim() && !attachment)) return;
    setSending(true);
    setError('');
    const form = new FormData();
    form.set('recipient_id', selectedId);
    form.set('message', draft.trim());
    if (attachment) form.set('attachment', attachment);
    try {
      const response = await fetch('/api/crm/chat', { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to send message.');
      setMessages((items) => [...items.filter((item) => item.id !== data.message.id), data.message]);
      setDraft('');
      setAttachment(null);
      if (fileInput.current) fileInput.current.value = '';
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Unable to send message.');
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    const response = await fetch(`/api/crm/chat?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (response.ok) setMessages((items) => items.filter((item) => item.id !== id));
  };

  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const close = () => {
    setOpen(false);
    setScreen('list');
    setSelectedId(null);
    setQuery('');
  };

  return (
    <>
      {!open && configured !== false && (
        <button
          type="button"
          onClick={() => { setOpen(true); load(true); }}
          aria-label={`Open Team Chat${unreadTotal ? `, ${unreadTotal} unread` : ''}`}
          className="fixed bottom-20 right-4 z-[80] flex h-12 w-12 items-center justify-center rounded-full bg-[#5b2347] text-white shadow-[0_12px_30px_-8px_rgba(91,35,71,.75)] transition hover:-translate-y-0.5 hover:bg-[#481a38] lg:bottom-6 lg:right-6"
        >
          <Users size={20} strokeWidth={2.2} />
          {unreadTotal > 0 && <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-600 px-1 text-[9px] font-black">{unreadTotal > 99 ? '99+' : unreadTotal}</span>}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[90] bg-black/10 md:bg-black/5" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="absolute inset-0 flex flex-col overflow-hidden bg-white md:inset-auto md:bottom-4 md:right-4 md:h-[min(720px,calc(100vh-32px))] md:w-[390px] md:rounded-2xl md:border md:border-gray-200 md:shadow-2xl">
            <header className="flex min-h-[68px] items-center gap-3 border-b border-gray-100 bg-[#fbf8fa] px-4">
              {screen !== 'list' && (
                <button type="button" onClick={() => { setScreen('list'); setSelectedId(null); setQuery(''); }} className="rounded-lg p-2 text-gray-500 hover:bg-white hover:text-gray-900" aria-label="Back">
                  <ArrowLeft size={18} />
                </button>
              )}
              {screen === 'chat' && (selectedUser || selectedId === TEAM_ROOM) ? (
                selectedId === TEAM_ROOM ? <><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5b2347] text-white"><Users size={17} /></span><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-black text-gray-950">Everyone</h2><p className="text-[10px] font-bold text-emerald-600">Company-wide team chat</p></div></> : selectedUser && <><Avatar user={selectedUser} online={onlineIds.has(selectedUser.id)} size="sm" /><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-black text-gray-950">{displayName(selectedUser)}</h2><p className={`text-[10px] font-bold ${onlineIds.has(selectedUser.id) ? 'text-emerald-600' : 'text-gray-400'}`}>{onlineIds.has(selectedUser.id) ? 'Online' : 'Offline'} · {ROLE_LABELS[selectedUser.role] || selectedUser.role}</p></div></>
              ) : (
                <div className="flex min-w-0 flex-1 items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5b2347] text-white"><MessageCircle size={17} /></span><div><h2 className="text-sm font-black text-gray-950">{screen === 'new' ? 'New Chat' : 'Team Chat'}</h2><p className="text-[10px] font-medium text-gray-400">PlanMyBaraat internal team</p></div></div>
              )}
              <button type="button" onClick={close} className="rounded-lg p-2 text-gray-400 hover:bg-white hover:text-gray-900" aria-label="Close Team Chat"><X size={19} /></button>
            </header>

            {screen !== 'chat' && (
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search team members..." className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-xs font-medium outline-none focus:border-[#8c5276] focus:bg-white focus:ring-2 focus:ring-[#5b2347]/10" /></div>
              </div>
            )}

            {error && <div className="mx-4 mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-700">{error}</div>}

            {screen === 'list' && (
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex items-center justify-between px-4 py-3"><p className="text-[10px] font-black uppercase tracking-[.16em] text-gray-400">Recent conversations</p><button type="button" onClick={() => { setScreen('new'); setQuery(''); }} className="inline-flex items-center gap-1 rounded-lg bg-[#f2eaf1] px-2.5 py-1.5 text-[10px] font-black text-[#5b2347] hover:bg-[#eadce7]"><Plus size={12} /> New Chat</button></div>
                <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
                  {!loading && <button type="button" onClick={() => openConversation(TEAM_ROOM)} className="mb-1 flex w-full items-center gap-3 rounded-xl border border-[#eadce7] bg-[#fbf8fa] px-3 py-3 text-left hover:bg-[#f6eff4]"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#5b2347] text-white"><Users size={18} /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-xs font-black text-gray-900">Everyone</p><span className="shrink-0 text-[9px] font-semibold text-gray-400">{teamLast ? timeLabel(teamLast.created_at) : 'Common room'}</span></div><div className="mt-1 flex items-center justify-between gap-2"><p className="truncate text-[11px] text-gray-500">{teamLast?.attachment_name ? `📎 ${teamLast.attachment_name}` : teamLast?.text || 'Message all admins and staff'}</p>{teamUnread > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5b2347] px-1 text-[9px] font-black text-white">{teamUnread}</span>}</div></div></button>}
                  {loading ? <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#5b2347]" size={20} /></div> : conversations.length ? conversations.filter(({ user }) => filteredUsers.some((item) => item.id === user.id)).map(({ user, last, unread }) => (
                    <button key={user.id} type="button" onClick={() => openConversation(user.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-gray-50">
                      <Avatar user={user} online={onlineIds.has(user.id)} />
                      <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-xs font-black text-gray-900">{displayName(user)}</p><span className="shrink-0 text-[9px] font-semibold text-gray-400">{last ? timeLabel(last.created_at) : ''}</span></div><div className="mt-1 flex items-center justify-between gap-2"><p className="truncate text-[11px] text-gray-500">{last?.attachment_name ? `📎 ${last.attachment_name}` : last?.text || 'Start a conversation'}</p>{unread > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5b2347] px-1 text-[9px] font-black text-white">{unread}</span>}</div></div>
                    </button>
                  )) : <div className="flex h-full min-h-52 flex-col items-center justify-center px-8 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2eaf1] text-[#5b2347]"><Users size={21} /></span><p className="mt-4 text-xs font-black text-gray-900">Your team is ready</p><p className="mt-1 text-[11px] leading-relaxed text-gray-400">Start a private conversation with an admin or staff member.</p><button type="button" onClick={() => setScreen('new')} className="mt-4 rounded-xl bg-[#5b2347] px-4 py-2 text-[11px] font-black text-white">Start a chat</button></div>}
                </div>
              </div>
            )}

            {screen === 'new' && (
              <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
                {filteredUsers.map((user) => <button key={user.id} type="button" onClick={() => openConversation(user.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-gray-50"><Avatar user={user} online={onlineIds.has(user.id)} /><div className="min-w-0 flex-1"><p className="truncate text-xs font-black text-gray-900">{displayName(user)}</p><p className="mt-0.5 truncate text-[10px] font-medium text-gray-400">{ROLE_LABELS[user.role] || user.role}{user.email ? ` · ${user.email}` : ''}</p></div><span className={`text-[9px] font-bold ${onlineIds.has(user.id) ? 'text-emerald-600' : 'text-gray-400'}`}>{onlineIds.has(user.id) ? 'Online' : 'Offline'}</span></button>)}
                {!loading && !filteredUsers.length && <p className="py-16 text-center text-xs text-gray-400">No active team members found.</p>}
              </div>
            )}

            {screen === 'chat' && (selectedUser || selectedId === TEAM_ROOM) && currentUser && (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto bg-[#faf9fa] px-4 py-4">
                  {!selectedMessages.length && <div className="flex h-full min-h-40 flex-col items-center justify-center text-center">{selectedId === TEAM_ROOM ? <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5b2347] text-white"><Users size={18} /></span> : selectedUser && <Avatar user={selectedUser} online={onlineIds.has(selectedUser.id)} />}<p className="mt-3 text-xs font-black text-gray-900">Start your conversation</p><p className="mt-1 text-[10px] text-gray-400">{selectedId === TEAM_ROOM ? 'Every active admin and staff member can read this room.' : `Messages are private to you and ${displayName(selectedUser)}.`}</p></div>}
                  <div className="space-y-2.5">{selectedMessages.map((message) => {
                    const mine = message.sender_id === currentUser.id;
                    const sender = users.find((user) => user.id === message.sender_id);
                    return <div key={message.id} className={`group flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`relative max-w-[84%] rounded-2xl px-3 py-2.5 shadow-sm ${mine ? 'rounded-br-md bg-[#5b2347] text-white' : 'rounded-bl-md border border-gray-200 bg-white text-gray-800'}`}>
                      {selectedId === TEAM_ROOM && !mine && <p className="mb-1 text-[9px] font-black text-[#8c5276]">{displayName(sender)}</p>}
                      {message.text && <p className="whitespace-pre-wrap break-words text-[12px] leading-relaxed">{message.text}</p>}
                      {message.attachment_name && message.attachment_url && <a href={message.attachment_url} target="_blank" rel="noreferrer" className={`mt-2 flex items-center gap-2 rounded-xl border px-2.5 py-2 ${mine ? 'border-white/20 bg-white/10' : 'border-gray-200 bg-gray-50'}`}><FileText size={16} className="shrink-0" /><span className="min-w-0"><b className="block truncate text-[10px]">{message.attachment_name}</b><small className={`text-[9px] ${mine ? 'text-white/60' : 'text-gray-400'}`}>{fileSize(message.attachment_size)}</small></span></a>}
                      <div className={`mt-1 flex items-center justify-end gap-1 text-[8px] font-semibold ${mine ? 'text-white/60' : 'text-gray-400'}`}><span>{messageTime(message.created_at)}</span>{mine && <CheckCheck size={11} className={message.is_read ? 'text-sky-300' : ''} />}</div>
                      {mine && <button type="button" onClick={() => deleteMessage(message.id)} className="absolute -left-7 top-1/2 hidden -translate-y-1/2 rounded-lg p-1.5 text-gray-300 hover:bg-white hover:text-red-500 group-hover:block" aria-label="Delete message"><Trash2 size={12} /></button>}
                    </div></div>;
                  })}</div><div ref={messagesEnd} />
                </div>
                <form onSubmit={sendMessage} className="border-t border-gray-100 bg-white p-3">
                  {attachment && <div className="mb-2 flex items-center justify-between rounded-xl border border-[#e5d7e1] bg-[#fbf8fa] px-3 py-2"><div className="min-w-0"><p className="truncate text-[10px] font-bold text-gray-800">{attachment.name}</p><p className="text-[9px] text-gray-400">{fileSize(attachment.size)}</p></div><button type="button" onClick={() => setAttachment(null)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button></div>}
                  <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1.5 focus-within:border-[#8c5276] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#5b2347]/10"><input ref={fileInput} type="file" className="hidden" accept="image/jpeg,image/png,image/webp,application/pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={(event) => setAttachment(event.target.files?.[0] || null)} /><button type="button" onClick={() => fileInput.current?.click()} className="mb-0.5 rounded-xl p-2 text-gray-400 hover:bg-white hover:text-[#5b2347]" aria-label="Attach file"><Paperclip size={17} /></button><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={keyDown} rows={1} placeholder="Type a message..." className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-1 py-2 text-xs leading-5 outline-none placeholder:text-gray-400" /><button type="submit" disabled={sending || (!draft.trim() && !attachment)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5b2347] text-white disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message">{sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}</button></div>
                  <p className="mt-1.5 px-1 text-[8px] font-medium text-gray-300">Enter to send · Shift + Enter for a new line</p>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
