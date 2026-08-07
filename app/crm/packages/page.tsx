'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSidebar } from '../sidebar-context';
import { getPackages, createPackage, updatePackage, deletePackage } from '../lib/supabase-crm';
import type { VendorPackage } from '../lib/types';

export default function PackagesPage() {
  const { open } = useSidebar();
  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VendorPackage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({ name: '', description: '', price: '', features: '' });
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', features: '' });

  useEffect(() => {
    getPackages()
      .then(p => setPackages(p))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const priceNum = form.price ? parseFloat(form.price) : null;
      const pkg = await createPackage({
        name: form.name.trim(),
        description: form.description.trim(),
        price: priceNum,
        features: form.features.trim()
      });
      setPackages(p => [...p, pkg].sort((a, b) => a.name.localeCompare(b.name)));
      setForm({ name: '', description: '', price: '', features: '' });
      setShowAdd(false);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editForm.name.trim()) return;
    setSaving(true);
    try {
      const priceNum = editForm.price ? parseFloat(editForm.price) : null;
      const updated = await updatePackage(id, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        price: priceNum,
        features: editForm.features.trim()
      });
      setPackages(p => p.map(x => x.id === id ? updated : x));
      setEditId(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePackage(deleteTarget.id);
      setPackages(p => p.filter(x => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <CrmHeader
        title="Packages"
        subtitle={`${packages.length} packages configured`}
        onMenuClick={open}
        actions={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Add Package</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {showAdd && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Add New Package</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Package name *"
                    className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/30 w-full"
                  />
                  <input
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    type="number"
                    placeholder="Price (₹)"
                    className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/30 w-full"
                  />
                </div>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description"
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:ring-2"
                />
                <textarea
                  value={form.features}
                  onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                  placeholder="Features (comma separated)"
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:ring-2"
                />
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={saving || !form.name.trim()} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 flex items-center gap-2">
                    {saving && <Loader2 size={14} className="animate-spin" />} Save
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-40"><Loader2 size={24} className="animate-spin text-red-500" /></div>
            ) : packages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Package size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No packages configured</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {packages.map(pkg => (
                  <div key={pkg.id} className="flex items-start gap-3 px-5 py-3.5 group hover:bg-gray-50/60 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Package size={15} className="text-red-600" />
                    </div>
                    {editId === pkg.id ? (
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg" />
                          <input value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} type="number" className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg" />
                        </div>
                        <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg resize-none" rows={2} />
                        <textarea value={editForm.features} onChange={e => setEditForm(f => ({ ...f, features: e.target.value }))} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg resize-none" rows={2} />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditId(null)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg">Cancel</button>
                          <button onClick={() => handleEdit(pkg.id)} disabled={saving} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg flex items-center gap-1">
                            {saving && <Loader2 size={12} className="animate-spin" />} Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-900">{pkg.name}</p>
                            {pkg.price !== null && <p className="text-sm font-bold text-red-600">₹{pkg.price.toLocaleString()}</p>}
                          </div>
                          {pkg.description && <p className="text-xs text-gray-500 mt-0.5">{pkg.description}</p>}
                          {pkg.features && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {pkg.features.split(',').map((f, i) => (
                                <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                  {f.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditId(pkg.id); setEditForm({ name: pkg.name, description: pkg.description ?? '', price: pkg.price?.toString() ?? '', features: pkg.features ?? '' }); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteTarget(pkg)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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
        title="Delete Package"
        message={`Delete "${deleteTarget?.name}"? Vendors linked to this package will lose their reference.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
