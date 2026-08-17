import { CATEGORIES, Category } from "./data/categories";
import { CITIES, City } from "./data/cities";

export const SITE_URL = "https://planmybaraat.com";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

// ─── Slug Utilities ────────────────────────────────────────────────────────────

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function specialtyToSlug(category: Category): string {
  return toSlug(category.name);
}

export function cityToSlug(city: City): string {
  return toSlug(city.name);
}

export function areaToSlug(area: string): string {
  return toSlug(area);
}

export function slugToSpecialty(slug: string): Category | undefined {
  return CATEGORIES.find((c) => toSlug(c.name) === slug);
}

export function slugToCity(slug: string): City | undefined {
  return CITIES.find((c) => toSlug(c.name) === slug);
}

// ─── WhatsApp Link Builder ─────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = "919089081111"; // PlanMyBaraat WhatsApp Business

export function buildWhatsAppLink(
  name: string,
  phone: string,
  city: string,
  specialty: string,
  date: string,
  requirement: string,
  packageInterested?: string
): string {
  const packageLine = packageInterested ? `\nPackage Interested: ${packageInterested}` : "";
  const msg = encodeURIComponent(
    `Hi PlanMyBaraat!\n\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nLooking for: ${specialty}\nWedding Date: ${date}${packageLine}\n\nRequirement:\n${requirement}\n\nPlease help me find the best vendors!`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

export function buildPackageWhatsAppLink(
  name: string,
  phone: string,
  eventDate: string,
  packageName: string
): string {
  const msg = encodeURIComponent(
    `Hi PlanMyBaraat!\n\nI'm interested in the *${packageName}*.\n\nName: ${name}\nPhone: ${phone}\nEvent Date: ${eventDate}\n\nPlease share more details and availability!`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

export function buildLeadWhatsAppLink(
  name: string,
  phone: string,
  packageInterested: string,
  requirement: string
): string {
  const msg = encodeURIComponent(
    `Hi PlanMyBaraat!\n\nName: ${name}\nPhone: ${phone}\nPackage Interested: ${packageInterested}\n\nRequirement:\n${requirement}\n\nPlease help me find the best vendors!`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

// ─── SEO Copy Generators ───────────────────────────────────────────────────────

const PRICE_MAP: Record<string, { min: number; max: number }> = {
  Venues: { min: 60000, max: 600000 },
  Catering: { min: 50000, max: 350000 },
  Decoration: { min: 40000, max: 450000 },
  Photography: { min: 30000, max: 250000 },
  "Makeup & Styling": { min: 12000, max: 120000 },
  Entertainment: { min: 20000, max: 250000 },
  "Baraat Processions": { min: 15000, max: 250000 },
};

const CITY_ADJECTIVES: Record<string, string> = {
  Jaipur: "royal",
  Udaipur: "lakeside",
  Mumbai: "grand Bollywood-style",
  Delhi: "opulent farmhouse",
  Goa: "beachfront",
  Amritsar: "Punjabi",
  Hyderabad: "Nizami",
  Chennai: "traditional South Indian",
  Kolkata: "heritage",
  Bengaluru: "modern chic",
  Lucknow: "Nawabi",
  Agra: "Mughal heritage",
  Varanasi: "spiritual",
  Jodhpur: "desert royal",
  Jaisalmer: "golden fort",
};

function getCityAdjective(cityName: string): string {
  return CITY_ADJECTIVES[cityName] ?? "vibrant";
}

export function generatePageTitle(specialty: Category, city: City): string {
  return `Best ${specialty.name} in ${city.name} for Baraat | PlanMyBaraat`;
}

export function generateMetaDescription(specialty: Category, city: City): string {
  const price = PRICE_MAP[specialty.group] ?? { min: 10000, max: 200000 };
  return `Book premium ${specialty.name} for your Baraat in ${city.name}. Get instant WhatsApp quotes from verified vendors. Prices starting ₹${price.min.toLocaleString("en-IN")}. Free inquiry, no commission.`;
}

export function generateAreaMetaDescription(
  specialty: Category,
  city: City,
  area: string
): string {
  const price = PRICE_MAP[specialty.group] ?? { min: 10000, max: 200000 };
  return `Find ${specialty.name.toLowerCase()} in ${area}, ${city.name}. Explore premium wedding vendors, compare options, and enquire on WhatsApp. Packages often start around ₹${price.min.toLocaleString("en-IN")}.`;
}

export function generateH1(specialty: Category, city: City): string {
  return `${specialty.name} for Baraat in ${city.name}${city.state && city.state !== city.name ? `, ${city.state}` : ""}`;
}

export function generateBodyCopy(specialty: Category, city: City): string[] {
  const adj = getCityAdjective(city.name);
  const price = PRICE_MAP[specialty.group] ?? { min: 10000, max: 200000 };
  const stateStr = city.state && city.state !== city.name ? ` in ${city.state}` : "";

  return [
    `Planning a ${adj} wedding${stateStr}? ${specialty.name} is one of the most celebrated elements of any grand Baraat in ${city.name}. Whether you're looking for a budget-friendly package or a premium luxury experience, PlanMyBaraat connects you with the best ${specialty.name.toLowerCase()} vendors across ${city.name}.`,

    `${city.name} has a rich tradition of grand wedding processions. The demand for authentic and high-quality ${specialty.name.toLowerCase()} has grown significantly in recent years, with couples investing between ₹${price.min.toLocaleString("en-IN")} to ₹${price.max.toLocaleString("en-IN")} for premium services. Our curated network ensures you only deal with verified, experienced professionals.`,

    `We understand that every Baraat is unique — and so are your requirements. By submitting a quick WhatsApp inquiry through this page, our team will personally shortlist the best ${specialty.name.toLowerCase()} vendors in ${city.name} for your wedding date, share portfolios, and get you competitive quotes within hours. No broker fees, no hidden charges.`,

    `Thousands of families across India trust PlanMyBaraat to make their Baraat unforgettable. Join them by sending us your requirement today — it's completely free, instant, and handled by our dedicated wedding experts.`,
  ];
}

export function generateAreaBodyCopy(
  specialty: Category,
  city: City,
  area: string
): string[] {
  const price = PRICE_MAP[specialty.group] ?? { min: 10000, max: 200000 };

  return [
    `${area} is one of the strongest wedding catchments in ${city.name} for couples comparing reliable ${specialty.name.toLowerCase()} options close to their venue, family homes, or guest accommodation clusters.`,
    `PlanMyBaraat helps families looking for ${specialty.name.toLowerCase()} in ${area}, ${city.name} discover suitable vendors faster, shortlist options by style and budget, and move the conversation to WhatsApp without filling long forms.`,
    `For many weddings in ${city.name}, ${specialty.name.toLowerCase()} packages typically begin near ₹${price.min.toLocaleString("en-IN")} and scale upward based on production size, customization, guest count, and event-day logistics.`,
  ];
}

export interface FAQ {
  question: string;
  answer: string;
}

export function generateFAQs(specialty: Category, city: City): FAQ[] {
  const price = PRICE_MAP[specialty.group] ?? { min: 10000, max: 200000 };
  const stateStr = city.state && city.state !== city.name ? ` in ${city.state}` : "";

  return [
    {
      question: `How much does ${specialty.name} cost in ${city.name}?`,
      answer: `The cost of ${specialty.name} in ${city.name}${stateStr} typically ranges from ₹${price.min.toLocaleString("en-IN")} to ₹${price.max.toLocaleString("en-IN")} depending on the scale, duration, and customization. Send us your requirement on WhatsApp to get exact quotes from verified vendors.`,
    },
    {
      question: `How do I book ${specialty.name} for my Baraat in ${city.name}?`,
      answer: `It's simple! Fill out the WhatsApp inquiry form on this page with your name, wedding date, and requirements. Our team will connect you with the best ${specialty.name.toLowerCase()} vendors in ${city.name} within a few hours. Completely free — no commission charged.`,
    },
    {
      question: `How far in advance should I book ${specialty.name} in ${city.name}?`,
      answer: `We recommend booking ${specialty.name.toLowerCase()} at least 1–3 months in advance for peak wedding seasons (November to February). For popular dates during Diwali, Christmas, or summer, early booking of 3–6 months ensures you get the best vendors in ${city.name}.`,
    },
    {
      question: `Does PlanMyBaraat verify vendors in ${city.name}?`,
      answer: `Yes! Every vendor on PlanMyBaraat goes through a verification process including ID check, portfolio review, and past client references. We ensure that ${specialty.name.toLowerCase()} vendors in ${city.name} are experienced, reliable, and deliver as promised.`,
    },
  ];
}

export function generateAreaFAQs(specialty: Category, city: City, area: string): FAQ[] {
  return [
    {
      question: `Do you provide ${specialty.name.toLowerCase()} in ${area}, ${city.name}?`,
      answer: `Yes. PlanMyBaraat can help you discover and enquire about ${specialty.name.toLowerCase()} serving ${area} and nearby parts of ${city.name}.`,
    },
    {
      question: `How do I compare ${specialty.name.toLowerCase()} near ${area}?`,
      answer: `Start with your date, venue zone, and budget. We then help narrow down suitable ${specialty.name.toLowerCase()} options for ${area}, ${city.name} on WhatsApp.`,
    },
    {
      question: `Can you support destination guests and venue-side logistics in ${area}?`,
      answer: `Yes. For many weddings, the right vendor shortlist depends on access, parking, guest movement, and venue timelines around ${area}, which is why location-specific planning matters.`,
    },
  ];
}

export function generateJsonLdFAQ(faqs: FAQ[]): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return JSON.stringify(schema);
}

export function generateJsonLdBreadcrumb(specialty: Category, city: City): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://planmybaraat.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: specialty.name,
        item: `https://planmybaraat.com/${specialtyToSlug(specialty)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: city.name,
        item: `https://planmybaraat.com/${specialtyToSlug(specialty)}/${cityToSlug(city)}`,
      },
    ],
  };
  return JSON.stringify(schema);
}

export function generateJsonLdLocalBusiness(specialty: Category, city: City): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `PlanMyBaraat – ${specialty.name} in ${city.name}`,
    description: generateMetaDescription(specialty, city),
    url: `https://planmybaraat.com/${specialtyToSlug(specialty)}/${cityToSlug(city)}`,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: {
      "@type": "City",
      name: city.name,
    },
  };
  return JSON.stringify(schema);
}

