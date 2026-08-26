import { crmSupabase } from "./supabase-crm";
import {
  CRM_ATTENDANCE_START_DATE,
  DEFAULT_WORKING_DAYS,
  isCompanyHoliday,
} from "./attendance-calendar";
import { getCompanyHolidays } from "./company-holidays";

export type IncentiveStatus = "Estimated" | "Approved" | "Paid" | "Rejected";
export interface LateRule {
  minimum: number;
  maximum: number | null;
  score: number;
}
export interface IncentiveSlab {
  minimum: number;
  maximum: number;
  amount: number;
}
export interface IncentiveConfig {
  id: number;
  attendance_weight: number;
  working_hours_weight: number;
  punctuality_weight: number;
  break_weight: number;
  daily_report_weight: number;
  required_work_minutes: number;
  allowed_breaks_per_day: number;
  late_grace_minutes: number;
  break_violation_deduction: number;
  management_bonus_base_amount: number;
  late_rules: LateRule[];
  incentive_slabs: IncentiveSlab[];
  updated_at?: string;
}
export interface PerformanceStaff {
  id: string;
  user_id: string | null;
  employee_code: string | null;
  full_name: string;
  department: string | null;
  job_title: string | null;
  role: string | null;
  joining_date: string | null;
  shift_start: string | null;
  shift_end: string | null;
}
export interface PerformanceDay {
  date: string;
  state: "Complete" | "In Progress" | "Pending" | "Excluded";
  attendance: string;
  punchIn: string | null;
  punchOut: string | null;
  workingMinutes: number | null;
  requiredMinutes: number;
  completedHours: boolean;
  late: boolean;
  originalLateMinutes: number;
  compensatedLateMinutes: number;
  adjustedLateMinutes: number;
  lateMinutes: number;
  lateSeverity: "On Time" | "Slightly Late" | "Late" | "Severely Late";
  extraMinutes: number;
  overtimeMinutes: number;
  breakCount: number;
  breakCompliant: boolean;
  reportSubmitted: boolean;
  report: PerformanceDailyReport | null;
  reason: string;
}
export interface PerformanceReportItem {
  id: string;
  activity_title: string;
  description: string;
  activity_status: "DONE" | "PENDING";
  created_at: string;
  deleted_at: string | null;
}
export interface PerformanceDailyReport {
  id: string;
  report_status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  items: PerformanceReportItem[];
}
export interface PerformanceResult {
  staff: PerformanceStaff;
  periodStart: string;
  periodEnd: string;
  eligibleDays: number;
  presentDays: number;
  completedHoursDays: number;
  onTimeDays: number;
  lateDays: number;
  totalOriginalLateMinutes: number;
  totalCompensatedLateMinutes: number;
  totalLateMinutes: number;
  totalOvertimeMinutes: number;
  overtimeDays: number;
  slightlyLateDays: number;
  lateArrivalDays: number;
  severelyLateDays: number;
  breakViolationDays: number;
  reportDays: number;
  attendanceScore: number;
  workingHoursScore: number;
  punctualityScore: number;
  breakScore: number;
  dailyReportScore: number;
  totalScore: number;
  baseIncentiveAmount: number;
  managementBonusBaseAmount: number;
  managementBonusPercent: number;
  managementBonusAmount: number;
  incentiveAmount: number;
  status: IncentiveStatus;
  days: PerformanceDay[];
  snapshot?: Record<string, unknown> | null;
}
interface AttendanceRow {
  id: string;
  staff_id: string;
  attendance_date: string;
  status: string | null;
  check_in: string | null;
  check_out: string | null;
  punch_in_at: string | null;
  punch_out_at: string | null;
  break_minutes: number | null;
}
interface BreakRow {
  attendance_id: string;
  staff_id: string;
  break_start_at: string;
  break_end_at: string | null;
  duration_minutes: number | null;
}
interface ReportRow {
  id: string;
  user_id: string;
  report_date: string;
  report_status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  crm_daily_work_report_items: PerformanceReportItem[] | null;
}
interface LeaveRow {
  staff_id: string;
  from_date: string;
  to_date: string;
  status: string;
}
interface SnapshotRow extends Record<string, unknown> {
  staff_id: string;
  status: string;
  base_incentive_amount?: number | null;
  management_bonus_base_amount?: number | null;
  management_bonus_percent?: number | null;
  management_bonus_amount?: number | null;
  incentive_amount?: number | null;
}
interface StaffRow extends PerformanceStaff {
  crm_id?: string | null;
  status?: string;
}

