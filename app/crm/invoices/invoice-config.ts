import type { AgreementRecord, BusinessProfile, InvoiceFormData, InvoiceLineItem, InvoiceStatus } from '../lib/types';
import { agreementReceivedAmounts } from '../agreements/agreement-config';

export const INVOICE_DOCUMENT_TYPES = ['Proforma Invoice', 'Advance Receipt Voucher', 'Tax Invoice'] as const;
export const INVOICE_STATUSES: InvoiceStatus[] = ['Draft', 'Issued', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'];
export const PAYMENT_MODES = ['UPI', 'Bank Transfer', 'Credit / Debit Card', 'Cheque', 'Cash', 'Mixed'] as const;
export const BUSINESS_PROFILE_KEY = 'crm_business_profile';

export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  legal_name: 'PlanMyBaraat',
  trade_name: 'PlanMyBaraat',
  address: '',
  city: 'Vadodara',
  state: 'Gujarat',
  state_code: '24',
  pincode: '',
  gstin: '',
  pan: '',
  email: '',
  mobile: '',
  bank_name: '',
  account_name: 'PlanMyBaraat',
  account_number: '',
  ifsc: '',
  upi_id: '',
  default_sac_code: '998596',
  authorized_signatory: 'Authorized Signatory',
};

export function getBusinessProfile(): BusinessProfile {
  if (typeof window === 'undefined') return DEFAULT_BUSINESS_PROFILE;
  const stored = window.localStorage.getItem(BUSINESS_PROFILE_KEY);
  if (!stored) return DEFAULT_BUSINESS_PROFILE;
  try {
    return { ...DEFAULT_BUSINESS_PROFILE, ...JSON.parse(stored) } as BusinessProfile;
  } catch {
    return DEFAULT_BUSINESS_PROFILE;
  }
}

export function saveBusinessProfile(profile: BusinessProfile) {
  if (typeof window !== 'undefined') window.localStorage.setItem(BUSINESS_PROFILE_KEY, JSON.stringify(profile));
}

export function currency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value || 0));
}

export function formatInvoiceDate(value: string) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

export function financialYear(date = new Date()) {
  const year = date.getFullYear();
  const start = date.getMonth() >= 3 ? year : year - 1;
  return `${String(start).slice(-2)}-${String(start + 1).slice(-2)}`;
}

export function effectiveInvoiceStatus(invoice: Pick<InvoiceFormData, 'status' | 'due_date' | 'balance_due'>): InvoiceStatus {
  if (invoice.status === 'Cancelled' || invoice.status === 'Draft' || invoice.status === 'Paid') return invoice.status;
  if (invoice.balance_due > 0 && invoice.due_date && invoice.due_date < new Date().toISOString().slice(0, 10)) return 'Overdue';
  return invoice.status;
}

export function invoiceAmounts(
  lineItems: InvoiceLineItem[],
  discount: number,
  gstPercent: number,
  placeOfSupplyStateCode: string,
  supplierStateCode: string,
  amountPaid: number,
) {
  const subtotal = Math.round(lineItems.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0), 0) * 100) / 100;
  const taxableValue = Math.max(0, Math.round((subtotal - Number(discount || 0)) * 100) / 100);
  const tax = Math.round(taxableValue * Number(gstPercent || 0)) / 100;
  const isInterstate = Boolean(placeOfSupplyStateCode && supplierStateCode && placeOfSupplyStateCode !== supplierStateCode);
  const cgstAmount = isInterstate ? 0 : Math.round((tax / 2) * 100) / 100;
  const sgstAmount = isInterstate ? 0 : Math.round((tax / 2) * 100) / 100;
  const igstAmount = isInterstate ? Math.round(tax * 100) / 100 : 0;
  const totalAmount = Math.round((taxableValue + cgstAmount + sgstAmount + igstAmount) * 100) / 100;
  const balanceDue = Math.max(0, Math.round((totalAmount - Number(amountPaid || 0)) * 100) / 100);
  return { subtotal, taxableValue, cgstAmount, sgstAmount, igstAmount, totalAmount, balanceDue };
}

export function invoiceDraftFromAgreement(agreement: AgreementRecord, invoiceNumber: string, profile: BusinessProfile): InvoiceFormData {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 7);
  // Only amounts actually marked as received count toward what an invoice
  // can bill against — a freshly scheduled (but not yet received) booking
  // amount should not generate an "Advance Receipt Voucher" for money that
  // hasn't come in yet.
  const received = agreementReceivedAmounts(agreement);
  const isAdvanceVoucher = received.booking > 0;
  const advanceGross = received.booking;
  const taxablePackageValue = isAdvanceVoucher
    ? Math.round((advanceGross / (1 + Number(agreement.gst_percent || 0) / 100)) * 100) / 100
    : Math.max(0, Number(agreement.package_price || 0));
  const lineItems: InvoiceLineItem[] = [{
    id: `item-${Date.now()}`,
    description: isAdvanceVoucher ? `Booking advance - ${agreement.package_name} Baraat Service Package` : `${agreement.package_name} Baraat Service Package`,
    sac_code: profile.default_sac_code,
    quantity: 1,
    rate: taxablePackageValue,
    taxable_amount: taxablePackageValue,
  }];
  const amountPaid = isAdvanceVoucher ? advanceGross : received.booking + received.second + received.final;
  const discount = isAdvanceVoucher ? 0 : agreement.discount;
  const amounts = invoiceAmounts(lineItems, discount, agreement.gst_percent, profile.state_code, profile.state_code, amountPaid);
  return {
    invoice_number: invoiceNumber,
    supplier_profile: { ...profile },
    agreement_id: agreement.id,
    agreement_number: agreement.agreement_number,
    document_type: received.booking > 0 ? 'Advance Receipt Voucher' : 'Proforma Invoice',
    status: 'Draft',
    issue_date: today.toISOString().slice(0, 10),
    due_date: due.toISOString().slice(0, 10),
    client_name: agreement.client_name,
    mobile: agreement.mobile,
    email: agreement.email,
    billing_address: agreement.address,
    client_gstin: '',
    place_of_supply: profile.state,
    state_code: profile.state_code,
    event_date: agreement.event_date,
    venue: agreement.venue,
    package_name: agreement.package_name,
    line_items: lineItems,
    subtotal: amounts.subtotal,
    discount,
    taxable_value: amounts.taxableValue,
    gst_percent: agreement.gst_percent,
    cgst_amount: amounts.cgstAmount,
    sgst_amount: amounts.sgstAmount,
    igst_amount: amounts.igstAmount,
    total_amount: amounts.totalAmount,
    amount_paid: amountPaid,
    balance_due: amounts.balanceDue,
    payments: [],
    client_note: '',
    payment_terms: 'Payment is due according to the schedule confirmed in the Baraat Management Contract.',
    created_by_name: agreement.sales_executive || 'CRM Administrator',
  };
}