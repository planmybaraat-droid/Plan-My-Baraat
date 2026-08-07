import type { AgreementFormData, AgreementService, AgreementStatus } from '../lib/types';

export const AGREEMENT_STATUSES: AgreementStatus[] = ['Draft', 'Sent', 'Signed', 'Completed', 'Cancelled'];
export const AGREEMENT_PACKAGES = ['Raj Tilak', 'Rajwada', 'Maharaja', 'Signature', 'Custom'] as const;

export const SERVICE_NAMES = [
  'DJ On Wheels', 'Vintage Car', 'Buggy', 'Horse', 'Royal Elephant', 'Helicopter', 'Premium ATV Bikes',
  'Premium Cars', 'Drink on Wheels', 'Exclusive Sound', 'DJ Artist', 'Anchor',
  'Dhol', 'Brass Band', 'Chhatri', 'Ganga Aarti', 'Moving LED', 'LED Letters', 'CO2 Gun',
  'Confetti Gun', 'Fake Money Gun', 'Hand Pyro', 'CO2 Jet', 'Low Fog',
  'Paper Blast', 'Smoke Bubble', 'Fireworks', 'Props', 'Carnival Artist',
  'Professional Bouncer', 'Safa', 'Safa Team', 'Dedicated Manager',
  'Live Streaming', 'QR Gallery',
] as const;

export const SERVICE_OPTIONS: Record<string, string[]> = {
  'DJ On Wheels': ['Premium DJ Truck', 'Mini DJ Truck', 'Flex DJ Truck', 'American DJ Truck', 'Concert DJ Truck (Trolla)'],
  'Vintage Car': ['Premium Rolls Royce', 'American Rolls Royce', 'Convertible Vintage Car'],
  Buggy: ['AC Buggy', '2 Horse Buggy', '4 Horse Buggy', 'Royal Buggy', 'LED Buggy', 'Floral Buggy'],
  Horse: ['Ghoda', 'Ghodi'],
  'Premium Cars': ['Convertible', 'Rolls Royce', 'Vanity Van', 'Luxury XUV'],
  'Exclusive Sound': ['Premium Line Array', 'Concert Sound'],
  'DJ Artist': ['Professional DJ Artist', 'Celebrity DJ', 'International DJ'],
  Anchor: ['Premium Anchor', 'Bollywood Anchor', 'Traditional Anchor'],
  Dhol: ['Punjabi Dhol with Artist', 'Nashik Dhol with Artist', 'Rajasthani Dhol with Artist'],
  'Brass Band': ['11 Piece', '21 Piece', '31 Piece'],
  Chhatri: ['Royal Classic', 'Royal LED', 'Royal Floral LED'],
  'Carnival Artist': [
    '1 Jungler, 1 Unicyclist, 1 Still Walker, 1 Twins Head',
    '1 Headless Man, 1 Dwarf Men, 1 Mirror Man, 1 Disco Man',
    '1 Chained Lion, 2 Carnival Girls',
  ],
};

// Optional colour add-on, shown alongside the service option dropdown only
// for services listed here.
export const SERVICE_COLOR_OPTIONS: Record<string, string[]> = {
  'Vintage Car': ['Red', 'White'],
};

// Optional decoration add-on, shown alongside the service option dropdown
// only for services listed here.
export const SERVICE_DECORATION_OPTIONS: Record<string, string[]> = {
  Horse: ['With Decoration', 'Without Decoration'],
  'Royal Elephant': ['With Decoration', 'Without Decoration'],
  'Premium ATV Bikes': ['With Decoration', 'Without Decoration'],
};

// Optional usage/purpose add-on, shown alongside the service option dropdown
// only for services listed here.
export const SERVICE_PURPOSE_OPTIONS: Record<string, string[]> = {
  'Premium ATV Bikes': ['For Haldi', 'For Baraat'],
};

// Optional multi-select add-on (rendered as checkboxes, more than one may be
// chosen at once), shown alongside the service option dropdown only for
// services listed here.
export const SERVICE_MULTI_OPTIONS: Record<string, string[]> = {
  'Drink on Wheels': ['With Mocktail', 'With Cocktail', 'With Caterers'],
};

// Fixed, non-editable notice shown under the service name for services
// listed here — currently used to flag that arrival vehicles carrying real
// animals/aircraft depend on availability at the time of confirmation.
export const SERVICE_AVAILABILITY_NOTE: Record<string, string> = {
  Helicopter: 'Subject to availability at the time of confirmation.',
  'Royal Elephant': 'Subject to availability at the time of confirmation.',
};

export const PACKAGE_DEFAULTS: Record<string, { price: number; services: string[] }> = {
  'Raj Tilak': { price: 125000, services: ['DJ On Wheels', 'Dhol', 'Chhatri', 'Dedicated Manager'] },
  Rajwada: { price: 225000, services: ['DJ On Wheels', 'Vintage Car', 'Dhol', 'Brass Band', 'Chhatri', 'Safa Team', 'Dedicated Manager'] },
  Maharaja: { price: 375000, services: ['DJ On Wheels', 'Vintage Car', 'Exclusive Sound', 'DJ Artist', 'Dhol', 'Chhatri', 'Moving LED', 'CO2 Gun', 'Confetti Gun', 'Dedicated Manager'] },
  Signature: { price: 550000, services: ['DJ On Wheels', 'Vintage Car', 'Exclusive Sound', 'DJ Artist', 'Anchor', 'Dhol', 'Brass Band', 'Chhatri', 'Moving LED', 'LED Letters', 'CO2 Gun', 'Confetti Gun', 'Hand Pyro', 'Low Fog', 'Fireworks', 'Professional Bouncer', 'Safa Team', 'Dedicated Manager', 'Live Streaming', 'QR Gallery'] },
  Custom: { price: 0, services: [] },
};

