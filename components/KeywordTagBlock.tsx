export interface KeywordTagItem {
  label: string;
}

interface KeywordTagBlockProps {
  title: string;
  summary: string;
  items: KeywordTagItem[];
}

export default function KeywordTagBlock({
  title,
  summary,
  items,
}: KeywordTagBlockProps) {
  return (
    <details className="home-text-card group rounded-2xl border border-[#010101]/10 bg-[#010101]/[0.018] p-5 sm:p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold tracking-[-0.01em] text-[#010101]">{title}</h3>
          <p className="mt-1 text-sm text-[#010101]/55">{summary}</p>
        </div>
        <span className="shrink-0 rounded-full border border-[#010101]/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#010101]/60 transition group-open:border-[#E30B1D] group-open:text-[#E30B1D]">
          View All
        </span>
      </summary>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={`${title}-${item.label}-${i}`}
            className="rounded-full border border-[#010101]/12 bg-white px-3 py-2 text-sm font-semibold text-[#010101]/45"
          >
            {item.label}
          </span>
        ))}
      </div>
    </details>
  );
}
