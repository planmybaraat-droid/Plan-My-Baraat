import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../crm/lib/supabase-admin';

const limit = () => new Date(Date.now() + 5 * 86400000);
const tokenOk = (value: unknown) => typeof value === 'string' && /^[0-9a-f-]{36}$/i.test(value);
const isInterviewSlot = (value: Date) => {
  const minutes = value.getHours() * 60 + value.getMinutes();
  return minutes >= 14 * 60 && minutes <= 18 * 60 && value.getMinutes() % 30 === 0;
};

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  if (!tokenOk(token) || !supabaseAdmin) return NextResponse.json({ error: 'This scheduling link is unavailable.' }, { status: 404 });
  const { data, error } = await supabaseAdmin.from('crm_recruitment_applications').select('full_name,position,scheduling_expires_at').eq('scheduling_token', token).single();
  if (error || !data || !data.scheduling_expires_at || new Date(data.scheduling_expires_at) < new Date()) return NextResponse.json({ error: 'This scheduling link has expired.' }, { status: 410 });
  return NextResponse.json({ candidate: { name: data.full_name, position: data.position }, min: new Date().toISOString(), max: limit().toISOString() });
}

export async function POST(request: Request) {
  let body: { token?: unknown; scheduledAt?: unknown }; try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid scheduling request.' }, { status: 400 }); }
  const when = new Date(String(body.scheduledAt));
  if (!tokenOk(body.token) || !supabaseAdmin || Number.isNaN(when.getTime()) || when <= new Date() || when > limit() || !isInterviewSlot(when)) return NextResponse.json({ error: 'Choose a 2:00 PM–6:00 PM slot within the next five days.' }, { status: 400 });
  const { data: candidate, error } = await supabaseAdmin.from('crm_recruitment_applications').select('id,full_name,position,scheduling_expires_at').eq('scheduling_token', body.token).single();
  if (error || !candidate || !candidate.scheduling_expires_at || new Date(candidate.scheduling_expires_at) < new Date()) return NextResponse.json({ error: 'This scheduling link has expired.' }, { status: 410 });
  const { data: existing } = await supabaseAdmin.from('crm_recruitment_interviews').select('id').eq('scheduled_at', when.toISOString()).limit(1);
  if (existing?.length) return NextResponse.json({ error: 'That time has just been booked. Please choose another time.' }, { status: 409 });
  const { data: interview, error: insertError } = await supabaseAdmin.from('crm_recruitment_interviews').insert({ application_id: candidate.id, round_number: 1, scheduled_at: when.toISOString(), mode: 'Office', interviewer_name: 'Plan My Baraat', notes: 'Time selected by candidate' }).select('id').single();
  if (insertError || !interview) return NextResponse.json({ error: 'We could not reserve that time. Please try again.' }, { status: 500 });
  const message = `Hello ${candidate.full_name},\n\nYour interview for ${candidate.position} is scheduled for ${when.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}.\nMode: Office\n\nPlan My Baraat`;
  await Promise.all([
    supabaseAdmin.from('crm_recruitment_applications').update({ status: 'Interview Scheduled', scheduling_token: null, scheduling_expires_at: null }).eq('id', candidate.id),
    supabaseAdmin.from('crm_recruitment_communications').insert({ application_id: candidate.id, interview_id: interview.id, message_type: 'Interview Scheduled', message_text: message }),
    supabaseAdmin.from('crm_recruitment_activity').insert({ application_id: candidate.id, action: 'Candidate selected interview time', details: { interview_id: interview.id, scheduled_at: when.toISOString() } }),
  ]);
  return NextResponse.json({ ok: true });
}
