import { CRM_CONFIGURATION_ERROR, crmSupabase, isCrmSupabaseConfigured } from '../lib/supabase-crm';
import type { InvoiceFilters, InvoiceFormData, InvoicePayment, InvoiceRecord } from '../lib/types';
import { financialYear } from './invoice-config';

const STORAGE_KEY = 'crm_invoices';
// Was previously checking process.env.NEXT_PUBLIC_SUPABASE_URL directly, which
// is undefined unless that exact env var is set on the host — every other
// CRM data module instead uses supabase-crm's isCrmSupabaseConfigured, which
// also accepts the built-in production fallback (see lib/deployment-config.ts).
// Left as its own env check, Invoices would silently fall back to "not
// configured" in any environment relying on that fallback while every other
// module kept working — the exact class of bug flagged in the CRM audit.
const isConfigured = isCrmSupabaseConfigured;

function localInvoices(): InvoiceRecord[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]') as InvoiceRecord[]; }
  catch { return []; }
}

function saveLocal(records: InvoiceRecord[]) {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

async function resilient<T>(remote: () => Promise<T>, _local: () => T | Promise<T>): Promise<T> {
  if (!isConfigured) throw new Error(CRM_CONFIGURATION_ERROR);
  return remote();
}

function rowToRecord(row: Record<string, unknown>): InvoiceRecord {
  const payload = (row.payload || {}) as InvoiceFormData;
  return {
    ...payload,
    id: String(row.id),
    invoice_number: String(row.invoice_number || payload.invoice_number),
    agreement_id: String(row.agreement_id || payload.agreement_id || ''),
    agreement_number: String(row.agreement_number || payload.agreement_number || ''),
    document_type: (row.document_type || payload.document_type) as InvoiceFormData['document_type'],
    status: (row.status || payload.status) as InvoiceFormData['status'],
    issue_date: String(row.issue_date || payload.issue_date || ''),
    due_date: String(row.due_date || payload.due_date || ''),
    client_name: String(row.client_name || payload.client_name),
    mobile: String(row.mobile || payload.mobile || ''),
    total_amount: Number(row.total_amount ?? payload.total_amount ?? 0),
    amount_paid: Number(row.amount_paid ?? payload.amount_paid ?? 0),
    balance_due: Number(row.balance_due ?? payload.balance_due ?? 0),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    verification_code: String(row.verification_code || ''),
  };
}

function recordToRow(payload: InvoiceFormData) {
  return {
    invoice_number: payload.invoice_number,
    agreement_id: payload.agreement_id || null,
    agreement_number: payload.agreement_number || null,
    document_type: payload.document_type,
    status: payload.status,
    issue_date: payload.issue_date,
    due_date: payload.due_date || null,
    client_name: payload.client_name,
    mobile: payload.mobile || null,
    total_amount: payload.total_amount,
    amount_paid: payload.amount_paid,
    balance_due: payload.balance_due,
    payload,
    updated_at: new Date().toISOString(),
  };
}

export async function getNextInvoiceNumber() {
  const fy = financialYear();
  return resilient(
    async () => {
      const { data, error } = await crmSupabase.rpc('crm_next_invoice_number');
      if (error) throw error;
      return String(data);
    },
    () => {
      const prefix = `PMB/${fy}/`;
      const values = localInvoices().filter(item => item.invoice_number.startsWith(prefix)).map(item => Number(item.invoice_number.split('/').pop()) || 0);
      return `${prefix}${String(Math.max(0, ...values) + 1).padStart(4, '0')}`;
    },
  );
}

export async function getInvoices(filters: Partial<InvoiceFilters> = {}) {
  return resilient(
    async () => {
      let query = crmSupabase.from('crm_invoices').select('*').order('updated_at', { ascending: false });
      if (filters.search) {
        const safe = filters.search.replace(/[(),]/g, ' ');
        query = query.or(`invoice_number.ilike.%${safe}%,agreement_number.ilike.%${safe}%,client_name.ilike.%${safe}%`);
      }
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.document_type) query = query.eq('document_type', filters.document_type);
      if (filters.issue_date_from) query = query.gte('issue_date', filters.issue_date_from);
      if (filters.issue_date_to) query = query.lte('issue_date', filters.issue_date_to);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(row => rowToRecord(row));
    },
    () => {
      let records = localInvoices();
      if (filters.search) {
        const term = filters.search.toLowerCase();
        records = records.filter(item => item.invoice_number.toLowerCase().includes(term) || item.agreement_number.toLowerCase().includes(term) || item.client_name.toLowerCase().includes(term));
      }
      if (filters.status) records = records.filter(item => item.status === filters.status);
      if (filters.document_type) records = records.filter(item => item.document_type === filters.document_type);
      if (filters.issue_date_from) records = records.filter(item => item.issue_date >= filters.issue_date_from!);
      if (filters.issue_date_to) records = records.filter(item => item.issue_date <= filters.issue_date_to!);
      return records.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
    },
  );
}

