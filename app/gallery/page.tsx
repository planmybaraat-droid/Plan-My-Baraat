import type { Metadata } from "next";

import GalleryClient from "@/components/GalleryClient";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Real Baraat Celebration Gallery",
  description:
    "Explore real Plan My Baraat celebrations featuring vintage cars, Chhatri lights, dhol, pyrotechnics, family moments, and grand groom entries.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Baraat Gallery | Plan My Baraat",
    description:
      "Explore real Baraat celebrations featuring vintage cars, Chhatri lights, dhol, pyrotechnics, family moments, and grand groom entries.",
    url: "/gallery",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baraat Gallery | Plan My Baraat",
    description:
      "Explore real Baraat celebrations featuring vintage cars, Chhatri lights, dhol, pyrotechnics, and grand groom entries.",
  },
};

export default function GalleryPage() {
  return (
    <div className="gallery-page inner-public-page relative flex min-h-screen flex-col bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />

      <div className="flex-grow">
        <GalleryClient />
      </div>

      <SiteFooter variant="contact" />
    </div>
  );
}
import type { Metadata } from "next";

import GalleryClient from "@/components/GalleryClient";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Baraat Gallery",
  description:
    "Explore real Plan My Baraat celebrations featuring vintage cars, Chhatri lights, dhol, pyrotechnics, family moments, and grand groom entries.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Baraat Gallery | Plan My Baraat",
    description:
      "Explore real Baraat celebrations featuring vintage cars, Chhatri lights, dhol, pyrotechnics, family moments, and grand groom entries.",
    url: "/gallery",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baraat Gallery | Plan My Baraat",
    description:
      "Explore real Baraat celebrations featuring vintage cars, Chhatri lights, dhol, pyrotechnics, and grand groom entries.",
  },
};

export default function GalleryPage() {
  return (
    <div className="gallery-page inner-public-page relative flex min-h-screen flex-col bg-white font-sans text-[#010101]">
      <SiteHeader variant="contact" />

      <div className="flex-grow">
        <GalleryClient />
      </div>

      <SiteFooter variant="contact" />
    </div>
  );
}
