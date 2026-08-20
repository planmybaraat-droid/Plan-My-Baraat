import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';

// Server-only credentials for the /quote-maker staff tool. This is a single
// shared login (not a real user account), so it's kept as a plain constant
// here rather than wired into Supabase auth. This file has `import
// 'server-only'` at the top, which makes Next.js throw a build error if
// anything under app/quote-maker's *client* components ever tries to import
// it directly — so these values can never end up in the browser JS bundle.
const QUOTE_MAKER_ID = 'PMB@2026';
const QUOTE_MAKER_PASSWORD = 'Maker';

// Used only to sign the session cookie so it can't be forged by guessing —
// this is not the login password itself.
const SESSION_SIGNING_SECRET = 'pmb-quote-maker-session-9f3c7a1e-2026';

export const QUOTE_MAKER_COOKIE_NAME = 'pmb_quote_maker_session';
export const QUOTE_MAKER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function sign(value: string): string {
  return createHmac('sha256', SESSION_SIGNING_SECRET).update(value).digest('hex');
}

export function verifyQuoteMakerCredentials(id: string, password: string): boolean {
  return id === QUOTE_MAKER_ID && password === QUOTE_MAKER_PASSWORD;
}

export function createQuoteMakerSessionToken(): string {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function isQuoteMakerSessionTokenValid(token: string | undefined | null): boolean {
  if (!token) return false;
  const [issuedAt, signature] = token.split('.');
  if (!issuedAt || !signature) return false;

  const expectedSignature = sign(issuedAt);
  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== providedBuffer.length) return false;
  if (!timingSafeEqual(expectedBuffer, providedBuffer)) return false;

  const issuedAtMs = Number(issuedAt);
  if (!Number.isFinite(issuedAtMs)) return false;
  return Date.now() - issuedAtMs < QUOTE_MAKER_SESSION_MAX_AGE_SECONDS * 1000;
}
