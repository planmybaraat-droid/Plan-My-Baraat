import { BARAAT_CITY_CONTENT } from "@/lib/data/baraatCityContent";
import { BARAAT_KEYWORD_CONTENT } from "@/lib/data/baraatKeywordContent";

const BASE_URL = "https://planmybaraat.com";
export const dynamic = "force-dynamic";
const now = new Date().toISOString();

function toXml(urls: string[]) {
  const entries = urls
    .map(
      (url) => `<url><loc>${url}</loc><lastmod>${now}</lastmod></url>`
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
      `${BASE_URL}/packages`,
      `${BASE_URL}/testimonials`,
    ];
  }

  if (section === "locations") {
    return Object.keys(BARAAT_CITY_CONTENT).map((slug) => `${BASE_URL}/${slug}`);
  }

  if (section === "keywords") {
    return Object.keys(BARAAT_KEYWORD_CONTENT).map(
      (slug) => `${BASE_URL}/baraat-management/${slug}`
    );
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
    },
  });
}
