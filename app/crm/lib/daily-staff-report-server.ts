import 'server-only';

import { readFile } from 'fs/promises';
import path from 'path';
import { jsPDF } from 'jspdf';
import { supabaseAdmin } from './supabase-admin';

const REPORT_BUCKET = 'daily-staff-reports';
const DEFAULT_GRAPH_VERSION = 'v23.0';

type ReportSettings = {
  id: number;
  is_enabled: boolean;
  recipient_e164: string;
  whatsapp_template_name: string;
  whatsapp_template_language: string;
  max_attempts: number;
};

type AttendanceSettings = {
  business_timezone: string;
  lock_time: string;
  working_days: number[];
};

type StaffRow = {
  id: string;
  user_id: string | null;
  full_name: string;
  designation: string | null;
  job_title: string;
  department: string;
};

type AttendanceRow = {
  staff_id: string;
  status: string;
  check_in: string | null;
  check_out: string | null;
  punch_in_at: string | null;
  punch_out_at: string | null;
  break_minutes: number;
  overtime_minutes: number;
};

type LeaveRow = { staff_id: string };
type ReportItem = { activity_title: string; description: string; activity_status: 'DONE' | 'PENDING'; created_at: string; deleted_at: string | null };
type WorkReportRow = {
  id: string;
  user_id: string;
  report_status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED';
  crm_daily_work_report_items: ReportItem[] | null;
};

export type StaffReportEntry = {
  staffId: string;
  userId: string | null;
  name: string;
  designation: string;
  attendanceStatus: string;
  punchIn: string | null;
  punchOut: string | null;
  punchInAt: string | null;
  punchOutAt: string | null;
  reportStatus: 'Submitted' | 'Not Submitted' | 'Not Required';
  items: ReportItem[];
};

export type DailyStaffReport = {
  date: string;
  timezone: string;
  staff: StaffReportEntry[];
  summary: {
    totalStaff: number;
    present: number;
    absent: number;
    leave: number;
    incomplete: number;
    submitted: number;
    notSubmitted: number;
    notRequired: number;
    completedActivities: number;
    pendingActivities: number;
  };
};

type RunOptions = { reportDate?: string; requestedBy?: string | null; retryFailed?: boolean };

function requireAdminClient() {
  if (!supabaseAdmin) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured on the server.');
  return supabaseAdmin;
}

function localParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', weekday: 'short',
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value || '';
  return {
    date: `${value('year')}-${value('month')}-${value('day')}`,
    time: `${value('hour')}:${value('minute')}:${value('second')}`,
  };
}

