'use client';

import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Globe2, Mail, Phone } from 'lucide-react';
import type { EmployeeLetterRecord, LetterTemplate } from '../../../lib/types';
import { formatAgreementDate } from '../../hr-config';

interface LetterDocumentProps {
  letter: EmployeeLetterRecord;
  template: LetterTemplate;
}

const CERTIFICATE_TYPES = new Set(['experience_letter', 'noc']);
const PAGE_BREAK = /\n\s*\[\[PAGE_BREAK\]\]\s*\n/g;

function InlineText({ text }: { text: string }) {
  return <>{text.split(/(\*\*.*?\*\*)/g).filter(Boolean).map((part, index) => (
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : <span key={index}>{part}</span>
  ))}</>;
}

type BodyBlock =
  | { type: 'heading' | 'subheading' | 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

function parseBody(text: string, bulletNumberedTerms = false): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let insideNumberedTerms = false;
  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) {
      if (bulletNumberedTerms && insideNumberedTerms) {
        list.forEach((item) => blocks.push({ type: 'list', items: [item] }));
      } else {
        blocks.push({ type: 'list', items: list });
      }
    }
    list = [];
  };

  text.split('\n').forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || line === '---') {
      flushParagraph();
      flushList();
      return;
    }
    if (line.startsWith('# ')) {
      flushParagraph(); flushList();
      const heading = line.slice(2);
      if (/^\d+\./.test(heading)) insideNumberedTerms = true;
      blocks.push({ type: 'heading', text: heading });
      return;
    }
    if (line.startsWith('## ')) {
      flushParagraph(); flushList();
      insideNumberedTerms = false;
      blocks.push({ type: 'subheading', text: line.slice(3) });
      return;
    }
    if (line.startsWith('* ')) {
      flushParagraph();
      list.push(line.slice(2));
      return;
    }
    if (bulletNumberedTerms && insideNumberedTerms) {
      flushParagraph();
      list.push(line);
      return;
    }
    flushList();
    paragraph.push(line);
  });
  flushParagraph();
  flushList();
  return blocks;
}

function CompanySignature({ text }: { text: string }) {
  const signatory = text.replace(/^\*\*Signature:\*\*\s*/i, '').replaceAll('**', '').trim() || 'Ronak Dave';
  return (
    <div className="letter-doc-signature letter-doc-authorized-signature">
      <div className="letter-doc-stamp-wrap">
        <img src="/agreement-signature.png" alt="Company stamp and authorized signature" className="letter-doc-stamp" />
      </div>
      <p className="letter-doc-signee">{signatory}</p>
      <p className="letter-doc-signee-title">PlanMyBaraat</p>
    </div>
  );
}

function LetterBody({ text, blocks, compact }: { text?: string; blocks?: BodyBlock[]; compact: boolean }) {
  const content = blocks || parseBody(text || '', compact);
  return (
    <div className={`letter-doc-body ${compact ? 'letter-doc-body--agreement' : ''}`}>
      {content.map((block, index) => {
        if (block.type === 'heading') return <h2 key={index} className="letter-doc-section-title"><InlineText text={block.text} /></h2>;
        if (block.type === 'subheading') return <h3 key={index} className="letter-doc-section-subtitle"><InlineText text={block.text} /></h3>;
        const previousSubheading = [...content.slice(0, index)].reverse().find((item) => item.type === 'subheading');
        const previousSubheadingText = previousSubheading && previousSubheading.type !== 'list' ? previousSubheading.text : '';
        if (block.type === 'list') {
          const companyListSignature = block.items.length === 1 && /^\*\*Signature:\*\*/i.test(block.items[0]) && previousSubheadingText.toUpperCase().includes('PLANMYBARAAT');
          if (companyListSignature) return <CompanySignature key={index} text={block.items[0]} />;
          return <ul key={index} className="letter-doc-list">{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineText text={item} /></li>)}</ul>;
        }
        const companySignature = /^\*\*Signature:\*\*/i.test(block.text) && previousSubheadingText.toUpperCase().includes('PLANMYBARAAT');
        if (companySignature) return <CompanySignature key={index} text={block.text} />;
        return <p key={index}><InlineText text={block.text} /></p>;
      })}
    </div>
  );
}

