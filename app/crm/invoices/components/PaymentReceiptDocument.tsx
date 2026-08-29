'use client';

import type { BusinessProfile, InvoicePayment, InvoiceRecord } from '../../lib/types';
import { currency, formatInvoiceDate } from '../invoice-config';
import { amountInWordsINR } from '../../lib/number-to-words';
import { PdfText } from './InvoiceDocument';

export default function PaymentReceiptDocument({ invoice, payment, profile }: { invoice: InvoiceRecord; payment: InvoicePayment; profile: BusinessProfile }) {
  return <section className="payment-receipt-pdf" id={`payment-receipt-${payment.id}`} data-pdf-page>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/logo.png" alt="" className="pdf-watermark-logo" />
    <header><img src="/logo.png" alt="PlanMyBaraat" width={170} height={46} /><div><span><PdfText value="Payment receipt" /></span><strong>{payment.receipt_number}</strong></div></header>
    <div className="payment-receipt-rule" />
    <div className="payment-receipt-hero"><span><PdfText value="Amount received" /></span><h1>{currency(payment.amount)}</h1><p className="payment-receipt-words"><PdfText value={amountInWordsINR(payment.amount)} /></p><p><PdfText value="Received with thanks from" /> <strong><PdfText value={invoice.client_name} /></strong></p></div>
    <dl><div><dt><PdfText value="Payment date" /></dt><dd><PdfText value={formatInvoiceDate(payment.payment_date)} /></dd></div><div><dt><PdfText value="Payment mode" /></dt><dd><PdfText value={payment.payment_mode} /></dd></div><div><dt><PdfText value="Transaction reference" /></dt><dd>{payment.transaction_reference || '—'}</dd></div><div><dt><PdfText value="Against invoice" /></dt><dd>{invoice.invoice_number}</dd></div><div><dt>Agreement</dt><dd>{invoice.agreement_number || '—'}</dd></div><div><dt>Event</dt><dd><PdfText value={`${formatInvoiceDate(invoice.event_date)} · ${invoice.package_name}`} /></dd></div></dl>
    {payment.notes && <div className="payment-receipt-note"><span>Note</span><p><PdfText value={payment.notes} /></p></div>}
    <footer><div><strong><PdfText value={profile.legal_name || profile.trade_name} /></strong><p><PdfText value={[profile.city, profile.state].filter(Boolean).join(', ')} /></p>{profile.gstin && <p>GSTIN {profile.gstin}</p>}</div><div><i /><strong><PdfText value={profile.authorized_signatory || 'Authorized Signatory'} /></strong><p><PdfText value={`For ${profile.trade_name}`} /></p></div></footer>
  </section>;
}
