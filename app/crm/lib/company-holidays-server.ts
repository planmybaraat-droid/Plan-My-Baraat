import 'server-only';

import { getPanchangam, Observer } from '@ishubhamx/panchangam-js';

export interface GeneratedCompanyHoliday {
  holiday_date: string;
  holiday_key: string;
  name: string;
  source: string;
}

const VADODARA = new Observer(22.3072, 73.1812, 35);

const FIXED = [
  { holiday_key: 'makar_sankranti_pongal', name: 'Makar Sankranti / Pongal', monthDay: '01-14' },
  { holiday_key: 'republic_day', name: 'Republic Day', monthDay: '01-26' },
  { holiday_key: 'independence_day', name: 'Independence Day', monthDay: '08-15' },
  { holiday_key: 'gandhi_jayanti', name: 'Gandhi Jayanti', monthDay: '10-02' },
] as const;

type FestivalRule = {
  holiday_key: string;
  name: string;
  matches: (festivalName: string) => boolean;
  choose?: 'first' | 'last' | 'smarta' | 'exact-ganesh';
};

const FESTIVALS: FestivalRule[] = [
  { holiday_key: 'maha_shivaratri', name: 'Maha Shivaratri', matches: (v) => v === 'Maha Shivaratri' },
  { holiday_key: 'holi', name: 'Holi', matches: (v) => v.startsWith('Holi (Rangwali') },
  { holiday_key: 'ram_navami', name: 'Ram Navami', matches: (v) => v === 'Rama Navami' },
  { holiday_key: 'hanuman_jayanti', name: 'Hanuman Jayanti', matches: (v) => v === 'Hanuman Jayanti' },
  { holiday_key: 'jagannath_rath_yatra', name: 'Jagannath Rath Yatra', matches: (v) => v === 'Jagannath Rathyatra' },
  { holiday_key: 'raksha_bandhan', name: 'Raksha Bandhan', matches: (v) => v === 'Raksha Bandhan', choose: 'last' },
  { holiday_key: 'krishna_janmashtami', name: 'Krishna Janmashtami', matches: (v) => v.startsWith('Janmashtami'), choose: 'smarta' },
  { holiday_key: 'ganesh_chaturthi', name: 'Ganesh Chaturthi', matches: (v) => v === 'Ganesh Chaturthi' || v === 'Ganesh Chaturthi (Day 1)', choose: 'exact-ganesh' },
  { holiday_key: 'dussehra', name: 'Dussehra / Vijayadashami', matches: (v) => v === 'Vijaya Dashami (Dussehra)' },
  { holiday_key: 'dhanteras', name: 'Dhanteras', matches: (v) => v.startsWith('Dhanteras (') },
  { holiday_key: 'diwali', name: 'Diwali', matches: (v) => v === 'Diwali (Lakshmi Puja)' },
  { holiday_key: 'bhai_dooj_govardhan', name: 'Bhai Dooj / Govardhan Puja', matches: (v) => v.startsWith('Bhai Dooj ('), choose: 'last' },
];

function selectDate(rule: FestivalRule, candidates: Array<{ date: string; festivalName: string }>) {
  if (!candidates.length) return null;
  const ordered = [...candidates].sort((a, b) => a.date.localeCompare(b.date));
  if (rule.choose === 'last') return ordered.at(-1)!;
  if (rule.choose === 'smarta') return ordered.find((item) => item.festivalName.includes('(Smarta)')) || ordered[0];
  if (rule.choose === 'exact-ganesh') return ordered.find((item) => item.festivalName === 'Ganesh Chaturthi') || ordered[0];
  return ordered[0];
}

export function generateCompanyHolidaysForYear(year: number): GeneratedCompanyHoliday[] {
  if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new Error(`Unsupported holiday year: ${year}`);

  const candidates = new Map<string, Array<{ date: string; festivalName: string }>>();
  FESTIVALS.forEach((rule) => candidates.set(rule.holiday_key, []));

  for (let month = 0; month < 12; month += 1) {
    const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    for (let day = 1; day <= days; day += 1) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const date = new Date(Date.UTC(year, month, day, 6, 30)); // Noon in Asia/Kolkata.
      const panchang = getPanchangam(date, VADODARA, { timezoneOffset: 330, calendarType: 'purnimanta' });
      for (const festival of panchang.festivals || []) {
        for (const rule of FESTIVALS) {
          if (rule.matches(festival.name)) candidates.get(rule.holiday_key)!.push({ date: dateKey, festivalName: festival.name });
        }
      }
    }
  }

  const generated: GeneratedCompanyHoliday[] = FIXED.map((item) => ({
    holiday_date: `${year}-${item.monthDay}`,
    holiday_key: item.holiday_key,
    name: item.name,
    source: 'company-fixed-rule',
  }));

  for (const rule of FESTIVALS) {
    let selected = selectDate(rule, candidates.get(rule.holiday_key) || []);
    // Dhanteras is Trayodashi, two civil dates before the selected Diwali
    // closure. The Panchang engine can omit its label in rare years even
    // though it still calculates Diwali correctly, so keep the relationship
    // deterministic rather than failing the annual sync.
    if (!selected && rule.holiday_key === 'dhanteras') {
      const diwali = selectDate(FESTIVALS.find((item) => item.holiday_key === 'diwali')!, candidates.get('diwali') || []);
      if (diwali) {
        const date = new Date(`${diwali.date}T12:00:00Z`);
        date.setUTCDate(date.getUTCDate() - 2);
        selected = { date: date.toISOString().slice(0, 10), festivalName: 'Dhanteras (derived from Diwali)' };
      }
    }
    if (!selected) throw new Error(`Unable to calculate ${rule.name} for ${year}.`);
    generated.push({
      holiday_date: selected.date,
      holiday_key: rule.holiday_key,
      name: rule.name,
      source: 'panchangam-js-v3.0.0-vadodara',
    });
  }

  return generated.sort((a, b) => a.holiday_date.localeCompare(b.holiday_date));
}

export function generateCompanyHolidays(years: number[]) {
  return Array.from(new Set(years)).sort((a, b) => a - b).flatMap(generateCompanyHolidaysForYear);
}
