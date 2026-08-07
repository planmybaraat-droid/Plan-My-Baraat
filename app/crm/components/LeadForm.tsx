'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { LeadFormData, City, CrmStatus } from '../lib/types';

const STATUSES: CrmStatus[] = ['New', 'Contacted', 'Interested', 'Converted', 'Lost'];

interface LeadFormProps {
  initialData?: Partial<LeadFormData>;
  cities: City[];
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const EMPTY: LeadFormData = {
  customer_name: '',
  mobile: '',
  email: '',
  city_id: '',
  requirement: '',
  event_date: '',
  package_discussed: '',
  status: 'New',
  remarks: '',
};

export default function LeadForm({
  initialData,
  cities,
  onSubmit,
  onCancel,
  submitLabel = 'Save Lead',
}: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>({ ...EMPTY, ...initialData });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  const set = (key: keyof LeadFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.customer_name.trim()) errs.customer_name = 'Customer name is required';
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

  const inputClass = (key: keyof LeadFormData) =>
    `w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 bg-white
    ${errors[key] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`;

  const labelClass = 'block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2 pb-1 border-b border-gray-100 uppercase tracking-wider">Customer Info</h3>
        <div className="space-y-2.5">
          <div>
            <label className={labelClass}>Customer Name *</label>
            <input value={form.customer_name} onChange={set('customer_name')} type="text" placeholder="Customer name" className={inputClass('customer_name')} />
            {errors.customer_name && <p className="text-[10px] text-red-500 mt-0.5">{errors.customer_name}</p>}
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
          <div>
            <label className={labelClass}>City</label>
            <select value={form.city_id} onChange={set('city_id')} className={inputClass('city_id')}>
              <option value="">Select City</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2 pb-1 border-b border-gray-100 uppercase tracking-wider">Event Details</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Event Date</label>
            <input value={form.event_date} onChange={set('event_date')} type="date" className={inputClass('event_date')} />
          </div>
          <div>
            <label className={labelClass}>Package Discussed</label>
            <input value={form.package_discussed} onChange={set('package_discussed')} type="text" placeholder="Package/Budget" className={inputClass('package_discussed')} />
          </div>
        </div>
        <div className="mt-2.5">
          <label className={labelClass}>Requirements</label>
          <textarea
            value={form.requirement}
            onChange={set('requirement')}
            rows={2}
            placeholder="Describe wedding/event requirements..."
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500/30 bg-white"
          />
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
