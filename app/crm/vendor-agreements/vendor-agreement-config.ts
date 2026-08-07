import type {
  VendorAgreementFormData, VendorAgreementService, VendorAgreementStatus,
  VendorBlacklistStatus, VendorCommissionType, VendorPaymentSchedule, VendorVerificationStatus,
} from '../lib/types';
// Vendor Agreements deliberately reuse the exact same service catalogue as
// Baraat Management Contracts (per product requirement — including "Ganga
// Aarti", which already lives in SERVICE_NAMES) and the same currency/date
// formatting, instead of duplicating them here.
import { SERVICE_NAMES, SERVICE_OPTIONS, currency, formatAgreementDate } from '../agreements/agreement-config';

export { currency, formatAgreementDate };
export const VENDOR_SERVICE_NAMES = SERVICE_NAMES;
export const VENDOR_SERVICE_OPTIONS = SERVICE_OPTIONS;

export const VENDOR_AGREEMENT_STATUSES: VendorAgreementStatus[] = ['Draft', 'Sent', 'Signed', 'Active', 'Expired', 'Terminated', 'Cancelled'];
export const VENDOR_VERIFICATION_STATUSES: VendorVerificationStatus[] = ['Pending', 'Verified', 'Rejected'];
export const VENDOR_BLACKLIST_STATUSES: VendorBlacklistStatus[] = ['Active', 'Suspended', 'Blacklisted'];
export const VENDOR_COMMISSION_TYPES: VendorCommissionType[] = ['Percentage', 'Flat'];
export const VENDOR_PAYMENT_SCHEDULES: VendorPaymentSchedule[] = ['Per Event', 'Weekly', 'Monthly', 'Advance + Balance on Completion'];

export const VENDOR_DOCUMENT_CATEGORIES = [
  'Aadhaar Card', 'PAN Card', 'GST Certificate', 'Cancelled Cheque',
  'Registration Certificate', 'Portfolio', 'Insurance', 'Rate Card', 'Other Supporting Document',
] as const;

export function createVendorAgreementService(name: string, enabled = false, isCustom = false): VendorAgreementService {
  return {
    id: `${isCustom ? 'custom' : 'service'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    enabled,
    option: SERVICE_OPTIONS[name]?.[0] ?? '',
    base_price: 0,
    extra_hour_charge: 0,
    travel_charge: 0,
    capacity: '',
    tax_percent: 18,
    advance_required: 0,
    service_area: '',
    is_custom: isCustom,
  };
}

export function createBlankVendorAgreement(vendorAgreementNumber = 'Generating...'): VendorAgreementFormData {
  const today = new Date().toISOString().slice(0, 10);
  const oneYearOut = new Date();
  oneYearOut.setFullYear(oneYearOut.getFullYear() + 1);
  return {
    vendor_agreement_number: vendorAgreementNumber,
    version: 1,
    status: 'Draft',
    created_date: today,
    agreement_date: today,

    vendor_id: '',
    vendor_name: '',
    business_name: '',
    contact_person: '',
    mobile: '',
    alternate_mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    service_category: '',
    gstin: '',
    pan_number: '',
    aadhaar_number: '',
    bank_account_name: '',
    bank_account_number: '',
    ifsc_code: '',
    bank_name: '',
    upi_id: '',
    emergency_contact_name: '',
    emergency_contact_mobile: '',
    verification_status: 'Pending',

    services: SERVICE_NAMES.map(name => createVendorAgreementService(name, false)),

    commission_type: 'Percentage',
    commission_percent: 15,
    flat_commission_amount: 0,
    payment_schedule: 'Advance + Balance on Completion',
    payment_release_condition: 'Payment is released within 3 business days of satisfactory service completion and submission of the signed service confirmation.',
    gst_applicable: true,
    gst_percent: 18,
    agreement_start_date: today,
    agreement_end_date: oneYearOut.toISOString().slice(0, 10),
    agreement_validity_months: 12,
    auto_renewal: false,
    renewal_notice_days: 30,

    documents: [],

    special_conditions: '',
    internal_staff_notes: '',

    performance_score: 0,
    reliability_rating: 0,
    completed_events: 0,
    cancellation_count: 0,
    complaint_count: 0,
    on_time_percent: 0,
    preferred_vendor: false,
    blacklist_status: 'Active',

    activity: [],
    revisions: [],
  };
}

export function calculateVendorAgreementAmounts(data: VendorAgreementFormData) {
  const enabledServices = data.services.filter(service => service.enabled);
  const baseTotal = enabledServices.reduce((sum, service) => sum + Number(service.base_price || 0), 0);
  const travelTotal = enabledServices.reduce((sum, service) => sum + Number(service.travel_charge || 0), 0);
  const subtotal = baseTotal + travelTotal;
  const gst = data.gst_applicable ? subtotal * (Number(data.gst_percent || 0) / 100) : 0;
  const estimatedValue = Math.round((subtotal + gst) * 100) / 100;
  const commissionAmount = data.commission_type === 'Flat'
    ? Number(data.flat_commission_amount || 0)
    : Math.round(estimatedValue * (Number(data.commission_percent || 0) / 100) * 100) / 100;
  const advanceTotal = enabledServices.reduce((sum, service) => sum + Number(service.advance_required || 0), 0);
  return { baseTotal, travelTotal, subtotal, gst, estimatedValue, commissionAmount, advanceTotal };
}

export function formatShortDate(value: string) {
  if (!value) return '';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function isVendorAgreementExpiringSoon(endDate: string, withinDays = 30) {
  if (!endDate) return false;
  const end = new Date(`${endDate}T00:00:00`).getTime();
  const now = Date.now();
  const diffDays = (end - now) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= withinDays;
}

export function isVendorAgreementExpired(endDate: string) {
  if (!endDate) return false;
  return new Date(`${endDate}T00:00:00`).getTime() < Date.now();
}

export function isVendorDocumentExpiringSoon(expiryDate?: string, withinDays = 30) {
  if (!expiryDate) return false;
  const end = new Date(`${expiryDate}T00:00:00`).getTime();
  const diffDays = (end - Date.now()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= withinDays;
}

export function isVendorDocumentExpired(expiryDate?: string) {
  if (!expiryDate) return false;
  return new Date(`${expiryDate}T00:00:00`).getTime() < Date.now();
}
