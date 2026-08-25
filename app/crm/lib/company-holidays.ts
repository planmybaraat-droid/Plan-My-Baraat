import { crmSupabase } from './supabase-crm';

export interface CompanyHoliday {
  holiday_date: string;
  holiday_key: string;
  name: string;
}

export async function getCompanyHolidays(from: string, to: string): Promise<CompanyHoliday[]> {
  const { data, error } = await crmSupabase.rpc('crm_get_company_holidays', {
    p_from: from,
    p_to: to,
  });
  if (error) throw new Error(error.message);
  return (data || []).map((row: CompanyHoliday) => ({
    ...row,
    holiday_date: String(row.holiday_date),
  }));
}

export async function getCompanyHolidaysForYears(years: number[]): Promise<CompanyHoliday[]> {
  const unique = Array.from(new Set(years)).filter(Number.isInteger).sort((a, b) => a - b);
  if (!unique.length) return [];
  return getCompanyHolidays(`${unique[0]}-01-01`, `${unique[unique.length - 1]}-12-31`);
}
