import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import OpportunitiesClient from "./OpportunitiesClient";
import { OPPORTUNITIES } from "./opportunities-data";

export const metadata: Metadata = {
  title: "Career Opportunities & Internships",
  description: "Explore internships and full-time opportunities at Plan My Baraat in Vadodara. Choose an open position and apply directly through WhatsApp.",
  alternates: { canonical: "/opportunities" },
  openGraph: {
    title: "Career Opportunities at Plan My Baraat",
    description: "Join the team behind premium Baraat experiences. Explore internships and full-time openings in Vadodara.",
    url: "/opportunities",
    type: "website",
  },
};

export default function OpportunitiesPage() {
  const jobPostings = OPPORTUNITIES.map((role) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: `${role.summary} Responsibilities include: ${role.responsibilities.join(", ")}.`,
    datePosted: "2026-08-26",
    employmentType: role.type === "Internship" ? "INTERN" : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Plan My Baraat",
      sameAs: "https://planmybaraat.com",
      logo: "https://planmybaraat.com/icon-mark-512.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vadodara",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
    },
  }));

  return (
    <div className="opportunities-page inner-public-page relative flex min-h-screen flex-col bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />
      <main className="flex-grow">
        <OpportunitiesClient />
      </main>
      <SiteFooter variant="contact" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostings) }} />
    </div>
  );
}
