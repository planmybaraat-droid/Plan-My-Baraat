"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  CalendarDays,
  ChevronRight,
  Loader2,
  Save,
  Search,
  Settings2,
  TrendingUp,
  Users,
} from "lucide-react";
import CrmHeader from "../components/CrmHeader";
import { useSidebar } from "../sidebar-context";
import {
  loadPerformance,
  updateIncentiveConfig,
  type IncentiveConfig,
  type PerformanceResult,
} from "../lib/performance-data";
import { useCrmProfile } from "../lib/useCrmProfile";
import { resolveSectionAccess } from "../../../lib/crmSectionPermissions";

const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
const monthBounds = (month: string) => ({
  start: `${month}-01`,
  end: [
    month,
    new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0)
      .getDate()
      .toString()
      .padStart(2, "0"),
  ].join("-"),
});
const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function PerformancePage() {
  const { open } = useSidebar();
  const { profile } = useCrmProfile();
  const initial = today().slice(0, 7);
  const [month, setMonth] = useState(initial);
  const [{ start, end }, setRange] = useState(monthBounds(initial));
  const [rows, setRows] = useState<PerformanceResult[]>([]);
  const [config, setConfig] = useState<IncentiveConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [performance, setPerformance] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await loadPerformance({ start, end });
      setRows(data.results);
      setConfig(data.config);
    } catch (c) {
      setError(
        c instanceof Error ? c.message : "Unable to load staff performance.",
      );
    } finally {
      setLoading(false);
    }
  }, [start, end]);
  useEffect(() => {
    load();
  }, [load]);
  const selectMonth = (value: string) => {
    setMonth(value);
    setRange(monthBounds(value));
  };
  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          rows.map((r) => r.staff.department).filter(Boolean) as string[],
        ),
      ).sort(),
    [rows],
  );
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const term =
          `${r.staff.full_name} ${r.staff.employee_code || ""} ${r.staff.job_title || ""}`.toLowerCase();
        if (search && !term.includes(search.toLowerCase())) return false;
        if (department && r.staff.department !== department) return false;
        if (performance === "excellent" && r.totalScore < 85) return false;
        if (performance === "good" && (r.totalScore < 60 || r.totalScore >= 85))
          return false;
        if (performance === "attention" && r.totalScore >= 60) return false;
        return true;
      }),
    [rows, search, department, performance],
  );
  const canConfigure = resolveSectionAccess(
    profile?.role,
    profile?.sectionAccess,
    "performance",
  );
  const saveConfig = async () => {
    if (!config) return;
    const total =
      config.attendance_weight +
      config.working_hours_weight +
      config.punctuality_weight +
      config.break_weight +
      config.daily_report_weight;
    if (total !== 100) {
      setMessage("Category weights must total 100.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await updateIncentiveConfig(config);
      setMessage("Incentive rules saved. Live scores have been recalculated.");
      await load();
    } catch (c) {
      setMessage(
        c instanceof Error ? c.message : "Unable to save incentive rules.",
      );
    } finally {
      setSaving(false);
    }
  };
  const average = rows.length
    ? Math.round(rows.reduce((s, r) => s + r.totalScore, 0) / rows.length)
    : 0;
  const approved = rows.filter((r) => r.status !== "Estimated").length;
  return (
    <>
      <CrmHeader
        title="Staff Performance & Incentives"
        subtitle="Live scores from attendance, breaks and daily work reports"
        onMenuClick={open}
      />
      <main className="mx-auto w-full max-w-7xl space-y-4 p-3 sm:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Summary icon={Users} label="Staff" value={rows.length} />
          <Summary
            icon={TrendingUp}
            label="Average score"
            value={`${average}/100`}
          />
          <Summary icon={Award} label="Approved" value={approved} />
          <Summary
            icon={CalendarDays}
            label="Eligible days"
            value={rows.reduce((m, r) => Math.max(m, r.eligibleDays), 0)}
          />
        </div>
        <section className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
            <label className="relative lg:col-span-2">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff or employee ID"
                className="h-10 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-xs outline-none focus:border-red-500"
              />
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => selectMonth(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 px-3 text-xs outline-none focus:border-red-500"
            />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs"
            >
              <option value="">All departments</option>
              {departments.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <select
              value={performance}
              onChange={(e) => setPerformance(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs"
            >
              <option value="">All performance</option>
              <option value="excellent">85–100</option>
              <option value="good">60–84.99</option>
              <option value="attention">Below 60</option>
            </select>
            {canConfigure ? (
              <button
                onClick={() => setShowSettings((v) => !v)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                <Settings2 size={14} /> Rules
              </button>
            ) : (
              <div />
            )}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:max-w-md">
            <label className="text-[10px] font-bold text-gray-500">
              From
              <input
                type="date"
                value={start}
                onChange={(e) =>
                  setRange((r) => ({ ...r, start: e.target.value }))
                }
                className="mt-1 h-9 w-full rounded-lg border border-gray-200 px-2 text-xs"
              />
            </label>
            <label className="text-[10px] font-bold text-gray-500">
              To
              <input
                type="date"
                value={end}
                onChange={(e) =>
                  setRange((r) => ({ ...r, end: e.target.value }))
                }
                className="mt-1 h-9 w-full rounded-lg border border-gray-200 px-2 text-xs"
              />
            </label>
          </div>
        </section>
        {showSettings && config && (
          <Rules
            config={config}
            setConfig={setConfig}
            saving={saving}
            message={message}
            onSave={saveConfig}
          />
        )}{" "}
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error}
          </p>
        )}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-4">
            <h2 className="text-sm font-black text-gray-950">
              Performance report
            </h2>
            <p className="mt-1 text-[10px] text-gray-400">
              {filtered.length} staff member{filtered.length === 1 ? "" : "s"} ·
              live until {end}
            </p>
          </div>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="animate-spin text-red-600" />
            </div>
          ) : !filtered.length ? (
            <div className="py-20 text-center text-xs text-gray-400">
              No staff match these filters.
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px] text-left">
                  <thead className="bg-gray-50 text-[9px] uppercase tracking-wider text-gray-400">
                    <tr>
                      <Th>Staff</Th>
                      <Th>Attendance</Th>
                      <Th>8 Hours</Th>
                      <Th>Timing</Th>
                      <Th>Breaks</Th>
                      <Th>Daily report</Th>
                      <Th>Total</Th>
                      <Th>Incentive</Th>
                      <Th>Status</Th>
                      <Th></Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((r) => (
                      <tr key={r.staff.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="text-xs font-bold">
                            {r.staff.full_name}
                          </p>
                          <p className="mt-1 text-[10px] text-gray-400">
                            {r.staff.employee_code || "—"} ·{" "}
                            {r.staff.department || "—"}
                          </p>
                        </td>
                        <Score value={r.attendanceScore} max={25} />
                        <Score value={r.workingHoursScore} max={20} />
                        <Score value={r.punctualityScore} max={20} />
                        <Score value={r.breakScore} max={20} />
                        <Score value={r.dailyReportScore} max={15} />
                        <td className="px-4 py-3">
                          <strong
                            className={
                              r.totalScore >= 85
                                ? "text-emerald-600"
                                : r.totalScore < 60
                                  ? "text-red-600"
                                  : "text-gray-900"
                            }
                          >
                            {r.totalScore}/100
                          </strong>
                        </td>
                        <td className="px-4 py-3 text-xs font-black">
                          {money(r.incentiveAmount)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge value={r.status} />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/crm/performance/${r.staff.id}?start=${start}&end=${end}`}
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 px-2 text-[10px] font-bold"
                          >
                            Details <ChevronRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="divide-y divide-gray-100 lg:hidden">
                {filtered.map((r) => (
                  <Link
                    key={r.staff.id}
                    href={`/crm/performance/${r.staff.id}?start=${start}&end=${end}`}
                    className="block p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">
                          {r.staff.full_name}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {r.staff.employee_code || "—"} ·{" "}
                          {r.staff.department || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-red-600">
                          {r.totalScore}
                        </p>
                        <p className="text-[9px] text-gray-400">OUT OF 100</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                      <span>
                        Attendance <b>{r.attendanceScore}/25</b>
                      </span>
                      <span>
                        8 Hours <b>{r.workingHoursScore}/20</b>
                      </span>
                      <span>
                        Timing <b>{r.punctualityScore}/20</b>
                      </span>
                      <span>
                        Breaks <b>{r.breakScore}/20</b>
                      </span>
                      <span>
                        Reports <b>{r.dailyReportScore}/15</b>
                      </span>
                      <span className="font-black">
                        {money(r.incentiveAmount)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}
function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <Icon size={16} className="text-red-600" />
      <p className="mt-4 text-xl font-black">{value}</p>
      <p className="mt-1 text-[9px] font-black uppercase tracking-wider text-gray-400">
        {label}
      </p>
    </div>
  );
}
function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-4 py-3 font-black">{children}</th>;
}
function Score({ value, max }: { value: number; max: number }) {
  return (
    <td className="px-4 py-3 text-xs font-bold">
      {value}
      <span className="text-gray-300">/{max}</span>
    </td>
  );
}
function Badge({ value }: { value: string }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[9px] font-black uppercase ${value === "Estimated" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
    >
      {value}
    </span>
  );
}
function Rules({
  config,
  setConfig,
  saving,
  message,
  onSave,
}: {
  config: IncentiveConfig;
  setConfig: (v: IncentiveConfig) => void;
  saving: boolean;
  message: string;
  onSave: () => void;
}) {
  const number = (
    key: keyof IncentiveConfig,
    label: string,
    min = 0,
    max?: number,
  ) => (
    <label className="text-[10px] font-bold text-gray-500">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={String(config[key])}
        onChange={(e) =>
          setConfig({ ...config, [key]: Number(e.target.value) })
        }
        className="mt-1 h-9 w-full rounded-lg border border-gray-200 px-2 text-xs"
      />
    </label>
  );
  return (
    <section className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black">Incentive rules</h2>
          <p className="mt-1 text-[10px] text-gray-400">
            Shared Admin and Manager rules used by every live calculation.
            Punctuality deductions are gradual: 0.5 for slightly late, 1 for
            late and 2 for severely late. The management bonus is always
            calculated on a fixed ₹3,000 base.
          </p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-bold text-white disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Save size={13} />
          )}{" "}
          Save
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {number("attendance_weight", "Attendance points")}
        {number("working_hours_weight", "8-hour points")}
        {number("punctuality_weight", "Punctuality points")}
        {number("break_weight", "Break points")}
        {number("daily_report_weight", "DWR points")}
        {number("required_work_minutes", "Required minutes", 1)}
        {number("allowed_breaks_per_day", "Breaks allowed")}
        {number("late_grace_minutes", "On-time grace (minutes)", 0, 60)}
        {number("break_violation_deduction", "Deduction / break violation")}
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-gray-400">
        Management bonus is awarded separately per staff member from the Details
        page and is capped at 25% of the fixed ₹3,000 management base.
      </p>
      {message && (
        <p className="mt-3 text-xs font-semibold text-red-600">{message}</p>
      )}
    </section>
  );
}
