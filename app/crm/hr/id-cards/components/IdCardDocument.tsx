'use client';

import { forwardRef, useEffect } from 'react';
import type { IdCardRecord, IdCardSettings, StaffRecord } from '../../../lib/types';
import { formatAgreementDate, mmToPx } from '../id-card-config';

interface IdCardDocumentProps {
  card: IdCardRecord;
  staff: StaffRecord;
  settings: IdCardSettings;
  photoUrl: string | null;
  onQrReady?: () => void;
}

const RED = '#B32632';
const RED_DARK = '#9A2029';
const RED_SOFT = '#FFF3F4';
const INK = '#111111';
const BORDER = '#F0BFC3';
const FONT_HEADER = 'var(--font-idcard-montserrat), Montserrat, Manrope, Arial, sans-serif';
const FONT_BODY = 'var(--font-idcard-inter), Inter, Segoe UI, Arial, sans-serif';
const FONT_VALUE = 'var(--font-idcard-roboto), Roboto, var(--font-idcard-inter), Inter, Arial, sans-serif';

function clean(value: string | null | undefined, fallback = '—') {
  const text = String(value || '').trim();
  return text || fallback;
}

function getLivePosition(staff: StaffRecord, card: IdCardRecord) {
  return clean(staff.job_title || staff.designation || card.front_snapshot?.designation, 'Team Member');
}

function DataRow({
  label,
  value,
  u,
  labelColor = RED_DARK,
  labelWidth = 14,
  valueSize = 3,
  valueWeight = 800,
}: {
  label: string;
  value: string;
  u: number;
  labelColor?: string;
  labelWidth?: number;
  valueSize?: number;
  valueWeight?: number;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `${u * labelWidth}px minmax(0, 1fr)`, columnGap: u * 1.25, alignItems: 'baseline', minWidth: 0 }}>
      <span style={{ fontFamily: FONT_BODY, color: labelColor, fontSize: u * 2.35, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontFamily: FONT_VALUE, color: INK, fontSize: u * valueSize, fontWeight: valueWeight, lineHeight: 1.16, overflowWrap: 'anywhere' }}>{value}</span>
    </div>
  );
}

