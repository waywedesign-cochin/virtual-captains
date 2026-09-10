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
  const lineFillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
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
        gsap.set(lineFillRef.current, { scaleX: 1 });
        gsap.set(dotRefs.current, { opacity: 1, scale: 1 });
        gsap.set(desktopItemRefs.current, { opacity: 1, scale: 1, y: 0 });
        gsap.set(mobileItemRefs.current, { opacity: 1, scale: 1, y: 0 });

        TIMELINE_STATS.forEach((stat, i) => {
          const formatted = stat.value.toLocaleString("en-US");
          if (valueRefs.current[i]) valueRefs.current[i]!.textContent = formatted;
          if (mobileValueRefs.current[i])
            mobileValueRefs.current[i]!.textContent = formatted;
        });
        return;
      }

      // Initial states
      gsap.set(lineFillRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(dotRefs.current, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });
      gsap.set(desktopItemRefs.current, {
        opacity: 0,
        scale: 0.75,
        y: (i) => (TIMELINE_STATS[i].position === "top" ? 22 : -22),
        transformOrigin: (i) =>
          TIMELINE_STATS[i].position === "top" ? "bottom left" : "top left",
      });
      gsap.set(mobileItemRefs.current, {
        opacity: 0,
        scale: 0.85,
        y: 20,
        transformOrigin: "center center",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Line fill animation (laser line sweeps across)
      tl.to(
        lineFillRef.current,
        {
          scaleX: 1,
          duration: 1.15,
          ease: "power2.inOut",
        },
        0,
      );

      // 2. Points appear one by one as the line progresses
      const POINT_TIMES = [0.12, 0.35, 0.58, 0.82, 1.05];

      TIMELINE_STATS.forEach((stat, i) => {
        const pointTime = POINT_TIMES[i];
        const dotEl = dotRefs.current[i];
        const desktopEl = desktopItemRefs.current[i];
        const valueEl = valueRefs.current[i];

        // Glowing dot pops in
        tl.to(
          dotEl,
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "back.out(2.5)",
          },
          pointTime,
        );

        // Stat content zooms in
        tl.to(
          desktopEl,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            ease: "back.out(1.35)",
          },
          pointTime + 0.04,
        );

        // Counter counts up
        const counter = { value: 0 };
        tl.to(
          counter,
          {
            value: stat.value,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              const formatted = Math.round(counter.value).toLocaleString("en-US");
              if (valueEl) valueEl.textContent = formatted;
            },
          },
          pointTime + 0.04,
        );
      });

      // Mobile items staggered zoom-in & count up
      tl.to(
        mobileItemRefs.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.2)",
        },
        0.2,
      );

      TIMELINE_STATS.forEach((stat, i) => {
        const mobileEl = mobileValueRefs.current[i];
        const counter = { value: 0 };

        tl.to(
          counter,
          {
            value: stat.value,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              const formatted = Math.round(counter.value).toLocaleString("en-US");
              if (mobileEl) mobileEl.textContent = formatted;
            },
          },
          0.3 + i * 0.12,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="organisations"
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
      <div className="relative z-10 mx-auto hidden h-70 w-full max-w-340 lg:block">
        {/* Continuous Horizontal Track Line */}
        <div className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-white/15" />

        {/* Animated Fill Line (fills across from left to right) */}
        <div
          ref={lineFillRef}
          className="absolute inset-x-0 top-1/2 h-[2.5px] -translate-y-1/2 bg-linear-to-r from-[#1d63ed] via-[#38bdf8] to-[#e7ff3d] shadow-[0_0_14px_rgba(56,189,248,0.85)] origin-left"
        />

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
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e7ff3d] shadow-[0_0_12px_#e7ff3d,0_0_20px_rgba(231,255,61,0.7)]"
              />

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
                <p className="mt-2 max-w-50 font-serif text-[clamp(0.95rem,1.15vw,1.18rem)] italic leading-tight text-white/90">
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
