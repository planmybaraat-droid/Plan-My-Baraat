'use client';

import type { BusinessProfile, InvoiceRecord } from '../../lib/types';
import { currency, formatInvoiceDate } from '../invoice-config';
import { amountInWordsINR } from '../../lib/number-to-words';

export function PdfText({ value }: { value: string }) {
  const words = String(value || '').split(' ');
  return <span className="invoice-pdf-words">{words.map((word, index) => <span className="invoice-pdf-token" key={`${word}-${index}`}><span className="invoice-pdf-word">{word}</span>{index < words.length - 1 && <span aria-hidden="true" className="invoice-pdf-space">&nbsp;</span>}</span>)}</span>;
}

function paginateItems<T>(items: T[]) {
  if (items.length <= 6) return [items];
  if (items.length <= 12) {
    const midpoint = Math.ceil(items.length / 2);
    return [items.slice(0, midpoint), items.slice(midpoint)];
  }
  const pages: T[][] = [];
  let cursor = 0;
  while (items.length - cursor > 6) {
    const remaining = items.length - cursor;
    const size = Math.min(10, remaining - 6);
    pages.push(items.slice(cursor, cursor + size));
    cursor += size;
  }
  pages.push(items.slice(cursor));
  return pages;
}

const invoicePdfDate = (value: string) => formatInvoiceDate(value).replaceAll(' ', '-');
const separated = (value: string) => String(value || '').trim().replaceAll(/\s+/g, ' · ');

function InvoiceHeader({ invoice, isVoucher, page, total }: { invoice: InvoiceRecord; isVoucher: boolean; page: number; total: number }) {
  return <>
    <header className="invoice-doc-header">
      <div><img src="/logo.png" alt="PlanMyBaraat" width={176} height={48} className="invoice-doc-logo" /><p><PdfText value="Luxury Baraat planning & production" /></p></div>
      <div className="invoice-doc-title"><span><PdfText value={invoice.document_type} /></span><h1><PdfText value={isVoucher ? 'Receipt voucher' : 'Invoice'} /></h1><strong>{invoice.invoice_number}{total > 1 ? ` · ${page}/${total}` : ''}</strong></div>
    </header>
    <div className="invoice-doc-accent" />
  </>;
}

function InvoiceFooter({ invoice, qr, page, total }: { invoice: InvoiceRecord; qr: string; page: number; total: number }) {
  const footerText = `System-generated document · Agreement: ${invoice.agreement_number || 'Direct booking'}${total > 1 ? ` · Page ${page}/${total}` : ''}`;
  return <footer className="invoice-doc-footer"><div><strong>PLANMYBARAAT</strong><span>{invoice.invoice_number}</span></div><p><PdfText value={footerText} /></p><div className="invoice-doc-verify">{qr && <img src={qr} alt="Invoice verification QR code" />}<span><PdfText value="Scan to Verify" /></span></div></footer>;
}

