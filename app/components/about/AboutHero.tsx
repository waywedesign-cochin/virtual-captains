"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

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
      className="relative w-full lg:min-h-svh flex items-center justify-center pt-32 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8 overflow-hidden select-none"
    >
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
              <span className="font-bold bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent">
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
