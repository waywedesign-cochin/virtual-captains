// components/home/SectionTag.tsx
"use client";

/**
 * The small left-edge marker that appears on every content section in the
 * reference design — a "▷ Section Name" line, a lighter sub-label under it,
 * and a few faint decorative index lines below that (the blurred-looking
 * ghost text). Purely a visual signature, not real navigation.
 */
export default function SectionTag({
  label,
  sublabel,
}: {
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="pointer-events-none absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 sm:left-6 lg:flex lg:left-10">
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-[#9aa0ab]">▷</span>
        <span className="text-[11px] font-medium tracking-wide text-[#4a4d54]">
          {label}
        </span>
      </div>
      {sublabel && (
        <span className="text-[10px] text-[#b7bac1]">{sublabel}</span>
      )}
      <div className="mt-1 flex flex-col gap-1.5">
        {[70, 55, 62, 40].map((w, i) => (
          <span
            key={i}
            className="h-0.75 rounded-full bg-[#e3e5ea] blur-[0.5px]"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>
    </div>
  );
}
