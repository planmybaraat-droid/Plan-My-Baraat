import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../crm/lib/supabase-admin';

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path') || '';
  if (!supabaseAdmin || !path.startsWith('recruitment/')) return NextResponse.json({ error: 'Resume unavailable.' }, { status: 404 });
  const { data, error } = await supabaseAdmin.storage.from('crm-files').createSignedUrl(path, 60 * 10);
  if (error || !data?.signedUrl) return NextResponse.json({ error: 'Resume unavailable.' }, { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
