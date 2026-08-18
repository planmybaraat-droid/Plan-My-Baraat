'use client';

import { useRef, useState } from 'react';
import { Download, FileStack, PackageOpen, Store, Sparkles } from 'lucide-react';
import type { Vendor } from '../lib/types';
import BusinessCatalogDocument, { type CatalogDocumentRequest } from './BusinessCatalogDocument';
import { DOWNLOAD_CENTER_PACKAGES } from './download-center-catalog';
import { getVendors } from '../lib/supabase-crm';

function requestFilename(request: CatalogDocumentRequest) {
  if (request.type === 'services') return 'All-Services.pdf';
  if (request.type === 'vendors') return 'All-Vendors.pdf';
  if (request.type === 'packages') return 'All-Packages.pdf';
  const pkg = DOWNLOAD_CENTER_PACKAGES.find(item => item.id === request.packageId);
  return `${(pkg?.name || 'Package').replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '')}.pdf`;
}

export default function DownloadCenterCard({ vendors, canDownloadVendors = true, loadVendors = getVendors }: {
  vendors: Vendor[];
  canDownloadVendors?: boolean;
  loadVendors?: () => Promise<Vendor[]>;
}) {
  const documentRef = useRef<HTMLDivElement>(null);
  const [request, setRequest] = useState<CatalogDocumentRequest>({ type: 'services' });
  const [documentVendors, setDocumentVendors] = useState(vendors);
  const [packageId, setPackageId] = useState(DOWNLOAD_CENTER_PACKAGES[0]?.id || '');
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');

  const download = async (next: CatalogDocumentRequest) => {
    const originalScroll = { x: window.scrollX, y: window.scrollY };
    setBusy(next.type === 'package' ? next.packageId : next.type);
    setMessage('');
    try {
      if (next.type === 'vendors') {
        // Always read again at download time so vendors added after the
        // dashboard first loaded are included in the generated directory.
        const latestVendors = await loadVendors();
        setDocumentVendors(latestVendors);
      }
      setRequest(next);
      window.scrollTo(0, 0);
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (!documentRef.current) throw new Error('Document preview is unavailable.');
      const pages = Array.from(documentRef.current.querySelectorAll<HTMLElement>('[data-pdf-page]'));
      if (!pages.length) throw new Error('No document pages were generated.');
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const captureWindowHeight = Math.max(1123, documentRef.current.scrollHeight + 100);
      for (let index = 0; index < pages.length; index += 1) {
        const canvas = await html2canvas(pages[index], {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: 794,
          windowHeight: captureWindowHeight,
          scrollX: 0,
          scrollY: 0,
        });
        if (index) pdf.addPage('a4', 'portrait');
        pdf.addImage(canvas.toDataURL('image/jpeg', .94), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
      const filename = requestFilename(next);
      pdf.setProperties({ title: filename.replace(/\.pdf$/i, '').replace(/-/g, ' '), subject: 'PlanMyBaraat business information', author: 'PlanMyBaraat', creator: 'PlanMyBaraat CRM' });
      pdf.save(filename);
      setMessage(`${filename} downloaded.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'PDF download failed.');
    } finally {
      window.scrollTo(originalScroll.x, originalScroll.y);
      setBusy('');
    }
  };

  const actions = [
    { key: 'services', label: 'All Services PDF', icon: Sparkles, request: { type: 'services' } as const, disabled: false },
    { key: 'vendors', label: 'All Vendors PDF', icon: Store, request: { type: 'vendors' } as const, disabled: !canDownloadVendors },
    { key: 'packages', label: 'All Packages PDF', icon: PackageOpen, request: { type: 'packages' } as const, disabled: false },
  ];

  return <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
      <div><h3 className="flex items-center gap-2 text-sm font-bold text-gray-800"><FileStack size={16} className="text-red-500" /> Download Center</h3><p className="mt-1 text-[11px] font-medium text-gray-400">Current brochure services, vendors and package documents.</p></div>
      {message && <p className="text-[10px] font-bold text-emerald-600" role="status">{message}</p>}
    </div>
    <div className="grid gap-3 p-4 sm:grid-cols-3 xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(18rem,1.35fr)]">
      {actions.map(action => <button key={action.key} type="button" disabled={Boolean(busy) || action.disabled} onClick={() => download(action.request)} title={action.disabled ? 'Your CRM role does not have access to the vendor directory.' : undefined} className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-gray-200 px-3.5 py-3 text-left text-xs font-bold text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50">
        <span className="flex min-w-0 items-center gap-2"><action.icon size={15} className="shrink-0 text-red-500" /><span className="truncate">{busy === action.key ? 'Preparing...' : action.label}</span></span><Download size={14} className="shrink-0" />
      </button>)}
      <div className="flex min-w-0 gap-2 rounded-xl border border-gray-200 p-2">
        <select value={packageId} onChange={event => setPackageId(event.target.value)} aria-label="Package for individual PDF" className="min-w-0 flex-1 rounded-lg border-0 bg-gray-50 px-2 text-xs font-semibold text-gray-700 outline-none">
          {DOWNLOAD_CENTER_PACKAGES.map(pkg => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
        </select>
        <button type="button" disabled={Boolean(busy) || !packageId} onClick={() => download({ type: 'package', packageId })} className="shrink-0 rounded-lg bg-gray-950 px-3 py-2 text-[10px] font-bold text-white hover:bg-red-600 disabled:opacity-50">{busy === packageId ? 'Preparing...' : 'Package PDF'}</button>
      </div>
    </div>
    {busy && <div className="catalog-render-host" aria-hidden="true"><BusinessCatalogDocument ref={documentRef} request={request} vendors={documentVendors} /></div>}
  </section>;
}
