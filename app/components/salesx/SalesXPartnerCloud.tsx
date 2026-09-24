"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PartnerItem {
  id: string;
  name: string;
  logoSrc: string;
  filterClass?: string;
  imgClass?: string;
  // Symmetrical pixel offsets relative to exact center (0, 0)
  offsetX: number;
  offsetY: number;
}

// 5 Authentic Partner Cards arranged symmetrically around the center title with high visibility
const partners: PartnerItem[] = [
  // ── TOP TRIO (Y = -165px to -195px) ──
  {
    id: "p-ahad",
    name: "AHAD",
    logoSrc: "/partners/AHAD.png",
    filterClass: "brightness-0 invert opacity-95 group-hover:opacity-100",
    imgClass: "h-8 sm:h-10 w-auto max-w-[145px] sm:max-w-[170px]",
    offsetX: -390,
    offsetY: -165,
  },
  {
    id: "p-jsr",
    name: "JSR",
    logoSrc: "/partners/JSR.png",
    filterClass: "brightness-0 invert opacity-95 group-hover:opacity-100",
    imgClass: "h-8 sm:h-14 w-auto max-w-[145px] sm:max-w-[170px] py-2",
    offsetX: 0,
    offsetY: -195,
  },
  {
    id: "p-skylark",
    name: "Skylark",
    logoSrc: "/partners/SKYLARK.png",
    filterClass: "brightness-0 invert opacity-95 group-hover:opacity-100",
    imgClass: "h-8 sm:h-14 w-auto max-w-[145px] sm:max-w-[170px] py-2",
    offsetX: 390,
    offsetY: -165,
  },

  // ── BOTTOM PAIR (Y = +175px) ──
  {
    id: "p-moonhive",
    name: "MoonHive",
    logoSrc: "/partners/MOONHIV.png",
    filterClass: "brightness-0 invert opacity-95 group-hover:opacity-100",
    imgClass: "h-8 sm:h-14 w-auto max-w-[145px] sm:max-w-[170px] py-2",
    offsetX: -270,
    offsetY: 175,
  },
  {
    id: "p-unifirm",
    name: "Unifirm",
    logoSrc: "/partners/UNIFIRM.png",
    filterClass: "brightness-0 invert opacity-95 group-hover:opacity-100",
    imgClass: "h-8 sm:h-14 w-auto max-w-[145px] sm:max-w-[180px] py-2",
    offsetX: 270,
    offsetY: 175,
  },
];

// Helper to render crisp, authentic brand logos with high luminescence
function PartnerBadgeContent({ p }: { p: PartnerItem }) {
  return (
    <div className="flex items-center justify-center w-full h-full px-3 py-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.logoSrc}
        alt={p.name}
        className={`${p.imgClass || "h-16 sm:h-24 w-auto"} ${p.filterClass || "brightness-0 invert opacity-95"} object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:drop-shadow-[0_0_14px_rgba(56,189,248,0.85)]`}
        loading="lazy"
      />
    </div>
  );
}

