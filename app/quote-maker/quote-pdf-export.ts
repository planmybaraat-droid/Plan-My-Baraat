'use client';

import { createPdfPermissionLock } from '../crm/lib/pdf-security';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
// Matches `@page { margin: 18mm }` on #quote-maker-print-area in globals.css
// -- kept in sync so the direct-download PDF looks exactly like what the
// old browser-print path used to produce.
const PAGE_MARGIN_MM = 18;
const PX_PER_MM = A4_WIDTH_PX / A4_WIDTH_MM;
const MARGIN_PX = Math.round(PAGE_MARGIN_MM * PX_PER_MM);
const CONTENT_WIDTH_PX = A4_WIDTH_PX - MARGIN_PX * 2;
const CONTENT_HEIGHT_PX = A4_HEIGHT_PX - MARGIN_PX * 2;
const WATERMARK_CSS_WIDTH = 460; // matches .quote-maker-watermark-logo in globals.css
const WATERMARK_TOP_FRACTION = 0.47; // matches `top: 47%` in globals.css

const nextPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

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

function loadImageSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Watermark logo failed to load.'));
    image.src = src;
  });
}

/**
 * Quote Maker's print area (#quote-maker-print-area) is a naturally-flowing
 * document built for the browser's own print pipeline (window.print()), not
 * a set of hand-paginated `[data-pdf-page]` sections like the rest of the
 * CRM's PDFs (see app/crm/lib/pdf-export.ts) use. Routing it through the
 * OS/browser print dialog is exactly what we're removing here, so instead
 * of reusing that pipeline (which requires exact pre-split pages), this
 * captures the whole flowing area at its true print content width and
 * slices the resulting canvas into A4 pages itself -- every pixel of
 * content lands on some page, nothing can silently fall past a stale pixel
 * budget, and the file saves straight to disk with no dialog in between.
 */
