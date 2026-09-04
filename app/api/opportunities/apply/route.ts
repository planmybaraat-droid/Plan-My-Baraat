import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { publicSupabaseKey, publicSupabaseUrl } from '../../../../lib/deployment-config';

const roles = {
  'sales-executive': 'Sales Executive (Female)',
  'video-editor': 'Video Editor',
} as const;
const text = (value: unknown, max = 1000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const list = (value: unknown) => Array.isArray(value) ? value.map(item => text(item, 100)).filter(Boolean).slice(0, 20) : [];
const validUrl = (value: string, required = false) => {
  if (!value) return !required;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
};

export async function POST(request: Request) {
  if (!publicSupabaseUrl || !publicSupabaseKey) return NextResponse.json({ error: 'Applications are temporarily unavailable.' }, { status: 503 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid application data.' }, { status: 400 }); }

  const role = text(body.role, 40) as keyof typeof roles;
  const fullName = text(body.fullName, 120);
  const phone = text(body.phone, 30);
  const email = text(body.email, 180).toLowerCase();
  const city = text(body.city, 120);
  const dateOfBirth = text(body.dateOfBirth, 10);
  const gender = text(body.gender, 20);
  const experience = text(body.experience, 80);
  const joiningDate = text(body.joiningDate, 10);
  const resumeLink = text(body.resumeLink, 1000);
  const profileLink = text(body.profileLink, 1000);
  const languages = list(body.languages);
  const phoneDigits = phone.replace(/\D/g, '');

  if (!roles[role] || fullName.length < 2 || phoneDigits.length < 10 || phoneDigits.length > 15 || !/^\S+@\S+\.\S+$/.test(email) || !city || !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) || !gender || !experience || !/^\d{4}-\d{2}-\d{2}$/.test(joiningDate) || !languages.length || !validUrl(resumeLink, true) || !validUrl(profileLink)) {
    return NextResponse.json({ error: 'Please complete every required field correctly and use public http(s) links.' }, { status: 400 });
  }

  const common = { dateOfBirth, gender, languages, joiningDate, profileLink };
  let applicationData: Record<string, unknown>;
  let skills: string;
  let introduction: string;
  if (role === 'sales-executive') {
    const averageSalesTarget = text(body.averageSalesTarget, 20);
    const eventIndustryExperience = text(body.eventIndustryExperience, 5);
    const largestDealClosed = text(body.largestDealClosed, 20);
    const dailyFollowUp = text(body.dailyFollowUp, 3);
    const workingHours = text(body.workingHours, 3);
    if (!averageSalesTarget || !largestDealClosed || !['Yes','No'].includes(eventIndustryExperience) || !['Yes','No'].includes(dailyFollowUp) || !['Yes','No'].includes(workingHours)) return NextResponse.json({ error: 'Please complete all sales experience and role compatibility fields.' }, { status: 400 });
    applicationData = { ...common, averageSalesTarget, eventIndustryExperience, eventCompany: text(body.eventCompany, 180), eventExperienceDuration: text(body.eventExperienceDuration, 100), largestDealClosed, dailyFollowUp, workingHours };
    skills = `Lead follow-up: ${dailyFollowUp}; Wedding/event sales: ${eventIndustryExperience}`;
    introduction = `Monthly target: ₹${averageSalesTarget}; Largest deal: ₹${largestDealClosed}`;
  } else {
    const software = list(body.software);
    const editingNiche = text(body.editingNiche, 80);
    const portfolioLink = text(body.portfolioLink, 1000);
    const deliveryTime = text(body.deliveryTime, 40);
    const videosPerMonth = text(body.videosPerMonth, 10);
    const dailyEventEditing = text(body.dailyEventEditing, 3);
    const workingHours = text(body.workingHours, 3);
    const urgentEdits = text(body.urgentEdits, 3);
    if (!software.length || !editingNiche || !validUrl(portfolioLink, true) || !deliveryTime || !videosPerMonth || ![dailyEventEditing, workingHours, urgentEdits].every(value => ['Yes','No'].includes(value))) return NextResponse.json({ error: 'Please complete all editing skills, portfolio and compatibility fields.' }, { status: 400 });
    applicationData = { ...common, currentCompany: text(body.currentCompany, 180), editingNiche, software, videosPerMonth, deliveryTime, portfolioLink, bestWeddingEditLink: text(body.bestWeddingEditLink, 1000), largestClient: text(body.largestClient, 180), highestProjectValue: text(body.highestProjectValue, 20), dailyEventEditing, workingHours, urgentEdits };
    if (!validUrl(String(applicationData.bestWeddingEditLink))) return NextResponse.json({ error: 'Please enter a valid Best Wedding Edit link.' }, { status: 400 });
    skills = software.join(', ');
    introduction = `${editingNiche}; ${videosPerMonth} videos/month; ${deliveryTime} reel delivery`;
  }

  const supabase = createClient(publicSupabaseUrl, publicSupabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.from('crm_recruitment_applications').insert({
    full_name: fullName, phone, email, city, position: roles[role], education: 'Not requested', experience_level: experience,
    skills, availability: joiningDate, resume_url: resumeLink, introduction, application_data: applicationData,
    role_slug: role, status: 'New', source: 'Website', updated_by: null,
  }).select('id').single();
  if (error || !data) {
    console.error('Opportunity application failed', error);
    return NextResponse.json({ error: 'We could not save your application. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, applicationId: data.id });
}