export function createService(name: string, enabled = false, isCustom = false): AgreementService {
  return {
    id: `${isCustom ? 'custom' : 'service'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
  };
}

// Services get renamed over time (e.g. "Elephant" -> "Royal Elephant"). Older
// drafts and previously-saved agreements still carry the old name, which no
// longer matches SERVICE_OPTIONS/SERVICE_DECORATION_OPTIONS/etc, so their
// add-on fields silently stop appearing. This map lets any stored service be
// migrated onto its current name the next time it's loaded into a form.
export const LEGACY_SERVICE_NAME_MAP: Record<string, string> = {
  Elephant: 'Royal Elephant',
  'ATV Bike': 'Premium ATV Bikes',
};

// Renames a service to its current name if it was saved under an old one,
// and backfills any add-on fields (color/decoration/purpose/multi_options)
// that didn't exist yet when the service was first saved — without touching
// anything the user already filled in.
export function reconcileService(service: AgreementService): AgreementService {
  const name = LEGACY_SERVICE_NAME_MAP[service.name] ?? service.name;
  return {
    ...service,
    name,
    color: service.color || SERVICE_COLOR_OPTIONS[name]?.[0] || '',
    decoration: service.decoration || SERVICE_DECORATION_OPTIONS[name]?.[0] || '',
    purpose: service.purpose || SERVICE_PURPOSE_OPTIONS[name]?.[0] || '',
    multi_options: service.multi_options ?? [],
  };
}

// Renaming a service (via reconcileService) can collide with a second copy
// of that same service that a previous, pre-fix load already appended under
// the new name — e.g. a draft ends up with both a renamed "Elephant" and a
// separately-added "Royal Elephant". This merges any same-name duplicates
// into one entry (non-custom services are unique by name; custom ones never
// collide since each has its own free-text name) instead of just renaming
// blindly, keeping whichever field values are actually filled in.
export function reconcileServices(services: AgreementService[]): AgreementService[] {
  const merged = new Map<string, AgreementService>();
  for (const raw of services) {
    const service = reconcileService(raw);
    if (service.is_custom) {
      // Custom services can legitimately share a name; key them by id so
      // they're never merged with one another.
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
    });
  }
  return Array.from(merged.values());
}

export function createBlankAgreement(agreementNumber = 'Generating...'): AgreementFormData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    agreement_number: agreementNumber,
    version: 1,
    status: 'Draft',
    created_date: today,
    client_name: '',
    groom_name: '',
    bride_name: '',
    mobile: '',
    alternate_mobile: '',
    email: '',
    address: '',
    agreement_date: today,
    event_date: '',
    venue: '',
    maps_link: '',
    start_time: '',
    end_time: '',
    hard_stop_time: '',
    event_coordinator: '',
    sales_executive: '',
    package_name: 'Raj Tilak',
    package_price: PACKAGE_DEFAULTS['Raj Tilak'].price,
    discount: 0,
    gst_percent: 18,
    final_amount: 0,
    booking_amount: 0,
    remaining_amount: 0,
    services: SERVICE_NAMES.map(name => createService(name, PACKAGE_DEFAULTS['Raj Tilak'].services.includes(name))),
    client_notes: '',
    special_requirements: '',
    vendor_instructions: '',
    internal_staff_notes: '',
    logistics_notes: '',
    second_installment: 0,
    final_payment: 0,
    outstanding: 0,
    booking_paid: false,
    second_installment_paid: false,
    final_payment_paid: false,
    payment_mode: '',
    transaction_reference: '',
    attachments: [],
    activity: [],
    revisions: [],
  };
}

// Undefined is treated as "paid" so agreements saved before the paid/unpaid
// toggle existed keep behaving exactly as they did (booking/second/final
// amounts were always assumed received). Only an explicit `false` — set by
// unmarking the toggle, or by default on every newly created agreement —
// means "not yet received".
export function isInstallmentPaid(flag?: boolean) {
  return flag !== false;
}

export function agreementReceivedAmounts(data: AgreementFormData) {
  return {
    booking: isInstallmentPaid(data.booking_paid) ? Number(data.booking_amount || 0) : 0,
    second: isInstallmentPaid(data.second_installment_paid) ? Number(data.second_installment || 0) : 0,
    final: isInstallmentPaid(data.final_payment_paid) ? Number(data.final_payment || 0) : 0,
  };
}

export function calculateAgreementAmounts(data: AgreementFormData) {
  const taxable = Math.max(0, Number(data.package_price || 0) - Number(data.discount || 0));
  const gst = taxable * (Number(data.gst_percent || 0) / 100);
  const finalAmount = Math.round((taxable + gst) * 100) / 100;
  const received = agreementReceivedAmounts(data);
  const scheduledTotal = Number(data.booking_amount || 0) + Number(data.second_installment || 0) + Number(data.final_payment || 0);
  const paid = received.booking + received.second + received.final;
  const outstanding = Math.max(0, Math.round((finalAmount - paid) * 100) / 100);
  return { finalAmount, outstanding, paid, scheduledTotal };
}

export function currency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);
}

export function formatAgreementDate(value: string) {
  if (!value) return '';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
