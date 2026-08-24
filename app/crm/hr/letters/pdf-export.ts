'use client';

import type { jsPDF as JsPdf } from 'jspdf';
import { buildCrmPdf } from '../../lib/pdf-export';

interface LetterPdfProperties {
  title: string;
  subject?: string;
}

export async function buildLetterPdf(root: HTMLElement, properties: LetterPdfProperties): Promise<JsPdf> {
  // Mobile browsers have a much smaller canvas-memory budget. A 1.5x A4
  // capture is still print-sharp while avoiding failed/blank multi-page PDFs.
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  return buildCrmPdf(root, { properties, scale: mobile ? 1.5 : 2, quality: mobile ? 0.94 : 0.97 });
}

export function saveLetterPdf(pdf: JsPdf, filename: string) {
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

export async function printLetterPdf(root: HTMLElement, properties: LetterPdfProperties) {
  // Reserve the print tab during the user's click so mobile popup blockers do
  // not reject it after the asynchronous A4 rendering has finished.
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const printTab = mobile ? window.open('', '_blank') : null;
  if (printTab) {
    printTab.document.write('<title>Preparing letter…</title><p style="font-family:Arial,sans-serif;padding:24px">Preparing the print-ready letter…</p>');
  }
  try {
    const pdf = await buildLetterPdf(root, properties);
    const blobUrl = URL.createObjectURL(pdf.output('blob'));
    if (printTab) {
      printTab.location.replace(blobUrl);
      window.setTimeout(() => {
        try { printTab.focus(); printTab.print(); } catch { /* Mobile PDF viewers expose Print through Share. */ }
      }, 1200);
    } else {
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
  } catch (error) {
    printTab?.close();
    throw error;
  }
}
