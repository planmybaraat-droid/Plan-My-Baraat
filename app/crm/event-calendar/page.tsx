'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Package, Phone, ReceiptText, Loader2, Cake, PartyPopper } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import { useSidebar } from '../sidebar-context';
import { getCompanyHolidaysForYears, getConfirmedEvents, getStaffBirthdaysForYears } from './event-calendar-data';
import type { CalendarEvent, BirthdayEvent, HolidayEvent } from './event-calendar-data';

const INVOICE_STYLE: Record<string, string> = {
  Paid: 'bg-emerald-50 text-emerald-700',
  'Partially Paid': 'bg-amber-50 text-amber-700',
  Issued: 'bg-blue-50 text-blue-700',
  Overdue: 'bg-red-50 text-red-700',
  Draft: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-gray-100 text-gray-500',
};

type ListItem = ({ kind: 'event' } & CalendarEvent) | ({ kind: 'birthday' } & BirthdayEvent) | ({ kind: 'holiday' } & HolidayEvent);

export default function EventCalendarPage() {
  const { open } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [birthdays, setBirthdays] = useState<BirthdayEvent[]>([]);
  const [holidays, setHolidays] = useState<HolidayEvent[]>([]);
  const [monthCursor, setMonthCursor] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try { setEvents(await getConfirmedEvents()); } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  // Birthdays repeat yearly — refetch (cheaply) whenever the displayed year
  // changes, covering the year either side so nothing is missed right at a
  // year boundary while navigating months.
  useEffect(() => {
    (async () => {
      try {
        const years=[monthCursor.year - 1, monthCursor.year, monthCursor.year + 1];
        const [birthdayRows,holidayRows]=await Promise.all([getStaffBirthdaysForYears(years),getCompanyHolidaysForYears(years)]);
        setBirthdays(birthdayRows); setHolidays(holidayRows);
      }
      catch (err) { console.error(err); }
    })();
  }, [monthCursor.year]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => { (map[e.event_date] ||= []).push(e); });
    return map;
  }, [events]);

  const birthdaysByDate = useMemo(() => {
    const map: Record<string, BirthdayEvent[]> = {};
    birthdays.forEach((b) => { (map[b.date] ||= []).push(b); });
    return map;
  }, [birthdays]);

  const holidaysByDate = useMemo(() => {
    const map: Record<string, HolidayEvent[]> = {};
    holidays.forEach((holiday) => { (map[holiday.holiday_date] ||= []).push(holiday); });
    return map;
  }, [holidays]);

  const calendarDays = useMemo(() => {
    const { year, month } = monthCursor;
    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const todayKey = new Date().toISOString().slice(0, 10);
    const cells: { key: string; day: number; eventCount: number; birthdayCount: number; holidayCount: number; isToday: boolean }[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push({ key: `pad-${i}`, day: 0, eventCount: 0, birthdayCount: 0, holidayCount: 0, isToday: false });
    for (let d = 1; d <= totalDays; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ key, day: d, eventCount: (eventsByDate[key] || []).length, birthdayCount: (birthdaysByDate[key] || []).length, holidayCount: (holidaysByDate[key] || []).length, isToday: key === todayKey });
    }
    return cells;
  }, [monthCursor, eventsByDate, birthdaysByDate, holidaysByDate]);

  const monthLabel = new Date(monthCursor.year, monthCursor.month, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const changeMonth = (delta: number) => { setSelectedDate(null); setMonthCursor((c) => { const d = new Date(c.year, c.month + delta, 1); return { year: d.getFullYear(), month: d.getMonth() }; }); };

  const todayKey = new Date().toISOString().slice(0, 10);

  const listItems: ListItem[] = useMemo(() => {
    if (selectedDate) {
      return [
        ...(holidaysByDate[selectedDate] || []).map((holiday) => ({ kind: 'holiday' as const, ...holiday })),
        ...(birthdaysByDate[selectedDate] || []).map((b) => ({ kind: 'birthday' as const, ...b })),
        ...(eventsByDate[selectedDate] || []).map((e) => ({ kind: 'event' as const, ...e })),
      ];
    }
    const upcomingEvents = events.filter((e) => e.event_date >= todayKey).map((e) => ({ kind: 'event' as const, ...e }));
    const upcomingBirthdays = birthdays.filter((b) => b.date >= todayKey).map((b) => ({ kind: 'birthday' as const, ...b }));
    const upcomingHolidays = holidays.filter((holiday) => holiday.holiday_date >= todayKey).map((holiday) => ({ kind: 'holiday' as const, ...holiday }));
    return [...upcomingEvents, ...upcomingBirthdays, ...upcomingHolidays].sort((a, b) => {
      const da = a.kind === 'event' ? a.event_date : a.kind === 'birthday' ? a.date : a.holiday_date;
      const db = b.kind === 'event' ? b.event_date : b.kind === 'birthday' ? b.date : b.holiday_date;
      return da.localeCompare(db);
    });
  }, [selectedDate, events, birthdays, holidays, eventsByDate, birthdaysByDate, holidaysByDate, todayKey]);

  return (
    <>
      <CrmHeader
        title="Event Calendar"
        subtitle="Confirmed bookings, staff birthdays and company holidays"
        onMenuClick={open}
      />
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center"><Loader2 size={28} className="animate-spin text-red-500" /></div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr,380px]">
            {/* Calendar */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-gray-950">{monthLabel}</p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => changeMonth(-1)} className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"><ChevronLeft size={15} /></button>
                  <button onClick={() => { setSelectedDate(null); const d = new Date(); setMonthCursor({ year: d.getFullYear(), month: d.getMonth() }); }} className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] font-bold text-gray-600 hover:bg-gray-50">Today</button>
                  <button onClick={() => changeMonth(1)} className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"><ChevronRight size={15} /></button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-gray-400">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d}>{d}</div>)}
              </div>
              <div className="mt-1.5 grid grid-cols-7 gap-1.5">
                {calendarDays.map((c) => (
                  <button
                    key={c.key}
                    disabled={c.day === 0}
                    onClick={() => setSelectedDate(selectedDate === c.key ? null : c.key)}
                    className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-sm transition-colors ${c.day === 0 ? 'invisible' : ''} ${selectedDate === c.key ? 'border-red-600 bg-red-50' : c.holidayCount ? 'border-amber-100 bg-amber-50/70' : c.isToday ? 'border-red-200 bg-white' : 'border-transparent hover:bg-gray-50'}`}
                  >
                    <span className={`font-bold ${c.isToday ? 'text-red-600' : 'text-gray-700'}`}>{c.day}</span>
                    {(c.eventCount > 0 || c.birthdayCount > 0 || c.holidayCount > 0) && (
                      <span className="mt-1 flex items-center gap-0.5">
                        {Array.from({ length: Math.min(c.eventCount, 3) }).map((_, i) => <i key={`e${i}`} className="h-1.5 w-1.5 rounded-full bg-red-500" />)}
                        {c.eventCount > 3 && <span className="text-[8px] font-black text-red-500">+</span>}
                        {c.birthdayCount > 0 && <Cake size={10} className="text-pink-500" />}
                        {c.holidayCount > 0 && <PartyPopper size={10} className="text-amber-600" />}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-gray-100 pt-4 text-[11px] font-semibold text-gray-500">
                <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-red-500" /> Confirmed event day</span>
                <span className="flex items-center gap-1.5"><Cake size={12} className="text-pink-500" /> Staff birthday</span>
                <span className="flex items-center gap-1.5"><PartyPopper size={12} className="text-amber-600" /> Company holiday</span>
                <span className="ml-auto flex items-center gap-1"><CalendarDays size={13} className="text-gray-400" /> {events.length} confirmed events total</span>
              </div>
            </div>

            {/* Event list */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-gray-950">
                  {selectedDate ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upcoming'}
                </p>
                {selectedDate && <button onClick={() => setSelectedDate(null)} className="text-[11px] font-bold text-red-600">Show all upcoming</button>}
              </div>
              <div className="mt-3 max-h-[560px] space-y-2.5 overflow-y-auto">
                {!listItems.length ? (
                  <div className="py-16 text-center">
                    <CalendarDays className="mx-auto text-gray-300" size={28} />
                    <p className="mt-3 text-sm font-bold text-gray-400">Nothing {selectedDate ? 'on this day' : 'coming up'}</p>
                    <p className="mt-1 text-[11px] text-gray-400">Events appear once an agreement is signed and an invoice is raised.</p>
                  </div>
                ) : listItems.map((item) => item.kind === 'holiday' ? (
                  <div key={`holiday-${item.holiday_date}-${item.holiday_key}`} className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1.5 truncate text-sm font-bold text-gray-900"><PartyPopper size={14} className="text-amber-600" /> {item.name}</p>
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black uppercase text-amber-800">Holiday</span>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-amber-700">{new Date(`${item.holiday_date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                ) : item.kind === 'birthday' ? (
                  <div key={`bday-${item.staff_id}-${item.date}`} className="rounded-xl border border-pink-100 bg-pink-50/40 p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1.5 truncate text-sm font-bold text-gray-900"><Cake size={14} className="text-pink-500" /> {item.full_name}</p>
                      <span className="shrink-0 rounded-full bg-pink-100 px-2 py-0.5 text-[9px] font-black uppercase text-pink-700">Birthday</span>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-pink-600">{new Date(`${item.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </div>
                ) : (
                  <Link key={item.agreement_id} href={`/crm/agreements/${item.agreement_id}`} className="block rounded-xl border border-gray-100 p-3.5 hover:bg-gray-50">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-gray-900">{item.client_name}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${INVOICE_STYLE[item.invoice_status] || 'bg-gray-100 text-gray-600'}`}>{item.invoice_status}</span>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-red-600">{new Date(`${item.event_date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><Package size={11} /> {item.package_name}</span>
                      {item.venue && <span className="flex items-center gap-1 truncate"><MapPin size={11} /> {item.venue}</span>}
                      <span className="flex items-center gap-1"><Phone size={11} /> {item.mobile}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-300">
                      <ReceiptText size={11} /> {item.invoice_number}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
