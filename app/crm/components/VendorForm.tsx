'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { VendorFormData, City, Category, VendorPackage, CrmStatus } from '../lib/types';

const STATUSES: CrmStatus[] = ['New', 'Contacted', 'Interested', 'Converted', 'Lost'];

interface VendorFormProps {
  initialData?: Partial<VendorFormData>;
  cities: City[];
  categories: Category[];
  packages: VendorPackage[];
  onSubmit: (data: VendorFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const EMPTY: VendorFormData = {
  company_name: '',
  contact_person: '',
  mobile: '',
  email: '',
  city_id: '',
  category_id: '',
  package_id: '',
  status: 'New',
  remarks: '',
};

export default function VendorForm({
  initialData,
  cities,
  categories,
  packages,
  onSubmit,
  onCancel,
  submitLabel = 'Save Vendor',
}: VendorFormProps) {
  const [form, setForm] = useState<VendorFormData>({ ...EMPTY, ...initialData });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof VendorFormData, string>>>({});

  const set = (key: keyof VendorFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.company_name.trim()) errs.company_name = 'Company name is required';
    if (!form.contact_person.trim()) errs.contact_person = 'Contact person is required';
    if (!form.mobile.trim()) errs.mobile = 'Mobile number is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setLoading(true);
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (key: keyof VendorFormData) =>
    `w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-white
    ${errors[key] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`;

  const labelClass = 'block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2 pb-1 border-b border-gray-100 uppercase tracking-wider">Basic Info</h3>
        <div className="space-y-2.5">
          <div>
            <label className={labelClass}>Company Name *</label>
            <input value={form.company_name} onChange={set('company_name')} type="text" placeholder="Company name" className={inputClass('company_name')} />
            {errors.company_name && <p className="text-[10px] text-red-500 mt-0.5">{errors.company_name}</p>}
          </div>
          <div>
            <label className={labelClass}>Contact Person *</label>
            <input value={form.contact_person} onChange={set('contact_person')} type="text" placeholder="Contact person" className={inputClass('contact_person')} />
            {errors.contact_person && <p className="text-[10px] text-red-500 mt-0.5">{errors.contact_person}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Mobile Number *</label>
              <input value={form.mobile} onChange={set('mobile')} type="tel" placeholder="Mobile" className={inputClass('mobile')} />
              {errors.mobile && <p className="text-[10px] text-red-500 mt-0.5">{errors.mobile}</p>}
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input value={form.email} onChange={set('email')} type="email" placeholder="Email" className={inputClass('email')} />
              {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2 pb-1 border-b border-gray-100 uppercase tracking-wider">Classification</h3>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={labelClass}>City</label>
            <select value={form.city_id} onChange={set('city_id')} className={inputClass('city_id')}>
              <option value="">City</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select value={form.category_id} onChange={set('category_id')} className={inputClass('category_id')}>
              <option value="">Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Package</label>
            <select value={form.package_id} onChange={set('package_id')} className={inputClass('package_id')}>
              <option value="">Package</option>
              {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2 pb-1 border-b border-gray-100 uppercase tracking-wider">Lead Status</h3>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setForm(f => ({ ...f, status: s }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                ${form.status === s
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 bg-white'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Remarks / Initial Notes</label>
        <textarea
          value={form.remarks}
          onChange={set('remarks')}
          rows={2}
          placeholder="Remarks..."
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-white"
        />
      </div>

      <div className="flex gap-2 pt-2 pb-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 flex items-center justify-center gap-1"
        >
          {loading && <Loader2 size={13} className="animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
