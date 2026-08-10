'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BadgeCheck, Camera, Check, ChevronLeft, ChevronRight, CircleAlert, Download,
  FileCheck2, Info, Mail, Plus, Printer, ScrollText, Search, Send, User, Users,
} from 'lucide-react';
import type { EmployeeLetterRecord, LetterExtraFieldDef, LetterTemplate, StaffFormData, StaffRecord } from '../../../lib/types';
import { getStaff, createStaff, createBlankStaff, getNextStaffCode } from '../../../staff/staff-data';
import {
  createEmployeeLetter, getPrivateCrmFileUrl, updateEmployeeHrFields, updateEmployeeLetter, updateEmployeeLetterFile, uploadEmployeePhoto,
} from '../../hr-data';
import { fieldDefault, formatAgreementDate, letterIcon, renderLetterText } from '../../hr-config';
import LetterDocument from './LetterDocument';

const STEPS = [
  { label: 'Employee', icon: Users },
  { label: 'Information', icon: User },
  { label: 'Details', icon: ScrollText },
  { label: 'Preview', icon: FileCheck2 },
  { label: 'Generate', icon: Send },
] as const;

const HR_DEPARTMENTS = ['Operations', 'Sales', 'Client Servicing', 'Production', 'Accounts', 'Marketing', 'Management'];

