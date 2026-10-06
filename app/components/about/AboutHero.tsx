"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

/** Heading lines, word by word. `accent` words get the gold gradient. */
const LINES: { text: string; accent?: boolean }[][] = [
  [{ text: "Built" }, { text: "By" }, { text: "Sellers" }],
  [{ text: "Designed" }, { text: "For" }],
  [
    { text: "Sales", accent: true },
    { text: "Execution", accent: true },
  ],
];

/**
 * About hero — same type scale, leading and word-by-word entrance as the
 * home page hero (components/home/Hero.tsx), so the two read as one system.
 */
export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Matches the home hero's intro: each word rises and tips up into place
      tl.from(
        ".about-hero-word",
        {
          opacity: 0,
          y: 36,
          rotateX: 25,
          transformOrigin: "50% 100%",
          stagger: 0.045,
          duration: 1.1,
          ease: "expo.out",
          clearProps: "all",
        },
        "+=0.1"
      ).from(
        subRef.current,
        { opacity: 0, y: 20, duration: 0.9, clearProps: "all" },
        "-=0.6"
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
        <h1 className="max-w-5xl font-sans text-[clamp(2rem,3.8vw+3.8vh,7rem)] font-medium leading-[1.14] tracking-[-0.01em] text-white">
          {LINES.map((line, li) => (
            <span key={li} className="block px-2 -mx-2 py-0.5">
              {line.map((word, wi) => (
                <React.Fragment key={wi}>
                  {wi > 0 && " "}
                  <span
                    className={`about-hero-word inline-block ${
                      word.accent
                        ? "italic font-bold pr-[0.12em] bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent"
                        : ""
                    }`}
                  >
                    {word.text}
                  </span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          className="mt-5 sm:mt-7 max-w-2xl font-sans text-[15px] sm:text-lg md:text-xl leading-relaxed text-white/70"
        >
          A smarter way to build sales capability at scale, for teams,
          professionals and founders.
        </p>
      </div>
    </section>
  );
}
