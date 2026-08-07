'use client';

import Image from 'next/image';
import type { BusinessProfile, InvoicePayment, InvoiceRecord } from '../../lib/types';
import { currency, formatInvoiceDate } from '../invoice-config';

export default function PaymentReceiptDocument({ invoice, payment, profile }: { invoice: InvoiceRecord; payment: InvoicePayment; profile: BusinessProfile }) {
  return <section className="payment-receipt-pdf" id={`payment-receipt-${payment.id}`}>
    <header><Image src="/logo.png" alt="PlanMyBaraat" width={170} height={46} /><div><span>Payment receipt</span><strong>{payment.receipt_number}</strong></div></header>
    <div className="payment-receipt-rule" />
    <div className="payment-receipt-hero"><span>Amount received</span><h1>{currency(payment.amount)}</h1><p>Received with thanks from <strong>{invoice.client_name}</strong></p></div>
    <dl><div><dt>Payment date</dt><dd>{formatInvoiceDate(payment.payment_date)}</dd></div><div><dt>Payment mode</dt><dd>{payment.payment_mode}</dd></div><div><dt>Transaction reference</dt><dd>{payment.transaction_reference || '—'}</dd></div><div><dt>Against invoice</dt><dd>{invoice.invoice_number}</dd></div><div><dt>Agreement</dt><dd>{invoice.agreement_number || '—'}</dd></div><div><dt>Event</dt><dd>{formatInvoiceDate(invoice.event_date)} · {invoice.package_name}</dd></div></dl>
    {payment.notes && <div className="payment-receipt-note"><span>Note</span><p>{payment.notes}</p></div>}
    <footer><div><strong>{profile.legal_name || profile.trade_name}</strong><p>{[profile.city, profile.state].filter(Boolean).join(', ')}</p>{profile.gstin && <p>GSTIN {profile.gstin}</p>}</div><div><i /><strong>{profile.authorized_signatory || 'Authorized Signatory'}</strong><p>For {profile.trade_name}</p></div></footer>
  </section>;
}