export const DEFAULT_INCENTIVE_CONFIG: IncentiveConfig = {
  id: 1,
  attendance_weight: 25,
  working_hours_weight: 20,
  punctuality_weight: 20,
  break_weight: 20,
  daily_report_weight: 15,
  required_work_minutes: 480,
  allowed_breaks_per_day: 2,
  late_grace_minutes: 10,
  break_violation_deduction: 2,
  management_bonus_base_amount: 3000,
  late_rules: [
    { minimum: 0, maximum: 0, score: 20 },
    { minimum: 1, maximum: 1, score: 15 },
    { minimum: 2, maximum: 2, score: 10 },
    { minimum: 3, maximum: null, score: 0 },
  ],
  incentive_slabs: [
    { minimum: 0, maximum: 59.99, amount: 0 },
    { minimum: 60, maximum: 74.99, amount: 750 },
    { minimum: 75, maximum: 84.99, amount: 1750 },
    { minimum: 85, maximum: 94.99, amount: 2500 },
    { minimum: 95, maximum: 100, amount: 3000 },
  ],
};

const round = (value: number) => Math.round(value * 100) / 100;
const indiaToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
const datesBetween = (start: string, end: string) => {
  const rows: string[] = [];
  const date = new Date(`${start}T12:00:00Z`);
  const last = new Date(`${end}T12:00:00Z`);
  while (date <= last) {
    rows.push(date.toISOString().slice(0, 10));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return rows;
};
const timeMinutes = (value: string | null | undefined) => {
  if (!value) return null;
  const [h, m] = value.split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
};
const duration = (
  start: string | null | undefined,
  end: string | null | undefined,
) => {
  const a = timeMinutes(start),
    b = timeMinutes(end);
  if (a === null || b === null) return null;
  return b >= a ? b - a : b + 1440 - a;
};
const lower = (value: unknown) => String(value || "").toLowerCase();
const arrivalDelayMinutes = (
  checkIn: number | null,
  shiftStart: number | null,
) => {
  if (checkIn === null || shiftStart === null) return 0;
  let difference = checkIn - shiftStart;
  if (difference < -720) difference += 1440;
  if (difference > 720) difference -= 1440;
  return Math.max(0, difference);
};
const extraMinutesAfterShift = (
  checkIn: number | null,
  checkOut: number | null,
  shiftStart: number | null,
  shiftEnd: number | null,
) => {
  if (
    checkIn === null ||
    checkOut === null ||
    shiftStart === null ||
    shiftEnd === null
  )
    return 0;
  const scheduledEnd = shiftEnd <= shiftStart ? shiftEnd + 1440 : shiftEnd;
  const actualEnd = checkOut < checkIn ? checkOut + 1440 : checkOut;
  return Math.max(0, actualEnd - scheduledEnd);
};
const lateSeverity = (
  minutes: number,
  grace: number,
): PerformanceDay["lateSeverity"] => {
  if (minutes <= grace) return "On Time";
  if (minutes <= 20) return "Slightly Late";
  if (minutes <= 45) return "Late";
  return "Severely Late";
};
const lateDeduction = (severity: PerformanceDay["lateSeverity"]) =>
  severity === "Slightly Late"
    ? 0.5
    : severity === "Late"
      ? 1
      : severity === "Severely Late"
        ? 2
        : 0;
const clampManagementBonus = (value: number) =>
  Math.min(25, Math.max(0, round(Number.isFinite(value) ? value : 0)));

export async function getIncentiveConfig(): Promise<IncentiveConfig> {
  const { data, error } = await crmSupabase
    .from("crm_incentive_config")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data
    ? ({
        ...DEFAULT_INCENTIVE_CONFIG,
        ...data,
        late_rules: data.late_rules || DEFAULT_INCENTIVE_CONFIG.late_rules,
        incentive_slabs:
          data.incentive_slabs || DEFAULT_INCENTIVE_CONFIG.incentive_slabs,
      } as IncentiveConfig)
    : DEFAULT_INCENTIVE_CONFIG;
}

export async function updateIncentiveConfig(config: IncentiveConfig) {
  const payload = {
    attendance_weight: config.attendance_weight,
    working_hours_weight: config.working_hours_weight,
    punctuality_weight: config.punctuality_weight,
    break_weight: config.break_weight,
    daily_report_weight: config.daily_report_weight,
    required_work_minutes: config.required_work_minutes,
    allowed_breaks_per_day: config.allowed_breaks_per_day,
    late_grace_minutes: config.late_grace_minutes,
    break_violation_deduction: config.break_violation_deduction,
    management_bonus_base_amount: config.management_bonus_base_amount,
    late_rules: config.late_rules,
    incentive_slabs: config.incentive_slabs,
    updated_at: new Date().toISOString(),
  };
  const {
    data: { user },
  } = await crmSupabase.auth.getUser();
  const { error } = await crmSupabase
    .from("crm_incentive_config")
    .update({ ...payload, updated_by: user?.id || null })
    .eq("id", 1);
  if (error) throw new Error(error.message);
}

export async function loadPerformance(options: {
  start: string;
  end: string;
  staffId?: string;
  selfOnly?: boolean;
}): Promise<{ config: IncentiveConfig; results: PerformanceResult[] }> {
  const config = await getIncentiveConfig();
  let staffQuery = crmSupabase
    .from("crm_staff")
    .select(
      "id,user_id,employee_code,crm_id,full_name,department,job_title,role,joining_date,shift_start,shift_end,status",
    )
    .in("status", ["Active", "Intern"]);
  if (options.staffId) staffQuery = staffQuery.eq("id", options.staffId);
  if (options.selfOnly) {
    const {
      data: { user },
    } = await crmSupabase.auth.getUser();
    if (!user) throw new Error("Please sign in again.");
    staffQuery = staffQuery.eq("user_id", user.id);
  }
  const { data: staffRows, error: staffError } =
    await staffQuery.order("full_name");
  if (staffError) throw new Error(staffError.message);
  const staff = ((staffRows || []) as StaffRow[]).map((row) => ({
    ...row,
    employee_code: row.employee_code || row.crm_id || null,
  })) as PerformanceStaff[];
  if (!staff.length) return { config, results: [] };
  const ids = staff.map((s) => s.id),
    userIds = staff.map((s) => s.user_id).filter(Boolean) as string[];
  const [
    attendanceRes,
    breakRes,
    reportRes,
    leaveRes,
    settingsRes,
    snapshotsRes,
    holidays,
  ] = await Promise.all([
    crmSupabase
      .from("crm_attendance")
      .select(
        "id,staff_id,attendance_date,status,check_in,check_out,punch_in_at,punch_out_at,break_minutes",
      )
      .in("staff_id", ids)
      .gte("attendance_date", options.start)
      .lte("attendance_date", options.end),
    crmSupabase
      .from("crm_attendance_breaks")
      .select(
        "attendance_id,staff_id,break_start_at,break_end_at,duration_minutes",
      )
      .in("staff_id", ids)
      .gte("break_start_at", `${options.start}T00:00:00`)
      .lte("break_start_at", `${options.end}T23:59:59`),
    userIds.length
      ? crmSupabase
          .from("crm_daily_work_reports")
          .select(
            "id,user_id,report_date,report_status,submitted_at,reviewed_at,crm_daily_work_report_items(id,activity_title,description,activity_status,created_at,deleted_at)",
          )
          .in("user_id", userIds)
          .gte("report_date", options.start)
          .lte("report_date", options.end)
      : Promise.resolve({ data: [], error: null }),
    crmSupabase
      .from("crm_leave_requests")
      .select("staff_id,from_date,to_date,status")
      .in("staff_id", ids)
      .eq("status", "Approved")
      .lte("from_date", options.end)
      .gte("to_date", options.start),
    crmSupabase
      .from("crm_attendance_settings")
      .select("working_days")
      .eq("id", 1)
      .maybeSingle(),
    crmSupabase
      .from("crm_incentive_snapshots")
      .select("*")
      .in("staff_id", ids)
      .eq("period_start", options.start)
      .eq("period_end", options.end),
    getCompanyHolidays(options.start, options.end),
  ]);
  for (const response of [attendanceRes, breakRes, reportRes, leaveRes])
    if (response.error) throw new Error(response.error.message);
  const attendance = (attendanceRes.data || []) as AttendanceRow[],
    breaks = (breakRes.data || []) as BreakRow[],
    reports = (reportRes.data || []) as ReportRow[],
    leaves = (leaveRes.data || []) as LeaveRow[];
  const workingDays = (settingsRes.data?.working_days ||
    DEFAULT_WORKING_DAYS) as number[];
  const holidayDates = new Set(holidays.map((holiday) => holiday.holiday_date));
  const today = indiaToday();
  const results = staff.map((person) => {
    const personAttendance = attendance.filter(
      (row) => row.staff_id === person.id,
    );
    const attendanceByDate = new Map(
      personAttendance.map((row) => [row.attendance_date, row]),
    );
    const reportsByDate = new Map(
      reports
        .filter((r) => r.user_id === person.user_id)
        .map((r) => [
          r.report_date,
          {
            id: r.id,
            report_status: r.report_status,
            submitted_at: r.submitted_at,
            reviewed_at: r.reviewed_at,
            items: (r.crm_daily_work_report_items || [])
              .filter((item) => !item.deleted_at)
              .sort((a, b) => a.created_at.localeCompare(b.created_at)),
          } satisfies PerformanceDailyReport,
        ]),
    );
    const leaveRows = leaves.filter((r) => r.staff_id === person.id);
    const first = [
      options.start,
      CRM_ATTENDANCE_START_DATE,
      person.joining_date || options.start,
    ]
      .sort()
      .at(-1)!;
    const days: PerformanceDay[] = [];
    let eligible = 0,
      present = 0,
      hours = 0,
      onTime = 0,
      late = 0,
      totalOriginalLateMinutes = 0,
      totalCompensatedLateMinutes = 0,
      totalLateMinutes = 0,
      totalOvertimeMinutes = 0,
      overtimeDays = 0,
      slightlyLate = 0,
      lateArrival = 0,
      severelyLate = 0,
      punctualityDeductions = 0,
      breakViolations = 0,
      reportDays = 0;
    for (const date of datesBetween(options.start, options.end)) {
      const row = attendanceByDate.get(date);
      const status = lower(row?.status);
      const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
      const leave = leaveRows.some(
        (r) => r.from_date <= date && r.to_date >= date,
      );
      const holiday = isCompanyHoliday(date, holidayDates);
      const excluded =
        date < first ||
        !workingDays.includes(weekday) ||
        holiday ||
        leave ||
        ["holiday", "weekly off", "on leave"].includes(status);
      const hasPunch = !!(row?.punch_in_at || row?.check_in);
      const hasOut = !!(row?.punch_out_at || row?.check_out);
      const current = date === today;
      const future = date > today;
      if (excluded || future) {
        days.push({
          date,
          state: "Excluded",
          attendance: leave
            ? "On Leave"
            : holiday
              ? "Holiday"
              : !workingDays.includes(weekday)
                ? "Weekly Off"
                : "Not Eligible",
          punchIn: row?.check_in || null,
          punchOut: row?.check_out || null,
          workingMinutes: null,
          requiredMinutes: config.required_work_minutes,
          completedHours: false,
          late: false,
          originalLateMinutes: 0,
          compensatedLateMinutes: 0,
          adjustedLateMinutes: 0,
          lateMinutes: 0,
          lateSeverity: "On Time",
          extraMinutes: 0,
          overtimeMinutes: 0,
          breakCount: 0,
          breakCompliant: true,
          reportSubmitted: false,
          report: null,
          reason: "Excluded from the incentive period",
        });
        continue;
      }
      if (current && !hasOut) {
        days.push({
          date,
          state: hasPunch ? "In Progress" : "Pending",
          attendance: hasPunch ? "Present" : "Pending",
          punchIn: row?.check_in || null,
          punchOut: null,
          workingMinutes: null,
          requiredMinutes: config.required_work_minutes,
          completedHours: false,
          late: false,
          originalLateMinutes: 0,
          compensatedLateMinutes: 0,
          adjustedLateMinutes: 0,
          lateMinutes: 0,
          lateSeverity: "On Time",
          extraMinutes: 0,
          overtimeMinutes: 0,
          breakCount: breaks.filter(
            (b) =>
              b.staff_id === person.id &&
              String(b.break_start_at).slice(0, 10) === date,
          ).length,
          breakCompliant: true,
          reportSubmitted: false,
          report: null,
          reason: "Current day is not finalized",
        });
        continue;
      }
      eligible++;
      if (hasPunch) present++;
      const dayBreaks = breaks.filter(
        (b) =>
          b.staff_id === person.id &&
          String(b.break_start_at).slice(0, 10) === date,
      );
      const breakMinutes = dayBreaks.length
        ? dayBreaks.reduce((sum, b) => sum + Number(b.duration_minutes || 0), 0)
        : Number(row?.break_minutes || 0);
      const gross = duration(row?.check_in, row?.check_out);
      const net = gross === null ? null : Math.max(0, gross - breakMinutes);
      const half = status === "half day";
      const required = half
        ? Math.round(config.required_work_minutes / 2)
        : config.required_work_minutes;
      const hoursOk = hasPunch && net !== null && net >= required;
      if (hoursOk) hours++;
      const check = timeMinutes(row?.check_in);
      const checkout = timeMinutes(row?.check_out);
      const shift = timeMinutes(person.shift_start || "10:00");
      const shiftEnd = timeMinutes(person.shift_end || "19:00");
      const originalDelay = hasPunch
        ? arrivalDelayMinutes(check, shift)
        : 0;
      const extraMinutes = hasPunch && hasOut
        ? extraMinutesAfterShift(check, checkout, shift, shiftEnd)
        : 0;
      const compensatedLateMinutes = Math.min(originalDelay, extraMinutes);
      const adjustedDelay = Math.max(0, originalDelay - extraMinutes);
      const overtimeMinutes = Math.max(0, extraMinutes - originalDelay);
      const severity = lateSeverity(adjustedDelay, config.late_grace_minutes);
      const isLate = hasPunch && severity !== "On Time";
      totalOriginalLateMinutes += originalDelay;
      totalCompensatedLateMinutes += compensatedLateMinutes;
      totalOvertimeMinutes += overtimeMinutes;
      if (overtimeMinutes > 0) overtimeDays++;
      if (hasPunch && !isLate) onTime++;
      if (isLate) {
        late++;
        totalLateMinutes += adjustedDelay;
        punctualityDeductions += lateDeduction(severity);
        if (severity === "Slightly Late") slightlyLate++;
        else if (severity === "Late") lateArrival++;
        else severelyLate++;
      }
      const breakOk =
        dayBreaks.length <= config.allowed_breaks_per_day &&
        dayBreaks.every((b) => !!b.break_end_at);
      if (!breakOk) breakViolations++;
      const report = reportsByDate.get(date);
      const submitted =
        !!report &&
        (["submitted", "reviewed"].includes(lower(report.report_status)) ||
          !!report.submitted_at);
      if (submitted) reportDays++;
      const reasons: string[] = [];
      if (!hasPunch) reasons.push("No valid punch in");
      if (hasPunch && !hoursOk)
        reasons.push("Required working hours not completed");
      if (isLate) reasons.push(`${severity} by ${adjustedDelay} minutes`);
      if (compensatedLateMinutes > 0)
        reasons.push(`${compensatedLateMinutes} late minutes recovered`);
      if (overtimeMinutes > 0)
        reasons.push(`${overtimeMinutes} overtime minutes`);
      if (!breakOk)
        reasons.push(
          dayBreaks.some((b) => !b.break_end_at)
            ? "Break not ended"
            : "Break limit exceeded",
        );
      if (!submitted) reasons.push("Daily work report not submitted");
      days.push({
        date,
        state: "Complete",
        attendance: hasPunch ? (half ? "Half Day" : "Present") : "Absent",
        punchIn: row?.check_in || null,
        punchOut: row?.check_out || null,
        workingMinutes: net,
        requiredMinutes: required,
        completedHours: hoursOk,
        late: isLate,
        originalLateMinutes: originalDelay,
        compensatedLateMinutes,
        adjustedLateMinutes: adjustedDelay,
        lateMinutes: adjustedDelay,
        lateSeverity: severity,
        extraMinutes,
        overtimeMinutes,
        breakCount: dayBreaks.length,
        breakCompliant: breakOk,
        reportSubmitted: submitted,
        report: submitted ? report || null : null,
        reason: reasons.join(" · ") || "All requirements completed",
      });
    }
    const attendanceScore = eligible
      ? round((present / eligible) * config.attendance_weight)
      : 0;
    const workingHoursScore = eligible
      ? round((hours / eligible) * config.working_hours_weight)
      : 0;
    const punctualityScore = round(
      Math.max(0, config.punctuality_weight - punctualityDeductions),
    );
    const breakScore = round(
      Math.max(
        0,
        config.break_weight -
          breakViolations * config.break_violation_deduction,
      ),
    );
    const dailyReportScore = eligible
      ? round((reportDays / eligible) * config.daily_report_weight)
      : 0;
    const totalScore = round(
      Math.min(
        100,
        attendanceScore +
          workingHoursScore +
          punctualityScore +
          breakScore +
          dailyReportScore,
      ),
    );
    const calculatedBaseIncentive =
      config.incentive_slabs.find(
        (s) => totalScore >= s.minimum && totalScore <= s.maximum,
      )?.amount || 0;
    const snapshot = ((snapshotsRes.data || []) as SnapshotRow[]).find(
      (s) => s.staff_id === person.id,
    );
    const managementBonusPercent = clampManagementBonus(
      Number(snapshot?.management_bonus_percent || 0),
    );
    const baseIncentiveAmount = Number(
      snapshot?.base_incentive_amount ?? calculatedBaseIncentive,
    );
    const managementBonusBaseAmount = Number(
      snapshot?.management_bonus_base_amount ??
        config.management_bonus_base_amount,
    );
    const managementBonusAmount = Number(
      snapshot?.management_bonus_amount ??
        round((managementBonusBaseAmount * managementBonusPercent) / 100),
    );
    const incentiveAmount = Number(
      snapshot?.incentive_amount ??
        round(baseIncentiveAmount + managementBonusAmount),
    );
    return {
      staff: person,
      periodStart: options.start,
      periodEnd: options.end,
      eligibleDays: eligible,
      presentDays: present,
      completedHoursDays: hours,
      onTimeDays: onTime,
      lateDays: late,
      totalOriginalLateMinutes,
      totalCompensatedLateMinutes,
      totalLateMinutes,
      totalOvertimeMinutes,
      overtimeDays,
      slightlyLateDays: slightlyLate,
      lateArrivalDays: lateArrival,
      severelyLateDays: severelyLate,
      breakViolationDays: breakViolations,
      reportDays,
      attendanceScore,
      workingHoursScore,
      punctualityScore,
      breakScore,
      dailyReportScore,
      totalScore,
      baseIncentiveAmount,
      managementBonusBaseAmount,
      managementBonusPercent,
      managementBonusAmount,
      incentiveAmount,
      status: (snapshot?.status || "Estimated") as IncentiveStatus,
      days,
      snapshot,
    };
  });
  return { config, results };
}

export async function approvePerformance(
  result: PerformanceResult,
  config: IncentiveConfig,
  note = "",
  managementBonusPercent = 0,
) {
  const {
    data: { user },
  } = await crmSupabase.auth.getUser();
  if (!user) throw new Error("Please sign in again.");
  const bonusPercent = clampManagementBonus(managementBonusPercent);
  const baseIncentiveAmount =
    config.incentive_slabs.find(
      (s) => result.totalScore >= s.minimum && result.totalScore <= s.maximum,
    )?.amount || 0;
  const managementBonusBaseAmount = Number(
    config.management_bonus_base_amount || 3000,
  );
  const managementBonusAmount = round(
    (managementBonusBaseAmount * bonusPercent) / 100,
  );
  const incentiveAmount = round(baseIncentiveAmount + managementBonusAmount);
  const payload = {
    staff_id: result.staff.id,
    period_start: result.periodStart,
    period_end: result.periodEnd,
    attendance_score: result.attendanceScore,
    working_hours_score: result.workingHoursScore,
    punctuality_score: result.punctualityScore,
    break_score: result.breakScore,
    daily_report_score: result.dailyReportScore,
    total_score: result.totalScore,
    base_incentive_amount: baseIncentiveAmount,
    management_bonus_base_amount: managementBonusBaseAmount,
    management_bonus_percent: bonusPercent,
    management_bonus_amount: managementBonusAmount,
    incentive_amount: incentiveAmount,
    status: "Approved",
    metrics: {
      eligibleDays: result.eligibleDays,
      presentDays: result.presentDays,
      completedHoursDays: result.completedHoursDays,
      onTimeDays: result.onTimeDays,
      lateDays: result.lateDays,
      totalOriginalLateMinutes: result.totalOriginalLateMinutes,
      totalCompensatedLateMinutes: result.totalCompensatedLateMinutes,
      totalLateMinutes: result.totalLateMinutes,
      totalOvertimeMinutes: result.totalOvertimeMinutes,
      overtimeDays: result.overtimeDays,
      slightlyLateDays: result.slightlyLateDays,
      lateArrivalDays: result.lateArrivalDays,
      severelyLateDays: result.severelyLateDays,
      breakViolationDays: result.breakViolationDays,
      reportDays: result.reportDays,
    },
    rules_snapshot: config,
    approved_by: user.id,
    approved_at: new Date().toISOString(),
    approval_note: note || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await crmSupabase
    .from("crm_incentive_snapshots")
    .upsert(payload, { onConflict: "staff_id,period_start,period_end" });
  if (error) throw new Error(error.message);
}

export const formatPerformanceTime = (value: string | null) => {
  if (!value) return "—";
  const [h, m] = value.split(":").map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};
export const formatPerformanceMinutes = (value: number | null) =>
  value === null ? "—" : `${Math.floor(value / 60)}h ${value % 60}m`;
