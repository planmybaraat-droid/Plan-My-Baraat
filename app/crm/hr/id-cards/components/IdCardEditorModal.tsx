'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Check, Download, Loader2, RefreshCw, Search, ShieldAlert, X } from 'lucide-react';
import type { IdCardRecord, IdCardSettings, StaffRecord } from '../../../lib/types';
import {
  getIdCardSettings, getOrCreateDraft, getStaff, regenerateCard, updateIdCardPhoto, updateStaffPhotoToo, uploadIdCardPhoto,
} from '../id-card-data';
import { finalizeGeneratedCard } from '../id-card-data';
import { buildSingleCardPdf } from '../id-card-pdf-export';
import IdCardDocument from './IdCardDocument';

interface IdCardEditorModalProps {
  employeeId: string | null; // null = "Create ID Card" flow, pick an employee first
  onClose: () => void;
  onSaved: () => void;
}

export default function IdCardEditorModal({ employeeId, onClose, onSaved }: IdCardEditorModalProps) {
  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(!employeeId);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(employeeId || '');

  const [card, setCard] = useState<IdCardRecord | null>(null);
  const [settings, setSettings] = useState<IdCardSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoOverride, setPhotoOverride] = useState<string | null>(null);
  const [alsoUpdateProfile, setAlsoUpdateProfile] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (employeeId) return;
    getStaff().then(list => { setStaffList(list); setLoadingStaff(false); });
  }, [employeeId]);

  const selectedStaff = staffList.find(s => s.id === selectedId) || null;

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    setError('');
    (async () => {
      const staff = selectedStaff || (await getStaff()).find(s => s.id === selectedId) || null;
      if (!staff) { setError('That employee could not be loaded.'); setLoading(false); return; }
      if (!selectedStaff) setStaffList(current => (current.some(s => s.id === staff.id) ? current : [...current, staff]));
      const [draft, loadedSettings] = await Promise.all([getOrCreateDraft(staff), getIdCardSettings()]);
      setCard({ ...draft, employee: staff });
      setSettings(loadedSettings);
      setPhotoOverride(draft.front_snapshot?.photo_url || staff.photo_url || null);
      setLoading(false);
    })();
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredStaff = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return staffList;
    return staffList.filter(s => s.full_name.toLowerCase().includes(q) || s.employee_code.toLowerCase().includes(q) || s.department.toLowerCase().includes(q));
  }, [staffList, search]);

  const staff = card?.employee || selectedStaff;

  const validation = useMemo(() => {
    if (!staff) return 'Select an employee first.';
    if (!staff.full_name.trim()) return 'This employee has no name on file.';
    if (!staff.employee_code.trim()) return 'This employee has no employee code on file.';
    return '';
  }, [staff]);

  const handlePhotoChange = async (file: File) => {
    if (!staff) return;
    setPhotoBusy(true);
    setError('');
    try {
      const url = await uploadIdCardPhoto(staff.id, file);
      if (card) {
        const updatedCard = await updateIdCardPhoto(card.id, staff, url);
        setCard(updatedCard);
      }
      setPhotoOverride(url);
      if (alsoUpdateProfile) await updateStaffPhotoToo(staff.id, url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Photo upload failed.');
    } finally {
      setPhotoBusy(false);
    }
  };

  const regenerate = async () => {
    if (!staff) return;
    setLoading(true);
    try {
      const fresh = await regenerateCard(staff);
      setCard({ ...fresh, employee: staff });
    } finally {
      setLoading(false);
    }
  };

  const generate = async () => {
    if (!staff || !card || !settings) return;
    if (validation) { setError(validation); return; }
    if (!documentRef.current) { setError('The card preview is not ready yet.'); return; }
    setGenerating(true);
    setError('');
    try {
      const pdf = await buildSingleCardPdf({ root: documentRef.current, settings, cardNumber: card.card_number });
      const blob = pdf.output('blob');
      const actorName = staff.full_name; // best-effort label; real actor id comes from auth.uid() server-side
      const updated = await finalizeGeneratedCard(card, staff, blob, settings, actorName, photoOverride);
      setCard({ ...updated, employee: staff });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-red-600">ID Card</p>
            <h2 className="text-xl font-black text-gray-950">{staff ? staff.full_name : 'Select employee'}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-900"><X size={18} /></button>
        </div>

        <div className="p-5 sm:p-7">
          {!selectedId ? (
            <div>
              <div className="relative mb-4">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search staff by name, employee ID or department…"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm font-semibold text-gray-700 outline-none focus:border-red-400"
                  autoFocus
                />
              </div>
              {loadingStaff ? (
                <div className="flex h-40 items-center justify-center"><Loader2 size={24} className="animate-spin text-red-600" /></div>
              ) : (
                <div className="max-h-96 space-y-1.5 overflow-y-auto">
                  {filteredStaff.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-3.5 py-2.5 text-left hover:border-red-200 hover:bg-red-50/40"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-xs font-black text-gray-400">
                        {s.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.photo_url} alt={s.full_name} className="h-full w-full object-cover" />
                        ) : s.full_name.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-gray-900">{s.full_name}</span>
                        <span className="block truncate text-xs text-gray-400">{s.employee_code} &middot; {s.department} &middot; {s.job_title || s.designation}</span>
                      </span>
                    </button>
                  ))}
                  {filteredStaff.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No staff match your search.</p>}
                </div>
              )}
            </div>
          ) : loading || !card || !settings || !staff ? (
            <div className="flex h-64 items-center justify-center"><Loader2 size={26} className="animate-spin text-red-600" /></div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loaded from Staff module — read only</p>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div><span className="text-gray-400">Employee ID</span><p className="font-bold text-gray-900">{staff.employee_code}</p></div>
                    <div><span className="text-gray-400">Department</span><p className="font-bold text-gray-900">{staff.department}</p></div>
                    <div><span className="text-gray-400">Designation</span><p className="font-bold text-gray-900">{staff.job_title || staff.designation}</p></div>
                    <div><span className="text-gray-400">Joining date</span><p className="font-bold text-gray-900">{staff.joining_date}</p></div>
                    <div><span className="text-gray-400">Mobile</span><p className="font-bold text-gray-900">{staff.mobile}</p></div>
                    <div><span className="text-gray-400">Email</span><p className="font-bold text-gray-900">{staff.email}</p></div>
                    <div><span className="text-gray-400">Blood group</span><p className="font-bold text-gray-900">{staff.blood_group || '—'}</p></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Photo</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      {photoOverride ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoOverride} alt={staff.full_name} className="h-full w-full object-cover" />
                      ) : <Camera size={18} className="text-gray-300" />}
                    </span>
                    <div className="flex-1">
                      <button onClick={() => photoInputRef.current?.click()} disabled={photoBusy} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:border-gray-300 disabled:opacity-50">
                        {photoBusy ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />} {photoOverride ? 'Replace photo' : 'Upload photo'}
                      </button>
                      <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={e => { const file = e.target.files?.[0]; if (file) handlePhotoChange(file); }} />
                      <label className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-gray-500">
                        <input type="checkbox" checked={alsoUpdateProfile} onChange={e => setAlsoUpdateProfile(e.target.checked)} className="h-3 w-3 accent-red-600" />
                        Also update this person&apos;s staff profile photo
                      </label>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                    <ShieldAlert size={15} className="mt-0.5 shrink-0" /> {error}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={regenerate} disabled={loading || generating} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 hover:border-gray-300 disabled:opacity-50">
                    <RefreshCw size={14} /> New version
                  </button>
                  <button onClick={generate} disabled={generating || !!validation} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">
                    {generating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} {generating ? 'Saving…' : 'Save ID card'}
                  </button>
                  {card.status !== 'Draft' && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700"><Check size={13} /> v{card.version} generated</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live preview — front &amp; back, actual size</p>
                <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <IdCardDocument ref={documentRef} card={card} staff={staff} settings={settings} photoUrl={photoOverride} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
