import { NextRequest, NextResponse } from 'next/server';
import { requireCrmMember } from '@/app/crm/lib/apiAuth';
import { isSupabaseAdminConfigured, supabaseAdmin } from '@/app/crm/lib/supabase-admin';

const CHAT_ROLES = ['admin', 'super_admin', 'staff', 'sales', 'manager', 'accountant'];
const MAX_MESSAGE_LENGTH = 4000;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'application/pdf',
  'text/plain', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

interface ChatPayload {
  text?: string;
  deleted?: boolean;
  client_id?: string;
  attachment_path?: string;
  attachment_name?: string;
  attachment_type?: string;
  attachment_size?: number;
}

function parsePayload(value: unknown): ChatPayload {
  if (typeof value !== 'string') return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed as ChatPayload : { text: value };
  } catch {
    return { text: value };
  }
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').slice(-100) || 'attachment';
}

async function getActiveRecipient(id: string) {
  if (!supabaseAdmin) return null;
  const { data } = await supabaseAdmin
    .from('crm_users')
    .select('id,full_name,email,role,is_active,avatar_url')
    .eq('id', id)
    .eq('is_active', true)
    .in('role', CHAT_ROLES)
    .maybeSingle();
  return data;
}

async function serializeMessages(rows: Array<Record<string, unknown>>) {
  if (!supabaseAdmin) return [];
  const admin = supabaseAdmin;
  return Promise.all(rows.map(async (row) => {
    const payload = parsePayload(row.body);
    let attachmentUrl: string | null = null;
    if (payload.attachment_path) {
      const { data } = await admin.storage.from('crm-files').createSignedUrl(payload.attachment_path, 3600);
      attachmentUrl = data?.signedUrl || null;
    }
    return {
      id: String(row.id),
      sender_id: String(row.title),
      recipient_id: String(row.recipient_id),
      room: row.type === 'team_chat_group' ? 'team' : 'personal',
      client_id: payload.client_id || null,
      text: payload.text || '',
      deleted: Boolean(payload.deleted),
      attachment_name: payload.attachment_name || null,
      attachment_type: payload.attachment_type || null,
      attachment_size: payload.attachment_size || null,
      attachment_url: attachmentUrl,
      is_read: Boolean(row.is_read),
      created_at: String(row.created_at),
    };
  }));
}

async function insertMessage(senderId: string, recipientId: string, payload: ChatPayload) {
  if (!supabaseAdmin) throw new Error('Chat service is unavailable.');
  const { data, error } = await supabaseAdmin
    .from('crm_notifications')
    .insert({
      recipient_id: recipientId,
      type: 'team_chat',
      title: senderId,
      body: JSON.stringify(payload),
      link: null,
      is_read: false,
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return (await serializeMessages([data]))[0];
}

export async function GET(req: NextRequest) {
  const gate = await requireCrmMember(req);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: 'Chat service is not configured.' }, { status: 503 });
  }

  const [usersResult, messagesResult, groupMessagesResult] = await Promise.all([
    supabaseAdmin
      .from('crm_users')
      .select('id,full_name,email,role,avatar_url,is_active')
      .eq('is_active', true)
      .in('role', CHAT_ROLES)
      .neq('id', gate.user.id)
      .order('full_name'),
    supabaseAdmin
      .from('crm_notifications')
      .select('*')
      .eq('type', 'team_chat')
      .or(`recipient_id.eq.${gate.user.id},title.eq.${gate.user.id}`)
      .order('created_at', { ascending: true })
      .limit(500),
    supabaseAdmin
      .from('crm_notifications')
      .select('*')
      .eq('type', 'team_chat_group')
      .order('created_at', { ascending: true })
      .limit(2000),
  ]);

  if (usersResult.error || messagesResult.error || groupMessagesResult.error) {
    return NextResponse.json({ error: usersResult.error?.message || messagesResult.error?.message || groupMessagesResult.error?.message }, { status: 500 });
  }

  const groupCopies = new Map<string, Record<string, unknown>>();
  (groupMessagesResult.data || []).forEach((row) => {
    const payload = parsePayload(row.body);
    const key = payload.client_id || String(row.id);
    const existing = groupCopies.get(key);
    if (!existing || row.recipient_id === gate.user.id) groupCopies.set(key, row);
  });
  const messageRows = [...(messagesResult.data || []), ...Array.from(groupCopies.values())]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return NextResponse.json({
    currentUser: gate.profile,
    users: usersResult.data || [],
    messages: await serializeMessages(messageRows as Array<Record<string, unknown>>),
  });
}

