'use client';

import { forwardRef, useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import type { AgreementRecord, AgreementService } from '../../lib/types';
import { SERVICE_AVAILABILITY_NOTE, currency, formatAgreementDate } from '../agreement-config';

const TERMS = [
  "The Client confirms that all event details, service specifications, quantities, pricing and operational requirements stated in this Agreement are accurate and approved at signing.",
  "Any addition, upgrade, quantity change, route change, timing extension or other modification requested after confirmation is subject to availability and additional charges. A material change must be recorded in writing and approved by authorised representatives of both Parties.",
  "The Client shall provide accurate information, artwork, approvals, venue access, event schedule and one authorised decision-maker within the agreed timelines.",
  "Services not expressly listed in the confirmed service specification are excluded and, if requested, shall be quoted and charged separately.",
  "The Client is responsible for obtaining permissions allocated to it, including venue approval, procession and traffic permission, sound or noise permission, music-use licence, fire or special-effects approval and municipal or police permission, unless a particular permission is expressly assigned to PlanMyBaraat in writing.",
  "Special effects, pyrotechnics, CO₂ equipment, confetti, sound systems and vehicles shall be operated only by authorised personnel and remain subject to Applicable Law, weather, safety distance, venue rules and authority instructions. PlanMyBaraat may reduce, relocate or discontinue an activity it reasonably considers unlawful or unsafe.",
  "Guests may ride on or occupy vehicles specifically provided for that purpose under the confirmed package, strictly within the manufacturer's or operator's safe seating/standing capacity and subject to the crew's instructions at all times. Guests shall not climb on any other vehicle, equipment, or structure not designated for guest use, obstruct drivers or crew, handle specialeffects equipment, exceed the authorised occupancy of any vehicle, or demand an unlawful or unsafe activity. PlanMyBaraat may suspend the affected service where intoxication, violence, overcrowding, weather, route conditions, or guest conduct creates a material safety risk.",
  "If a specified vehicle, artist or item becomes unavailable because of mechanical failure, illness, transport disruption or circumstances beyond reasonable control, PlanMyBaraat may propose a reasonably comparable substitute. If none is available, the Client shall receive a proportionate adjustment for the unavailable component.",
  "The booking advance reserves event capacity and initiates planning and vendor commitments. If the Client cancels, PlanMyBaraat may retain reasonable amounts attributable to work completed, capacity reserved and documented nonrecoverable commitments. The applicable cancellation calculation shall be communicated in writing and shall not exceed amounts permitted by law.",
  "A rescheduling request is subject to written agreement, availability, revised rates and reimbursement of non-recoverable costs. If PlanMyBaraat is unavailable on the proposed replacement date, the matter shall be treated as a Client cancellation.",
  "The balance payment must be completed according to the agreed schedule and, in all cases, before equipment dispatch or load-in unless otherwise agreed in writing. Delay may result in suspension or delay of services.",
  "If performance becomes impossible or materially unsafe due to extreme weather, natural disaster, fire, epidemic restriction, curfew, government prohibition, civil disturbance, venue closure or another event beyond reasonable control, the Parties shall first attempt to reschedule. If rescheduling is not agreed, PlanMyBaraat may retain fees for work performed and non-recoverable commitments and shall refund any remaining balance.",
  "PlanMyBaraat shall not photograph, record, livestream, publish or use the Client’s name, likeness, event material, testimonial, venue information or association for advertising, portfolio, website, social media, press or promotional use without the Client’s prior written consent identifying the approved content and permitted use.",
  "PlanMyBaraat and its approved personnel shall keep confidential all non-public information concerning the Client, couple, family, celebrity attendees, guest list, travel, accommodation, security arrangements, access credentials and event schedule. Such information shall be used only for event performance and disclosed only on a need-to-know basis.",
  "The Client is responsible for direct loss of or damage to PlanMyBaraat equipment, vehicles, props or materials caused by the Client, guests or Client-appointed vendors, excluding ordinary wear and tear. PlanMyBaraat shall provide reasonable evidence of the damage and repair or replacement cost.",
  "Each Party is responsible for third-party claims to the extent caused by its negligence, wilful misconduct, breach of law or breach of this Agreement. To the maximum extent permitted by law, neither Party shall be liable for indirect or consequential loss.",
  "Any operational concern should be reported immediately to the designated PlanMyBaraat coordinator to permit correction during the Event. A post-event complaint should be submitted in writing with reasonable particulars within seven days.",
  "This Agreement, its completed tables and approved written changes constitute the complete understanding between the Parties. WhatsApp or oral discussions do not amend scope, price, liability, privacy or cancellation terms unless clearly accepted in writing by authorised representatives.",
  "Certain special effects and equipment, including but not limited to Hand Pyro, CO₂ Guns, CO₂ Jets, Confetti Guns, Paper Blast, Smoke Bubble Effects, Fireworks, and similar products, are supplied by independent third-party vendors or manufacturers. While PlanMyBaraat exercises reasonable care in selecting and arranging such services, it does not manufacture or control these products. Accordingly, PlanMyBaraat shall not be liable for any failure, misfire, defective operation, incomplete discharge, or malfunction of such vendor-supplied equipment or consumables, provided such failure is not caused by the negligence or wilful misconduct of PlanMyBaraat or its personnel.",
  "The Client acknowledges that the use of fireworks, pyrotechnics, CO₂ effects, confetti, smoke effects, and other special effects involves inherent risks. The Client agrees to ensure that all guests follow the instructions of the authorised operators and maintain the prescribed safety distance. Except to the extent caused by the negligence or wilful misconduct of PlanMyBaraat or its personnel, PlanMyBaraat shall not be responsible for any injury, damage, staining of clothing, damage to vehicles, personal belongings, or any other loss arising from the normal use of such special effects during the Event. The Client accepts these risks on behalf of themselves and their guests.",
  "The Parties shall first attempt to resolve a dispute through good-faith discussions within fifteen days of written notice. An unresolved dispute shall be referred to a sole arbitrator under the Arbitration and Conciliation Act, 1996. The seat and venue shall be Vadodara, Gujarat, proceedings shall be in English, and courts at Vadodara shall have jurisdiction for interim relief, enforcement and matters not capable of arbitration.",
  "Any additional cost, damage charge or overcharge arising during the course of the Event, including on account of extended timing, additional services availed on-site or guest conduct, shall be payable by the Client over and above the agreed package amount.",
  "This Agreement shall be governed by the laws of India and, without prejudice to the arbitration provisions above, all matters, disputes and legal proceedings arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts at Vadodara, Gujarat.",
  "Crew Safety & Legal Accountability: The Client is strictly responsible for the safety of the DJ operator and crew; any physical violence, harassment, or misconduct by attendees—sober or intoxicated—will result in an immediate stoppage of services, with the Client bearing full liability for all police and legal consequences.",
  "Equipment Damage & Financial Liability: The Client accepts 100% financial liability for any damage, loss, or vandalism caused to the DJ equipment, sound system, lighting, or assets due to disruptive behavior, alcohol-induced disputes, or guest negligence, and agrees to reimburse repair or replacement costs immediately.",
  "Procession & Public/Civil Legal Responsibility: For road shows, outdoor processions, or related events, the Client assumes full responsibility for all local permissions and remains solely accountable for any police interventions, family disputes, public disturbances, or legal matters that arise during the event.",
  "Overtime & Extension Charges: Any extension of performance or operating time beyond the agreed schedule will be billed at an additional rate of **₹20,000 per hour** (or part thereof), subject to crew availability and prior clearance."
] as const;

// A clause can mark a short run of text (e.g. a rate) as emphasised by
// wrapping it in **double asterisks**, without pulling in a full markdown
// renderer. Splitting on the `**...**` pairs and bolding the odd-indexed
// pieces keeps every other clause (with no markers) rendering exactly as
// plain text, unchanged.
function renderClauseText(text: string) {
  const pieces = text.split('**');
  if (pieces.length === 1) return text;
  return pieces.map((piece, index) => (index % 2 === 1 ? <strong key={index}>{piece}</strong> : piece));
}

// Each printed page is a fixed 794x1123px (A4-at-96dpi) with `overflow:
// hidden`, so content that doesn't fit is silently clipped rather than
// reflowing — terms clauses must therefore be pre-packed into pages by an
// *estimated* rendered height (chars-per-line × line-height, from the
// `.agreement-doc-terms` CSS metrics), not a flat clause count. A fixed
// count (e.g. "10 per page") looks fine only by coincidence and otherwise
// leaves large blank gaps on pages with mostly short clauses, or would
// silently truncate a page full of long ones.
function estimateClauseHeight(text: string, isFirstPage: boolean) {
  // Strip the `**bold**` markers before measuring — they add 4 characters
  // to the source string but render as zero-width formatting, not text, so
  // counting them would overstate how many lines the clause wraps to.
  const renderedLength = text.replace(/\*\*/g, '').length;
  const charsPerLine = isFirstPage ? 123 : 116;
  const lineHeight = isFirstPage ? 13.7 : 15.2;
  const gap = isFirstPage ? 10 : 7;
  const lines = Math.max(1, Math.ceil(renderedLength / charsPerLine));
  return lines * lineHeight + gap;
}

// Available vertical space for the terms list itself, after the fixed
// blocks that sit above it on each page type: page kicker + heading
// (~94px) on every terms page, plus — on the first terms page only — the
// payment summary card (~180px) and the embedded "Terms & conditions"
// heading (~101px) that appear above the list there.
const FIRST_TERMS_PAGE_BUDGET = 535;
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

function serviceNeedsFullWidth(service: AgreementService) {
  return [service.customization, service.client_remark, service.special_instructions]
    .filter(hasContent)
    .join(' ')
    .trim().length > 160;
}

function DocHeader({ agreement }: { agreement: AgreementRecord }) {
  return (
    <div className="agreement-doc-header">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="PlanMyBaraat" className="agreement-doc-logo" />
      <div className="agreement-doc-header-meta">
        <span>Baraat Management Contract</span>
        <strong>{agreement.agreement_number}</strong>
      </div>
    </div>
  );
}

function DocFooter({ agreement, page, total, qr }: { agreement: AgreementRecord; page: number; total: number; qr: string }) {
  return (
    <div className="agreement-doc-footer">
      <div className="agreement-doc-footer-brand"><strong>PLANMYBARAAT</strong><span>Luxury Baraat planning & production</span></div>
      <div className="agreement-doc-footer-meta">
        <span>{agreement.agreement_number}</span>
        <span>Generated {formatAgreementDate(agreement.agreement_date)}</span>
      </div>
      <p>Page {page} of {total}</p>
      <div className="agreement-doc-footer-verify">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt="Agreement verification QR code" />
        ) : <span className="agreement-doc-qr-placeholder" />}
        <small>Scan to Verify</small>
      </div>
    </div>
  );
}

