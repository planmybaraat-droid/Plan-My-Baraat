'use client';

import { ChevronDown, GripVertical, Trash2 } from 'lucide-react';
import type { QuotationService } from '../../lib/types';
import { SERVICE_AVAILABILITY_NOTE, SERVICE_COLOR_OPTIONS, SERVICE_DECORATION_OPTIONS, SERVICE_MULTI_OPTIONS, SERVICE_OPTIONS, SERVICE_PURPOSE_OPTIONS } from '../../agreements/agreement-config';
import { quotationCurrency } from '../quotation-config';

export default function QuotationServiceBlock({ service, pricingMode, onChange, onRemove }: {
  service: QuotationService;
  pricingMode: 'Package Pricing' | 'Detailed Pricing';
  onChange: (service: QuotationService) => void;
  onRemove?: () => void;
}) {
  const set = <K extends keyof QuotationService>(key: K, value: QuotationService[K]) => onChange({ ...service, [key]: value });
  const options = SERVICE_OPTIONS[service.name] || [];
  const colorOptions = SERVICE_COLOR_OPTIONS[service.name] || [];
  const decorationOptions = SERVICE_DECORATION_OPTIONS[service.name] || [];
  const purposeOptions = SERVICE_PURPOSE_OPTIONS[service.name] || [];
  const multiOptions = SERVICE_MULTI_OPTIONS[service.name] || [];
  const availabilityNote = SERVICE_AVAILABILITY_NOTE[service.name];
  const toggleMultiOption = (value: string) => {
    const current = service.multi_options ?? [];
    set('multi_options', current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  };
  const priced = pricingMode === 'Detailed Pricing' || service.is_addon;
  return (
    <div className={`overflow-hidden rounded-2xl border transition ${service.enabled ? 'border-red-200 bg-white shadow-sm' : 'border-gray-200 bg-gray-50/70'}`}>
      <div className="flex min-h-16 items-center gap-3 px-4 py-3 sm:px-5">
        <GripVertical size={16} className="hidden text-gray-300 sm:block" />
        <label className="relative inline-flex cursor-pointer items-center"><input type="checkbox" checked={service.enabled} onChange={e => set('enabled', e.target.checked)} className="peer sr-only" /><span className="h-6 w-11 rounded-full bg-gray-200 transition-colors after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-red-600 peer-checked:after:translate-x-5" /></label>
        <div className="min-w-0 flex-1">
          {service.is_custom ? <input value={service.name} onChange={e => set('name', e.target.value)} placeholder="Custom service name" className="w-full border-0 bg-transparent p-0 text-sm font-bold text-gray-900 outline-none" /> : <p className="truncate text-sm font-bold text-gray-900">{service.name}</p>}
          <p className="mt-0.5 text-[11px] font-medium text-gray-400">{!service.enabled ? 'Not quoted' : service.is_addon ? 'Priced add-on' : pricingMode === 'Detailed Pricing' ? 'Itemized service' : 'Included in package'}{availabilityNote && <span className="ml-1.5 font-semibold text-amber-600">· {availabilityNote}</span>}</p>
        </div>
        {service.enabled && priced && <strong className="hidden text-xs text-gray-900 sm:block">{quotationCurrency(service.quantity * service.unit_price)}</strong>}
        {onRemove && <button type="button" onClick={onRemove} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${service.name}`}><Trash2 size={15} /></button>}
        <ChevronDown size={16} className={`text-gray-300 transition-transform ${service.enabled ? 'rotate-180' : ''}`} />
      </div>
      {service.enabled && <div className="grid gap-4 border-t border-gray-100 px-4 py-5 sm:grid-cols-2 lg:grid-cols-4 sm:px-5">
        <label className="agreement-field"><span>Quantity</span><input type="number" min="1" value={service.quantity} onChange={e => set('quantity', Math.max(1, Number(e.target.value) || 1))} /></label>
        <label className="agreement-field"><span>Service option</span>{options.length ? <select value={service.option} onChange={e => set('option', e.target.value)}>{options.map(option => <option key={option}>{option}</option>)}</select> : <input value={service.option} onChange={e => set('option', e.target.value)} placeholder="Variant or category" />}</label>
        <label className="agreement-field"><span>Unit price</span><input type="number" min="0" value={service.unit_price} onChange={e => set('unit_price', Math.max(0, Number(e.target.value) || 0))} disabled={!priced} className={!priced ? 'bg-gray-100 text-gray-400' : ''} /></label>
        <label className="agreement-field"><span>Pricing treatment</span><select value={service.is_addon ? 'addon' : 'included'} onChange={e => set('is_addon', e.target.value === 'addon')}><option value="included">Included in package</option><option value="addon">Charge as add-on</option></select></label>
        {colorOptions.length > 0 && <label className="agreement-field"><span>Colour add-on</span><select value={service.color} onChange={e => set('color', e.target.value)}>{colorOptions.map(color => <option key={color}>{color}</option>)}</select></label>}
        {decorationOptions.length > 0 && <label className="agreement-field"><span>Decoration</span><select value={service.decoration} onChange={e => set('decoration', e.target.value)}>{decorationOptions.map(item => <option key={item}>{item}</option>)}</select></label>}
        {purposeOptions.length > 0 && <label className="agreement-field"><span>Used for</span><select value={service.purpose} onChange={e => set('purpose', e.target.value)}>{purposeOptions.map(item => <option key={item}>{item}</option>)}</select></label>}
        {multiOptions.length > 0 && (
          <label className="agreement-field sm:col-span-2 lg:col-span-4">
            <span>Add-ons (select any)</span>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {multiOptions.map(item => (
                <label key={item} className="agreement-checkbox-pill">
                  <input type="checkbox" checked={(service.multi_options ?? []).includes(item)} onChange={() => toggleMultiOption(item)} />
                  {item}
                </label>
              ))}
            </div>
          </label>
        )}
        <label className="agreement-field sm:col-span-2"><span>Customization</span><input value={service.customization} onChange={e => set('customization', e.target.value)} placeholder="Colours, branding, style or setup" /></label>
        <label className="agreement-field sm:col-span-2"><span>Visible client remark</span><input value={service.client_remark} onChange={e => set('client_remark', e.target.value)} placeholder="Shown in quotation PDF" /></label>
        <label className="agreement-field sm:col-span-2"><span>Special instructions</span><textarea value={service.special_instructions} onChange={e => set('special_instructions', e.target.value)} rows={2} placeholder="Timing, access or setup conditions" /></label>
        <label className="agreement-field sm:col-span-2"><span>Internal CRM note <em>Hidden from client</em></span><textarea value={service.internal_note} onChange={e => set('internal_note', e.target.value)} rows={2} placeholder="Vendor cost or staff-only note" /></label>
      </div>}
    </div>
  );
}
