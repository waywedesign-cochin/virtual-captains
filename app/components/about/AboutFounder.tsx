"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const FOUNDER_IMAGE = "/about/founder.webp";

/* --------------------------------------------------------------------------
   Narrative Bio Story Copy Data
   -------------------------------------------------------------------------- */
const STORY_PARAGRAPHS = [
  {
    id: "p1",
    isHighlight: false,
    isQuote: false,
    text: "With 16+ years of experience in enterprise sales across the Middle East, South Asia and Southeast Asia, Roshna built Virtual Captains around a simple belief:",
  },
  {
    id: "p2",
    isHighlight: true,
    isQuote: false,
    text: "Sales capability isn't built by knowing more theory. It's built through practice, evaluation and real-world execution.",
  },
  {
    id: "p3",
    isHighlight: false,
    isQuote: false,
    text: "Today, she leads Virtual Captains across sales strategy, sales enablement, sales training and execution, while building SalesX to develop the next generation of sales professionals.",
  },
  {
    id: "p4",
    isHighlight: false,
    isQuote: true,
    text: "The best sales strategy is authenticity and sincerity.",
  },
];

const INDEXED_PARAGRAPHS = (() => {
  let count = 0;
  return STORY_PARAGRAPHS.map((p) => ({
    ...p,
    words: p.text.split(" ").map((w) => ({
      word: w,
      isHighlight: p.isHighlight,
      isQuote: p.isQuote,
      index: count++,
    })),
  }));
})();
const TOTAL_WORDS = INDEXED_PARAGRAPHS.reduce((acc, p) => acc + p.words.length, 0);

/* --------------------------------------------------------------------------
   Component: Typewriter Word (Word-by-Word Scroll Reveal - 100% PERMANENT BRIGHTNESS)
   - Words reveal briskly and sequentially between 0.16 and 0.48
   - By 0.48 (less than halfway through the track), 100% of all words are revealed
   - From 0.48 to 1.00+, ALL words stay locked at 100% full opacity permanently
   - Zero ghosting, zero fading away at the end
   -------------------------------------------------------------------------- */