export async function getInvoiceById(id: string) {
  return resilient(
    async () => {
      const { data, error } = await crmSupabase.from('crm_invoices').select('*').eq('id', id).single();
      if (error) throw error;
      return rowToRecord(data);
    },
    () => localInvoices().find(item => item.id === id) || null,
  );
}

export async function createInvoice(payload: InvoiceFormData) {
  const now = new Date().toISOString();
  return resilient(
    async () => {
      const { data, error } = await crmSupabase.from('crm_invoices').insert(recordToRow(payload)).select().single();
      if (error) throw error;
      return rowToRecord(data);
    },
    () => {
      const record: InvoiceRecord = { ...payload, id: `invoice-${Date.now()}`, created_at: now, updated_at: now, verification_code: crypto.randomUUID().replace(/-/g, '').slice(0, 16) };
      saveLocal([record, ...localInvoices()]);
      return record;
    },
  );
}

export async function updateInvoice(id: string, payload: InvoiceFormData) {
  const now = new Date().toISOString();
  return resilient(
    async () => {
      const { data, error } = await crmSupabase.from('crm_invoices').update(recordToRow(payload)).eq('id', id).select().single();
      if (error) throw error;
      return rowToRecord(data);
    },
    () => {
      const records = localInvoices();
      const index = records.findIndex(item => item.id === id);
      if (index < 0) throw new Error('Invoice not found');
      const record: InvoiceRecord = { ...records[index], ...payload, updated_at: now };
      records[index] = record;
      saveLocal(records);
      return record;
    },
  );
}

export async function addInvoicePayment(id: string, input: Omit<InvoicePayment, 'id' | 'receipt_number' | 'created_at'>) {
  const invoice = await getInvoiceById(id);
  if (!invoice) throw new Error('Invoice not found');
  const records = await getInvoices();
  const fy = financialYear(new Date(`${input.payment_date}T00:00:00`));
  const prefix = `PMB/R/${fy}/`;
  const receipts = records.flatMap(item => item.payments || []).filter(item => item.receipt_number.startsWith(prefix)).map(item => Number(item.receipt_number.split('/').pop()) || 0);
  const payment: InvoicePayment = { ...input, id: `payment-${Date.now()}`, receipt_number: `${prefix}${String(Math.max(0, ...receipts) + 1).padStart(4, '0')}`, created_at: new Date().toISOString() };
  const amountPaid = Math.round((invoice.amount_paid + input.amount) * 100) / 100;
  const balanceDue = Math.max(0, Math.round((invoice.total_amount - amountPaid) * 100) / 100);
  const status: InvoiceFormData['status'] = balanceDue === 0 ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : invoice.status;
  return updateInvoice(id, { ...invoice, payments: [...(invoice.payments || []), payment], amount_paid: amountPaid, balance_due: balanceDue, status });
}

export async function updateInvoicePayment(id: string, paymentId: string, input: Omit<InvoicePayment, 'id' | 'receipt_number' | 'created_at'>) {
  const invoice = await getInvoiceById(id);
  if (!invoice) throw new Error('Invoice not found');
  const existing = (invoice.payments || []).find(item => item.id === paymentId);
  if (!existing) throw new Error('Payment not found');
  const payments = invoice.payments.map(item => item.id === paymentId ? { ...item, ...input } : item);
  const amountPaid = Math.max(0, Math.round((invoice.amount_paid - existing.amount + input.amount) * 100) / 100);
  const balanceDue = Math.max(0, Math.round((invoice.total_amount - amountPaid) * 100) / 100);
  const status: InvoiceFormData['status'] = balanceDue === 0 ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : 'Issued';
  return updateInvoice(id, { ...invoice, payments, amount_paid: amountPaid, balance_due: balanceDue, status });
}

export async function deleteInvoice(id: string) {
  return resilient(
    async () => {
      const { error } = await crmSupabase.from('crm_invoices').delete().eq('id', id);
      if (error) throw error;
    },
    () => saveLocal(localInvoices().filter(item => item.id !== id)),
  );
}
