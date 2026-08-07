'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowUpRight, Download, FileCheck2, Loader2, Search, Wallet,
} from 'lucide-react';
import CrmHeader from '../../components/CrmHeader';
import { useSidebar } from '../../sidebar-context';
import { getStaff } from '../../staff/staff-data';
import type { PayrollRecord, PayrollStatus, SalaryHistoryEntry, SalaryRecord, StaffRecord } from '../../lib/types';
import {
  generatePayslip, getPayroll, getPrivateCrmFileUrl, getSalaryHistory, getSalaryRecord, updatePayrollStatus,
  updatePayslipFile, upsertPayroll,
} from '../hr-data';
import { MONTH_NAMES, PAYROLL_STATUSES, createBlankPayroll, currency, monthLabel } from '../hr-config';
import PayslipDocument from './components/PayslipDocument';

const PAYROLL_STATUS_STYLES: Record<PayrollStatus, string> = {
  Paid: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Hold: 'bg-red-50 text-red-700',
  Processing: 'bg-blue-50 text-blue-700',
};

const EVENT_STYLES: Record<string, string> = {
  Offer: 'bg-blue-50 text-blue-700 border-blue-200',
  Increment: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Promotion: 'bg-violet-50 text-violet-700 border-violet-200',
  Revision: 'bg-amber-50 text-amber-700 border-amber-200',
  Transfer: 'bg-gray-50 text-gray-700 border-gray-200',
  Confirmation: 'bg-gray-50 text-gray-700 border-gray-200',
};