export async function downloadQuoteMakerPdf(root: HTMLElement, filename: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);

  const previousStyle = {
    display: root.style.display,
    width: root.style.width,
  };

  // Temporarily force the (normally `display: none`) print area into the
  // layout so it can be captured. Deliberately NOT touched: opacity,
  // visibility, or position tricks to "hide" it during capture -- html2canvas
  // renders the element's actual computed style into the canvas pixels, so a
  // reduced opacity (or visibility: hidden) bakes straight into the output
  // and produces a blank/near-invisible PDF page, not just a hidden one on
  // screen. Left in its normal (already off-screen, since it's the last
  // sibling after the full-height app content) in-flow position instead --
  // it briefly adds height below the fold, nothing the user scrolls to see
  // in the ~1s this takes. `!important` is required to beat the
  // stylesheet's own `!important` display:none rule for this element (see
  // globals.css).
  root.style.setProperty('display', 'block', 'important');
  root.style.width = `${CONTENT_WIDTH_PX}px`;

  try {
    await document.fonts.ready;
    await Promise.all(Array.from(root.querySelectorAll<HTMLImageElement>('img')).map(loadImage));
    await nextPaint();
    await nextPaint();

    const scale = 2;
    const canvas = await html2canvas(root, {
      scale,
      useCORS: true,
      allowTaint: false,
      // Transparent, not '#ffffff': the watermark is drawn onto each page
      // canvas *underneath* this content layer below. A fully opaque white
      // background here would paint over the whole page and hide it
      // completely -- only the DOM's own actually-painted pixels (text,
      // borders, real background boxes) should ever cover the watermark,
      // exactly like every other CRM PDF where the watermark is a sibling
      // painted behind the real content in the same single capture.
      backgroundColor: null,
      logging: false,
      imageTimeout: 15000,
      width: CONTENT_WIDTH_PX,
      windowWidth: CONTENT_WIDTH_PX,
      scrollX: 0,
      scrollY: 0,
      // The in-DOM watermark uses `position: fixed` so it repeats on every
      // physically printed page during a real browser print -- that trick
      // doesn't translate to a single canvas capture, so it's excluded here
      // and redrawn precisely onto every sliced page below instead.
      ignoreElements: (element) => element.classList?.contains('quote-maker-watermark-logo'),
    });

    if (canvas.width < CONTENT_WIDTH_PX * scale - 2) {
      throw new Error('The quote preview was not captured at print quality.');
    }

    const srcCtx = canvas.getContext('2d');
    if (!srcCtx) throw new Error('Unable to prepare the quote for download.');

    const logo = await loadImageSrc('/logo.png').catch(() => null);

    const marginPx = MARGIN_PX * scale;
    const pageContentHeightPx = CONTENT_HEIGHT_PX * scale;
    const pageWidthPx = A4_WIDTH_PX * scale;
    const pageHeightPx = A4_HEIGHT_PX * scale;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      encryption: createPdfPermissionLock(),
    });

    // Cutting a page strictly every `pageContentHeightPx` pixels is blind to
    // where the content actually is -- a boundary can land mid-sentence or
    // mid-clause, which is exactly what "cutting" looks like on a download.
    // Instead, search backwards from the ideal cut line for a fully blank
    // pixel row (the natural gap the page's own margins/spacing leave
    // between paragraphs, table rows and list items -- the capture used
    // `backgroundColor: null`, so truly empty rows are fully transparent)
    // and break there instead. Bounded so a page can never be starved down
    // to almost nothing hunting for a gap that isn't nearby.
    const maxBackoffPx = Math.round(pageContentHeightPx * 0.35);

    const findSafeBreakY = (idealY: number, floorY: number) => {
      const clampedIdeal = Math.min(idealY, canvas.height);
      const searchFloor = Math.max(floorY, clampedIdeal - maxBackoffPx);
      if (clampedIdeal <= searchFloor) return clampedIdeal;

      const blockHeight = clampedIdeal - searchFloor;
      const block = srcCtx.getImageData(0, searchFloor, canvas.width, blockHeight).data;
      const rowBytes = canvas.width * 4;

      for (let row = blockHeight - 1; row >= 0; row -= 1) {
        let blank = true;
        const rowStart = row * rowBytes;
        for (let col = 3; col < rowBytes; col += 4) {
          if (block[rowStart + col] !== 0) { blank = false; break; }
        }
        if (blank) return searchFloor + row;
      }
      return clampedIdeal; // no blank gap nearby -- fall back to the plain cut
    };

    let cursor = 0;
    let pageIndex = 0;
    while (cursor < canvas.height) {
      const idealEnd = cursor + pageContentHeightPx;
      const pageEnd = idealEnd >= canvas.height ? canvas.height : Math.max(cursor + 1, findSafeBreakY(idealEnd, cursor + 1));
      const sliceHeight = pageEnd - cursor;

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = pageWidthPx;
      pageCanvas.height = pageHeightPx;
      const ctx = pageCanvas.getContext('2d');
      if (!ctx) throw new Error('Unable to prepare the quote for download.');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageWidthPx, pageHeightPx);

      if (logo && logo.naturalWidth) {
        const wmWidth = WATERMARK_CSS_WIDTH * scale;
        const wmHeight = wmWidth * (logo.naturalHeight / logo.naturalWidth);
        const wmX = (pageWidthPx - wmWidth) / 2;
        const wmY = pageHeightPx * WATERMARK_TOP_FRACTION - wmHeight / 2;
        // Deliberately no `ctx.filter = 'grayscale(1)'` here: Canvas 2D's
        // `filter` combined with an alpha-transparent PNG and a low
        // globalAlpha is known to misrender as a solid opaque block on some
        // Chromium/Electron builds, instead of the intended faint image --
        // exactly the "black bar" artifact seen on a downloaded page. At
        // 4.5% opacity, colour vs. grayscale is barely perceptible anyway,
        // so plain globalAlpha alone (a much more universally reliable
        // Canvas 2D feature) gives the same visual result without the risk.
        ctx.save();
        ctx.globalAlpha = 0.045;
        ctx.drawImage(logo, wmX, wmY, wmWidth, wmHeight);
        ctx.restore();
      }

      ctx.drawImage(canvas, 0, cursor, canvas.width, sliceHeight, marginPx, marginPx, canvas.width, sliceHeight);

      if (pageIndex > 0) pdf.addPage('a4', 'portrait');
      pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');

      cursor = pageEnd;
      pageIndex += 1;
      if (pageIndex > 50) throw new Error('This quote is too long to export.');
    }

    pdf.setProperties({
      title: filename.replace(/\.pdf$/i, ''),
      subject: 'PlanMyBaraat quote',
      author: 'PlanMyBaraat',
      creator: 'PlanMyBaraat Quote Maker',
    });

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
  } finally {
    root.style.display = previousStyle.display;
    root.style.width = previousStyle.width;
  }
}
