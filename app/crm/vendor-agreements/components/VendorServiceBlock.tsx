'use client';

import { ChevronDown, GripVertical, Trash2 } from 'lucide-react';
import type { VendorAgreementService } from '../../lib/types';
import { VENDOR_SERVICE_OPTIONS } from '../vendor-agreement-config';

interface VendorServiceBlockProps {
  service: VendorAgreementService;
  onChange: (service: VendorAgreementService) => void;
  onRemove?: () => void;
}

export default function VendorServiceBlock({ service, onChange, onRemove }: VendorServiceBlockProps) {
  const options = VENDOR_SERVICE_OPTIONS[service.name] ?? [];
  const set = <K extends keyof VendorAgreementService>(key: K, value: VendorAgreementService[K]) =>
    onChange({ ...service, [key]: value });
  const setNumber = (key: keyof VendorAgreementService, value: string) => set(key, Math.max(0, Number(value) || 0) as never);

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all ${service.enabled ? 'border-red-200 bg-white shadow-sm' : 'border-gray-200 bg-gray-50/70'}`}>
      <div className="flex min-h-16 items-center gap-3 px-4 py-3 sm:px-5">
        <GripVertical size={16} className="hidden text-gray-300 sm:block" />
        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" checked={service.enabled} onChange={event => set('enabled', event.target.checked)} className="peer sr-only" />
          <span className="h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-red-600 peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-red-100" />
        </label>
        <div className="min-w-0 flex-1">
          {service.is_custom ? (
            <input value={service.name} onChange={event => set('name', event.target.value)} placeholder="Custom service name" className="w-full border-0 bg-transparent p-0 text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400" />
          ) : (
            <p className="truncate text-sm font-bold text-gray-900">{service.name}</p>
          )}
          <p className="mt-0.5 text-[11px] font-medium text-gray-400">{service.enabled ? 'Offered by this vendor' : 'Not offered'}</p>
        </div>
        {service.enabled && service.base_price > 0 && (
          <div className="hidden items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700 sm:flex">
            ₹{service.base_price.toLocaleString('en-IN')}
          </div>
        )}
        {onRemove && (
          <button type="button" onClick={onRemove} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${service.name}`}>
            <Trash2 size={15} />
          </button>
        )}
        <ChevronDown size={16} className={`text-gray-300 transition-transform ${service.enabled ? 'rotate-180' : ''}`} />
      </div>

      {service.enabled && (
        <div className="grid grid-cols-1 gap-4 border-t border-gray-100 bg-white px-4 py-5 sm:grid-cols-2 sm:px-5 lg:grid-cols-4">
          <label className="agreement-field">
            <span>Base price</span>
            <input type="number" min="0" value={service.base_price} onChange={event => setNumber('base_price', event.target.value)} />
          </label>
          <label className="agreement-field">
            <span>Extra hour charges</span>
            <input type="number" min="0" value={service.extra_hour_charge} onChange={event => setNumber('extra_hour_charge', event.target.value)} />
          </label>
          <label className="agreement-field">
            <span>Travel charges</span>
            <input type="number" min="0" value={service.travel_charge} onChange={event => setNumber('travel_charge', event.target.value)} />
          </label>
          <label className="agreement-field">
            <span>Capacity</span>
            <input value={service.capacity} onChange={event => set('capacity', event.target.value)} placeholder="e.g. up to 300 guests" />
          </label>
          <label className="agreement-field">
            <span>Tax %</span>
            <input type="number" min="0" max="100" value={service.tax_percent} onChange={event => setNumber('tax_percent', event.target.value)} />
          </label>
          <label className="agreement-field">
            <span>Advance required</span>
            <input type="number" min="0" value={service.advance_required} onChange={event => setNumber('advance_required', event.target.value)} />
          </label>
          <label className="agreement-field">
            <span>Service option</span>
            {options.length ? (
              <select value={service.option} onChange={event => set('option', event.target.value)}>
                {options.map(option => <option key={option}>{option}</option>)}
              </select>
            ) : (
              <input value={service.option} onChange={event => set('option', event.target.value)} placeholder="Variant, category or option" />
            )}
          </label>
          <label className="agreement-field">
            <span>Service area</span>
            <input value={service.service_area} onChange={event => set('service_area', event.target.value)} placeholder="Cities / radius covered" />
          </label>
        </div>
      )}
    </div>
  );
}
