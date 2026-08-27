import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { publicSupabaseKey, publicSupabaseUrl } from '../../../../lib/deployment-config';

const allowedPosition = 'Full Stack Developer Intern';
const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function POST(request: Request) {
  if (!publicSupabaseUrl || !publicSupabaseKey) {
    return NextResponse.json({ error: 'Applications are temporarily unavailable.' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid application data.' }, { status: 400 });
  }

  const payload = {
    full_name: clean(body.name, 120),
    phone: clean(body.phone, 30),
    email: clean(body.email, 180).toLowerCase(),
    city: clean(body.city, 120),
    position: clean(body.position, 120),
    education: clean(body.education, 180),
    experience_level: clean(body.experience, 80),
    skills: clean(body.skills, 600),
    availability: clean(body.availability, 80),
    resume_url: clean(body.resumeLink, 1000),
    introduction: clean(body.introduction, 2000),
  };
  const digits = payload.phone.replace(/\D/g, '');
  let resume: URL;
  try { resume = new URL(payload.resume_url); } catch {
    return NextResponse.json({ error: 'Enter a valid public resume link.' }, { status: 400 });
  }
  if (resume.protocol !== 'https:' && resume.protocol !== 'http:') {
    return NextResponse.json({ error: 'Resume link must start with https:// or http://.' }, { status: 400 });
  }
  if (!payload.full_name || digits.length < 10 || !/^\S+@\S+\.\S+$/.test(payload.email) || !payload.city || payload.position !== allowedPosition || !payload.education || !payload.experience_level || !payload.skills || !payload.availability || !payload.introduction) {
    return NextResponse.json({ error: 'Please complete every required field correctly.' }, { status: 400 });
  }

  const supabase = createClient(publicSupabaseUrl, publicSupabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.from('crm_recruitment_applications').insert({ ...payload, status: 'New', source: 'Website', updated_by: null });
  if (error) {
    console.error('Opportunity application failed', error);
    return NextResponse.json({ error: 'We could not save your application. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
