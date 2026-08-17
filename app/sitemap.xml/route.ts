const BASE_URL = "https://planmybaraat.com";
export const dynamic = "force-static";

const sections = ["core", "locations", "keywords"];

function buildSitemapIndexXml() {
  const entries = sections
    .map(
      (section) => `<sitemap><loc>${BASE_URL}/sitemaps/${section}.xml</loc></sitemap>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

export function GET() {
  return new Response(buildSitemapIndexXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
