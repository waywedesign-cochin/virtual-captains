"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useHeadingZoom } from "./useHeadingZoom";

gsap.registerPlugin(ScrollTrigger);

type Metric = { value: string; label: string; note: string };

/** First metric is the featured (large) card. */
const METRICS: Metric[] = [
  {
    value: "15,000+",
    label: "Professionals Trained",
    note: "Sales talent sharpened through practice, not theory.",
  },
  {
    value: "500+",
    label: "Sales Teams Coached",
    note: "From first hires to regional desks.",
  },
  {
    value: "200+",
    label: "Corporate Sessions Delivered",
    note: "On-site and virtual.",
  },
  {
    value: "10+",
    label: "Industries",
    note: "SaaS, real estate, finance and more.",
  },
  {
    value: "8+",
    label: "Countries Served",
    note: "Across the Middle East, Europe and Asia.",
  },
  { value: "3", label: "Continents", note: "One execution standard." },
];

/** Splits "15,000+" into its number and suffix so it can count up. */
function parse(value: string) {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) return null;
  return { target: Number(match[1].replace(/,/g, "")), suffix: match[2] };
}

/**
 * "Our Global Impact" — a bento grid of stat cards. Cards rise in as the
 * section scrolls into view and each number counts up to its value.
 * Reduced motion: the final numbers, no motion.
 */
export default function AboutMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingZoom(headingRef);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(sectionRef);
      const cards = q("[data-metric-card]");

      gsap.set(cards, { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: q("[data-metric-grid]")[0],
          start: "top 80%",
          once: true,
        },
      });
      tl.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
      });

      q("[data-metric-value]").forEach((el, i) => {
        const parsed = parse(el.getAttribute("data-metric-value") ?? "");
        if (!parsed) return;
        const counter = { n: 0 };
        el.textContent = `0${parsed.suffix}`;
        tl.to(
          counter,
          {
            n: parsed.target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${Math.round(counter.n).toLocaleString("en-US")}${parsed.suffix}`;
            },
          },
          i * 0.08 + 0.15,
        );
      });
    },
    { scope: sectionRef },
  );

  const [featured, ...rest] = METRICS;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-metrics-title"
      className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      {/* Soft glow behind the grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(37,99,235,0.22)_0%,rgba(29,78,216,0.06)_50%,transparent_75%)] blur-2xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-372 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12">
        <div className="text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/50 sm:text-[11px]">
            By the Numbers
          </span>
          <h2
            ref={headingRef}
            id="about-metrics-title"
            className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl mt-2 font-medium leading-[1.1] tracking-tight text-white"
          >
            Our{" "}
            <span className="bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text italic text-transparent">
              Global
            </span>{" "}
            Impact
          </h2>
        </div>

        <ul
          data-metric-grid
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4 lg:gap-5"
        >
          {/* Featured card */}
          <li
            data-metric-card
            className="col-span-2 lg:row-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#0b2a8a]/70 via-[#071a52]/70 to-[#040d2b]/80 p-6 sm:p-8 lg:p-10 flex flex-col justify-end min-h-56 sm:min-h-64 lg:min-h-0 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-[scale,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:z-10 hover:scale-[1.025] hover:shadow-[0_24px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(243,252,0,0.08)]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(243,252,0,0.22)_0%,transparent_70%)]"
            />
            <div className="relative">
              <p
                data-metric-value={featured.value}
                className="font-sans text-[clamp(3.25rem,9vw,6.5rem)] font-bold leading-none tracking-tight vc-metric-flow tabular-nums"
              >
                {featured.value}
              </p>
              <p className="mt-3 font-sans text-lg sm:text-xl font-medium text-white">
                {featured.label}
              </p>
              <p className="mt-1.5 max-w-sm font-sans text-sm text-white/60">
                {featured.note}
              </p>
            </div>
          </li>

          {rest.map((m, i) => {
            // The odd one out closes the grid as a full-width strip
            const isStrip = i === rest.length - 1 && rest.length % 2 === 1;
            return (
              <li
                key={m.label}
                data-metric-card
                className={`group relative flex justify-between ${
                  isStrip
                    ? "col-span-2 lg:col-span-4 flex-row items-center gap-6"
                    : "flex-col"
                } overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/4 p-5 sm:p-6 backdrop-blur-sm transition-[scale,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:z-10 hover:scale-[1.04] hover:shadow-[0_24px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(243,252,0,0.08)] hover:border-[#F3FC00]/30 hover:bg-white/7`}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-5 right-5 top-0 h-px bg-linear-to-r from-transparent via-[#F3FC00]/50 to-transparent opacity-60 transition-opacity group-hover:opacity-100 sm:left-6 sm:right-6"
                />
                <p
                  data-metric-value={m.value}
                  className="font-sans text-[clamp(2rem,4.5vw,3rem)] font-bold leading-none tracking-tight vc-metric-hover tabular-nums"
                >
                  {m.value}
                </p>
                <div className={isStrip ? "text-right" : "mt-6"}>
                  <p className="font-sans text-sm sm:text-[15px] font-medium text-white/90 leading-snug">
                    {m.label}
                  </p>
                  <p className="mt-1 hidden sm:block font-sans text-xs text-white/50 leading-snug">
                    {m.note}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Number gradients: the featured number flows continuously; the small
          cards' numbers are white until hovered, then a gold gradient sweeps
          through them. */}
      <style>{`
        .vc-metric-flow,
        .vc-metric-hover {
          background-image: linear-gradient(100deg, #D08817 0%, #F3FC00 25%, #fff7b0 40%, #F3FC00 55%, #D08817 75%, #D08817 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .vc-metric-flow { animation: vc-metric-flow 6s linear infinite; }
        .vc-metric-hover {
          background-image: linear-gradient(100deg, #fff 0%, #fff 38%, #F3FC00 45%, #D08817 50%, #F3FC00 55%, #fff 62%, #fff 100%);
          background-size: 300% 100%;
          background-position: 100% 0;
          transition: background-position 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .group:hover .vc-metric-hover { background-position: 0% 0; }
        @keyframes vc-metric-flow { from { background-position: 0% 0 } to { background-position: 200% 0 } }
        @media (prefers-reduced-motion: reduce) {
          .vc-metric-flow { animation: none; }
          .vc-metric-hover { transition: none; }
        }
      `}</style>
    </section>
  );
}