const IdCardDocument = forwardRef<HTMLDivElement, IdCardDocumentProps>(function IdCardDocument(
  { card, staff, settings, photoUrl, onQrReady },
  ref,
) {
  const widthPx = mmToPx(settings.card_width_mm);
  const heightPx = mmToPx(settings.card_height_mm);
  const safePx = mmToPx(settings.safe_margin_mm);
  const u = heightPx / 100;
  const cornerRadiusPx = mmToPx(3.18);

  useEffect(() => {
    requestAnimationFrame(() => onQrReady?.());
  }, [onQrReady]);

  const displayName = clean(staff.full_name, 'Employee Name');
  const employeeCode = clean(staff.employee_code, 'EMPLOYEE ID');
  const position = getLivePosition(staff, card);
  const department = clean(staff.department, 'Department');
  const mobile = clean(staff.mobile);
  const joined = staff.joining_date ? formatAgreementDate(staff.joining_date) : '—';
  const emergency = clean(staff.emergency_contact_mobile || staff.emergency_contact_name);
  const bloodGroup = clean(card.back_snapshot?.blood_group, '—');
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || '?';

  const faceWrapperStyle = {
    width: widthPx,
    height: heightPx,
    borderRadius: cornerRadiusPx,
    boxShadow: '0 5px 18px rgba(0,0,0,0.16)',
  };

  const faceStyle = {
    width: widthPx,
    height: heightPx,
    boxSizing: 'border-box' as const,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    background: '#ffffff',
    borderRadius: cornerRadiusPx,
    border: '1px solid #dedede',
    fontFamily: FONT_BODY,
    color: INK,
  };

  const logoImageStyle = {
    width: u * 41,
    height: u * 9.6,
    objectFit: 'contain' as const,
    display: 'block',
  };

  return (
    <div ref={ref} className="idcard-document" style={{ display: 'inline-flex', flexDirection: 'column', gap: 24, fontFamily: FONT_BODY }}>
      <div style={faceWrapperStyle}>
        <div data-card-face="front" style={faceStyle}>
          <div style={{ position: 'absolute', top: -u * 8.5, right: -u * 7.5, width: u * 22, height: u * 22, borderRadius: '999px', background: '#B84B53' }} />
          <div style={{ position: 'absolute', bottom: -u * 12, left: -u * 12, width: u * 27, height: u * 27, borderRadius: '999px', background: 'rgba(179,38,50,0.08)' }} />

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: `${u * 6.5}px ${safePx}px 0`, gap: u * 1.1 }}>
            <img src="/logo.png" alt="PlanMyBaraat" style={logoImageStyle} />
            <p style={{ margin: 0, fontFamily: FONT_BODY, color: '#3F3F46', fontSize: u * 3.05, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.18em' }}>Staff ID Card</p>
          </div>

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: `${u * 4.1}px ${safePx}px 0`, textAlign: 'center' }}>
            <div style={{ width: u * 31.8, height: u * 31.8, borderRadius: u * 6, overflow: 'hidden', border: `${u * 0.75}px solid #ffffff`, boxShadow: '0 0 0 1px #d0d0d0, 0 4px 12px rgba(0,0,0,0.15)', background: `linear-gradient(150deg, ${RED}, ${RED_DARK})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
              ) : (
                <span style={{ fontFamily: FONT_HEADER, fontSize: u * 9.4, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>{initials}</span>
              )}
            </div>

            <p style={{ margin: `${u * 1.75}px 0 0`, fontFamily: FONT_VALUE, color: INK, fontSize: u * 5.45, fontWeight: 850, lineHeight: 1.08, letterSpacing: '-0.025em', maxWidth: widthPx - safePx * 2, overflowWrap: 'anywhere' }}>{displayName}</p>
            <div style={{ marginTop: u * 3.05, width: '100%', boxSizing: 'border-box', background: RED_SOFT, border: `1px solid ${BORDER}`, borderRadius: u * 3, padding: `${u * 1.45}px ${u * 2.35}px`, display: 'flex', flexDirection: 'column', gap: u * 0.62, textAlign: 'left' }}>
              <DataRow label="Emp ID" value={employeeCode} u={u} labelWidth={16.5} valueSize={3.05} valueWeight={500} />
              <DataRow label="Dept" value={department} u={u} labelWidth={16.5} valueSize={3.05} valueWeight={500} />
              <DataRow label="Position" value={position} u={u} labelWidth={16.5} valueSize={2.82} valueWeight={500} />
            </div>
          </div>
        </div>
      </div>

      <div style={faceWrapperStyle}>
        <div data-card-face="back" style={{ ...faceStyle, padding: safePx, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'absolute', bottom: -u * 14, right: -u * 10, width: u * 28, height: u * 28, borderRadius: '999px', background: 'rgba(179,38,50,0.08)' }} />

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: u * 1.1 }}>
            <img src="/logo.png" alt="PlanMyBaraat" style={{ ...logoImageStyle, width: u * 43, height: u * 9.8 }} />
          </div>
          <div style={{ position: 'relative', height: 1.35, background: RED_DARK, margin: `${u * 2.55}px 0 ${u * 2.55}px` }} />

          <div style={{ position: 'relative', boxSizing: 'border-box', background: RED_SOFT, border: `1px solid ${BORDER}`, borderRadius: u * 3, padding: `${u * 2.05}px ${u * 2.55}px`, display: 'flex', flexDirection: 'column', gap: u * 0.9 }}>
            <p style={{ margin: 0, fontFamily: FONT_HEADER, color: RED_DARK, fontSize: u * 3.85, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.025em' }}>Staff Details</p>
            <DataRow label="Mobile" value={mobile} u={u} labelWidth={15} valueSize={3.18} />
            <DataRow label="Joined" value={joined} u={u} labelWidth={15} valueSize={3.18} />
            <DataRow label="Emerg." value={emergency} u={u} labelWidth={15} valueSize={3.18} />
            <DataRow label="Blood" value={bloodGroup} u={u} labelWidth={15} valueSize={3.18} />
          </div>

          <div style={{ position: 'relative', marginTop: u * 2.15 }}>
            <p style={{ margin: `0 0 ${u * 1.25}px`, fontFamily: FONT_HEADER, color: INK, fontSize: u * 3.9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.01em' }}>Company Details</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: u * 0.78 }}>
              <DataRow label="Addr" value="Studio 501–502, Broadway Signature, Vadodara, Gujarat – 391110" u={u} labelWidth={13.2} valueSize={3.02} valueWeight={500} />
              <DataRow label="Tel" value="+91 90890 81111" u={u} labelWidth={13.2} valueSize={3.22} valueWeight={600} />
              <DataRow label="Mail" value="hr@planmybaraat.com" u={u} labelWidth={13.2} valueSize={3.08} valueWeight={600} />
            </div>
            <p style={{ margin: `${u * 1.55}px 0 0`, fontFamily: FONT_BODY, color: '#3F3F46', fontSize: u * 2.25, fontWeight: 400, lineHeight: 1.2, textAlign: 'left' }}>
              Return Policy: This card is the property of PlanMyBaraat. If found, please return to the company address listed above.
            </p>
          </div>

          <div style={{ position: 'relative', marginTop: 'auto', paddingTop: u * 1.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: u * 1.3, color: '#B6BBC4', fontFamily: FONT_BODY, fontSize: u * 2.55, fontWeight: 600 }}>
              <span>{employeeCode}</span>
              <span>·</span>
              <span>v{card.version}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});

export default IdCardDocument;
