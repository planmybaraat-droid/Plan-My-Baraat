'use client';

import type { jsPDF as JsPdf } from 'jspdf';
import { createPdfPermissionLock } from './pdf-security';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const VERIFY_CONTAINER_SELECTOR = [
  '.agreement-doc-footer-verify',
  '.quotation-doc-verify',
  '.letter-doc-footer-verify',
  '.catalog-doc-footer-verify',
  '.invoice-doc-verify',
].join(',');

export interface CrmPdfProperties {
  title: string;
  subject?: string;
  author?: string;
  creator?: string;
}

export interface CrmPdfOptions {
  properties: CrmPdfProperties;
  pageSelector?: string;
  quality?: number;
  scale?: number;
  requireVerificationImages?: boolean;
}

const nextPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

function getPdfPages(root: HTMLElement, selector: string) {
  const pages = root.matches(selector)
    ? [root]
    : Array.from(root.querySelectorAll<HTMLElement>(selector));
  if (!pages.length) throw new Error('The PDF preview is unavailable.');
  return pages;
}

async function loadImage(image: HTMLImageElement) {
  if (!image.complete || image.naturalWidth === 0) {
    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error(`Image failed to load: ${image.alt || image.src}`)), 15000);
      image.addEventListener('load', () => { window.clearTimeout(timeout); resolve(); }, { once: true });
      image.addEventListener('error', () => { window.clearTimeout(timeout); reject(new Error(`Image failed to load: ${image.alt || image.src}`)); }, { once: true });
    });
  }
  if (typeof image.decode === 'function') {
    await image.decode().catch(() => undefined);
  }
  if (image.naturalWidth === 0) throw new Error(`Image failed to load: ${image.alt || image.src}`);
}

async function waitForPdfAssets(root: HTMLElement, requireVerificationImages: boolean) {
  await document.fonts.ready;

  if (requireVerificationImages) {
    const deadline = Date.now() + 15000;
    while (Date.now() < deadline) {
      const containers = Array.from(root.querySelectorAll<HTMLElement>(VERIFY_CONTAINER_SELECTOR));
      if (!containers.length || containers.every((container) => container.querySelector('img'))) break;
      await new Promise((resolve) => window.setTimeout(resolve, 80));
    }
    const missingVerificationImage = Array.from(root.querySelectorAll<HTMLElement>(VERIFY_CONTAINER_SELECTOR))
      .some((container) => !container.querySelector('img'));
    if (missingVerificationImage) throw new Error('The verification QR code is still loading. Please try the download again.');
  }

  await Promise.all(Array.from(root.querySelectorAll<HTMLImageElement>('img')).map(loadImage));
  await nextPaint();
  await nextPaint();
}

function validatePageGeometry(page: HTMLElement, pageNumber: number) {
  const width = page.offsetWidth;
  const height = page.offsetHeight;
  if (Math.abs(width - A4_WIDTH_PX) > 2 || Math.abs(height - A4_HEIGHT_PX) > 2) {
    throw new Error(`PDF page ${pageNumber} is ${width} x ${height}px; expected the A4 preview size ${A4_WIDTH_PX} x ${A4_HEIGHT_PX}px.`);
  }
}

export async function buildCrmPdf(root: HTMLElement, options: CrmPdfOptions): Promise<JsPdf> {
  const selector = options.pageSelector || '[data-pdf-page]';
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
  const pages = getPdfPages(root, selector);

  root.classList.add('crm-pdf-capture');
  try {
    await waitForPdfAssets(root, options.requireVerificationImages !== false);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      encryption: createPdfPermissionLock(),
    });

    for (let index = 0; index < pages.length; index += 1) {
      const page = pages[index];
      validatePageGeometry(page, index + 1);
      const canvas = await html2canvas(page, {
        scale: options.scale || 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        windowWidth: A4_WIDTH_PX,
        windowHeight: A4_HEIGHT_PX,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDocument) => {
          clonedDocument.documentElement.classList.add('crm-pdf-rendering');
        },
      });
      const renderScale = options.scale || 2;
      if (canvas.width < A4_WIDTH_PX * renderScale - 2 || canvas.height < A4_HEIGHT_PX * renderScale - 2) {
        throw new Error(`PDF page ${index + 1} was not captured at print quality.`);
      }
      if (index > 0) pdf.addPage('a4', 'portrait');
      pdf.addImage(canvas.toDataURL('image/jpeg', options.quality || 0.97), 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');
    }

    pdf.setProperties({
      title: options.properties.title,
      subject: options.properties.subject,
      author: options.properties.author || 'PlanMyBaraat',
      creator: options.properties.creator || 'PlanMyBaraat CRM',
    });
    return pdf;
  } finally {
    root.classList.remove('crm-pdf-capture');
  }
}

export async function downloadCrmPdf(root: HTMLElement, filename: string, options: CrmPdfOptions) {
  const pdf = await buildCrmPdf(root, options);
  pdf.save(filename);
}