const LetterDocument = forwardRef<HTMLDivElement, LetterDocumentProps>(function LetterDocument({ letter, template }, ref) {
  const [qr, setQr] = useState('');
  const employee = letter.employee;
  const isCertificate = CERTIFICATE_TYPES.has(letter.letter_type);
  const isAgreement = new Set(['intern_agreement', 'appointment_letter']).has(letter.letter_type);
  const agreementBlocks = useMemo(
    () => isAgreement ? parseBody(letter.rendered_text.replace(PAGE_BREAK, '\n'), true) : [],
    [isAgreement, letter.rendered_text],
  );
  const [agreementPages, setAgreementPages] = useState<BodyBlock[][]>(() => agreementBlocks.length ? [agreementBlocks] : []);
  const measureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isAgreement || !measureRef.current || !agreementBlocks.length) return;
    const elements = Array.from(measureRef.current.querySelectorAll('.letter-doc-body > *')) as HTMLElement[];
    const rects = elements.map((element) => element.getBoundingClientRect());
    const heights = elements.map((element, index) => {
      if (rects[index + 1]) return rects[index + 1].top - rects[index].top;
      const style = window.getComputedStyle(element);
      return rects[index].height + parseFloat(style.marginBottom || '0');
    });
    const packed: BodyBlock[][] = [];
    let page: BodyBlock[] = [];
    let used = 0;
    const limit = () => packed.length === 0 ? 640 : 738;

    agreementBlocks.forEach((block, index) => {
      const height = heights[index] || 0;
      const followingHeight = ['heading', 'subheading'].includes(block.type) ? (heights[index + 1] || 0) : 0;
      if (page.length && used + height + followingHeight > limit()) {
        packed.push(page);
        page = [];
        used = 0;
      }
      page.push(block);
      used += height;
    });
    if (page.length) packed.push(page);
    setAgreementPages(packed);
  }, [agreementBlocks, isAgreement]);

  const pages: Array<string | BodyBlock[]> = isAgreement
    ? (agreementPages.length ? agreementPages : [agreementBlocks])
    : letter.rendered_text.split(PAGE_BREAK);

  useEffect(() => {
    const verifyUrl = typeof window === 'undefined' ? letter.letter_number : `${window.location.origin}/verify/${letter.verification_code}`;
    QRCode.toDataURL(verifyUrl, { width: 108, margin: 0, color: { dark: '#111111', light: '#ffffff' } }).then(setQr);
  }, [letter.verification_code, letter.letter_number]);

  return (
    <div ref={ref} className="agreement-document">
      {isAgreement && (
        <div ref={measureRef} className="letter-doc-measure" aria-hidden="true">
          <LetterBody blocks={agreementBlocks} compact />
        </div>
      )}
      {pages.map((pageBody, pageIndex) => {
        const firstPage = pageIndex === 0;
        const lastPage = pageIndex === pages.length - 1;
        return (
          <section key={pageIndex} className="agreement-pdf-page" data-pdf-page>
            <div className="agreement-doc-header">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="PlanMyBaraat" className="agreement-doc-logo" />
              <div className="agreement-doc-header-meta">
                <span>Human Resources</span>
                <strong>{letter.letter_number}{pages.length > 1 ? ` · ${pageIndex + 1}/${pages.length}` : ''}</strong>
              </div>
            </div>

            <div className={`agreement-doc-content letter-doc-content ${isAgreement ? 'letter-doc-content--agreement' : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="letter-doc-watermark-logo" />

              <div className="letter-doc-topline">
                <span>{template.category} · Human Resources</span>
                <span className="letter-doc-confidential">Private &amp; Confidential</span>
              </div>
              <h1 className="letter-doc-heading">{template.label}</h1>
              <span className="letter-doc-rule" />

              <div className="letter-doc-refdate">
                <span>Ref: <strong>{letter.letter_number}</strong></span>
                <span>{pages.length > 1 && <>Page: <strong>{pageIndex + 1} of {pages.length}</strong> · </>}Date: <strong>{formatAgreementDate(letter.created_at.slice(0, 10))}</strong></span>
              </div>

              {firstPage && !isCertificate && (
                <div className="letter-doc-address">
                  <span>To,</span>
                  <strong>{employee?.full_name}</strong>
                  <span>{employee?.job_title || employee?.designation}, {employee?.department} Department</span>
                  <span>{employee?.address || 'PlanMyBaraat'}</span>
                </div>
              )}

              {firstPage && !isCertificate && (
                <div className="letter-doc-subject">
                  <span className="letter-doc-subject-highlight" aria-hidden="true" />
                  <span className="letter-doc-subject-label">Subject:</span>
                  <span className="letter-doc-subject-text">{template.label} — {employee?.full_name}</span>
                </div>
              )}

              <LetterBody
                text={typeof pageBody === 'string' ? pageBody : undefined}
                blocks={Array.isArray(pageBody) ? pageBody : undefined}
                compact={isAgreement}
              />

              {!isAgreement && lastPage && (
                <div className="letter-doc-signature">
                  <p className="letter-doc-closing">Warm regards,</p>
                  <div className="letter-doc-stamp-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/agreement-signature.png" alt="Authorized signature" className="letter-doc-stamp" />
                  </div>
                  <p className="letter-doc-signee">Ronak Dave</p>
                  <p className="letter-doc-signee-title">PlanMyBaraat</p>
                </div>
              )}
            </div>

            <div className="letter-doc-footer">
              <div className="letter-doc-footer-contact">
                <span><Phone size={11} /> +91 90890 81111</span>
                <span><Mail size={11} /> hr@planmybaraat.com</span>
                <span><Globe2 size={11} /> www.planmybaraat.com</span>
              </div>
              <div className="letter-doc-footer-main">
                <div className="letter-doc-footer-brand">
                  <strong>PlanMyBaraat</strong>
                  <p>Studio 501–502, Broadway Signature, 5th Floor,<br />Near Red Petal Party Plot, Opp. Sevasi-Bhayli<br />Canal Ring Road, Vadodara, Gujarat – 391110</p>
                  <span>Working Hours: Monday – Saturday, 10:00 AM – 7:00 PM</span>
                </div>
                <div className="letter-doc-footer-verify">
                  {qr ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qr} alt="Letter verification QR code" />
                  ) : <span className="agreement-doc-qr-placeholder" />}
                  <small>Scan to Verify</small>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
});

export default LetterDocument;