function shiftIsoDate(date: string, days: number) {
  const shifted = new Date(`${date}T12:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted.toISOString().slice(0, 10);
}

function isoWeekday(date: string) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day === 0 ? 7 : day;
}

function normalizeRecipient(value: string) {
  return value.replace(/\D/g, '').replace(/^0+/, '');
}

function displayDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-IN', {
    timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function displayDateUpper(date: string) {
  return displayDate(date).toUpperCase();
}

function displayTime(value: string | null) {
  if (!value) return 'Not Marked';
  const [hourText, minute = '00'] = value.slice(0, 5).split(':');
  const hour = Number(hourText);
  return `${hour % 12 || 12}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function displayTimestamp(value: string | null, timezone: string) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: timezone, day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(new Date(value));
}

async function getConfiguration() {
  const admin = requireAdminClient();
  const [{ data: settings, error: settingsError }, { data: attendance, error: attendanceError }] = await Promise.all([
    admin.from('crm_daily_staff_report_settings').select('*').eq('id', 1).single(),
    admin.from('crm_attendance_settings').select('business_timezone,lock_time,working_days').eq('id', 1).single(),
  ]);
  if (settingsError) throw new Error(`Daily report settings could not be loaded: ${settingsError.message}`);
  if (attendanceError) throw new Error(`Attendance settings could not be loaded: ${attendanceError.message}`);
  return { settings: settings as ReportSettings, attendance: attendance as AttendanceSettings };
}

export async function buildDailyStaffReport(reportDate: string, timezone = 'Asia/Kolkata'): Promise<DailyStaffReport> {
  const admin = requireAdminClient();
  const { data: staffRows, error: staffError } = await admin.from('crm_staff')
    .select('id,user_id,full_name,designation,job_title,department')
    .eq('status', 'Active').order('full_name');
  if (staffError) throw new Error(`Active staff could not be loaded: ${staffError.message}`);

  const staff = (staffRows || []) as StaffRow[];
  const staffIds = staff.map((person) => person.id);
  const userIds = staff.map((person) => person.user_id).filter(Boolean) as string[];
  const attendancePromise = staffIds.length
    ? admin.from('crm_attendance').select('staff_id,status,check_in,check_out,punch_in_at,punch_out_at,break_minutes,overtime_minutes')
      .eq('attendance_date', reportDate).in('staff_id', staffIds)
    : Promise.resolve({ data: [], error: null });
  const leavePromise = staffIds.length
    ? admin.from('crm_leave_requests').select('staff_id').eq('status', 'Approved')
      .lte('from_date', reportDate).gte('to_date', reportDate).in('staff_id', staffIds)
    : Promise.resolve({ data: [], error: null });
  const reportPromise = userIds.length
    ? admin.from('crm_daily_work_reports').select('id,user_id,report_status,crm_daily_work_report_items(activity_title,description,activity_status,created_at,deleted_at)')
      .eq('report_date', reportDate).in('user_id', userIds)
    : Promise.resolve({ data: [], error: null });
  const [attendanceResult, leaveResult, reportResult] = await Promise.all([attendancePromise, leavePromise, reportPromise]);
  if (attendanceResult.error) throw new Error(`Attendance could not be loaded: ${attendanceResult.error.message}`);
  if (leaveResult.error) throw new Error(`Approved leave could not be loaded: ${leaveResult.error.message}`);
  if (reportResult.error) throw new Error(`Daily work reports could not be loaded: ${reportResult.error.message}`);

  const attendanceByStaff = new Map(((attendanceResult.data || []) as AttendanceRow[]).map((row) => [row.staff_id, row]));
  const leaveStaff = new Set(((leaveResult.data || []) as LeaveRow[]).map((row) => row.staff_id));
  const reportByUser = new Map(((reportResult.data || []) as unknown as WorkReportRow[]).map((row) => [row.user_id, row]));

  const entries: StaffReportEntry[] = staff.map((person) => {
    const attendance = attendanceByStaff.get(person.id);
    const onLeave = leaveStaff.has(person.id) || attendance?.status === 'On Leave';
    let attendanceStatus = 'Absent / Not Marked';
    if (onLeave) attendanceStatus = 'Leave';
    else if (attendance?.check_in && !attendance.check_out) attendanceStatus = 'Incomplete';
    else if (attendance) attendanceStatus = attendance.status || (attendance.check_in ? 'Present' : 'Absent');

    const workReport = person.user_id ? reportByUser.get(person.user_id) : undefined;
    const submitted = !!workReport && ['SUBMITTED', 'REVIEWED'].includes(workReport.report_status);
    const items = submitted
      ? (workReport.crm_daily_work_report_items || []).filter((item) => !item.deleted_at).sort((a, b) => a.created_at.localeCompare(b.created_at))
      : [];
    return {
      staffId: person.id, userId: person.user_id, name: person.full_name,
      designation: person.designation || person.job_title || person.department,
      attendanceStatus, punchIn: attendance?.check_in || null, punchOut: attendance?.check_out || null,
      punchInAt: attendance?.punch_in_at || null, punchOutAt: attendance?.punch_out_at || null,
      reportStatus: onLeave ? 'Not Required' : submitted ? 'Submitted' : 'Not Submitted', items,
    };
  });

  const normalizedAttendance = (value: string) => value.toLowerCase();
  return {
    date: reportDate, timezone, staff: entries,
    summary: {
      totalStaff: entries.length,
      present: entries.filter((entry) => ['present', 'half day'].includes(normalizedAttendance(entry.attendanceStatus))).length,
      absent: entries.filter((entry) => normalizedAttendance(entry.attendanceStatus).includes('absent') || normalizedAttendance(entry.attendanceStatus) === 'not marked').length,
      leave: entries.filter((entry) => normalizedAttendance(entry.attendanceStatus) === 'leave').length,
      incomplete: entries.filter((entry) => normalizedAttendance(entry.attendanceStatus) === 'incomplete').length,
      submitted: entries.filter((entry) => entry.reportStatus === 'Submitted').length,
      notSubmitted: entries.filter((entry) => entry.reportStatus === 'Not Submitted').length,
      notRequired: entries.filter((entry) => entry.reportStatus === 'Not Required').length,
      completedActivities: entries.reduce((sum, entry) => sum + entry.items.filter((item) => item.activity_status === 'DONE').length, 0),
      pendingActivities: entries.reduce((sum, entry) => sum + entry.items.filter((item) => item.activity_status === 'PENDING').length, 0),
    },
  };
}

async function logoDataUrl() {
  try {
    const buffer = await readFile(path.join(process.cwd(), 'public', 'logo.png'));
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch { return null; }
}

export async function createDailyStaffReportPdf(report: DailyStaffReport) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const logo = await logoDataUrl();
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 17;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const header = () => {
    if (logo) {
      try { doc.addImage(logo, 'PNG', margin, 10, 38, 14, undefined, 'FAST'); } catch { /* keep PDF generation resilient */ }
    }
    doc.setTextColor(229, 27, 35); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    doc.text('MANAGEMENT CRM', pageWidth - margin, 16, { align: 'right' });
    doc.setDrawColor(230, 230, 230); doc.line(margin, 28, pageWidth - margin, 28);
    y = 36;
  };
  const newPageIfNeeded = (height: number) => {
    if (y + height <= pageHeight - 22) return;
    doc.addPage(); header();
  };
  const text = (value: string, options: { size?: number; bold?: boolean; color?: [number, number, number]; indent?: number; gap?: number } = {}) => {
    const indent = options.indent || 0;
    doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
    doc.setFontSize(options.size || 9);
    doc.setTextColor(...(options.color || [45, 45, 45]));
    const lines: string[] = [];
    for (const sourceLine of String(value).split(/\r?\n/)) {
      if (!sourceLine) lines.push('');
      else lines.push(...doc.splitTextToSize(sourceLine, contentWidth - indent));
    }
    const lineHeight = (options.size || 9) * 0.42;
    for (const line of lines) {
      newPageIfNeeded(lineHeight + 1);
      if (line) doc.text(line, margin + indent, y);
      y += lineHeight;
    }
    y += options.gap ?? 1.5;
  };

  header();
  text('DAILY STAFF REPORT', { size: 20, bold: true, color: [15, 15, 18], gap: 1 });
  text(displayDateUpper(report.date), { size: 10, bold: true, color: [229, 27, 35], gap: 6 });
  doc.setFillColor(248, 248, 248); doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');
  const summary = report.summary;
  const columns = [
    ['Total Staff', summary.totalStaff], ['Present', summary.present], ['Absent', summary.absent],
    ['Leave', summary.leave], ['Incomplete', summary.incomplete], ['Reports Submitted', summary.submitted],
    ['Reports Missing', summary.notSubmitted], ['Completed Activities', summary.completedActivities], ['Pending Activities', summary.pendingActivities],
  ] as const;
  columns.forEach(([label, value], index) => {
    const col = index % 3; const row = Math.floor(index / 3); const x = margin + 7 + col * (contentWidth / 3);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(20, 20, 20); doc.text(String(value), x, y + 8 + row * 10);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(115, 115, 115); doc.text(label.toUpperCase(), x + 8, y + 8 + row * 10);
  });
  y += 42;

  report.staff.forEach((person, staffIndex) => {
    newPageIfNeeded(42);
    if (staffIndex) { doc.setDrawColor(225, 225, 225); doc.line(margin, y, pageWidth - margin, y); y += 7; }
    text(person.name.toUpperCase(), { size: 13, bold: true, color: [15, 15, 18], gap: 0.5 });
    text(person.designation, { size: 8, color: [105, 105, 105], gap: 3 });
    text('ATTENDANCE', { size: 7, bold: true, color: [229, 27, 35], gap: 1 });
    text(`Status: ${person.attendanceStatus}`, { bold: true, gap: 0.5 });
    text(`Punch In: ${displayTimestamp(person.punchInAt, report.timezone) || displayTime(person.punchIn)}`, { gap: 0.5 });
    text(`Punch Out: ${displayTimestamp(person.punchOutAt, report.timezone) || displayTime(person.punchOut)}`, { gap: 3 });
    text('DAILY WORK REPORT', { size: 7, bold: true, color: [229, 27, 35], gap: 1 });
    text(`Status: ${person.reportStatus.toUpperCase()}`, { bold: true, gap: person.items.length ? 3 : 5 });
    person.items.forEach((item, index) => {
      text(`${index + 1}. ${item.activity_status} - ${item.activity_title}`, { bold: true, gap: 1 });
      text('Description:', { size: 7, bold: true, color: [105, 105, 105], indent: 4, gap: 0.5 });
      // The description is used verbatim. Wrapping only changes visual line
      // placement and never summarizes, translates, or rewrites staff text.
      text(item.description, { indent: 4, gap: 3 });
    });
  });

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page); doc.setDrawColor(230, 230, 230); doc.line(margin, 282, pageWidth - margin, 282);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(30, 30, 30); doc.text('PLANMYBARAAT', margin, 288);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(135, 135, 135); doc.text('Generated from final CRM attendance and daily work reports', pageWidth / 2, 288, { align: 'center' });
    doc.text(`Page ${page} of ${pages}`, pageWidth - margin, 288, { align: 'right' });
  }
  doc.setProperties({ title: `Daily Staff Report - ${report.date}`, subject: 'Attendance and complete daily work report', author: 'PlanMyBaraat CRM', creator: 'PlanMyBaraat CRM' });
  return new Uint8Array(doc.output('arraybuffer'));
}

