import type { AttendanceStatus } from './types';

export const CRM_ATTENDANCE_START_DATE = '2026-08-11';
export const DEFAULT_WORKING_DAYS = [1, 2, 3, 4, 5, 6];

export interface CalendarAttendanceRecord {
  attendance_date: string;
  status: AttendanceStatus | string;
  check_in?: string | null;
  punch_in_at?: string | null;
}

export interface AttendanceLeaveRange {
  from_date: string;
  to_date: string;
  status?: string | null;
}

function dateKeyInIndia(value = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value || '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function weekdayForKey(key: string) {
  return new Date(`${key}T12:00:00Z`).getUTCDay();
}

function isApprovedLeave(key: string, ranges: AttendanceLeaveRange[]) {
  return ranges.some((range) => (!range.status || range.status === 'Approved') && range.from_date <= key && range.to_date >= key);
}

// Company-wide national holidays. These are never marked Absent, regardless
// of a staff member's working-day schedule or punch history for that date.
// Independence Day (15 Aug) and Republic Day (26 Jan) fall on the same
// calendar date every year; Raksha Bandhan follows the lunar calendar, so it
// shifts each year and needs an explicit per-year lookup.
const FIXED_ANNUAL_HOLIDAYS = new Set(['08-15', '01-26']); // MM-DD

const RAKSHA_BANDHAN_DATES = new Set([
  '2024-08-19',
  '2025-08-09',
  '2026-08-28',
  '2027-08-17',
  '2028-08-05',
]);

function isCompanyHoliday(key: string) {
  return FIXED_ANNUAL_HOLIDAYS.has(key.slice(5)) || RAKSHA_BANDHAN_DATES.has(key);
}

/**
 * Creates a complete month view from persisted attendance. Missing completed
 * working days are absences; future dates are intentionally left unmarked.
 */
export function deriveMonthAttendance(options: {
  year: number;
  month: number;
  records: CalendarAttendanceRecord[];
  leaveRanges?: AttendanceLeaveRange[];
  workingDays?: number[];
  employmentStartDate?: string | null;
  todayKey?: string;
}) {
  const {
    year,
    month,
    records,
    leaveRanges = [],
    workingDays = DEFAULT_WORKING_DAYS,
    employmentStartDate,
    todayKey = dateKeyInIndia(),
  } = options;
  const firstEligibleDate = employmentStartDate && employmentStartDate > CRM_ATTENDANCE_START_DATE
    ? employmentStartDate
    : CRM_ATTENDANCE_START_DATE;
  const recorded = new Map(records.map((row) => [row.attendance_date, row]));
  const totalDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const map: Record<string, AttendanceStatus | string> = {};

  for (let day = 1; day <= totalDays; day += 1) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const row = recorded.get(key);
    if (row) {
      map[key] = row.check_in || row.punch_in_at ? 'Present' : row.status;
      continue;
    }
    if (key < firstEligibleDate || key >= todayKey) continue;
    if (isCompanyHoliday(key)) {
      map[key] = 'Holiday';
    } else if (!workingDays.includes(weekdayForKey(key))) {
      map[key] = 'Weekly Off';
    } else if (isApprovedLeave(key, leaveRanges)) {
      map[key] = 'On Leave';
    } else {
      map[key] = 'Absent';
    }
  }

  return map;
}
