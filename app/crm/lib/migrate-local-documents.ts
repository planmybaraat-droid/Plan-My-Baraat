import type { AgreementRecord, InvoiceRecord } from './types';
import { crmSupabase } from './supabase-crm';

const MIGRATION_KEY = 'crm_supabase_documents_migrated_v1';

function readRecords<T>(key: string): T[] {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T[] : [];
  } catch {
    return [];
  }
}

/**
 * Imports documents created while the CRM was running in offline demo mode.
 * Existing Supabase document numbers always win, making the migration safe to retry.
 */
export async function migrateLocalDocumentsToSupabase(): Promise<void> {
  if (typeof window === 'undefined' || window.localStorage.getItem(MIGRATION_KEY) === 'true') return;

  const agreements = readRecords<AgreementRecord>('crm_agreements');
  const agreementIds = new Map<string, string>();

  for (const agreement of agreements) {
    const { data: existing, error: findError } = await crmSupabase
      .from('crm_agreements')
      .select('id, agreement_number')
      .eq('agreement_number', agreement.agreement_number)
      .maybeSingle();
    if (findError) throw findError;

    if (existing) {
      agreementIds.set(agreement.agreement_number, String(existing.id));
      continue;
    }

    const { data, error } = await crmSupabase.from('crm_agreements').insert({
      agreement_number: agreement.agreement_number,
      client_name: agreement.client_name,
      mobile: agreement.mobile,
      email: agreement.email || null,
      event_date: agreement.event_date || null,
      package_name: agreement.package_name,
      status: agreement.status,
      version: agreement.version,
      final_amount: agreement.final_amount,
      payload: agreement,
      created_at: agreement.created_at,
      updated_at: agreement.updated_at,
    }).select('id').single();
    if (error) throw error;
    agreementIds.set(agreement.agreement_number, String(data.id));
  }

  const invoices = readRecords<InvoiceRecord>('crm_invoices');
  for (const invoice of invoices) {
    const { data: existing, error: findError } = await crmSupabase
      .from('crm_invoices')
      .select('id')
      .eq('invoice_number', invoice.invoice_number)
      .maybeSingle();
    if (findError) throw findError;
    if (existing) continue;

    const { error } = await crmSupabase.from('crm_invoices').insert({
      invoice_number: invoice.invoice_number,
      agreement_id: agreementIds.get(invoice.agreement_number) || null,
      agreement_number: invoice.agreement_number || null,
      document_type: invoice.document_type,
      status: invoice.status,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date || null,
      client_name: invoice.client_name,
      mobile: invoice.mobile || null,
      total_amount: invoice.total_amount,
      amount_paid: invoice.amount_paid,
      balance_due: invoice.balance_due,
      payload: invoice,
      created_at: invoice.created_at,
      updated_at: invoice.updated_at,
    });
    if (error) throw error;
  }

  window.localStorage.setItem(MIGRATION_KEY, 'true');
}
