import { readFile } from "node:fs/promises";

const centralizedExporters = [
  "app/crm/quotations/[id]/page.tsx",
  "app/workspace/quotations/[id]/page.tsx",
  "app/crm/agreements/[id]/page.tsx",
  "app/workspace/agreements/[id]/page.tsx",
  "app/crm/vendor-agreements/[id]/page.tsx",
  "app/workspace/vendor-agreements/[id]/page.tsx",
  "app/crm/invoices/[id]/page.tsx",
  "app/workspace/invoices/[id]/page.tsx",
  "app/crm/hr/letters/pdf-export.ts",
  "app/crm/components/DownloadCenterCard.tsx",
  "app/crm/hr/payroll/page.tsx",
];

const pagedDocuments = [
  "app/crm/invoices/components/InvoiceDocument.tsx",
  "app/crm/invoices/components/PaymentReceiptDocument.tsx",
];

const failures = [];

for (const file of centralizedExporters) {
  const source = await readFile(file, "utf8");
  if (!source.includes("pdf-export")) {
    failures.push(`${file}: does not use the centralized PDF exporter`);
  }
  if (file !== "app/crm/hr/letters/pdf-export.ts" && /from ["'](?:html2canvas|jspdf)["']/.test(source)) {
    failures.push(`${file}: still imports a direct PDF/screenshot dependency`);
  }
}

for (const file of pagedDocuments) {
  const source = await readFile(file, "utf8");
  if (!source.includes("data-pdf-page")) {
    failures.push(`${file}: does not declare explicit PDF page boundaries`);
  }
}

const shared = await readFile("app/crm/lib/pdf-export.ts", "utf8");
for (const requirement of [
  "document.fonts.ready",
  "loadImage",
  "waitForPdfAssets",
  "data-pdf-page",
  "crm-pdf-capture",
  "format: 'a4'",
]) {
  if (!shared.includes(requirement)) {
    failures.push(`app/crm/lib/pdf-export.ts: missing ${requirement}`);
  }
}

if (failures.length > 0) {
  console.error("PDF system verification failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`PDF system verification passed (${centralizedExporters.length} exporters, ${pagedDocuments.length} paged documents).`);
