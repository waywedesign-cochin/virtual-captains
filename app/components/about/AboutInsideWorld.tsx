"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useScroll } from "motion/react";
import gsap from "gsap";

interface Pillar {
  id: string;
  title: string;
  tag: string;
  description: string;
}

const PILLARS: Pillar[] = [
  {
    id: "vision",
    title: "Vision",
    tag: "Demo text",
    description:
      "At Virtual Captains, we believe great sales are built on more than scripts and techniques. They are built on clarity, strategy, confidence, and the right human approach",
  },
  {
    id: "mission",
    title: "Mission",
    tag: "Demo text",
    description:
      "To equip modern revenue teams and aspiring sales leaders with hyper-realistic AI simulations, real-world execution muscle memory, and high-velocity deal closing capabilities.",
  },
  {
    id: "values",
    title: "Values",
    tag: "Demo text",
    description:
      "Relentless execution, authentic communication, behavioral science, and measurable business growth over vanity metrics and theoretical checklists.",
  },
  {
    id: "approach",
    title: "Approach",
    tag: "Demo text",
    description:
      "Transforming complex sales challenges into clear, actionable opportunities through industry-driven frameworks, real-time telemetry, and human coaching.",
  },
];

export default function AboutInsideWorld() {
  const containerRef = useRef<HTMLElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  // In-place rotating wheel refs
  const arcDashRef = useRef<SVGPathElement>(null);
  const apexDotRef = useRef<SVGGElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollFraction, setScrollFraction] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const numItems = PILLARS.length;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Pinned scroll progress tracker across the entire section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track scroll progress and drive active pillar based on pinned scroll depth
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest: number) => {
      const clamped = Math.max(0, Math.min(0.9999, latest));
      setScrollFraction(clamped);

      // 4 discrete segments corresponding to the 4 pillars
      const newIndex = Math.min(numItems - 1, Math.floor(clamped * numItems));
      setActiveIndex(newIndex);
    });

    return () => unsubscribe();
  }, [scrollYProgress, numItems]);

  // Animate the card content, shimmer, and apex dot when activeIndex changes
  useEffect(() => {
    if (!isMounted) return;

    if (cardContentRef.current) {
      gsap.fromTo(
        cardContentRef.current,
        { opacity: 0.25, y: 10, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: "power2.out" }
      );
    }

    if (shimmerRef.current) {
      gsap.fromTo(
        shimmerRef.current,
        { xPercent: -100, opacity: 0.7 },
        { xPercent: 200, opacity: 0, duration: 0.65, ease: "power2.inOut" }
      );
    }

    if (apexDotRef.current) {
      gsap.fromTo(
        apexDotRef.current,
        { scale: 0.65, transformOrigin: "27.05px 230px" },
        { scale: 1, duration: 0.45, ease: "back.out(2)" }
      );
    }
  }, [activeIndex, isMounted]);

  // Smooth click navigation to jump scroll position to any pillar
  const scrollToPillar = useCallback(
    (index: number) => {
      if (!containerRef.current || typeof window === "undefined") return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const containerTop = currentScrollY + rect.top;
      const scrollableDistance =
        containerRef.current.offsetHeight - window.innerHeight;
      const targetFraction = (index + 0.45) / numItems;
      const targetScroll = containerTop + targetFraction * scrollableDistance;

      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    },
    [numItems]
  );

  const activePillar = PILLARS[activeIndex];

  // Calculate the continuous fill progress of the active pill [0.0 -> 1.0]
  const segmentProgress = (() => {
    const raw = (scrollFraction * numItems) % 1;
    return Math.max(0, Math.min(1, raw));
  })();

  // Arc strokeDashoffset scrolls continuously with pinned progress
  const beamDashoffset = -420 * scrollFraction * 4;

  return (
    <section
      ref={containerRef}
      id="inside-our-world-section"
      role="region"
      aria-label="Inside Our World Pinned Scroll Experience"
      className="relative w-full h-[280vh] bg-[#020B25]"
    >
      {/* ── STICKY VIEWPORT STAGE (Locks on screen while scrolling through the 4 pillars) ── */}
      <div
        id="inside-world-sticky-stage"
        style={{ position: "sticky", top: 0, height: "100vh", width: "100%" }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#020B25] select-none"
      >
        {/* Ambient Cosmic Background Nebula */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-radial from-[#0e3085]/35 via-[#061845]/20 to-transparent blur-[150px] pointer-events-none -z-10" />

        {/* Outer Max-Width Container */}
        <div className="w-full max-w-372 mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 xl:gap-12 2xl:gap-14 items-center">
            
            {/* ── LEFT COLUMN: Narrative & Stage Progress ── */}
            <div className="lg:col-span-5 xl:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left pr-0 lg:pr-4 xl:pr-6 max-w-xl mx-auto lg:mx-0 w-full">
              {/* Section Kicker Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 mb-4 shadow-[0_0_16px_rgba(229,255,0,0.12)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e5ff00] animate-pulse shadow-[0_0_6px_#e5ff00]" />
                <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#e5ff00]">
                  Core Foundations
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-[2.6rem] lg:text-[2.5rem] xl:text-[3.25rem] 2xl:text-6xl font-normal tracking-tight text-white font-sans leading-[1.14] text-center lg:text-left">
                Inside Our World
              </h2>

              {/* Paragraph 1 with Italic Lime "Demo text" */}
              <p className="mt-3 sm:mt-5 lg:mt-4 xl:mt-6 text-xs sm:text-sm lg:text-[13.5px] xl:text-base text-slate-200 font-sans leading-relaxed text-center lg:text-left">
                <span className="text-[#e5ff00] italic font-medium mr-1.5 select-none drop-shadow-[0_0_12px_rgba(229,255,0,0.35)]">
                  Demo text
                </span>
                At Virtual Captains, we believe great sales are built on more than
                scripts and techniques. They are built on clarity, strategy,
                confidence, and the right human approach.
              </p>

              {/* Paragraph 2 - Desktop & Tablet */}
              <p className="hidden sm:block mt-2.5 sm:mt-4 lg:mt-3 xl:mt-5 text-xs sm:text-sm lg:text-[13.5px] xl:text-base text-slate-300/90 font-sans leading-relaxed text-center lg:text-left">
                We are a team of Sales Strategists and Trainers dedicated to
                helping businesses build stronger sales teams and create
                meaningful, measurable growth. Through industry-driven insights,
                practical strategies, and virtual training validated by real
                human expertise, we transform complex sales challenges into clear,
                actionable opportunities.
              </p>

            </div>

            {/* ── RIGHT COLUMN: Liquid Glass Card + Scroll-Driven Arc Wheel ── */}
            <div className="lg:col-span-7 xl:col-span-6 relative flex flex-col items-center lg:items-end xl:items-start justify-center w-full">
              <div className="relative flex items-center justify-center lg:justify-end xl:justify-start gap-3 sm:gap-4 md:gap-5 lg:gap-4 xl:gap-7 w-full max-w-xl lg:max-w-none">
                
                {/* ── The Liquid Glass Card ── */}
                <div className="relative z-10 w-full sm:w-[340px] md:w-[360px] lg:w-[330px] xl:w-[390px] 2xl:w-[430px] shrink-0 rounded-[24px] sm:rounded-[28px] p-[1.5px] bg-gradient-to-br from-indigo-500/40 via-blue-500/20 to-purple-500/40 shadow-[0_16px_45px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] overflow-hidden">
                  {/* Specular Shimmer Beam */}
                  <div
                    ref={shimmerRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-y-full w-28 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 blur-xs -translate-x-full"
                  />

                  <div className="rounded-[22.5px] sm:rounded-[26.5px] bg-[#030d2d]/90 border border-white/10 p-5 sm:p-7 lg:p-6 xl:p-8 2xl:p-9 min-h-[210px] sm:min-h-[240px] lg:min-h-[230px] xl:min-h-[250px] flex flex-col justify-between backdrop-blur-2xl text-center lg:text-left">
                    <div ref={cardContentRef} className="will-change-transform">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-bold tracking-tight text-white font-sans text-center lg:text-left">
                          {activePillar.title}
                        </h3>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#8fd0ff] border border-[#8fd0ff]/30 rounded-md px-2 py-0.5">
                          0{activeIndex + 1}
                        </span>
                      </div>

                      <p className="mt-2.5 sm:mt-4 lg:mt-3.5 xl:mt-5 text-xs sm:text-[13.5px] lg:text-[13px] xl:text-[14.5px] text-slate-200 leading-relaxed font-sans text-center lg:text-left">
                        <span className="text-[#e5ff00] italic font-medium mr-1.5 select-none drop-shadow-[0_0_10px_rgba(229,255,0,0.3)]">
                          {activePillar.tag}
                        </span>
                        {activePillar.description}
                      </p>
                    </div>

                    {/* ── Continuous Scroll-Progress Pill Trackers ── */}
                    <div className="mt-5 sm:mt-6 flex items-center justify-center lg:justify-start gap-2 pt-2">
                      {PILLARS.map((p, idx) => {
                        const isPast = idx < activeIndex;
                        const isCurrent = idx === activeIndex;
                        const fillWidth = isPast
                          ? 100
                          : isCurrent
                          ? Math.round(segmentProgress * 100)
                          : 0;

                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => scrollToPillar(idx)}
                            aria-label={`Jump to ${p.title}`}
                            className={`h-2 rounded-full relative overflow-hidden transition-all duration-200 cursor-pointer ${
                              isCurrent
                                ? "w-10 bg-white/15 ring-1 ring-[#e5ff00]/40"
                                : "w-3 bg-white/20 hover:bg-white/40"
                            }`}
                          >
                            <span
                              style={{ width: `${fillWidth}%` }}
                              className="absolute inset-y-0 left-0 bg-[#e5ff00] rounded-full transition-all duration-100 shadow-[0_0_8px_#e5ff00]"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── Exact Arc with Locked Apex Dot & Scroll-Driven Energy Beam ── */}
                <div className="hidden sm:block shrink-0 relative w-[90px] sm:w-[110px] md:w-[125px] lg:w-[105px] xl:w-[145px] 2xl:w-[175px] h-[320px] sm:h-[360px] md:h-[390px] lg:h-[350px] xl:h-[410px] 2xl:h-[450px] select-none pointer-events-none">
                  <svg
                    viewBox="0 0 200 460"
                    className="w-full h-full overflow-visible"
                    aria-hidden="true"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="curveArcGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                        <stop offset="25%" stopColor="rgba(255,255,255,0.35)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.75)" />
                        <stop offset="75%" stopColor="rgba(255,255,255,0.35)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
                      </linearGradient>

                      <linearGradient id="curveBeamGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.95)" />
                        <stop offset="100%" stopColor="rgba(229,255,0,0.85)" />
                      </linearGradient>

                      <filter id="beamDropGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* 1. Base Arc Line */}
                    <path
                      d="M 175,25 A 216,216 0 0,0 175,435"
                      fill="none"
                      stroke="url(#curveArcGlow)"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />

                    {/* 2. Scroll-Driven Sleek Energy Beam Sweep along the curve */}
                    <path
                      ref={arcDashRef}
                      d="M 175,25 A 216,216 0 0,0 175,435"
                      fill="none"
                      stroke="url(#curveBeamGlow)"
                      strokeWidth="2.5"
                      strokeDasharray="90 330"
                      strokeLinecap="round"
                      filter="url(#beamDropGlow)"
                      style={{ strokeDashoffset: beamDashoffset }}
                      className="will-change-transform"
                    />

                    {/* 3. Apex Dot Locked Accurately in the Middle of the Curve Line */}
                    <g ref={apexDotRef} className="will-change-transform">
                      {/* Outer Ambient Glow */}
                      <circle
                        cx="27.05"
                        cy="230"
                        r="9"
                        fill="rgba(229,255,0,0.22)"
                        filter="url(#beamDropGlow)"
                        className="animate-pulse"
                      />
                      {/* Outer Dark Ring with Lime Border */}
                      <circle
                        cx="27.05"
                        cy="230"
                        r="5.5"
                        fill="#020B25"
                        stroke="#e5ff00"
                        strokeWidth="1.75"
                      />
                      {/* Luminous Center Dot */}
                      <circle
                        cx="27.05"
                        cy="230"
                        r="3"
                        fill="#e5ff00"
                      />
                      {/* Inner High-Intensity Spark */}
                      <circle
                        cx="27.05"
                        cy="230"
                        r="1.25"
                        fill="#ffffff"
                      />
                    </g>
                  </svg>
                </div>

              </div>

              {/* ── MOBILE CONTROLLER: Interactive progress pills for mobile screens ── */}
              <div className="sm:hidden flex items-center justify-center gap-2 mt-4 w-full">
                {PILLARS.map((pillar, idx) => {
                  const isCurrent = idx === activeIndex;
                  const isPast = idx < activeIndex;
                  const fillWidth = isPast
                    ? 100
                    : isCurrent
                    ? Math.round(segmentProgress * 100)
                    : 0;

                  return (
                    <button
                      key={`m-${pillar.id}`}
                      onClick={() => scrollToPillar(idx)}
                      className={`h-2.5 rounded-full relative overflow-hidden transition-all duration-200 ${
                        isCurrent
                          ? "w-10 bg-white/15 ring-1 ring-[#e5ff00]/50"
                          : "w-3 bg-white/25 hover:bg-white/40"
                      }`}
                      aria-label={`Select ${pillar.title}`}
                    >
                      <span
                        style={{ width: `${fillWidth}%` }}
                        className="absolute inset-y-0 left-0 bg-[#e5ff00] rounded-full transition-all duration-100 shadow-[0_0_6px_#e5ff00]"
                      />
                    </button>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
