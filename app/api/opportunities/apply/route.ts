import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { publicSupabaseKey, publicSupabaseUrl } from '../../../../lib/deployment-config';
import { isSupabaseAdminConfigured, supabaseAdmin } from '../../../crm/lib/supabase-admin';

const roles = {
  'sales-executive': 'Sales Executive',
  'video-editor': 'Video Editor',
} as const;
const text = (value: unknown, max = 1000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const list = (value: unknown) => Array.isArray(value) ? value.map(item => text(item, 100)).filter(Boolean).slice(0, 20) : [];
const validUrl = (value: string, required = false) => {
  if (!value) return !required;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
};
const fiveDaysFromNow = () => new Date(Date.now() + 5 * 86400000);
const validInterviewTime = (value: string) => ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'].includes(value);

export async function POST(request: Request) {
  if (!publicSupabaseUrl || !publicSupabaseKey) return NextResponse.json({ error: 'Applications are temporarily unavailable.' }, { status: 503 });
  let form: FormData;
  try { form = await request.formData(); } catch { return NextResponse.json({ error: 'Invalid application data.' }, { status: 400 }); }
  const body = Object.fromEntries(Array.from(form.entries()).filter(([, value]) => !(value instanceof File))) as Record<string, unknown>;

  const role = text(body.role, 40) as keyof typeof roles;
  const applicationId = randomUUID();
  const fullName = text(body.fullName, 120);
  const phone = text(body.phone, 30);
  const email = text(body.email, 180).toLowerCase();
  const city = text(body.city, 120);
  const dateOfBirth = text(body.dateOfBirth, 10);
  const gender = text(body.gender, 20);
  const experience = text(body.experience, 80);
  const joiningDate = text(body.joiningDate, 10);
  const interviewDate = text(body.interviewDate, 10);
  const interviewTime = text(body.interviewTime, 5);
  const resumeLink = text(body.resumeLink, 1000);
  const profileLink = text(body.profileLink, 1000);
  const languages = form.getAll('languages').map(value => text(value, 100)).filter(Boolean);
  const phoneDigits = phone.replace(/\D/g, '');

  if (!roles[role] || fullName.length < 2 || phoneDigits.length < 10 || phoneDigits.length > 15 || !gender || !experience) {
    return NextResponse.json({ error: 'Please complete every required field correctly.' }, { status: 400 });
  }

  const common = { gender, interviewDate, interviewTime };
  let applicationData: Record<string, unknown>;
  let skills: string;
  let introduction: string;
  let uploadedResumePath: string | null = null;
  let scheduledAt: Date | null = null;
  if (role === 'sales-executive') {
    const previousIndustry = text(body.previousIndustry, 180);
    const resumeFile = form.get('resumeFile');
    scheduledAt = new Date(`${interviewDate}T${interviewTime}:00`);
    if (!previousIndustry || !(resumeFile instanceof File) || !resumeFile.size || !/^\d{4}-\d{2}-\d{2}$/.test(interviewDate) || !validInterviewTime(interviewTime) || Number.isNaN(scheduledAt.getTime()) || scheduledAt < new Date() || scheduledAt > fiveDaysFromNow()) return NextResponse.json({ error: 'Please add your resume and choose a 2:00 PM–6:00 PM interview slot within five days.' }, { status: 400 });
    if (resumeFile.size > 5 * 1024 * 1024 || !['application/pdf','image/jpeg','image/png','image/webp'].includes(resumeFile.type)) return NextResponse.json({ error: 'Upload a PDF, JPG, PNG or WEBP resume up to 5 MB.' }, { status: 400 });
    if (!isSupabaseAdminConfigured || !supabaseAdmin) return NextResponse.json({ error: 'Resume uploads are not configured. Please contact us through WhatsApp.' }, { status: 503 });
    const extension = resumeFile.type === 'application/pdf' ? 'pdf' : resumeFile.type.split('/')[1];
    const uploadPath = `recruitment/${applicationId}/resume.${extension}`;
    const { error: uploadError } = await supabaseAdmin.storage.from('crm-files').upload(uploadPath, resumeFile, { contentType: resumeFile.type, upsert: false });
    if (uploadError) { console.error('Resume upload failed', uploadError); return NextResponse.json({ error: 'We could not upload your resume. Please try again.' }, { status: 500 }); }
    applicationData = { ...common, previousIndustry, interviewDate, interviewTime };
    skills = `Previous industry: ${previousIndustry}`;
    introduction = `Sales experience: ${experience}; Previous industry: ${previousIndustry}`;
    body.resumeLink = uploadPath;
    uploadedResumePath = uploadPath;
  } else {
    const software = form.getAll('software').map(value => text(value, 100)).filter(Boolean);
    const portfolioLink = text(body.portfolioLink, 1000);
    const workingHours = text(body.workingHours, 3);
    const resumeFile = form.get('resumeFile');
    scheduledAt = new Date(`${interviewDate}T${interviewTime}:00`);
    if (!software.length || !validUrl(portfolioLink, true) || !['Yes','No'].includes(workingHours) || !(resumeFile instanceof File) || !resumeFile.size || !/^\d{4}-\d{2}-\d{2}$/.test(interviewDate) || !validInterviewTime(interviewTime) || Number.isNaN(scheduledAt.getTime()) || scheduledAt < new Date() || scheduledAt > fiveDaysFromNow()) return NextResponse.json({ error: 'Please complete your editing details and choose a 2:00 PM–6:00 PM interview slot within five days.' }, { status: 400 });
    if (resumeFile.size > 5 * 1024 * 1024 || !['application/pdf','image/jpeg','image/png','image/webp'].includes(resumeFile.type)) return NextResponse.json({ error: 'Upload a PDF, JPG, PNG or WEBP resume up to 5 MB.' }, { status: 400 });
    if (!isSupabaseAdminConfigured || !supabaseAdmin) return NextResponse.json({ error: 'Resume uploads are not configured. Please contact us through WhatsApp.' }, { status: 503 });
    const extension = resumeFile.type === 'application/pdf' ? 'pdf' : resumeFile.type.split('/')[1];
    const uploadPath = `recruitment/${applicationId}/resume.${extension}`;
    const { error: uploadError } = await supabaseAdmin.storage.from('crm-files').upload(uploadPath, resumeFile, { contentType: resumeFile.type, upsert: false });
    if (uploadError) { console.error('Resume upload failed', uploadError); return NextResponse.json({ error: 'We could not upload your resume. Please try again.' }, { status: 500 }); }
    applicationData = { ...common, software, portfolioLink, workingHours };
    skills = software.join(', ');
    introduction = `Portfolio: ${portfolioLink}; 10 AM–7 PM timing: ${workingHours}`;
    body.resumeLink = uploadPath;
    uploadedResumePath = uploadPath;
  }

  const supabase = supabaseAdmin ?? createClient(publicSupabaseUrl, publicSupabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
  if (scheduledAt) {
    const { data: clash } = await supabase.from('crm_recruitment_interviews').select('id').eq('scheduled_at', scheduledAt.toISOString()).limit(1);
    if (clash?.length) return NextResponse.json({ error: 'That interview time has just been booked. Please choose another slot.' }, { status: 409 });
  }
  const { error } = await supabase.from('crm_recruitment_applications').insert({
    id: applicationId,
    full_name: fullName, phone, email: email || 'Not provided', city: city || 'Not provided', position: roles[role], education: 'Not requested', experience_level: experience,
    skills, availability: joiningDate || 'Not provided', resume_url: text(body.resumeLink, 1000), introduction, application_data: applicationData,
    role_slug: role, status: scheduledAt ? 'Interview Scheduled' : 'New', source: 'Website', updated_by: null,
  });
  if (error) {
    if (uploadedResumePath && supabaseAdmin) await supabaseAdmin.storage.from('crm-files').remove([uploadedResumePath]);
    console.error('Opportunity application failed', error);
    return NextResponse.json({ error: 'We could not save your application. Please try again.' }, { status: 500 });
  }
  if (scheduledAt) {
    const { error: interviewError } = await supabase.from('crm_recruitment_interviews').insert({ application_id: applicationId, round_number: 1, scheduled_at: scheduledAt.toISOString(), mode: 'Office', interviewer_name: 'Plan My Baraat', notes: 'Preferred slot selected on the sales application form' });
    if (interviewError) {
      await supabase.from('crm_recruitment_applications').update({ status: 'New' }).eq('id', applicationId);
      return NextResponse.json({ ok: true, applicationId, warning: 'Your application was saved, but the interview slot was no longer available. Our team will contact you with a suitable time.' });
    }
  }
  return NextResponse.json({ ok: true, applicationId });
}
