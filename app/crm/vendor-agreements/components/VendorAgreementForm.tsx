'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Ban, BadgeCheck, CalendarDays, Check, ChevronLeft, ChevronRight, CircleAlert,
  ClipboardList, FileCheck2, Info, Plus, ScrollText, Sparkles, Star, Users,
} from 'lucide-react';
import type { UploadedFile, VendorAgreementFormData, VendorAgreementService, VendorDocumentFile } from '../../lib/types';
import FileUploader, { FileItem } from '../../components/FileUploader';
import { getUploadedFiles, deleteUploadedFile, updateVendorAgreement } from '../../lib/supabase-crm';
import {
  VENDOR_AGREEMENT_STATUSES, VENDOR_BLACKLIST_STATUSES, VENDOR_COMMISSION_TYPES,
  VENDOR_DOCUMENT_CATEGORIES, VENDOR_PAYMENT_SCHEDULES, VENDOR_VERIFICATION_STATUSES,
  calculateVendorAgreementAmounts, createVendorAgreementService, currency,
} from '../vendor-agreement-config';
import VendorServiceBlock from './VendorServiceBlock';

interface VendorAgreementFormProps {
  initialData: VendorAgreementFormData;
  onSubmit: (data: VendorAgreementFormData) => Promise<void>;
  onSaveDraft?: (data: VendorAgreementFormData) => Promise<void>;
  submitLabel?: string;
  isEditing?: boolean;
  // Only set once the vendor agreement already exists in Supabase — lets the
  // Documents step upload real files immediately instead of deferring to the
  // detail page, since uploads need a real entity id to attach to.
  agreementId?: string;
}

const STEPS = [
  { label: 'Vendor', icon: Users },
  { label: 'Services', icon: Sparkles },
  { label: 'Payment', icon: CalendarDays },
  { label: 'Documents', icon: ClipboardList },
  { label: 'Terms', icon: ScrollText },
  { label: 'Review', icon: FileCheck2 },
] as const;

type TextKey = {
  [K in keyof VendorAgreementFormData]: VendorAgreementFormData[K] extends string ? K : never
}[keyof VendorAgreementFormData];

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

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-600">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-extrabold tracking-tight text-gray-950 sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">{copy}</p>
    </div>
  );
}

const TERMS_PREVIEW = [
  { title: 'Confidentiality', copy: 'The vendor shall keep all client information, pricing, event details and business processes strictly confidential during and after this agreement.' },
  { title: 'Non-circumvention (24 months)', copy: 'The vendor shall not directly accept bookings, solicit or conduct business with any client introduced by PlanMyBaraat for 24 months from the date of introduction — whether or not the event was booked through PlanMyBaraat.' },
  { title: 'Non-solicitation', copy: 'The vendor shall not solicit PlanMyBaraat staff, other vendors or clients away from PlanMyBaraat during the term of this agreement and for 12 months thereafter.' },
  { title: 'Payment protection', copy: 'Commission and payment terms in Step 3 are binding. PlanMyBaraat may withhold payment pending resolution of a client complaint, damage claim or breach investigation.' },
  { title: 'Service quality standards', copy: 'The vendor shall deliver services matching the description, capacity and quality represented at onboarding, on time and as briefed for each event.' },
  { title: 'Cancellation policy', copy: 'Vendor-initiated cancellations within 7 days of the event date may result in a penalty, loss recovery and impact the vendor’s reliability rating.' },
  { title: 'Late arrival / no-show', copy: 'Repeated late arrival or a no-show on a confirmed event is treated as a material breach and may result in immediate suspension.' },
  { title: 'Equipment responsibility', copy: 'The vendor is solely responsible for the safety, maintenance and insurance of its own equipment, vehicles and personnel.' },
  { title: 'Staff conduct', copy: 'Vendor staff and representatives must behave professionally with clients, guests and PlanMyBaraat staff at all times.' },
  { title: 'Property damage', copy: 'The vendor is liable for any damage caused to venue property, client property or third-party property by its personnel or equipment.' },
  { title: 'Indemnity', copy: 'The vendor shall indemnify PlanMyBaraat against claims, losses or damages arising from the vendor’s negligence, misconduct or breach of this agreement.' },
  { title: 'Force majeure', copy: 'Neither party is liable for delay or failure caused by events beyond reasonable control, subject to prompt written notice.' },
  { title: 'Intellectual property', copy: 'PlanMyBaraat branding, client lists and proprietary materials remain PlanMyBaraat’s exclusive property.' },
  { title: 'Social media restrictions', copy: 'The vendor shall not publish client names, event details or PlanMyBaraat-sourced content without prior written approval.' },
  { title: 'Client data protection', copy: 'Client contact details and event information shared with the vendor shall be used solely for confirmed service delivery and not retained beyond that purpose.' },
  { title: 'Dispute resolution & jurisdiction', copy: 'Disputes shall first be discussed in good faith, failing which they are subject to the exclusive jurisdiction of the courts at Vadodara, Gujarat.' },
  { title: 'Suspension / blacklisting', copy: 'PlanMyBaraat reserves the right to suspend or blacklist a vendor for breach, poor performance or misconduct, with recovery of losses and legal action where warranted.' },
  { title: 'Digital signature consent', copy: 'The vendor consents to execution of this agreement by digital signature, which carries the same legal validity as a physical signature.' },
];

