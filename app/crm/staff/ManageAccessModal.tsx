'use client';

import { useEffect, useState } from 'react';
import { Loader2, Shield, X } from 'lucide-react';
import type { StaffRecord } from '../lib/types';
import { updateStaffModuleAccess, updateStaffSectionAccess, getUserAccess } from './staff-data';
import { WORKSPACE_MODULES, type ModuleKey } from '../../../lib/modulePermissions';
import { CRM_SECTIONS, type CrmSectionKey } from '../../../lib/crmSectionPermissions';

interface ManageAccessModalProps {
  staff: StaffRecord;
  onClose: () => void;
  onSaved?: (access: Record<string, boolean>) => void;
}

export default function ManageAccessModal({ staff, onClose, onSaved }: ManageAccessModalProps) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('staff');
  const [access, setAccess] = useState<Record<ModuleKey, boolean>>({} as Record<ModuleKey, boolean>);
  const [sectionAccess, setSectionAccess] = useState<Record<CrmSectionKey, boolean>>({} as Record<CrmSectionKey, boolean>);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const isManager = role === 'manager';

  useEffect(() => {
    let active = true;
    if (!staff.user_id) { setLoading(false); return; }
    getUserAccess(staff.user_id)
      .then((result) => {
        if (!active) return;
        setRole(result.role);
        const nextModules = {} as Record<ModuleKey, boolean>;
        for (const m of WORKSPACE_MODULES) nextModules[m.key] = result.module_access[m.key] === true;
        setAccess(nextModules);
        const nextSections = {} as Record<CrmSectionKey, boolean>;
        for (const s of CRM_SECTIONS) nextSections[s.key] = result.crm_section_access[s.key] === true;
        setSectionAccess(nextSections);
        setLoading(false);
      })
      .catch((cause) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : 'Could not load permissions.');
        setLoading(false);
      });
    return () => { active = false; };
  }, [staff.user_id]);

  const isAdmin = role === 'admin' || role === 'super_admin';
  const toggle = (key: ModuleKey) => setAccess((current) => ({ ...current, [key]: !current[key] }));
  const toggleSection = (key: CrmSectionKey) => setSectionAccess((current) => ({ ...current, [key]: !current[key] }));
  const selectAll = () => setAccess(() => { const next = {} as Record<ModuleKey, boolean>; for (const m of WORKSPACE_MODULES) next[m.key] = true; return next; });
  const clearAll = () => setAccess(() => { const next = {} as Record<ModuleKey, boolean>; for (const m of WORKSPACE_MODULES) next[m.key] = false; return next; });
  const selectAllSections = () => setSectionAccess(() => { const next = {} as Record<CrmSectionKey, boolean>; for (const s of CRM_SECTIONS) next[s.key] = true; return next; });
  const clearAllSections = () => setSectionAccess(() => { const next = {} as Record<CrmSectionKey, boolean>; for (const s of CRM_SECTIONS) next[s.key] = false; return next; });

  const save = async () => {
    if (!staff.user_id) return;
    setSaving(true); setError(''); setSaved(false);
    try {
      if (isManager) {
        await updateStaffSectionAccess(staff.id, sectionAccess);
        onSaved?.(sectionAccess);
      } else {
        await updateStaffModuleAccess(staff.id, access);
        onSaved?.(access);
      }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save permissions.');
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = isManager
    ? Object.values(sectionAccess).filter(Boolean).length
    : Object.values(access).filter(Boolean).length;
  const totalCount = isManager ? CRM_SECTIONS.length : WORKSPACE_MODULES.length;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center overflow-hidden bg-gray-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4 sm:px-7">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[.2em] text-red-600"><Shield size={12} className="shrink-0" /> Manage Access</p>
            <h2 className="mt-1 truncate text-lg font-black text-gray-950">{staff.full_name}</h2>
            <p className="mt-1 truncate text-xs text-gray-400">{staff.job_title || 'Staff member'} · {staff.crm_id || staff.email}</p>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-xl p-2 text-gray-400 hover:bg-gray-100"><X size={19} /></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          {!staff.user_id ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">This staff member has no CRM login yet, so there&apos;s nothing to grant access to.</p>
          ) : loading ? (
            <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-red-600" size={24} /></div>
          ) : isAdmin ? (
            <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600">This account is an {role === 'super_admin' ? 'Super Admin' : 'Admin'} and already has full access to every module by default.</p>
          ) : isManager ? (
            <>
              <p className="text-[11px] text-gray-400">Manager accounts log into the CRM directly with a restricted sidebar — grant only the sections your Manager should see. Leads, Quotations, Agreements, Vendor Agreements, Invoices and system configuration always stay Admin-only.</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{enabledCount} of {totalCount} sections enabled</p>
                <div className="flex gap-2">
                  <button onClick={selectAllSections} className="text-[11px] font-bold text-red-600 hover:underline">Select all</button>
                  <span className="text-gray-300">·</span>
                  <button onClick={clearAllSections} className="text-[11px] font-bold text-gray-500 hover:underline">Clear all</button>
                </div>
              </div>
              <div className="mt-3 divide-y divide-gray-100 rounded-2xl border border-gray-200">
                {CRM_SECTIONS.map((sec) => (
                  <label key={sec.key} className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">{sec.label}</p>
                      <p className="mt-0.5 truncate text-[11px] text-gray-400">{sec.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSection(sec.key)}
                      aria-pressed={sectionAccess[sec.key]}
                      aria-label={`Toggle ${sec.label}`}
                      className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${sectionAccess[sec.key] ? 'bg-red-600' : 'bg-gray-200'}`}
                    >
                      <span className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${sectionAccess[sec.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{enabledCount} of {totalCount} modules enabled</p>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-[11px] font-bold text-red-600 hover:underline">Select all</button>
                  <span className="text-gray-300">·</span>
                  <button onClick={clearAll} className="text-[11px] font-bold text-gray-500 hover:underline">Clear all</button>
                </div>
              </div>
              <div className="mt-3 divide-y divide-gray-100 rounded-2xl border border-gray-200">
                {WORKSPACE_MODULES.map((mod) => (
                  <label key={mod.key} className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">{mod.label}</p>
                      <p className="mt-0.5 truncate text-[11px] text-gray-400">{mod.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(mod.key)}
                      aria-pressed={access[mod.key]}
                      aria-label={`Toggle ${mod.label}`}
                      className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${access[mod.key] ? 'bg-red-600' : 'bg-gray-200'}`}
                    >
                      <span className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${access[mod.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </label>
                ))}
              </div>
            </>
          )}

          {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
          {saved && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Permissions updated successfully.</div>}
        </div>

        {staff.user_id && !isAdmin && !loading && (
          <div className="sticky bottom-0 flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-7">
            <button onClick={onClose} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold">Close</button>
            <button onClick={save} disabled={saving} className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save changes'}</button>
          </div>
        )}
      </div>
    </div>
  );
}

