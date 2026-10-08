"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Expand,
  ImageIcon,
  X,
} from "lucide-react";
import type { GalleryPhoto } from "@/sanity/queries";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]";

const ICON_BUTTON = `grid place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white hover:text-black ${FOCUS_RING}`;

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

/** Every 7th photo (starting with the first) gets a 2×2 tile in the bento grid. */
const isFeatured = (i: number) => i % 7 === 0;

/**
 * One page of gallery photos (server-fetched) in a bento grid, plus a
 * full-size viewer built on the native <dialog>: focus trap, Esc to close and
 * the backdrop come from the browser; ← / → and the thumbnail strip step
 * through the photos on this page.
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
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const current = photos[index];

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const step = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + photos.length) % photos.length);

  // keep the active thumbnail in view
  useEffect(() => {
    thumbsRef.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  return (
    <>
      <ul className="grid grid-flow-dense auto-rows-[240px] grid-cols-1 gap-4 sm:auto-rows-[220px] sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {photos.map((photo, i) => {
          const featured = isFeatured(i);
          return (
            <li
              key={photo._id}
              className={featured ? "sm:col-span-2 sm:row-span-2" : undefined}
            >
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={`View photo: ${photo.caption ?? photo.alt}`}
                className={`group relative block h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 bg-cover bg-center shadow-[0_16px_40px_-18px_rgba(0,0,0,0.7)] transition-all duration-500 hover:border-white/25 hover:shadow-[0_28px_60px_-20px_rgba(29,78,216,0.5)] ${FOCUS_RING}`}
                style={photo.lqip ? { backgroundImage: `url(${photo.lqip})` } : undefined}
              >
                <img
                  src={sized(photo.url, featured ? 1200 : 800, "crop")}
                  srcSet={srcSet(
                    photo.url,
                    "crop",
                    featured ? [800, 1200, 1600] : [480, 800, 1200],
                  )}
                  sizes={
                    featured
                      ? "(min-width: 1024px) 66vw, 100vw"
                      : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  }
                  alt={photo.alt}
                  width={800}
                  height={600}
                  loading={priority && i < 3 ? "eager" : "lazy"}
                  fetchPriority={priority && i < 3 ? "high" : undefined}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />

                {/* bottom fade, deepens on hover */}
                <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-transparent transition duration-500 group-hover:ring-[#38bdf8]/40" />

                {/* expand badge */}
                <span className="absolute right-4 top-4 grid h-10 w-10 translate-y-1 place-items-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand className="h-4 w-4" aria-hidden="true" />
                </span>

                {/* date chip + caption */}
                <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 text-left transition-transform duration-500 group-hover:-translate-y-1">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/75 backdrop-blur-md">
                    <CalendarDays className="h-3 w-3" aria-hidden="true" />
                    <time dateTime={photo.date}>{formatDate(photo.date)}</time>
                  </span>
                  {photo.caption && (
                    <span
                      className={`line-clamp-2 font-medium text-white ${featured ? "text-base sm:text-lg" : "text-sm"}`}
                    >
                      {photo.caption}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
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
        className="m-auto max-h-none max-w-none bg-transparent p-0 text-white backdrop:bg-[#05070d]/90 backdrop:backdrop-blur-md"
      >
        {current && (
          <figure className="relative flex w-[min(94vw,1200px)] flex-col items-center gap-4 p-4">
            {/* top bar: counter + close */}
            <div className="flex w-full items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-mono text-xs text-white/80 backdrop-blur-md">
                <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {index + 1} / {photos.length}
              </span>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close photo viewer"
                autoFocus
                className={`h-10 w-10 ${ICON_BUTTON}`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex w-full items-center justify-center">
              <img
                key={current._id}
                src={sized(current.url, 1600, "max")}
                srcSet={srcSet(current.url, "max", [800, 1200, 1600, 2400])}
                sizes="94vw"
                alt={current.alt}
                width={current.width}
                height={current.height}
                className="max-h-[66vh] w-auto rounded-2xl border border-white/10 object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
              />

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photo"
                    className={`absolute left-2 top-1/2 h-12 w-12 -translate-y-1/2 ${ICON_BUTTON}`}
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photo"
                    className={`absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 ${ICON_BUTTON}`}
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <figcaption className="flex w-full flex-wrap items-center justify-between gap-2 text-sm text-white/85">
              <span>{current.caption ?? current.alt}</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-white/50">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                <time dateTime={current.date}>{formatDate(current.date)}</time>
              </span>
            </figcaption>

            {/* thumbnail strip */}
            {photos.length > 1 && (
              <div
                ref={thumbsRef}
                className="flex w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
              >
                {photos.map((photo, i) => (
                  <button
                    key={photo._id}
                    type="button"
                    data-index={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition ${
                      i === index
                        ? "border-[#38bdf8] opacity-100"
                        : "border-white/10 opacity-50 hover:opacity-90"
                    } ${FOCUS_RING}`}
                  >
                    <img
                      src={sized(photo.url, 160, "crop")}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </figure>
        )}
      </dialog>
    </>
  );
}