export default function VendorAgreementForm({ initialData, onSubmit, onSaveDraft, submitLabel = 'Save vendor agreement', isEditing: _isEditing = false, agreementId }: VendorAgreementFormProps) {
  const [data, setData] = useState(initialData);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [error, setError] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [docCategory, setDocCategory] = useState<string>(VENDOR_DOCUMENT_CATEGORIES[0]);
  const [docError, setDocError] = useState('');

  useEffect(() => {
    if (!agreementId) return;
    getUploadedFiles('vendor_agreement', agreementId).then(setUploadedFiles);
  }, [agreementId]);

  const addDocument = async (file: UploadedFile) => {
    if (!agreementId) return;
    setDocError('');
    setUploadedFiles(current => [file, ...current]);
    const doc: VendorDocumentFile = {
      id: file.id, category: docCategory, file_name: file.file_name, file_url: file.file_url,
      file_type: file.file_type, file_size: file.file_size, uploaded_at: file.created_at,
    };
    const nextDocuments = [doc, ...data.documents];
    setData(current => ({ ...current, documents: nextDocuments }));
    try {
      const updated = await updateVendorAgreement(agreementId, { ...data, documents: nextDocuments }, `${docCategory} document uploaded`);
      setData(current => ({ ...current, version: updated.version, revisions: updated.revisions, activity: updated.activity }));
    } catch (err) {
      setDocError(err instanceof Error ? err.message : 'Uploaded, but failed to attach to the agreement record.');
    }
  };

  const removeDocument = async (file: UploadedFile) => {
    if (!agreementId) return;
    setDocError('');
    await deleteUploadedFile(file.id, file.file_url);
    setUploadedFiles(current => current.filter(item => item.id !== file.id));
    const nextDocuments = data.documents.filter(doc => doc.id !== file.id);
    setData(current => ({ ...current, documents: nextDocuments }));
    try {
      const updated = await updateVendorAgreement(agreementId, { ...data, documents: nextDocuments }, 'Document removed');
      setData(current => ({ ...current, version: updated.version, revisions: updated.revisions, activity: updated.activity }));
    } catch (err) {
      setDocError(err instanceof Error ? err.message : 'Removed the file, but failed to update the agreement record.');
    }
  };

  const amounts = useMemo(() => calculateVendorAgreementAmounts(data), [data]);
  const enabledCount = data.services.filter(service => service.enabled).length;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      localStorage.setItem('crm_vendor_agreement_working_draft', JSON.stringify(data));
      setDraftSaved(true);
      window.setTimeout(() => setDraftSaved(false), 1200);
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [data]);

  const setText = (key: TextKey, value: string) => setData(current => ({ ...current, [key]: value }));
  const setNumber = (key: 'commission_percent' | 'flat_commission_amount' | 'gst_percent' | 'agreement_validity_months' | 'renewal_notice_days' | 'performance_score' | 'reliability_rating' | 'completed_events' | 'cancellation_count' | 'complaint_count' | 'on_time_percent', value: string) =>
    setData(current => ({ ...current, [key]: Math.max(0, Number(value) || 0) }));

  const updateService = (updated: VendorAgreementService) =>
    setData(current => ({ ...current, services: current.services.map(service => service.id === updated.id ? updated : service) }));

  const validateStep = (target = step) => {
    if (target === 0 && (!data.vendor_name.trim() || !data.mobile.trim())) {
      setError('Vendor name and mobile number are required.');
      return false;
    }
    if (target === 1 && enabledCount === 0) {
      setError('Enable at least one service this vendor provides.');
      return false;
    }
    if (target === 2 && !data.agreement_start_date) {
      setError('Set an agreement start date.');
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
      await onSubmit(data);
      localStorage.removeItem('crm_vendor_agreement_working_draft');
    } catch (submitError) {
      const message = submitError instanceof Error
        ? submitError.message
        : submitError && typeof submitError === 'object' && 'message' in submitError
          ? String(submitError.message)
          : 'Unable to save vendor agreement.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };
  const saveDraft = async () => {
    if (!onSaveDraft) return;
    setError(''); setDraftSaving(true);
    try {
      await onSaveDraft({ ...data, status: 'Draft' });
      localStorage.removeItem('crm_vendor_agreement_working_draft');
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : 'Unable to save draft.'); }
    finally { setDraftSaving(false); }
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
              <SectionHeading eyebrow="01 / Vendor details" title="Who are we contracting with?" copy="Capture the vendor's business, contact, legal and bank details, plus an emergency contact and verification status." />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Vendor / owner name" required><input value={data.vendor_name} onChange={e => setText('vendor_name', e.target.value)} placeholder="Full name" /></Field>
                <Field label="Business name"><input value={data.business_name} onChange={e => setText('business_name', e.target.value)} placeholder="Registered business / brand name" /></Field>
                <Field label="Contact person"><input value={data.contact_person} onChange={e => setText('contact_person', e.target.value)} placeholder="If different from vendor" /></Field>
                <Field label="Mobile" required><input type="tel" value={data.mobile} onChange={e => setText('mobile', e.target.value)} placeholder="+91 98765 43210" /></Field>
                <Field label="Alternate mobile"><input type="tel" value={data.alternate_mobile} onChange={e => setText('alternate_mobile', e.target.value)} placeholder="Optional" /></Field>
                <Field label="Email"><input type="email" value={data.email} onChange={e => setText('email', e.target.value)} placeholder="vendor@example.com" /></Field>
                <Field label="Address" className="sm:col-span-2 lg:col-span-3"><textarea rows={2} value={data.address} onChange={e => setText('address', e.target.value)} placeholder="Registered / operating address" /></Field>
                <Field label="City"><input value={data.city} onChange={e => setText('city', e.target.value)} /></Field>
                <Field label="State"><input value={data.state} onChange={e => setText('state', e.target.value)} /></Field>
                <Field label="Pincode"><input value={data.pincode} onChange={e => setText('pincode', e.target.value)} /></Field>
                <Field label="Primary service category"><input value={data.service_category} onChange={e => setText('service_category', e.target.value)} placeholder="e.g. Dhol & Band, Decor, Catering" /></Field>
                <Field label="Verification status">
                  <select value={data.verification_status} onChange={e => setData(current => ({ ...current, verification_status: e.target.value as VendorAgreementFormData['verification_status'] }))}>
                    {VENDOR_VERIFICATION_STATUSES.map(status => <option key={status}>{status}</option>)}
                  </select>
                </Field>
                <Field label="Agreement date"><input type="date" value={data.agreement_date} onChange={e => setText('agreement_date', e.target.value)} /></Field>
              </div>

              <p className="mb-4 mt-8 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">Legal & bank details</p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="GSTIN"><input value={data.gstin} onChange={e => setText('gstin', e.target.value)} placeholder="Optional" /></Field>
                <Field label="PAN number"><input value={data.pan_number} onChange={e => setText('pan_number', e.target.value)} /></Field>
                <Field label="Aadhaar number"><input value={data.aadhaar_number} onChange={e => setText('aadhaar_number', e.target.value)} /></Field>
                <Field label="Bank account name"><input value={data.bank_account_name} onChange={e => setText('bank_account_name', e.target.value)} /></Field>
                <Field label="Bank account number"><input value={data.bank_account_number} onChange={e => setText('bank_account_number', e.target.value)} /></Field>
                <Field label="IFSC code"><input value={data.ifsc_code} onChange={e => setText('ifsc_code', e.target.value.toUpperCase())} /></Field>
                <Field label="Bank name"><input value={data.bank_name} onChange={e => setText('bank_name', e.target.value)} /></Field>
                <Field label="UPI ID"><input value={data.upi_id} onChange={e => setText('upi_id', e.target.value)} placeholder="Optional" /></Field>
              </div>

              <p className="mb-4 mt-8 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">Emergency contact</p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Emergency contact name"><input value={data.emergency_contact_name} onChange={e => setText('emergency_contact_name', e.target.value)} /></Field>
                <Field label="Emergency contact mobile"><input type="tel" value={data.emergency_contact_mobile} onChange={e => setText('emergency_contact_mobile', e.target.value)} /></Field>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <SectionHeading eyebrow="02 / Services & commercial details" title="What does this vendor deliver, and at what price?" copy="Reuses the same service catalogue as Baraat Management Contracts. Enable every service this vendor provides and set its commercial terms." />
                <button type="button" onClick={() => setData(current => ({ ...current, services: [...current.services, createVendorAgreementService('Other Service', true, true)] }))}
                  className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700">
                  <Plus size={15} /> Add other service
                </button>
              </div>
              <div className="mb-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <p className="text-xs font-semibold text-emerald-800">{enabledCount} service{enabledCount !== 1 ? 's' : ''} offered</p>
                <p className="hidden text-[10px] font-bold uppercase tracking-wider text-emerald-600 sm:block">Pricing feeds the commercial summary below</p>
              </div>
              <div className="space-y-3">
                {data.services.map(service => (
                  <VendorServiceBlock
                    key={service.id}
                    service={service}
                    onChange={updateService}
                    onRemove={service.is_custom ? () => setData(current => ({ ...current, services: current.services.filter(item => item.id !== service.id) })) : undefined}
                  />
                ))}
              </div>
              <div className="mt-7 grid gap-3 rounded-2xl bg-gray-950 p-5 text-white sm:grid-cols-4">
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Base total</p><p className="mt-2 text-xl font-extrabold">{currency(amounts.baseTotal)}</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Travel total</p><p className="mt-2 text-xl font-extrabold">{currency(amounts.travelTotal)}</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Advance required</p><p className="mt-2 text-xl font-extrabold">{currency(amounts.advanceTotal)}</p></div>
                <div className="rounded-xl bg-red-600 p-4 sm:-my-1"><p className="text-[10px] font-bold uppercase tracking-widest text-red-100">Estimated value</p><p className="mt-2 text-2xl font-black">{currency(amounts.estimatedValue)}</p></div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <SectionHeading eyebrow="03 / Payment & agreement" title="Set commission, payout terms and validity." copy="Commission is calculated against the estimated service value from Step 2. Agreement validity controls the expiry reminder shown on the vendor agreement list." />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Commission type">
                  <select value={data.commission_type} onChange={e => setData(current => ({ ...current, commission_type: e.target.value as VendorAgreementFormData['commission_type'] }))}>
                    {VENDOR_COMMISSION_TYPES.map(type => <option key={type}>{type}</option>)}
                  </select>
                </Field>
                {data.commission_type === 'Percentage' ? (
                  <Field label="Commission %"><input type="number" min="0" max="100" value={data.commission_percent} onChange={e => setNumber('commission_percent', e.target.value)} /></Field>
                ) : (
                  <Field label="Flat commission amount"><input type="number" min="0" value={data.flat_commission_amount} onChange={e => setNumber('flat_commission_amount', e.target.value)} /></Field>
                )}
                <Field label="Payment schedule">
                  <select value={data.payment_schedule} onChange={e => setData(current => ({ ...current, payment_schedule: e.target.value as VendorAgreementFormData['payment_schedule'] }))}>
                    {VENDOR_PAYMENT_SCHEDULES.map(schedule => <option key={schedule}>{schedule}</option>)}
                  </select>
                </Field>
                <Field label="Payment release condition" className="sm:col-span-2 lg:col-span-3"><textarea rows={2} value={data.payment_release_condition} onChange={e => setText('payment_release_condition', e.target.value)} /></Field>
                <Field label="GST applicable">
                  <select value={data.gst_applicable ? 'yes' : 'no'} onChange={e => setData(current => ({ ...current, gst_applicable: e.target.value === 'yes' }))}>
                    <option value="yes">Yes</option><option value="no">No</option>
                  </select>
                </Field>
                <Field label="GST %"><input type="number" min="0" max="100" value={data.gst_percent} onChange={e => setNumber('gst_percent', e.target.value)} disabled={!data.gst_applicable} /></Field>
                <Field label="Agreement validity (months)"><input type="number" min="1" value={data.agreement_validity_months} onChange={e => setNumber('agreement_validity_months', e.target.value)} /></Field>
                <Field label="Agreement start date" required><input type="date" value={data.agreement_start_date} onChange={e => setText('agreement_start_date', e.target.value)} /></Field>
                <Field label="Agreement end date"><input type="date" value={data.agreement_end_date} onChange={e => setText('agreement_end_date', e.target.value)} /></Field>
                <Field label="Auto-renewal">
                  <select value={data.auto_renewal ? 'yes' : 'no'} onChange={e => setData(current => ({ ...current, auto_renewal: e.target.value === 'yes' }))}>
                    <option value="no">No — renew manually</option><option value="yes">Yes — auto-renew</option>
                  </select>
                </Field>
                <Field label="Renewal notice (days)" hint="Days before expiry to alert staff"><input type="number" min="0" value={data.renewal_notice_days} onChange={e => setNumber('renewal_notice_days', e.target.value)} /></Field>
              </div>

              <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-3">
                <div className="bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Estimated service value</p><p className="mt-2 text-xl font-black text-gray-950">{currency(amounts.estimatedValue)}</p></div>
                <div className="bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">PlanMyBaraat commission</p><p className="mt-2 text-xl font-black text-red-600">{currency(amounts.commissionAmount)}</p></div>
                <div className="bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Net vendor payout (est.)</p><p className="mt-2 text-xl font-black text-emerald-600">{currency(Math.max(0, amounts.estimatedValue - amounts.commissionAmount))}</p></div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <SectionHeading
                eyebrow="04 / Vendor documents"
                title="Track the paperwork that keeps this vendor compliant."
                copy={agreementId
                  ? 'Upload files below — each one is stored in Supabase immediately and attached to this agreement, no separate save required.'
                  : 'Save this agreement first, then upload files from its Documents tab — this keeps every upload securely tied to a real record from the moment it lands in storage.'}
              />

              {agreementId ? (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
                    <label className="agreement-field mb-3"><span>Document category</span>
                      <select value={docCategory} onChange={e => setDocCategory(e.target.value)}>
                        {VENDOR_DOCUMENT_CATEGORIES.map(category => <option key={category}>{category}</option>)}
                      </select>
                    </label>
                    <FileUploader entityType="vendor_agreement" entityId={agreementId} onUploadComplete={addDocument} />
                    {docError && <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-red-600"><CircleAlert size={13} /> {docError}</p>}
                  </div>
                  <div className="space-y-2">
                    {VENDOR_DOCUMENT_CATEGORIES.map(category => {
                      const matches = uploadedFiles.filter(file => data.documents.find(doc => doc.id === file.id)?.category === category);
                      if (!matches.length) return (
                        <div key={category} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3">
                          <p className="text-xs font-bold text-gray-500">{category}</p>
                          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[9px] font-black uppercase text-gray-500">Pending</span>
                        </div>
                      );
                      return (
                        <div key={category} className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
                          <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">{category}</p>
                          {matches.map(file => <FileItem key={file.id} file={file} onDelete={removeDocument} />)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {VENDOR_DOCUMENT_CATEGORIES.map(category => (
                      <div key={category} className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-gray-900">{category}</p>
                          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[9px] font-black uppercase text-gray-500">Pending</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
                    <Info size={16} className="mt-0.5 shrink-0 text-amber-600" />
                    <p>Aadhaar, PAN, GST certificate, cancelled cheque, registration certificate, portfolio, insurance and rate card are all supported document categories. Generate this agreement first, then come back to Edit to upload.</p>
                  </div>
                </>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <SectionHeading eyebrow="05 / Terms & conditions" title="Legal terms protecting PlanMyBaraat." copy="These clauses are generated automatically into the final PDF. Add any special conditions specific to this vendor below." />
              <div className="space-y-2.5">
                {TERMS_PREVIEW.map((term, index) => (
                  <div key={term.title} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-950 text-[10px] font-black text-white">{index + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{term.title}</p>
                      <p className="mt-1 text-[11px] leading-5 text-gray-500">{term.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <Field label="Special conditions" hint="Visible in the agreement PDF"><textarea rows={5} value={data.special_conditions} onChange={e => setText('special_conditions', e.target.value)} placeholder="Any vendor-specific conditions agreed separately..." /></Field>
                <Field label="Internal staff notes" hint="Internal only"><textarea rows={5} value={data.internal_staff_notes} onChange={e => setText('internal_staff_notes', e.target.value)} placeholder="Onboarding notes, negotiation history, escalation contacts..." /></Field>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <SectionHeading eyebrow="06 / Review & generate" title="Review governance, standing and save." copy="Vendor agreement numbers are generated automatically. Every subsequent save creates a new version and preserves the prior snapshot." />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Vendor agreement number"><input value={data.vendor_agreement_number} readOnly className="bg-gray-50 font-mono font-bold" /></Field>
                <Field label="Created date"><input type="date" value={data.created_date} onChange={e => setText('created_date', e.target.value)} /></Field>
                <Field label="Version"><input value={`v${data.version}`} readOnly className="bg-gray-50 font-bold" /></Field>
                <Field label="Status">
                  <select value={data.status} onChange={e => setData(current => ({ ...current, status: e.target.value as VendorAgreementFormData['status'] }))}>
                    {VENDOR_AGREEMENT_STATUSES.map(status => <option key={status}>{status}</option>)}
                  </select>
                </Field>
              </div>

              <p className="mb-4 mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-red-600"><Star size={13} /> Vendor performance & standing</p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Performance score (0-100)"><input type="number" min="0" max="100" value={data.performance_score} onChange={e => setNumber('performance_score', e.target.value)} /></Field>
                <Field label="Reliability rating (0-5)"><input type="number" min="0" max="5" step="0.1" value={data.reliability_rating} onChange={e => setNumber('reliability_rating', e.target.value)} /></Field>
                <Field label="Completed events"><input type="number" min="0" value={data.completed_events} onChange={e => setNumber('completed_events', e.target.value)} /></Field>
                <Field label="On-time %"><input type="number" min="0" max="100" value={data.on_time_percent} onChange={e => setNumber('on_time_percent', e.target.value)} /></Field>
                <Field label="Cancellation count"><input type="number" min="0" value={data.cancellation_count} onChange={e => setNumber('cancellation_count', e.target.value)} /></Field>
                <Field label="Complaint count"><input type="number" min="0" value={data.complaint_count} onChange={e => setNumber('complaint_count', e.target.value)} /></Field>
                <Field label="Preferred vendor">
                  <select value={data.preferred_vendor ? 'yes' : 'no'} onChange={e => setData(current => ({ ...current, preferred_vendor: e.target.value === 'yes' }))}>
                    <option value="no">No</option><option value="yes">Yes — badge on profile</option>
                  </select>
                </Field>
                <Field label="Blacklist / suspend status">
                  <select value={data.blacklist_status} onChange={e => setData(current => ({ ...current, blacklist_status: e.target.value as VendorAgreementFormData['blacklist_status'] }))}>
                    {VENDOR_BLACKLIST_STATUSES.map(status => <option key={status}>{status}</option>)}
                  </select>
                </Field>
              </div>

              {data.blacklist_status !== 'Active' && (
                <div className="mt-5 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
                  <Ban size={18} className="mt-0.5 shrink-0 text-red-600" />
                  <div>
                    <p className="text-sm font-bold text-red-950">This vendor is marked {data.blacklist_status}</p>
                    <p className="mt-1 text-xs leading-5 text-red-800">Suspended/blacklisted vendors should not be assigned new bookings until their status is reviewed and reset to Active.</p>
                  </div>
                </div>
              )}

              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-3">
                  <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-bold text-amber-950">Before generating the agreement</p>
                    <p className="mt-1 text-xs leading-5 text-amber-800">Confirm spellings, bank details, commission terms and enabled service pricing. Internal notes never appear in the vendor PDF.</p>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid gap-3 rounded-2xl bg-gray-950 p-5 text-white sm:grid-cols-4">
                <div><p className="agreement-review-label">Vendor</p><p className="agreement-review-value">{data.vendor_name || 'Not entered'}</p></div>
                <div><p className="agreement-review-label">Category</p><p className="agreement-review-value">{data.service_category || 'Not entered'}</p></div>
                <div><p className="agreement-review-label">Services</p><p className="agreement-review-value">{enabledCount} offered</p></div>
                <div><p className="agreement-review-label">Est. value</p><p className="agreement-review-value text-red-400">{currency(amounts.estimatedValue)}</p></div>
              </div>
              {data.verification_status === 'Verified' && (
                <p className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600"><BadgeCheck size={15} /> Vendor identity verified</p>
              )}
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
            {onSaveDraft && <button type="button" onClick={saveDraft} disabled={saving || draftSaving} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 disabled:opacity-50"><FileCheck2 size={15} /> {draftSaving ? 'Saving draft...' : 'Save as draft'}</button>}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} disabled={saving || draftSaving} className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-50">Continue <ChevronRight size={15} /></button>
            ) : (
              <button type="button" onClick={submit} disabled={saving || draftSaving} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"><FileCheck2 size={15} /> {saving ? 'Saving...' : submitLabel}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
