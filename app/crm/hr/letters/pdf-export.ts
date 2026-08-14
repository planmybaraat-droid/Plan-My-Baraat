'use client';

import type { jsPDF as JsPdf } from 'jspdf';

interface LetterPdfProperties {
  title: string;
  subject?: string;
}

const nextPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

async function waitForLetterAssets(root: HTMLElement, pageCount: number) {
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    const qrCodes = root.querySelectorAll<HTMLImageElement>('.letter-doc-footer-verify img');
    const images = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
    const imagesReady = images.every((image) => image.complete && image.naturalWidth > 0);
    if (qrCodes.length === pageCount && imagesReady) return;
    await new Promise((resolve) => window.setTimeout(resolve, 80));
  }
  throw new Error('The letter images or verification QR code are still loading. Please try the download again.');
}

export async function buildLetterPdf(root: HTMLElement, properties: LetterPdfProperties): Promise<JsPdf> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
  const pages = Array.from(root.querySelectorAll<HTMLElement>('[data-pdf-page]'));
  if (!pages.length) throw new Error('The letter preview is unavailable.');

  await waitForLetterAssets(root, pages.length);
  await document.fonts.ready;

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  root.classList.add('letter-pdf-capture');
  try {
    // html2canvas can snapshot before the fallback export font has completed its
    // reflow. Two paints make the captured geometry match the final glyph metrics.
    await nextPaint();
    await nextPaint();

    for (let index = 0; index < pages.length; index += 1) {
      const canvas = await html2canvas(pages[index], {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        width: 794,
        height: 1123,
        windowWidth: 794,
        scrollX: 0,
        scrollY: 0,
      });
      if (canvas.width < 1500 || canvas.height < 2200) {
        throw new Error(`Letter page ${index + 1} was not captured at print quality.`);
      }
      const pageImage = canvas.toDataURL('image/jpeg', 0.96);
      if (index > 0) pdf.addPage('a4', 'portrait');
      pdf.addImage(pageImage, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }
  } finally {
    root.classList.remove('letter-pdf-capture');
  }

  pdf.setProperties({
    title: properties.title,
    subject: properties.subject,
    author: 'PlanMyBaraat',
    creator: 'PlanMyBaraat CRM',
  });
  return pdf;
}
