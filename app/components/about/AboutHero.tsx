"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Ambient backlight fade-in & breathing pulse
      if (glowRef.current) {
        gsap.fromTo(
          glowRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }
        );

        gsap.to(glowRef.current, {
          scale: 1.08,
          opacity: 0.85,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.6,
        });
      }

      // Initial headline zoom-in reveal state
      if (headingRef.current) {
        gsap.set(headingRef.current, {
          opacity: 0,
          scale: 0.68,
          y: 20,
          transformOrigin: "center center",
        });

        tl.to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            keyframes: [
              { scale: 1.15, opacity: 1, y: -4, duration: 0.45, ease: "power2.out" },
              { scale: 0.94, y: 2, duration: 0.24, ease: "sine.inOut" },
              { scale: 1.0, y: 0, duration: 0.22, ease: "power2.out" },
            ],
          },
          0.1
        );
      }

      // Masked typography lines reveal from below
      tl.fromTo(
        line1Ref.current,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.15 },
        0.1
      ).fromTo(
        line2Ref.current,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.25 },
        "-=0.9"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      role="region"
      aria-label="About Virtual Captains Hero"
      className="relative w-full min-h-screen flex items-center justify-center pt-20 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 overflow-hidden select-none"
    >
      {/* Centered Breathing Ambient Glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 sm:w-187.5 lg:w-225 h-65 sm:h-87.5 bg-radial from-[#1e40af]/30 via-[#0c2269]/15 to-transparent blur-[120px] pointer-events-none -z-10 will-change-transform"
      />

      <div
        ref={containerRef}
        className="w-full max-w-5xl mx-auto flex flex-col items-center text-center relative z-10"
      >
        <h1
          ref={headingRef}
          className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.75rem] font-normal sm:font-medium tracking-tight text-white leading-[1.18] sm:leading-[1.2] font-sans will-change-transform"
        >
          {/* Line 1 with overflow-hidden mask */}
          <span className="block overflow-hidden pb-1 sm:pb-2.5">
            <span
              ref={line1Ref}
              className="block text-white will-change-transform"
            >
              A Smarter Way To Build
            </span>
          </span>

          {/* Line 2 with overflow-hidden mask */}
          <span className="block overflow-hidden mt-1 sm:mt-2 pb-1.5 sm:pb-2.5">
            <span
              ref={line2Ref}
              className="block will-change-transform"
            >
              <span className="font-bold bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(243,252,0,0.35)]">
                Sales Capability
              </span>{" "}
              <span className="text-white">
                At Scale
              </span>
            </span>
          </span>
        </h1>
      </div>
    </section>
  );
}
