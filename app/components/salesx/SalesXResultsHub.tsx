"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import {
  HEADING_REVEAL,
  HEADING_REVEAL_FROM,
} from "@/lib/animations/headingReveal";

gsap.registerPlugin(ScrollTrigger);

type Result = {
  /** Number the counter runs to */
  target: number;
  decimals?: number;
  suffix: string;
  label: string;
  note: string;
  /** How full the meter under the number gets, 0–100 */
  meter: number;
  icon: React.ReactNode;
};

const iconProps = {
  className: "h-5 w-5",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.8,
  "aria-hidden": true,
} as const;

const RESULTS: Result[] = [
  {
    target: 500,
    suffix: "+",
    label: "Careers Launched",
    note: "Learners placed into sales roles",
    meter: 100,
    icon: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 8.41m5.96 5.96a14.93 14.93 0 0 1-5.84 2.58m0 0a6 6 0 0 1-7.38-5.84h4.8m2.58-5.84a6 6 0 0 0-7.38 5.84" />
      </svg>
    ),
  },
  {
    target: 43,
    suffix: "%",
    label: "Average Revenue Growth",
    note: "Across teams on the programme",
    meter: 43,
    icon: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.31 4.31a11.95 11.95 0 0 1 5.81-5.52l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.94" />
      </svg>
    ),
  },
  {
    target: 4.9,
    decimals: 1,
    suffix: "/5",
    label: "Learner Rating",
    note: "From programme feedback",
    meter: 98,
    icon: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.12 5.11a.56.56 0 0 0 .48.35l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.39a.56.56 0 0 1-.84.61l-4.72-2.88a.56.56 0 0 0-.59 0l-4.73 2.88a.56.56 0 0 1-.84-.61l1.29-5.39a.56.56 0 0 0-.18-.56l-4.2-3.6a.56.56 0 0 1 .32-.99l5.52-.44a.56.56 0 0 0 .47-.35l2.12-5.11Z" />
      </svg>
    ),
  },
  {
    target: 20,
    suffix: "+",
    label: "Enterprise Clients",
    note: "Trusting SalesX with their teams",
    meter: 100,
    icon: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.38c0-.62.5-1.12 1.13-1.12h3.75c.62 0 1.12.5 1.12 1.13V21" />
      </svg>
    ),
  },
];

const format = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * SalesX results — heading on the left, a 2×2 grid of stat cards on the
 * right. Cards rise in, numbers count up and each meter fills as the
 * section scrolls into view. Reduced motion: final values, no motion.
 */
