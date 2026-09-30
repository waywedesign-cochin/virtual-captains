"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ChevronDown } from "./Icons";

/**
 * Partner page intro: the "Grow Together With SalesX" title over the stepped
 * columns. One screen tall — the title eases away as the hero scrolls out and
 * the Partnership Index (the section below) follows straight on.
 */
export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking across the sticky section height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 22,
    restDelta: 0.001,
  });


  // Layer 1 (Monumental Typography) fades and scales
  const titleOpacity = useTransform(smoothProgress, [0, 0.6], [1, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.6], [0, -75]);
  const titleScale = useTransform(smoothProgress, [0, 0.6], [1, 0.93]);
  const titlePointerEvents = useTransform(smoothProgress, (v) => (v < 0.5 ? "auto" : "none"));

  // Background subtle zoom
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.07]);

  const scrollToCards = () => {
    document.getElementById("partnership-index")?.scrollIntoView({ behavior: "smooth" });
  };

  // 14 vertical column heights that form the architectural archway
  const columnHeights = [
    88, 82, 74, 65, 54, 44, 38, 38, 44, 54, 65, 74, 82, 88,
  ];

  return (
    <div
      ref={containerRef}
      id="hero-experience"
      className="relative w-full h-svh min-h-[560px] select-none"
    >
      {/* ========================================================================= */}
      {/* PINNED STAGE VIEWPORT (Fixed to screen across all devices)                 */}
      {/* ========================================================================= */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-[#020B25]">
        {/* ========================================================================= */}
        {/* SHARED BACKGROUND: Stepped Columns in Virtual Captains Home Navy / Cyan   */}
        {/* ========================================================================= */}
        <motion.div
          style={{ scale: bgScale }}
          className="absolute inset-0 pointer-events-none overflow-hidden select-none origin-center"
        >
          {/* Upper dark navy ambient glow */}
          <div className="absolute top-0 left-0 right-0 h-36 sm:h-52 bg-linear-to-b from-[#03091e]/90 via-[#0a1a4a]/40 to-transparent z-10" />

          {/* 14 Staggered Pleated Vertical Columns (Deep Sapphire -> Royal Blue -> Sky Blue) */}
          <div className="absolute inset-0 flex h-full w-full">
            {columnHeights.map((heightPercent, idx) => {
              const isCenter = idx === 6 || idx === 7;
              const isNearCenter = idx >= 4 && idx <= 9;
              return (
                <div
                  key={idx}
                  className="flex-1 h-full flex flex-col items-center relative overflow-hidden"
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full relative transition-all duration-700 ${
                      isCenter
                        ? "bg-linear-to-b from-[#0b1c4d] via-[#1d4ed8] to-[#38bdf8]"
                        : isNearCenter
                        ? "bg-linear-to-b from-[#081538] via-[#1e40af] to-[#2563eb]"
                        : "bg-linear-to-b from-[#050e26] via-[#1e3a8a] to-[#1d4ed8]"
                    }`}
                  >
                    <div className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-[#38bdf8]/40 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-size-[10px_10px] opacity-35 mix-blend-overlay" />
                    <div className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-[#020B25] via-[#020B25]/80 to-transparent" />
                  </div>
                  <div className="flex-1 w-full bg-[#020B25]" />
                </div>
              );
            })}
          </div>

          {/* Central radial sunburst (Cyan & Sky-Blue & subtle electric lime highlight) */}
          <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-85 xs:w-[480px] sm:w-175 md:w-212.5 lg:w-275 xl:w-325 h-75 sm:h-125 lg:h-162.5 bg-linear-to-t from-[#2563eb]/40 via-[#38bdf8]/30 to-[#e7ff3d]/15 rounded-full blur-[100px] sm:blur-[135px] mix-blend-screen pointer-events-none" />

          {/* Bottom smooth fade to black */}
          <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-linear-to-t from-[#020B25] via-[#020B25]/85 to-transparent z-10" />
        </motion.div>

        {/* ========================================================================= */}
        {/* LAYER 1: HERO COPY ("Grow Together With SalesX")                          */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: titleOpacity,
            y: titleY,
            scale: titleScale,
            pointerEvents: titlePointerEvents,
          }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 pt-20 text-center sm:px-8 select-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full max-w-4xl flex-col items-center"
          >
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#38bdf8]">
              Partnerships
            </p>

            <h1 className="mt-5 sm:mt-6 font-sans font-medium text-[clamp(2.5rem,6.2vw,5rem)] leading-[1.02] tracking-[-0.03em] text-white drop-shadow-[0_12px_40px_rgba(2,11,37,0.8)]">
              Grow Together
              <span className="block bg-linear-to-r from-white via-[#7dd3fc] to-[#38bdf8] bg-clip-text pb-[0.08em] text-transparent">
                With SalesX
              </span>
            </h1>

            <p className="mt-3 text-lg sm:text-xl font-normal tracking-tight text-slate-300">
              by Virtual Captains
            </p>

            <p className="mt-6 sm:mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300/90">
              Whether you&apos;re an institution, a brand, or an enterprise, there&apos;s a partnership
              model built for you. Let&apos;s create impact together.
            </p>

            <div className="mt-9 sm:mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={scrollToCards}
                className="group inline-flex min-h-12 w-full sm:w-auto cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#e7ff3d] px-7 text-sm sm:text-base font-semibold text-[#020B25] shadow-[0_0_28px_rgba(231,255,61,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8f030]"
              >
                Explore Partnerships
                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
              <a
                href="/contact"
                className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center rounded-full border border-white/25 px-7 text-sm sm:text-base font-medium text-white transition-colors duration-300 hover:border-white/50 hover:bg-white/5"
              >
                Talk to Us
              </a>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};
