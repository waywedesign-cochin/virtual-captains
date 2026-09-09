"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type TimelineStat = {
  value: number;
  suffix: string;
  label: string;
  position: "top" | "bottom";
  leftPercent: number;
};

const TIMELINE_STATS: TimelineStat[] = [
  {
    value: 8,
    suffix: "+",
    label: "Countries",
    position: "top",
    leftPercent: 8,
  },
  {
    value: 10,
    suffix: "+",
    label: "Industries",
    position: "bottom",
    leftPercent: 28,
  },
  {
    value: 200,
    suffix: "+",
    label: "Corporate sessions delivered",
    position: "top",
    leftPercent: 48,
  },
  {
    value: 500,
    suffix: "+",
    label: "Sales teams coached",
    position: "bottom",
    leftPercent: 68,
  },
  {
    value: 15000,
    suffix: "+",
    label: "Professionals trained",
    position: "top",
    leftPercent: 88,
  },
];

/**
 * "The Impact" — Staggered horizontal timeline stats band matching reference design.
 * Numbers count up once when the section scrolls into view.
 */
export default function TheImpact() {
  const sectionRef = useRef<HTMLElement>(null);
  const desktopItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobileItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const valueRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const mobileValueRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        TIMELINE_STATS.forEach((stat, i) => {
          const formatted = stat.value.toLocaleString("en-US");
          if (valueRefs.current[i]) valueRefs.current[i]!.textContent = formatted;
          if (mobileValueRefs.current[i])
            mobileValueRefs.current[i]!.textContent = formatted;
        });
        return;
      }

      // Initial states
      gsap.set(desktopItemRefs.current, {
        opacity: 0,
        y: (i) => (TIMELINE_STATS[i].position === "top" ? 24 : -24),
      });
      gsap.set(mobileItemRefs.current, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.to(
        desktopItemRefs.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        },
        0,
      ).to(
        mobileItemRefs.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        },
        0,
      );

      // Number count-up animation
      TIMELINE_STATS.forEach((stat, i) => {
        const desktopEl = valueRefs.current[i];
        const mobileEl = mobileValueRefs.current[i];
        const counter = { value: 0 };

        tl.to(
          counter,
          {
            value: stat.value,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              const formatted = Math.round(counter.value).toLocaleString("en-US");
              if (desktopEl) desktopEl.textContent = formatted;
              if (mobileEl) mobileEl.textContent = formatted;
            },
          },
          0.15 + i * 0.08,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-nav-section="The Impact"
      data-nav-theme="dark"
      className="relative -mt-px z-10 flex w-full flex-col justify-center overflow-hidden px-6 pt-28 pb-20 text-white sm:px-10 lg:pt-36 lg:pb-28 lg:pl-36 lg:pr-16"
      style={{
        background:
          "linear-gradient(180deg, #050608 0%, #050608 15%, #08173e 35%, #103ba0 65%, #1852cf 85%, #1f5be0 100%)",
      }}
    >
      {/* Background Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ---------- DESKTOP: STAGGERED HORIZONTAL TIMELINE (lg and up) ---------- */}
      <div className="relative z-10 mx-auto hidden h-[280px] w-full max-w-[1360px] lg:block">
        {/* Continuous Horizontal Line */}
        <div className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-[#3b82f6]/45 shadow-[0_0_10px_rgba(59,130,246,0.25)]" />

        {/* 5 Staggered Nodes with Neon Yellow Dots */}
        {TIMELINE_STATS.map((stat, i) => {
          const isTop = stat.position === "top";

          return (
            <div
              key={`desktop-${stat.label}`}
              className="absolute top-1/2 -translate-x-1/2"
              style={{ left: `${stat.leftPercent}%` }}
            >
              {/* Glowing Yellow Dot on the Line */}
              <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e7ff3d] shadow-[0_0_10px_#e7ff3d]" />

              {/* Stat Content (Above or Below the line) */}
              <div
                ref={(el) => {
                  desktopItemRefs.current[i] = el;
                }}
                className={`absolute left-0 w-max ${
                  isTop
                    ? "bottom-4 flex flex-col items-start text-left"
                    : "top-4 flex flex-col items-start text-left"
                }`}
              >
                <p className="font-sans text-[clamp(2rem,2.8vw,3.15rem)] font-bold leading-none tracking-tight text-white drop-shadow-sm">
                  <span
                    ref={(el) => {
                      valueRefs.current[i] = el;
                    }}
                  >
                    0
                  </span>
                  {stat.suffix}
                </p>
                <p className="mt-2 max-w-[200px] font-serif text-[clamp(0.95rem,1.15vw,1.18rem)] italic leading-tight text-white/90">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- MOBILE & TABLET: RESPONSIVE GRID (< lg) ---------- */}
      <div className="relative z-10 mx-auto grid w-full max-w-lg grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:hidden">
        {TIMELINE_STATS.map((stat, i) => (
          <div
            key={`mobile-${stat.label}`}
            ref={(el) => {
              mobileItemRefs.current[i] = el;
            }}
            className={`flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-[2px] ${
              i === 4 ? "sm:col-span-2 sm:mx-auto sm:w-1/2" : ""
            }`}
          >
            <p className="font-sans text-[clamp(2rem,5vw,2.6rem)] font-bold leading-none tracking-tight text-white drop-shadow-sm">
              <span
                ref={(el) => {
                  mobileValueRefs.current[i] = el;
                }}
              >
                0
              </span>
              {stat.suffix}
            </p>
            <p className="mt-2 font-serif text-[15px] italic leading-tight text-white/90">
              {stat.label}
            </p>
            <span className="mt-3 h-2 w-2 rounded-full bg-[#e7ff3d] shadow-[0_0_8px_#e7ff3d]" />
          </div>
        ))}
      </div>
    </section>
  );
}