function StatCell({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{label}</p><p className="mt-1 text-sm font-black text-gray-950">{value}</p></div>;
}

export default function PayrollPage() {
  const { open } = useSidebar();
  const [employees, setEmployees] = useState<StaffRecord[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);

  const [salary, setSalary] = useState<SalaryRecord | null>(null);
  const [history, setHistory] = useState<SalaryHistoryEntry[]>([]);
  const [payrollRows, setPayrollRows] = useState<PayrollRecord[]>([]);
  const [busy, setBusy] = useState('');

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const documentRef = useRef<HTMLDivElement>(null);
  const [activePayroll, setActivePayroll] = useState<PayrollRecord | null>(null);

  useEffect(() => {
    getStaff().then(list => { setEmployees(list); setLoading(false); });
  }, []);

  const selectedEmployee = employees.find(item => item.id === selectedId) || null;

  const loadEmployeeData = async (employeeId: string) => {
    const [salaryRecord, historyList, payroll] = await Promise.all([
      getSalaryRecord(employeeId), getSalaryHistory(employeeId), getPayroll({ employeeId }),
    ]);
    setSalary(salaryRecord);
    setHistory(historyList);
    setPayrollRows(payroll);
  };

  useEffect(() => {
    if (!selectedEmployee) { setSalary(null); setHistory([]); setPayrollRows([]); return; }
    loadEmployeeData(selectedEmployee.id);
  }, [selectedEmployee?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(item => item.full_name.toLowerCase().includes(q) || item.employee_code.toLowerCase().includes(q));
  }, [employees, search]);

  const currentPeriodPayroll = payrollRows.find(row => row.month === month && row.year === year) || null;

  const processPayroll = async () => {
    if (!selectedEmployee) return;
    setBusy('process');
    try {
      const blank = createBlankPayroll(selectedEmployee.id, month, year, salary);
      await upsertPayroll(blank);
      await loadEmployeeData(selectedEmployee.id);
    } finally {
      setBusy('');
    }
  };

  const setStatus = async (row: PayrollRecord, status: PayrollStatus) => {
    setBusy(row.id);
    try {
      await updatePayrollStatus(row.id, status);
      if (selectedEmployee) await loadEmployeeData(selectedEmployee.id);
    } finally {
      setBusy('');
    }
  };

  const buildAndDownloadPayslip = async (row: PayrollRecord) => {
    setBusy(`payslip-${row.id}`);
    try {
      let payslip = row.payslip;
      if (!payslip) payslip = await generatePayslip(row.id);
      setActivePayroll({ ...row, payslip });
      await new Promise(resolve => setTimeout(resolve, 80));
      if (!documentRef.current) return;
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const page = documentRef.current.querySelector<HTMLElement>('[data-pdf-page]');
      if (!page) return;
      const canvas = await html2canvas(page, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, windowWidth: 794 });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.save(`${payslip.payslip_number}-${(row.employee?.full_name ?? 'unknown').replace(/[^a-z0-9]+/gi, '-')}.pdf`);
      const blob = pdf.output('blob');
      const { crmSupabase } = await import('../../lib/supabase-crm');
      const path = `payslips/${row.employee_id}/${payslip.payslip_number}.pdf`;
      const { error: uploadError } = await crmSupabase.storage.from('crm-files').upload(path, blob, { upsert: true, contentType: 'application/pdf' });
      if (!uploadError) {
        await updatePayslipFile(payslip.id, path);
        await getPrivateCrmFileUrl(path);
      }
      if (selectedEmployee) await loadEmployeeData(selectedEmployee.id);
    } finally {
      setBusy('');
    }
  };

  return (
    <>
      <CrmHeader
        title="Salary & Payroll"
        subtitle="Salary details, payroll history and payslips"
        onMenuClick={open}
        actions={<Link href="/crm/hr" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-950"><ArrowLeft size={15} /> <span className="hidden sm:inline">HR</span></Link>}
      />

      <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-[300px_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative mb-3">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="w-full rounded-xl border border-gray-200 py-2 pl-8 pr-3 text-xs focus:border-gray-400 focus:outline-none" />
          </div>
          {loading ? (
            <div className="flex h-40 items-center justify-center"><Loader2 size={20} className="animate-spin text-red-600" /></div>
          ) : (
            <div className="max-h-[calc(100vh-16rem)] space-y-1 overflow-y-auto">
              {filteredEmployees.map(item => (
                <button key={item.id} onClick={() => setSelectedId(item.id)} className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left ${selectedId === item.id ? 'bg-gray-950 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg text-[11px] font-black ${selectedId === item.id ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {item.photo_url ? <img src={item.photo_url} alt={item.full_name} className="h-full w-full object-cover" /> : item.full_name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0"><p className="truncate text-xs font-bold">{item.full_name}</p><p className={`truncate text-[10px] ${selectedId === item.id ? 'text-white/60' : 'text-gray-400'}`}>{currency(item.current_salary || 0)}/yr</p></div>
                </button>
              ))}
            </div>
          )}
        </div>

        {!selectedEmployee ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-200 text-sm text-gray-400">Select an employee to view salary & payroll.</div>
        ) : (
          <div className="space-y-6">
            {/* Employee salary card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-sm font-black text-gray-500">
                    {selectedEmployee.photo_url ? <img src={selectedEmployee.photo_url} alt={selectedEmployee.full_name} className="h-full w-full object-cover" /> : selectedEmployee.full_name.slice(0, 1).toUpperCase()}
                  </span>
                  <div><p className="text-sm font-black text-gray-950">{selectedEmployee.full_name}</p><p className="text-xs text-gray-400">{selectedEmployee.employee_code} · {selectedEmployee.department} · {selectedEmployee.designation || selectedEmployee.job_title}</p></div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current annual salary</p>
                  <p className="mt-1 text-xl font-black text-red-600">{currency(selectedEmployee.current_salary || 0)}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-4">
                <StatCell label="Salary status" value={salary?.status || 'Not set'} />
                <StatCell label="Monthly gross" value={currency(salary?.gross_salary || 0)} />
                <StatCell label="Monthly net" value={currency(salary?.net_salary || 0)} />
                <StatCell label="Last updated" value={salary ? new Date(salary.updated_at).toLocaleDateString('en-IN') : '—'} />
              </div>
            </div>

            {/* Salary breakdown */}
            {salary && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">Salary details</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  <StatCell label="Basic Salary" value={currency(salary.basic_salary)} />
                  <StatCell label="HRA" value={currency(salary.hra)} />
                  <StatCell label="Special Allowance" value={currency(salary.special_allowance)} />
                  <StatCell label="Travel Allowance" value={currency(salary.travel_allowance)} />
                  <StatCell label="Bonus" value={currency(salary.bonus)} />
                  <StatCell label="Incentive" value={currency(salary.incentive)} />
                  <StatCell label="PF" value={currency(salary.pf)} />
                  <StatCell label="ESIC" value={currency(salary.esic)} />
                  <StatCell label="Professional Tax" value={currency(salary.professional_tax)} />
                  <StatCell label="Other Deduction" value={currency(salary.other_deduction)} />
                  <StatCell label="Gross Salary" value={currency(salary.gross_salary)} />
                  <StatCell label="Net Salary" value={currency(salary.net_salary)} />
                </div>
              </div>
            )}

            {/* Salary history timeline */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-red-600">Salary history</p>
              {history.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-xs text-gray-400">No salary events yet — generate an Offer Letter to start.</div>
              ) : (
                <div className="space-y-0">
                  {history.map((entry, index) => (
                    <div key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {index < history.length - 1 && <span className="absolute left-[15px] top-8 h-full w-px bg-gray-100" />}
                      <span className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${EVENT_STYLES[entry.event_type] || 'border-gray-200 bg-white text-gray-400'}`}><ArrowUpRight size={13} /></span>
                      <div className="pt-0.5">
                        <p className="text-sm font-bold text-gray-900">{entry.event_type} — {currency(entry.new_salary)}{entry.previous_salary > 0 && <span className="ml-1.5 text-xs font-medium text-gray-400">(from {currency(entry.previous_salary)})</span>}</p>
                        {entry.reason && <p className="mt-1 text-xs leading-5 text-gray-500">{entry.reason}</p>}
                        <p className="mt-1.5 text-[10px] font-semibold text-gray-400">Effective {new Date(entry.effective_date).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payroll */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-600">Monthly payroll</p>
                <div className="flex items-center gap-2">
                  <select value={month} onChange={e => setMonth(Number(e.target.value))} className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-semibold">
                    {MONTH_NAMES.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}
                  </select>
                  <select value={year} onChange={e => setYear(Number(e.target.value))} className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-semibold">
                    {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {!currentPeriodPayroll && (
                    <button onClick={processPayroll} disabled={!salary || busy === 'process'} className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-red-700 disabled:opacity-50"><Wallet size={12} /> {busy === 'process' ? 'Processing...' : `Process ${monthLabel(month, year)}`}</button>
                  )}
                </div>
              </div>

              {payrollRows.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-xs text-gray-400">No payroll runs yet for this employee.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                      <tr><th className="py-2">Period</th><th className="py-2">Gross</th><th className="py-2">Net</th><th className="py-2">Status</th><th className="py-2 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {payrollRows.map(row => (
                        <tr key={row.id}>
                          <td className="py-3 font-semibold text-gray-800">{monthLabel(row.month, row.year)}</td>
                          <td className="py-3 text-gray-600">{currency(row.gross_salary)}</td>
                          <td className="py-3 font-bold text-gray-950">{currency(row.net_salary)}</td>
                          <td className="py-3">
                            <select value={row.status} onChange={e => setStatus(row, e.target.value as PayrollStatus)} disabled={busy === row.id} className={`rounded-full border-0 px-2 py-1 text-[10px] font-black uppercase ${PAYROLL_STATUS_STYLES[row.status]}`}>
                              {PAYROLL_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                          </td>
                          <td className="py-3">
                            <div className="flex justify-end gap-1.5">
                              {row.payslip?.file_url ? (
                                <a href={row.payslip.file_url} download className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[10px] font-bold text-gray-600 hover:bg-gray-50"><Download size={11} /> Payslip</a>
                              ) : (
                                <button onClick={() => buildAndDownloadPayslip(row)} disabled={busy === `payslip-${row.id}`} className="inline-flex items-center gap-1 rounded-lg bg-gray-950 px-2 py-1 text-[10px] font-bold text-white hover:bg-red-600 disabled:opacity-50"><FileCheck2 size={11} /> {busy === `payslip-${row.id}` ? 'Generating...' : 'Generate payslip'}</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {activePayroll?.payslip && (
        <div style={{ position: 'fixed', left: -9999, top: 0 }}>
          <PayslipDocument ref={documentRef} payroll={activePayroll} payslip={activePayroll.payslip} />
        </div>
      )}
    </>
  );
}
