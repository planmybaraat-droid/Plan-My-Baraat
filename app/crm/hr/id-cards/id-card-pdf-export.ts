'use client';

import type { jsPDF as JsPdf } from 'jspdf';
import type { IdCardRecord, IdCardSettings, StaffRecord } from '../../lib/types';
import { createPdfPermissionLock } from '../../lib/pdf-security';
import { mmToPx } from './id-card-config';

const nextPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

async function imageUrlToDataUrl(url: string): Promise<string> {
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  const response = await fetch(url, { cache: 'no-store', credentials: 'omit' });
  if (!response.ok) throw new Error('The uploaded ID-card photo could not be loaded for the PDF. Please upload it again.');
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('The uploaded ID-card photo could not be prepared for the PDF.'));
    reader.readAsDataURL(blob);
  });
}

async function embedCardPhoto(root: HTMLElement): Promise<() => void> {
  const image = root.querySelector<HTMLImageElement>('[data-card-photo="true"]');
  if (!image) return () => undefined;
  const originalSrc = image.getAttribute('src') || '';
  if (!originalSrc || originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) return () => undefined;

  image.src = await imageUrlToDataUrl(originalSrc);
  await new Promise<void>((resolve, reject) => {
    if (image.complete && image.naturalWidth > 0) { resolve(); return; }
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('The uploaded ID-card photo could not be embedded in the PDF.'));
  });
  return () => { image.src = originalSrc; };
}

async function waitForCardAssets(root: HTMLElement) {
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    const images = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
    if (images.length && images.every((image) => image.complete && image.naturalWidth > 0)) return;
    await new Promise((resolve) => window.setTimeout(resolve, 60));
  }
  throw new Error('The card photo or verification QR code is still loading. Please try again.');
}

// Capture is done per-face (front/back individually), never the whole
// side-by-side preview wrapper, so each PDF page is exactly one card face at
// its real physical size — not a scaled screenshot of an unrelated layout.
async function captureFace(faceEl: HTMLElement, scale: number) {
  const { default: html2canvas } = await import('html2canvas');
  const bounds = faceEl.getBoundingClientRect();
  const width = bounds.width || mmToPx(53.98);
  const height = bounds.height || mmToPx(85.6);
  const canvas = await html2canvas(faceEl, {
    scale,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    scrollX: 0,
    scrollY: 0,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 15000,
  });
  // Lossless PNG, not JPEG — a card this small carries fine QR modules and
  // crisp text edges where JPEG's chroma/DCT compression visibly softens
  // print output. The extra file size is negligible at card dimensions.
  return canvas.toDataURL('image/png');
}

// html2canvas `scale` is a straight multiplier on the element's on-screen
// CSS-px size (rendered at 96dpi). scale:5 => ~480dpi effective output —
// comfortably above ordinary print requirements, and gives
// the QR code and small caption text a crisp, non-fuzzy edge once printed
// at true CR80 size. A card is small, so the extra capture cost is trivial
// even at this scale (unlike full-A4 Letters/Payslips, which use scale:2).
const CARD_CAPTURE_SCALE = 5;

export interface SingleCardPdfInput {
  root: HTMLElement; // the IdCardDocument wrapper (contains both faces)
  settings: IdCardSettings;
  cardNumber: string;
}

async function pdfFromFaceImages(front: string, back: string, settings: IdCardSettings, title: string): Promise<JsPdf> {
  const { jsPDF } = await import('jspdf');
  const w = settings.card_width_mm;
  const h = settings.card_height_mm;
  const orientation = w >= h ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ unit: 'mm', format: [w, h], orientation, compress: true, encryption: createPdfPermissionLock() });
  pdf.addImage(front, 'PNG', 0, 0, w, h, undefined, 'FAST');
  pdf.addPage([w, h], orientation);
  pdf.addImage(back, 'PNG', 0, 0, w, h, undefined, 'FAST');
  pdf.setProperties({ title, author: 'PlanMyBaraat', creator: 'PlanMyBaraat CRM' });
  return pdf;
}

export async function buildSingleCardPdf({ root, settings, cardNumber }: SingleCardPdfInput): Promise<JsPdf> {
  const front = root.querySelector<HTMLElement>('[data-card-face="front"]');
  const back = root.querySelector<HTMLElement>('[data-card-face="back"]');
  if (!front || !back) throw new Error('The card preview is unavailable.');

  const restorePhoto = await embedCardPhoto(root);
  try {
    await waitForCardAssets(root);
    await document.fonts.ready;
    await nextPaint();
    await nextPaint();

    const frontImage = await captureFace(front, CARD_CAPTURE_SCALE);
    const backImage = await captureFace(back, CARD_CAPTURE_SCALE);
    return pdfFromFaceImages(frontImage, backImage, settings, `ID Card ${cardNumber}`);
  } finally {
    restorePhoto();
  }
}