async function uploadReportPdf(reportDate: string, pdf: Uint8Array) {
  const admin = requireAdminClient();
  const storagePath = `${reportDate}/daily-staff-report-${reportDate}.pdf`;
  const { error: uploadError } = await admin.storage.from(REPORT_BUCKET).upload(storagePath, pdf, {
    contentType: 'application/pdf', cacheControl: '3600', upsert: true,
  });
  if (uploadError) throw new Error(`Report PDF could not be stored: ${uploadError.message}`);
  const { data, error } = await admin.storage.from(REPORT_BUCKET).createSignedUrl(storagePath, 60 * 60 * 24);
  if (error || !data?.signedUrl) throw new Error(`Report PDF link could not be created: ${error?.message || 'Unknown storage error'}`);
  return { storagePath, signedUrl: data.signedUrl };
}

async function sendWhatsAppTemplate(settings: ReportSettings, report: DailyStaffReport, documentUrl: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!accessToken || !phoneNumberId) {
    throw new Error('WhatsApp Business API is not configured. WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID are required.');
  }
  const version = process.env.WHATSAPP_GRAPH_API_VERSION || DEFAULT_GRAPH_VERSION;
  const templateName = process.env.WHATSAPP_DAILY_REPORT_TEMPLATE_NAME || settings.whatsapp_template_name;
  const bodyValues = [
    displayDate(report.date), report.summary.totalStaff, report.summary.present, report.summary.absent,
    report.summary.leave, report.summary.incomplete, report.summary.submitted, report.summary.notSubmitted,
    report.summary.notRequired, report.summary.completedActivities, report.summary.pendingActivities,
  ];
  const response = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp', recipient_type: 'individual', to: normalizeRecipient(settings.recipient_e164), type: 'template',
      template: {
        name: templateName,
        language: { code: settings.whatsapp_template_language || 'en' },
        components: [
          { type: 'header', parameters: [{ type: 'document', document: { link: documentUrl, filename: `Daily-Staff-Report-${report.date}.pdf` } }] },
          { type: 'body', parameters: bodyValues.map((value) => ({ type: 'text', text: String(value) })) },
        ],
      },
    }),
  });
  const result = await response.json().catch(() => ({})) as { messages?: { id?: string }[]; error?: { message?: string; error_user_msg?: string } };
  if (!response.ok || !result.messages?.[0]?.id) {
    throw new Error(result.error?.error_user_msg || result.error?.message || `WhatsApp API returned HTTP ${response.status}.`);
  }
  return result.messages[0].id!;
}

