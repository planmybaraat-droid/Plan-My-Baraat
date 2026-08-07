'use client';

import { forwardRef, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import type { VendorAgreementRecord, VendorAgreementService } from '../../lib/types';
import { currency, formatAgreementDate } from '../../agreements/agreement-config';
import { VENDOR_DOCUMENT_CATEGORIES, calculateVendorAgreementAmounts } from '../vendor-agreement-config';

// The full legal text generated into the PDF. The Step 5 wizard preview
// (TERMS_PREVIEW in VendorAgreementForm.tsx) shows a shorter summary of the
// same clauses in the same order — this is the binding, complete version.
const TERMS = [
  'This agreement is entered into between PlanMyBaraat ("Company") and the vendor named herein ("Vendor") for the provision of event services introduced by the Company to its clients.',
  'Confidentiality: The Vendor shall keep strictly confidential all client information, pricing, commercial terms, business processes and other non-public information disclosed by the Company, both during this agreement and after its termination.',
  'Non-circumvention: The Vendor shall not, directly or indirectly, accept a booking from, solicit, or conduct business of any kind with any client introduced by the Company for a period of 24 (twenty-four) months from the date of introduction — irrespective of whether the introduced event was ultimately booked through the Company. Any breach of this clause entitles the Company, without prejudice to any other remedy, to immediately terminate this agreement, blacklist the Vendor from all future engagements, recover any loss of business or commission suffered as a result of the circumvention, withhold any payments otherwise due to the Vendor, and pursue legal action for damages.',
  'Non-solicitation: The Vendor shall not solicit or induce any employee, staff member, other vendor or client of the Company to terminate or reduce their relationship with the Company, during the term of this agreement and for 12 (twelve) months thereafter.',
  'Payment protection: Commission and payment terms set out in this agreement are binding on both parties. The Company may withhold any payment due to the Vendor pending resolution of a client complaint, damage claim, quality dispute or investigation into a suspected breach of this agreement.',
  'Service quality standards: The Vendor shall deliver services strictly matching the description, capacity, quality and pricing represented at onboarding and confirmed for each specific event, and shall promptly notify the Company of any change in its ability to deliver as represented.',
  'Cancellation policy: A Vendor-initiated cancellation within 7 (seven) days of the confirmed event date may attract a cancellation charge, recovery of any resulting loss to the Company, and shall be recorded against the Vendor\'s reliability rating.',
  'Late arrival and no-show: Repeated late arrival at a confirmed event, or failure to appear at a confirmed event without the Company\'s prior written consent, shall be treated as a material breach of this agreement and may result in immediate suspension pending review.',
  'Equipment responsibility: The Vendor is solely responsible for the safety, maintenance, licensing and insurance of its own equipment, vehicles, animals and personnel used in the performance of services under this agreement.',
  'Staff conduct: The Vendor shall ensure that its staff and representatives conduct themselves professionally and courteously with clients, guests, venue staff and Company personnel at all times, and shall promptly remove any individual whose conduct is unacceptable.',
  'Property damage: The Vendor shall be liable for any loss of or damage to venue property, client property or third-party property directly caused by the negligence or wilful act of its personnel, equipment or animals.',
  'Indemnity: The Vendor shall indemnify and hold harmless the Company against all claims, losses, damages, costs and expenses arising out of the Vendor\'s negligence, misconduct, breach of applicable law or breach of this agreement.',
  'Force majeure: Neither party shall be liable for any delay or failure to perform its obligations under this agreement caused by circumstances beyond its reasonable control, including natural disaster, government action, civil disturbance or public health restriction, subject to prompt written notice to the other party.',
  'Intellectual property: All PlanMyBaraat branding, trademarks, client lists, pricing methodology and proprietary materials shared with the Vendor remain the exclusive property of the Company and may not be used by the Vendor for any purpose outside this agreement.',
  'Social media and publicity restrictions: The Vendor shall not publish, post or otherwise disclose client names, event details, photography/videography or any Company-sourced content on social media or elsewhere without the Company\'s prior written approval.',
  'Client data protection: Client contact details and event information shared with the Vendor for the purpose of service delivery shall be used solely for that confirmed engagement, shall not be retained beyond what is necessary, and shall not be shared with any third party.',
  'Company\'s right to suspend or blacklist: The Company reserves the right, at its sole discretion, to suspend or permanently blacklist the Vendor from future engagements in the event of a breach of this agreement, repeated service quality failures, client complaints, misconduct, or any act damaging to the Company\'s reputation.',
  'Dispute resolution: The parties shall first attempt to resolve any dispute arising out of or in connection with this agreement through good-faith discussion within 15 (fifteen) days of written notice.',
  'Jurisdiction: Subject to the dispute resolution clause above, this agreement shall be governed by the laws of India, and the courts at Vadodara, Gujarat shall have exclusive jurisdiction over all matters arising out of or in connection with this agreement.',
  'Digital signature consent: The Vendor consents to the execution of this agreement by electronic/digital signature, which the parties agree shall carry the same legal validity, force and effect as a signature executed by hand.',
] as const;

function estimateClauseHeight(text: string, isFirstPage: boolean) {
  const charsPerLine = isFirstPage ? 123 : 116;
  const lineHeight = isFirstPage ? 13.7 : 15.2;
  const gap = isFirstPage ? 10 : 7;
  const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
  return lines * lineHeight + gap;
}

const FIRST_TERMS_PAGE_BUDGET = 620;
const CONTINUATION_TERMS_PAGE_BUDGET = 830;

function useTermsPages() {
  return useMemo(() => {
    const pages: (typeof TERMS[number])[][] = [];
    let current: (typeof TERMS[number])[] = [];
    let used = 0;
    let isFirstPage = true;

    TERMS.forEach(term => {
      const budget = isFirstPage ? FIRST_TERMS_PAGE_BUDGET : CONTINUATION_TERMS_PAGE_BUDGET;
      const clauseHeight = estimateClauseHeight(term, isFirstPage);
      if (current.length && used + clauseHeight > budget) {
        pages.push(current);
        current = [];
        used = 0;
        isFirstPage = false;
      }
      current.push(term);
      used += clauseHeight;
    });

    if (current.length) pages.push(current);
    return pages.length ? pages : [[]];
  }, []);
}

function Detail({ label, value, wide = false }: { label: string; value?: string; wide?: boolean }) {
  if (!value) return null;
  return <div className={wide ? 'agreement-doc-detail agreement-doc-detail-wide' : 'agreement-doc-detail'}><span>{label}</span><strong>{value}</strong></div>;
}

function hasContent(value?: string | null) {
  return Boolean(value?.trim());
}

function serviceNeedsFullWidth(service: VendorAgreementService) {
  return (service.capacity.length + service.service_area.length) > 60;
}

function DocHeader({ agreement }: { agreement: VendorAgreementRecord }) {
  return (
    <div className="agreement-doc-header">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="PlanMyBaraat" className="agreement-doc-logo" />
      <div className="agreement-doc-header-meta">
        <span>Vendor Service Agreement</span>
        <strong>{agreement.vendor_agreement_number}</strong>
      </div>
    </div>
  );
}

function DocFooter({ agreement, page, total, qr }: { agreement: VendorAgreementRecord; page: number; total: number; qr: string }) {
  return (
    <div className="agreement-doc-footer">
      <div className="agreement-doc-footer-brand"><strong>PLANMYBARAAT</strong><span>Luxury Baraat planning & production</span></div>
      <div className="agreement-doc-footer-meta">
        <span>{agreement.vendor_agreement_number}</span>
        <span>Generated {formatAgreementDate(agreement.agreement_date)}</span>
      </div>
      <p>Page {page} of {total}</p>
      <div className="agreement-doc-footer-verify">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt="Vendor agreement verification QR code" />
        ) : <span className="agreement-doc-qr-placeholder" />}
        <small>Scan to Verify</small>
      </div>
    </div>
  );
}