export async function POST(req: NextRequest) {
  const gate = await requireCrmMember(req);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: 'Chat service is not configured.' }, { status: 503 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let recipientId = '';
    let text = '';
    let attachment: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      recipientId = String(form.get('recipient_id') || '');
      text = String(form.get('message') || '').trim();
      const candidate = form.get('attachment');
      attachment = candidate instanceof File && candidate.size > 0 ? candidate : null;
    } else {
      const body: unknown = await req.json();
      const record = body && typeof body === 'object' ? body as Record<string, unknown> : {};
      recipientId = String(record.recipient_id || '');
      text = String(record.message || '').trim();
    }

    const isTeamRoom = recipientId === 'team';
    if (!recipientId || (!isTeamRoom && recipientId === gate.user.id)) {
      return NextResponse.json({ error: 'Choose another active team member.' }, { status: 400 });
    }
    if (!text && !attachment) return NextResponse.json({ error: 'Type a message or attach a file.' }, { status: 400 });
    if (text.length > MAX_MESSAGE_LENGTH) return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
    if (!isTeamRoom && !await getActiveRecipient(recipientId)) {
      return NextResponse.json({ error: 'This team member is no longer active.' }, { status: 400 });
    }

    const payload: ChatPayload = { text, client_id: crypto.randomUUID() };
    if (attachment) {
      if (attachment.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Attachments must be 5 MB or smaller.' }, { status: 400 });
      if (!ALLOWED_FILE_TYPES.has(attachment.type)) return NextResponse.json({ error: 'This attachment type is not supported.' }, { status: 400 });
      const path = `team-chat/${gate.user.id}/${crypto.randomUUID()}-${safeFileName(attachment.name)}`;
      const { error: uploadError } = await supabaseAdmin.storage.from('crm-files').upload(path, attachment, {
        contentType: attachment.type,
        upsert: false,
      });
      if (uploadError) throw new Error(uploadError.message);
      payload.attachment_path = path;
      payload.attachment_name = attachment.name;
      payload.attachment_type = attachment.type;
      payload.attachment_size = attachment.size;
    }

    if (isTeamRoom) {
      const { data: recipients, error: recipientsError } = await supabaseAdmin
        .from('crm_users')
        .select('id')
        .eq('is_active', true)
        .in('role', CHAT_ROLES);
      if (recipientsError) throw new Error(recipientsError.message);
      const rows = (recipients || []).map((recipient) => ({
        recipient_id: recipient.id,
        type: 'team_chat_group',
        title: gate.user.id,
        body: JSON.stringify(payload),
        link: null,
        is_read: recipient.id === gate.user.id,
      }));
      const { data, error } = await supabaseAdmin.from('crm_notifications').insert(rows).select('*');
      if (error) throw new Error(error.message);
      const ownRow = (data || []).find((row) => row.recipient_id === gate.user.id) || data?.[0];
      return NextResponse.json({ message: ownRow ? (await serializeMessages([ownRow]))[0] : null });
    }

    return NextResponse.json({ message: await insertMessage(gate.user.id, recipientId, payload) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to send message.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const gate = await requireCrmMember(req);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
  if (!supabaseAdmin) return NextResponse.json({ error: 'Chat service is unavailable.' }, { status: 503 });
  const body = await req.json() as { peer_id?: string };
  if (!body.peer_id) return NextResponse.json({ error: 'A conversation is required.' }, { status: 400 });
  const teamRoom = body.peer_id === 'team';
  let query = supabaseAdmin
    .from('crm_notifications')
    .update({ is_read: true })
    .eq('recipient_id', gate.user.id)
    .eq('is_read', false);
  query = teamRoom ? query.eq('type', 'team_chat_group') : query.eq('type', 'team_chat').eq('title', body.peer_id);
  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const gate = await requireCrmMember(req);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
  if (!supabaseAdmin) return NextResponse.json({ error: 'Chat service is unavailable.' }, { status: 503 });
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'A message is required.' }, { status: 400 });
  const { data: row } = await supabaseAdmin
    .from('crm_notifications')
    .select('id,title,body,type')
    .eq('id', id)
    .in('type', ['team_chat', 'team_chat_group'])
    .maybeSingle();
  if (!row || row.title !== gate.user.id) return NextResponse.json({ error: 'Only the sender can delete this message.' }, { status: 403 });
  const payload = parsePayload(row.body);
  let targetIds = [row.id];
  if (row.type === 'team_chat_group' && payload.client_id) {
    const { data: copies } = await supabaseAdmin
      .from('crm_notifications')
      .select('id,body')
      .eq('type', 'team_chat_group')
      .eq('title', gate.user.id);
    targetIds = (copies || []).filter((copy) => parsePayload(copy.body).client_id === payload.client_id).map((copy) => copy.id);
  }
  const { error } = await supabaseAdmin.from('crm_notifications').update({
    body: JSON.stringify({ text: '', deleted: true, client_id: payload.client_id }),
    is_read: true,
  }).in('id', targetIds);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (payload.attachment_path) await supabaseAdmin.storage.from('crm-files').remove([payload.attachment_path]);
  return NextResponse.json({ ok: true });
}
