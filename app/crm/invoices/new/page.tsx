'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileCheck2, Plus, Save, Trash2 } from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import { useSidebar } from '../../sidebar-context';
import { getAgreementById, getAgreements } from '../../lib/supabase-crm';
import type { AgreementRecord, InvoiceFormData, InvoiceLineItem } from '../../lib/types';
import { createInvoice, getInvoiceById, getNextInvoiceNumber, updateInvoice } from '../invoice-data';
import { currency, getBusinessProfile, INVOICE_DOCUMENT_TYPES, invoiceAmounts, invoiceDraftFromAgreement } from '../invoice-config';

export default function NewInvoicePage() {
  const { open } = useSidebar();
  const router = useRouter();
  const [agreements, setAgreements] = useState<AgreementRecord[]>([]);
  const [selectedAgreement, setSelectedAgreement] = useState('');
  const [data, setData] = useState<InvoiceFormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');
  const profile = useMemo(() => getBusinessProfile(), []);

  useEffect(() => {
    async function start() {
      const list = await getAgreements();
      setAgreements(list);
      const query = new URLSearchParams(window.location.search);
      const editId = query.get('edit') || '';
      if (editId) {
        const invoice = await getInvoiceById(editId);
        if (!invoice) { setError('Invoice could not be loaded.'); return; }
        setEditingId(editId); setSelectedAgreement(invoice.agreement_id); setData(invoice); return;
      }
      const agreementId = query.get('agreementId') || '';
      if (agreementId) await chooseAgreement(agreementId);
    }
    start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recalculate = (current: InvoiceFormData): InvoiceFormData => {
    const paid = current.payments.reduce((sum, payment) => sum + payment.amount, 0) || current.amount_paid;
    const amounts = invoiceAmounts(current.line_items, current.discount, current.gst_percent, current.state_code, profile.state_code, paid);
    return { ...current, subtotal: amounts.subtotal, taxable_value: amounts.taxableValue, cgst_amount: amounts.cgstAmount, sgst_amount: amounts.sgstAmount, igst_amount: amounts.igstAmount, total_amount: amounts.totalAmount, amount_paid: paid, balance_due: amounts.balanceDue, line_items: current.line_items.map(item => ({ ...item, taxable_amount: Math.round(item.quantity * item.rate * 100) / 100 })) };
  };

  const chooseAgreement = async (id: string) => {
    setSelectedAgreement(id);
    if (!id) { setData(null); return; }
    const [agreement, number] = await Promise.all([getAgreementById(id), getNextInvoiceNumber()]);
    if (!agreement) { setError('Agreement could not be loaded.'); return; }
    setData(invoiceDraftFromAgreement(agreement, number, profile));
    setError('');
  };

  const update = <K extends keyof InvoiceFormData>(key: K, value: InvoiceFormData[K]) => setData(current => current ? recalculate({ ...current, [key]: value }) : current);
  const updateItem = (id: string, patch: Partial<InvoiceLineItem>) => setData(current => current ? recalculate({ ...current, line_items: current.line_items.map(item => item.id === id ? { ...item, ...patch } : item) }) : current);
  const addItem = () => setData(current => current ? recalculate({ ...current, line_items: [...current.line_items, { id: `item-${Date.now()}`, description: '', sac_code: profile.default_sac_code, quantity: 1, rate: 0, taxable_amount: 0 }] }) : current);
  const removeItem = (id: string) => setData(current => current && current.line_items.length > 1 ? recalculate({ ...current, line_items: current.line_items.filter(item => item.id !== id) }) : current);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!data) return;
    if (!data.client_name.trim() || !data.issue_date || data.line_items.some(item => !item.description.trim() || item.quantity <= 0)) {
      setError('Complete the client, date and service line items before creating the invoice.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSaving(true);
    try {
      const invoice = editingId ? await updateInvoice(editingId, recalculate(data)) : await createInvoice(recalculate(data));
      router.push(`/crm/invoices/${invoice.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Invoice could not be created.');
      setSaving(false);
    }
  };

  return (
    <>
      <CrmHeader title={editingId ? 'Edit Invoice' : 'Create Invoice'} subtitle={editingId ? `Update ${data?.invoice_number || 'invoice'} without changing its number` : 'Generate a commercial document from a confirmed Baraat Management Contract'} onMenuClick={open}
        actions={<button onClick={() => router.back()} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-600"><ArrowLeft size={15} /> Back</button>} />
      <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600"><FileCheck2 size={20} /></div><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-600">01 / Agreement source</p><h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">Start from an approved agreement</h2><p className="mt-1 text-sm text-gray-400">Client, event, package, GST and recorded payments are imported automatically.</p></div></div>
          <label className="agreement-field mt-5"><span>Baraat Management Contract</span><select value={selectedAgreement} disabled={Boolean(editingId)} onChange={e => chooseAgreement(e.target.value)}><option value="">Select an agreement</option>{agreements.map(item => <option key={item.id} value={item.id}>{item.agreement_number} · {item.client_name} · {item.package_name}</option>)}</select></label>
        </div>

        {!data ? <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center"><p className="font-extrabold text-gray-800">Select an agreement to continue</p><p className="mt-1 text-sm text-gray-400">Invoices remain linked to the original agreement for traceability.</p></div> : (
          <form onSubmit={submit} className="space-y-5">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-600">02 / Document control</p><h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">Invoice identity and dates</h2></div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <label className="agreement-field"><span>Invoice number</span><input value={data.invoice_number} readOnly className="bg-gray-50 font-mono font-bold" /></label>
                <label className="agreement-field"><span>Document type</span><select value={data.document_type} onChange={e => update('document_type', e.target.value as InvoiceFormData['document_type'])}>{INVOICE_DOCUMENT_TYPES.map(item => <option key={item}>{item}</option>)}</select></label>
                <label className="agreement-field"><span>Issue date</span><input type="date" value={data.issue_date} onChange={e => update('issue_date', e.target.value)} /></label>
                <label className="agreement-field"><span>Due date</span><input type="date" value={data.due_date} onChange={e => update('due_date', e.target.value)} /></label>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-600">03 / Bill to</p><h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">Client and place of supply</h2></div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <label className="agreement-field"><span>Client name</span><input value={data.client_name} onChange={e => update('client_name', e.target.value)} /></label>
                <label className="agreement-field"><span>Mobile</span><input value={data.mobile} onChange={e => update('mobile', e.target.value)} /></label>
                <label className="agreement-field"><span>Email</span><input type="email" value={data.email} onChange={e => update('email', e.target.value)} /></label>
                <label className="agreement-field sm:col-span-2"><span>Billing address</span><input value={data.billing_address} onChange={e => update('billing_address', e.target.value)} /></label>
                <label className="agreement-field"><span>Client GSTIN</span><input value={data.client_gstin} onChange={e => update('client_gstin', e.target.value.toUpperCase())} placeholder="Optional for unregistered client" /></label>
                <label className="agreement-field"><span>Place of supply</span><input value={data.place_of_supply} onChange={e => update('place_of_supply', e.target.value)} /></label>
                <label className="agreement-field"><span>State code</span><input value={data.state_code} onChange={e => update('state_code', e.target.value)} /></label>
                <label className="agreement-field"><span>Event date</span><input type="date" value={data.event_date} onChange={e => update('event_date', e.target.value)} /></label>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5 sm:p-6"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-600">04 / Services</p><h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">Taxable line items</h2></div><button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:border-red-200 hover:text-red-600"><Plus size={14} /> Add item</button></div>
              <div className="divide-y divide-gray-100">{data.line_items.map((item, index) => <div key={item.id} className="grid gap-4 p-5 sm:grid-cols-12 sm:p-6">
                <label className="agreement-field sm:col-span-5"><span>Service description</span><input value={item.description} onChange={e => updateItem(item.id, { description: e.target.value })} placeholder="Baraat production service" /></label>
                <label className="agreement-field sm:col-span-2"><span>SAC</span><input value={item.sac_code} onChange={e => updateItem(item.id, { sac_code: e.target.value })} /></label>
                <label className="agreement-field sm:col-span-2"><span>Quantity</span><input type="number" min="0.01" step="0.01" value={item.quantity} onChange={e => updateItem(item.id, { quantity: Number(e.target.value) })} /></label>
                <label className="agreement-field sm:col-span-2"><span>Rate</span><input type="number" min="0" step="0.01" value={item.rate} onChange={e => updateItem(item.id, { rate: Number(e.target.value) })} /></label>
                <div className="flex items-end justify-between sm:col-span-1"><div className="pb-3 text-xs font-black text-gray-950 sm:hidden">{currency(item.taxable_amount)}</div><button type="button" title={`Remove item ${index + 1}`} onClick={() => removeItem(item.id)} disabled={data.line_items.length === 1} className="mb-1 rounded-lg p-2 text-gray-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-20"><Trash2 size={16} /></button></div>
              </div>)}</div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[1fr_420px]">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-600">05 / Notes</p><label className="agreement-field mt-5"><span>Client note</span><textarea rows={4} value={data.client_note} onChange={e => update('client_note', e.target.value)} placeholder="Optional note visible on the invoice" /></label><label className="agreement-field mt-5"><span>Payment terms</span><textarea rows={4} value={data.payment_terms} onChange={e => update('payment_terms', e.target.value)} /></label></div>
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 text-white shadow-sm"><div className="p-5 sm:p-6"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-400">Commercial summary</p><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between text-gray-400"><span>Subtotal</span><strong className="text-white">{currency(data.subtotal)}</strong></div><label className="flex items-center justify-between gap-4 text-gray-400"><span>Discount</span><input type="number" min="0" value={data.discount} onChange={e => update('discount', Number(e.target.value))} className="w-32 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-right font-bold text-white outline-none" /></label><label className="flex items-center justify-between gap-4 text-gray-400"><span>GST</span><div className="flex items-center gap-2"><input type="number" min="0" max="100" value={data.gst_percent} onChange={e => update('gst_percent', Number(e.target.value))} className="w-20 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-right font-bold text-white outline-none" /><span>%</span></div></label><div className="flex justify-between border-t border-white/10 pt-3 text-gray-400"><span>Taxable value</span><strong className="text-white">{currency(data.taxable_value)}</strong></div>{data.igst_amount > 0 ? <div className="flex justify-between text-gray-400"><span>IGST</span><strong className="text-white">{currency(data.igst_amount)}</strong></div> : <><div className="flex justify-between text-gray-400"><span>CGST</span><strong className="text-white">{currency(data.cgst_amount)}</strong></div><div className="flex justify-between text-gray-400"><span>SGST</span><strong className="text-white">{currency(data.sgst_amount)}</strong></div></>}</div></div><div className="bg-red-600 p-5 sm:p-6"><div className="flex items-end justify-between gap-4"><span className="text-xs font-bold uppercase tracking-widest text-red-100">Invoice total</span><strong className="text-2xl font-black">{currency(data.total_amount)}</strong></div><div className="mt-3 flex justify-between text-xs text-red-100"><span>Recorded against agreement</span><strong>{currency(data.amount_paid)}</strong></div><div className="mt-2 flex justify-between text-xs text-white"><span>Balance due</span><strong>{currency(data.balance_due)}</strong></div></div></div>
            </section>

            {!profile.gstin && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-800">Business GSTIN and billing details are not configured yet. You can create a draft now, but complete Billing Settings before issuing a tax invoice.</div>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => router.back()} className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-600">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"><Save size={16} /> {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create invoice draft'}</button></div>
          </form>
        )}
      </div>
    </>
  );
}