function Page({ agreement, page, total, qr, children, className = '' }: {
  agreement: VendorAgreementRecord; page: number; total: number; qr: string; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={`agreement-pdf-page ${className}`} data-pdf-page>
      <DocHeader agreement={agreement} />
      <div className="agreement-doc-content">{children}</div>
      <DocFooter agreement={agreement} page={page} total={total} qr={qr} />
    </section>
  );
}

interface VendorAgreementDocumentProps {
  agreement: VendorAgreementRecord;
}

const VendorAgreementDocument = forwardRef<HTMLDivElement, VendorAgreementDocumentProps>(function VendorAgreementDocument({ agreement }, ref) {
  const [qr, setQr] = useState('');
  const amounts = useMemo(() => calculateVendorAgreementAmounts(agreement), [agreement]);
  const enabledServices = agreement.services.filter(service => service.enabled);
  const hasNotes = hasContent(agreement.special_conditions);
  const maxServiceRows = hasNotes ? 8 : 10;

  const serviceChunks = useMemo(() => {
    const chunks: VendorAgreementService[][] = [];
    let page: VendorAgreementService[] = [];
    let visualRows = 0;

    enabledServices.forEach(service => {
      const rowWeight = serviceNeedsFullWidth(service) ? 1 : 0.5;
      if (page.length && visualRows + rowWeight > maxServiceRows) {
        chunks.push(page);
        page = [];
        visualRows = 0;
      }
      page.push(service);
      visualRows += rowWeight;
    });

    if (page.length) chunks.push(page);
    return chunks.length ? chunks : [[]];
  }, [enabledServices, maxServiceRows]);

  const termsPages = useTermsPages();
  const documentsPage = serviceChunks.length + 2;
  const termsPageStart = documentsPage + 1;
  const totalPages = 3 + serviceChunks.length + termsPages.length;
  const signaturePage = termsPageStart + termsPages.length;

  useEffect(() => {
    // Public verification link (no CRM login needed) — vendors scanning this
    // land on a vendor-facing authenticity page, distinct from the client one.
    const verifyUrl = typeof window === 'undefined' ? agreement.vendor_agreement_number : `${window.location.origin}/verify/${agreement.verification_code}`;
    QRCode.toDataURL(verifyUrl, { width: 128, margin: 0, color: { dark: '#111111', light: '#ffffff' } }).then(setQr);
  }, [agreement.verification_code, agreement.vendor_agreement_number]);

  return (
    <div ref={ref} className="agreement-document">
      <Page agreement={agreement} page={1} total={totalPages} qr={qr} className="agreement-doc-cover">
        <div className="agreement-doc-eyebrow">Vendor service agreement for</div>
        <h1>{agreement.vendor_name}</h1>
        <p className="agreement-doc-intro">A formal service and commission agreement between PlanMyBaraat and this vendor, covering scope, commercials and legal protections.</p>

        <div className="agreement-doc-hero-card">
          <div className="agreement-doc-hero-date"><span>Agreement validity</span><strong>{formatAgreementDate(agreement.agreement_start_date) || 'TBC'} – {formatAgreementDate(agreement.agreement_end_date) || 'TBC'}</strong></div>
          <div className="agreement-doc-hero-package"><span>Service category</span><strong>{agreement.service_category || 'General'}</strong></div>
          <div className="agreement-doc-hero-value"><span>Estimated value</span><strong>{currency(amounts.estimatedValue)}</strong></div>
        </div>

        <div className="agreement-doc-section-title"><span>01</span><div><small>Vendor profile</small><h2>Business, contact & verification</h2></div></div>
        <div className="agreement-doc-details-grid">
          <Detail label="Business name" value={agreement.business_name} />
          <Detail label="Contact person" value={agreement.contact_person} />
          <Detail label="Primary mobile" value={agreement.mobile} />
          <Detail label="Alternate mobile" value={agreement.alternate_mobile} />
          <Detail label="Email" value={agreement.email} />
          <Detail label="GSTIN" value={agreement.gstin} />
          <Detail label="PAN" value={agreement.pan_number} />
          <Detail label="Verification status" value={agreement.verification_status} />
          <Detail label="Address" value={agreement.address} wide />
        </div>

        <div className="agreement-doc-team-strip">
          <div><span>Commission</span><strong>{agreement.commission_type === 'Flat' ? currency(agreement.flat_commission_amount) : `${agreement.commission_percent}%`}</strong></div>
          <div><span>Payment schedule</span><strong>{agreement.payment_schedule}</strong></div>
          <div><span>Agreement date</span><strong>{formatAgreementDate(agreement.agreement_date)}</strong></div>
        </div>
      </Page>

      {serviceChunks.map((services, chunkIndex) => (
        <Page key={chunkIndex} agreement={agreement} page={chunkIndex + 2} total={totalPages} qr={qr} className="agreement-doc-services-page">
          <div className="agreement-doc-page-kicker">Services offered</div>
          <div className="agreement-doc-page-heading">
            <div><h2>Contracted services</h2><p>Every service below is priced and scoped as agreed with this vendor.</p></div>
            <span>{String(enabledServices.length).padStart(2, '0')} services</span>
          </div>
          <div className="agreement-doc-services">
            {services.map((service, index) => (
              <div
                className={`agreement-doc-service ${serviceNeedsFullWidth(service) ? 'agreement-doc-service-wide' : ''}`}
                key={service.id}
              >
                <div className="agreement-doc-service-number">{String(serviceChunks.slice(0, chunkIndex).reduce((total, chunk) => total + chunk.length, 0) + index + 1).padStart(2, '0')}</div>
                <div className="agreement-doc-service-body">
                  <div className="agreement-doc-service-title"><h3>{service.name}</h3><span>{currency(service.base_price)}</span></div>
                  {hasContent(service.option) && <p><b>Selected option</b>{service.option.trim()}</p>}
                  {service.extra_hour_charge > 0 && <p><b>Extra hour charge</b>{currency(service.extra_hour_charge)}</p>}
                  {service.travel_charge > 0 && <p><b>Travel charge</b>{currency(service.travel_charge)}</p>}
                  {hasContent(service.capacity) && <p><b>Capacity</b>{service.capacity.trim()}</p>}
                  {service.advance_required > 0 && <p><b>Advance required</b>{currency(service.advance_required)}</p>}
                  {hasContent(service.service_area) && <p><b>Service area</b>{service.service_area.trim()}</p>}
                </div>
              </div>
            ))}
          </div>
          {chunkIndex === serviceChunks.length - 1 && hasNotes && (
            <div className="agreement-doc-notes">
              <div><span>Special conditions</span><p>{agreement.special_conditions.trim()}</p></div>
            </div>
          )}
        </Page>
      ))}

      <Page agreement={agreement} page={documentsPage} total={totalPages} qr={qr} className="agreement-doc-services-page">
        <div className="agreement-doc-page-kicker">Compliance</div>
        <div className="agreement-doc-page-heading">
          <div><h2>Vendor documents</h2><p>Document status on file at the time this agreement was generated.</p></div>
          <span>{String(agreement.documents.length).padStart(2, '0')} on file</span>
        </div>
        <div className="agreement-doc-details-grid">
          {VENDOR_DOCUMENT_CATEGORIES.map(category => {
            const matches = agreement.documents.filter(doc => doc.category === category);
            return <Detail key={category} label={category} value={matches.length ? `${matches.length} file${matches.length > 1 ? 's' : ''} on record` : 'Pending submission'} />;
          })}
        </div>
      </Page>

      {termsPages.map((terms, termsPageIndex) => {
        const clauseStart = termsPages
          .slice(0, termsPageIndex)
          .reduce((total, pageTerms) => total + pageTerms.length, 0) + 1;
        const clauseEnd = clauseStart + terms.length - 1;
        const isFirstTermsPage = termsPageIndex === 0;

        return (
          <Page
            key={`terms-${termsPageIndex}`}
            agreement={agreement}
            page={termsPageStart + termsPageIndex}
            total={totalPages}
            qr={qr}
            className="agreement-doc-terms-page"
          >
            <div className="agreement-doc-page-kicker">{isFirstTermsPage ? 'Commercials & acceptance' : 'Terms & conditions'}</div>
            <div className="agreement-doc-page-heading">
              <div>
                <h2>{isFirstTermsPage ? 'Commercial summary' : 'Terms & conditions (continued)'}</h2>
                <p>{isFirstTermsPage ? 'A clear record of the commission, payout and validity terms.' : 'These terms form an integral part of this agreement.'}</p>
              </div>
              <span>{isFirstTermsPage ? `Version ${agreement.version}` : `Clauses ${String(clauseStart).padStart(2, '0')}-${String(clauseEnd).padStart(2, '0')}`}</span>
            </div>

            {isFirstTermsPage && (
              <>
                <div className="agreement-doc-payment-card agreement-doc-payment-card-compact">
                  <div className="agreement-doc-payment-primary">
                    <div><span>Estimated value</span><strong>{currency(amounts.estimatedValue)}</strong></div>
                    <div><span>Commission</span><strong>{currency(amounts.commissionAmount)}</strong></div>
                    <div className="agreement-doc-payment-outstanding"><span>Net vendor payout</span><strong>{currency(Math.max(0, amounts.estimatedValue - amounts.commissionAmount))}</strong></div>
                  </div>
                  <div className="agreement-doc-payment-breakdown">
                    <div><span>Payment schedule</span><strong>{agreement.payment_schedule}</strong></div>
                    <div><span>GST</span><strong>{agreement.gst_applicable ? `${agreement.gst_percent}%` : 'Not applicable'}</strong></div>
                    <div><span>Validity</span><strong>{agreement.agreement_validity_months} months</strong></div>
                    <div><span>Auto-renewal</span><strong>{agreement.auto_renewal ? 'Enabled' : 'Manual'}</strong></div>
                  </div>
                </div>
                <div className="agreement-doc-embedded-terms-heading">
                  <span>Terms & conditions</span>
                  <h3>Terms & conditions</h3>
                  <p>These terms form an integral part of this agreement and are binding on both parties.</p>
                </div>
              </>
            )}

            <ol className={`agreement-doc-terms ${isFirstTermsPage ? 'agreement-doc-terms-after-payment' : ''}`} start={clauseStart}>
              {terms.map((term, index) => <li key={clauseStart + index}>{term}</li>)}
            </ol>
          </Page>
        );
      })}

      <Page
        agreement={agreement}
        page={signaturePage}
        total={totalPages}
        qr={qr}
        className="agreement-doc-terms-page agreement-doc-signature-page"
      >
        <div className="agreement-doc-page-kicker">Acceptance</div>
        <div className="agreement-doc-page-heading">
          <div>
            <h2>Declaration & signatures</h2>
            <p>Formal acceptance of the complete Vendor Service Agreement.</p>
          </div>
          <span>Final page</span>
        </div>

        <div className="agreement-doc-signature-content">
          <div className="agreement-doc-declaration">
            <span>Declaration</span>
            <p>We confirm that the vendor profile, service scope, commercial terms and conditions in this agreement have been reviewed and accepted by both parties, including the non-circumvention obligations set out above.</p>
          </div>

          <div className="agreement-doc-signatures">
            <div className="agreement-doc-signature-block">
              <span>For PlanMyBaraat</span>
              <i className="agreement-doc-signature-line"><img src="/agreement-signature.png" alt="Authorized signature" className="agreement-doc-signature-stamp" /></i>
              <strong>Ronak Dave</strong>
              <div className="agreement-doc-signature-date"><span className="agreement-doc-signature-date-line" /><small>Date</small></div>
            </div>
            <div>
              <span>For the vendor</span>
              <i />
              <strong>{agreement.vendor_name}</strong>
              <div className="agreement-doc-signature-date"><span className="agreement-doc-signature-date-line" /><small>Date</small></div>
            </div>
          </div>
        </div>
      </Page>
    </div>
  );
});

export default VendorAgreementDocument;