// ─── Bulk / sheet export ────────────────────────────────────────────────────
//
// The live editor only ever renders one employee's card at a time, so bulk
// export mounts each selected employee's IdCardDocument off-screen (one at a
// time, sequentially — never all at once, to keep memory/CPU bounded on a
// large selection), captures its two faces, then unmounts before moving to
// the next employee. Every employee is captured EXACTLY ONCE regardless of
// how many outputs are built from it (combined bundle + that employee's own
// storable PDF both reuse the same two captured images).

export interface BulkCardItem {
  card: IdCardRecord;
  staff: StaffRecord;
  photoUrl: string | null;
}

interface CapturedCard extends BulkCardItem {
  front: string;
  back: string;
}

async function captureOneCard(item: BulkCardItem, settings: IdCardSettings): Promise<{ front: string; back: string }> {
  const { createRoot } = await import('react-dom/client');
  const { createElement } = await import('react');
  const { default: IdCardDocument } = await import('./components/IdCardDocument');

  const embeddedPhotoUrl = item.photoUrl ? await imageUrlToDataUrl(item.photoUrl) : null;
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  const root = createRoot(container);
  try {
    await new Promise<void>((resolve) => {
      let settled = false;
      const settle = () => { if (!settled) { settled = true; resolve(); } };
      root.render(
        createElement(IdCardDocument, {
          card: item.card, staff: item.staff, settings, photoUrl: embeddedPhotoUrl,
          onQrReady: settle,
        }),
      );
      // Safety net: if the QR generation hook never fires for some reason,
      // don't hang the whole bulk export on one employee — 4s is generous
      // for a client-side QRCode.toDataURL() call.
      window.setTimeout(settle, 4000);
    });
    await waitForCardAssets(container);
    await document.fonts.ready;
    await nextPaint();
    await nextPaint();
    const front = container.querySelector<HTMLElement>('[data-card-face="front"]');
    const back = container.querySelector<HTMLElement>('[data-card-face="back"]');
    if (!front || !back) throw new Error(`Card preview failed to render for ${item.staff.full_name}.`);
    const frontImage = await captureFace(front, CARD_CAPTURE_SCALE);
    const backImage = await captureFace(back, CARD_CAPTURE_SCALE);
    return { front: frontImage, back: backImage };
  } finally {
    root.unmount();
    container.remove();
  }
}

export type CardPdfMode = 'individual' | 'sheet';
export type CardFaceMode = 'front' | 'back' | 'both';

export interface BulkPdfOptions {
  mode: CardPdfMode;
  faces: CardFaceMode;
  onProgress?: (done: number, total: number) => void;
}

async function buildIndividualBundleFromCaptures(captured: CapturedCard[], settings: IdCardSettings, faces: CardFaceMode): Promise<JsPdf> {
  const { jsPDF } = await import('jspdf');
  const w = settings.card_width_mm;
  const h = settings.card_height_mm;
  const orientation = w >= h ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ unit: 'mm', format: [w, h], orientation, compress: true, encryption: createPdfPermissionLock() });
  let first = true;
  for (const item of captured) {
    if (faces !== 'back') {
      if (!first) pdf.addPage([w, h], orientation);
      pdf.addImage(item.front, 'PNG', 0, 0, w, h, undefined, 'FAST');
      first = false;
    }
    if (faces !== 'front') {
      if (!first) pdf.addPage([w, h], orientation);
      pdf.addImage(item.back, 'PNG', 0, 0, w, h, undefined, 'FAST');
      first = false;
    }
  }
  pdf.setProperties({ title: 'ID Cards', author: 'PlanMyBaraat', creator: 'PlanMyBaraat CRM' });
  return pdf;
}

