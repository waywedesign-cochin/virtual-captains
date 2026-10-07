"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Testimonial } from "@/app/content/testimonials";

const AUTOPLAY_MS = 5200;
/** Degrees between neighbouring quotes on the cylinder. */
const STEP_DEG = 50;

/** "Aisha Rahman" → "AR" for the avatar circle. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

function Stars() {
  return (
    <div className="flex items-center gap-1" role="img" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5 fill-[#F3FC00]">
          <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ item }: { item: Testimonial }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#F3FC00] to-[#D08817] p-[1.5px] sm:h-13 sm:w-13"
    >
      {item.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={encodeURI(item.photo)} alt="" className="h-full w-full rounded-full object-cover" />
      ) : item.logo ? (
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={encodeURI(item.logo)}
            alt=""
            loading="lazy"
            className={
              item.logoFit === "cover" ? "h-full w-full object-cover" : "h-[72%] w-[72%] object-contain"
            }
          />
        </span>
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-[#0b2a73] font-sans text-[15px] font-semibold tracking-wide text-white">
          {initials(item.name)}
        </span>
      )}
    </span>
  );
}

type TestimonialDrumProps = {
  items: Testimonial[];
  /**
   * Scroll-driven drum position (0 … items.length - 1). When set, the parent
   * owns the motion: autoplay stops and controls call `onSelect` instead.
   */
  scrollPos?: number | null;
  /** Called with the requested index while `scrollPos` drives the drum. */
  onSelect?: (index: number) => void;
  /** Speech-bubble background — match it to the section behind it. */
  bubbleColor?: string;
  className?: string;
};

/**
 * Quotes on a horizontal cylinder: the centred quote faces the viewer at full
 * size, neighbours turn away and shrink to the left and right. A speech bubble
 * under the centred quote names its author.
 */
