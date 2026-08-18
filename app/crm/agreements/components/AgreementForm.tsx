'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BadgeIndianRupee, CalendarDays, Check, ChevronLeft, ChevronRight, CircleAlert,
  ClipboardList, FileCheck2, Info, Plus, RotateCcw, Save, Sparkles, Users,
} from 'lucide-react';
import type { AgreementFormData, AgreementService } from '../../lib/types';
import {
  AGREEMENT_PACKAGES, AGREEMENT_STATUSES, PACKAGE_DEFAULTS,
  calculateAgreementAmounts, createService, currency, isInstallmentPaid,
} from '../agreement-config';
import ServiceBlock from './ServiceBlock';

interface AgreementFormProps {
  initialData: AgreementFormData;
  onSubmit: (data: AgreementFormData) => Promise<void>;
  onSaveDraft?: (data: AgreementFormData) => Promise<void>;
  submitLabel?: string;
}

const STEPS = [
  { label: 'Client', icon: Users },
  { label: 'Package', icon: BadgeIndianRupee },
  { label: 'Services', icon: Sparkles },
  { label: 'Notes', icon: ClipboardList },
  { label: 'Payment', icon: CalendarDays },
  { label: 'Agreement', icon: FileCheck2 },
] as const;

type TextKey = Extract<{
  [K in keyof AgreementFormData]: AgreementFormData[K] extends string ? K : never
}[keyof AgreementFormData], string>;

