import { NextResponse } from 'next/server';
import { QUOTE_MAKER_COOKIE_NAME } from '@/lib/quoteMakerAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(QUOTE_MAKER_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/quote-maker',
    maxAge: 0,
  });
  return response;
}