export default function TestimonialDrum({
  items,
  scrollPos = null,
  onSelect,
  bubbleColor = "#071640",
  className = "",
}: TestimonialDrumProps) {
  const N = items.length;
  const drumRef = useRef<HTMLDivElement>(null);

  /** Continuous drum position: 0 = first quote centred, 1 = second, … */
  const [ownPos, setPos] = useState(0);
  const posProxy = useRef({ v: 0 });
  const controlled = scrollPos !== null;
  const pos = controlled ? scrollPos : ownPos;

  const [hovered, setHovered] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [radius, setRadius] = useState(420);
  const [quoteWidth, setQuoteWidth] = useState(440);

  /** Wrap a continuous offset into [-N/2, N/2) so the drum loops. */
  const wrapOffset = useCallback(
    (d: number) => ((((d + N / 2) % N) + N) % N) - N / 2,
    [N],
  );

  const active = ((Math.round(pos) % N) + N) % N;
  const current = items[active];

  // Fade the drum's far edges, but never over the centred quote itself
  const edge = radius > quoteWidth * 1.2 ? 18 : 4;
  const edgeMask = `linear-gradient(90deg, transparent 0%, #000 ${edge}%, #000 ${100 - edge}%, transparent 100%)`;

  // Size the drum from the available width so side quotes stay on screen.
  useEffect(() => {
    const node = drumRef.current;
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      // phones need a wider column so long quotes don't run too many lines
      const qw = w < 640 ? w * 0.84 : Math.min(w * 0.74, 440);
      setQuoteWidth(qw);
      setRadius(Math.max(qw * 0.95, Math.min(w * 0.5, 620)));
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const tweenTo = useCallback((target: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(posProxy.current, {
      v: target,
      duration: reduce ? 0 : 0.9,
      ease: "power3.inOut",
      overwrite: true,
      onUpdate: () => setPos(posProxy.current.v),
    });
  }, []);

  /** Select a quote: hand it to the parent when scroll-driven, else spin. */
  const goTo = useCallback(
    (index: number) => {
      if (controlled) {
        onSelect?.(Math.max(0, Math.min(N - 1, index)));
        return;
      }
      const from = posProxy.current.v;
      tweenTo(Math.round(from + wrapOffset(index - from)));
    },
    [controlled, onSelect, N, tweenTo, wrapOffset],
  );

  const go = useCallback(
    (direction: number) => {
      if (controlled) goTo(active + direction);
      else tweenTo(Math.round(posProxy.current.v) + direction);
    },
    [controlled, active, goTo, tweenTo],
  );

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  // Autoplay only while visible, not hovered, and not scroll-driven.
  useEffect(() => {
    if (!onScreen || hovered || controlled) return;
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [onScreen, hovered, controlled, go, active]);

  useEffect(() => {
    const node = drumRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`flex w-full flex-col items-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ---------- QUOTE CYLINDER ---------- */}
      <div
        ref={drumRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative h-[340px] w-full max-w-6xl touch-pan-y select-none sm:h-[310px] pin:h-[clamp(280px,38vh,340px)]"
        style={{
          perspective: `${Math.round(radius * 2.6)}px`,
          maskImage: edgeMask,
          WebkitMaskImage: edgeMask,
        }}
        aria-roledescription="carousel"
        aria-label="Client testimonials"
      >
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", transform: `translateZ(${-radius}px)` }}
        >
          {items.map((item, i) => {
            const d = wrapOffset(i - pos);
            const dist = Math.abs(d);
            if (dist > 2.2) return null;
            const isCenter = dist < 0.5;
            return (
              <figure
                key={item.name}
                aria-hidden={!isCenter}
                onClick={() => !isCenter && goTo(i)}
                className={`absolute top-1/2 left-1/2 m-0 ${isCenter ? "" : "cursor-pointer"}`}
                style={{
                  width: quoteWidth,
                  transform: `translate(-50%, -50%) rotateY(${d * STEP_DEG}deg) translateZ(${radius}px)`,
                  opacity: Math.max(0, 1 - dist * 0.42),
                  filter: `blur(${Math.min(dist * 1.6, 4).toFixed(2)}px)`,
                  backfaceVisibility: "hidden",
                  zIndex: 10 - Math.round(dist * 3),
                }}
              >
                <svg
                  viewBox="0 0 44 36"
                  fill="none"
                  aria-hidden="true"
                  className="mx-auto mb-4 h-6 w-8 text-[#F3FC00]/90"
                >
                  <path d="M13 16C16.3137 16 19 18.6863 19 22C19 25.3137 16.3137 28 13 28C9.68629 28 7 25.3137 7 22C7 15 12 7 20 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M32 16C35.3137 16 38 18.6863 38 22C38 25.3137 38 28 32 28C28.6863 28 26 25.3137 26 22C26 15 31 7 39 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <blockquote className="m-0 text-center font-sans text-[13.5px] font-normal leading-[1.65] text-white sm:text-[15.5px] lg:text-[16.5px]">
                  {item.quote}
                </blockquote>
              </figure>
            );
          })}
        </div>
      </div>

      {/* ---------- SPEECH BUBBLE: author of the centred quote ---------- */}
      <div className="relative mt-7 sm:mt-9 pin:mt-[clamp(20px,3.5vh,40px)]" aria-live="polite">
        <div
          key={active}
          className="relative flex max-w-[min(92vw,460px)] animate-[bubbleIn_0.45s_cubic-bezier(0.25,1,0.5,1)] items-center gap-3.5 rounded-2xl border border-white/15 px-5 py-3.5 shadow-[0_18px_44px_-14px_rgba(0,0,0,0.7)] sm:gap-4 sm:px-6 sm:py-4"
          style={{ backgroundColor: bubbleColor }}
        >
          {/* tail pointing up at the quote */}
          <span
            aria-hidden="true"
            className="absolute -top-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 rounded-[2px] border-t border-l border-white/15"
            style={{ backgroundColor: bubbleColor }}
          />
          <Avatar item={current} />
          <figcaption className="min-w-0 text-left">
            <h3 className="font-sans text-[15px] font-medium tracking-wide text-white sm:text-[16.5px]">
              {current.name}
            </h3>
            <p className="mt-0.5 font-sans text-[11px] leading-snug tracking-wide text-white/75 sm:text-[12px]">
              {current.role}
            </p>
            <div className="mt-2">
              <Stars />
            </div>
          </figcaption>
        </div>
      </div>

      {/* ---------- CONTROLS ---------- */}
      <div className="relative z-10 mt-[clamp(28px,4.5vh,48px)] flex items-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:h-9 sm:w-9"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center">
          {items.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show testimonial from ${item.name}`}
              aria-current={i === active}
              className="group flex h-6 min-w-6 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-500 ${
                  i === active ? "w-6 bg-white" : "w-2 bg-white/30 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:h-9 sm:w-9"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
