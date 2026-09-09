"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Bubble = {
  label: string;
  /** Position in percent relative to the cluster circle */
  x: number;
  y: number;
  size: number;
  isAccent?: boolean;
  fontSizeClass: string;
};

const BUBBLES: Bubble[] = [
  {
    // Large lead bubble (top-right)
    label: "Logo",
    x: 64,
    y: 43,
    size: 126,
    isAccent: false,
    fontSizeClass: "text-xl sm:text-2xl",
  },
  {
    // Medium-large bubble (middle-left)
    label: "Logo",
    x: 26,
    y: 60,
    size: 88,
    isAccent: false,
    fontSizeClass: "text-sm sm:text-base",
  },
  {
    // Top-center bubble
    label: "Logo",
    x: 35,
    y: 31,
    size: 72,
    isAccent: false,
    fontSizeClass: "text-xs sm:text-sm",
  },
  {
    // Bottom-left bubble
    label: "Logo",
    x: 30,
    y: 77,
    size: 64,
    isAccent: false,
    fontSizeClass: "text-[11px] sm:text-xs",
  },
  {
    // Bottom-center/right bubble
    label: "Logo",
    x: 53,
    y: 78,
    size: 70,
    isAccent: false,
    fontSizeClass: "text-[11px] sm:text-xs",
  },
  {
    // Small center-left bubble
    label: "Logo",
    x: 32,
    y: 47,
    size: 48,
    isAccent: false,
    fontSizeClass: "text-[10px]",
  },
  {
    // Small lower-right bubble
    label: "Logo",
    x: 62,
    y: 67,
    size: 48,
    isAccent: false,
    fontSizeClass: "text-[10px]",
  },
  {
    // ACCENT NEON YELLOW BUBBLE (Center / slightly lower-center)
    label: "Logo",
    x: 47,
    y: 62,
    size: 60,
    isAccent: true,
    fontSizeClass: "text-xs font-medium",
  },
];

/**
 * "Hiring Partners" — Concentric circular logo cluster with floating bubbles
 * and "Get hired by reputed enterprises, across India & abroad" heading,
 * transitioning smoothly from blue down to white.
 */
export default function HiringPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bubbleRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(headingRef.current, { opacity: 0, y: 28 });
      gsap.set(clusterRef.current, { opacity: 0, scale: 0.92 });
      gsap.set(bubbleRefs.current, { opacity: 0, scale: 0.4 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.to(clusterRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power2.out",
      })
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .to(
          bubbleRefs.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: { each: 0.07, from: "center" },
            ease: "back.out(1.6)",
          },
          "-=0.5",
        );

      // Perpetual subtle float animation on each bubble
      bubbleRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: i % 2 === 0 ? -8 : 8,
          x: i % 3 === 0 ? 5 : -5,
          duration: 3 + (i % 4) * 0.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.15,
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-nav-section="Hiring Partners"
      data-nav-theme="light"
      className="relative -mt-px z-10 flex w-full flex-col justify-center overflow-hidden px-6 py-20 text-[#101010] sm:px-10 lg:py-28 lg:pl-36 lg:pr-16"
      style={{
        background:
          "linear-gradient(180deg, #1f5be0 0%, #4a88f4 16%, #9fc3fa 34%, #e5efff 54%, #ffffff 74%, #ffffff 100%)",
      }}
    >
      {/* Background Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
        {/* ---------- LEFT: CONCENTRIC CIRCULAR LOGO CLUSTER ---------- */}
        <div className="flex justify-center lg:col-span-7">
          <div
            ref={clusterRef}
            className="relative aspect-square w-[min(410px,82vw)] rounded-full border border-black/15 bg-white/10 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.06)] backdrop-blur-[2px]"
          >
            {/* Inner concentric ring */}
            <div className="pointer-events-none absolute inset-2.5 rounded-full border border-black/10 sm:inset-3" />

            {/* Floating Logo Bubbles */}
            {BUBBLES.map((bubble, i) => (
              <div
                key={`bubble-${i}`}
                ref={(el) => {
                  bubbleRefs.current[i] = el;
                }}
                className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 ${
                  bubble.isAccent
                    ? "bg-[#e7ff3d] text-[#0a0b0f] shadow-[0_3px_18px_rgba(231,255,61,0.5)]"
                    : "bg-[#d9d9d9] text-black/85 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.22)]"
                }`}
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `clamp(${Math.round(bubble.size * 0.72)}px, ${(bubble.size / 4.1).toFixed(1)}vw, ${bubble.size}px)`,
                  height: `clamp(${Math.round(bubble.size * 0.72)}px, ${(bubble.size / 4.1).toFixed(1)}vw, ${bubble.size}px)`,
                }}
              >
                <span
                  className={`font-serif leading-none tracking-tight text-[clamp(11px,2vw,14px)] ${bubble.fontSizeClass}`}
                >
                  {bubble.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- RIGHT: HEADLINE ---------- */}
        <div className="text-center lg:col-span-5 lg:text-left">
          <h2
            ref={headingRef}
            className="font-serif text-[clamp(1.85rem,2.6vw,2.9rem)] font-normal leading-[1.22] text-[#111827]"
          >
            <span className="italic text-[#2563eb]">Get hired</span> by reputed
            <br />
            enterprises, across
            <br />
            India &amp; abroad
          </h2>
        </div>
      </div>
    </section>
  );
}
