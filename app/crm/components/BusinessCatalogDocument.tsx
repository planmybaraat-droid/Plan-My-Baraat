'use client';

import { forwardRef, useEffect, useState } from 'react';
import { Globe2, Mail, Phone } from 'lucide-react';
import QRCode from 'qrcode';
import type { Vendor } from '../lib/types';
import { MASTER_SERVICES } from '../../../lib/businessCatalog';
import { BARAAT_PACKAGES } from '../../../lib/packagesData';

export type CatalogDocumentRequest =
  | { type: 'services' }
  | { type: 'vendors' }
  | { type: 'packages' }
  | { type: 'package'; packageId: string };

function chunks<T>(items: readonly T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));
}

function DocumentHeader({ title }: { title: string }) {
  return <header className="catalog-doc-header">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/logo.png" alt="PlanMyBaraat" />
    <div><span>Business information</span><strong>{title}</strong></div>
  </header>;
}

function DocumentFooter({ page, total, qr }: { page: number; total: number; qr: string }) {
  return <footer className="catalog-doc-footer">
    <div className="catalog-doc-footer-contact">
      <span><Phone size={11} /> +91 90890 81111</span>
      <span><Mail size={11} /> hr@planmybaraat.com</span>
      <span><Globe2 size={11} /> www.planmybaraat.com</span>
    </div>
    <div className="catalog-doc-footer-main">
      <div className="catalog-doc-footer-brand">
        <strong>PlanMyBaraat</strong>
        <p>Studio 501–502, Broadway Signature, 5th Floor,<br />Near Red Petal Party Plot, Opp. Sevasi-Bhayli<br />Canal Ring Road, Vadodara, Gujarat – 391110</p>
        <span>Working Hours: Monday – Saturday, 10:00 AM – 7:00 PM</span>
      </div>
      <div className="catalog-doc-footer-verify">
        {qr ? <img src={qr} alt="PlanMyBaraat verification QR code" /> : <span className="catalog-doc-qr-placeholder" />}
        <small>Scan to Verify</small>
        <b>Page {page} of {total}</b>
      </div>
    </div>
  </footer>;
}

function Page({ title, page, total, qr, children }: { title: string; page: number; total: number; qr: string; children: React.ReactNode }) {
  return <section className="catalog-pdf-page" data-pdf-page>
    <img src="/logo.png" alt="" className="catalog-doc-watermark-logo" />
    <DocumentHeader title={title} />
    <main>{children}</main>
    <DocumentFooter page={page} total={total} qr={qr} />
  </section>;
}

function PageTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div className="catalog-doc-title"><span>{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>;
}

interface BusinessCatalogDocumentProps {
  request: CatalogDocumentRequest;
  vendors: Vendor[];
}

const BusinessCatalogDocument = forwardRef<HTMLDivElement, BusinessCatalogDocumentProps>(function BusinessCatalogDocument({ request, vendors }, ref) {
  const [qr, setQr] = useState('');

  useEffect(() => {
    QRCode.toDataURL('https://www.planmybaraat.com', {
      width: 112, margin: 0,
      color: { dark: '#111111', light: '#ffffff' },
    }).then(setQr).catch(() => setQr(''));
  }, []);

  if (request.type === 'services') {
    const pages = chunks(MASTER_SERVICES.filter(service => service.active), 9);
    return <div ref={ref} className="catalog-document">{pages.map((services, pageIndex) =>
      <Page key={pageIndex} title="All Services" page={pageIndex + 1} total={pages.length} qr={qr}>
        <PageTitle eyebrow="Master catalogue" title="All Services" copy="The current centralized service catalogue used by client agreements, vendor agreements and quotations." />
        <div className="catalog-doc-list">{services.map((service, index) => <article key={service.id} className="catalog-doc-row">
          <b>{String(pageIndex * 9 + index + 1).padStart(2, '0')}</b>
          <div><span>{service.category}</span><h2>{service.name}</h2><p>{service.description}</p>{service.options?.length ? <small>Options: {service.options.join(' · ')}</small> : null}</div>
        </article>)}</div>
      </Page>)}</div>;
  }

  if (request.type === 'vendors') {
    const pages = chunks(vendors, 8);
    const safePages = pages.length ? pages : [[]];
    return <div ref={ref} className="catalog-document">{safePages.map((vendorPage, pageIndex) =>
      <Page key={pageIndex} title="All Vendors" page={pageIndex + 1} total={safePages.length} qr={qr}>
        <PageTitle eyebrow="CRM directory" title="All Vendors" copy="Current vendor contact and service-category information from the central CRM directory." />
        {!vendorPage.length ? <div className="catalog-doc-empty">No vendors are currently available.</div> : <div className="catalog-doc-vendors">{vendorPage.map((vendor, index) => <article key={vendor.id}>
          <div className="catalog-doc-vendor-index">{String(pageIndex * 8 + index + 1).padStart(2, '0')}</div>
          <div className="catalog-doc-vendor-name"><span>{vendor.category?.name || 'Uncategorized'}</span><h2>{vendor.company_name}</h2><p>{vendor.contact_person}</p></div>
          <div><span>Contact</span><p>{vendor.mobile}</p><p>{vendor.email || '—'}</p></div>
          <div><span>Location / status</span><p>{vendor.city?.name || '—'}</p><p>{vendor.status}</p></div>
        </article>)}</div>}
      </Page>)}</div>;
  }

  const packages = request.type === 'package'
    ? BARAAT_PACKAGES.filter(pkg => pkg.id === request.packageId)
    : BARAAT_PACKAGES;
  return <div ref={ref} className="catalog-document">{packages.map((pkg, pageIndex) =>
    <Page key={pkg.id} title={pkg.name} page={pageIndex + 1} total={packages.length} qr={qr}>
      <PageTitle eyebrow="Website package" title={pkg.name} copy={pkg.tagline} />
      <section className="catalog-doc-package-intro"><p>{pkg.description}</p><strong>{pkg.features.length} included services & experiences</strong></section>
      <div className="catalog-doc-package-services">
        <h2>Services included</h2>
        {pkg.features.map((feature, index) => {
          const [name, ...detail] = feature.split(' - ');
          return <article key={feature}><b>{String(index + 1).padStart(2, '0')}</b><div><h3>{name}</h3>{detail.length ? <p>{detail.join(' - ')}</p> : null}</div></article>;
        })}
      </div>
    </Page>)}</div>;
});

export default BusinessCatalogDocument;
