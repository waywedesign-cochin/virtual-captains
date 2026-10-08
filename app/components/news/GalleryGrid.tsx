"use client";

import { useRef, useState } from "react";
import type { GalleryPhoto } from "@/sanity/queries";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]";

// Sanity's CDN resizes and serves WebP/AVIF on the fly via URL params.
const sized = (url: string, w: number, fit: "crop" | "max") =>
  `${url}?w=${w}${fit === "crop" ? `&h=${Math.round((w * 3) / 4)}` : ""}&fit=${fit}&auto=format&q=80`;

const srcSet = (url: string, fit: "crop" | "max", widths: number[]) =>
  widths.map((w) => `${sized(url, w, fit)} ${w}w`).join(", ");

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * One page of gallery photos (server-fetched) plus a full-size viewer built
 * on the native <dialog>: focus trap, Esc to close and the backdrop come
 * from the browser; ← / → step through the photos on this page.
 */
export function GalleryGrid({
  photos,
  priority = false,
}: {
  photos: GalleryPhoto[];
  /** Load the first row eagerly (page 1, above the fold). */
  priority?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const current = photos[index];

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const step = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + photos.length) % photos.length);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {photos.map((photo, i) => (
          <li key={photo._id}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`View photo: ${photo.caption ?? photo.alt}`}
              className={`group relative block aspect-4/3 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 bg-cover bg-center shadow-[0_16px_40px_-18px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_50px_-18px_rgba(29,78,216,0.45)] ${FOCUS_RING}`}
              style={photo.lqip ? { backgroundImage: `url(${photo.lqip})` } : undefined}
            >
              <img
                src={sized(photo.url, 800, "crop")}
                srcSet={srcSet(photo.url, "crop", [480, 800, 1200])}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                alt={photo.alt}
                width={800}
                height={600}
                loading={priority && i < 3 ? "eager" : "lazy"}
                fetchPriority={priority && i < 3 ? "high" : undefined}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />

              {/* caption + date over a soft bottom fade */}
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-black/75 via-black/30 to-transparent p-4 pt-12 text-left">
                <span className="line-clamp-2 text-sm font-medium text-white">
                  {photo.caption}
                </span>
                <time
                  dateTime={photo.date}
                  className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-white/60"
                >
                  {formatDate(photo.date)}
                </time>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClick={(e) => {
          // a click on the dialog itself (not its content) is the backdrop
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 text-white backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        {current && (
          <figure className="relative flex w-[min(92vw,1200px)] flex-col items-center gap-4 p-4">
            <img
              key={current._id}
              src={sized(current.url, 1600, "max")}
              srcSet={srcSet(current.url, "max", [800, 1200, 1600, 2400])}
              sizes="92vw"
              alt={current.alt}
              width={current.width}
              height={current.height}
              className="max-h-[78vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="flex w-full flex-wrap items-center justify-between gap-2 text-sm text-white/80">
              <span>{current.caption ?? current.alt}</span>
              <span className="font-mono text-xs text-white/50">
                {index + 1} / {photos.length}
              </span>
            </figcaption>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className={`absolute left-6 top-[39vh] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 backdrop-blur transition hover:bg-white hover:text-black ${FOCUS_RING}`}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className={`absolute right-6 top-[39vh] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 backdrop-blur transition hover:bg-white hover:text-black ${FOCUS_RING}`}
                >
                  →
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close photo viewer"
              autoFocus
              className={`absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/50 text-lg backdrop-blur transition hover:bg-white hover:text-black ${FOCUS_RING}`}
            >
              ×
            </button>
          </figure>
        )}
      </dialog>
    </>
  );
}
