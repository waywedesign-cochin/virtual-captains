"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useHeadingZoom } from "./useHeadingZoom";

gsap.registerPlugin(ScrollTrigger);

type Metric = { value: string; label: string };

// In the order the constellation is traced.
const METRICS: Metric[] = [
  { value: "200+", label: "Corporate Sessions Delivered" },
  { value: "10+", label: "Industries" },
  { value: "500+", label: "Sales Teams Coached" },
  { value: "8+", label: "Countries" },
  { value: "15,000+", label: "Professionals Trained" },
  { value: "3", label: "Continents" },
];

type Star = { x: number; y: number };

/**
 * Star positions in % of the stage. Wide: a left → right zig-zag, like a
 * zodiac figure; labels sit above the high stars and below the low ones, so
 * the connecting lines (which run between high and low) never cross them.
 * Narrow: a top → bottom zig-zag near the centre; labels sit on the outer
 * side of each star, clear of the lines running down the middle.
 */
const WIDE: Star[] = [
  { x: 7, y: 66 },
  { x: 23, y: 30 },
  { x: 40, y: 60 },
  { x: 57, y: 24 },
  { x: 75, y: 64 },
  { x: 92, y: 32 },
];
const NARROW: Star[] = [
  { x: 43, y: 5 },
  { x: 58, y: 23 },
  { x: 41, y: 41 },
  { x: 59, y: 59 },
  { x: 42, y: 77 },
  { x: 57, y: 95 },
];