export default function InvoiceDocument({ invoice, profile, qr }: { invoice: InvoiceRecord; profile: BusinessProfile; qr: string }) {
  const isVoucher = invoice.document_type === 'Advance Receipt Voucher';
  const lineItems = invoice.line_items || [];
  const itemPages = paginateItems(lineItems);
  const totalPages = itemPages.length;
  const gstPercent = Number(invoice.gst_percent) || 0;

  return <div className="invoice-document" id="invoice-document">
    {itemPages.map((items, pageIndex) => {
      const firstPage = pageIndex === 0;
      const lastPage = pageIndex === totalPages - 1;
      return <section className="invoice-pdf-page" data-pdf-page key={pageIndex}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" className="pdf-watermark-logo" />
        <InvoiceHeader invoice={invoice} isVoucher={isVoucher} page={pageIndex + 1} total={totalPages} />

        {firstPage ? <>
          <section className="invoice-doc-meta-grid">
            <div className="invoice-doc-party"><span><PdfText value="Issued by" /></span><h2><PdfText value={profile.legal_name || profile.trade_name} /></h2>{profile.address && <p><PdfText value={profile.address} /></p>}<p><PdfText value={[profile.city, profile.state, profile.pincode].filter(Boolean).join(' · ')} /></p>{profile.gstin && <p><strong>GSTIN</strong> {profile.gstin}</p>}{profile.pan && <p><strong>PAN</strong> {profile.pan}</p>}</div>
            <div className="invoice-doc-party"><span><PdfText value="Bill to" /></span><h2><PdfText value={invoice.client_name} /></h2>{invoice.billing_address && <p><PdfText value={invoice.billing_address} /></p>}<p><PdfText value={`${invoice.mobile}${invoice.email ? ` · ${invoice.email}` : ''}`} /></p>{invoice.client_gstin && <p><strong>GSTIN</strong> {invoice.client_gstin}</p>}</div>
            <dl className="invoice-doc-facts"><div><dt><PdfText value="Issue date" /></dt><dd>{invoicePdfDate(invoice.issue_date)}</dd></div><div><dt><PdfText value="Due date" /></dt><dd>{invoicePdfDate(invoice.due_date) || 'On-receipt'}</dd></div><div><dt>Agreement</dt><dd>{invoice.agreement_number || 'Direct'}</dd></div><div><dt><PdfText value="Place of supply" /></dt><dd><PdfText value={`${invoice.place_of_supply || ''}${invoice.state_code ? ` · (${invoice.state_code})` : ''}`.trim()} /></dd></div></dl>
          </section>
          <section className="invoice-doc-event"><div><span>Celebration</span><strong><PdfText value={invoice.package_name} /></strong></div><div><span><PdfText value="Event date" /></span><strong>{invoicePdfDate(invoice.event_date)}</strong></div><div><span>Venue</span><strong><PdfText value={invoice.venue || 'To-be-confirmed'} /></strong></div></section>
        </> : <div className="invoice-doc-continuation"><span><PdfText value="Line items continued" /></span><strong><PdfText value={invoice.client_name} /></strong></div>}

        <section className="invoice-doc-items">
          <div className="invoice-doc-item-head"><span>#</span><span>Description</span><span>SAC</span><span>Qty</span><span>Rate</span><span>Amount</span></div>
          {items.map((item) => {
            const itemIndex = lineItems.findIndex((candidate) => candidate.id === item.id);
            return <div className="invoice-doc-item" key={item.id}><span>{String(itemIndex + 1).padStart(2, '0')}</span><span><strong><PdfText value={item.description} /></strong></span><span>{item.sac_code || '—'}</span><span>{item.quantity}</span><span>{currency(item.rate)}</span><span>{currency(item.taxable_amount)}</span></div>;
          })}
        </section>

        {lastPage && <>
          <section className="invoice-doc-settlement">
            <div className="invoice-doc-payment-info"><span><PdfText value="Payment details" /></span>{profile.bank_name || profile.upi_id ? <><h3><PdfText value={profile.bank_name || 'UPI payment'} /></h3>{profile.account_name && <p><strong><PdfText value="Account name" /></strong> <PdfText value={profile.account_name} /></p>}{profile.account_number && <p><strong>Account</strong> {profile.account_number}</p>}{profile.ifsc && <p><strong>IFSC</strong> {profile.ifsc}</p>}{profile.upi_id && <p><strong>UPI</strong> {profile.upi_id}</p>}</> : <><h3><PdfText value="Payment details on request" /></h3><p>Approved account · Contact PlanMyBaraat coordinator</p></>}</div>
            <div className="invoice-doc-totals"><div><span>Subtotal</span><strong>{currency(invoice.subtotal)}</strong></div>{invoice.discount > 0 && <div><span>Discount</span><strong>- {currency(invoice.discount)}</strong></div>}<div><span>Taxable</span><strong>{currency(invoice.taxable_value)}</strong></div>{gstPercent > 0 && (invoice.igst_amount > 0 ? <div><span>IGST ({gstPercent}%)</span><strong>{currency(invoice.igst_amount)}</strong></div> : <><div><span>CGST ({gstPercent / 2}%)</span><strong>{currency(invoice.cgst_amount)}</strong></div><div><span>SGST ({gstPercent / 2}%)</span><strong>{currency(invoice.sgst_amount)}</strong></div></>)}<div className="invoice-doc-grand-total"><span>Total</span><strong>{currency(invoice.total_amount)}</strong></div><div className="invoice-doc-words"><span>Amount in words</span><strong>{amountInWordsINR(invoice.total_amount)}</strong></div><div><span>Paid</span><strong className="invoice-doc-paid">{currency(invoice.amount_paid)}</strong></div><div className="invoice-doc-balance"><span>Balance</span><strong>{currency(invoice.balance_due)}</strong></div></div>
          </section>
          {(invoice.client_note || invoice.payment_terms) && <section className="invoice-doc-notes">{invoice.client_note && <div><span>Note</span><p><PdfText value={invoice.client_note} /></p></div>}{invoice.payment_terms && <div><span><PdfText value="Payment terms" /></span><p><PdfText value={invoice.payment_terms} /></p></div>}</section>}
          <section className="invoice-doc-signoff"><div><span><PdfText value="Prepared by" /></span><strong><PdfText value={invoice.created_by_name} /></strong><p>For · {profile.trade_name}</p></div><div><i><img src="/agreement-signature.png" alt="Authorized signature" className="invoice-doc-signature-stamp" /></i><strong>{separated(profile.authorized_signatory || 'Authorized Signatory')}</strong><p>Authorized · signatory</p></div></section>
        </>}

        <InvoiceFooter invoice={invoice} qr={qr} page={pageIndex + 1} total={totalPages} />
      </section>;
    })}
  </div>;
}