export function generateJsonLdOrganization(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Plan My Baraat",
    alternateName: "PlanMyBaraat",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon-mark-512.png`,
    },
    email: "planmybaraat@gmail.com",
    description:
      "A premium Baraat planning company specializing in groom entries, DJ trucks, vintage cars, dhol, safa teams, lighting, effects and complete procession coordination.",
    sameAs: [
      "https://www.instagram.com/planmybaraatofficial",
      "https://www.facebook.com/share/1JTGqNsvfx/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+91-9089081111",
      availableLanguage: ["English", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Studio 501-502, Broadway Signature, Sevasi-Bhayli Canal Ring Road",
      addressLocality: "Vadodara",
      addressRegion: "Gujarat",
      postalCode: "391110",
      addressCountry: "IN",
    },
    areaServed: ["Vadodara", "Ahmedabad", "Surat", "Gujarat", "India"],
  });
}

export function generateJsonLdWebSite(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "PlanMyBaraat",
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: { "@id": ORGANIZATION_ID },
  });
}

export function generateJsonLdCollectionPage(
  name: string,
  description: string,
  url: string
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
  });
}

export function generateJsonLdItemList(
  items: Array<{ name: string; url: string }>
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  });
}

export function generateJsonLdService(
  specialty: Category,
  city: City,
  area?: string
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: area
      ? `${specialty.name} in ${area}, ${city.name}`
      : `${specialty.name} in ${city.name}`,
    serviceType: specialty.name,
    areaServed: {
      "@type": "City",
      name: city.name,
    },
    provider: { "@id": ORGANIZATION_ID },
    url: area
      ? `https://planmybaraat.com/${specialtyToSlug(specialty)}/${cityToSlug(city)}/${areaToSlug(area)}`
      : `https://planmybaraat.com/${specialtyToSlug(specialty)}/${cityToSlug(city)}`,
  });
}

// ─── Generic (non-vendor-category) JSON-LD builders for the baraat location/keyword pages ──

export function generateJsonLdBreadcrumbGeneric(
  items: Array<{ name: string; url: string }>
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function generateJsonLdServiceGeneric(params: {
  name: string;
  description: string;
  areaServedName: string;
  url: string;
}): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    serviceType: "Wedding Baraat Procession Package",
    areaServed: {
      "@type": "Place",
      name: params.areaServedName,
    },
    provider: { "@id": ORGANIZATION_ID },
    url: params.url,
  });
}

export function generateJsonLdFAQGeneric(
  faqs: Array<{ q: string; a: string }>
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  });
}
