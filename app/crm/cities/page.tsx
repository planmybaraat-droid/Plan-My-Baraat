'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check, MapPin } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSidebar } from '../sidebar-context';
import { getCities, createCity, updateCity, deleteCity } from '../lib/supabase-crm';
import type { City } from '../lib/types';

export default function CitiesPage() {
  const { open } = useSidebar();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<City | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', state: '' });
  const [editForm, setEditForm] = useState({ name: '', state: '' });

  useEffect(() => {
    getCities()
      .then(c => setCities(c))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const city = await createCity(form.name.trim(), form.state.trim());
      setCities(c => [...c, city].sort((a, b) => a.name.localeCompare(b.name)));
      setForm({ name: '', state: '' });
      setShowAdd(false);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editForm.name.trim()) return;
    setSaving(true);
    try {
      const updated = await updateCity(id, editForm.name.trim(), editForm.state.trim());
      setCities(c => c.map(x => x.id === id ? updated : x));
      setEditId(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCity(deleteTarget.id);
      setCities(c => c.filter(x => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <CrmHeader
        title="Cities"
        subtitle={`${cities.length} cities configured`}
        onMenuClick={open}
        actions={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Add City</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Add form */}
          {showAdd && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Add New City</h3>
              <form onSubmit={handleAdd} className="flex gap-3 flex-wrap">
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="City name *"
                  className="flex-1 min-w-[140px] px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
                />
                <input
                  value={form.state}
                  onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                  placeholder="State (optional)"
                  className="flex-1 min-w-[140px] px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={saving || !form.name.trim()} className="px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
                  </button>
                  <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Cities list */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-40"><Loader2 size={24} className="animate-spin text-red-500" /></div>
            ) : cities.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MapPin size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No cities added yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {cities.map(city => (
                  <div key={city.id} className="flex items-center gap-3 px-5 py-3.5 group hover:bg-gray-50/60 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={15} className="text-red-600" />
                    </div>
                    {editId === city.id ? (
                      <div className="flex gap-2 flex-1 flex-wrap">
                        <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          className="flex-1 min-w-[120px] px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30" />
                        <input value={editForm.state} onChange={e => setEditForm(f => ({ ...f, state: e.target.value }))}
                          placeholder="State"
                          className="flex-1 min-w-[120px] px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30" />
                        <button onClick={() => handleEdit(city.id)} disabled={saving} className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        </button>
                        <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{city.name}</p>
                          {city.state && <p className="text-xs text-gray-400">{city.state}</p>}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditId(city.id); setEditForm({ name: city.name, state: city.state ?? '' }); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteTarget(city)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete City"
        message={`Delete "${deleteTarget?.name}"? Vendors and leads linked to this city will lose their city reference.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