function Field({ label, required, hint, children, className = '' }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <label className={`agreement-field ${className}`}>
      <span>{label}{required && <b aria-hidden="true">*</b>}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function InstallmentField({ label, hint, value, paid, onValueChange, onTogglePaid }: {
  label: string; hint: string; value: number; paid: boolean;
  onValueChange: (value: string) => void; onTogglePaid: () => void;
}) {
  return (
    <label className="agreement-field">
      <span className="flex items-center justify-between gap-2">
        <span>{label}</span>
        <button
          type="button"
          onClick={onTogglePaid}
          className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide transition-colors ${paid ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          {paid ? <><Check size={10} /> Received</> : 'Mark as received'}
        </button>
      </span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={e => onValueChange(e.target.value)}
        className={paid ? 'border-emerald-300 bg-emerald-50/50' : ''}
      />
      <small>{hint}</small>
    </label>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-600">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-extrabold tracking-tight text-gray-950 sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">{copy}</p>
    </div>
  );
}

export default function AgreementForm({ initialData, onSubmit, onSaveDraft, submitLabel = 'Save agreement' }: AgreementFormProps) {
  const [data, setData] = useState(initialData);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [error, setError] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);
  // PlanMyBaraat's standard payment policy is a 50% booking amount / 25%
  // second installment / 25% final payment split of the agreement value.
  // We auto-fill the payment schedule to that split whenever the agreement
  // value changes — but only while the staff member hasn't hand-edited any
  // of the three fields, and never for an agreement that already had real
  // payments recorded when the form opened (editing an existing agreement).
  const [paymentAutoSplit, setPaymentAutoSplit] = useState(
    () => initialData.booking_amount === 0 && initialData.second_installment === 0 && initialData.final_payment === 0
  );

  const amounts = useMemo(() => calculateAgreementAmounts(data), [data]);
  const enabledCount = data.services.filter(service => service.enabled).length;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      localStorage.setItem('crm_agreement_working_draft', JSON.stringify(data));
      setDraftSaved(true);
      window.setTimeout(() => setDraftSaved(false), 1200);
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [data]);

  useEffect(() => {
    setData(current => ({
      ...current,
      final_amount: amounts.finalAmount,
      remaining_amount: amounts.outstanding,
      outstanding: amounts.outstanding,
    }));
  }, [amounts.finalAmount, amounts.outstanding]);

  useEffect(() => {
    if (!paymentAutoSplit) return;
    const booking = Math.round(amounts.finalAmount * 0.5);
    const second = Math.round(amounts.finalAmount * 0.25);
    const finalPay = Math.max(0, amounts.finalAmount - booking - second);
    setData(current => (
      current.booking_amount === booking && current.second_installment === second && current.final_payment === finalPay
        ? current
        : { ...current, booking_amount: booking, second_installment: second, final_payment: finalPay }
    ));
  }, [amounts.finalAmount, paymentAutoSplit]);

  const setText = (key: TextKey, value: string) => setData(current => ({ ...current, [key]: value }));
  const setNumber = (key: 'package_price' | 'discount' | 'gst_percent' | 'booking_amount' | 'second_installment' | 'final_payment', value: string) => {
    if (key === 'booking_amount' || key === 'second_installment' || key === 'final_payment') setPaymentAutoSplit(false);
    setData(current => ({ ...current, [key]: Math.max(0, Number(value) || 0) }));
  };
  const resetPaymentSplit = () => setPaymentAutoSplit(true);

  const applyPackage = (packageName: AgreementFormData['package_name']) => {
    const preset = PACKAGE_DEFAULTS[packageName];
    setPaymentAutoSplit(true);
    setData(current => ({
      ...current,
      package_name: packageName,
      package_price: preset.price,
      services: current.services.map(service => ({
        ...service,
        enabled: preset.services.includes(service.name) || Boolean(service.is_custom && service.enabled),
      })),
    }));
  };

  const updateService = (updated: AgreementService) =>
    setData(current => ({ ...current, services: current.services.map(service => service.id === updated.id ? updated : service) }));

  const validateStep = (target = step) => {
    if (target === 0 && (!data.client_name.trim() || !data.mobile.trim() || !data.event_date || !data.venue.trim())) {
      setError('Client name, mobile, event date and venue are required.');
      return false;
    }
    if (target === 1 && (!data.package_name || data.package_price < 0)) {
      setError('Choose a package and enter a valid package price.');
      return false;
    }
    if (target === 2 && enabledCount === 0) {
      setError('Enable at least one service for this agreement.');
      return false;
    }
    setError('');
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep(current => Math.min(STEPS.length - 1, current + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    for (const requiredStep of [0, 1, 2]) {
      if (!validateStep(requiredStep)) {
        setStep(requiredStep);
        return;
      }
    }
    setSaving(true);
    try {
      await onSubmit({ ...data, final_amount: amounts.finalAmount, remaining_amount: amounts.outstanding, outstanding: amounts.outstanding });
      localStorage.removeItem('crm_agreement_working_draft');
    } catch (submitError) {
      const message = submitError instanceof Error
        ? submitError.message
        : submitError && typeof submitError === 'object' && 'message' in submitError
          ? String(submitError.message)
          : 'Unable to save agreement.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = async () => {
    if (!onSaveDraft) return;
    setError(''); setDraftSaving(true);
    try {
      await onSaveDraft({ ...data, status: 'Draft', final_amount: amounts.finalAmount, remaining_amount: amounts.outstanding, outstanding: amounts.outstanding });
      localStorage.removeItem('crm_agreement_working_draft');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save draft.');
    } finally { setDraftSaving(false); }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">
          {STEPS.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`group flex min-w-0 items-center gap-2 rounded-xl px-2 py-2.5 text-left transition-colors sm:px-3 ${index === step ? 'bg-gray-950 text-white' : index < step ? 'text-gray-900 hover:bg-gray-50' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${index === step ? 'bg-red-600 text-white' : index < step ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                {index < step ? <Check size={14} /> : <Icon size={14} />}
              </span>
              <span>
                <span className="block text-[9px] font-bold uppercase tracking-wider opacity-60">0{index + 1}</span>
                <span className="block truncate text-[11px] font-bold sm:text-xs">{label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="p-5 sm:p-7 lg:p-9">
          {step === 0 && (
            <>
              <SectionHeading eyebrow="01 / Client information" title="Who is this celebration for?" copy="Capture the client, couple, venue and operating timeline. Empty optional fields are automatically hidden from the final agreement." />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Client name" required><input value={data.client_name} onChange={e => setText('client_name', e.target.value)} placeholder="Primary contracting client" /></Field>
                <Field label="Groom name"><input value={data.groom_name} onChange={e => setText('groom_name', e.target.value)} placeholder="Full name" /></Field>
                <Field label="Bride name"><input value={data.bride_name} onChange={e => setText('bride_name', e.target.value)} placeholder="Full name" /></Field>
                <Field label="Mobile" required><input type="tel" value={data.mobile} onChange={e => setText('mobile', e.target.value)} placeholder="+91 98765 43210" /></Field>
                <Field label="Alternate mobile"><input type="tel" value={data.alternate_mobile} onChange={e => setText('alternate_mobile', e.target.value)} placeholder="Optional" /></Field>
                <Field label="Email"><input type="email" value={data.email} onChange={e => setText('email', e.target.value)} placeholder="client@example.com" /></Field>
                <Field label="Address" className="sm:col-span-2 lg:col-span-3"><textarea value={data.address} onChange={e => setText('address', e.target.value)} rows={2} placeholder="Billing / correspondence address" /></Field>
                <Field label="Agreement date" required><input type="date" value={data.agreement_date} onChange={e => setText('agreement_date', e.target.value)} /></Field>
                <Field label="Event date" required><input type="date" value={data.event_date} onChange={e => setText('event_date', e.target.value)} /></Field>
                <Field label="Venue" required><input value={data.venue} onChange={e => setText('venue', e.target.value)} placeholder="Venue and city" /></Field>
                <Field label="Google Maps link" className="sm:col-span-2 lg:col-span-3"><input type="url" value={data.maps_link} onChange={e => setText('maps_link', e.target.value)} placeholder="https://maps.google.com/..." /></Field>
                <Field label="Start time"><input type="time" value={data.start_time} onChange={e => setText('start_time', e.target.value)} /></Field>
                <Field label="End time"><input type="time" value={data.end_time} onChange={e => setText('end_time', e.target.value)} /></Field>
                <Field label="Hard stop time" hint="The latest operational cut-off."><input type="time" value={data.hard_stop_time} onChange={e => setText('hard_stop_time', e.target.value)} /></Field>
                <Field label="Event coordinator"><input value={data.event_coordinator} onChange={e => setText('event_coordinator', e.target.value)} placeholder="Assigned coordinator" /></Field>
                <Field label="Sales executive"><input value={data.sales_executive} onChange={e => setText('sales_executive', e.target.value)} placeholder="Agreement owner" /></Field>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <SectionHeading eyebrow="02 / Package & pricing" title="Shape the commercial summary." copy="Package presets enable a recommended service combination. You can customize every included service in the next step." />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {AGREEMENT_PACKAGES.map(packageName => (
                  <button key={packageName} type="button" onClick={() => applyPackage(packageName)}
                    className={`rounded-2xl border px-3 py-4 text-left transition-all ${data.package_name === packageName ? 'border-red-600 bg-red-50 ring-2 ring-red-100' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                    <span className={`mb-3 flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${data.package_name === packageName ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{packageName[0]}</span>
                    <span className="block text-xs font-extrabold text-gray-900">{packageName}</span>
                    <span className="mt-1 block text-[10px] text-gray-400">{PACKAGE_DEFAULTS[packageName].price ? currency(PACKAGE_DEFAULTS[packageName].price) : 'Build your own'}</span>
                  </button>
                ))}
              </div>
              <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Package price" required><input type="number" min="0" value={data.package_price} onChange={e => setNumber('package_price', e.target.value)} /></Field>
                <Field label="Discount"><input type="number" min="0" max={data.package_price} value={data.discount} onChange={e => setNumber('discount', e.target.value)} /></Field>
                <Field label="GST %"><input type="number" min="0" max="100" value={data.gst_percent} onChange={e => setNumber('gst_percent', e.target.value)} /></Field>
              </div>
              <div className="mt-7 grid gap-3 rounded-2xl bg-gray-950 p-5 text-white sm:grid-cols-3">
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Subtotal after discount</p><p className="mt-2 text-xl font-extrabold">{currency(Math.max(0, data.package_price - data.discount))}</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">GST</p><p className="mt-2 text-xl font-extrabold">{currency(Math.max(0, data.package_price - data.discount) * data.gst_percent / 100)}</p></div>
                <div className="rounded-xl bg-red-600 p-4 sm:-my-1"><p className="text-[10px] font-bold uppercase tracking-widest text-red-100">Final agreement value</p><p className="mt-2 text-2xl font-black">{currency(amounts.finalAmount)}</p></div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <SectionHeading eyebrow="03 / Included services" title="Configure the Baraat experience." copy="Only enabled services and client-visible information will appear in the final PDF." />
              <div className="mb-4 mt-6 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <p className="text-xs font-semibold text-emerald-800">{enabledCount} service{enabledCount !== 1 ? 's' : ''} enabled</p>
                <p className="hidden text-[10px] font-bold uppercase tracking-wider text-emerald-600 sm:block">Internal notes stay private</p>
              </div>
              <div className="space-y-3">
                {data.services.map(service => (
                  <ServiceBlock
                    key={service.id}
                    service={service}
                    onChange={updateService}
                    onRemove={service.is_custom ? () => setData(current => ({ ...current, services: current.services.filter(item => item.id !== service.id) })) : undefined}
                  />
                ))}
              </div>
              <button type="button" onClick={() => setData(current => ({ ...current, services: [...current.services, createService('Other Service', true, true)] }))}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-xs font-bold text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700">
                <Plus size={15} /> Add other service
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <SectionHeading eyebrow="04 / Notes & operations" title="Separate client promises from team execution." copy="Client notes and special requirements are included in the agreement. Vendor, staff and logistics notes remain inside the CRM." />
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <Field label="Client notes" hint="Visible in PDF"><textarea rows={5} value={data.client_notes} onChange={e => setText('client_notes', e.target.value)} placeholder="Important details agreed with the client..." /></Field>
                <Field label="Special requirements" hint="Visible in PDF"><textarea rows={5} value={data.special_requirements} onChange={e => setText('special_requirements', e.target.value)} placeholder="Access, timing, cultural or production requirements..." /></Field>
                <Field label="Vendor instructions" hint="Internal only"><textarea rows={5} value={data.vendor_instructions} onChange={e => setText('vendor_instructions', e.target.value)} placeholder="Vendor reporting and setup instructions..." /></Field>
                <Field label="Internal staff notes" hint="Internal only"><textarea rows={5} value={data.internal_staff_notes} onChange={e => setText('internal_staff_notes', e.target.value)} placeholder="Staffing, handovers and escalation notes..." /></Field>
                <Field label="Logistics notes" hint="Internal only" className="lg:col-span-2"><textarea rows={4} value={data.logistics_notes} onChange={e => setText('logistics_notes', e.target.value)} placeholder="Parking, loading, permissions, route and movement plan..." /></Field>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <SectionHeading eyebrow="05 / Payment schedule" title="Make every payment milestone unambiguous." copy="Booking amount, second installment and final payment are scheduled as a 50% / 25% / 25% split of the agreement value — PlanMyBaraat's standard payment policy. These are the planned amounts; mark each one as received only once the money has actually come in, so the remaining amount below always reflects reality." />

              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <span className={`h-2 w-2 rounded-full ${paymentAutoSplit ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {paymentAutoSplit
                    ? 'Auto-split active: 50% booking · 25% second installment · 25% final payment (schedule only — nothing marked received yet).'
                    : 'Payment schedule has been manually edited for this agreement.'}
                </p>
                {!paymentAutoSplit && (
                  <button type="button" onClick={resetPaymentSplit} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700">
                    <RotateCcw size={12} /> Reset to 50/25/25 split
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <InstallmentField
                  label="Booking amount" hint="50% of agreement value by default" value={data.booking_amount}
                  paid={isInstallmentPaid(data.booking_paid)}
                  onValueChange={value => setNumber('booking_amount', value)}
                  onTogglePaid={() => setData(current => ({ ...current, booking_paid: !isInstallmentPaid(current.booking_paid) }))}
                />
                <InstallmentField
                  label="Second installment" hint="25% of agreement value by default" value={data.second_installment}
                  paid={isInstallmentPaid(data.second_installment_paid)}
                  onValueChange={value => setNumber('second_installment', value)}
                  onTogglePaid={() => setData(current => ({ ...current, second_installment_paid: !isInstallmentPaid(current.second_installment_paid) }))}
                />
                <InstallmentField
                  label="Final payment" hint="25% of agreement value by default" value={data.final_payment}
                  paid={isInstallmentPaid(data.final_payment_paid)}
                  onValueChange={value => setNumber('final_payment', value)}
                  onTogglePaid={() => setData(current => ({ ...current, final_payment_paid: !isInstallmentPaid(current.final_payment_paid) }))}
                />
                <Field label="Payment mode">
                  <select value={data.payment_mode} onChange={e => setText('payment_mode', e.target.value)}>
                    <option value="">Select mode</option><option>UPI</option><option>Bank Transfer</option><option>Credit / Debit Card</option><option>Cheque</option><option>Cash</option><option>Mixed</option>
                  </select>
                </Field>
                <Field label="Transaction reference" className="sm:col-span-2"><input value={data.transaction_reference} onChange={e => setText('transaction_reference', e.target.value)} placeholder="UTR, cheque or receipt reference" /></Field>
              </div>

              <div className="mt-7 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                <div className="grid gap-px bg-gray-200 sm:grid-cols-3">
                  <div className="bg-gray-950 p-5 text-white"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Agreement value</p><p className="mt-2 text-xl font-black">{currency(amounts.finalAmount)}</p></div>
                  <div className="bg-gray-950 p-5 text-white"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total received</p><p className="mt-2 text-xl font-black text-emerald-400">{currency(amounts.paid)}</p></div>
                  <div className="bg-red-600 p-5 text-white"><p className="text-[10px] font-bold uppercase tracking-wider text-red-100">Remaining amount</p><p className="mt-2 text-xl font-black">{currency(amounts.outstanding)}</p></div>
                </div>
                <div className="grid gap-px bg-gray-200 sm:grid-cols-3">
                  <div className="bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Package price</p><p className="mt-2 text-sm font-black text-gray-950">{currency(data.package_price)}</p></div>
                  <div className="bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Discount</p><p className="mt-2 text-sm font-black text-gray-950">- {currency(data.discount)}</p></div>
                  <div className="bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">GST</p><p className="mt-2 text-sm font-black text-gray-950">{data.gst_percent}%</p></div>
                  <div className="bg-white p-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Booking amount</p>
                    <p className="mt-2 text-sm font-black text-gray-950">{currency(data.booking_amount)} <span className={`ml-1 text-[9px] font-black uppercase ${isInstallmentPaid(data.booking_paid) ? 'text-emerald-600' : 'text-amber-600'}`}>{isInstallmentPaid(data.booking_paid) ? '· Received' : '· Pending'}</span></p>
                  </div>
                  <div className="bg-white p-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Second installment</p>
                    <p className="mt-2 text-sm font-black text-gray-950">{currency(data.second_installment)} <span className={`ml-1 text-[9px] font-black uppercase ${isInstallmentPaid(data.second_installment_paid) ? 'text-emerald-600' : 'text-amber-600'}`}>{isInstallmentPaid(data.second_installment_paid) ? '· Received' : '· Pending'}</span></p>
                  </div>
                  <div className="bg-white p-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Final payment</p>
                    <p className="mt-2 text-sm font-black text-gray-950">{currency(data.final_payment)} <span className={`ml-1 text-[9px] font-black uppercase ${isInstallmentPaid(data.final_payment_paid) ? 'text-emerald-600' : 'text-amber-600'}`}>{isInstallmentPaid(data.final_payment_paid) ? '· Received' : '· Pending'}</span></p>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <SectionHeading eyebrow="06 / Agreement control" title="Review governance and save." copy="Agreement numbers are generated automatically. Every subsequent save creates a new version and preserves the prior snapshot." />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Agreement number"><input value={data.agreement_number} readOnly className="bg-gray-50 font-mono font-bold" /></Field>
                <Field label="Created date"><input type="date" value={data.created_date} onChange={e => setText('created_date', e.target.value)} /></Field>
                <Field label="Version"><input value={`v${data.version}`} readOnly className="bg-gray-50 font-bold" /></Field>
                <Field label="Status">
                  <select value={data.status} onChange={e => setData(current => ({ ...current, status: e.target.value as AgreementFormData['status'] }))}>
                    {AGREEMENT_STATUSES.map(status => <option key={status}>{status}</option>)}
                  </select>
                </Field>
              </div>
              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-3">
                  <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-bold text-amber-950">Before generating the agreement</p>
                    <p className="mt-1 text-xs leading-5 text-amber-800">Confirm spellings, venue timing, enabled service quantities and the payment schedule. Internal notes never appear in the client PDF.</p>
                  </div>
                </div>
              </div>
              <div className="mt-7 grid gap-3 rounded-2xl bg-gray-950 p-5 text-white sm:grid-cols-4">
                <div><p className="agreement-review-label">Client</p><p className="agreement-review-value">{data.client_name || 'Not entered'}</p></div>
                <div><p className="agreement-review-label">Event</p><p className="agreement-review-value">{data.event_date || 'Not entered'}</p></div>
                <div><p className="agreement-review-label">Services</p><p className="agreement-review-value">{enabledCount} enabled</p></div>
                <div><p className="agreement-review-label">Final value</p><p className="agreement-review-value text-red-400">{currency(amounts.finalAmount)}</p></div>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mx-5 mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 sm:mx-7 lg:mx-9">
            <CircleAlert size={15} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setStep(current => Math.max(0, current - 1))} disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeft size={15} /> Back
            </button>
            <span className={`text-[10px] font-bold text-emerald-600 transition-opacity ${draftSaved ? 'opacity-100' : 'opacity-0'}`}>Working copy saved locally</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {onSaveDraft && <button type="button" onClick={saveDraft} disabled={saving || draftSaving} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 disabled:opacity-50"><Save size={15} /> {draftSaving ? 'Saving draft...' : 'Save as draft'}</button>}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} disabled={saving || draftSaving} className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-50">Continue <ChevronRight size={15} /></button>
            ) : (
              <button type="button" onClick={submit} disabled={saving || draftSaving} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"><Save size={15} /> {saving ? 'Saving...' : submitLabel}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
