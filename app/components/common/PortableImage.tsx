"use client";

/**
 * An image placed inside a Sanity rich-text body (News + Blog articles).
 *  - width/height from Sanity reserve the space before it loads, so nothing
 *    below (e.g. the footer's scroll animation) gets pushed around;
 *  - served resized + WebP/AVIF from Sanity's CDN instead of the raw upload.
 * (No ScrollTrigger.refresh on load: with the size reserved nothing moves,
 * and a refresh while the footer is pinned would make it jump.)
 */
export function PortableImage({
  value,
}: {
  value: { url?: string; alt?: string; width?: number; height?: number };
}) {
  if (!value?.url) return null;
  // the URL may already carry the Studio crop (?rect=…), so append with & then
  const sep = value.url.includes("?") ? "&" : "?";
  const src = (w: number) => `${value.url}${sep}w=${w}&fit=max&auto=format&q=80`;
  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src(1400)}
        srcSet={[700, 1000, 1400, 2000]
          .map((w) => `${src(w)} ${w}w`)
          .join(", ")}
        sizes="(min-width: 1024px) 760px, 100vw"
        alt={value.alt || ""}
        width={value.width}
        height={value.height}
        loading="lazy"
        decoding="async"
        className="h-auto w-full rounded-2xl border border-white/10"
      />
    </figure>
  );
}
