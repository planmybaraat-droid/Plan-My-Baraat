import { NextRequest, NextResponse } from 'next/server';
import { runDailyStaffReport } from '@/app/crm/lib/daily-staff-report-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return NextResponse.json({ error: 'CRON_SECRET is not configured.' }, { status: 503 });
  if (req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  try {
    return NextResponse.json(await runDailyStaffReport());
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'Daily staff report failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
