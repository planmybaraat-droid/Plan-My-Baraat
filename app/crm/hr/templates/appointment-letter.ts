import type { LetterTemplate } from '../../lib/types';

export const APPOINTMENT_LETTER_TEMPLATE: LetterTemplate = {
  id: 'tpl-appointment-letter',
  letter_type: 'appointment_letter',
  label: 'Appointment Letter',
  icon: 'BriefcaseBusiness',
  description: 'Formal employment appointment with role, compensation, probation and service terms.',
  category: 'Onboarding',
  requires_status: null,
  is_active: true,
  extra_fields: [
    { key: 'appointment_date', label: 'Appointment Date', type: 'date' },
    { key: 'employment_type', label: 'Employment Type', type: 'text', default: 'Full Time' },
    { key: 'probation_period', label: 'Probation Period', type: 'text', default: '3 months' },
    { key: 'monthly_salary', label: 'Monthly Gross Salary (₹)', type: 'number' },
    { key: 'annual_ctc', label: 'Annual CTC (₹)', type: 'number' },
    { key: 'work_location', label: 'Work Location', type: 'text', default: 'Vadodara, Gujarat' },
    { key: 'reporting_manager', label: 'Reporting Manager', type: 'text', default: 'Founder / Authorised Reporting Manager' },
    { key: 'working_hours', label: 'Working Hours', type: 'text', default: 'As per the schedule assigned by management' },
    { key: 'notice_period_days', label: 'Notice Period (Days)', type: 'number', default: '30' },
    { key: 'benefits', label: 'Benefits & Allowances', type: 'textarea', default: 'As applicable under Company policy' },
    { key: 'authorized_representative', label: 'Authorised Representative', type: 'text', default: 'Ronak Dave' },
    { key: 'representative_designation', label: 'Representative Designation', type: 'text', default: 'Founder / Authorised Representative' },
  ],
  body_template: String.raw`# APPOINTMENT

Dear **{{employee_name}}**,

With reference to the discussions and your acceptance of our employment offer, we are pleased to appoint you at **PlanMyBaraat** on the following terms and conditions. Your appointment will take effect from **{{appointment_date}}**.

# 1. POSITION AND APPOINTMENT DETAILS

**Employee Name:** {{employee_name}}

**Employee Code:** {{employee_code}}

**Designation:** {{designation}}

**Department:** {{department}}

**Employment Type:** {{employment_type}}

**Appointment Date:** {{appointment_date}}

**Work Location:** {{work_location}}

**Reporting Manager:** {{reporting_manager}}

The Company may reasonably change your reporting structure, work location, duties or project allocation according to operational requirements.

# 2. COMPENSATION AND BENEFITS

**Monthly Gross Salary:** ₹{{monthly_salary}}/-

**Annual Cost to Company:** ₹{{annual_ctc}}/-

**Benefits and Allowances:** {{benefits}}

Salary will be processed according to the Company payroll cycle and will be subject to attendance, applicable deductions, taxes and statutory requirements.

Any incentive, reimbursement, bonus or additional benefit not stated in this letter will apply only when separately approved in writing by the Company.

# 3. PROBATION AND CONFIRMATION

Your initial probation period will be **{{probation_period}}** from the appointment date.

During probation, the Company will review your attendance, conduct, quality of work, technical or professional capability, communication and suitability for the role.

Confirmation of employment is not automatic and will be communicated separately in writing. The Company may extend probation where additional performance assessment is reasonably required.

# 4. DUTIES AND PROFESSIONAL RESPONSIBILITIES

You shall perform the responsibilities associated with your designation and any other reasonable duties assigned by the Company.

You shall complete assigned work accurately, professionally and within communicated timelines.

You shall maintain regular work reports, documentation and status updates whenever required.

You shall follow lawful instructions issued by the Founder, reporting manager or another authorised representative.

You shall coordinate respectfully with colleagues, clients, vendors and authorised service providers.

You shall protect the reputation, commercial interests, information and property of PlanMyBaraat.

# 5. WORKING HOURS, ATTENDANCE AND LEAVE

**Working Hours / Schedule:** {{working_hours}}

You shall maintain punctuality and regular attendance and follow the attendance system prescribed by the Company.

Planned leave requires advance approval from the reporting manager. Illness or an emergency must be communicated as soon as reasonably possible.

Because PlanMyBaraat operates in the wedding and event-management industry, reasonable schedule changes may occasionally be required for events, launches, campaigns, client commitments or operational deadlines.

# 6. CONFIDENTIALITY, DATA SECURITY AND INTELLECTUAL PROPERTY

All customer, vendor, employee, pricing, lead, account, credential, strategy, source-code, design, document and operational information accessed through your work is confidential.

Confidential information shall be used only for authorised Company work and shall not be copied, shared, retained or transferred without permission.

Passwords, OTPs, dashboards, devices, databases and digital accounts must be protected and any suspected breach must be reported immediately.

All work, documents, designs, code, content, research, processes and other material created for the Company during employment shall remain the exclusive property of PlanMyBaraat.

These confidentiality, security and ownership obligations continue after your employment ends.

# 7. PROFESSIONAL CONDUCT AND COMPANY POLICY

You shall maintain honesty, discipline, professionalism and respectful behaviour at all times.

Fraud, harassment, insubordination, data misuse, credential sharing, falsification of records, unauthorised absence, deliberate system damage or serious misconduct may result in disciplinary action.

You shall comply with applicable Company policies, safety requirements, information-security instructions and lawful management directions as updated from time to time.

# 8. CONFLICT OF INTEREST

You shall not accept outside employment, freelance work or a business assignment that conflicts with Company duties, affects attendance or deadlines, competes with Company projects, involves Company clients or vendors without approval, or uses Company information or resources.

Any possible conflict of interest must be disclosed to management in advance.

# 9. RESIGNATION AND TERMINATION

You must provide at least **{{notice_period_days}} days’ written notice** if you wish to resign, unless a different period is approved in writing.

During the notice period, you must complete assigned work, cooperate with transition requirements and provide a complete handover.

The Company may end employment for performance, attendance, misconduct, breach of confidentiality, operational requirements or another lawful reason, subject to applicable law and Company policy.

Serious misconduct, fraud, data theft, credential misuse or deliberate damage may result in immediate action.

# 10. HANDOVER AND FULL-AND-FINAL CLEARANCE

On resignation, termination or another end of employment, you shall return all Company property, files, credentials, documents, devices and access.

You shall remove Company information from personal devices or accounts after the authorised handover is confirmed.

Full-and-final settlement and applicable service documents will be processed after completion of handover, asset clearance and management approval.

# 11. ACCEPTANCE OF APPOINTMENT

This Appointment Letter, the Staff Agreement, applicable Company policies and subsequent written communications form the terms governing your employment.

By signing below, you confirm that the information and documents supplied by you are accurate and that you understand and accept the terms of this appointment.

We welcome you to PlanMyBaraat and look forward to a professional and rewarding association.

## FOR PLANMYBARAAT

**Signature:** {{authorized_representative}}

## ACCEPTED BY THE STAFF MEMBER

**Name:** {{employee_name}}

**Signature:** ______________________________

**Date:** ______________________________`,
};
