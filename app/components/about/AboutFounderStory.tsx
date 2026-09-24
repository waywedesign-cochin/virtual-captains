"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

/* --------------------------------------------------------------------------
   Narrative Bio Story Data
   -------------------------------------------------------------------------- */
const STORY_PARAGRAPHS = [
  {
    id: "p1",
    isHighlight: false,
    text: "With 16+ years of experience in enterprise sales across the Middle East, South Asia and Southeast Asia, Roshna built Virtual Captains around a simple belief:",
  },
  {
    id: "p2",
    isHighlight: true,
    text: "Sales capability isn't built by knowing more theory. It's built through practice, evaluation and real-world execution.",
  },
  {
    id: "p3",
    isHighlight: false,
    text: "Today, she leads Virtual Captains across sales strategy, sales enablement, sales training and execution, while building SalesX to develop the next generation of sales professionals.",
  },
];

// Precompute indexed words for deterministic word-by-word illumination
let wordCount = 0;
const INDEXED_PARAGRAPHS = STORY_PARAGRAPHS.map((p) => {
  const words = p.text.split(" ").map((w) => ({
    word: w,
    isHighlight: p.isHighlight,
    index: wordCount++,
  }));
  return {
    ...p,
    words,
  };
});
const TOTAL_WORDS = wordCount;

/* --------------------------------------------------------------------------
   ScrollWord Component: Smooth GPU-Driven Word Illumination
   -------------------------------------------------------------------------- */
function StoryWord({
  word,
  progress,
  start,
  end,
  isHighlight,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  isHighlight: boolean;
}) {
  const opacity = useTransform(progress, [start - 0.006, start, end], [0.18, 1, 1]);
  const y = useTransform(progress, [start - 0.006, start, end], [4, 0, 0]);
  const color = useTransform(
    progress,
    [start - 0.006, start, end],
    [
      "rgba(255, 255, 255, 0.22)",
      isHighlight ? "#F3FC00" : "#ffffff",
      isHighlight ? "#F3FC00" : "#ffffff",
    ]
  );

  return (
    <motion.span
      style={{
        opacity,
        y,
        color,
        display: "inline-block",
        marginRight: "0.28em",
      }}
      className={
        isHighlight
          ? "font-serif italic font-medium drop-shadow-[0_0_18px_rgba(229,255,0,0.35)]"
          : "font-sans font-light"
      }
    >
      {word}
    </motion.span>
  );
}

export default function AboutFounderStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Motion Scroll Hook: tracks progress through this dedicated 220vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      role="region"
      aria-label="Founder Roshna Saffar Creed & Story"
      className="relative w-full bg-[#020B25] text-white"
    >
      {/* Scroll track: pins stage in place while scrubbing words */}
      <div
        ref={containerRef}
        className="relative w-full h-[240vh]"
      >
        <div
          ref={stageRef}
          style={{ position: "sticky", top: 0, height: "100vh", width: "100%" }}
          className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#020B25] px-6 sm:px-10 lg:px-16"
        >
          {/* Subtle Ambient Cosmic Core Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-212.5 h-137.5 bg-radial from-[#15388c]/30 via-[#07194a]/15 to-transparent blur-[160px] pointer-events-none -z-10" />

          {/* Watermark Credo */}
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif italic text-[#163470]/25 text-[22vw] whitespace-nowrap leading-none select-none -z-10"
            aria-hidden="true"
          >
            Execution
          </span>

          <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
            {/* Kicker Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-4 py-1.5 mb-8 shadow-[0_0_20px_rgba(243,252,0,0.15)]">
              <span className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-[#D08817] to-[#F3FC00] animate-pulse shadow-[0_0_8px_#F3FC00]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent">
                The Founder&rsquo;s Creed
              </span>
            </div>

            {/* Word-by-Word Illuminated Narrative Copy */}
            <div className="space-y-6 sm:space-y-8 text-center max-w-3xl leading-relaxed">
              {INDEXED_PARAGRAPHS.map((p) => {
                const isHighlight = p.isHighlight;
                return (
                  <div
                    key={p.id}
                    className={
                      isHighlight
                        ? "text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] leading-tight sm:leading-[1.22] py-2 sm:py-3 px-2 sm:px-6 rounded-2xl bg-white/2 border border-[#D08817]/40 backdrop-blur-md shadow-[0_0_35px_rgba(243,252,0,0.12)]"
                        : "text-base sm:text-xl lg:text-[1.35rem] leading-relaxed text-white/80"
                    }
                  >
                    {isHighlight && (
                      <span className="font-serif italic text-[#F3FC00] mr-1 select-none">
                        &ldquo;
                      </span>
                    )}
                    {p.words.map((item) => {
                      // Map word illumination across 0.10 to 0.90 of section scroll
                      const start = 0.10 + (item.index / TOTAL_WORDS) * 0.78;
                      const end = start + 0.015;
                      return (
                        <React.Fragment key={item.index}>
                          <StoryWord
                            word={item.word}
                            progress={scrollYProgress}
                            start={start}
                            end={end}
                            isHighlight={item.isHighlight}
                          />
                          {" "}
                        </React.Fragment>
                      );
                    })}
                    {isHighlight && (
                      <span className="font-serif italic text-[#F3FC00] ml-1 select-none">
                        &rdquo;
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Attribution Signature */}
            <div className="mt-8 sm:mt-10 flex flex-col items-center">
              <p className="font-serif italic text-white text-xl sm:text-2xl tracking-wide">
                &mdash; Roshna Saffar
              </p>
              <p className="text-xs font-mono uppercase tracking-[0.25em] bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent mt-1">
                Founder · Virtual Captains
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
