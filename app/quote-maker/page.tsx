import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { QUOTE_MAKER_COOKIE_NAME, isQuoteMakerSessionTokenValid } from '@/lib/quoteMakerAuth';
import QuoteMakerLogin from './QuoteMakerLogin';
import QuoteMakerApp from './QuoteMakerApp';

export const dynamic = 'force-dynamic';

// Deliberately excluded from search engines (also blocked in robots.ts) and
// never linked from the site header/footer or nav — reachable only by
// someone who has the direct /quote-maker URL, and then only past the login.
export const metadata: Metadata = {
  title: 'Quote Maker',
  robots: { index: false, follow: false },
};

export default function QuoteMakerPage() {
  const token = cookies().get(QUOTE_MAKER_COOKIE_NAME)?.value;
  const authenticated = isQuoteMakerSessionTokenValid(token);
  return authenticated ? <QuoteMakerApp /> : <QuoteMakerLogin />;
}
