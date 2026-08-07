'use client';

import { ChevronDown, GripVertical, Trash2 } from 'lucide-react';
import type { AgreementService } from '../../lib/types';
import { SERVICE_AVAILABILITY_NOTE, SERVICE_COLOR_OPTIONS, SERVICE_DECORATION_OPTIONS, SERVICE_MULTI_OPTIONS, SERVICE_OPTIONS, SERVICE_PURPOSE_OPTIONS } from '../agreement-config';

interface ServiceBlockProps {
  service: AgreementService;
  onChange: (service: AgreementService) => void;
  onRemove?: () => void;
}

export default function ServiceBlock({ service, onChange, onRemove }: ServiceBlockProps) {
  const options = SERVICE_OPTIONS[service.name] ?? [];
  const colorOptions = SERVICE_COLOR_OPTIONS[service.name] ?? [];
  const decorationOptions = SERVICE_DECORATION_OPTIONS[service.name] ?? [];
  const purposeOptions = SERVICE_PURPOSE_OPTIONS[service.name] ?? [];
  const multiOptions = SERVICE_MULTI_OPTIONS[service.name] ?? [];
  const availabilityNote = SERVICE_AVAILABILITY_NOTE[service.name];
  const toggleMultiOption = (value: string) => {
    const current = service.multi_options ?? [];
    set('multi_options', current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  };
  const set = <K extends keyof AgreementService>(key: K, value: AgreementService[K]) =>
    onChange({ ...service, [key]: value });

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all ${service.enabled ? 'border-red-200 bg-white shadow-sm' : 'border-gray-200 bg-gray-50/70'}`}>
      <div className="flex min-h-16 items-center gap-3 px-4 py-3 sm:px-5">
        <GripVertical size={16} className="hidden text-gray-300 sm:block" />
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={service.enabled}
            onChange={event => set('enabled', event.target.checked)}
            className="peer sr-only"
          />
          <span className="h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-red-600 peer-checked:after:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-red-100" />
        </label>
        <div className="min-w-0 flex-1">
          {service.is_custom ? (
            <input
              value={service.name}
              onChange={event => set('name', event.target.value)}
              placeholder="Custom service name"
              className="w-full border-0 bg-transparent p-0 text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
            />
          ) : (
            <p className="truncate text-sm font-bold text-gray-900">{service.name}</p>
          )}
          <p className="mt-0.5 text-[11px] font-medium text-gray-400">
            {service.enabled ? 'Included in client agreement' : 'Not included'}
            {availabilityNote && <span className="ml-1.5 font-semibold text-amber-600">· {availabilityNote}</span>}
          </p>
        </div>
        {service.enabled && (
          <div className="hidden items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700 sm:flex">
            Qty {service.quantity}
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
        <div className="grid grid-cols-1 gap-4 border-t border-gray-100 bg-white px-4 py-5 sm:grid-cols-2 sm:px-5 lg:grid-cols-3">
          <label className="agreement-field">
            <span>Quantity</span>
            <input type="number" min="1" max="9999" value={service.quantity} onChange={event => set('quantity', Math.max(1, Number(event.target.value) || 1))} />
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
          {colorOptions.length > 0 && (
            <label className="agreement-field">
              <span>Colour add-on</span>
              <select value={service.color} onChange={event => set('color', event.target.value)}>
                {colorOptions.map(color => <option key={color}>{color}</option>)}
              </select>
            </label>
          )}
          {decorationOptions.length > 0 && (
            <label className="agreement-field">
              <span>Decoration</span>
              <select value={service.decoration} onChange={event => set('decoration', event.target.value)}>
                {decorationOptions.map(item => <option key={item}>{item}</option>)}
              </select>
            </label>
          )}
          {purposeOptions.length > 0 && (
            <label className="agreement-field">
              <span>Used for</span>
              <select value={service.purpose} onChange={event => set('purpose', event.target.value)}>
                {purposeOptions.map(item => <option key={item}>{item}</option>)}
              </select>
            </label>
          )}
          {multiOptions.length > 0 && (
            <label className="agreement-field sm:col-span-2 lg:col-span-3">
              <span>Add-ons (select any)</span>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {multiOptions.map(item => (
                  <label key={item} className="agreement-checkbox-pill">
                    <input
                      type="checkbox"
                      checked={(service.multi_options ?? []).includes(item)}
                      onChange={() => toggleMultiOption(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </label>
          )}
          <label className="agreement-field">
            <span>Customization</span>
            <input value={service.customization} onChange={event => set('customization', event.target.value)} placeholder="Colours, branding, style..." />
          </label>
          <label className="agreement-field sm:col-span-2">
            <span>Visible client remark</span>
            <textarea value={service.client_remark} onChange={event => set('client_remark', event.target.value)} placeholder="This will appear in the agreement PDF." rows={2} />
          </label>
          <label className="agreement-field">
            <span>Special instructions</span>
            <textarea value={service.special_instructions} onChange={event => set('special_instructions', event.target.value)} placeholder="Timing, access or setup notes" rows={2} />
          </label>
          <label className="agreement-field sm:col-span-2 lg:col-span-3">
            <span>Internal CRM note <em>Hidden from client</em></span>
            <textarea value={service.internal_note} onChange={event => set('internal_note', event.target.value)} placeholder="Vendor, costing or staff-only information" rows={2} />
          </label>
        </div>
      )}
    </div>
  );
}
