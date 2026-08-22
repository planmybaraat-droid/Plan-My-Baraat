import type { Metadata } from "next";
import { Inter, Manrope, Montserrat, Roboto } from "next/font/google";

import MetaPixel from "@/components/MetaPixel";
import ConversionTracking from "@/components/ConversionTracking";
import { GoogleTagManagerScript, GoogleTagManagerNoScript } from "@/components/GoogleTagManager";
import { generateJsonLdOrganization, generateJsonLdWebSite } from "@/lib/seoHelpers";
import "./globals.css";

const manropeHeading = Manrope({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["500", "600", "700", "800"],
});

const manropeBody = Manrope({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const montserratIdCard = Montserrat({
  subsets: ["latin"],
  variable: "--font-idcard-montserrat",
  weight: ["600", "700", "800"],
});

const interIdCard = Inter({
  subsets: ["latin"],
  variable: "--font-idcard-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const robotoIdCard = Roboto({
  subsets: ["latin"],
  variable: "--font-idcard-roboto",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://planmybaraat.com"),
  title: {
    default: "Plan My Baraat | Premium Baraat Planning Company",
    template: "%s | PlanMyBaraat",
  },
  description:
    "Premium Baraat planning for DJ trucks, vintage groom entries, Punjabi dhol, safa teams, Chhatri lights, effects and complete procession coordination.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "hbBQfovzIXc0-N1ZQAI1rgLmP3l-YWXf4nepmks8kjg",
  },
  icons: {
    icon: "/icon-mark-32.png",
    apple: "/icon-mark-180.png",
    shortcut: "/icon-mark-32.png",
  },
  openGraph: {
    title: "Plan My Baraat | Premium Baraat Planning Company",
    description:
      "Specialist planning for premium groom entries, DJ trucks, vintage cars, dhol, safa, lighting and complete Baraat coordination.",
    url: "/",
    siteName: "PlanMyBaraat",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1680,
        height: 945,
        alt: "Plan My Baraat — your grand entry, planned to be unforgettable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plan My Baraat | Premium Baraat Planning Company",
    description:
      "Your groom entry, music, movement and celebration—planned by one specialist Baraat team.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateJsonLdOrganization();
  const websiteSchema = generateJsonLdWebSite();

  return (
    <html lang="en">
      <body
        className={`${manropeHeading.variable} ${manropeBody.variable} ${montserratIdCard.variable} ${interIdCard.variable} ${robotoIdCard.variable} font-sans antialiased bg-[#fcfbf9] text-[#1c1917]`}
      >
        <GoogleTagManagerScript />
        <GoogleTagManagerNoScript />
        <MetaPixel />
        <ConversionTracking />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationSchema }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteSchema }}
        />
        {children}
      </body>
    </html>
  );
}