async function notifyAdminsOfFailure(reportDate: string, message: string, attempt: number) {
  const admin = requireAdminClient();
  const { data: admins } = await admin.from('crm_users').select('id').in('role', ['admin', 'super_admin']).eq('is_active', true);
  if (!admins?.length) return;
  await admin.from('crm_notifications').upsert(admins.map((person) => ({
    recipient_id: person.id, type: 'daily_staff_report_failed', title: 'Daily Staff WhatsApp report failed',
    body: `The report for ${displayDate(reportDate)} could not be sent. ${message.slice(0, 500)}`,
    link: '/crm/daily-work-reports', dedupe_key: `daily-staff-whatsapp-failed-${reportDate}-${attempt}`,
  })), { onConflict: 'recipient_id,dedupe_key', ignoreDuplicates: true });
}

export async function runDailyStaffReport(options: RunOptions = {}) {
  const admin = requireAdminClient();
  const { settings, attendance } = await getConfiguration();
  const nowParts = localParts(new Date(), attendance.business_timezone);
  const reportDate = options.reportDate || shiftIsoDate(nowParts.date, -1);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reportDate)) throw new Error('A valid report date is required.');
  if (!settings.is_enabled && !options.requestedBy) return { ok: true, skipped: true, reason: 'Daily WhatsApp reports are disabled.' };
  if (!options.reportDate && !(attendance.working_days || []).includes(isoWeekday(reportDate))) {
    return { ok: true, skipped: true, reason: `${reportDate} is not a configured working day.`, reportDate };
  }
  if (reportDate >= nowParts.date) throw new Error('Attendance for this date is not locked yet. Select an earlier date.');

  const recipient = normalizeRecipient(settings.recipient_e164);
  if (!recipient) throw new Error('A Daily Report WhatsApp Recipient has not been configured.');
  const { data: existing } = await admin.from('crm_daily_staff_report_deliveries').select('*')
    .eq('report_date', reportDate).eq('recipient_e164', recipient).maybeSingle();
  if (existing?.status === 'SENT') return { ok: true, skipped: true, reason: 'This report was already sent.', reportDate, delivery: existing };
  if (existing?.status === 'SENDING') return { ok: true, skipped: true, reason: 'This report is already being sent.', reportDate, delivery: existing };
  const attempt = Number(existing?.attempt_count || 0) + 1;
  if (existing && attempt > settings.max_attempts && !options.retryFailed) {
    return { ok: false, skipped: true, reason: 'Maximum automatic retry attempts reached.', reportDate, delivery: existing };
  }

  let deliveryId = existing?.id as string | undefined;
  if (deliveryId) {
    const { data: claimed, error } = await admin.from('crm_daily_staff_report_deliveries').update({
      status: 'SENDING', attempt_count: attempt, error_message: null, started_at: new Date().toISOString(), requested_by: options.requestedBy || null,
    }).eq('id', deliveryId).eq('status', 'FAILED').select('id').maybeSingle();
    if (error) throw new Error(`Delivery retry could not be claimed: ${error.message}`);
    if (!claimed) return { ok: true, skipped: true, reason: 'Another process already claimed this retry.', reportDate };
  } else {
    const { data, error } = await admin.from('crm_daily_staff_report_deliveries').insert({
      report_date: reportDate, recipient_e164: recipient, status: 'SENDING', attempt_count: 1,
      started_at: new Date().toISOString(), requested_by: options.requestedBy || null,
    }).select('id').single();
    if (error) {
      if (error.code === '23505') return { ok: true, skipped: true, reason: 'Another process already claimed this report.', reportDate };
      throw new Error(`Delivery could not be created: ${error.message}`);
    }
    deliveryId = data.id;
  }

  try {
    const report = await buildDailyStaffReport(reportDate, attendance.business_timezone);
    const pdf = await createDailyStaffReportPdf(report);
    const uploaded = await uploadReportPdf(reportDate, pdf);
    const messageId = await sendWhatsAppTemplate(settings, report, uploaded.signedUrl);
    const { data: delivery, error } = await admin.from('crm_daily_staff_report_deliveries').update({
      status: 'SENT', summary: report.summary, pdf_storage_path: uploaded.storagePath,
      whatsapp_message_id: messageId, error_message: null, sent_at: new Date().toISOString(),
    }).eq('id', deliveryId).select('*').single();
    if (error) throw new Error(`Sent delivery could not be finalized: ${error.message}`);
    return { ok: true, skipped: false, reportDate, delivery };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'Unknown daily staff report error.';
    await admin.from('crm_daily_staff_report_deliveries').update({ status: 'FAILED', error_message: message }).eq('id', deliveryId);
    await notifyAdminsOfFailure(reportDate, message, attempt);
    throw cause;
  }
}

export async function getDailyStaffReportAdminState() {
  const admin = requireAdminClient();
  const { settings, attendance } = await getConfiguration();
  const { data: deliveries, error } = await admin.from('crm_daily_staff_report_deliveries').select('*')
    .order('report_date', { ascending: false }).limit(31);
  if (error) throw new Error(error.message);
  return {
    settings, attendance, deliveries: deliveries || [],
    providerConfigured: !!(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
    cronConfigured: !!process.env.CRON_SECRET,
  };
}