function Field({ label, required, hint, children, className = '' }: { label: string; required?: boolean; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`agreement-field ${className}`}>
      <span>{label}{required && <b aria-hidden="true">*</b>}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export default function LetterWizard({ template, existingLetter }: { template: LetterTemplate; existingLetter?: EmployeeLetterRecord }) {
  const router = useRouter();
  const Icon = letterIcon(template.icon);
  const isEdit = !!existingLetter;

  const [step, setStep] = useState(isEdit ? 1 : 0);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [employees, setEmployees] = useState<StaffRecord[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(existingLetter?.employee_id || '');
  const [creatingNew, setCreatingNew] = useState(false);
  const [newEmployee, setNewEmployee] = useState<StaffFormData | null>(null);

  const [designation, setDesignation] = useState('');
  const [reportingManagerId, setReportingManagerId] = useState('');
  const [photoBusy, setPhotoBusy] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [extra, setExtra] = useState<Record<string, string | number>>(existingLetter?.extra_fields || {});
  const [generatedLetter, setGeneratedLetter] = useState<EmployeeLetterRecord | null>(null);
  const [pdfBusy, setPdfBusy] = useState('');
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getStaff().then(list => { setEmployees(list); setLoadingEmployees(false); });
  }, []);

  const selectedEmployee = employees.find(item => item.id === selectedId) || null;

  useEffect(() => {
    if (!selectedEmployee) return;
    setDesignation(selectedEmployee.designation || selectedEmployee.job_title);
    setReportingManagerId(selectedEmployee.reporting_manager_id || '');
  }, [selectedEmployee?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEdit) return; // editing an existing letter keeps its saved extra_fields as-is
    const defaults: Record<string, string | number> = {};
    template.extra_fields.forEach(field => { defaults[field.key] = fieldDefault(field, selectedEmployee || undefined); });
    setExtra(defaults);
  }, [template, selectedEmployee?.id, isEdit]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(item => item.full_name.toLowerCase().includes(q) || item.employee_code.toLowerCase().includes(q) || item.department.toLowerCase().includes(q));
  }, [employees, search]);

  const renderedText = useMemo(() => {
    if (!selectedEmployee) return '';
    return renderLetterText(template.body_template, { ...selectedEmployee, designation }, extra);
  }, [selectedEmployee, designation, extra, template.body_template]);

  // Experience letters describe service from joining through Till Date or a
  // chosen date, so they are available for current staff as well as leavers.
  // Other letter types keep their existing lifecycle rules.
  const eligibleForExperience = template.letter_type === 'experience_letter' || !template.requires_status
    ? true
    : template.requires_status
    ? selectedEmployee?.hr_lifecycle_status === template.requires_status
    : true;

  const startCreateEmployee = async () => {
    const code = await getNextStaffCode();
    setNewEmployee(createBlankStaff(code));
    setCreatingNew(true);
  };

  const saveNewEmployee = async () => {
    if (!newEmployee) return;
    if (!newEmployee.full_name.trim() || !newEmployee.mobile.trim()) { setError('Employee name and mobile number are required.'); return; }
    setSaving(true);
    setError('');
    try {
      const created = await createStaff(newEmployee);
      setEmployees(current => [created, ...current]);
      setSelectedId(created.id);
      setCreatingNew(false);
      setNewEmployee(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create employee.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhoto = async (file?: File) => {
    if (!file || !selectedEmployee) return;
    setPhotoBusy(true);
    try {
      const url = await uploadEmployeePhoto(selectedEmployee.id, file);
      setEmployees(current => current.map(item => item.id === selectedEmployee.id ? { ...item, photo_url: url } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Photo upload failed.');
    } finally {
      setPhotoBusy(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const validateStep = (target = step) => {
    setError('');
    if (target === 0 && !selectedId) { setError('Select an employee, or create a new one, to continue.'); return false; }
    if (target === 0 && !eligibleForExperience) {
      setError(`${template.label} can only be generated for employees with status "${template.requires_status}". This employee is currently "${selectedEmployee?.hr_lifecycle_status}".`);
      return false;
    }
    if (target === 2) {
      const missing = template.extra_fields.find(field => field.required !== false && !String(extra[field.key] ?? '').trim());
      if (missing) { setError(`${missing.label} is required.`); return false; }
    }
    return true;
  };

  const next = async () => {
    if (!validateStep()) return;
    if (step === 1 && selectedEmployee) {
      try {
        await updateEmployeeHrFields(selectedEmployee.id, { designation, reporting_manager_id: reportingManagerId || null });
        setEmployees(current => current.map(item => item.id === selectedEmployee.id ? { ...item, designation, reporting_manager_id: reportingManagerId || null } : item));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to save employee details.');
        return;
      }
    }
    setStep(current => Math.min(STEPS.length - 1, current + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generate = async () => {
    if (!selectedEmployee) return;
    setSaving(true);
    setError('');
    try {
      const letter = isEdit && existingLetter
        ? await updateEmployeeLetter(existingLetter.id, { extra_fields: extra, rendered_text: renderedText })
        : await createEmployeeLetter({
            employee_id: selectedEmployee.id,
            letter_type: template.letter_type,
            extra_fields: extra,
            rendered_text: renderedText,
            status: 'Generated',
            generated_by_name: 'CRM Admin',
          }, 'CRM Admin');
      setGeneratedLetter({ ...letter, employee: selectedEmployee });
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to ${isEdit ? 'update' : 'generate'} the letter.`);
    } finally {
      setSaving(false);
    }
  };

  const buildPdf = async () => {
    if (!documentRef.current) return null;
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
    const pages = Array.from(documentRef.current.querySelectorAll<HTMLElement>('[data-pdf-page]'));
    if (!pages.length) return null;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    documentRef.current.classList.add('letter-pdf-capture');
    try {
      await document.fonts.ready;
      for (let index = 0; index < pages.length; index += 1) {
        const canvas = await html2canvas(pages[index], { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, windowWidth: 794 });
        if (index > 0) pdf.addPage('a4', 'portrait');
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
    } finally {
      documentRef.current.classList.remove('letter-pdf-capture');
    }
    pdf.setProperties({ title: `${generatedLetter?.letter_number} - ${selectedEmployee?.full_name}`, subject: template.label, author: 'PlanMyBaraat', creator: 'PlanMyBaraat CRM' });
    return pdf;
  };

  const downloadPdf = async () => {
    if (!generatedLetter || !selectedEmployee) return;
    setPdfBusy('download');
    try {
      const pdf = await buildPdf();
      if (!pdf) return;
      pdf.save(`${generatedLetter.letter_number}-${selectedEmployee.full_name.replace(/[^a-z0-9]+/gi, '-')}.pdf`);
      const blob = pdf.output('blob');
      const { crmSupabase } = await import('../../../lib/supabase-crm');
      const path = `employee-letters/${selectedEmployee.id}/${generatedLetter.letter_number}.pdf`;
      const { error: uploadError } = await crmSupabase.storage.from('crm-files').upload(path, blob, { upsert: true, contentType: 'application/pdf' });
      if (!uploadError) {
        await updateEmployeeLetterFile(generatedLetter.id, path);
        const signedUrl = await getPrivateCrmFileUrl(path);
        setGeneratedLetter(current => current ? { ...current, file_url: signedUrl } : current);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF export failed.');
    } finally {
      setPdfBusy('');
    }
  };

  const printPdf = () => window.print();

  const emailLetter = () => {
    if (!generatedLetter || !selectedEmployee) return;
    const subject = encodeURIComponent(`${generatedLetter.letter_number} | ${template.label} — PlanMyBaraat`);
    const body = encodeURIComponent(`Dear ${selectedEmployee.full_name},\n\nPlease find attached your ${template.label.toLowerCase()} (${generatedLetter.letter_number}).\n\nWarm regards,\nHuman Resources\nPlanMyBaraat`);
    window.location.href = `mailto:${selectedEmployee.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-5">
          {STEPS.map(({ label, icon: StepIcon }, index) => (
            <button
              key={label}
              type="button"
              onClick={() => ((index < step && !(isEdit && index === 0)) ? setStep(index) : null)}
              disabled={index > step || (isEdit && index === 0)}
              className={`group flex min-w-0 items-center gap-2 rounded-xl px-2 py-2.5 text-left transition-colors sm:px-3 ${index === step ? 'bg-gray-950 text-white' : index < step ? 'text-gray-900 hover:bg-gray-50' : 'text-gray-400'}`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${index === step ? 'bg-red-600 text-white' : index < step ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                {index < step ? <Check size={14} /> : <StepIcon size={14} />}
              </span>
              <span>
                <span className="block text-[9px] font-bold uppercase tracking-wider opacity-60">0{index + 1}</span>
                <span className="block text-xs font-bold">{label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 sm:px-7">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600"><Icon size={17} /></span>
          <div><p className="text-sm font-black text-gray-950">{template.label}</p><p className="text-xs text-gray-400">{template.description}</p></div>
        </div>

        <div className="p-5 sm:p-7 lg:p-9">
          {step === 0 && (
            <>
              <p className="mb-6 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">01 / Select employee</p>
              {!creatingNew ? (
                <>
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, employee ID or department..." className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm focus:border-gray-400 focus:outline-none" />
                    </div>
                    <button type="button" onClick={startCreateEmployee} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><Plus size={15} /> Create new employee</button>
                  </div>
                  {loadingEmployees ? (
                    <p className="py-10 text-center text-sm text-gray-400">Loading employees...</p>
                  ) : filteredEmployees.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-xs text-gray-400">No employees found. Create one to continue.</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredEmployees.map(item => (
                        <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`rounded-2xl border p-4 text-left transition ${selectedId === item.id ? 'border-red-500 bg-red-50/40 ring-1 ring-red-500' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-sm font-black text-gray-500">
                              {item.photo_url ? <img src={item.photo_url} alt={item.full_name} className="h-full w-full object-cover" /> : item.full_name.slice(0, 1).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-gray-950">{item.full_name}</p>
                              <p className="truncate text-[11px] text-gray-400">{item.employee_code} · {item.department}</p>
                            </div>
                          </div>
                          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.hr_lifecycle_status || 'Active'}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5">
                  <p className="mb-4 text-sm font-black text-gray-950">Create new employee</p>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Full name" required><input value={newEmployee?.full_name || ''} onChange={e => setNewEmployee(cur => cur ? { ...cur, full_name: e.target.value } : cur)} /></Field>
                    <Field label="Mobile" required><input value={newEmployee?.mobile || ''} onChange={e => setNewEmployee(cur => cur ? { ...cur, mobile: e.target.value } : cur)} /></Field>
                    <Field label="Email"><input type="email" value={newEmployee?.email || ''} onChange={e => setNewEmployee(cur => cur ? { ...cur, email: e.target.value } : cur)} /></Field>
                    <Field label="Job title" required><input value={newEmployee?.job_title || ''} onChange={e => setNewEmployee(cur => cur ? { ...cur, job_title: e.target.value } : cur)} /></Field>
                    <Field label="Department" required>
                      <select value={newEmployee?.department || ''} onChange={e => setNewEmployee(cur => cur ? { ...cur, department: e.target.value } : cur)}>
                        {HR_DEPARTMENTS.map(dep => <option key={dep}>{dep}</option>)}
                      </select>
                    </Field>
                    <Field label="Joining date" required><input type="date" value={newEmployee?.joining_date || ''} onChange={e => setNewEmployee(cur => cur ? { ...cur, joining_date: e.target.value } : cur)} /></Field>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button type="button" onClick={saveNewEmployee} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-60">{saving ? 'Creating...' : 'Create & select'}</button>
                    <button type="button" onClick={() => { setCreatingNew(false); setNewEmployee(null); }} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 1 && !selectedEmployee && loadingEmployees && (
            <p className="py-10 text-center text-sm text-gray-400">Loading employee...</p>
          )}

          {step === 1 && selectedEmployee && (
            <>
              <p className="mb-6 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">02 / Employee information</p>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gray-100 text-2xl font-black text-gray-400">
                    {selectedEmployee.photo_url ? <img src={selectedEmployee.photo_url} alt={selectedEmployee.full_name} className="h-full w-full object-cover" /> : selectedEmployee.full_name.slice(0, 1).toUpperCase()}
                  </span>
                  <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={e => handlePhoto(e.target.files?.[0])} />
                  <button type="button" onClick={() => photoInputRef.current?.click()} disabled={photoBusy} className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 hover:underline disabled:opacity-60"><Camera size={12} /> {photoBusy ? 'Uploading...' : 'Upload photo'}</button>
                </div>
                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Employee ID"><input value={selectedEmployee.employee_code} readOnly className="bg-gray-50 font-mono font-bold" /></Field>
                  <Field label="Employee name"><input value={selectedEmployee.full_name} readOnly className="bg-gray-50" /></Field>
                  <Field label="Department"><input value={selectedEmployee.department} readOnly className="bg-gray-50" /></Field>
                  <Field label="Designation" hint="Used in every generated letter">
                    <input value={designation} onChange={e => setDesignation(e.target.value)} />
                  </Field>
                  <Field label="Joining date"><input value={formatAgreementDate(selectedEmployee.joining_date)} readOnly className="bg-gray-50" /></Field>
                  <Field label="Email"><input value={selectedEmployee.email} readOnly className="bg-gray-50" /></Field>
                  <Field label="Phone"><input value={selectedEmployee.mobile} readOnly className="bg-gray-50" /></Field>
                  <Field label="Address" hint="Managed from the Staff module"><input value={selectedEmployee.address} readOnly className="bg-gray-50" /></Field>
                  <Field label="Reporting manager">
                    <select value={reportingManagerId} onChange={e => setReportingManagerId(e.target.value)}>
                      <option value="">Not assigned</option>
                      {employees.filter(item => item.id !== selectedEmployee.id).map(item => <option key={item.id} value={item.id}>{item.full_name}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="mb-6 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">03 / Letter-specific details</p>
              {template.extra_fields.length === 0 ? (
                <div className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50/60 p-4 text-xs text-gray-500"><Info size={15} className="mt-0.5 shrink-0 text-gray-400" /> This letter uses only the employee&apos;s profile information — no extra details needed.</div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {template.extra_fields.map((field: LetterExtraFieldDef) => (
                    <Field key={field.key} label={field.label} required={field.required !== false} hint={field.hint} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                      {field.type === 'textarea' ? (
                        <textarea rows={4} value={String(extra[field.key] ?? '')} onChange={e => setExtra(cur => ({ ...cur, [field.key]: e.target.value }))} />
                      ) : (
                        <input type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'} value={extra[field.key] ?? ''} onChange={e => setExtra(cur => ({ ...cur, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value }))} />
                      )}
                    </Field>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 3 && selectedEmployee && (
            <>
              <p className="mb-6 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">04 / Preview</p>
              <div className="agreement-preview-shell">
                <div className="agreement-preview-toolbar">
                  <div><p>Live letter preview</p><span>This is exactly what will be generated as a PDF.</span></div>
                </div>
                <div className="agreement-preview-scroll">
                  <LetterDocument
                    letter={{
                      id: 'preview', letter_number: existingLetter?.letter_number || 'PMB-HRL-PREVIEW', employee_id: selectedEmployee.id, letter_type: template.letter_type,
                      extra_fields: extra, rendered_text: renderedText, status: 'Generated', file_url: null,
                      generated_by_name: 'CRM Admin', verification_code: existingLetter?.verification_code || '', generated_by: null,
                      created_at: existingLetter?.created_at || new Date().toISOString(), updated_at: new Date().toISOString(), employee: selectedEmployee,
                    }}
                    template={template}
                  />
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <p className="mb-6 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">05 / {isEdit ? 'Save changes' : 'Generate'}</p>
              {!generatedLetter ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                  <p className="text-sm font-bold text-amber-950">{isEdit ? `Ready to update ${template.label}` : `Ready to generate ${template.label}`}</p>
                  <p className="mt-1 text-xs text-amber-800">{isEdit ? 'This will update the letter content in Supabase. The letter number and verification code stay the same — download again to refresh the PDF.' : 'This will allocate a letter number, save it to Supabase and apply any related HR automation.'}</p>
                  <button type="button" onClick={generate} disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"><FileCheck2 size={15} /> {saving ? (isEdit ? 'Saving...' : 'Generating...') : (isEdit ? 'Save changes' : 'Generate letter')}</button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <BadgeCheck size={22} className="text-emerald-600" />
                    <div><p className="text-sm font-black text-emerald-950">{generatedLetter.letter_number} {isEdit ? 'updated successfully' : 'generated successfully'}</p><p className="text-xs text-emerald-700">Saved to Supabase and linked to {selectedEmployee?.full_name}.</p></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={downloadPdf} disabled={pdfBusy === 'download'} className="agreement-action-button bg-gray-950 text-white"><Download size={15} /> {pdfBusy === 'download' ? 'Preparing...' : 'Download PDF'}</button>
                    <button type="button" onClick={printPdf} className="agreement-action-button"><Printer size={15} /> Print</button>
                    <button type="button" onClick={emailLetter} className="agreement-action-button"><Mail size={15} /> Email</button>
                    <button type="button" onClick={() => router.push('/crm/hr/letters')} className="agreement-action-button">Back to Letters</button>
                  </div>
                  <div className="agreement-preview-shell">
                    <div className="agreement-preview-scroll">
                      <LetterDocument ref={documentRef} letter={generatedLetter} template={template} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {error && (
          <div className="mx-5 mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 sm:mx-7 lg:mx-9">
            <CircleAlert size={15} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        {step < 4 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-7 lg:px-9">
            <button type="button" onClick={() => setStep(current => Math.max(isEdit ? 1 : 0, current - 1))} disabled={step === (isEdit ? 1 : 0)} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={15} /> Back</button>
            <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-600">Continue <ChevronRight size={15} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
