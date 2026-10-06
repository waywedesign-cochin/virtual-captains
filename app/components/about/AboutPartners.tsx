"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useHeadingZoom } from "./useHeadingZoom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Partner {
  id: string;
  name: string;
  logoSrc: string;
  width: number;
  height: number;
}

const PARTNERS: Partner[] = [
  {
    id: "jsr",
    name: "JSR",
    logoSrc: "/partners/JSR.png",
    width: 140,
    height: 40,
  },
  {
    id: "skylark",
    name: "Skylark",
    logoSrc: "/partners/SKYLARK.png",
    width: 140,
    height: 40,
  },
  {
    id: "ahad",
    name: "AHAD",
    logoSrc: "/partners/AHAD.png",
    width: 130,
    height: 38,
  },
  {
    id: "moonhive",
    name: "MoonHive",
    logoSrc: "/partners/MOONHIV.png",
    width: 140,
    height: 40,
  },
  {
    id: "unifirm",
    name: "Unifirm",
    logoSrc: "/partners/UNIFIRM.png",
    width: 135,
    height: 38,
  },  {
    id: "bbc",
    name: "Bangalore Bioinnovation Centre",
    logoSrc: "/partners/bbc-logo.png",
    width: 120,
    height: 48,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   TickerRow – one horizontal marquee row.
   direction : "left" | "right"
   rowOpacity : overall dim level (top/bottom rows use 0.35, middle uses 1)
   spotlight  : if true a CSS mask-image creates a centre "light zone" so any
                card that passes through the middle naturally brightens — no
                single static card is pinned as the hero.
   ───────────────────────────────────────────────────────────────────────────── */
function TickerRow({
  items,
  direction = "left",
  speed = 24,
  rowOpacity = 1,
  spotlight = false,
}: {
  items: Partner[];
  direction?: "left" | "right";
  speed?: number;
  rowOpacity?: number;
  spotlight?: boolean;
}) {
  const looped = [...items, ...items, ...items, ...items];
  const uk = `${direction}-${speed}`;

  // CSS mask: edges fully transparent → centre 40% fully opaque
  // Only applied to the featured middle row so cards "emerge" through a window
  const spotlightMask = spotlight
    ? "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.9) 22%, black 38%, black 62%, rgba(0,0,0,0.9) 78%, transparent 100%)"
    : undefined;

  return (
    <>
      <style>{`
        @keyframes vcTkL-${uk} { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes vcTkR-${uk} { 0% { transform:translateX(-50%); } 100% { transform:translateX(0); } }
        .vc-tk-${uk} { animation: ${direction === "left" ? `vcTkL-${uk}` : `vcTkR-${uk}`} ${speed}s linear infinite; }
      `}</style>

      <div
        className="relative overflow-hidden w-full"
        style={{
          opacity: rowOpacity,
          WebkitMaskImage: spotlightMask,
          maskImage: spotlightMask,
        }}
      >
        {/* Left edge fade (used for non-spotlight rows) */}
        {!spotlight && (
          <>
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10"
              style={{ background: "linear-gradient(to right, #020B25 10%, transparent)" }} />
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
              style={{ background: "linear-gradient(to left, #020B25 10%, transparent)" }} />
          </>
        )}

        <div className={`vc-tk-${uk} flex gap-6 w-max will-change-transform py-1.5`}>
          {looped.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="relative shrink-0 h-20 w-40 rounded-xl
                bg-linear-to-b from-white/10 via-white/5 to-white/2 backdrop-blur-xl
                border border-white/12
                flex items-center justify-center px-4 overflow-hidden
                shadow-[0_6px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]"
            >
              <Image
                src={p.logoSrc} alt={p.name}
                width={p.width} height={p.height}
                className="max-h-11 max-w-full w-auto object-contain brightness-0 invert opacity-90 pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


export default function AboutPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const tickerRef  = useRef<HTMLDivElement>(null);
  useHeadingZoom(headingRef);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading has its own zoom entrance (useHeadingZoom) — fade the rest
      const targets = [textRef.current, tickerRef.current].filter(
        (el): el is HTMLHeadingElement | HTMLDivElement => el !== null
      );
      if (targets.length === 0) return;

      gsap.set(targets, { opacity: 0, y: 28 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const activeTargets = [textRef.current, tickerRef.current].filter(
            (el): el is HTMLHeadingElement | HTMLDivElement => el !== null
          );
          if (activeTargets.length > 0) {
            gsap.to(activeTargets, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.15,
              ease: "power3.out",
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
      aria-label="Partner Network"
      className="relative w-full overflow-hidden py-12 sm:py-16 lg:py-24 select-none"
    >

      <div className="w-full max-w-372 mx-auto px-4 sm:px-6 md:px-8 xl:px-12 relative z-10">

        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-14 xl:mb-16">
          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-normal tracking-tight text-white font-sans will-change-transform"
          >
            Partner Network
          </h2>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 xl:gap-12 items-center">

          {/* Left: description copy */}
          <div
            ref={textRef}
            className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left max-w-xl mx-auto lg:mx-0 w-full will-change-transform"
          >
            <p className="text-sm sm:text-[15px] xl:text-base text-slate-200 font-sans leading-relaxed text-justify hyphens-auto [text-align-last:center] lg:[text-align-last:left]">
              Virtual Captains partners with multinationals and SMEs across
              Asia, the Middle East, Europe and North America. We act as an
              extension of their brand, a trusted spoke in their growth model,
              building partner ecosystems and driving sales execution in every
              market they enter.
            </p>
            <p className="text-sm sm:text-[15px] xl:text-base mt-4 sm:mt-6 lg:mt-4 xl:mt-7 text-slate-300/90 font-sans leading-relaxed text-justify hyphens-auto [text-align-last:center] lg:[text-align-last:left]">
              From identifying and onboarding the right channel partners to
              enabling their sales teams and managing performance on the
              ground, we make sure each market grows with the same standard as
              the brand&apos;s home base. With local market insight and
              practitioner-led execution, we help organisations expand across
              borders with confidence and turn new markets into lasting revenue.
            </p>
          </div>

          {/* Right: 3 stacked ticker rows */}
          <div
            ref={tickerRef}
            className="lg:col-span-7 flex flex-col gap-3 will-change-transform overflow-hidden"
          >
            {/* Row 1 – left, dimmed */}
            <TickerRow items={PARTNERS} direction="left" speed={22} rowOpacity={0.35} />
            {/* Row 2 – right, full brightness + spotlight mask (featured) */}
            <TickerRow items={[...PARTNERS].reverse()} direction="right" speed={28} rowOpacity={1} spotlight />
            {/* Row 3 – left, dimmed */}
            <TickerRow items={PARTNERS} direction="left" speed={20} rowOpacity={0.35} />
          </div>

        </div>
      </div>
    </section>
  );
}
