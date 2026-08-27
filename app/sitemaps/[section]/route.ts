import { BARAAT_CITY_CONTENT } from "@/lib/data/baraatCityContent";
import { BARAAT_KEYWORD_CONTENT } from "@/lib/data/baraatKeywordContent";
import { isCityContentIndexable, isKeywordContentIndexable } from "@/lib/seoQuality";

const BASE_URL = "https://planmybaraat.com";
export const dynamic = "force-static";
const LAST_MATERIAL_UPDATE = "2026-08-17";

type SitemapEntry = { url: string; lastModified?: string };

function toXml(urls: SitemapEntry[]) {
  const entries = urls
    .map(({ url, lastModified }) =>
      `<url><loc>${url}</loc>${lastModified ? `<lastmod>${lastModified}</lastmod>` : ""}</url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

function getUrlsForSection(section: string) {
  if (section === "core") {
    return [
      BASE_URL,
      `${BASE_URL}/about`,
      `${BASE_URL}/contact`,
      `${BASE_URL}/gallery`,
      `${BASE_URL}/opportunities`,
      `${BASE_URL}/packages`,
      `${BASE_URL}/baraat-planning-guide`,
      `${BASE_URL}/service-areas`,
      `${BASE_URL}/testimonials`,
    ].map((url) => ({ url, lastModified: LAST_MATERIAL_UPDATE }));
  }

  if (section === "locations") {
    return Object.entries(BARAAT_CITY_CONTENT)
      .filter(([, content]) => isCityContentIndexable(content))
      .map(([slug]) => ({ url: `${BASE_URL}/${slug}` }));
  }

  if (section === "keywords") {
    return Object.entries(BARAAT_KEYWORD_CONTENT)
      .filter(([, content]) => isKeywordContentIndexable(content))
      .map(([slug]) => ({ url: `${BASE_URL}/baraat-management/${slug}` }));
  }

  return [];
}

export function GET(
  _request: Request,
  { params }: { params: { section: string } }
) {
  const section = params.section.replace(/\.xml$/, "");
  const urls = getUrlsForSection(section);

  if (urls.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(toXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
