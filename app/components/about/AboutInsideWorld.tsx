"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useScroll } from "motion/react";
import gsap from "gsap";
import { useHeadingZoom } from "./useHeadingZoom";

// Phones/tablets, and screens too short for the sticky stage (rotated
// phones): the section renders as a normal block — no scroll-locking, even
// section spacing — and the arrows / pills switch pillars instead.
const STATIC_QUERY = "(max-width: 1023px), (max-height: 479px)";

interface Pillar {
  id: string;
  title: string;
  /** Gradient headline shown above the description */
  tag: string;
  /** A paragraph, or short "label: text" points rendered as a list */
  description: string | { label: string; text: string }[];
  /** Optional smaller supporting line under the description */
  footnote?: string;
}

const PILLARS: Pillar[] = [
  {
    id: "vision",
    title: "Vision",
    tag: "A World Where Everyone Can Sell with Confidence.",
    description:
      "To make sales a core capability, not just a job title, for every professional, founder and organisation we work with.",
    footnote:
      "A future where every pitch is practised, every conversation is prepared for and every deal is earned.",
  },
  {
    id: "mission",
    title: "Mission",
    tag: "Turning Sales Uncertainty into Sales Readiness.",
    description:
      "To equip teams and individuals with real-world practice, practitioner insight and execution support that turn potential into predictable revenue.",
  },
  {
    id: "values",
    title: "Values",
    tag: "What We Stand For.",
    description: [
      { label: "Practice over Theory", text: "we learn by doing." },
      { label: "Clarity over Complexity", text: "simple methods that work." },
      {
        label: "Human at the Core",
        text: "technology supports judgement; it doesn't replace it.",
      },
      { label: "Accountable to Results", text: "we measure what matters." },
    ],
  },
  {
    id: "approach",
    title: "Approach",
    tag: "Practise Like It's Real. Perform When It Counts.",
    description:
      "Virtual Captains is your end-to-end sales partner. We diagnose the gaps, design the playbooks and stay on the ground to drive revenue alongside your team. Our practitioners have built teams and carried real targets, and they guide every engagement. SalesX adds AI-powered practice, with experienced practitioners evaluating the results. Every engagement is measured by one thing: growth in your pipeline and revenue.",
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
  const [isStatic, setIsStatic] = useState(false);
  const isStaticRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingZoom(headingRef);

  const numItems = PILLARS.length;

  useEffect(() => {
    setIsMounted(true);
    const mq = window.matchMedia(STATIC_QUERY);
    const sync = () => {
      isStaticRef.current = mq.matches;
      setIsStatic(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Pinned scroll progress tracker across the entire section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track scroll progress and drive active pillar based on pinned scroll depth
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest: number) => {
      if (isStaticRef.current) return;
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
      setActiveIndex(index);
      if (isStaticRef.current) return;
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

  const handlePrev = useCallback(() => {
    const prevIdx = (activeIndex - 1 + numItems) % numItems;
    scrollToPillar(prevIdx);
  }, [activeIndex, numItems, scrollToPillar]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % numItems;
    scrollToPillar(nextIdx);
  }, [activeIndex, numItems, scrollToPillar]);

  // Calculate the continuous fill progress of the active pill [0.0 -> 1.0]
  const segmentProgress = (() => {
    if (isStatic) return 1;
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
      className="relative w-full h-[280vh] [@media(max-width:1023px)]:h-auto [@media(max-height:479px)]:h-auto"
    >
      {/* ── STICKY VIEWPORT STAGE (Locks on screen while scrolling through the 4 pillars) ── */}
      <div
        id="inside-world-sticky-stage"
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center select-none pt-20 pb-4 [@media(max-width:1023px)]:static [@media(max-width:1023px)]:h-auto [@media(max-width:1023px)]:py-12 sm:[@media(max-width:1023px)]:py-16 [@media(max-height:479px)]:static [@media(max-height:479px)]:h-auto [@media(max-height:479px)]:py-16"
      >


        {/* Outer Max-Width Container */}
        <div className="w-full max-w-372 mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 xl:gap-12 2xl:gap-14 items-center">
            
            {/* ── LEFT COLUMN: Narrative & Stage Progress ── */}
            <div className="lg:col-span-5 xl:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left pr-0 lg:pr-4 xl:pr-6 max-w-xl mx-auto lg:mx-0 w-full">
              {/* Section Kicker Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 mb-4 [@media(max-height:700px)]:mb-2 shadow-[0_0_16px_rgba(243,252,0,0.12)]">
                <span className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-[#D08817] to-[#F3FC00] animate-pulse shadow-[0_0_6px_#F3FC00]" />
                <span className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.2em] bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent">
                  Core Foundations
                </span>
              </div>

              <h2 ref={headingRef} className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-normal tracking-tight text-white font-sans leading-[1.14] text-center lg:text-left">
                Inside Our World
              </h2>

              {/* Tagline */}
              <p className="mt-3 sm:mt-5 lg:mt-4 xl:mt-6 [@media(max-height:700px)]:mt-2 font-sans font-medium italic text-base sm:text-lg xl:text-xl bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(243,252,0,0.35)] text-center lg:text-left">
                &ldquo;More Than Scripts. More Than Techniques.&rdquo;
              </p>

              <p className="text-sm sm:text-[15px] xl:text-base mt-2.5 sm:mt-4 lg:mt-3 xl:mt-5 [@media(max-height:700px)]:mt-2 [@media(max-height:700px)]:leading-normal text-slate-200 font-sans leading-relaxed text-justify hyphens-auto [text-align-last:center] lg:[text-align-last:left]">
                Virtual Captains is a sales execution company headquartered in
                India with a presence across the Middle East, Europe and Asia. We
                believe great sales come from clarity, strategy, confidence and
                the right human approach, not memorised scripts.
              </p>

              <p className="text-sm sm:text-[15px] xl:text-base mt-2.5 sm:mt-4 lg:mt-3 xl:mt-5 [@media(max-height:700px)]:mt-2 [@media(max-height:700px)]:leading-normal text-slate-300/90 font-sans leading-relaxed text-justify hyphens-auto [text-align-last:center] lg:[text-align-last:left]">
                Our team of sales strategists and practitioners works alongside
                organisations to onboard talent, diagnose sales gaps, build
                pipeline and sharpen teams. We combine AI-powered practice with
                evaluation by experienced practitioners, so that complex sales
                challenges become clear, measurable growth.
              </p>

            </div>

            {/* ── RIGHT COLUMN: Liquid Glass Card + Scroll-Driven Arc Wheel ── */}
            <div className="lg:col-span-7 xl:col-span-6 relative flex flex-col items-center justify-center w-full">
              <div className="relative flex items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-4 xl:gap-7 w-full max-w-xl lg:max-w-none">
                
                {/* ── The Liquid Glass Card ── */}
                <div className="relative z-10 w-full sm:w-85 md:w-90 lg:w-100 xl:w-97.5 2xl:w-107.5 shrink-0 rounded-3xl sm:rounded-[28px] p-[1.5px] bg-linear-to-br from-indigo-500/40 via-blue-500/20 to-purple-500/40 shadow-[0_16px_45px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] overflow-hidden">
                  {/* Specular Shimmer Beam */}
                  <div
                    ref={shimmerRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-y-full w-28 bg-linear-to-r from-transparent via-white/25 to-transparent skew-x-12 blur-xs -translate-x-full"
                  />

                  <div className="rounded-[22.5px] sm:rounded-[26.5px] bg-[#030d2d]/90 border border-white/10 p-5 sm:p-7 lg:p-6 xl:p-8 2xl:p-9 [@media(max-height:700px)]:p-5 min-h-52.5 sm:min-h-60 lg:min-h-57.5 xl:min-h-62.5 flex flex-col justify-between backdrop-blur-2xl text-center lg:text-left">
                    {/* Every pillar is stacked in the same grid cell so the card
                        always takes the height of the tallest one — switching
                        pillars never resizes the card or shifts the layout. */}
                    <div className="grid">
                      {PILLARS.map((pillar, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                          <div
                            key={pillar.id}
                            ref={isActive ? cardContentRef : undefined}
                            aria-hidden={!isActive}
                            className={`col-start-1 row-start-1 will-change-transform ${
                              isActive ? "visible" : "invisible"
                            }`}
                          >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans text-center lg:text-left">
                              {pillar.title}
                            </h3>
                            <span className="font-sans text-[10px] uppercase tracking-wider text-[#8fd0ff] border border-[#8fd0ff]/30 rounded-md px-2 py-0.5">
                              0{idx + 1}
                            </span>
                          </div>

                          <p className="mt-2.5 sm:mt-4 lg:mt-3 xl:mt-4 font-sans font-medium italic text-sm sm:text-base leading-snug bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(243,252,0,0.3)] text-center lg:text-left">
                            {pillar.tag}
                          </p>
                          {typeof pillar.description === "string" ? (
                            <p className="text-[13px] sm:text-sm mt-2 sm:mt-3 [@media(max-height:700px)]:leading-normal text-slate-200 leading-relaxed font-sans text-justify hyphens-auto [text-align-last:center] lg:[text-align-last:left]">
                              {pillar.description}
                            </p>
                          ) : (
                            <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-[13px] sm:text-sm text-slate-200 leading-relaxed font-sans text-left">
                              {pillar.description.map((v) => (
                                <li key={v.label} className="flex gap-2">
                                  <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#F3FC00]" />
                                  <span>
                                    <span className="font-semibold text-white">{v.label}:</span>{" "}
                                    {v.text}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {pillar.footnote && (
                            <p className="mt-3 sm:mt-4 border-l-2 border-[#F3FC00]/40 pl-3 text-[11px] sm:text-xs italic leading-relaxed text-slate-400 font-sans text-left">
                              {pillar.footnote}
                            </p>
                          )}
                          </div>
                        );
                      })}
                    </div>

                    {/* ── Unified Carousel Navigation: Left/Right Arrow Buttons & Progress Pills ── */}
                    <div className="mt-5 sm:mt-6 flex items-center justify-between gap-2.5 pt-3 border-t border-white/10">
                      {/* Left / Prev Arrow Button */}
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous pillar"
                        className="group/btn relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 hover:border-[#F3FC00]/60 active:scale-90 transition-all duration-200 cursor-pointer text-slate-300 hover:text-[#F3FC00]"
                      >
                        <svg
                          className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>

                      {/* Continuous Scroll-Progress Pill Trackers */}
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
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
                              aria-current={isCurrent ? "step" : undefined}
                              // 24×24px hit area (WCAG 2.5.8); the visible pill stays 8px tall
                              className="group flex h-6 min-w-6 cursor-pointer items-center justify-center"
                            >
                              <span
                                className={`relative block h-2 overflow-hidden rounded-full transition-all duration-200 ${
                                  isCurrent
                                    ? "w-8 sm:w-10 bg-white/15 ring-1 ring-[#F3FC00]/40"
                                    : "w-2.5 sm:w-3 bg-white/20 group-hover:bg-white/40"
                                }`}
                              >
                                <span
                                  style={{ width: `${fillWidth}%` }}
                                  className="absolute inset-y-0 left-0 bg-linear-to-r from-[#D08817] to-[#F3FC00] rounded-full transition-all duration-100 shadow-[0_0_8px_#F3FC00]"
                                />
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Right / Next Arrow Button */}
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next pillar"
                        className="group/btn relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 hover:border-[#F3FC00]/60 active:scale-90 transition-all duration-200 cursor-pointer text-slate-300 hover:text-[#F3FC00]"
                      >
                        <svg
                          className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Exact Arc with Locked Apex Dot & Scroll-Driven Energy Beam ── */}
                <div className="hidden lg:block [@media(max-height:500px)]:hidden shrink-0 relative w-22.5 sm:w-27.5 md:w-31.25 lg:w-26.25 xl:w-36.25 2xl:w-43.75 h-80 sm:h-90 md:h-97.5 lg:h-87.5 xl:h-102.5 2xl:h-112.5 select-none pointer-events-none">
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
                        <stop offset="100%" stopColor="rgba(243,252,0,0.85)" />
                      </linearGradient>

                      <linearGradient id="apexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D08817" />
                        <stop offset="100%" stopColor="#F3FC00" />
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
                        fill="rgba(243,252,0,0.22)"
                        filter="url(#beamDropGlow)"
                        className="animate-pulse"
                      />
                      {/* Outer Dark Ring with Gradient Border */}
                      <circle
                        cx="27.05"
                        cy="230"
                        r="5.5"
                        fill="#020B25"
                        stroke="url(#apexGrad)"
                        strokeWidth="1.75"
                      />
                      {/* Luminous Center Dot */}
                      <circle
                        cx="27.05"
                        cy="230"
                        r="3"
                        fill="url(#apexGrad)"
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


            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
