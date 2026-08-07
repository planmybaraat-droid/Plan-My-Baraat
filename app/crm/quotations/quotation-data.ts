import { CRM_CONFIGURATION_ERROR, crmSupabase } from '../lib/supabase-crm';
import type { QuotationActivity, QuotationFilters, QuotationFormData, QuotationRecord } from '../lib/types';

const STORAGE_KEY = 'crm_quotations';
const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-url'));

function localRecords(): QuotationRecord[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]') as QuotationRecord[]; } catch { return []; }
}
function saveLocal(records: QuotationRecord[]) { if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }

function rowToRecord(row: Record<string, unknown>): QuotationRecord {
  const payload = (row.payload || {}) as QuotationFormData;
  return {
    ...payload,
    id: String(row.id),
    quotation_number: String(row.quotation_number || payload.quotation_number),
    client_name: String(row.client_name || payload.client_name),
    mobile: String(row.mobile || payload.mobile),
    email: String(row.email || payload.email || ''),
    event_date: String(row.event_date || payload.event_date || ''),
    valid_until: String(row.valid_until || payload.valid_until),
    package_name: (row.package_name || payload.package_name) as QuotationFormData['package_name'],
    pricing_mode: (row.pricing_mode || payload.pricing_mode) as QuotationFormData['pricing_mode'],
    status: (row.status || payload.status) as QuotationFormData['status'],
    version: Number(row.version || payload.version || 1),
    subtotal: Number(row.subtotal ?? payload.subtotal ?? 0),
    discount: Number(row.discount ?? payload.discount ?? 0),
    gst_percent: Number(row.gst_percent ?? payload.gst_percent ?? 0),
    total_amount: Number(row.total_amount ?? payload.total_amount ?? 0),
    converted_agreement_id: String(row.converted_agreement_id || payload.converted_agreement_id || ''),
    created_at: String(row.created_at), updated_at: String(row.updated_at),
    verification_code: String(row.verification_code || ''),
  };
}

function recordToRow(payload: QuotationFormData) {
  return {
    quotation_number: payload.quotation_number, client_name: payload.client_name, mobile: payload.mobile,
    email: payload.email || null, event_date: payload.event_date || null, valid_until: payload.valid_until,
    package_name: payload.package_name, pricing_mode: payload.pricing_mode, status: payload.status,
    version: payload.version, subtotal: payload.subtotal, discount: payload.discount,
    gst_percent: payload.gst_percent, total_amount: payload.total_amount,
    converted_agreement_id: payload.converted_agreement_id || null, payload, updated_at: new Date().toISOString(),
  };
}

async function storage<T>(remote: () => Promise<T>, _local: () => T | Promise<T>): Promise<T> {
  if (!configured) throw new Error(CRM_CONFIGURATION_ERROR);
  return remote();
}

export async function getNextQuotationNumber() {
  const year = new Date().getFullYear();
  return storage(async () => {
    const { data, error } = await crmSupabase.rpc('crm_next_quotation_number');
    if (error) throw new Error(error.message);
    return String(data);
  }, () => {
    const prefix = `PMB-QTN-${year}-`;
    const values = localRecords().filter(item => item.quotation_number.startsWith(prefix)).map(item => Number(item.quotation_number.split('-').pop()) || 0);
    return `${prefix}${String(Math.max(0, ...values) + 1).padStart(4, '0')}`;
  });
}

export async function getQuotations(filters: Partial<QuotationFilters> = {}) {
  return storage(async () => {
    let query = crmSupabase.from('crm_quotations').select('*').order('updated_at', { ascending: false });
    if (filters.search) { const safe = filters.search.replace(/[(),]/g, ' '); query = query.or(`quotation_number.ilike.%${safe}%,client_name.ilike.%${safe}%,mobile.ilike.%${safe}%`); }
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.package_name) query = query.eq('package_name', filters.package_name);
    if (filters.event_date_from) query = query.gte('event_date', filters.event_date_from);
    if (filters.event_date_to) query = query.lte('event_date', filters.event_date_to);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map(row => rowToRecord(row));
  }, () => localRecords());
}

export async function getQuotationById(id: string) {
  return storage(async () => {
    const { data, error } = await crmSupabase.from('crm_quotations').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return rowToRecord(data);
  }, () => localRecords().find(item => item.id === id) || null);
}

export async function createQuotation(payload: QuotationFormData) {
  const now = new Date().toISOString();
  const activity: QuotationActivity = { id: `quote-activity-${Date.now()}`, type: 'created', title: 'Quotation created', detail: `${payload.quotation_number} created as draft.`, actor: payload.created_by_name || 'CRM Staff', created_at: now };
  let prepared: QuotationFormData = { ...payload, activity: [activity, ...payload.activity] };
  return storage(async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const { data, error } = await crmSupabase.from('crm_quotations').insert(recordToRow(prepared)).select().single();
      if (!error) return rowToRecord(data);
      if (error.code !== '23505') throw new Error(error.message);
      const { data: existing } = await crmSupabase.from('crm_quotations').select('*').eq('quotation_number', prepared.quotation_number).maybeSingle();
      if (existing && String(existing.client_name) === prepared.client_name && String(existing.mobile) === prepared.mobile && String(existing.event_date || '') === prepared.event_date && Number(existing.total_amount) === prepared.total_amount) return rowToRecord(existing);
      const nextNumber = await getNextQuotationNumber();
      prepared = { ...prepared, quotation_number: nextNumber, activity: prepared.activity.map((item, index) => index === 0 ? { ...item, detail: `${nextNumber} created as draft.` } : item) };
    }
    throw new Error('Unable to allocate a unique quotation number.');
  }, () => {
    const record: QuotationRecord = { ...prepared, id: `quotation-${Date.now()}`, created_at: now, updated_at: now, verification_code: crypto.randomUUID().replace(/-/g, '').slice(0, 16) };
    saveLocal([record, ...localRecords()]); return record;
  });
}

export async function updateQuotation(id: string, payload: QuotationFormData, summary = 'Quotation revised') {
  const previous = await getQuotationById(id);
  if (!previous) throw new Error('Quotation not found.');
  const now = new Date().toISOString();
  const { revisions: _revisions, activity: _activity, id: _id, created_at: _created, updated_at: _updated, ...snapshot } = previous;
  void _revisions; void _activity; void _id; void _created; void _updated;
  const revised: QuotationFormData = {
    ...payload, version: previous.version + 1,
    revisions: [{ version: previous.version, created_at: now, created_by: payload.created_by_name || 'CRM Staff', summary, snapshot }, ...previous.revisions],
    activity: [{ id: `quote-activity-${Date.now()}`, type: previous.status === payload.status ? 'updated' : 'status', title: previous.status === payload.status ? 'Quotation revised' : `Status changed to ${payload.status}`, detail: summary, actor: payload.created_by_name || 'CRM Staff', created_at: now }, ...previous.activity],
  };
  return storage(async () => {
    const { data, error } = await crmSupabase.from('crm_quotations').update(recordToRow(revised)).eq('id', id).select().single();
    if (error) throw new Error(error.message); return rowToRecord(data);
  }, () => {
    const records = localRecords(); const index = records.findIndex(item => item.id === id); if (index < 0) throw new Error('Quotation not found.');
    const record = { ...records[index], ...revised, updated_at: now }; records[index] = record; saveLocal(records); return record;
  });
}

export async function deleteQuotation(id: string) {
  return storage(async () => { const { error } = await crmSupabase.from('crm_quotations').delete().eq('id', id); if (error) throw new Error(error.message); }, () => saveLocal(localRecords().filter(item => item.id !== id)));
}
