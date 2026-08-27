// ─── CRM TypeScript Types ───────────────────────────────────────────────────

export type CrmStatus = 'New' | 'Contacted' | 'Interested' | 'Converted' | 'Lost';

// ─── Master Data ─────────────────────────────────────────────────────────────

export interface City {
  id: string;
  name: string;
  state: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface PackageItem {
  category_id: string;
  category_name: string;
  label?: string;
  vendor_cost: number;
  selling_price: number;
}

export interface VendorPackage {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  features: string | null;
  type?: 'vendor' | 'customer';
  items?: PackageItem[] | null;
  vendor_cost?: number | null;
  created_at: string;
}

// ─── Vendors ─────────────────────────────────────────────────────────────────

export interface Vendor {
  id: string;
  company_name: string;
  contact_person: string;
  mobile: string;
  email: string | null;
  city_id: string | null;
  category_id: string | null;
  package_id: string | null;
  status: CrmStatus;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  // joined
  city?: City;
  category?: Category;
  vendor_package?: VendorPackage;
}

export interface VendorFormData {
  company_name: string;
  contact_person: string;
  mobile: string;
  email: string;
  city_id: string;
  category_id: string;
  package_id: string;
  status: CrmStatus;
  remarks: string;
}

// ─── Customer Leads ───────────────────────────────────────────────────────────

export interface CustomerLead {
  id: string;
  customer_name: string;
  mobile: string;
  email: string | null;
  city_id: string | null;
  requirement: string | null;
  event_date: string | null;
  package_discussed: string | null;
  status: CrmStatus;
  remarks: string | null;
  assigned_to?: string | null;
  created_at: string;
  updated_at: string;
  // joined
  city?: City;
}

export interface LeadFormData {
  customer_name: string;
  mobile: string;
  email: string;
  city_id: string;
  requirement: string;
  event_date: string;
  package_discussed: string;
  status: CrmStatus;
  remarks: string;
  assigned_to?: string | null;
}

// ─── Baraat Package Enquiries (separate module from Customer Leads) ─────────

export interface BaraatEnquiry {
  id: string;
  customer_name: string;
  event_date: string | null;
  mobile: string;
  package_name: string;
  status: CrmStatus;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface BaraatEnquiryFilters {
  search: string;
  status: string;
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export interface Note {
  id: string;
  entity_type: 'vendor' | 'lead';
  entity_id: string;
  content: string;
  created_by: string | null;
  created_at: string;
}

// ─── Uploaded Files ───────────────────────────────────────────────────────────

export interface UploadedFile {
  id: string;
  entity_type: 'vendor' | 'lead' | 'agreement' | 'vendor_agreement';
  entity_id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface VendorStats {
  total: number;
  new: number;
  contacted: number;
  interested: number;
  converted: number;
  lost: number;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  interested: number;
  converted: number;
  lost: number;
  upcoming_events: number;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface VendorFilters {
  search: string;
  city_id: string;
  category_id: string;
  status: string;
}

export interface LeadFilters {
  search: string;
  city_id: string;
  status: string;
  event_date_from: string;
  event_date_to: string;
}

// ─── Baraat Management Contracts ────────────────────────────────────────────

export type AgreementStatus = 'Draft' | 'Sent' | 'Signed' | 'Completed' | 'Cancelled';

export interface AgreementService {
  id: string;
  name: string;
  enabled: boolean;
  quantity: number;
  option: string;
  color: string;
  decoration: string;
  purpose: string;
  multi_options: string[];
  customization: string;
  client_remark: string;
  internal_note: string;
  special_instructions: string;
  is_custom?: boolean;
}

export interface AgreementActivity {
  id: string;
  type: 'created' | 'updated' | 'status' | 'sent' | 'downloaded' | 'printed' | 'attachment' | 'duplicated';
  title: string;
  detail: string;
  actor: string;
  created_at: string;
}

export interface AgreementAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  created_at: string;
}

export interface AgreementRevision {
  version: number;
  created_at: string;
  created_by: string;
  summary: string;
  snapshot: Omit<AgreementFormData, 'revisions' | 'activity'>;
}

export interface AgreementFormData {
  agreement_number: string;
  version: number;
  status: AgreementStatus;
  created_date: string;
  client_name: string;
  groom_name: string;
  bride_name: string;
  mobile: string;
  alternate_mobile: string;
  email: string;
  address: string;
  agreement_date: string;
  event_date: string;
  venue: string;
  maps_link: string;
  start_time: string;
  end_time: string;
  hard_stop_time: string;
  event_coordinator: string;
  sales_executive: string;
  // Widened to plain string (rather than a strict literal union of the
  // current 4 package names) so historical agreements/quotations saved
  // under the older package names (Raj Tilak, Rajwada, Maharaja, Signature,
  // Custom) still type-check and display correctly — package names can
  // change again in future without breaking old records.
  package_name: string;
  package_price: number;
  discount: number;
  gst_percent: number;
  final_amount: number;
  booking_amount: number;
  remaining_amount: number;
  services: AgreementService[];
  client_notes: string;
  special_requirements: string;
  vendor_instructions: string;
  internal_staff_notes: string;
  logistics_notes: string;
  second_installment: number;
  final_payment: number;
  outstanding: number;
  // Whether each scheduled installment has actually been received — the
  // amount fields above hold the *scheduled* (policy-split) amount as soon
  // as a package is chosen, which previously made every fresh agreement
  // look fully paid immediately. These flags let staff explicitly confirm
  // receipt per milestone so "remaining amount" reflects reality. Missing/
  // undefined on older records is treated as already paid (see
  // `isInstallmentPaid` in agreement-config.ts) to preserve pre-existing
  // behaviour for agreements created before this field existed.
  booking_paid?: boolean;
  second_installment_paid?: boolean;
  final_payment_paid?: boolean;
  payment_mode: string;
  transaction_reference: string;
  attachments: AgreementAttachment[];
  activity: AgreementActivity[];
  revisions: AgreementRevision[];
}

export interface AgreementRecord extends AgreementFormData {
  id: string;
  created_at: string;
  updated_at: string;
  // Public, non-guessable code used by the "Scan to Verify" QR code on the
  // PDF — resolves via the crm_verify_document() RPC, not the record id.
  verification_code: string;
}

export interface AgreementFilters {
  search: string;
  status: string;
  package_name: string;
  event_date_from: string;
  event_date_to: string;
}

// ─── Vendor Agreements ───────────────────────────────────────────────────────
// Mirrors the Baraat Management Contract module's shape/conventions exactly
// (same activity/revision pattern, same JSON-payload-as-PDF-snapshot
// architecture) so it behaves like a natural extension of it rather than a
// bolted-on second system.

export type VendorAgreementStatus = 'Draft' | 'Sent' | 'Signed' | 'Active' | 'Expired' | 'Terminated' | 'Cancelled';
export type VendorVerificationStatus = 'Pending' | 'Verified' | 'Rejected';
export type VendorBlacklistStatus = 'Active' | 'Suspended' | 'Blacklisted';
export type VendorCommissionType = 'Percentage' | 'Flat';
export type VendorPaymentSchedule = 'Per Event' | 'Weekly' | 'Monthly' | 'Advance + Balance on Completion';

export interface VendorAgreementService {
  id: string;
  name: string;
  enabled: boolean;
  option: string;
  base_price: number;
  extra_hour_charge: number;
  travel_charge: number;
  capacity: string;
  tax_percent: number;
  advance_required: number;
  service_area: string;
  is_custom?: boolean;
}

export interface VendorDocumentFile {
  id: string;
  category: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_at: string;
  expiry_date?: string;
  verified?: boolean;
}

export interface VendorAgreementActivity {
  id: string;
  type: 'created' | 'updated' | 'status' | 'sent' | 'downloaded' | 'printed' | 'document' | 'duplicated';
  title: string;
  detail: string;
  actor: string;
  created_at: string;
}

export interface VendorAgreementRevision {
  version: number;
  created_at: string;
  created_by: string;
  summary: string;
  snapshot: Omit<VendorAgreementFormData, 'revisions' | 'activity'>;
}

export interface VendorAgreementFormData {
  vendor_agreement_number: string;
  version: number;
  status: VendorAgreementStatus;
  created_date: string;
  agreement_date: string;

  // Step 1 — Vendor details
  vendor_id: string;
  vendor_name: string;
  business_name: string;
  contact_person: string;
  mobile: string;
  alternate_mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  service_category: string;
  gstin: string;
  pan_number: string;
  aadhaar_number: string;
  bank_account_name: string;
  bank_account_number: string;
  ifsc_code: string;
  bank_name: string;
  upi_id: string;
  emergency_contact_name: string;
  emergency_contact_mobile: string;
  verification_status: VendorVerificationStatus;

  // Step 2 — Services & commercial details
  services: VendorAgreementService[];

  // Step 3 — Payment & agreement
  commission_type: VendorCommissionType;
  commission_percent: number;
  flat_commission_amount: number;
  payment_schedule: VendorPaymentSchedule;
  payment_release_condition: string;
  gst_applicable: boolean;
  gst_percent: number;
  agreement_start_date: string;
  agreement_end_date: string;
  agreement_validity_months: number;
  auto_renewal: boolean;
  renewal_notice_days: number;

  // Step 4 — Documents
  documents: VendorDocumentFile[];

  // Step 5 — Terms
  special_conditions: string;
  internal_staff_notes: string;

  // Performance & standing (tracked throughout the vendor's lifecycle, shown
  // in Review & Generate and on the list/detail views)
  performance_score: number;
  reliability_rating: number;
  completed_events: number;
  cancellation_count: number;
  complaint_count: number;
  on_time_percent: number;
  preferred_vendor: boolean;
  blacklist_status: VendorBlacklistStatus;

  activity: VendorAgreementActivity[];
  revisions: VendorAgreementRevision[];
}

export interface VendorAgreementRecord extends VendorAgreementFormData {
  id: string;
  created_at: string;
  updated_at: string;
  verification_code: string;
}

export interface VendorAgreementFilters {
  search: string;
  status: string;
  verification_status: string;
  blacklist_status: string;
  service_category: string;
}

// ─── Client Invoices & Receipts ─────────────────────────────────────────────

export type InvoiceDocumentType = 'Proforma Invoice' | 'Advance Receipt Voucher' | 'Tax Invoice';
export type InvoiceStatus = 'Draft' | 'Issued' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceLineItem {
  id: string;
  description: string;
  sac_code: string;
  quantity: number;
  rate: number;
  taxable_amount: number;
}

export interface InvoicePayment {
  id: string;
  receipt_number: string;
  payment_date: string;
  amount: number;
  payment_mode: string;
  transaction_reference: string;
  notes: string;
  recorded_by: string;
  created_at: string;
}

export interface InvoiceFormData {
  invoice_number: string;
  supplier_profile: BusinessProfile;
  agreement_id: string;
  agreement_number: string;
  document_type: InvoiceDocumentType;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  client_name: string;
  mobile: string;
  email: string;
  billing_address: string;
  client_gstin: string;
  place_of_supply: string;
  state_code: string;
  event_date: string;
  venue: string;
  package_name: string;
  line_items: InvoiceLineItem[];
  subtotal: number;
  discount: number;
  taxable_value: number;
  gst_percent: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_amount: number;
  amount_paid: number;
  balance_due: number;
  payments: InvoicePayment[];
  client_note: string;
  payment_terms: string;
  created_by_name: string;
}

export interface InvoiceRecord extends InvoiceFormData {
  id: string;
  created_at: string;
  updated_at: string;
  verification_code: string;
}

export interface InvoiceFilters {
  search: string;
  status: string;
  document_type: string;
  issue_date_from: string;
  issue_date_to: string;
}

export interface BusinessProfile {
  legal_name: string;
  trade_name: string;
  address: string;
  city: string;
  state: string;
  state_code: string;
  pincode: string;
  gstin: string;
  pan: string;
  email: string;
  mobile: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  ifsc: string;
  upi_id: string;
  default_sac_code: string;
  authorized_signatory: string;
}

// ─── Client Quotations ──────────────────────────────────────────────────────

export type QuotationStatus = 'Draft' | 'Sent' | 'Negotiation' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted';
export type QuotationPricingMode = 'Package Pricing' | 'Detailed Pricing';

export interface QuotationService extends AgreementService {
  unit_price: number;
  amount: number;
  is_addon: boolean;
}

export interface QuotationActivity {
  id: string;
  type: 'created' | 'updated' | 'status' | 'converted' | 'downloaded';
  title: string;
  detail: string;
  actor: string;
  created_at: string;
}

export interface QuotationRevision {
  version: number;
  created_at: string;
  created_by: string;
  summary: string;
  snapshot: Omit<QuotationFormData, 'revisions' | 'activity'>;
}

export interface QuotationFormData {
  quotation_number: string;
  version: number;
  status: QuotationStatus;
  created_date: string;
  valid_until: string;
  client_name: string;
  groom_name: string;
  bride_name: string;
  mobile: string;
  alternate_mobile: string;
  email: string;
  address: string;
  event_date: string;
  venue: string;
  start_time: string;
  end_time: string;
  sales_executive: string;
  package_name: AgreementFormData['package_name'];
  pricing_mode: QuotationPricingMode;
  package_price: number;
  services: QuotationService[];
  subtotal: number;
  discount: number;
  taxable_value: number;
  gst_percent: number;
  gst_amount: number;
  total_amount: number;
  suggested_booking_amount: number;
  client_note: string;
  special_requirements: string;
  exclusions: string;
  payment_terms: string;
  created_by_name: string;
  converted_agreement_id: string;
  revisions: QuotationRevision[];
  activity: QuotationActivity[];
}

export interface QuotationRecord extends QuotationFormData {
  id: string;
  created_at: string;
  updated_at: string;
  verification_code: string;
}

export interface QuotationFilters {
  search: string;
  status: string;
  package_name: string;
  event_date_from: string;
  event_date_to: string;
}

// ─── Staff & Attendance ─────────────────────────────────────────────────────

export type StaffStatus = 'Active' | 'On Leave' | 'Inactive';
export type EmploymentType = 'Full Time' | 'Part Time' | 'Contract' | 'Intern';
export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day' | 'On Leave' | 'Weekly Off' | 'Holiday';

export type CrmRole = 'admin' | 'super_admin' | 'staff' | 'sales' | 'manager' | 'vendor' | 'accountant';

export interface StaffFormData {
  employee_code: string;
  full_name: string;
  mobile: string;
  email: string;
  job_title: string;
  department: string;
  employment_type: EmploymentType;
  joining_date: string;
  date_of_birth: string;
  blood_group: string;
  status: StaffStatus;
  work_location: string;
  shift_start: string;
  shift_end: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_mobile: string;
  notes: string;
  // CRM login — only used when creating/managing the linked auth account.
  crm_id: string;
  role: CrmRole;
  password?: string;
}

export type HrLifecycleStatus = 'Active' | 'Intern' | 'Notice Period' | 'Terminated' | 'Ex-Employee';

export interface StaffRecord extends StaffFormData {
  id: string;
  user_id: string | null;
  last_sign_in_at?: string | null;
  created_at: string;
  updated_at: string;
  // Added for the HR module — optional so existing Staff module code paths
  // that construct a StaffRecord without them keep compiling unchanged.
  photo_url?: string | null;
  designation?: string | null;
  reporting_manager_id?: string | null;
  hr_lifecycle_status?: HrLifecycleStatus;
  current_salary?: number;
}

export interface AttendanceRecord {
  id?: string;
  staff_id: string;
  attendance_date: string;
  status: AttendanceStatus;
  check_in: string;
  check_out: string;
  break_minutes: number;
  overtime_minutes: number;
  note: string;
  punch_in_selfie_url?: string | null;
  punch_out_selfie_url?: string | null;
  punch_in_device?: string | null;
  punch_out_device?: string | null;
  punch_in_browser?: string | null;
  punch_out_browser?: string | null;
  punch_in_at?: string | null;
  punch_out_at?: string | null;
  is_locked?: boolean;
  lock_at?: string | null;
  created_at?: string;
  updated_at?: string;
  staff?: StaffRecord;
  breaks?: AttendanceBreakRecord[];
}

export interface AttendanceBreakRecord {
  id: string;
  attendance_id: string;
  staff_id: string;
  break_start_at: string;
  break_end_at: string | null;
  duration_minutes: number;
  break_start_selfie_url?: string | null;
  break_end_selfie_url?: string | null;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export type AttendanceWorkState = 'not_punched_in' | 'working' | 'on_break' | 'completed';

export interface MyAttendanceState {
  record: AttendanceRecord | null;
  breaks: AttendanceBreakRecord[];
  active_break: AttendanceBreakRecord | null;
  state: AttendanceWorkState;
  total_break_minutes: number;
  shift_minutes: number;
  net_working_minutes: number;
  is_locked?: boolean;
  lock_at?: string | null;
}

export interface StaffFilters {
  search: string;
  department: string;
  status: string;
  employment_type: string;
}

export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Paid Leave' | 'Unpaid Leave' | 'Other';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface LeaveRequest {
  id: string;
  request_number: string;
  staff_id: string;
  leave_type: LeaveType;
  from_date: string;
  to_date: string;
  number_of_days: number;
  reason: string;
  attachment_path: string | null;
  attachment_name: string | null;
  status: LeaveStatus;
  created_by: string;
  reviewed_by: string | null;
  reviewed_by_name: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  staff?: StaffRecord;
}

// ─── HR Module: Letters ─────────────────────────────────────────────────────

export type LetterType =
  | 'offer_letter' | 'joining_letter' | 'internship_letter' | 'experience_letter'
  | 'relieving_letter' | 'salary_increment_letter' | 'noc' | 'warning_letter'
  | 'termination_letter' | 'promotion_letter' | 'resignation_acceptance_letter'
  | 'intern_agreement' | 'appointment_letter';

export type LetterCategory = 'Onboarding' | 'Compensation' | 'Compliance' | 'Exit';
export type LetterExtraFieldType = 'text' | 'number' | 'date' | 'textarea';
export type EmployeeLetterStatus = 'Generated' | 'Sent' | 'Archived';

export interface LetterExtraFieldDef {
  key: string;
  label: string;
  type: LetterExtraFieldType;
  default?: string;
  required?: boolean;
  hint?: string;
}

export interface LetterTemplate {
  id: string;
  letter_type: LetterType;
  label: string;
  description: string;
  icon: string;
  category: LetterCategory;
  body_template: string;
  extra_fields: LetterExtraFieldDef[];
  requires_status: HrLifecycleStatus | null;
  is_active: boolean;
}

export interface EmployeeLetterFormData {
  employee_id: string;
  letter_type: LetterType;
  extra_fields: Record<string, string | number>;
  rendered_text: string;
  status: EmployeeLetterStatus;
  file_url?: string | null;
  generated_by_name: string;
}

export interface EmployeeLetterRecord extends EmployeeLetterFormData {
  id: string;
  letter_number: string;
  verification_code: string;
  generated_by: string | null;
  created_at: string;
  updated_at: string;
  employee?: StaffRecord;
}

// ─── HR Module: KYC & Documents ─────────────────────────────────────────────

export type EmployeeDocumentStatus = 'Pending' | 'Verified' | 'Rejected';

export interface EmployeeDocumentRecord {
  id: string;
  employee_id: string;
  category: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  status: EmployeeDocumentStatus;
  verified_by: string | null;
  verified_by_name: string | null;
  verified_at: string | null;
  remarks: string;
  created_at: string;
  updated_at: string;
}

// ─── HR Module: Salary & Payroll ────────────────────────────────────────────

export type SalaryRecordStatus = 'Active' | 'Held' | 'Stopped';
export type SalaryEventType = 'Offer' | 'Increment' | 'Promotion' | 'Revision' | 'Transfer' | 'Confirmation';
export type PayrollStatus = 'Paid' | 'Pending' | 'Hold' | 'Processing';

export interface SalaryRecord {
  id: string;
  employee_id: string;
  basic_salary: number;
  hra: number;
  special_allowance: number;
  travel_allowance: number;
  bonus: number;
  incentive: number;
  pf: number;
  esic: number;
  professional_tax: number;
  other_deduction: number;
  gross_salary: number;
  net_salary: number;
  effective_date: string;
  status: SalaryRecordStatus;
  created_at: string;
  updated_at: string;
}

export interface SalaryHistoryEntry {
  id: string;
  employee_id: string;
  event_type: SalaryEventType;
  previous_salary: number;
  new_salary: number;
  effective_date: string;
  reason: string | null;
  source_letter_id: string | null;
  created_at: string;
}

export interface PayrollFormData {
  employee_id: string;
  month: number;
  year: number;
  basic_salary: number;
  hra: number;
  special_allowance: number;
  travel_allowance: number;
  bonus: number;
  incentive: number;
  gross_salary: number;
  pf: number;
  esic: number;
  professional_tax: number;
  other_deduction: number;
  net_salary: number;
  status: PayrollStatus;
  paid_on?: string | null;
  payment_reference?: string | null;
}

export interface PayrollRecord extends PayrollFormData {
  id: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  employee?: StaffRecord;
  payslip?: PayslipRecord | null;
}

export interface PayslipRecord {
  id: string;
  payroll_id: string;
  payslip_number: string;
  file_url: string | null;
  verification_code: string;
  generated_at: string;
  created_at: string;
}

export interface HrAuditLogEntry {
  id: string;
  employee_id: string | null;
  action: string;
  detail: string | null;
  actor: string | null;
  actor_name: string | null;
  created_at: string;
}

// ─── HR Module: ID Cards ────────────────────────────────────────────────────

export type IdCardStatus = 'Draft' | 'Generated' | 'Active' | 'Expired' | 'Revoked';

// What was actually printed on a given version — captured at generation time
// so a later edit to the staff record never silently rewrites an
// already-issued card. Deliberately excludes anything not shown in #7 of the
// spec. Blood group is copied from crm_staff when a draft is created so an
// issued card remains an immutable historical snapshot.
export interface IdCardFrontSnapshot {
  full_name: string;
  employee_code: string;
  designation: string;
  department: string;
  photo_url: string | null;
  joining_date: string;
}

export interface IdCardBackSnapshot {
  mobile: string;
  email: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_mobile: string;
  blood_group?: string;
}

export interface IdCardRecord {
  id: string;
  employee_id: string;
  card_number: string;
  version: number;
  status: IdCardStatus;
  front_snapshot: IdCardFrontSnapshot;
  back_snapshot: IdCardBackSnapshot;
  verification_code: string;
  pdf_path: string | null;
  file_url?: string | null; // signed URL, resolved on read — never stored
  issued_date: string | null;
  expires_on: string | null;
  generated_at: string | null;
  generated_by: string | null;
  created_at: string;
  updated_at: string;
  employee?: StaffRecord;
}

export type IdCardDuplexMode = 'long_edge' | 'short_edge';

export interface IdCardSettings {
  card_width_mm: number;
  card_height_mm: number;
  bleed_mm: number;
  safe_margin_mm: number;
  sheet_width_mm: number;
  sheet_height_mm: number;
  sheet_margin_mm: number;
  horizontal_gap_mm: number;
  vertical_gap_mm: number;
  duplex_mode: IdCardDuplexMode;
  validity_years: number;
  updated_at?: string;
}
