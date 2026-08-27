import type { IdCardFrontSnapshot, IdCardBackSnapshot, IdCardSettings, IdCardStatus, StaffRecord } from '../../lib/types';
// Same date formatting already used everywhere else in HR/Agreements/Quotations.
import { formatAgreementDate } from '../hr-config';

export { formatAgreementDate };

// CR80 — the standard ID-card size (used by every access-card printer unless
// told otherwise). Kept here as the *fallback default* only; the real,
// admin-editable values always come from crm_id_card_settings. The card is
// designed and printed in PORTRAIT orientation (worn vertically on a
// lanyard) — same physical CR80 card stock, just rotated — so the "width"
// here is CR80's short edge and "height" is its long edge.
export const CR80_WIDTH_MM = 53.98;
export const CR80_HEIGHT_MM = 85.6;

export const DEFAULT_ID_CARD_SETTINGS: IdCardSettings = {
  card_width_mm: CR80_WIDTH_MM,
  card_height_mm: CR80_HEIGHT_MM,
  bleed_mm: 2,
  // Generous enough to clear real cutter/die-cut tolerance on a small card —
  // 3mm looked fine on screen but let content (esp. the QR box, sitting
  // right in a corner) visually collide with the card's own rounded corner
  // curve once printed, since that curve's radius was bigger than the margin.
  safe_margin_mm: 4.5,
  sheet_width_mm: 210,
  sheet_height_mm: 297,
  sheet_margin_mm: 10,
  horizontal_gap_mm: 4,
  vertical_gap_mm: 4,
  duplex_mode: 'long_edge',
  validity_years: 2,
};

// CSS px-per-mm at 96dpi (the same base unit the Letters/Payslip A4 preview
// pages already render at before html2canvas scales them up for capture).
export const PX_PER_MM = 96 / 25.4;
export const mmToPx = (mm: number) => Math.round(mm * PX_PER_MM * 100) / 100;

export const ID_CARD_STATUSES: IdCardStatus[] = ['Draft', 'Generated', 'Active', 'Expired', 'Revoked'];

export const STATUS_STYLES: Record<IdCardStatus, string> = {
  Draft: 'bg-gray-100 text-gray-500',
  Generated: 'bg-blue-50 text-blue-700',
  Active: 'bg-emerald-50 text-emerald-700',
  Expired: 'bg-amber-50 text-amber-700',
  Revoked: 'bg-red-50 text-red-700',
};

export function buildFrontSnapshot(staff: StaffRecord): IdCardFrontSnapshot {
  return {
    full_name: staff.full_name,
    employee_code: staff.employee_code,
    designation: staff.designation || staff.job_title,
    department: staff.department,
    photo_url: staff.photo_url || null,
    joining_date: staff.joining_date,
  };
}

export function buildBackSnapshot(staff: StaffRecord): IdCardBackSnapshot {
  return {
    mobile: staff.mobile,
    email: staff.email,
    address: staff.address || '',
    emergency_contact_name: staff.emergency_contact_name || '',
    emergency_contact_mobile: staff.emergency_contact_mobile || '',
    blood_group: staff.blood_group || '',
  };
}

export function nextCardNumber(existingCount: number) {
  return `PMB-ID-${String(existingCount + 1).padStart(4, '0')}`;
}

export function addYears(dateIso: string, years: number) {
  const date = new Date(`${dateIso}T00:00:00`);
  date.setFullYear(date.getFullYear() + Math.floor(years));
  const remainderMonths = Math.round((years % 1) * 12);
  if (remainderMonths) date.setMonth(date.getMonth() + remainderMonths);
  return date.toISOString().slice(0, 10);
}
