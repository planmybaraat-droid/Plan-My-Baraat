'use client';

import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import type { IdCardSettings } from '../../../lib/types';
import { getIdCardSettings, updateIdCardSettings } from '../id-card-data';

interface IdCardSettingsModalProps {
  onClose: () => void;
}

function NumberField({ label, value, onChange, step = 0.1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="agreement-field">
      <span>{label}</span>
      <input type="number" step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    </label>
  );
}

export default function IdCardSettingsModal({ onClose }: IdCardSettingsModalProps) {
  const [settings, setSettings] = useState<IdCardSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { getIdCardSettings().then(setSettings); }, []);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateIdCardSettings(settings);
      setSettings(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-gray-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-red-600">Admin only</p>
            <h2 className="text-xl font-black text-gray-950">Print settings</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-900"><X size={18} /></button>
        </div>

        {!settings ? (
          <div className="flex h-56 items-center justify-center"><Loader2 size={24} className="animate-spin text-red-600" /></div>
        ) : (
          <div className="space-y-5 p-5 sm:p-7">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Card size (mm)</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <NumberField label="Width" value={settings.card_width_mm} onChange={v => setSettings({ ...settings, card_width_mm: v })} />
                <NumberField label="Height" value={settings.card_height_mm} onChange={v => setSettings({ ...settings, card_height_mm: v })} />
                <NumberField label="Bleed" value={settings.bleed_mm} onChange={v => setSettings({ ...settings, bleed_mm: v })} />
                <NumberField label="Safe margin" value={settings.safe_margin_mm} onChange={v => setSettings({ ...settings, safe_margin_mm: v })} />
              </div>
              <p className="mt-2 text-[11px] text-gray-400">Default is CR80 in portrait (53.98 × 85.60 mm) — the standard access-card size, worn vertically. Change only if your printer needs a different spec.</p>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Print sheet (mm)</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <NumberField label="Sheet width" value={settings.sheet_width_mm} onChange={v => setSettings({ ...settings, sheet_width_mm: v })} />
                <NumberField label="Sheet height" value={settings.sheet_height_mm} onChange={v => setSettings({ ...settings, sheet_height_mm: v })} />
                <NumberField label="Sheet margin" value={settings.sheet_margin_mm} onChange={v => setSettings({ ...settings, sheet_margin_mm: v })} />
                <div />
                <NumberField label="Horizontal gap" value={settings.horizontal_gap_mm} onChange={v => setSettings({ ...settings, horizontal_gap_mm: v })} />
                <NumberField label="Vertical gap" value={settings.vertical_gap_mm} onChange={v => setSettings({ ...settings, vertical_gap_mm: v })} />
              </div>
              <p className="mt-2 text-[11px] text-gray-400">Default is A4 (210 × 297 mm) — used for the &ldquo;Print sheet&rdquo; bulk mode; cards-per-row/column are calculated automatically from these values.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="agreement-field">
                <span>Duplex flip</span>
                <select value={settings.duplex_mode} onChange={e => setSettings({ ...settings, duplex_mode: e.target.value as IdCardSettings['duplex_mode'] })}>
                  <option value="long_edge">Flip on long edge</option>
                  <option value="short_edge">Flip on short edge</option>
                </select>
              </label>
              <NumberField label="Card validity (years)" value={settings.validity_years} onChange={v => setSettings({ ...settings, validity_years: v })} step={0.5} />
            </div>

            {error && <p className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</p>}
          </div>
        )}

        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-7">
          <button onClick={onClose} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold">Cancel</button>
          <button onClick={save} disabled={saving || !settings} className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save settings'}</button>
        </div>
      </div>
    </div>
  );
}
