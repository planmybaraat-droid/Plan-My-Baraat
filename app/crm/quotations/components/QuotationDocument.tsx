'use client';

import { forwardRef, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import type { QuotationRecord, QuotationService } from '../../lib/types';
import { formatQuotationDate, quotationCurrency } from '../quotation-config';
import { SERVICE_AVAILABILITY_NOTE } from '../../agreements/agreement-config';

// Empty optional fields never create labels or gaps in the client document.
const hasText = (value?: string | null) => Boolean(value?.trim());

function Header({ quotation }: { quotation: QuotationRecord }) {
  return <header className="quotation-doc-header">
    {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/logo.png" alt="PlanMyBaraat" />
    <div><span>Client Quotation</span><strong>{quotation.quotation_number}</strong></div>
  </header>;
}

function Footer({ quotation, page, total, qr }: { quotation: QuotationRecord; page: number; total: number; qr: string }) {
  return <footer className="quotation-doc-footer">
    <div><strong>PLANMYBARAAT</strong><span>Luxury Baraat planning & production</span></div>
    <div><span>{quotation.quotation_number}</span><span>Generated {formatQuotationDate(quotation.created_date)}</span></div>
    <p>Page {page} of {total}</p>
    <div className="quotation-doc-verify">{qr ? <>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={qr} alt="Quotation QR" /><small>Scan to Verify</small></> : null}</div>
  </footer>;
}

function Page({ quotation, page, total, qr, children }: { quotation: QuotationRecord; page: number; total: number; qr: string; children: React.ReactNode }) {
  return <section className="quotation-pdf-page" data-pdf-page><Header quotation={quotation} /><main>{children}</main><Footer quotation={quotation} page={page} total={total} qr={qr} /></section>;
}

function ServiceCard({ service, number, pricingMode }: { service: QuotationService; number: number; pricingMode: QuotationRecord['pricing_mode'] }) {
  const showPrice = pricingMode === 'Detailed Pricing' || service.is_addon;
  return <article className="quotation-doc-service">
    <span className="quotation-doc-service-index">{String(number).padStart(2, '0')}</span>
    <div className="quotation-doc-service-body">
      <div className="quotation-doc-service-title"><h3>{service.name}</h3><span>Quantity {service.quantity}</span></div>
      {SERVICE_AVAILABILITY_NOTE[service.name] && <p className="agreement-doc-service-availability">{SERVICE_AVAILABILITY_NOTE[service.name]}</p>}
      {hasText(service.option) && <p><b>Selected option</b>{service.option.trim()}</p>}
      {hasText(service.color) && <p><b>Colour</b>{service.color.trim()}</p>}
      {hasText(service.decoration) && <p><b>Decoration</b>{service.decoration.trim()}</p>}
      {hasText(service.purpose) && <p><b>Used for</b>{service.purpose.trim()}</p>}
      {service.multi_options?.length > 0 && <p><b>Add-ons</b>{service.multi_options.join(', ')}</p>}
      {hasText(service.customization) && <p><b>Customization</b>{service.customization.trim()}</p>}
      {hasText(service.client_remark) && <p><b>Client remark</b>{service.client_remark.trim()}</p>}
      {hasText(service.special_instructions) && <p><b>Special instructions</b>{service.special_instructions.trim()}</p>}
    </div>
    <div className="quotation-doc-service-price"><small>{showPrice ? (service.is_addon ? 'Add-on' : 'Value') : 'Package'}</small><strong>{showPrice ? quotationCurrency(service.amount) : 'Included'}</strong>{showPrice && service.quantity > 1 && <span>{quotationCurrency(service.unit_price)} each</span>}</div>
  </article>;
}

const QuotationDocument = forwardRef<HTMLDivElement, { quotation: QuotationRecord }>(function QuotationDocument({ quotation }, ref) {
  const [qr, setQr] = useState('');
  const services = (quotation.services || []).filter(service => service.enabled);
  const chunks = useMemo(() => {
    const size = 7;
    return Array.from({ length: Math.max(1, Math.ceil(services.length / size)) }, (_, index) => services.slice(index * size, index * size + size));
  }, [services]);
  const totalPages = chunks.length + 2;

  useEffect(() => {
    const url = typeof window === 'undefined' ? quotation.quotation_number : `${window.location.origin}/verify/${quotation.verification_code}`;
    QRCode.toDataURL(url, { width: 120, margin: 0, color: { dark: '#111111', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [quotation.verification_code, quotation.quotation_number]);

  return <div ref={ref} className="quotation-document">
    <Page quotation={quotation} page={1} total={totalPages} qr={qr}>
      <div className="quotation-doc-kicker">Prepared exclusively for</div>
      <h1>{quotation.client_name}</h1>
      <p className="quotation-doc-lead">A tailored Baraat experience—thoughtfully composed around your celebration, venue and vision.</p>
      <div className="quotation-doc-hero">
        <div><span>Celebration date</span><strong>{formatQuotationDate(quotation.event_date)}</strong></div>
        <div><span>Selected package</span><strong>{quotation.package_name}</strong></div>
        <div className="quotation-doc-hero-value"><span>Quotation value</span><strong>{quotationCurrency(quotation.total_amount)}</strong></div>
      </div>
      <div className="quotation-doc-heading"><span>01</span><div><small>Celebration profile</small><h2>Client & event details</h2></div></div>
      <div className="quotation-doc-details">
        {[['Groom', quotation.groom_name], ['Bride', quotation.bride_name], ['Mobile', quotation.mobile], ['Email', quotation.email], ['Venue', quotation.venue], ['Timing', [quotation.start_time, quotation.end_time].filter(Boolean).join(' – ')], ['Address', quotation.address], ['Sales executive', quotation.sales_executive || quotation.created_by_name]].filter(([, value]) => hasText(value)).map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
      <div className="quotation-doc-validity"><span>Quotation validity</span><strong>Valid until {formatQuotationDate(quotation.valid_until)}</strong><p>Availability and pricing are subject to written booking confirmation.</p></div>
    </Page>

    {chunks.map((chunk, chunkIndex) => <Page key={chunkIndex} quotation={quotation} page={chunkIndex + 2} total={totalPages} qr={qr}>
      <div className="quotation-doc-page-title"><div><small>02 / Proposed experience</small><h2>{chunkIndex ? 'Services continued' : 'Services & add-ons'}</h2><p>Only the services selected for this proposal are shown.</p></div><strong>{services.length} services</strong></div>
      <div className="quotation-doc-services">{chunk.map((service, index) => <ServiceCard key={service.id} service={service} number={chunkIndex * 7 + index + 1} pricingMode={quotation.pricing_mode} />)}</div>
      {chunkIndex === chunks.length - 1 && (hasText(quotation.client_note) || hasText(quotation.special_requirements)) && <div className="quotation-doc-notes">{hasText(quotation.client_note) && <div><span>Client note</span><p>{quotation.client_note.trim()}</p></div>}{hasText(quotation.special_requirements) && <div><span>Special requirements</span><p>{quotation.special_requirements.trim()}</p></div>}</div>}
    </Page>)}

    <Page quotation={quotation} page={totalPages} total={totalPages} qr={qr}>
      <div className="quotation-doc-page-title"><div><small>03 / Commercial summary</small><h2>Investment & next steps</h2><p>A clear summary of the proposed commercial position.</p></div></div>
      <div className="quotation-doc-summary">
        <div><span>Package & enabled add-ons</span><strong>{quotationCurrency(quotation.subtotal)}</strong></div>
        {quotation.discount > 0 && <div><span>Commercial discount</span><strong>− {quotationCurrency(quotation.discount)}</strong></div>}
        <div><span>Taxable value</span><strong>{quotationCurrency(quotation.taxable_value)}</strong></div>
        {quotation.gst_amount > 0 && <div><span>GST ({quotation.gst_percent}%)</span><strong>{quotationCurrency(quotation.gst_amount)}</strong></div>}
        <div className="quotation-doc-summary-total"><span>Total quotation value</span><strong>{quotationCurrency(quotation.total_amount)}</strong></div>
        {quotation.suggested_booking_amount > 0 && <div><span>Suggested booking amount</span><strong>{quotationCurrency(quotation.suggested_booking_amount)}</strong></div>}
      </div>
      <div className="quotation-doc-terms">
        <div><span>Payment terms</span><p>{quotation.payment_terms}</p></div>
        <div><span>Exclusions</span><p>{quotation.exclusions}</p></div>
      </div>
      <div className="quotation-doc-next"><span>Ready to proceed?</span><h3>Confirm this proposal to prepare the Baraat Management Contract.</h3><p>This quotation is a proposal only and does not reserve the date. The booking is confirmed after the Agreement is signed and the booking amount is received.</p></div>
      <div className="quotation-doc-signatures">
        <div>
          <span>For PlanMyBaraat</span>
          <i>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/agreement-signature.png" alt="Authorized signature" className="quotation-doc-signature-stamp" /></i>
          <strong>Ronak Dave</strong>
        </div>
        <div><span>For the client</span><i /><strong>{quotation.client_name}</strong></div>
      </div>
    </Page>
  </div>;
});

export default QuotationDocument;
