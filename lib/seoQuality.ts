import type { CityContent } from "@/lib/data/baraatCityContent";
import type { KeywordContent } from "@/lib/data/baraatKeywordContent";

function usefulLength(parts: string[]) {
  return parts.join(" ").replace(/\s+/g, " ").trim().length;
}

export function isCityContentIndexable(content: CityContent | undefined) {
  if (!content || content.faqs.length < 3) return false;
  return usefulLength([
    content.intro,
    content.localArea,
    content.whatsIncluded,
    content.whyUs,
    content.pricingGuidance,
    content.planningNotes,
    content.closing,
  ]) >= 1800;
}

export function isKeywordContentIndexable(content: KeywordContent | undefined) {
  if (!content || content.faqs.length < 3) return false;
  return usefulLength([
    content.intro,
    content.explanation,
    content.whatsIncluded,
    content.pricingGuidance,
    content.bookingNotes,
    content.closing,
  ]) >= 1600;
}
