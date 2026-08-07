'use client';

import { forwardRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Globe2, Mail, Phone } from 'lucide-react';
import type { PayrollRecord, PayslipRecord } from '../../../lib/types';
import { currency, monthLabel } from '../../hr-config';

interface PayslipDocumentProps {
  payroll: PayrollRecord;
  payslip: PayslipRecord;
}

const Row = ({ label, value }: { label: string; value: number }) => (
  <div className="agreement-doc-detail"><span>{label}</span><strong>{currency(value)}</strong></div>
);

const PayslipDocument = forwardRef<HTMLDivElement, PayslipDocumentProps>(function PayslipDocument({ payroll, payslip }, ref) {
  const [qr, setQr] = useState('');
  const employee = payroll.employee;

  useEffect(() => {
    const verifyUrl = typeof window === 'undefined' ? payslip.payslip_number : `${window.location.origin}/verify/${payslip.verification_code}`;
    QRCode.toDataURL(verifyUrl, { width: 108, margin: 0, color: { dark: '#111111', light: '#ffffff' } }).then(setQr);
  }, [payslip.verification_code, payslip.payslip_number]);

  return (
    <div ref={ref} className="agreement-document">
      <section className="agreement-pdf-page" data-pdf-page>
        <div className="agreement-doc-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="PlanMyBaraat" className="agreement-doc-logo" />
          <div className="agreement-doc-header-meta">
            <span>Payslip</span>
            <strong>{payslip.payslip_number}</strong>
          </div>
        </div>

        <div className="agreement-doc-content letter-doc-content" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="letter-doc-watermark-logo" />
          <p className="agreement-doc-eyebrow">Salary & Payroll</p>
          <h1 className="letter-doc-heading">Payslip — {monthLabel(payroll.month, payroll.year)}</h1>

          <div className="letter-doc-meta-row">
            <div className="agreement-doc-detail"><span>Employee</span><strong>{employee?.full_name}</strong></div>
            <div className="agreement-doc-detail"><span>Employee ID</span><strong>{employee?.employee_code}</strong></div>
            <div className="agreement-doc-detail"><span>Designation</span><strong>{employee?.designation || employee?.job_title}</strong></div>
            <div className="agreement-doc-detail"><span>Department</span><strong>{employee?.department}</strong></div>
          </div>

          <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            <div>
              <p className="agreement-doc-eyebrow" style={{ marginBottom: 8 }}>Earnings</p>
              <Row label="Basic Salary" value={payroll.basic_salary} />
              <Row label="HRA" value={payroll.hra} />
              <Row label="Special Allowance" value={payroll.special_allowance} />
              <Row label="Travel Allowance" value={payroll.travel_allowance} />
              <Row label="Bonus" value={payroll.bonus} />
              <Row label="Incentive" value={payroll.incentive} />
              <div className="agreement-doc-detail agreement-doc-detail-wide"><span>Gross Salary</span><strong>{currency(payroll.gross_salary)}</strong></div>
            </div>
            <div>
              <p className="agreement-doc-eyebrow" style={{ marginBottom: 8 }}>Deductions</p>
              <Row label="Provident Fund (PF)" value={payroll.pf} />
              <Row label="ESIC" value={payroll.esic} />
              <Row label="Professional Tax" value={payroll.professional_tax} />
              <Row label="Other Deduction" value={payroll.other_deduction} />
              <div className="agreement-doc-detail agreement-doc-detail-wide"><span>Total Deductions</span><strong>{currency(payroll.pf + payroll.esic + payroll.professional_tax + payroll.other_deduction)}</strong></div>
            </div>
          </div>

          <div style={{ marginTop: 24, borderRadius: 14, background: '#0d0d0d', padding: '20px 24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9a9a9a' }}>Net Salary Payable</span>
            <strong style={{ fontSize: 22, fontWeight: 900 }}>{currency(payroll.net_salary)}</strong>
          </div>

          <div className="letter-doc-signature">
            <div className="letter-doc-stamp-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/agreement-signature.png" alt="Authorized signature" className="letter-doc-stamp" />
            </div>
            <p className="letter-doc-signee">Ronak Dave</p>
            <p className="letter-doc-signee-title">PlanMyBaraat</p>
          </div>
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
                <img src={qr} alt="Payslip verification QR code" />
              ) : <span className="agreement-doc-qr-placeholder" />}
              <small>Scan to Verify</small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export default PayslipDocument;
