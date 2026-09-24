"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SalesXCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial entrance states
      if (headingRef.current) {
        gsap.set(headingRef.current, {
          opacity: 0,
          scale: 0.65,
          y: 20,
          transformOrigin: "center center",
          force3D: true,
        });
      }
      if (textRef.current) {
        gsap.set(textRef.current, { opacity: 0, x: -32 });
      }
      const buttons = buttonRefs.current.filter(Boolean) as HTMLAnchorElement[];
      if (buttons.length > 0) {
        gsap.set(buttons, { opacity: 0, x: 36, scale: 0.95 });
      }

      // 2. ScrollTrigger Entrance Timeline
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          // Heading signature reveal
          if (headingRef.current) {
            tl.to(
              headingRef.current,
              {
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
              },
              0
            );
          }

          // Left supporting text reveal
          if (textRef.current) {
            tl.to(
              textRef.current,
              {
                opacity: 1,
                x: 0,
                duration: 0.85,
                ease: "power3.out",
              },
              0.2
            );
          }

          // Right action buttons staggered spring reveal
          if (buttons.length > 0) {
            tl.to(
              buttons,
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.85,
                stagger: 0.15,
                ease: "back.out(1.3)",
              },
              0.3
            );
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#020510] overflow-hidden border-t border-blue-950/40 py-28 sm:py-36 lg:py-44 select-none"
    >
      {/* Ambient Blue-Purple Deep Space Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] lg:w-[1100px] h-[400px] sm:h-[500px] bg-radial from-[#1e3a8a]/20 via-[#1e1b4b]/12 to-transparent blur-[140px] pointer-events-none -z-10"
      />

      {/* Subtle Starfield Dot Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.25) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12">
        {/* ── TOP SECTION: Main Central Heading (matching reference exactly) ── */}
        <div className="text-center max-w-4xl mx-auto">
          <h2
            ref={headingRef}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-sans drop-shadow-[0_0_40px_rgba(255,255,255,0.14)] will-change-transform leading-[1.12]"
          >
            Ready to Redefine
            <br />
            Your Sales Performance?
          </h2>
        </div>

        {/* ── LOWER SECTION: Split Subtext & Stacked CTA Buttons ── */}
        <div className="mt-16 sm:mt-24 lg:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Subtitle Description */}
          <div
            ref={textRef}
            className="lg:col-span-6 xl:col-span-7 text-center lg:text-left will-change-transform"
          >
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-light leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans">
              Whether you&apos;re preparing for your first sale or hiring for your
              next quarter, SalesX is built for the execution that follows
            </p>
          </div>

          {/* Right Column: Stacked High-Impact CTA Buttons with Gradient Sheen */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center lg:items-end gap-5 sm:gap-6 w-full">
            {/* Button 1: I'm a Learner */}
            <Link
              href="/individuals"
              ref={(el) => {
                buttonRefs.current[0] = el;
              }}
              className="group relative w-full max-w-sm sm:max-w-md p-[1.5px] rounded-2xl sm:rounded-3xl bg-linear-to-r from-blue-500/50 via-purple-500/50 to-indigo-500/50 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(56,189,248,0.45)] cursor-pointer will-change-transform block"
            >
              <div className="w-full h-15 sm:h-17 rounded-[calc(1rem-1.5px)] sm:rounded-[calc(1.5rem-1.5px)] bg-[#070d24] group-hover:bg-[#0b1436] flex items-center justify-center px-8 transition-colors duration-300">
                <span className="text-base sm:text-lg lg:text-xl font-medium sm:font-semibold text-white tracking-wide font-sans group-hover:text-cyan-100 transition-colors">
                  I&apos;m a Learner
                </span>
              </div>
            </Link>

            {/* Button 2: I'm a Business */}
            <Link
              href="/contact"
              ref={(el) => {
                buttonRefs.current[1] = el;
              }}
              className="group relative w-full max-w-sm sm:max-w-md p-[1.5px] rounded-2xl sm:rounded-3xl bg-linear-to-r from-purple-500/50 via-pink-500/40 to-blue-500/50 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.45)] cursor-pointer will-change-transform block"
            >
              <div className="w-full h-15 sm:h-17 rounded-[calc(1rem-1.5px)] sm:rounded-[calc(1.5rem-1.5px)] bg-[#070d24] group-hover:bg-[#0b1436] flex items-center justify-center px-8 transition-colors duration-300">
                <span className="text-base sm:text-lg lg:text-xl font-medium sm:font-semibold text-white tracking-wide font-sans group-hover:text-pink-100 transition-colors">
                  I&apos;m a Business
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
