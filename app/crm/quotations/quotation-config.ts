import type { AgreementFormData, QuotationFormData, QuotationService } from '../lib/types';
import { AGREEMENT_PACKAGES, LEGACY_SERVICE_NAME_MAP, PACKAGE_DEFAULTS, SERVICE_COLOR_OPTIONS, SERVICE_DECORATION_OPTIONS, SERVICE_NAMES, SERVICE_OPTIONS, SERVICE_PURPOSE_OPTIONS, createBlankAgreement } from '../agreements/agreement-config';

export const QUOTATION_PACKAGES = AGREEMENT_PACKAGES;
export const QUOTATION_STATUSES: QuotationFormData['status'][] = ['Draft', 'Sent', 'Negotiation', 'Accepted', 'Rejected', 'Expired', 'Converted'];
export const QUOTATION_PAYMENT_TERMS = 'A booking advance is required to reserve the event date. The remaining payment schedule will be finalized in the Baraat Management Contract.';
export const QUOTATION_EXCLUSIONS = 'Venue permissions, government fees, municipal approvals, music licences and services not expressly listed are excluded unless stated otherwise.';

export function createQuotationService(name: string, enabled = false, isCustom = false): QuotationService {
  return {
    id: `${isCustom ? 'custom' : 'quote-service'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    enabled,
    quantity: 1,
    option: SERVICE_OPTIONS[name]?.[0] ?? '',
    color: SERVICE_COLOR_OPTIONS[name]?.[0] ?? '',
    decoration: SERVICE_DECORATION_OPTIONS[name]?.[0] ?? '',
    purpose: SERVICE_PURPOSE_OPTIONS[name]?.[0] ?? '',
    multi_options: [],
    customization: '',
    client_remark: '',
    internal_note: '',
    special_instructions: '',
    is_custom: isCustom,
    unit_price: 0,
    amount: 0,
    is_addon: isCustom,
  };
}

// Mirrors agreement-config's reconcileService(s) for quotations — renames
// services saved under an old catalogue name (e.g. "Elephant" -> "Royal
// Elephant"), backfills add-on fields that didn't exist yet when the service
// was first saved, and merges any same-name duplicates that resulted from a
// rename colliding with an already-added copy under the new name.
export function reconcileQuotationServices(services: QuotationService[]): QuotationService[] {
  const merged = new Map<string, QuotationService>();
  for (const raw of services) {
    const name = LEGACY_SERVICE_NAME_MAP[raw.name] ?? raw.name;
    const service: QuotationService = {
      ...raw,
      name,
      color: raw.color || SERVICE_COLOR_OPTIONS[name]?.[0] || '',
      decoration: raw.decoration || SERVICE_DECORATION_OPTIONS[name]?.[0] || '',
      purpose: raw.purpose || SERVICE_PURPOSE_OPTIONS[name]?.[0] || '',
      multi_options: raw.multi_options ?? [],
    };
    if (service.is_custom) {
      merged.set(service.id, service);
      continue;
    }
    const existing = merged.get(service.name);
    if (!existing) {
      merged.set(service.name, service);
      continue;
    }
    merged.set(service.name, {
      ...existing,
      enabled: existing.enabled || service.enabled,
      quantity: Math.max(existing.quantity, service.quantity),
      option: existing.option || service.option,
      color: existing.color || service.color,
      decoration: existing.decoration || service.decoration,
      purpose: existing.purpose || service.purpose,
      multi_options: existing.multi_options.length ? existing.multi_options : service.multi_options,
      customization: existing.customization || service.customization,
      client_remark: existing.client_remark || service.client_remark,
      internal_note: existing.internal_note || service.internal_note,
      special_instructions: existing.special_instructions || service.special_instructions,
      unit_price: existing.unit_price || service.unit_price,
      amount: existing.amount || service.amount,
      is_addon: existing.is_addon || service.is_addon,
    });
  }
  return Array.from(merged.values());
}

export function calculateQuotationAmounts(data: Pick<QuotationFormData, 'pricing_mode' | 'package_price' | 'services' | 'discount' | 'gst_percent'>) {
  const enabled = data.services.filter(service => service.enabled);
  const pricedServices = enabled.map(service => ({ ...service, amount: Math.round(service.quantity * service.unit_price * 100) / 100 }));
  const serviceValue = pricedServices.reduce((sum, service) => sum + service.amount, 0);
  const addOnValue = pricedServices.filter(service => service.is_addon).reduce((sum, service) => sum + service.amount, 0);
  const subtotal = Math.round((data.pricing_mode === 'Detailed Pricing' ? serviceValue : Number(data.package_price || 0) + addOnValue) * 100) / 100;
  const discount = Math.min(Math.max(0, Number(data.discount || 0)), subtotal);
  const taxableValue = Math.max(0, Math.round((subtotal - discount) * 100) / 100);
  const gstAmount = Math.round(taxableValue * Number(data.gst_percent || 0)) / 100;
  const totalAmount = Math.round((taxableValue + gstAmount) * 100) / 100;
  return { services: pricedServices, subtotal, discount, taxableValue, gstAmount, totalAmount };
}

export function createBlankQuotation(quotationNumber = 'Generating...'): QuotationFormData {
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 14);
  const packageName: QuotationFormData['package_name'] = 'Raj Tilak';
  const services = SERVICE_NAMES.map(name => createQuotationService(name, PACKAGE_DEFAULTS[packageName].services.includes(name)));
  const base: QuotationFormData = {
    quotation_number: quotationNumber,
    version: 1,
    status: 'Draft',
    created_date: today.toISOString().slice(0, 10),
    valid_until: validUntil.toISOString().slice(0, 10),
    client_name: '', groom_name: '', bride_name: '', mobile: '', alternate_mobile: '', email: '', address: '',
    event_date: '', venue: '', start_time: '', end_time: '', sales_executive: '',
    package_name: packageName,
    pricing_mode: 'Package Pricing',
    package_price: PACKAGE_DEFAULTS[packageName].price,
    services,
    subtotal: 0, discount: 0, taxable_value: 0, gst_percent: 18, gst_amount: 0, total_amount: 0,
    suggested_booking_amount: 0,
    client_note: '', special_requirements: '', exclusions: QUOTATION_EXCLUSIONS,
    payment_terms: QUOTATION_PAYMENT_TERMS,
    created_by_name: 'Tejabhai Patel',
    converted_agreement_id: '', revisions: [], activity: [],
  };
  const amounts = calculateQuotationAmounts(base);
  return { ...base, services: base.services.map(service => amounts.services.find(item => item.id === service.id) ?? service), subtotal: amounts.subtotal, taxable_value: amounts.taxableValue, gst_amount: amounts.gstAmount, total_amount: amounts.totalAmount, suggested_booking_amount: Math.round(amounts.totalAmount * 0.25 * 100) / 100 };
}

export function quotationToAgreement(quotation: QuotationFormData, agreementNumber: string): AgreementFormData {
  const agreement = createBlankAgreement(agreementNumber);
  return {
    ...agreement,
    client_name: quotation.client_name,
    groom_name: quotation.groom_name,
    bride_name: quotation.bride_name,
    mobile: quotation.mobile,
    alternate_mobile: quotation.alternate_mobile,
    email: quotation.email,
    address: quotation.address,
    event_date: quotation.event_date,
    venue: quotation.venue,
    start_time: quotation.start_time,
    end_time: quotation.end_time,
    sales_executive: quotation.sales_executive || quotation.created_by_name,
    package_name: quotation.package_name,
    package_price: quotation.subtotal,
    discount: quotation.discount,
    gst_percent: quotation.gst_percent,
    final_amount: quotation.total_amount,
    booking_amount: quotation.suggested_booking_amount,
    remaining_amount: Math.max(0, quotation.total_amount - quotation.suggested_booking_amount),
    outstanding: Math.max(0, quotation.total_amount - quotation.suggested_booking_amount),
    services: quotation.services.map(service => ({
      id: service.id, name: service.name, enabled: service.enabled, quantity: service.quantity,
      option: service.option, color: service.color, decoration: service.decoration, purpose: service.purpose, multi_options: service.multi_options, customization: service.customization, client_remark: service.client_remark,
      internal_note: service.internal_note, special_instructions: service.special_instructions,
      is_custom: service.is_custom,
    })),
    client_notes: quotation.client_note,
    special_requirements: quotation.special_requirements,
  };
}

export function quotationCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
}

export function formatQuotationDate(value: string) {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