export default function SalesXResultsHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(sectionRef);

      gsap.set(headingRef.current, {
        ...HEADING_REVEAL_FROM,
        transformOrigin: "left center",
      });
      gsap.to(headingRef.current, {
        ...HEADING_REVEAL,
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      });

      const cards = q("[data-result-card]");
      gsap.set(cards, { opacity: 0, y: 28 });
      gsap.set(q("[data-result-meter]"), { scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: q("[data-result-grid]")[0], start: "top 80%", once: true },
      });
      tl.to(cards, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 });

      RESULTS.forEach((r, i) => {
        const el = q("[data-result-value]")[i];
        const counter = { n: 0 };
        el.textContent = `${format(0, r.decimals)}${r.suffix}`;
        tl.to(
          counter,
          {
            n: r.target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${format(counter.n, r.decimals)}${r.suffix}`;
            },
          },
          i * 0.1 + 0.2,
        ).to(
          q("[data-result-meter]")[i],
          { scaleX: 1, duration: 1.4, ease: "power2.out" },
          "<",
        );
      });
    },
    { scope: sectionRef },
  );

  /** Feeds the pointer position to the card's spotlight + border glow. */
  const trackPointer = (e: React.PointerEvent<HTMLLIElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="salesx-results-title"
      className="relative overflow-hidden bg-salesx-bg py-16 sm:py-20 lg:py-24"
    >
      {/* Background: deep blue wash + faint dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 70% 50%, #0d1f6e 0%, #070d3a 45%, #030612 78%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(147,197,253,0.35) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="mx-auto grid w-full max-w-372 px-4 sm:px-8 lg:px-12 grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* ── Left: heading ── */}
        <div className="text-center lg:col-span-5 lg:text-left">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
            Proven Outcomes
          </span>
          <h2
            ref={headingRef}
            id="salesx-results-title"
            className="mt-3 font-sans text-[clamp(2rem,4.2vw,3.5rem)] font-medium leading-[1.1] tracking-tight text-white will-change-transform"
          >
            Results That <span className="italic text-[#4d82f5]">Speak For Themselves</span>
          </h2>
          <p className="text-sm sm:text-[15px] xl:text-base mx-auto mt-4 max-w-md font-sans leading-relaxed text-slate-300/85 lg:mx-0 text-justify hyphens-auto [text-align-last:center] lg:[text-align-last:left]">
            Practice that mirrors real deals shows up where it matters: in
            careers, in pipelines and in revenue.
          </p>
        </div>

        {/* ── Right: 2×2 stat cards ── */}
        <ul data-result-grid className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7 lg:gap-5">
          {RESULTS.map((r) => (
            <li
              key={r.label}
              data-result-card
              onPointerMove={trackPointer}
              className="vc-result-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-4 backdrop-blur-sm transition-[scale,border-color,background-color,box-shadow,translate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:scale-[1.03] hover:border-[#38bdf8]/30 hover:bg-white/6 hover:shadow-[0_24px_60px_-12px_rgba(29,114,254,0.45)] sm:rounded-3xl sm:p-6 lg:p-7"
            >
              {/* Cursor spotlight + glowing border that follow the pointer */}
              <span aria-hidden="true" className="vc-result-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span aria-hidden="true" className="vc-result-ring pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#38bdf8]/25 bg-[#38bdf8]/10 text-[#38bdf8] transition-[rotate,scale,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-8 group-hover:scale-115 group-hover:bg-[#38bdf8]/20 group-hover:shadow-[0_0_24px_rgba(56,189,248,0.55)] sm:h-10 sm:w-10">
                {r.icon}
              </span>
              <p
                data-result-value
                className="vc-result-value relative mt-4 font-sans text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-none tracking-tight tabular-nums sm:mt-6"
              >
                {format(r.target, r.decimals)}
                {r.suffix}
              </p>
              <p className="relative mt-2 font-sans text-[13px] font-medium leading-snug text-white/90 sm:text-[15px]">
                {r.label}
              </p>
              <p className="relative mt-0.5 hidden font-sans text-xs text-white/50 transition-colors duration-300 group-hover:text-white/75 sm:block">
                {r.note}
              </p>

              {/* Meter */}
              <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10 sm:mt-5">
                <div
                  data-result-meter
                  className="vc-result-meter relative h-full origin-left overflow-hidden rounded-full bg-linear-to-r from-[#1d72fe] to-[#38bdf8]"
                  style={{ width: `${r.meter}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .vc-result-spot {
          background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(56,189,248,0.16), transparent 65%);
        }
        /* Border-only glow: a masked gradient so just the 1px edge lights up near the cursor */
        .vc-result-ring {
          padding: 1px;
          background: radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), rgba(56,189,248,0.9), rgba(29,114,254,0.35) 45%, transparent 75%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
        }
        /* Number: white at rest; a blue light band sweeps through on hover */
        .vc-result-value {
          background-image: linear-gradient(100deg, #fff 0%, #fff 38%, #8fd0ff 45%, #38bdf8 50%, #8fd0ff 55%, #fff 62%, #fff 100%);
          background-size: 300% 100%;
          background-position: 100% 0;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          transition: background-position 1s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .vc-result-card:hover .vc-result-value { background-position: 0% 0; }
        /* Meter: a light glint runs along the bar while hovered */
        .vc-result-meter::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent);
          transform: translateX(-120%);
          opacity: 0;
        }
        .vc-result-card:hover .vc-result-meter::after {
          opacity: 1;
          animation: vc-result-glint 1.4s ease-in-out infinite;
        }
        @keyframes vc-result-glint { to { transform: translateX(300%); } }
        @media (prefers-reduced-motion: reduce) {
          .vc-result-card:hover .vc-result-meter::after { animation: none; opacity: 0; }
          .vc-result-value { transition: none; }
        }
      `}</style>
    </section>
  );
}
