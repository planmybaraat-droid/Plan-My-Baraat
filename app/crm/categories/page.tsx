'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Check, Tag } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSidebar } from '../sidebar-context';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../lib/supabase-crm';
import type { Category } from '../lib/types';

export default function CategoriesPage() {
  const { open } = useSidebar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  useEffect(() => {
    getCategories()
      .then(c => setCategories(c))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const cat = await createCategory(form.name.trim(), form.description.trim());
      setCategories(c => [...c, cat].sort((a, b) => a.name.localeCompare(b.name)));
      setForm({ name: '', description: '' });
      setShowAdd(false);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editForm.name.trim()) return;
    setSaving(true);
    try {
      const updated = await updateCategory(id, editForm.name.trim(), editForm.description.trim());
      setCategories(c => c.map(x => x.id === id ? updated : x));
      setEditId(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      setCategories(c => c.filter(x => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <CrmHeader
        title="Categories"
        subtitle={`${categories.length} categories configured`}
        onMenuClick={open}
        actions={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Add Category</span>
          </button>
        }
      />

      <div className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {showAdd && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Add New Category</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Category name *"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
                />
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400"
                />
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving || !form.name.trim()} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-40"><Loader2 size={24} className="animate-spin text-red-500" /></div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Tag size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No categories configured</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-start gap-3 px-5 py-3.5 group hover:bg-gray-50/60 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Tag size={15} className="text-red-600" />
                    </div>
                    {editId === cat.id ? (
                      <div className="flex-1 space-y-2">
                        <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none" />
                        <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg resize-none" rows={2} />
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditId(null)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg">Cancel</button>
                          <button onClick={() => handleEdit(cat.id)} disabled={saving} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg flex items-center gap-1">
                            {saving && <Loader2 size={12} className="animate-spin" />} Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                          {cat.description && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{cat.description}</p>}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditId(cat.id); setEditForm({ name: cat.name, description: cat.description ?? '' }); }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteTarget(cat)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? Vendors linked to this category will lose their reference.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
