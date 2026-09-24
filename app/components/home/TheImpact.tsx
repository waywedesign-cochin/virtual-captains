"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DottedBackground from "./DottedBackground";

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
 * "The Impact" — Staggered horizontal timeline stats band with
 * smooth Scroll-Pinned Curtain Transition, Right-to-Left laser sweep,
 * and scroll-triggered point reveals with live counting numbers.
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
        gsap.set(lineFillRef.current, { scaleX: 1, transformOrigin: "right center" });
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
        transformOrigin: "right center",
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
        transformOrigin: (i) => {
          const isTop = TIMELINE_STATS[i].position === "top";
          if (i === 4) return isTop ? "bottom right" : "top right";
          return isTop ? "bottom left" : "top left";
        },
      });
      gsap.set(mobileItemRefs.current, {
        opacity: 0,
        scale: 0.85,
        y: 20,
        transformOrigin: "center center",
      });

      const mm = gsap.matchMedia();

      // Desktop: Pinned scroll-scrubbed timeline (Right to Left Laser Sweep) — no curtain exit
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            id: "impact-pin",
            trigger: sectionRef.current,
            start: "top top",
            end: () =>
              "+=" +
              ((typeof window !== "undefined" ? window.innerHeight : 900) * 2.2),
            pin: true,
            anticipatePin: 1,
            scrub: 0.6,
          },
        });

        // 1. Laser line sweeps from right to left
        tl.to(
          lineFillRef.current,
          {
            scaleX: 1,
            duration: 2.0,
            ease: "none",
          },
          0,
        );

        // 2. Reveal points in right-to-left order as laser reaches each node
        const REVERSE_POINTS = [
          { index: 4, distFromRight: 0.12 },
          { index: 3, distFromRight: 0.32 },
          { index: 2, distFromRight: 0.52 },
          { index: 1, distFromRight: 0.72 },
          { index: 0, distFromRight: 0.92 },
        ];

        REVERSE_POINTS.forEach(({ index, distFromRight }) => {
          const hitTime = 2.0 * distFromRight;
          const stat = TIMELINE_STATS[index];
          const dotEl = dotRefs.current[index];
          const desktopEl = desktopItemRefs.current[index];
          const valueEl = valueRefs.current[index];

          tl.to(
            dotEl,
            {
              opacity: 1,
              scale: 1,
              duration: 0.18,
              ease: "back.out(2.5)",
            },
            hitTime,
          );

          tl.to(
            desktopEl,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: "back.out(1.2)",
            },
            hitTime + 0.02,
          );

          const counter = { val: 0 };
          tl.to(
            counter,
            {
              val: stat.value,
              duration: 0.38,
              ease: "power1.out",
              onUpdate: () => {
                if (valueEl) {
                  valueEl.textContent = Math.round(counter.val).toLocaleString("en-US");
                }
              },
            },
            hitTime + 0.02,
          );
        });

        return () => tl.kill();
      });

      // Mobile & Tablet: Scroll-triggered / scrubbed cards
      mm.add("(max-width: 1023px)", () => {
        gsap.set(sectionRef.current, { clearProps: "all" });

        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 85%",
            scrub: 0.6,
          },
        });

        mobileTl.to(
          mobileItemRefs.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
          },
          0,
        );

        TIMELINE_STATS.forEach((stat, i) => {
          const mobileEl = mobileValueRefs.current[i];
          const counter = { val: 0 };

          mobileTl.to(
            counter,
            {
              val: stat.value,
              duration: 0.8,
              ease: "power1.out",
              onUpdate: () => {
                if (mobileEl) {
                  mobileEl.textContent = Math.round(counter.val).toLocaleString("en-US");
                }
              },
            },
            0.1 + i * 0.12,
          );
        });

        return () => mobileTl.kill();
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
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20 text-white sm:px-10 lg:pl-36 lg:pr-16 lg:py-0"
      style={{
        background:
          "linear-gradient(180deg, #040507 0%, #050b24 25%, #051d5c 60%, #0c318f 100%)",
      }}
    >
      {/* Background Dot Grid (matching second section) */}
      <DottedBackground theme="dark" />

      {/* ---------- DESKTOP: STAGGERED HORIZONTAL TIMELINE (lg and up) ---------- */}
      <div className="relative z-10 mx-auto hidden h-70 w-full max-w-340 lg:block">
        {/* Continuous Horizontal Track Line */}
        <div className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-white/15" />

        {/* Animated Fill Line (fills across from right to left) */}
        <div
          ref={lineFillRef}
          className="absolute inset-x-0 top-1/2 h-[2.5px] -translate-y-1/2 bg-linear-to-l from-[#1d63ed] via-[#38bdf8] to-[#e7ff3d] shadow-[0_0_16px_rgba(56,189,248,0.9),0_0_24px_rgba(231,255,61,0.6)] origin-right"
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
                className={`absolute ${
                  i === 4
                    ? "right-0 items-end text-right"
                    : "left-0 items-start text-left"
                } w-max ${
                  isTop ? "bottom-4 flex flex-col" : "top-4 flex flex-col"
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