function Page({ agreement, page, total, qr, children, className = '' }: {
  agreement: AgreementRecord; page: number; total: number; qr: string; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={`agreement-pdf-page ${className}`} data-pdf-page>
      <DocHeader agreement={agreement} />
      <div className="agreement-doc-content">{children}</div>
      <DocFooter agreement={agreement} page={page} total={total} qr={qr} />
    </section>
  );
}

interface AgreementDocumentProps {
  agreement: AgreementRecord;
}

const AgreementDocument = forwardRef<HTMLDivElement, AgreementDocumentProps>(function AgreementDocument({ agreement }, ref) {
  const [qr, setQr] = useState('');
  const enabledServices = agreement.services.filter(service => service.enabled);
  const hasAgreementNotes = hasContent(agreement.client_notes) || hasContent(agreement.special_requirements);
  const maxServiceRows = hasAgreementNotes ? 8 : 10;
  const serviceChunks = useMemo(() => {
    const chunks: AgreementService[][] = [];
    let page: AgreementService[] = [];
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
  const termsPageStart = serviceChunks.length + 2;
  const totalPages = 2 + serviceChunks.length + termsPages.length;
  const signaturePage = termsPageStart + termsPages.length;

  useEffect(() => {
    // Public, no-login verification link — scanning this on the printed
    // document proves it's an original PlanMyBaraat agreement, without
    // exposing the CRM (which requires staff login).
    const verifyUrl = typeof window === 'undefined' ? agreement.agreement_number : `${window.location.origin}/verify/${agreement.verification_code}`;
    QRCode.toDataURL(verifyUrl, { width: 128, margin: 0, color: { dark: '#111111', light: '#ffffff' } }).then(setQr);
  }, [agreement.verification_code, agreement.agreement_number]);

  return (
    <div ref={ref} className="agreement-document">
      <Page agreement={agreement} page={1} total={totalPages} qr={qr} className="agreement-doc-cover">
        <div className="agreement-doc-eyebrow">Prepared exclusively for</div>
        <h1>{agreement.client_name}</h1>
        <p className="agreement-doc-intro">A considered service agreement for a remarkable Baraat experience—planned, produced and delivered with precision.</p>

        <div className="agreement-doc-hero-card">
          <div className="agreement-doc-hero-date"><span>Celebration date</span><strong>{formatAgreementDate(agreement.event_date) || 'To be confirmed'}</strong></div>
          <div className="agreement-doc-hero-package"><span>Selected experience</span><strong>{agreement.package_name}</strong></div>
          <div className="agreement-doc-hero-value"><span>Agreement value</span><strong>{currency(agreement.final_amount)}</strong></div>
        </div>

        <div className="agreement-doc-section-title"><span>01</span><div><small>Celebration profile</small><h2>People, place & timing</h2></div></div>
        <div className="agreement-doc-details-grid">
          <Detail label="Groom" value={agreement.groom_name} />
          <Detail label="Bride" value={agreement.bride_name} />
          <Detail label="Primary mobile" value={agreement.mobile} />
          <Detail label="Alternate mobile" value={agreement.alternate_mobile} />
          <Detail label="Email" value={agreement.email} />
          <Detail label="Venue" value={agreement.venue} />
          <Detail label="Procession timing" value={[agreement.start_time, agreement.end_time].filter(Boolean).join(' – ')} />
          <Detail label="Hard stop" value={agreement.hard_stop_time} />
          <Detail label="Address" value={agreement.address} wide />
        </div>

        <div className="agreement-doc-team-strip">
          <div><span>Event coordinator</span><strong>{agreement.event_coordinator || 'To be assigned'}</strong></div>
          <div><span>Sales executive</span><strong>{agreement.sales_executive || 'PlanMyBaraat Team'}</strong></div>
          <div><span>Agreement date</span><strong>{formatAgreementDate(agreement.agreement_date)}</strong></div>
        </div>
      </Page>

      {serviceChunks.map((services, chunkIndex) => (
        <Page key={chunkIndex} agreement={agreement} page={chunkIndex + 2} total={totalPages} qr={qr} className="agreement-doc-services-page">
          <div className="agreement-doc-page-kicker">The experience</div>
          <div className="agreement-doc-page-heading">
            <div><h2>Included services</h2><p>Every element below forms part of the approved service scope.</p></div>
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
                  <div className="agreement-doc-service-title"><h3>{service.name}</h3><span>Quantity {service.quantity}</span></div>
                  {SERVICE_AVAILABILITY_NOTE[service.name] && <p className="agreement-doc-service-availability">{SERVICE_AVAILABILITY_NOTE[service.name]}</p>}
                  {hasContent(service.option) && <p><b>Selected option</b>{service.option.trim()}</p>}
                  {hasContent(service.color) && <p><b>Colour</b>{service.color.trim()}</p>}
                  {hasContent(service.decoration) && <p><b>Decoration</b>{service.decoration.trim()}</p>}
                  {hasContent(service.purpose) && <p><b>Used for</b>{service.purpose.trim()}</p>}
                  {service.multi_options?.length > 0 && <p><b>Add-ons</b>{service.multi_options.join(', ')}</p>}
                  {hasContent(service.customization) && <p><b>Customization</b>{service.customization.trim()}</p>}
                  {hasContent(service.client_remark) && <p><b>Client remark</b>{service.client_remark.trim()}</p>}
                  {hasContent(service.special_instructions) && <p><b>Special instructions</b>{service.special_instructions.trim()}</p>}
                </div>
              </div>
            ))}
          </div>
          {chunkIndex === serviceChunks.length - 1 && hasAgreementNotes && (
            <div className="agreement-doc-notes">
              {hasContent(agreement.client_notes) && <div><span>Client notes</span><p>{agreement.client_notes.trim()}</p></div>}
              {hasContent(agreement.special_requirements) && <div><span>Special requirements</span><p>{agreement.special_requirements.trim()}</p></div>}
            </div>
          )}
        </Page>
      ))}

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
                <h2>{isFirstTermsPage ? 'Payment summary' : 'Terms & conditions (continued)'}</h2>
                <p>{isFirstTermsPage ? 'A clear record of the agreed value and payment position.' : 'These terms form an integral part of this agreement.'}</p>
              </div>
              <span>{isFirstTermsPage ? `Version ${agreement.version}` : `Clauses ${String(clauseStart).padStart(2, '0')}-${String(clauseEnd).padStart(2, '0')}`}</span>
            </div>

            {isFirstTermsPage && (
              <>
                <div className="agreement-doc-payment-card agreement-doc-payment-card-compact">
                  <div className="agreement-doc-payment-primary">
                    <div><span>Agreement value</span><strong>{currency(agreement.final_amount)}</strong></div>
                    <div><span>Booking amount</span><strong>{currency(agreement.booking_amount)}</strong></div>
                    <div className="agreement-doc-payment-outstanding"><span>Remaining amount</span><strong>{currency(agreement.outstanding)}</strong></div>
                  </div>
                  <div className="agreement-doc-payment-breakdown">
                    <div><span>Package price</span><strong>{currency(agreement.package_price)}</strong></div>
                    {agreement.discount > 0 && <div><span>Discount</span><strong>- {currency(agreement.discount)}</strong></div>}
                    {agreement.gst_percent > 0 && <div><span>GST</span><strong>{agreement.gst_percent}%</strong></div>}
                    {agreement.second_installment > 0 && <div><span>Second installment</span><strong>{currency(agreement.second_installment)}</strong></div>}
                    {agreement.final_payment > 0 && <div><span>Final payment</span><strong>{currency(agreement.final_payment)}</strong></div>}
                  </div>
                </div>
                <div className="agreement-doc-embedded-terms-heading">
                  <span>Terms & conditions</span>
                  <h3>Terms & conditions</h3>
                  <p>These terms form an integral part of this agreement.</p>
                </div>
              </>
            )}

            <ol className={`agreement-doc-terms ${isFirstTermsPage ? 'agreement-doc-terms-after-payment' : ''}`} start={clauseStart}>
              {terms.map((term, index) => <li key={clauseStart + index}>{renderClauseText(term)}</li>)}
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
            <p>Formal acceptance of the complete Baraat Management Contract.</p>
          </div>
          <span>Final page</span>
        </div>

        <div className="agreement-doc-signature-content">
          <div className="agreement-doc-declaration">
            <span>Declaration</span>
            <p>We confirm that the information, service scope, commercial summary and terms in this agreement have been reviewed and accepted by both parties.</p>
          </div>

          <div className="agreement-doc-signatures">
            <div className="agreement-doc-signature-block">
              <span>For PlanMyBaraat</span>
              <i className="agreement-doc-signature-line"><img src="/agreement-signature.png" alt="Authorized signature" className="agreement-doc-signature-stamp" /></i>
              <strong>Ronak Dave</strong>
              <div className="agreement-doc-signature-date"><span className="agreement-doc-signature-date-line" /><small>Date</small></div>
            </div>
            <div>
              <span>For the client</span>
              <i />
              <strong>{agreement.client_name}</strong>
              <div className="agreement-doc-signature-date"><span className="agreement-doc-signature-date-line" /><small>Date</small></div>
            </div>
          </div>
        </div>
      </Page>
    </div>
  );
});

export default AgreementDocument;
