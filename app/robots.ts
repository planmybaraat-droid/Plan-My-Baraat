import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/crm", "/crm/", "/admin", "/admin/", "/marketplace", "/marketplace/"],
      },
    ],
    sitemap: "https://planmybaraat.com/sitemap.xml",
  };
}
