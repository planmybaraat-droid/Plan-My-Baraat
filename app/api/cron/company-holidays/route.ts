import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../crm/lib/supabase-admin';
import { generateCompanyHolidays } from '../../../crm/lib/company-holidays-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: 'CRON_SECRET is not configured.' }, { status: 503 });
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  if (!supabaseAdmin) return NextResponse.json({ error: 'Supabase admin access is not configured.' }, { status: 503 });

  try {
    const currentYear = Number(new Intl.DateTimeFormat('en', { timeZone: 'Asia/Kolkata', year: 'numeric' }).format(new Date()));
    const rows = generateCompanyHolidays([currentYear, currentYear + 1, currentYear + 2]);
    const { error } = await supabaseAdmin.from('crm_company_holidays').upsert(rows, { onConflict: 'holiday_date' });
    if (error) throw error;
    return NextResponse.json({ ok: true, years: [currentYear, currentYear + 1, currentYear + 2], holidays: rows.length });
  } catch (cause) {
    console.error('Company holiday sync failed', cause);
    return NextResponse.json({ error: cause instanceof Error ? cause.message : 'Holiday sync failed.' }, { status: 500 });
  }
}
