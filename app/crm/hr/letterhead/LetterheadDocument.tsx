'use client';

import { forwardRef } from 'react';
import { formatAgreementDate } from '../hr-config';

export interface LetterheadValues {
  mode: 'blank' | 'custom';
  title: string;
  reference: string;
  date: string;
  recipient: string;
  subject: string;
  content: string;
}

interface LetterheadDocumentProps {
  values: LetterheadValues;
}

function ContentParagraphs({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/g).map((block) => block.trim()).filter(Boolean);
  return <>{blocks.map((block, index) => <p key={index}>{block}</p>)}</>;
}

const LetterheadDocument = forwardRef<HTMLDivElement, LetterheadDocumentProps>(function LetterheadDocument({ values }, ref) {
  const custom = values.mode === 'custom';

  return (
    <div ref={ref} className="agreement-document letterhead-document">
      <section className="agreement-pdf-page letterhead-pdf-page" data-pdf-page>
        <div className="agreement-doc-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="PlanMyBaraat" className="agreement-doc-logo" />
          <div className="agreement-doc-header-meta">
            <span>Official Company Letterhead</span>
          </div>
        </div>

        <div className="agreement-doc-content letterhead-doc-content">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="letter-doc-watermark-logo letterhead-watermark" />

          {custom && (
            <div className="letterhead-custom-content">
              <div className="letter-doc-topline">
                <span>Corporate Communication · PlanMyBaraat</span>
                <span className="letter-doc-confidential">Official Document</span>
              </div>

              <h1 className="letter-doc-heading">{values.title.trim() || 'Official Communication'}</h1>
              <span className="letter-doc-rule" />

              {(values.reference.trim() || values.date) && (
                <div className="letter-doc-refdate">
                  <span>{values.reference.trim() ? <>Ref: <strong>{values.reference.trim()}</strong></> : null}</span>
                  <span>{values.date ? <>Date: <strong>{formatAgreementDate(values.date)}</strong></> : null}</span>
                </div>
              )}

              {values.recipient.trim() && (
                <div className="letterhead-recipient">
                  <span>To,</span>
                  {values.recipient.split('\n').map((line, index) => (
                    <span key={index} className={index === 0 ? 'letterhead-recipient-name' : ''}>{line}</span>
                  ))}
                </div>
              )}

              {values.subject.trim() && (
                <div className="letter-doc-subject letterhead-subject">
                  <span className="letter-doc-subject-highlight" aria-hidden="true" />
                  <span className="letter-doc-subject-label">Subject:</span>
                  <span className="letter-doc-subject-text">{values.subject.trim()}</span>
                </div>
              )}

              {values.content.trim() && (
                <div className="letter-doc-body letterhead-body">
                  <ContentParagraphs content={values.content} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="letter-doc-footer letterhead-doc-footer">
          <div className="letter-doc-footer-contact">
            <span><span className="letterhead-contact-label">Phone :</span><span className="letterhead-contact-text">+91 90890 81111</span></span>
            <span><span className="letterhead-contact-label">Email :</span><span className="letterhead-contact-text">hr@planmybaraat.com</span></span>
            <span><span className="letterhead-contact-label">Web :</span><span className="letterhead-contact-text">www.planmybaraat.com</span></span>
          </div>
          <div className="letter-doc-footer-main letterhead-doc-footer-main">
            <div className="letter-doc-footer-brand">
              <strong>PlanMyBaraat</strong>
              <p>Studio 501-502, Broadway Signature, 5th Floor,<br />Near Red Petal Party Plot, Opp. Sevasi-Bhayli<br />Canal Ring Road, Vadodara, Gujarat - 391110</p>
              <span>Working Hours: Monday - Saturday, 10:00 AM - 7:00 PM</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export default LetterheadDocument;