export default function SalesXPartnerCloud() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const desktopHeadingRef = useRef<HTMLHeadingElement>(null);
  const mobileHeadingRef = useRef<HTMLHeadingElement>(null);
  const desktopCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [stageScale, setStageScale] = useState(1);

  // Dynamically calculate responsive scale so systematic geometry stays intact
  useEffect(() => {
    const handleResize = () => {
      if (!stageRef.current) return;
      const w = stageRef.current.offsetWidth;
      if (w < 1140 && w >= 768) {
        setStageScale(Math.max(0.72, w / 1140));
      } else {
        setStageScale(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const desktopCards = desktopCardsRef.current.filter(
      Boolean,
    ) as HTMLDivElement[];
    const mobileCards = mobileCardsRef.current.filter(
      Boolean,
    ) as HTMLDivElement[];

    // 0. Initial Headings State: Signature spring reveal
    if (desktopHeadingRef.current) {
      gsap.set(desktopHeadingRef.current, {
        opacity: 0,
        scale: 0.65,
        y: 20,
        transformOrigin: "center center",
        force3D: true,
      });
    }
    if (mobileHeadingRef.current) {
      gsap.set(mobileHeadingRef.current, {
        opacity: 0,
        scale: 0.65,
        y: 20,
        transformOrigin: "center center",
        force3D: true,
      });
    }

    // 1. Initial Hidden State: Center text is visible; cards start hidden behind center
    desktopCards.forEach((card, idx) => {
      const p = partners[idx];
      // Offset originating from near center behind the title
      const startX = -p.offsetX * 0.8;
      const startY = -p.offsetY * 0.8;

      gsap.set(card, {
        opacity: 0,
        scale: 0.15,
        x: startX,
        y: startY,
        force3D: true,
      });
    });

    if (mobileCards.length > 0) {
      gsap.set(mobileCards, {
        opacity: 0,
        y: 20,
        scale: 0.92,
      });
    }

    // 2. Viewport Entrance Trigger
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 72%",
        once: true,
        onEnter: () => {
          // Headings signature jumping zoom-in reveal
          const headings = [desktopHeadingRef.current, mobileHeadingRef.current].filter(Boolean);
          if (headings.length > 0) {
            gsap.to(headings, {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "none",
              force3D: true,
              keyframes: [
                { scale: 1.15, opacity: 1, y: -4, duration: 0.42, ease: "power2.out" },
                { scale: 0.94, y: 2, duration: 0.22, ease: "sine.inOut" },
                { scale: 1.0, y: 0, duration: 0.21, ease: "power2.out" },
              ],
            });
          }

          // Desktop: Radial bloom outward to exact symmetrical coordinates
          if (desktopCards.length > 0) {
            gsap.to(desktopCards, {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              duration: 1.05,
              ease: "back.out(1.4)",
              stagger: {
                each: 0.045,
                from: "center", // Symmetrical explosion outward!
              },
              onComplete: () => {
                // Symmetrical zero-gravity floating oscillation
                desktopCards.forEach((card, i) => {
                  gsap.to(card, {
                    y: "+=5",
                    duration: 2.4 + (i % 3) * 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: (i % 4) * 0.15,
                  });
                });
              },
            });
          }

          // Mobile: Elegant slide up stagger
          if (mobileCards.length > 0) {
            gsap.to(mobileCards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: "power2.out",
              stagger: 0.04,
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label="SalesX Partner Network and Ecosystem"
      className="relative bg-[#030614] overflow-hidden py-24 sm:py-32 select-none"
    >
      {/* Central Blue Ambient Radial Glow matching reference image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] lg:w-[950px] h-[350px] sm:h-[450px] lg:h-[550px] bg-radial from-[#1e40af]/25 via-[#0a1740]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Subtle Starfield Dot Grid - Standardized Cosmic Grid Token */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(147, 197, 253, 0.35) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12">
        {/* ── DESKTOP & TABLET: MATHEMATICALLY BALANCED 2-3-2-3-2 CONSTELLATION ── */}
        <div
          ref={stageRef}
          className="hidden md:block relative w-full max-w-5xl xl:max-w-6xl mx-auto h-[620px] lg:h-[680px] xl:h-[720px]"
        >
          {/* Central Title & Subtitle (Absolute Dead Center) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center select-none pointer-events-none px-4 w-full max-w-2xl">
            <h2
              ref={desktopHeadingRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white font-sans drop-shadow-[0_0_35px_rgba(255,255,255,0.18)] whitespace-nowrap will-change-transform"
            >
              Partner Network
            </h2>
            <p className="mt-4 sm:mt-5 text-xs sm:text-sm lg:text-base text-slate-200 font-light tracking-[0.28em] uppercase font-sans">
              Grow Alongside SalesX
            </p>
          </div>

          {/* 12 Floating Partner Cards (Bilateral & Vertical Reflection Symmetry) */}
          <div className="absolute inset-0 pointer-events-none">
            {partners.map((p, idx) => {
              const xPos = p.offsetX * stageScale;
              const yPos = p.offsetY * stageScale;

              return (
                <div
                  key={p.id}
                  ref={(el) => {
                    desktopCardsRef.current[idx] = el;
                  }}
                  className="absolute pointer-events-auto cursor-pointer group will-change-transform"
                  style={{
                    left: `calc(50% + ${xPos}px)`,
                    top: `calc(50% + ${yPos}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="relative w-48 sm:w-56 h-15 sm:h-17 px-5 sm:px-6 rounded-2xl bg-linear-to-b from-white/[0.12] via-white/[0.06] to-white/[0.02] border border-white/25 hover:border-sky-400/90 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(56,189,248,0.45),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-108 hover:-translate-y-1 overflow-hidden">
                    {/* Ambient subtle backlight behind logo */}
                    <div className="absolute inset-0 bg-radial from-sky-400/15 via-transparent to-transparent opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none" />

                    <PartnerBadgeContent p={p} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE VIEW (Clean responsive systematically spaced grid) ── */}
        <div className="md:hidden flex flex-col items-center text-center">
          <h2
            ref={mobileHeadingRef}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans will-change-transform"
          >
            Partner Network
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 font-light tracking-[0.24em] uppercase font-sans">
            Grow Alongside SalesX
          </p>

          <div className="grid grid-cols-2 gap-3.5 mt-10 w-full max-w-sm sm:max-w-md">
            {partners.map((p, idx) => (
              <div
                key={`m-${p.id}`}
                ref={(el) => {
                  mobileCardsRef.current[idx] = el;
                }}
                className={`relative h-15 px-4 py-2 rounded-2xl bg-linear-to-b from-white/[0.12] via-white/[0.06] to-white/[0.02] border border-white/20 flex items-center justify-center shadow-lg overflow-hidden ${
                  idx === partners.length - 1 && partners.length % 2 === 1
                    ? "col-span-2 max-w-[220px] mx-auto w-full"
                    : ""
                }`}
              >
                <div className="absolute inset-0 bg-radial from-sky-400/10 via-transparent to-transparent pointer-events-none" />
                <PartnerBadgeContent p={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
