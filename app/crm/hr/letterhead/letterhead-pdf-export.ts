'use client';

import type { jsPDF as JsPdf } from 'jspdf';
import { buildCrmPdf } from '../../lib/pdf-export';

export async function buildLetterheadPdf(root: HTMLElement, title: string): Promise<JsPdf> {
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  return buildCrmPdf(root, {
    properties: { title, subject: 'Official PlanMyBaraat company letterhead' },
    scale: mobile ? 1.5 : 2,
    quality: mobile ? 0.94 : 0.97,
    requireVerificationImages: false,
  });
}

export function saveLetterheadPdf(pdf: JsPdf, filename: string) {
  const blobUrl = URL.createObjectURL(pdf.output('blob'));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}

export async function printLetterheadPdf(root: HTMLElement, title: string) {
  const pdf = await buildLetterheadPdf(root, title);
  const blobUrl = URL.createObjectURL(pdf.output('blob'));
  const printTab = window.open(blobUrl, '_blank', 'noopener,noreferrer');
  if (!printTab) {
    const frame = document.createElement('iframe');
    frame.style.position = 'fixed';
    frame.style.width = '1px';
    frame.style.height = '1px';
    frame.style.opacity = '0';
    frame.src = blobUrl;
    frame.onload = () => frame.contentWindow?.print();
    document.body.appendChild(frame);
    window.setTimeout(() => { frame.remove(); URL.revokeObjectURL(blobUrl); }, 60_000);
  }
}