// Deterministic PRNG so the background starfield matches on server + client
function seeded(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = seeded(2026);
const SKY = Array.from({ length: 70 }, () => ({
  x: rnd() * 100,
  y: rnd() * 100,
  s: 0.8 + rnd() * 1.6,
  o: 0.15 + rnd() * 0.5,
  d: 2.5 + rnd() * 4,
  delay: rnd() * 5,
}));

const WIDE_QUERY = "(min-width: 768px) and (min-height: 501px)";
const NARROW_QUERY = "(max-width: 767px), (max-height: 500px)";

function Constellation({ stars, variant }: { stars: Star[]; variant: "wide" | "narrow" }) {
  return (
    <>
      {/* Connecting lines — one segment per link so each draws on its own.
          preserveAspectRatio="none" maps the % coordinates onto the stage;
          non-scaling-stroke keeps the line weight even. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id={`vc-const-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F3FC00" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
        </defs>
        {stars.slice(0, -1).map((a, i) => {
          const b = stars[i + 1];
          return (
            <g key={i}>
              {/* Faint guide so the figure reads before it is traced */}
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(147,197,253,0.12)"
                strokeWidth="1"
                strokeDasharray="3 5"
                vectorEffect="non-scaling-stroke"
              />
              <line
                data-const-line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                pathLength={1}
                stroke={`url(#vc-const-${variant})`}
                strokeWidth="1.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ filter: "drop-shadow(0 0 3px rgba(147,197,253,0.8))" }}
              />
            </g>
          );
        })}
      </svg>

      {stars.map((p, i) => {
        const m = METRICS[i];
        const high = p.y < 50;
        const leftSide = i % 2 === 0;
        const labelPos =
          variant === "wide"
            ? high
              ? "bottom-full left-1/2 -translate-x-1/2 mb-4 text-center"
              : "top-full left-1/2 -translate-x-1/2 mt-4 text-center"
            : leftSide
              ? "right-full top-1/2 -translate-y-1/2 mr-4 text-right"
              : "left-full top-1/2 -translate-y-1/2 ml-4 text-left";
        return (
          <div
            key={m.label}
            data-const-star
            aria-hidden="true"
            className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {/* Halo + star */}
            <span
              data-const-halo
              className="absolute left-1/2 top-1/2 block h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(243,252,0,0.35)_0%,rgba(147,197,253,0.18)_45%,transparent_70%)]"
            />
            <span
              data-const-dot
              className="absolute left-1/2 top-1/2 block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] bg-white shadow-[0_0_12px_4px_rgba(243,252,0,0.55)]"
            />
            <div
              data-const-label
              className={`absolute w-max ${variant === "wide" ? "max-w-44" : "max-w-[34vw]"} ${labelPos}`}
            >
              <p className="text-[clamp(1.35rem,2.6vw,2.4rem)] font-bold leading-none tracking-tight text-white">
                {m.value}
              </p>
              <p className="mt-1.5 text-[11px] leading-tight text-white/65 text-balance sm:text-[13px]">
                {m.label}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
}

/**
 * "Our Global Impact" — a constellation in a night sky. Each metric is a
 * star; scrolling lights them one by one and a line traces from each star to
 * the next, like a zodiac figure being drawn. Wide screens pin while it
 * traces; narrow screens trace as the section scrolls past (no pin).
 * Reduced motion: the finished constellation, no motion.
 */
export default function AboutMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingZoom(headingRef);
  const wideRef = useRef<HTMLDivElement>(null);
  const narrowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const build = (stage: HTMLElement | null, st: ScrollTrigger.Vars) => {
        if (!stage) return;
        const q = gsap.utils.selector(stage);
        const lines = q("[data-const-line]");
        const dots = q("[data-const-dot]");
        const halos = q("[data-const-halo]");
        const labels = q("[data-const-label]");

        gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(dots, { scale: 0.3, opacity: 0.35 });
        gsap.set(halos, { scale: 0.2, opacity: 0 });
        gsap.set(labels, { opacity: 0, y: 10 });

        const tl = gsap.timeline({ defaults: { ease: "power2.out" }, scrollTrigger: st });
        dots.forEach((_, i) => {
          const at = i * 1;
          tl.to(dots[i], { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.5)" }, at)
            .to(halos[i], { scale: 1, opacity: 1, duration: 0.4 }, at)
            .to(labels[i], { opacity: 1, y: 0, duration: 0.35 }, at + 0.1);
          if (lines[i]) tl.to(lines[i], { strokeDashoffset: 0, duration: 0.6, ease: "none" }, at + 0.4);
        });
        tl.to({}, { duration: 0.4 });
      };

      mm.add(`(prefers-reduced-motion: no-preference) and ${WIDE_QUERY}`, () => {
        build(wideRef.current, {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 2.4,
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
        });
      });

      mm.add(`(prefers-reduced-motion: no-preference) and (${NARROW_QUERY})`, () => {
        build(narrowRef.current, {
          trigger: narrowRef.current,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.6,
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-metrics-title"
      className="relative flex w-full flex-col items-center overflow-hidden px-4 py-14 sm:py-16 hex:h-svh hex:justify-center hex:py-10"
    >
      {/* Night sky */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(37,99,235,0.28)_0%,rgba(29,78,216,0.08)_50%,transparent_75%)] blur-2xl" />
        {SKY.map((s, i) => (
          <span
            key={i}
            className="vc-sky-star absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              opacity: s.o,
              animation: `vc-twinkle ${s.d}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
        <style>{`
          @keyframes vc-twinkle { 0%,100% { opacity: .15 } 50% { opacity: .8 } }
          @media (prefers-reduced-motion: reduce) { .vc-sky-star { animation: none !important } }
        `}</style>
      </div>

      {/* Metric list for screen readers — the constellation is decorative */}
      <ul className="sr-only">
        {METRICS.map((m) => (
          <li key={m.label}>
            {m.value} {m.label}
          </li>
        ))}
      </ul>

      <div className="relative z-10 text-center">
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/50 sm:text-[11px]">
          By the Numbers
        </span>
        <h2
          ref={headingRef}
          id="about-metrics-title"
          className="mt-2 text-[clamp(1.75rem,4vw,3.25rem)] font-medium leading-[1.1] tracking-tight text-white"
        >
          Our{" "}
          <span className="bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text italic text-transparent">
            Global
          </span>{" "}
          Impact
        </h2>
      </div>

      {/* Wide: horizontal constellation, sized by both width and height */}
      <div
        ref={wideRef}
        className="relative z-10 mt-6 hidden hex:block aspect-[2.4/1] w-[min(100%,72rem,calc((100svh-230px)*2.4))]"
      >
        <Constellation stars={WIDE} variant="wide" />
      </div>

      {/* Narrow: vertical constellation */}
      <div ref={narrowRef} className="relative z-10 mt-12 h-[640px] w-full max-w-md hex:hidden">
        <Constellation stars={NARROW} variant="narrow" />
      </div>
    </section>
  );
}