function drawCropMarks(pdf: JsPdf, x: number, y: number, w: number, h: number) {
  const mark = 3;
  const gap = 0.8;
  pdf.setDrawColor(170, 170, 170);
  pdf.setLineWidth(0.1);

  pdf.line(x - gap - mark, y, x - gap, y);
  pdf.line(x, y - gap - mark, x, y - gap);
  pdf.line(x + w + gap, y, x + w + gap + mark, y);
  pdf.line(x + w, y - gap - mark, x + w, y - gap);

  pdf.line(x - gap - mark, y + h, x - gap, y + h);
  pdf.line(x, y + h + gap, x, y + h + gap + mark);
  pdf.line(x + w + gap, y + h, x + w + gap + mark, y + h);
  pdf.line(x + w, y + h + gap, x + w, y + h + gap + mark);
}
// Arranges fronts (and, for both/back, backs) in a grid on a configured
// sheet size (default A4), using the admin-configured margins and gaps —
// never distorting the card's own aspect ratio. Duplex alignment: long-edge
// flip keeps the same left-to-right cell order on the back page; short-edge
// flip mirrors each row horizontally so the back of every card lines up with
// its front once the sheet is flipped and fed the other way.
async function buildSheetBundleFromCaptures(captured: CapturedCard[], settings: IdCardSettings, faces: CardFaceMode): Promise<JsPdf> {
  const { jsPDF } = await import('jspdf');
  const w = settings.card_width_mm;
  const h = settings.card_height_mm;
  const sheetW = settings.sheet_width_mm;
  const sheetH = settings.sheet_height_mm;
  const margin = settings.sheet_margin_mm;
  const gapX = settings.horizontal_gap_mm;
  const gapY = settings.vertical_gap_mm;

  const usableW = sheetW - margin * 2;
  const usableH = sheetH - margin * 2;
  const cols = Math.max(1, Math.floor((usableW + gapX) / (w + gapX)));
  const rows = Math.max(1, Math.floor((usableH + gapY) / (h + gapY)));
  const gridW = cols * w + (cols - 1) * gapX;
  const gridH = rows * h + (rows - 1) * gapY;
  const startX = margin + Math.max(0, (usableW - gridW) / 2);
  const startY = margin + Math.max(0, (usableH - gridH) / 2);
  const perSheet = cols * rows;
  if (perSheet < 1) throw new Error('The configured card size does not fit the configured sheet size.');

  const pdf = new jsPDF({ unit: 'mm', format: [sheetW, sheetH], orientation: sheetW >= sheetH ? 'landscape' : 'portrait', compress: true, encryption: createPdfPermissionLock() });

  const frontImages = faces !== 'back' ? captured.map(c => c.front) : [];
  const backImages = faces !== 'front' ? captured.map(c => c.back) : [];

  // jsPDF already has one blank page from the constructor — every grid page
  // after the very first one drawn needs an explicit addPage() first,
  // tracked with a single running flag.
  let pageStarted = false;
  const placeGrid = (images: string[], mirrorRows: boolean) => {
    for (let page = 0; page * perSheet < images.length; page += 1) {
      if (pageStarted) pdf.addPage([sheetW, sheetH], sheetW >= sheetH ? 'landscape' : 'portrait');
      pageStarted = true;
      const pageImages = images.slice(page * perSheet, page * perSheet + perSheet);
      pageImages.forEach((img, index) => {
        const row = Math.floor(index / cols);
        const col = mirrorRows ? cols - 1 - (index % cols) : index % cols;
        const x = startX + col * (w + gapX);
        const y = startY + row * (h + gapY);
        pdf.addImage(img, 'PNG', x, y, w, h, undefined, 'FAST');
        drawCropMarks(pdf, x, y, w, h);
      });
    }
  };

  if (frontImages.length) placeGrid(frontImages, false);
  if (backImages.length) placeGrid(backImages, settings.duplex_mode === 'short_edge');

  pdf.setProperties({ title: 'ID Card Print Sheet', author: 'PlanMyBaraat', creator: 'PlanMyBaraat CRM' });
  return pdf;
}

export interface BulkPdfResult {
  combinedPdf: JsPdf;
  // Per-employee 2-page (front+back) PDF built from the same captured
  // images — used to persist each employee's own crm_id_cards.pdf_path
  // without a second, redundant html2canvas capture pass.
  perEmployeePdfBlob: Map<string, Blob>;
}

export async function buildBulkCardsPdf(items: BulkCardItem[], settings: IdCardSettings, opts: BulkPdfOptions): Promise<BulkPdfResult> {
  if (!items.length) throw new Error('Select at least one employee.');

  const captured: CapturedCard[] = [];
  for (let i = 0; i < items.length; i += 1) {
    const { front, back } = await captureOneCard(items[i], settings);
    captured.push({ ...items[i], front, back });
    opts.onProgress?.(i + 1, items.length);
  }

  const combinedPdf = opts.mode === 'sheet'
    ? await buildSheetBundleFromCaptures(captured, settings, opts.faces)
    : await buildIndividualBundleFromCaptures(captured, settings, opts.faces);

  const perEmployeePdfBlob = new Map<string, Blob>();
  for (const item of captured) {
    const pdf = await pdfFromFaceImages(item.front, item.back, settings, `ID Card ${item.card.card_number}`);
    perEmployeePdfBlob.set(item.staff.id, pdf.output('blob'));
  }

  return { combinedPdf, perEmployeePdfBlob };
}
