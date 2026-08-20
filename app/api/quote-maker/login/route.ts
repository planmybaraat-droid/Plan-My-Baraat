import { NextRequest, NextResponse } from 'next/server';
import {
  QUOTE_MAKER_COOKIE_NAME, QUOTE_MAKER_SESSION_MAX_AGE_SECONDS,
  createQuoteMakerSessionToken, verifyQuoteMakerCredentials,
} from '@/lib/quoteMakerAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const id = typeof (body as Record<string, unknown>)?.id === 'string' ? (body as Record<string, string>).id.trim() : '';
  const password = typeof (body as Record<string, unknown>)?.password === 'string' ? (body as Record<string, string>).password : '';

  if (!id || !password) {
    return NextResponse.json({ error: 'Enter both the ID and password.' }, { status: 400 });
  }

  if (!verifyQuoteMakerCredentials(id, password)) {
    return NextResponse.json({ error: 'Incorrect ID or password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(QUOTE_MAKER_COOKIE_NAME, createQuoteMakerSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/quote-maker',
    maxAge: QUOTE_MAKER_SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
