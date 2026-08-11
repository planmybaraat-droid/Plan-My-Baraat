import { NextRequest, NextResponse } from 'next/server';
import { requireCrmAdmin } from '@/app/crm/lib/apiAuth';
import { getDailyStaffReportAdminState, runDailyStaffReport } from '@/app/crm/lib/daily-staff-report-server';
import { supabaseAdmin } from '@/app/crm/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const normalizeRecipient = (value: unknown) => String(value || '').replace(/\D/g, '').replace(/^0+/, '');

export async function GET(req: NextRequest) {
  const gate = await requireCrmAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
  try {
    if (supabaseAdmin) return NextResponse.json(await getDailyStaffReportAdminState());
    const [{data:settings,error:settingsError},{data:attendance,error:attendanceError},{data:deliveries,error:deliveriesError}]=await Promise.all([
      gate.supabase.from('crm_daily_staff_report_settings').select('*').eq('id',1).single(),
      gate.supabase.from('crm_attendance_settings').select('business_timezone,lock_time,working_days').eq('id',1).single(),
      gate.supabase.from('crm_daily_staff_report_deliveries').select('*').order('report_date',{ascending:false}).limit(31),
    ]);
    const readError=settingsError||attendanceError||deliveriesError;
    if(readError)throw new Error(readError.message);
    return NextResponse.json({settings,attendance,deliveries:deliveries||[],providerConfigured:false,cronConfigured:false});
  }
  catch (cause) { return NextResponse.json({ error: cause instanceof Error ? cause.message : 'Unable to load report settings.' }, { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  const gate = await requireCrmAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'A valid settings object is required.' }, { status: 400 });
  const recipient = normalizeRecipient(body.recipient_e164);
  if (!/^[1-9][0-9]{7,14}$/.test(recipient)) return NextResponse.json({ error: 'Enter the WhatsApp number with country code.' }, { status: 400 });
  const template = String(body.whatsapp_template_name || '').trim();
  const language = String(body.whatsapp_template_language || '').trim();
  if (!template || !/^[a-z0-9_]+$/.test(template)) return NextResponse.json({ error: 'Enter a valid approved WhatsApp template name.' }, { status: 400 });
  if (!language || language.length > 10) return NextResponse.json({ error: 'Enter a valid template language code.' }, { status: 400 });
  const maxAttempts = Math.min(5, Math.max(1, Number(body.max_attempts) || 3));
  const serverClient=supabaseAdmin||gate.supabase;
  const { data, error } = await serverClient.from('crm_daily_staff_report_settings').update({
    is_enabled: body.is_enabled === true, recipient_e164: recipient,
    whatsapp_template_name: template, whatsapp_template_language: language,
    max_attempts: maxAttempts, updated_by: gate.user.id,
  }).eq('id', 1).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ settings: data });
}

export async function POST(req: NextRequest) {
  const gate = await requireCrmAdmin(req);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });
  const body = await req.json().catch(() => null) as { report_date?: string; retry_failed?: boolean } | null;
  if (!body?.report_date || !/^\d{4}-\d{2}-\d{2}$/.test(body.report_date)) {
    return NextResponse.json({ error: 'A valid report date is required.' }, { status: 400 });
  }
  try {
    const result = await runDailyStaffReport({ reportDate: body.report_date, requestedBy: gate.user.id, retryFailed: body.retry_failed === true });
    return NextResponse.json(result, { status: result.ok ? 200 : 409 });
  } catch (cause) {
    return NextResponse.json({ error: cause instanceof Error ? cause.message : 'Unable to send the report.' }, { status: 500 });
  }
}
