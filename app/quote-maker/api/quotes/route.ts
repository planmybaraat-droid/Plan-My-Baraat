import { NextRequest, NextResponse } from 'next/server';
import { MASTER_SERVICES } from '@/lib/businessCatalog';
import { QUOTE_MAKER_COOKIE_NAME, isQuoteMakerSessionTokenValid } from '@/lib/quoteMakerAuth';
import { supabase } from '@/lib/supabase';
import type { QuoteMakerQuotePayload, QuoteMakerServiceSelection } from '../../quote-types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const serviceCategory = new Map(MASTER_SERVICES.map((service) => [service.name, service.category]));
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function authorized(request: NextRequest) {
  return isQuoteMakerSessionTokenValid(request.cookies.get(QUOTE_MAKER_COOKIE_NAME)?.value);
}

function money(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 100_000_000
    ? Math.round(parsed * 100) / 100
    : null;
}

function parsePayload(value: unknown): { data?: QuoteMakerQuotePayload; error?: string } {
  if (!value || typeof value !== 'object') return { error: 'Invalid quote data.' };
  const source = value as Record<string, unknown>;
  const id = typeof source.id === 'string' && UUID_PATTERN.test(source.id) ? source.id : undefined;
  const clientName = typeof source.client_name === 'string' ? source.client_name.trim().replace(/\s+/g, ' ') : '';
  const eventDate = typeof source.event_date === 'string' ? source.event_date.trim() : '';
  const clientNumber = typeof source.client_number === 'string' ? source.client_number.trim() : '';
  const finalPrice = money(source.final_price);
  const transportCost = money(source.transport_cost);
  const discount = money(source.discount);

  if (clientName.length < 2 || clientName.length > 120) return { error: 'Enter a valid client name.' };
  if (!DATE_PATTERN.test(eventDate) || Number.isNaN(new Date(`${eventDate}T00:00:00`).getTime())) return { error: 'Enter a valid event date.' };
  if (!/^\+?[0-9 ()-]{7,20}$/.test(clientNumber) || clientNumber.replace(/\D/g, '').length < 7) return { error: 'Enter a valid client number.' };
  if (finalPrice === null || finalPrice <= 0 || transportCost === null || discount === null) return { error: 'Enter valid pricing details.' };
  if (discount > finalPrice + transportCost) return { error: 'Discount cannot be greater than the quote value.' };
  if (!Array.isArray(source.selected_services)) return { error: 'Select at least one service.' };

  const selections: QuoteMakerServiceSelection[] = [];
  const seen = new Set<string>();
  for (const raw of source.selected_services.slice(0, MASTER_SERVICES.length)) {
    if (!raw || typeof raw !== 'object') continue;
    const name = typeof (raw as Record<string, unknown>).name === 'string' ? String((raw as Record<string, unknown>).name).trim() : '';
    const category = serviceCategory.get(name);
    if (!category || seen.has(name)) continue;
    seen.add(name);
    selections.push({
      name,
      category,
      quantity_or_note: typeof (raw as Record<string, unknown>).quantity_or_note === 'string'
        ? String((raw as Record<string, unknown>).quantity_or_note).trim().slice(0, 80)
        : '',
    });
  }
  if (!selections.length) return { error: 'Select at least one service.' };

  return {
    data: {
      id,
      client_name: clientName,
      event_date: eventDate,
      client_number: clientNumber,
      selected_services: selections,
      final_price: finalPrice,
      transport_cost: transportCost,
      discount,
    },
  };
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Your Quote Maker session has expired.' }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: 'Quote storage is not configured on the server.' }, { status: 503 });

  const page = Math.max(1, Math.min(10_000, Number(request.nextUrl.searchParams.get('page')) || 1));
  const pageSize = Math.max(5, Math.min(50, Number(request.nextUrl.searchParams.get('pageSize')) || 10));
  const search = (request.nextUrl.searchParams.get('search') || '').replace(/[^a-zA-Z0-9 +@._-]/g, '').trim().slice(0, 60);
  const token = request.cookies.get(QUOTE_MAKER_COOKIE_NAME)!.value;
  const { data, error } = await supabase.rpc('crm_quote_maker_list_quotes', {
    p_session_token: token,
    p_page: page,
    p_page_size: pageSize,
    p_search: search,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || { quotes: [], total: 0, page, pageSize });
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Your Quote Maker session has expired.' }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: 'Quote storage is not configured on the server.' }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  const parsed = parsePayload(body);
  if (!parsed.data) return NextResponse.json({ error: parsed.error || 'Invalid quote data.' }, { status: 400 });

  const values = parsed.data;
  const token = request.cookies.get(QUOTE_MAKER_COOKIE_NAME)!.value;
  const result = await supabase.rpc('crm_quote_maker_save_quote', {
    p_session_token: token,
    p_id: values.id || null,
    p_client_name: values.client_name,
    p_event_date: values.event_date,
    p_client_number: values.client_number,
    p_selected_services: values.selected_services,
    p_final_price: values.final_price,
    p_transport_cost: values.transport_cost,
    p_discount: values.discount,
  });

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  const quote = Array.isArray(result.data) ? result.data[0] : result.data;
  if (!quote) return NextResponse.json({ error: 'Saved quote was not returned.' }, { status: 500 });
  return NextResponse.json({ quote }, { status: values.id ? 200 : 201 });
}