function TypewriterWordItem({
  word,
  index,
  totalWords,
  isHighlight,
  isQuote,
  scrollYProgress,
}: {
  word: string;
  index: number;
  totalWords: number;
  isHighlight: boolean;
  isQuote?: boolean;
  scrollYProgress: MotionValue<number>;
}) {
  // Words reveal sequentially between 0.12 and 0.42
  const start = 0.12 + (index / totalWords) * 0.30;
  const end = start + 0.008;

  // Pure JS transformer: strictly clamped. Once progress >= end, returns 1.0 FOREVER.
  // Completely bypasses browser WAAPI/view-timeline keyframe synthesis that caused end-of-scroll fading.
  const opacity = useTransform(scrollYProgress, (progress: number) => {
    if (progress < start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / (end - start);
  });

  const y = useTransform(scrollYProgress, (progress: number) => {
    if (progress < start) return 4;
    if (progress >= end) return 0;
    return 4 * (1 - (progress - start) / (end - start));
  });

  return (
    <motion.span
      style={{
        opacity,
        y,
        display: "inline-block",
        marginRight: "0.28em",
      }}
      className={
        isHighlight
          ? "font-serif italic font-medium text-[#e5ff00] drop-shadow-[0_0_18px_rgba(229,255,0,0.4)]"
          : isQuote
          ? "font-serif italic font-medium text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.3)]"
          : "font-sans font-normal text-white"
      }
    >
      {word}
    </motion.span>
  );
}

/* ==========================================================================
   MAIN COMPONENT: AboutFounder
   - Starts with image in exact CENTER
   - Smoothly glides to the LEFT between 0.05 and 0.14
   - RHS story glides in (0.06 -> 0.12) and reveals words early (0.12 -> 0.42)
   - Stays 100% SOLID and PERMANENT from 0.42 through 1.00+ (NEVER vanishes)
   ========================================================================== */
export default function AboutFounder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Motion Scroll Hook: tracks progress through a generous 320vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* --------------------------------------------------------------------------
     GPU Scroll Choreography with Pure JS Transformers:
     - Perfectly balanced horizontal composition:
       Portrait (230px) + Gap (80px) + Story (540px) = 850px total.
       Centered symmetrically from (50% - 425px) to (50% + 425px).
     - 100% immunity against WAAPI timeline fadeout at the end of the section
     -------------------------------------------------------------------------- */
  const heroX = useTransform(scrollYProgress, (progress: number) => {
    if (progress < 0.05) return 0;
    if (progress >= 0.14) return -310;
    return -310 * ((progress - 0.05) / (0.14 - 0.05));
  });

  const storyContainerOpacity = useTransform(scrollYProgress, (progress: number) => {
    if (progress < 0.06) return 0;
    if (progress >= 0.12) return 1;
    return (progress - 0.06) / (0.12 - 0.06);
  });

  const storyContainerX = useTransform(scrollYProgress, (progress: number) => {
    if (progress < 0.06) return 30;
    if (progress >= 0.12) return 0;
    return 30 * (1 - (progress - 0.06) / (0.12 - 0.06));
  });

  return (
    <section
      id="founder-experience-section"
      role="region"
      aria-label="Founder Roshna Saffar Experience"
      className="relative z-20 w-full bg-[#020B25] text-white"
    >
      {/* ====================================================================
         MOBILE & TABLET VIEW (< 1024px): Responsive Vertical Layout (Zero Hydration Issue)
         ==================================================================== */}
      <div className="block lg:hidden relative w-full overflow-hidden py-16 sm:py-20 select-none bg-[#020B25]">
        {/* Ambient Cosmic Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-radial from-[#15388c]/40 via-[#081b4e]/20 to-transparent blur-[120px] pointer-events-none -z-10" />

        <div className="w-full max-w-xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center relative z-10">
          {/* Top Kicker */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e5ff00] shadow-[0_0_6px_#e5ff00]" />
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#e5ff00]">
              Founder
            </span>
          </div>

          {/* Central Cathedral Arch Portrait */}
          <div className="relative flex flex-col items-center mb-8">
            <div className="rounded-t-full rounded-b-xl p-1 border border-[#e5ff00]/90 shadow-[0_0_28px_rgba(229,255,0,0.3)]">
              <div className="relative rounded-t-full rounded-b-lg overflow-hidden bg-[#071330] w-48 h-64 flex items-end justify-center shadow-2xl">
                <Image
                  src={FOUNDER_IMAGE}
                  alt="Roshna Saffar — Founder of Virtual Captains"
                  width={320}
                  height={420}
                  priority
                  className="w-full h-auto object-cover object-bottom select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Attribution Below Arch */}
            <p className="font-serif italic font-normal text-white text-xl tracking-wide mt-3.5">
              &mdash; Roshna Saffar
            </p>
            <p className="text-[10.5px] font-mono text-[#e5ff00] tracking-widest mt-0.5 uppercase">
              Founder · Virtual Captains
            </p>
          </div>

          {/* Founder's Creed & Story Card */}
          <div className="w-full text-left p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-0.5 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e5ff00]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#e5ff00]">
                The Founder&rsquo;s Creed
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed">
              With 16+ years of experience in enterprise sales across the Middle East, South Asia and Southeast Asia, Roshna built Virtual Captains around a simple belief:
            </p>

            <div className="pl-4 py-2 my-2 border-l-2 border-[#e5ff00] bg-[#e5ff00]/[0.04] rounded-r-lg">
              <p className="font-serif italic text-base sm:text-lg text-[#e5ff00] leading-snug drop-shadow-[0_0_16px_rgba(229,255,0,0.3)]">
                &ldquo;Sales capability isn&rsquo;t built by knowing more theory. It&rsquo;s built through practice, evaluation and real-world execution.&rdquo;
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
              Today, she leads Virtual Captains across sales strategy, sales enablement, sales training and execution, while building SalesX to develop the next generation of sales professionals.
            </p>

            <div className="pl-3.5 py-2 mt-2 border-l-2 border-[#e5ff00]/70 bg-white/[0.03] rounded-r-lg">
              <p className="font-serif italic text-sm sm:text-base text-slate-200 leading-snug">
                &ldquo;The best sales strategy is authenticity and sincerity.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
         DESKTOP VIEW (>= 1024px): Symmetrically Centered Pinned Stage
         ==================================================================== */}
      <div className="hidden lg:block">
        <div
          ref={containerRef}
          id="pinned-scroll-container"
          className="relative h-[320vh] w-full"
        >
          {/* STICKY VIEWPORT STAGE */}
          <div
            id="pinned-sticky-stage"
            style={{ position: "sticky", top: 0, height: "100vh", width: "100%" }}
            className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#020B25]"
          >
            {/* Ambient Cosmic Background Nebula */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[600px] bg-radial from-[#0f3591]/35 via-[#07194a]/20 to-transparent blur-[160px] pointer-events-none -z-10" />

            {/* Delicate Cosmic Orbital Ellipses in Background */}
            <svg
              id="orbital-svg-rings"
              className="pointer-events-none absolute inset-0 w-full h-full -z-10 opacity-30"
              preserveAspectRatio="none"
              viewBox="0 0 1000 1000"
              aria-hidden="true"
            >
              <ellipse
                cx="500"
                cy="500"
                rx="460"
                ry="320"
                fill="none"
                stroke="#8fd0ff"
                strokeWidth="0.8"
                opacity="0.3"
                transform="rotate(-12 500 500)"
              />
              <ellipse
                cx="500"
                cy="510"
                rx="320"
                ry="430"
                fill="none"
                stroke="#e5ff00"
                strokeWidth="0.6"
                opacity="0.25"
                transform="rotate(18 500 500)"
              />
            </svg>

            {/* ── 1. CATHEDRAL ARCH PORTRAIT: Starts in Exact CENTER, then glides to LEFT ── */}
            <motion.div
              id="hero-portrait-stage"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                x: heroX,
                marginLeft: -115,
                marginTop: -186,
                zIndex: 25,
              }}
              className="flex flex-col items-center pointer-events-auto"
            >
              {/* The Cathedral Arch */}
              <div className="relative w-[230px] h-[310px]">
                {/* Glowing Lime Arch Outline */}
                <div
                  className="absolute inset-0 pointer-events-none z-10 rounded-t-full rounded-b-xl border border-[#e5ff00] shadow-[0_0_32px_rgba(229,255,0,0.38)]"
                />

                {/* Arch Portrait Image */}
                <div
                  className="relative h-full w-full overflow-hidden bg-[#071330] rounded-t-full rounded-b-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                >
                  <Image
                    src={FOUNDER_IMAGE}
                    alt="Roshna Saffar — Founder of Virtual Captains"
                    fill
                    sizes="280px"
                    priority
                    className="h-full w-full object-cover object-bottom select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020819]/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Attribution Below Arch */}
              <div className="mt-4 flex flex-col items-center text-center select-none">
                <p className="font-serif italic font-normal text-white text-xl tracking-wide">
                  &mdash; Roshna Saffar
                </p>
                <p className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-[#e5ff00] mt-0.5">
                  Founder · Virtual Captains
                </p>
              </div>
            </motion.div>

            {/* ── 2. RIGHT-SIDE NARRATIVE STORY: Glides in & Unlocks Word-by-Word ── */}
            <motion.div
              id="story-column-stage"
              style={{
                position: "absolute",
                left: "calc(50% - 115px)",
                top: "50%",
                y: "-50%",
                x: storyContainerX,
                opacity: storyContainerOpacity,
                zIndex: 30,
              }}
              className="w-[540px] max-w-[540px] pointer-events-auto"
            >
              <div className="flex flex-col items-start text-left">
                {/* Kicker Pill */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 mb-5 shadow-[0_0_16px_rgba(229,255,0,0.15)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e5ff00] animate-pulse shadow-[0_0_6px_#e5ff00]" />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e5ff00]">
                    The Founder&rsquo;s Creed
                  </span>
                </div>

                {/* Narrative Paragraphs with Word-by-Word Scroll Reveal */}
                <div className="space-y-4 text-left leading-relaxed w-full">
                  {INDEXED_PARAGRAPHS.map((p) => {
                    const isHighlight = p.isHighlight;
                    const isQuote = p.isQuote;
                    return (
                      <div
                        key={p.id}
                        className={
                          isHighlight
                            ? "w-full pl-5 py-3 my-3.5 border-l-2 border-[#e5ff00] bg-[#e5ff00]/[0.05] rounded-r-xl shadow-[0_0_25px_rgba(229,255,0,0.12)] text-xl sm:text-2xl leading-snug"
                            : isQuote
                            ? "w-full pl-4 py-2.5 mt-2 border-l-2 border-[#e5ff00]/70 bg-white/[0.03] rounded-r-lg text-base sm:text-lg leading-snug"
                            : "text-base sm:text-lg leading-relaxed font-sans font-normal text-white"
                        }
                      >
                        {isHighlight && (
                          <span className="font-serif italic text-[#e5ff00] mr-1 select-none">
                            &ldquo;
                          </span>
                        )}
                        {isQuote && (
                          <span className="font-serif italic text-white/90 mr-1 select-none">
                            &ldquo;
                          </span>
                        )}

                        {isMounted
                          ? p.words.map((item) => (
                              <TypewriterWordItem
                                key={item.index}
                                word={item.word}
                                index={item.index}
                                totalWords={TOTAL_WORDS}
                                isHighlight={item.isHighlight}
                                isQuote={item.isQuote}
                                scrollYProgress={scrollYProgress}
                              />
                            ))
                          : p.words.map((item) => (
                              <span
                                key={item.index}
                                className={
                                  item.isHighlight
                                    ? "font-serif italic font-medium text-[#e5ff00] inline-block mr-[0.28em]"
                                    : item.isQuote
                                    ? "font-serif italic font-medium text-white inline-block mr-[0.28em]"
                                    : "font-sans font-normal text-white inline-block mr-[0.28em]"
                                }
                              >
                                {item.word}
                              </span>
                            ))}

                        {isHighlight && (
                          <span className="font-serif italic text-[#e5ff00] ml-1 select-none">
                            &rdquo;
                          </span>
                        )}
                        {isQuote && (
                          <span className="font-serif italic text-white/90 ml-1 select-none">
                            &rdquo;
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
