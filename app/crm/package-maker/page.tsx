'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Loader2, Calculator, Pencil, X, Layers, TrendingUp, Printer } from 'lucide-react';
import CrmHeader from '../components/CrmHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { useSidebar } from '../sidebar-context';
import { getCategories, getPackages, createPackage, updatePackage, deletePackage } from '../lib/supabase-crm';
import type { Category, VendorPackage, PackageItem } from '../lib/types';

const emptyBuilder = {
  name: '',
  description: '',
  type: 'customer' as 'vendor' | 'customer',
};

export default function PackageMakerPage() {
  const { open } = useSidebar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [builder, setBuilder] = useState(emptyBuilder);
  const [items, setItems] = useState<PackageItem[]>([]);
  const [pickCategoryId, setPickCategoryId] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<VendorPackage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [printTarget, setPrintTarget] = useState<VendorPackage | null>(null);

  useEffect(() => {
    Promise.all([getCategories(), getPackages()])
      .then(([c, p]) => {
        setCategories(c);
        setPackages(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const availableCategories = useMemo(
    () => categories.filter(c => !items.some(i => i.category_id === c.id)),
    [categories, items]
  );

  const itemsSellingSum = useMemo(() => items.reduce((sum, i) => sum + (i.selling_price || 0), 0), [items]);

  const totals = useMemo(() => {
    const vendorCost = items.reduce((sum, i) => sum + (i.vendor_cost || 0), 0);
    const sellingPrice = manualPrice === '' ? 0 : parseFloat(manualPrice) || 0;
    const profit = sellingPrice - vendorCost;
    const marginPct = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
    return { vendorCost, sellingPrice, profit, marginPct };
  }, [items, manualPrice]);

  const resetBuilder = () => {
    setEditingId(null);
    setBuilder(emptyBuilder);
    setItems([]);
    setPickCategoryId('');
    setManualPrice('');
  };

  const handleAddCategory = () => {
    const cat = categories.find(c => c.id === pickCategoryId);
    if (!cat) return;
    setItems(list => [...list, { category_id: cat.id, category_name: cat.name, label: cat.name, vendor_cost: 0, selling_price: 0 }]);
    setPickCategoryId('');
  };

  const updateItem = (categoryId: string, field: 'vendor_cost' | 'selling_price', value: string) => {
    const num = value === '' ? 0 : parseFloat(value);
    setItems(list => list.map(i => (i.category_id === categoryId ? { ...i, [field]: isNaN(num) ? 0 : num } : i)));
  };

  const updateItemLabel = (categoryId: string, value: string) => {
    setItems(list => list.map(i => (i.category_id === categoryId ? { ...i, label: value } : i)));
  };

  const removeItem = (categoryId: string) => {
    setItems(list => list.filter(i => i.category_id !== categoryId));
  };

  const startEdit = (pkg: VendorPackage) => {
    setEditingId(pkg.id);
    setBuilder({ name: pkg.name, description: pkg.description ?? '', type: pkg.type ?? 'customer' });
    setItems(pkg.items ?? []);
    setManualPrice(pkg.price != null ? String(pkg.price) : '');
    setPickCategoryId('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!builder.name.trim() || items.length === 0 || manualPrice === '') return;
    setSaving(true);
    try {
      const payload = {
        name: builder.name.trim(),
        description: builder.description.trim(),
        type: builder.type,
        price: totals.sellingPrice,
        vendor_cost: totals.vendorCost,
        features: items.map(i => i.label || i.category_name).join(', '),
        items,
      };
      if (editingId) {
        const updated = await updatePackage(editingId, payload);
        setPackages(p => p.map(x => (x.id === editingId ? updated : x)));
      } else {
        const created = await createPackage(payload);
        setPackages(p => [created, ...p]);
      }
      resetBuilder();
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
      if (editingId === deleteTarget.id) resetBuilder();
    } finally {
      setDeleting(false);
    }
  };

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  useEffect(() => {
    if (!printTarget) return;
    const timer = setTimeout(() => window.print(), 50);
    const handleAfterPrint = () => setPrintTarget(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [printTarget]);

  return (
    <>
      <CrmHeader
        title="Package Maker"
        subtitle="Combine categories into priced packages"
        onMenuClick={open}
      />

      <div className="p-4 sm:p-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-5">
          {/* Builder */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Layers size={16} className="text-red-600" />
                  {editingId ? 'Edit Package' : 'New Package'}
                </h3>
                {editingId && (
                  <button onClick={resetBuilder} className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1">
                    <X size={13} /> Cancel edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={builder.name}
                  onChange={e => setBuilder(b => ({ ...b, name: e.target.value }))}
                  placeholder="Package name *"
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 w-full"
                />
                <select
                  value={builder.type}
                  onChange={e => setBuilder(b => ({ ...b, type: e.target.value as 'vendor' | 'customer' }))}
                  className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 w-full"
                >
                  <option value="customer">Customer Package</option>
                  <option value="vendor">Vendor Package</option>
                </select>
              </div>
              <textarea
                value={builder.description}
                onChange={e => setBuilder(b => ({ ...b, description: e.target.value }))}
                placeholder="Description (optional)"
                rows={2}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500/30"
              />

              {/* Add category row */}
              <div className="flex gap-2">
                <select
                  value={pickCategoryId}
                  onChange={e => setPickCategoryId(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30"
                >
                  <option value="">Select a category to add…</option>
                  {availableCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddCategory}
                  disabled={!pickCategoryId}
                  className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Plus size={15} /> Add
                </button>
              </div>

              {/* Items */}
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-lg">
                  <p className="text-xs">No categories added yet. Pick one above to start building the package.</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                    <div className="col-span-5">Category (editable text)</div>
                    <div className="col-span-3">Vendor Cost</div>
                    <div className="col-span-3">Selling Price</div>
                    <div className="col-span-1"></div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {items.map(item => (
                      <div key={item.category_id} className="grid grid-cols-12 gap-2 items-center px-3 py-2">
                        <div className="col-span-5">
                          <input
                            value={item.label ?? item.category_name}
                            onChange={e => updateItemLabel(item.category_id, e.target.value)}
                            title={`Category: ${item.category_name}`}
                            className="w-full px-2 py-1.5 text-sm font-medium text-gray-800 border border-transparent hover:border-gray-200 focus:border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 -mx-2"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={item.vendor_cost || ''}
                            onChange={e => updateItem(item.category_id, 'vendor_cost', e.target.value)}
                            placeholder="0"
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30"
                          />
                        </div>
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={item.selling_price || ''}
                            onChange={e => updateItem(item.category_id, 'selling_price', e.target.value)}
                            placeholder="0"
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button onClick={() => removeItem(item.category_id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Package Selling Price (₹) — set manually
                  </label>
                  <input
                    type="number"
                    value={manualPrice}
                    onChange={e => setManualPrice(e.target.value)}
                    placeholder="Enter final package price"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving || !builder.name.trim() || items.length === 0 || manualPrice === ''}
                  className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-40 flex items-center gap-2"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editingId ? 'Update Package' : 'Save Package'}
                </button>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-4">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Calculator size={16} className="text-red-600" /> Price Calculator
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Categories added</span>
                  <span className="font-semibold text-gray-900">{items.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total vendor cost</span>
                  <span className="font-semibold text-gray-900">{fmt(totals.vendorCost)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Items selling price (sum, for reference)</span>
                  <span className="font-semibold text-gray-400">{fmt(itemsSellingSum)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Package selling price (manual)</span>
                  <span className="font-semibold text-gray-900">{fmt(totals.sellingPrice)}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><TrendingUp size={13} /> Profit</span>
                  <span className={`font-bold ${totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(totals.profit)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Margin</span>
                  <span className={`font-bold ${totals.marginPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>{totals.marginPct.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing packages */}
        <div className="max-w-5xl mx-auto mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{`Saved Packages (${packages.length})`}</h3>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-32"><Loader2 size={22} className="animate-spin text-red-500" /></div>
            ) : packages.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Layers size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No packages created yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {packages.map(pkg => (
                  <div key={pkg.id} className="flex items-start gap-3 px-5 py-3.5 group hover:bg-gray-50/60 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Layers size={15} className="text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {pkg.name}
                          {pkg.type && (
                            <span className="ml-2 text-[10px] font-medium uppercase tracking-wide text-gray-400 align-middle">{pkg.type}</span>
                          )}
                        </p>
                        {pkg.price !== null && <p className="text-sm font-bold text-red-600">{fmt(pkg.price ?? 0)}</p>}
                      </div>
                      {pkg.description && <p className="text-xs text-gray-500 mt-0.5">{pkg.description}</p>}
                      {pkg.items && pkg.items.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pkg.items.map(i => (
                            <span key={i.category_id} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {i.label || i.category_name}: {fmt(i.selling_price)}
                            </span>
                          ))}
                        </div>
                      )}
                      {pkg.vendor_cost != null && pkg.price != null && (
                        <p className="text-[10px] text-gray-400 mt-1.5">
                          Vendor cost {fmt(pkg.vendor_cost)} · Profit {fmt(pkg.price - pkg.vendor_cost)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setPrintTarget(pkg)} title="Print (A4)" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Printer size={14} />
                      </button>
                      <button onClick={() => startEdit(pkg)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(pkg)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
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

      {printTarget && (
        <div id="package-print-area" className="p-0 font-serif text-[#1c1917]">
          <div className="flex items-center justify-between border-b-[3px] border-[#7C1C2B] pb-4 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="PlanMyBaraat" className="h-10 w-auto object-contain" />
            <div className="text-right text-[11px] text-stone-500">
              Quote generated {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#7C1C2B] mb-1">{printTarget.name}</h1>
          {printTarget.type && (
            <div className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold mb-3">{printTarget.type} package</div>
          )}
          {printTarget.description && (
            <p className="text-[13px] text-stone-700 leading-relaxed mb-5">{printTarget.description}</p>
          )}

          <table className="w-full border-collapse mb-5">
            <thead>
              <tr>
                <th className="text-left text-[10px] uppercase tracking-wide text-stone-500 border-b-2 border-stone-200 pb-2">Included</th>
                <th className="text-right text-[10px] uppercase tracking-wide text-stone-500 border-b-2 border-stone-200 pb-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {(printTarget.items || []).map(i => (
                <tr key={i.category_id}>
                  <td className="py-2.5 border-b border-stone-100 text-sm">{i.label || i.category_name}</td>
                  <td className="py-2.5 border-b border-stone-100 text-sm text-right">{fmt(i.selling_price)}</td>
                </tr>
              ))}
              <tr>
                <td className="pt-4 text-lg font-bold text-[#7C1C2B] border-t-2 border-[#7C1C2B]">Total Package Price</td>
                <td className="pt-4 text-lg font-bold text-[#7C1C2B] border-t-2 border-[#7C1C2B] text-right">{fmt(printTarget.price ?? 0)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-10 text-center text-[10px] uppercase tracking-widest text-stone-400">
            PlanMyBaraat &middot; Premium Procession Network
          </div>
        </div>
      )}
    </>
  );
}
