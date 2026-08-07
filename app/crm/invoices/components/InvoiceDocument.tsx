'use client';

import Image from 'next/image';
import type { BusinessProfile, InvoiceRecord } from '../../lib/types';
import { currency, formatInvoiceDate } from '../invoice-config';

export default function InvoiceDocument({ invoice, profile, qr }: { invoice: InvoiceRecord; profile: BusinessProfile; qr: string }) {
  const isVoucher = invoice.document_type === 'Advance Receipt Voucher';
  return (
    <div className="invoice-document" id="invoice-document">
      <section className="invoice-pdf-page">
        <header className="invoice-doc-header">
          <div><Image src="/logo.png" alt="PlanMyBaraat" width={176} height={48} className="invoice-doc-logo" priority /><p>Luxury Baraat planning & production</p></div>
          <div className="invoice-doc-title"><span>{invoice.document_type}</span><h1>{isVoucher ? 'Receipt voucher' : 'Invoice'}</h1><strong>{invoice.invoice_number}</strong></div>
        </header>

        <div className="invoice-doc-accent" />

        <section className="invoice-doc-meta-grid">
          <div className="invoice-doc-party">
            <span>Issued by</span><h2>{profile.legal_name || profile.trade_name}</h2>
            {profile.address && <p>{profile.address}</p>}<p>{[profile.city, profile.state, profile.pincode].filter(Boolean).join(', ')}</p>
            {profile.gstin && <p><strong>GSTIN</strong> {profile.gstin}</p>}{profile.pan && <p><strong>PAN</strong> {profile.pan}</p>}
          </div>
          <div className="invoice-doc-party">
            <span>Bill to</span><h2>{invoice.client_name}</h2>
            {invoice.billing_address && <p>{invoice.billing_address}</p>}<p>{invoice.mobile}{invoice.email ? ` · ${invoice.email}` : ''}</p>
            {invoice.client_gstin && <p><strong>GSTIN</strong> {invoice.client_gstin}</p>}
          </div>
          <dl className="invoice-doc-facts">
            <div><dt>Issue date</dt><dd>{formatInvoiceDate(invoice.issue_date)}</dd></div><div><dt>Due date</dt><dd>{formatInvoiceDate(invoice.due_date) || 'On receipt'}</dd></div><div><dt>Agreement</dt><dd>{invoice.agreement_number || 'Direct'}</dd></div><div><dt>Place of supply</dt><dd>{invoice.place_of_supply} {invoice.state_code ? `(${invoice.state_code})` : ''}</dd></div>
          </dl>
        </section>

        <section className="invoice-doc-event"><div><span>Celebration</span><strong>{invoice.package_name}</strong></div><div><span>Event date</span><strong>{formatInvoiceDate(invoice.event_date)}</strong></div><div><span>Venue</span><strong>{invoice.venue || 'To be confirmed'}</strong></div></section>

        <section className="invoice-doc-items">
          <div className="invoice-doc-item-head"><span>#</span><span>Description</span><span>SAC</span><span>Qty</span><span>Rate</span><span>Amount</span></div>
          {invoice.line_items.map((item, index) => <div className="invoice-doc-item" key={item.id}><span>{String(index + 1).padStart(2, '0')}</span><span><strong>{item.description}</strong></span><span>{item.sac_code || '—'}</span><span>{item.quantity}</span><span>{currency(item.rate)}</span><span>{currency(item.taxable_amount)}</span></div>)}
        </section>

        <section className="invoice-doc-settlement">
          <div className="invoice-doc-payment-info">
            <span>Payment details</span>
            {profile.bank_name || profile.upi_id ? <><h3>{profile.bank_name || 'UPI payment'}</h3>{profile.account_name && <p><strong>Account name</strong> {profile.account_name}</p>}{profile.account_number && <p><strong>Account</strong> {profile.account_number}</p>}{profile.ifsc && <p><strong>IFSC</strong> {profile.ifsc}</p>}{profile.upi_id && <p><strong>UPI</strong> {profile.upi_id}</p>}</> : <><h3>Payment details on request</h3><p>Contact the PlanMyBaraat coordinator for the approved payment account.</p></>}
          </div>
          <div className="invoice-doc-totals">
            <div><span>Subtotal</span><strong>{currency(invoice.subtotal)}</strong></div>{invoice.discount > 0 && <div><span>Discount</span><strong>- {currency(invoice.discount)}</strong></div>}<div><span>Taxable value</span><strong>{currency(invoice.taxable_value)}</strong></div>{invoice.igst_amount > 0 ? <div><span>IGST ({invoice.gst_percent}%)</span><strong>{currency(invoice.igst_amount)}</strong></div> : <><div><span>CGST ({invoice.gst_percent / 2}%)</span><strong>{currency(invoice.cgst_amount)}</strong></div><div><span>SGST ({invoice.gst_percent / 2}%)</span><strong>{currency(invoice.sgst_amount)}</strong></div></>}<div className="invoice-doc-grand-total"><span>Total</span><strong>{currency(invoice.total_amount)}</strong></div><div><span>Amount paid</span><strong className="invoice-doc-paid">{currency(invoice.amount_paid)}</strong></div><div className="invoice-doc-balance"><span>Balance due</span><strong>{currency(invoice.balance_due)}</strong></div>
          </div>
        </section>

        {(invoice.client_note || invoice.payment_terms) && <section className="invoice-doc-notes">{invoice.client_note && <div><span>Note</span><p>{invoice.client_note}</p></div>}{invoice.payment_terms && <div><span>Payment terms</span><p>{invoice.payment_terms}</p></div>}</section>}

        <section className="invoice-doc-signoff"><div><span>Prepared by</span><strong>{invoice.created_by_name}</strong><p>For {profile.trade_name}</p></div><div><i>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/agreement-signature.png" alt="Authorized signature" className="invoice-doc-signature-stamp" /></i><strong>{profile.authorized_signatory || 'Authorized Signatory'}</strong><p>Authorized signatory</p></div></section>

        <footer className="invoice-doc-footer"><div><strong>PLANMYBARAAT</strong><span>{invoice.invoice_number}</span></div><p>This is a system-generated commercial document linked to {invoice.agreement_number || 'the client booking'}.</p><div className="invoice-doc-verify">{qr && <img src={qr} alt="Invoice verification QR code" />}<span>Scan to Verify</span></div></footer>
      </section>
    </div>
  );
}