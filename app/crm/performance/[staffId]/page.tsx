/* The loader is intentionally tied to the URL period and staff id. */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Loader2,
  MessageSquareText,
  ShieldCheck,
  TimerReset,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import CrmHeader from "../../components/CrmHeader";
import { useSidebar } from "../../sidebar-context";
import {
  approvePerformance,
  formatPerformanceMinutes,
  formatPerformanceTime,
  loadPerformance,
  reviewLateReason,
  type IncentiveConfig,
  type PerformanceDay,
  type PerformanceResult,
} from "../../lib/performance-data";
const money = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);
const labelDate = (v: string) =>
  new Date(`${v}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
export default function PerformanceDetailPage() {
  const { open } = useSidebar();
  const params = useParams<{ staffId: string }>();
  const query = useSearchParams();
  const start =
    query.get("start") || new Date().toISOString().slice(0, 7) + "-01";
  const end = query.get("end") || new Date().toISOString().slice(0, 10);
  const [result, setResult] = useState<PerformanceResult | null>(null);
  const [config, setConfig] = useState<IncentiveConfig | null>(null);
  const [managementBonusPercent, setManagementBonusPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reviewingAttendanceId, setReviewingAttendanceId] = useState<string | null>(null);
  const [selectedReportDay, setSelectedReportDay] =
    useState<PerformanceDay | null>(null);
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await loadPerformance({
        start,
        end,
        staffId: params.staffId,
      });
      const next = data.results[0] || null;
      setResult(next);
      setManagementBonusPercent(next?.managementBonusPercent || 0);
      setConfig(data.config);
    } catch (c) {
      setError(c instanceof Error ? c.message : "Unable to load performance.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [params.staffId, start, end]);
  const approve = async () => {
    if (!result || !config) return;
    setBusy(true);
    try {
      await approvePerformance(result, config, "", managementBonusPercent);
      await load();
    } catch (c) {
      setError(c instanceof Error ? c.message : "Unable to approve incentive.");
    } finally {
      setBusy(false);
    }
  };
  const reviewLate = async (day: PerformanceDay, decision: "Approved" | "Rejected") => {
    if (!day.attendanceId) return;
    setReviewingAttendanceId(day.attendanceId); setError("");
    try {
      await reviewLateReason(day.attendanceId, decision);
      await load();
    } catch (c) {
      setError(c instanceof Error ? c.message : "Unable to review the late explanation.");
    } finally {
      setReviewingAttendanceId(null);
    }
  };
  const previewBonus = result
    ? Math.round(
        (result.managementBonusBaseAmount * managementBonusPercent) / 100,
      )
    : 0;
  return (
    <>
      <CrmHeader
        title={result?.staff.full_name || "Performance details"}
        subtitle={`${start} to ${end}`}
        onMenuClick={open}
        actions={
          <Link
            href="/crm/performance"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-[10px] font-bold"
          >
            <ArrowLeft size={13} /> Back
          </Link>
        }
      />
      <main className="mx-auto max-w-7xl space-y-4 p-3 sm:p-6">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error}
          </p>
        )}
        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <Loader2 className="animate-spin text-red-600" />
          </div>
        ) : !result ? (
          <p className="rounded-2xl bg-white p-16 text-center text-sm">
            Staff performance not found.
          </p>
        ) : (
          <>
            <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 to-gray-800 p-5 text-white shadow-xl sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[.2em] text-red-400">
                    {result.staff.employee_code || "Staff"} ·{" "}
                    {result.staff.department || "Department"}
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {result.staff.full_name}
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    {result.staff.job_title ||
                      result.staff.role ||
                      "Team member"}{" "}
                    · {result.eligibleDays} eligible days
                  </p>
                </div>
                <div className="flex flex-wrap items-end gap-6 sm:justify-end">
                  <div>
                    <p className="text-4xl font-black">
                      {result.totalScore}
                      <span className="text-lg text-gray-500">/100</span>
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-widest text-gray-400">
                      Live performance
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-2xl font-black text-red-400">
                      {money(result.incentiveAmount)}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-widest text-gray-400">
                      {result.status} incentive
                    </p>
                    <p className="mt-2 text-[10px] text-gray-400">
                      Earned {money(result.baseIncentiveAmount)} +{" "}
                      {result.managementBonusPercent}% of{" "}
                      {money(result.managementBonusBaseAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <Card
                label="Attendance"
                value={result.attendanceScore}
                max={25}
                note={`${result.presentDays}/${result.eligibleDays} present`}
              />
              <Card
                label="8 Working Hours"
                value={result.workingHoursScore}
                max={20}
                note={`${result.completedHoursDays}/${result.eligibleDays} completed`}
              />
              <Card
                label="Punctuality"
                value={result.punctualityScore}
                max={20}
                note={`${result.onTimeDays}/${result.presentDays} on time · ${result.totalLateMinutes} min late`}
              />
              <Card
                label="Break Compliance"
                value={result.breakScore}
                max={20}
                note={`${result.breakViolationDays} violations`}
              />
              <Card
                label="Daily Work Report"
                value={result.dailyReportScore}
                max={15}
                note={`${result.reportDays}/${result.eligibleDays} submitted`}
              />
            </div>
            <section className="grid gap-3 sm:grid-cols-3">
              <TimingValue
                icon={<Clock3 size={16} />}
                label="Original late time"
                value={formatPerformanceMinutes(
                  result.totalOriginalLateMinutes,
                )}
                note="Before extra work is adjusted"
              />
              <TimingValue
                icon={<TimerReset size={16} />}
                label="Late time recovered"
                value={formatPerformanceMinutes(
                  result.totalCompensatedLateMinutes,
                )}
                note={`${formatPerformanceMinutes(result.totalLateMinutes)} final late time`}
                tone="green"
              />
              <TimingValue
                icon={<Zap size={16} />}
                label="Actual overtime"
                value={formatPerformanceMinutes(result.totalOvertimeMinutes)}
                note={`${result.overtimeDays} overtime ${result.overtimeDays === 1 ? "day" : "days"}`}
                tone="red"
              />
            </section>
            <section className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <h2 className="text-sm font-black">
                    Management performance bonus
                  </h2>
                  <p className="mt-1 text-[10px] leading-relaxed text-gray-500">
                    Admin or an authorized manager can award 0–25%. The bonus is
                    always calculated on the fixed ₹3,000 management base and
                    does not change the staff performance score.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                    <BonusValue
                      label="Earned incentive"
                      value={money(result.baseIncentiveAmount)}
                    />
                    <BonusValue
                      label="Bonus base"
                      value={money(result.managementBonusBaseAmount)}
                    />
                    <BonusValue
                      label={`Bonus (${managementBonusPercent}%)`}
                      value={money(previewBonus)}
                    />
                    <BonusValue
                      label="Final incentive"
                      value={money(result.baseIncentiveAmount + previewBonus)}
                      accent
                    />
                  </div>
                </div>
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Bonus percentage
                  <input
                    type="number"
                    min={0}
                    max={25}
                    step={0.5}
                    value={managementBonusPercent}
                    onChange={(e) =>
                      setManagementBonusPercent(
                        Math.min(25, Math.max(0, Number(e.target.value) || 0)),
                      )
                    }
                    disabled={result.status === "Paid"}
                    className="mt-2 h-10 w-full rounded-xl border border-gray-200 px-3 text-sm font-black outline-none focus:border-red-500 disabled:bg-gray-100 sm:w-40"
                  />
                </label>
              </div>
            </section>
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-black">Day-wise breakdown</h2>
                  <p className="mt-1 text-[10px] text-gray-400">
                    Every deduction is traced to its source record. Arrivals
                    within the configured grace period count as on time.
                  </p>
                </div>
                <button
                  onClick={approve}
                  disabled={busy || result.status === "Paid"}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-bold text-white disabled:bg-gray-200 disabled:text-gray-500"
                >
                  {busy ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ShieldCheck size={14} />
                  )}{" "}
                  {result.status === "Estimated"
                    ? "Approve incentive"
                    : "Update incentive"}
                </button>
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[1060px] text-left">
                  <thead className="bg-gray-50 text-[9px] uppercase tracking-wider text-gray-400">
                    <tr>
                      {[
                        "Date",
                        "Attendance",
                        "Punch in / out",
                        "Net work",
                        "8 hours",
                        "Punctuality",
                        "Late recovery",
                        "Late explanation",
                        "Overtime",
                        "Breaks",
                        "Daily report",
                      ].map((v) => (
                        <th key={v} className="px-3 py-3 font-black">
                          {v}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {result.days.map((d) => (
                      <tr
                        key={d.date}
                        className={
                          d.state === "Excluded"
                            ? "bg-gray-50/60 text-gray-400"
                            : ""
                        }
                      >
                        <td className="px-3 py-3 text-xs font-bold">
                          {labelDate(d.date)}
                        </td>
                        <td className="px-3 py-3 text-[10px] font-bold">
                          {d.attendance}
                        </td>
                        <td className="px-3 py-3 text-[10px]">
                          {formatPerformanceTime(d.punchIn)} /{" "}
                          {formatPerformanceTime(d.punchOut)}
                        </td>
                        <td className="px-3 py-3 text-[10px] font-bold">
                          {formatPerformanceMinutes(d.workingMinutes)}
                        </td>
                        <Bool
                          value={d.completedHours}
                          muted={d.state !== "Complete"}
                        />
                        <td className="px-3 py-3 text-[10px]">
                          {d.state !== "Complete"
                            ? "—"
                            : d.lateExcused
                              ? `Excused · ${d.originalLateMinutes} min actual`
                              : d.late
                              ? `${d.lateSeverity} · ${d.lateMinutes} min`
                              : "On time"}
                        </td>
                        <td className="px-3 py-3 text-[10px]">
                          {d.state !== "Complete" || !d.originalLateMinutes
                            ? "—"
                            : d.lateExcused
                              ? `${d.originalLateMinutes} min · Approved genuine`
                            : d.compensatedLateMinutes
                              ? `${d.originalLateMinutes} min − ${d.compensatedLateMinutes} min`
                              : `${d.originalLateMinutes} min · Not recovered`}
                        </td>
                        <td className="px-3 py-3 text-[10px]">
                          {!d.lateReason ? (
                            <span className="text-gray-300">—</span>
                          ) : (
                            <div className="min-w-40 space-y-1.5">
                              <p className="leading-relaxed text-gray-600">{d.lateReason}</p>
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-black uppercase ${d.lateReasonStatus === "Approved" ? "bg-emerald-50 text-emerald-700" : d.lateReasonStatus === "Rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{d.lateReasonStatus || "Pending"}</span>
                              {d.lateReasonStatus === "Pending" && d.attendanceId && (
                                <div className="flex gap-1">
                                  <button type="button" disabled={reviewingAttendanceId === d.attendanceId} onClick={() => reviewLate(d, "Approved")} className="rounded-lg bg-emerald-600 px-2 py-1 text-[9px] font-bold text-white disabled:opacity-50">Approve genuine</button>
                                  <button type="button" disabled={reviewingAttendanceId === d.attendanceId} onClick={() => reviewLate(d, "Rejected")} className="rounded-lg border border-gray-200 px-2 py-1 text-[9px] font-bold text-gray-600 disabled:opacity-50">Reject</button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3 text-[10px] font-bold">
                          {d.state !== "Complete" || !d.overtimeMinutes
                            ? "—"
                            : formatPerformanceMinutes(d.overtimeMinutes)}
                        </td>
                        <td className="px-3 py-3 text-[10px]">
                          {d.breakCount} /{" "}
                          {d.breakCompliant ? "Within limit" : "Violation"}
                        </td>
                        <td className="px-3 py-3">
                          {d.reportSubmitted && d.report ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReportDay(d)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-[10px] font-bold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              aria-label={`View daily work report for ${labelDate(d.date)}`}
                            >
                              <Eye size={13} /> View
                            </button>
                          ) : d.state !== "Complete" ? (
                            <span className="text-gray-300">—</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500">
                              <XCircle size={14} /> Missing
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="divide-y divide-gray-100 md:hidden">
                {result.days.map((d) => (
                  <article key={d.date} className="p-4">
                    <div className="flex justify-between">
                      <p className="text-xs font-black">{labelDate(d.date)}</p>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-[9px] font-bold">
                        {d.state}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                      <span>
                        Attendance <b>{d.attendance}</b>
                      </span>
                      <span>
                        Net work{" "}
                        <b>{formatPerformanceMinutes(d.workingMinutes)}</b>
                      </span>
                      <span>
                        Punctuality{" "}
                        <b>
                          {d.state === "Complete"
                            ? d.lateExcused
                              ? `${d.originalLateMinutes} min · Excused`
                              : d.late
                              ? `${d.lateMinutes} min late`
                              : "On time"
                            : "—"}
                        </b>
                      </span>
                      <span>
                        Late recovered{" "}
                        <b>
                          {d.state === "Complete"
                            ? formatPerformanceMinutes(
                                d.compensatedLateMinutes,
                              )
                            : "—"}
                        </b>
                      </span>
                      {d.lateReason && (
                        <div className="col-span-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
                          <p className="flex items-center gap-1.5 font-black text-gray-700"><MessageSquareText size={12} /> Late explanation</p>
                          <p className="mt-1.5 leading-relaxed text-gray-600">{d.lateReason}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className={`rounded-full px-2 py-1 text-[8px] font-black uppercase ${d.lateReasonStatus === "Approved" ? "bg-emerald-50 text-emerald-700" : d.lateReasonStatus === "Rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{d.lateReasonStatus || "Pending"}</span>
                            {d.lateReasonStatus === "Pending" && d.attendanceId && <><button type="button" disabled={reviewingAttendanceId === d.attendanceId} onClick={() => reviewLate(d, "Approved")} className="rounded-lg bg-emerald-600 px-2 py-1 font-bold text-white disabled:opacity-50">Approve genuine</button><button type="button" disabled={reviewingAttendanceId === d.attendanceId} onClick={() => reviewLate(d, "Rejected")} className="rounded-lg border border-gray-200 bg-white px-2 py-1 font-bold text-gray-600 disabled:opacity-50">Reject</button></>}
                          </div>
                        </div>
                      )}
                      <span>
                        Overtime{" "}
                        <b>
                          {d.state === "Complete"
                            ? formatPerformanceMinutes(d.overtimeMinutes)
                            : "—"}
                        </b>
                      </span>
                      <span>
                        Breaks <b>{d.breakCount}</b>
                      </span>
                      <span>
                        8 hours <b>{d.completedHours ? "Yes" : "No"}</b>
                      </span>
                      <span className="flex items-center gap-2">
                        DWR <b>{d.reportSubmitted ? "Submitted" : "Missing"}</b>
                        {d.reportSubmitted && d.report && (
                          <button
                            type="button"
                            onClick={() => setSelectedReportDay(d)}
                            className="inline-flex h-7 items-center gap-1 rounded-lg border border-gray-200 px-2 font-bold text-gray-700"
                          >
                            <Eye size={12} /> View
                          </button>
                        )}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      {selectedReportDay?.report && (
        <ReportViewer
          day={selectedReportDay}
          staffName={result?.staff.full_name || "Staff member"}
          onClose={() => setSelectedReportDay(null)}
        />
      )}
    </>
  );
}
function TimingValue({
  icon,
  label,
  value,
  note,
  tone = "gray",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  tone?: "gray" | "green" | "red";
}) {
  const palette =
    tone === "green"
      ? "border-emerald-100 bg-emerald-50/70 text-emerald-700"
      : tone === "red"
        ? "border-red-100 bg-red-50/70 text-red-700"
        : "border-gray-200 bg-white text-gray-700";
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${palette}`}>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 shadow-sm">
          {icon}
        </span>
        <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">
          {label}
        </p>
      </div>
      <p className="mt-3 text-xl font-black">{value}</p>
      <p className="mt-1 text-[10px] text-gray-500">{note}</p>
    </div>
  );
}
function ReportViewer({
  day,
  staffName,
  onClose,
}: {
  day: PerformanceDay;
  staffName: string;
  onClose: () => void;
}) {
  const report = day.report!;
  const done = report.items.filter(
    (item) => item.activity_status === "DONE",
  ).length;
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-gray-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={`Daily work report for ${labelDate(day.date)}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <header className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <FileText size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[.18em] text-red-600">
                Submitted daily work report
              </p>
              <h2 className="mt-1 truncate text-lg font-black text-gray-950">
                {labelDate(day.date)}
              </h2>
              <p className="mt-1 text-xs text-gray-500">{staffName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50"
            aria-label="Close daily work report"
          >
            <X size={16} />
          </button>
        </header>
        <div className="grid grid-cols-3 gap-2 border-b border-gray-100 bg-gray-50/70 p-4 sm:px-6">
          <ReportStat label="Activities" value={String(report.items.length)} />
          <ReportStat label="Completed" value={String(done)} />
          <ReportStat
            label="Pending"
            value={String(report.items.length - done)}
          />
        </div>
        <div className="overflow-y-auto p-4 sm:p-6">
          {!report.items.length ? (
            <div className="rounded-2xl border border-dashed border-gray-200 px-5 py-12 text-center text-sm text-gray-400">
              No activities were included in this report.
            </div>
          ) : (
            <div className="space-y-3">
              {report.items.map((item, index) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[10px] font-black text-gray-500">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-gray-900">
                          {item.activity_title}
                        </h3>
                        <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-wider ${
                        item.activity_status === "DONE"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.activity_status === "DONE" ? "Done" : "Pending"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 text-[10px] text-gray-500 sm:px-6">
          <span>
            Status: <b className="text-gray-800">{report.report_status}</b>
          </span>
          <span>
            Submitted: {report.submitted_at
              ? new Date(report.submitted_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "—"}
          </span>
        </footer>
      </section>
    </div>
  );
}
function ReportStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2.5 text-center shadow-sm">
      <p className="text-sm font-black text-gray-900">{value}</p>
      <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
    </div>
  );
}
function Card({
  label,
  value,
  max,
  note,
}: {
  label: string;
  value: number;
  max: number;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="mt-3 text-xl font-black">
        {value}
        <span className="text-xs text-gray-300">/{max}</span>
      </p>
      <p className="mt-1 text-[10px] text-gray-500">{note}</p>
    </div>
  );
}
function BonusValue({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 ${accent ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-900"}`}
    >
      <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}
function Bool({ value, muted }: { value: boolean; muted?: boolean }) {
  return (
    <td className="px-3 py-3">
      {muted ? (
        <span className="text-gray-300">—</span>
      ) : value ? (
        <CheckCircle2 size={15} className="text-emerald-500" />
      ) : (
        <XCircle size={15} className="text-red-500" />
      )}
    </td>
  );
}
