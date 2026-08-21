'use client';

import { forwardRef, useEffect } from 'react';
import QRCode from 'qrcode';
import type { IdCardRecord, IdCardSettings, StaffRecord } from '../../../lib/types';
import { formatAgreementDate, mmToPx } from '../id-card-config';

interface IdCardDocumentProps {
  card: IdCardRecord;
  staff: StaffRecord;
  settings: IdCardSettings;
  photoUrl: string | null;
  // Fires once the QR code has actually been generated and set into state —
  // used by the off-screen bulk exporter as the "safe to capture now" signal
  // instead of guessing from generic <img> completeness (the QR <img> isn't
  // even in the DOM until this fires, since it renders conditionally).
  onQrReady?: () => void;
}

// Brand palette: white, red (the same red used across the rest of the CRM —
// bg-red-600 buttons, focus rings, etc.) and black text. No other accent color.
const RED = '#DC2626';
const RED_DARK = '#991B1B';
const BLACK = '#000000';

// Live front/back preview AND the exact DOM the PDF exporter captures with
// html2canvas — same "one component is both the screen preview and the print
// source" pattern already used by LetterDocument.tsx. Rendered at true
// physical CR80 (or configured) dimensions at 96dpi CSS px, then captured at
// a higher html2canvas `scale` for print resolution — never a resized
// screenshot of some other, differently-proportioned layout. Portrait by
// default (worn vertically on a lanyard) — settings.card_width_mm is the
// short edge, settings.card_height_mm is the long edge.
const IdCardDocument = forwardRef<HTMLDivElement, IdCardDocumentProps>(function IdCardDocument(
  { card, staff, settings, photoUrl, onQrReady },
  ref,
) {
  const widthPx = mmToPx(settings.card_width_mm);
  const heightPx = mmToPx(settings.card_height_mm);
  const safePx = mmToPx(settings.safe_margin_mm);
  const u = heightPx / 100; // one layout unit — every size below scales off real card height
  // Real CR80 die-cut corner radius (1/8" ≈ 3.18mm) — fixed in mm, not scaled
  // by card height like everything else. The earlier height-proportional
  // radius (u*8, ~7mm) was much rounder than an actual printed card and was
  // bigger than the safe margin, so square content sitting near a corner
  // (the QR box especially) visually collided with the curve once printed.
  const cornerRadiusPx = mmToPx(3.18);

  useEffect(() => {
    const verifyUrl = typeof window === 'undefined'
      ? card.card_number
      : `${window.location.origin}/verify/${card.verification_code}`;
    // The QR is no longer displayed on the card itself (removed from the
    // front footer per request), but the bulk PDF exporter still waits on
    // this "ready" signal before it captures each face, so generation stays
    // — only the resulting image is now discarded instead of rendered.
    QRCode.toDataURL(verifyUrl, { width: 200, margin: 0, color: { dark: '#1c1917', light: '#ffffff' } }).then(() => {
      onQrReady?.();
    });
  }, [card.verification_code, card.card_number]); // eslint-disable-line react-hooks/exhaustive-deps

  const designation = card.front_snapshot.designation || staff.designation || staff.job_title;
  const initials = staff.full_name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase() || '?';
  const avatarSize = u * 34;
  const cardFontFamily = 'var(--font-outfit), Manrope, Arial, sans-serif';

  // The drop shadow lives on an OUTER wrapper only — it's on-screen preview
  // chrome, not part of the physical card, so it must never be baked into
  // the captured print image. html2canvas targets the INNER [data-card-face]
  // element directly, which has a real (non-shadow) 1px border instead — a
  // border is part of normal box layout and is always captured pixel-exact,
  // unlike a box-shadow "hairline" which renders outside the element's own
  // bounding box and can get clipped or look uneven once rasterized.
  const faceWrapperStyle = { width: widthPx, height: heightPx, borderRadius: cornerRadiusPx, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' };
  const faceStyle = {
    width: widthPx, height: heightPx, boxSizing: 'border-box' as const,
    position: 'relative' as const, overflow: 'hidden' as const, background: '#ffffff',
    borderRadius: cornerRadiusPx, border: '1px solid #ece9e6',
    fontFamily: cardFontFamily, display: 'flex' as const, flexDirection: 'column' as const,
  };

  return (
    <div ref={ref} className="idcard-document" style={{ display: 'inline-flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Front ─────────────────────────────────────────────────────── */}
      <div style={faceWrapperStyle}>
        <div data-card-face="front" style={faceStyle}>
          {/* Decorative red corner shape — small and tucked fully behind/above
              the header row (never behind the text itself: the text block
              below has its own opaque white background, so even if the two
              geometrically overlap at this narrow portrait width, the text
              stays perfectly legible on solid white, not on red). */}
          <div style={{ position: 'absolute', top: -u * 12, right: -u * 12, width: u * 26, height: u * 26, borderRadius: '9999px', background: `linear-gradient(135deg, ${RED}, ${RED_DARK})` }} />
          <div style={{ position: 'absolute', bottom: -u * 16, left: -u * 16, width: u * 30, height: u * 30, borderRadius: '9999px', background: 'rgba(220,38,38,0.06)' }} />

          {/* Header: logo image only, centered — no separate "PlanMyBaraat"
              text (the logo file already is the full brand lockup); just the
              "Staff ID Card" caption underneath. */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: u * 1, padding: `${u * 4}px ${safePx}px 0` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="PlanMyBaraat" style={{ height: u * 9, objectFit: 'contain' }} />
            <p style={{ margin: 0, fontSize: u * 2.7, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.12em', background: '#ffffff', borderRadius: u * 2 }}>Staff ID Card</p>
          </div>

          {/* Photo, name, designation */}
          <div style={{ position: 'relative', flex: 1, padding: `${u * 2}px ${safePx}px 0`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: avatarSize, height: avatarSize, borderRadius: u * 6, overflow: 'hidden', flexShrink: 0,
                border: '3px solid #ffffff', boxShadow: '0 3px 10px rgba(0,0,0,0.16), 0 0 0 1px #ece9e6',
                background: `linear-gradient(150deg, ${RED}, ${RED_DARK})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt={staff.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
              ) : (
                <span style={{ fontSize: u * 10, fontWeight: 800, color: '#ffffff', letterSpacing: 0.5 }}>{initials}</span>
              )}
            </div>

            <p style={{ margin: `${u * 1.8}px 0 0`, fontSize: u * 6.2, fontWeight: 800, color: BLACK, lineHeight: 1.15, wordBreak: 'break-word', maxWidth: '100%' }}>{staff.full_name}</p>
            <span
              style={{
                marginTop: u * 1.1, display: 'inline-block', maxWidth: widthPx - safePx * 2 - u * 6, fontSize: u * 3.4, fontWeight: 800,
                color: '#ffffff', background: RED, borderRadius: u * 2, padding: `${u * 0.9}px ${u * 2.6}px`,
                textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.3,
              }}
            >{designation}</span>
            <span style={{ marginTop: u * 1.1, fontSize: u * 3.6, fontWeight: 600, color: '#374151' }}>{staff.department}</span>
          </div>

        </div>
      </div>

      {/* ── Back ──────────────────────────────────────────────────────── */}
      <div style={faceWrapperStyle}>
        <div data-card-face="back" style={{ ...faceStyle, padding: safePx }}>
          <div style={{ position: 'absolute', bottom: -u * 18, right: -u * 18, width: u * 40, height: u * 40, borderRadius: '9999px', background: 'rgba(220,38,38,0.05)' }} />
          {/* Logo image only, centered — the file itself is the full brand
              lockup (mark + wordmark), so a separate "PlanMyBaraat" text
              label next to it was pure duplication and was what pushed the
              row wide enough to wrap onto two lines. */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="PlanMyBaraat" style={{ height: u * 11, objectFit: 'contain' }} />
          </div>
          <div style={{ height: 1.5, background: RED, marginTop: u * 2 }} />

          {/* Everything below the rule is centered as one block in the
              remaining height — with the signature/terms sections gone
              there's a lot of vertical room on a portrait card, and pinning
              this content to the top only left a large empty gap above the
              footer caption. */}
          <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: u * 2.8 }}>
            {/* This employee's own details, pulled straight from their Staff
                record — not boilerplate. Kept in its own tinted box so it
                reads as "about this person", distinct from the plain
                company-contact rows below. */}
            <div style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.16)', borderRadius: u * 3, padding: `${u * 1.6}px ${u * 2.2}px` }}>
              <p style={{ margin: 0, fontSize: u * 3, fontWeight: 800, color: RED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Staff details</p>
              <div style={{ marginTop: u * 1.2, display: 'flex', flexDirection: 'column', gap: u * 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: u * 1.4 }}>
                  <span style={{ flexShrink: 0, width: u * 10, fontSize: u * 2.6, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' as const }}>Mobile</span>
                  <span style={{ fontSize: u * 3.4, fontWeight: 700, color: BLACK }}>{staff.mobile || '—'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: u * 1.4 }}>
                  <span style={{ flexShrink: 0, width: u * 10, fontSize: u * 2.6, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' as const }}>Joined</span>
                  <span style={{ fontSize: u * 3.4, fontWeight: 700, color: BLACK }}>{staff.joining_date ? formatAgreementDate(staff.joining_date) : '—'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: u * 1.4 }}>
                  <span style={{ flexShrink: 0, width: u * 10, fontSize: u * 2.6, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' as const }}>Emerg.</span>
                  <span style={{ fontSize: u * 3.4, fontWeight: 700, color: BLACK }}>
                    {staff.emergency_contact_name || 'Not on file'}{staff.emergency_contact_mobile ? ` · ${staff.emergency_contact_mobile}` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Plain text labels instead of icon glyphs — an inline SVG icon
                component can be measured/rasterized slightly inconsistently
                by html2canvas (a known limitation with arbitrary SVG
                content), which showed up as visibly misaligned icons in the
                exported PDF even though the on-screen preview looked
                correct. Plain text and boxes are always captured
                pixel-exact, so labels are the reliable choice for anything
                that gets printed. */}
            <div>
              <p style={{ margin: `0 0 ${u * 1.2}px`, fontSize: u * 3, fontWeight: 800, color: BLACK, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Company details</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: u * 1.4 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: u * 1.6 }}>
                  <span style={{ flexShrink: 0, width: u * 9, fontSize: u * 2.6, fontWeight: 800, color: RED, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: `${u * 4}px` }}>Addr</span>
                  <p style={{ margin: 0, fontSize: u * 3.2, color: '#374151', lineHeight: 1.35 }}>
                    Studio 501–502, Broadway Signature, Vadodara, Gujarat – 391110
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: u * 1.6, flexWrap: 'wrap' }}>
                  <span style={{ flexShrink: 0, width: u * 9, fontSize: u * 2.6, fontWeight: 800, color: RED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tel</span>
                  <span style={{ fontSize: u * 3.4, fontWeight: 700, color: BLACK }}>+91 90890 81111</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: u * 1.6, flexWrap: 'wrap' }}>
                  <span style={{ flexShrink: 0, width: u * 9, fontSize: u * 2.6, fontWeight: 800, color: RED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mail</span>
                  <span style={{ fontSize: u * 3.4, fontWeight: 700, color: BLACK }}>hr@planmybaraat.com</span>
                </div>
              </div>
            </div>
          </div>

          <p style={{ position: 'relative', fontSize: u * 2.8, color: '#9ca3af', textAlign: 'center', letterSpacing: '0.03em' }}>
            {card.card_number} &middot; v{card.version}
          </p>
        </div>
      </div>
    </div>
  );
});

export default IdCardDocument;
