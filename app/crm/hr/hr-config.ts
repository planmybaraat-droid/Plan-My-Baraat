import {
  Send, LogIn, GraduationCap, Award, LogOut, TrendingUp, ShieldCheck,
  AlertTriangle, Ban, ArrowUpCircle, CheckCircle2, FileText, BriefcaseBusiness,
} from 'lucide-react';
import type {
  EmployeeDocumentStatus, LetterExtraFieldDef, PayrollFormData, PayrollStatus, SalaryRecord,
} from '../lib/types';
// HR reuses the exact same currency/date formatting already used across
// Agreements, Vendor Agreements and Invoices — no new formatting language.
import { currency, formatAgreementDate } from '../agreements/agreement-config';

export { currency, formatAgreementDate };

// Letter icon names are stored as plain strings in crm_letter_templates
// (Supabase), never hardcoded per-letter here — this map only translates
// those strings into the matching lucide-react component for rendering.
export const LETTER_ICON_MAP: Record<string, typeof FileText> = {
  Send, LogIn, GraduationCap, Award, LogOut, TrendingUp, ShieldCheck,
  AlertTriangle, Ban, ArrowUpCircle, CheckCircle2, BriefcaseBusiness,
};
export function letterIcon(name: string) {
  return LETTER_ICON_MAP[name] || FileText;
}

export const EMPLOYEE_DOCUMENT_STATUSES: EmployeeDocumentStatus[] = ['Pending', 'Verified', 'Rejected'];

export const KYC_DOCUMENT_GROUPS: { label: string; categories: string[] }[] = [
  { label: 'Identity', categories: ['Aadhaar Card', 'PAN Card', 'Driving Licence'] },
  { label: 'Education', categories: ['10th Marksheet', '12th Marksheet', 'Graduation', 'Resume'] },
  { label: 'Employment', categories: ['Offer Letter', 'Appointment Letter', 'Joining Letter', 'Experience Letter', 'Relieving Letter', 'Internship Certificate', 'Staff Agreement', 'Employment Agreement', 'NDA'] },
  { label: 'Bank', categories: ['Passbook'] },
];
export const KYC_ALL_CATEGORIES = KYC_DOCUMENT_GROUPS.flatMap(group => group.categories);

export const PAYROLL_STATUSES: PayrollStatus[] = ['Paid', 'Pending', 'Hold', 'Processing'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function monthLabel(month: number, year: number) {
  return `${MONTH_NAMES[month - 1] || ''} ${year}`;
}

// Standard India payroll split used everywhere salary is derived from a
// single annual figure (offer/increment/promotion letters) — kept in one
// place so the wizard preview and the DB automation trigger agree exactly.
export function splitAnnualSalary(annual: number) {
  const monthly = annual / 12;
  const basic_salary = Math.round(monthly * 0.5 * 100) / 100;
  const hra = Math.round(basic_salary * 0.5 * 100) / 100;
  const special_allowance = Math.round((monthly * 0.5 - hra) * 100) / 100;
  const pf = Math.round(basic_salary * 0.12 * 100) / 100;
  const professional_tax = 200;
  const gross_salary = Math.round((basic_salary + hra + special_allowance) * 100) / 100;
  const net_salary = Math.round((gross_salary - pf - professional_tax) * 100) / 100;
  return { basic_salary, hra, special_allowance, pf, professional_tax, gross_salary, net_salary };
}

export function calculateSalaryTotals(input: {
  basic_salary: number; hra: number; special_allowance: number; travel_allowance: number;
  bonus: number; incentive: number; pf: number; esic: number; professional_tax: number; other_deduction: number;
}) {
  const gross = input.basic_salary + input.hra + input.special_allowance + input.travel_allowance + input.bonus + input.incentive;
  const deductions = input.pf + input.esic + input.professional_tax + input.other_deduction;
  return { gross_salary: Math.round(gross * 100) / 100, net_salary: Math.round((gross - deductions) * 100) / 100 };
}

export function createBlankPayroll(employeeId: string, month: number, year: number, salary?: SalaryRecord | null): PayrollFormData {
  const base = {
    basic_salary: salary?.basic_salary ?? 0,
    hra: salary?.hra ?? 0,
    special_allowance: salary?.special_allowance ?? 0,
    travel_allowance: salary?.travel_allowance ?? 0,
    bonus: 0,
    incentive: 0,
    pf: salary?.pf ?? 0,
    esic: salary?.esic ?? 0,
    professional_tax: salary?.professional_tax ?? 200,
    other_deduction: salary?.other_deduction ?? 0,
  };
  const totals = calculateSalaryTotals(base);
  return {
    employee_id: employeeId,
    month,
    year,
    ...base,
    gross_salary: totals.gross_salary,
    net_salary: totals.net_salary,
    status: 'Pending',
    paid_on: null,
    payment_reference: '',
  };
}

// Substitutes {{key}} placeholders in a letter template body. Every letter
// always resolves the employee's own profile fields automatically — only
// the letter-specific fields in `extra` need to be supplied by staff.
export function renderLetterText(template: string, employee: {
  full_name: string; designation?: string | null; job_title: string; department: string; joining_date: string;
  address?: string | null; mobile?: string | null; work_location?: string | null;
}, extra: Record<string, string | number>) {
  const today = formatAgreementDate(new Date().toISOString().slice(0, 10));
  const extraValues = Object.fromEntries(Object.entries(extra).map(([key, value]) => [
    key,
    /_date$/.test(key) && typeof value === 'string' && value ? formatAgreementDate(value) : String(value ?? ''),
  ]));
  const values: Record<string, string> = {
    employee_name: employee.full_name,
    designation: employee.designation || employee.job_title,
    department: employee.department,
    joining_date: employee.joining_date ? formatAgreementDate(employee.joining_date) : '',
    employee_address: employee.address || '',
    employee_mobile: employee.mobile || '',
    work_location: employee.work_location || 'PlanMyBaraat Office, Vadodara',
    date: today,
    ...extraValues,
    experience_end_display: extraValues.experience_end_date || 'Till Date',
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? '');
}

export function fieldDefault(field: LetterExtraFieldDef, employee?: { current_salary?: number }) {
  if (field.default !== undefined) return field.default;
  if (field.key === 'current_salary' && employee?.current_salary) return String(employee.current_salary);
  if (field.required === false) return '';
  if (field.type === 'date') return new Date().toISOString().slice(0, 10);
  return '';
}
