import { crmSupabase } from '../lib/supabase-crm';
import type { AgreementRecord, InvoiceRecord, StaffRecord } from '../lib/types';
import { getCompanyHolidaysForYears, type CompanyHoliday } from '../lib/company-holidays';

export type HolidayEvent = CompanyHoliday;
export { getCompanyHolidaysForYears };

export interface BirthdayEvent {
  staff_id: string;
  full_name: string;
  /** The birthday projected onto whichever year is being displayed (YYYY-MM-DD). */
  date: string;
}

// Staff birthdays repeat every year — only the month/day from date_of_birth
// matters. Projects each active staff member's birthday onto the given
// year(s) so it can be plotted on a specific month/week view.
export function deriveBirthdaysForYears(staff: StaffRecord[], years: number[]): BirthdayEvent[] {
  const events: BirthdayEvent[] = [];
  staff.forEach((s) => {
    if (!s.date_of_birth || s.status === 'Inactive') return;
    const [, mm, dd] = s.date_of_birth.split('-');
    if (!mm || !dd) return;
    years.forEach((year) => {
      events.push({ staff_id: s.id, full_name: s.full_name, date: `${year}-${mm}-${dd}` });
    });
  });
  return events;
}

export async function getStaffBirthdaysForYears(years: number[]): Promise<BirthdayEvent[]> {
  const {data,error}=await crmSupabase.rpc('crm_get_shared_calendar_birthdays',{p_years:years});
  if(error)throw new Error(error.message);
  return (data||[]).map((row:{staff_id:string;full_name:string;date:string})=>({...row,date:String(row.date)}));
}

export interface CalendarEvent {
  agreement_id: string;
  agreement_number: string;
  client_name: string;
  groom_name: string;
  bride_name: string;
  mobile: string;
  event_date: string;
  venue: string;
  package_name: string;
  agreement_status: string;
  invoice_number: string;
  invoice_status: string;
}

// An "event" only qualifies once the client's agreement is Signed/Completed
// AND at least one invoice has been raised against it — i.e. a confirmed,
// paying booking, not just a draft in progress. Pure/sync so pages that
// already fetched agreements + invoices for their own stats (e.g. the
// dashboard) can reuse it without a second round-trip.
export function deriveConfirmedEvents(agreements: AgreementRecord[], invoices: InvoiceRecord[]): CalendarEvent[] {
  const invoiceByAgreement = new Map<string, { invoice_number: string; status: string }>();
  invoices.forEach((inv) => {
    if (!inv.agreement_id) return;
    // Prefer keeping the most relevant (latest / non-cancelled) invoice per agreement.
    const existing = invoiceByAgreement.get(inv.agreement_id);
    if (!existing || (existing.status === 'Cancelled' && inv.status !== 'Cancelled')) {
      invoiceByAgreement.set(inv.agreement_id, { invoice_number: inv.invoice_number, status: inv.status });
    }
  });

  return agreements
    .filter((a) => ['Signed', 'Completed'].includes(a.status) && a.event_date && invoiceByAgreement.has(a.id))
    .map((a) => {
      const invoice = invoiceByAgreement.get(a.id)!;
      return {
        agreement_id: a.id,
        agreement_number: a.agreement_number,
        client_name: a.client_name,
        groom_name: a.groom_name,
        bride_name: a.bride_name,
        mobile: a.mobile,
        event_date: a.event_date,
        venue: a.venue,
        package_name: a.package_name,
        agreement_status: a.status,
        invoice_number: invoice.invoice_number,
        invoice_status: invoice.status,
      };
    })
    .sort((a, b) => a.event_date.localeCompare(b.event_date));
}

export async function getConfirmedEvents(): Promise<CalendarEvent[]> {
  const {data,error}=await crmSupabase.rpc('crm_get_shared_calendar_events');
  if(error)throw new Error(error.message);
  return (data||[]) as CalendarEvent[];
}
