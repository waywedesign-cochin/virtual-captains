"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Deterministic PRNG (same output every render/build) so the starfield
// doesn't shift between server and client render.
function seededRandom(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const STAR_COUNT = 55;
const starRandom = seededRandom(9001);
const METHOD_STARS = Array.from({ length: STAR_COUNT }, () => ({
  left: starRandom() * 100,
  top: starRandom() * 100,
  size: 1 + starRandom() * 1.7,
  delay: starRandom() * 5,
  duration: 2.6 + starRandom() * 3.6,
  baseOpacity: 0.2 + starRandom() * 0.5,
}));

// A sparser, dimmer scatter for inside the cards — enough to feel alive
// without competing with the dashboard image and copy sitting on top.
const CARD_STAR_COUNT = 26;
const cardStarRandom = seededRandom(4242);
const CARD_STARS = Array.from({ length: CARD_STAR_COUNT }, () => ({
  left: cardStarRandom() * 100,
  top: cardStarRandom() * 100,
  size: 1 + cardStarRandom() * 1.3,
  delay: cardStarRandom() * 5,
  duration: 3 + cardStarRandom() * 3.6,
  baseOpacity: 0.15 + cardStarRandom() * 0.3,
}));

interface MethodSlide {
  id: number;
  eyebrow: string;
  subOrange: string;
  subBlue: string;
  description: string;
  orbitLabels: {
    topLeft: { line1: string; line2: string };
    topRight: { line1: string; line2: string };
    bottom: string;
  };
}

export default function SalesXMethod() {
  const [activeDot, setActiveDot] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introHeadingRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const slides: MethodSlide[] = [
    {
      id: 0,
      eyebrow: "The Rehearsal Floor",
      subOrange: "Simulation,",
      subBlue: "Not Slides",
      description:
        "Every session unfolds as a live sales encounter: calls, objections, and a CRM that behaves exactly as one would in the field, rather than a lecture observed from a distance",
      orbitLabels: {
        topLeft: { line1: "CRM", line2: "Dashboards" },
        topRight: { line1: "Live", line2: "Simulations" },
        bottom: "Live Calls",
      },
    },
    {
      id: 1,
      eyebrow: "Real-Time Telemetry",
      subOrange: "Precision,",
      subBlue: "Not Guesswork",
      description:
        "Instant quantifiable telemetry on voice pitch inflection, conviction pauses, pricing anchor defense, and value proposition clarity. Reps receive sub-second coaching cues before live calls.",
      orbitLabels: {
        topLeft: { line1: "Acoustic", line2: "Telemetry" },
        topRight: { line1: "Pitch", line2: "Defense" },
        bottom: "Live Analytics",
      },
    },
    {
      id: 2,
      eyebrow: "Deal Stage Mastery",
      subOrange: "Execution,",
      subBlue: "Not Theory",
      description:
        "Uncover hidden closing bottlenecks across your entire sales motion. Automatically route reps into targeted 5-minute micro-drills that transform deal-breaking vulnerabilities into effortless closing reflexes.",
      orbitLabels: {
        topLeft: { line1: "Pipeline", line2: "Drills" },
        topRight: { line1: "Adaptive", line2: "Closing" },
        bottom: "Deal Velocity",
      },
    },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      prefersReducedMotion ||
      !sectionRef.current ||
      !stageRef.current ||
      !introHeadingRef.current ||
      !cardsContainerRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const slidesElements = slideRefs.current.filter(
        Boolean,
      ) as HTMLDivElement[];
      if (slidesElements.length < 3) return;

      // 1. Initial visual states with signature zoom-in spring reveal
      gsap.set(introHeadingRef.current, {
        opacity: 0,
        scale: 0.65,
        y: 20,
        transformOrigin: "center center",
        force3D: true,
      });

      let entranceTween: gsap.core.Tween | null = null;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          entranceTween = gsap.to(introHeadingRef.current, {
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
          });
        },
      });

      gsap.set(cardsContainerRef.current, {
        opacity: 0,
        scale: 0.96,
        pointerEvents: "none",
      });
      if (dotsRef.current) gsap.set(dotsRef.current, { opacity: 0 });

      // Deck Slide stacking initial setup: Slide 0 in place, Slides 1 & 2 ready below
      gsap.set(slidesElements[0], {
        yPercent: 0,
        opacity: 1,
        scale: 1,
        pointerEvents: "auto",
      });
      gsap.set(slidesElements[1], {
        yPercent: 100,
        opacity: 1,
        scale: 1,
        pointerEvents: "none",
      });
      gsap.set(slidesElements[2], {
        yPercent: 100,
        opacity: 1,
        scale: 1,
        pointerEvents: "none",
      });

      // 2. Master pinned presentation timeline: Fast, responsive scroll (+=1300px)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1300",
          pin: stageRef.current,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // When scrubbing starts, ensure entrance tween doesn't conflict
            if (p > 0.005 && entranceTween && entranceTween.isActive()) {
              entranceTween.kill();
            }

            // Guarantee intro heading is completely hidden once slides appear
            if (introHeadingRef.current) {
              if (p >= 0.08) {
                introHeadingRef.current.style.opacity = "0";
                introHeadingRef.current.style.visibility = "hidden";
                introHeadingRef.current.style.pointerEvents = "none";
              } else {
                introHeadingRef.current.style.visibility = "visible";
                introHeadingRef.current.style.pointerEvents = "auto";
              }
            }

            setCardsVisible(p > 0.08);

            if (p < 0.38) {
              setActiveDot(0);
            } else if (p < 0.74) {
              setActiveDot(1);
            } else {
              setActiveDot(2);
            }
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger || null;

      // PHASE 1: Quick intro fade (0 -> 0.12)
      tl.fromTo(
        introHeadingRef.current,
        { opacity: 1, scale: 1, y: 0 },
        {
          opacity: 0,
          scale: 1.05,
          y: -25,
          duration: 0.12,
          ease: "power2.inOut",
        },
      ).to(
        cardsContainerRef.current,
        {
          opacity: 1,
          scale: 1,
          pointerEvents: "auto",
          duration: 0.12,
          ease: "power2.out",
        },
        "-=0.06",
      );

      if (dotsRef.current) {
        tl.to(dotsRef.current, { opacity: 1, duration: 0.08 }, "<0.04");
      }

      // Settle on Slide 0
      tl.to({}, { duration: 0.06 });

      // PHASE 2: Fast Slide 1 Deck Slide-Over
      tl.to(
        slidesElements[0],
        {
          yPercent: -10,
          scale: 0.96,
          opacity: 0.35,
          pointerEvents: "none",
          duration: 0.28,
          ease: "power2.inOut",
        },
        "slide1Enter",
      ).to(
        slidesElements[1],
        {
          yPercent: 0,
          pointerEvents: "auto",
          duration: 0.28,
          ease: "power2.out",
        },
        "slide1Enter",
      );

      // Settle on Slide 1
      tl.to({}, { duration: 0.1 });

      // PHASE 3: Fast Slide 2 Deck Slide-Over
      tl.to(
        slidesElements[1],
        {
          yPercent: -10,
          scale: 0.96,
          opacity: 0.35,
          pointerEvents: "none",
          duration: 0.28,
          ease: "power2.inOut",
        },
        "slide2Enter",
      ).to(
        slidesElements[2],
        {
          yPercent: 0,
          pointerEvents: "auto",
          duration: 0.28,
          ease: "power2.out",
        },
        "slide2Enter",
      );

      // Settle on Slide 2
      tl.to({}, { duration: 0.08 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const goToSlide = (index: number) => {
    if (introHeadingRef.current) {
      introHeadingRef.current.style.opacity = "0";
      introHeadingRef.current.style.visibility = "hidden";
      introHeadingRef.current.style.pointerEvents = "none";
    }

    if (!scrollTriggerRef.current) {
      setActiveDot(index);
      return;
    }
    const st = scrollTriggerRef.current;
    // Map dots to timeline scroll positions: Slide 0: 18%, Slide 1: 55%, Slide 2: 92%
    const progressTargets = [0.18, 0.55, 0.92];
    const targetScroll =
      st.start + (st.end - st.start) * progressTargets[index];

    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (target: number, opts?: object) => void };
      }
    ).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 0.7, lock: false });
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  // Each slide has its own opaque background, so the starfield has to live
  // inside every slide (between its background and its content) rather
  // than as one shared layer behind the stack, or the slide's own bg-color
  // paints straight over it.
  const renderCardStars = () => (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
    >
      {CARD_STARS.map((star, i) => (
        <span
          key={i}
          className="sxm-star absolute rounded-full bg-white"
          style={
            {
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.baseOpacity,
              boxShadow: `0 0 ${star.size * 2}px rgba(147,197,253,0.7)`,
              animation: `sxm-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              "--sxm-star-base": star.baseOpacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );

  return (
    <section ref={sectionRef} className="relative bg-[#000207] select-none">
      {/* Pinned Stage Container: fits 100% within dynamic viewport height */}
      <div
        ref={stageRef}
        className="min-h-screen h-dvh w-full flex flex-col items-center justify-center relative overflow-hidden px-3 sm:px-6 lg:px-12 py-4 sm:py-6"
      >
        <style>{`
          @keyframes sxm-twinkle {
            0%, 100% { opacity: var(--sxm-star-base, 0.3); transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
          }
          @media (prefers-reduced-motion: reduce) {
            .sxm-star { animation: none !important; }
          }
        `}</style>

        {/* Background Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 sm:w-260 lg:w-7xl h-100 sm:h-140 bg-radial from-[#1e40af]/25 via-[#312e81]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

        {/* Subtle Star Particles - Standardized Cosmic Grid Token */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none -z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(147, 197, 253, 0.35) 1px, transparent 0)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Galaxy Starfield: a scattered, twinkling dust of distant stars,
            matching the orbit galaxy effect on the About page */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none overflow-hidden -z-10"
        >
          {METHOD_STARS.map((star, i) => (
            <span
              key={i}
              className="sxm-star absolute rounded-full bg-white"
              style={
                {
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.baseOpacity,
                  boxShadow: `0 0 ${star.size * 2.5}px rgba(147,197,253,0.8)`,
                  animation: `sxm-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
                  "--sxm-star-base": star.baseOpacity,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* 1. INTRO HEADING: Comes first in center, then dissolves on scrolling */}
        <div
          ref={introHeadingRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none px-4"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-[#3b82f6] drop-shadow-[0_0_35px_rgba(59,130,246,0.7)]">
            The SalesX Method
          </h2>
          <p className="mt-3 sm:mt-5 text-xs sm:text-base md:text-lg text-slate-300/80 max-w-lg tracking-wide font-sans">
            Precision Simulation Engine. Practice Real Deals Before Going Live.
          </p>
          <div className="mt-6 sm:mt-8 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Scroll down to enter</span>
            <svg
              className="w-4 h-4 text-blue-400 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>

        {/* 2. CARDS CONTAINER: Appears in center after heading dissolves, matches Navbar width */}
        <div
          ref={cardsContainerRef}
          className="w-full max-w-372 mx-auto relative flex items-center justify-between gap-3 sm:gap-6 lg:gap-8 z-10 will-change-transform"
        >
          {/* Card Outer Container with Gradient Border (Blue-to-Pink) */}
          <div className="relative flex-1 w-full rounded-2xl sm:rounded-3xl lg:rounded-4xl p-[1.5px] bg-linear-to-br from-blue-600/50 via-blue-500/20 to-pink-500/60 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
            {/* Card Inner Body: Compact responsive container with overflow clipping */}
            <div className="relative overflow-hidden rounded-[22px] sm:rounded-[28px] lg:rounded-[30px] bg-[#050816] backdrop-blur-2xl">
              {/* Inner star particles */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none z-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(147, 197, 253, 0.35) 1px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Bottom-right ambient aura */}
              <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-radial from-blue-600/25 via-pink-500/10 to-transparent blur-3xl pointer-events-none z-0" />

              {/* Grid-stacked Deck Slides (Clean slide-over without opacity ghosting) */}
              <div className="grid grid-cols-1 grid-rows-1 relative z-10 w-full min-h-87.5 sm:min-h-100 lg:min-h-110">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    ref={(el) => {
                      slideRefs.current[index] = el;
                    }}
                    className={`col-start-1 row-start-1 w-full h-full min-h-87.5 sm:min-h-100 lg:min-h-110 bg-[#050816] p-4 sm:p-6 lg:p-9 xl:p-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 xl:gap-12 items-center will-change-transform relative overflow-hidden rounded-[22px] sm:rounded-[28px] lg:rounded-[30px] ${
                      index === 1
                        ? "border-t border-[#38bdf8]/50 shadow-[0_-30px_70px_rgba(0,0,0,0.95)]"
                        : index === 2
                          ? "border-t border-[#ff7a45]/50 shadow-[0_-30px_70px_rgba(0,0,0,0.95)]"
                          : ""
                    }`}
                    style={{
                      zIndex: index * 10 + 10,
                    }}
                  >
                    {renderCardStars()}

                    {/* Left Column: Eyebrow, Heading, Paragraph, and Button */}
                    <div className="relative z-10 lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start">
                      <h4 className="text-base sm:text-xl lg:text-3xl font-light text-white tracking-wide font-sans">
                        {slide.eyebrow}
                      </h4>

                      <h3 className="mt-1 sm:mt-2 text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight">
                        <span
                          className="bg-clip-text text-transparent inline-block drop-shadow-[0_0_24px_rgba(168,85,247,0.3)] font-sans select-none"
                          style={{
                            backgroundImage:
                              "linear-gradient(90deg, #ff6b35 0%, #ff477e 26%, #9333ea 52%, #3b82f6 76%, #38bdf8 100%)",
                          }}
                        >
                          {slide.subOrange} {slide.subBlue}
                        </span>
                      </h3>

                      <p className="mt-2 sm:mt-3 lg:mt-4 text-xs sm:text-sm lg:text-[15px] text-slate-300 leading-relaxed font-sans max-w-lg mx-auto lg:mx-0">
                        {slide.description}
                      </p>

                      <div className="mt-4 sm:mt-6 lg:mt-7 flex justify-center lg:justify-start w-full lg:w-auto">
                        <Link
                          href="/individuals"
                          className="inline-flex items-center justify-center rounded-full border border-[#00a6ff] bg-transparent hover:bg-[#00a6ff]/10 px-5 sm:px-8 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-[0_0_16px_rgba(0,166,255,0.4)] transition-all transform hover:scale-105"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Concentric Orbit Rings, Floating Badges, and dashbord-01.webp */}
                    <div className="lg:col-span-7 relative z-10 flex items-center justify-center py-2 sm:py-4 lg:py-6">
                      {/* Concentric Circular Rings */}
                      <div className="absolute w-[95%] sm:w-[90%] aspect-square rounded-full border border-blue-500/15 pointer-events-none" />
                      <div className="absolute w-[120%] aspect-square rounded-full border border-blue-400/10 pointer-events-none" />

                      {/* Floating Badge: Top / Top-Left */}
                      <div className="absolute top-0 sm:top-2 left-2 sm:left-10 z-20 flex flex-col text-left text-[10px] sm:text-xs font-semibold select-none drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]">
                        <span className="text-[#38bdf8]">
                          {slide.orbitLabels.topLeft.line1}
                        </span>
                        <span className="text-[#f472b6]">
                          {slide.orbitLabels.topLeft.line2}
                        </span>
                      </div>

                      {/* Floating Badge: Top-Right */}
                      <div className="absolute top-1 sm:top-4 right-1 sm:right-6 z-20 flex flex-col text-left text-[10px] sm:text-xs font-semibold select-none drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]">
                        <span className="text-[#38bdf8]">
                          {slide.orbitLabels.topRight.line1}
                        </span>
                        <span className="text-[#f472b6]">
                          {slide.orbitLabels.topRight.line2}
                        </span>
                      </div>

                      {/* Floating Badge: Bottom-Left */}
                      <div className="absolute -bottom-1 sm:bottom-0 left-4 sm:left-12 z-20 select-none text-[10px] sm:text-xs font-semibold text-[#00a6ff] drop-shadow-[0_0_12px_rgba(0,166,255,0.8)]">
                        {slide.orbitLabels.bottom}
                      </div>

                      {/* Single Dashboard Preview: /salesx/dashbord-01.webp */}
                      <div className="relative z-10 w-full max-w-70 sm:max-w-md lg:max-w-xl transition-all duration-500 transform hover:scale-[1.01]">
                        <Image
                          src="/salesx/dashbord-01.webp"
                          alt="SalesX Method Dashboard"
                          width={1400}
                          height={850}
                          unoptimized
                          priority
                          className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Far Right: 3 Vertical Navigation Dots */}
          <div
            ref={dotsRef}
            className="hidden lg:flex flex-col items-center justify-center gap-4 shrink-0 pl-1 z-30 select-none transition-opacity duration-300"
          >
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`group p-1.5 transition-all duration-300 ${
                  activeDot === idx ? "scale-125" : "hover:scale-110"
                }`}
                aria-label={`Jump to slide ${idx + 1}`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    activeDot === idx
                      ? "bg-white shadow-[0_0_10px_#ffffff]"
                      : "border border-slate-500 bg-transparent group-hover:border-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Dots */}
        {cardsVisible && (
          <div className="flex lg:hidden items-center justify-center gap-3 mt-4 z-30">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className="p-1.5"
                aria-label={`Slide ${idx + 1}`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    activeDot === idx
                      ? "bg-white shadow-[0_0_8px_#ffffff]"
                      : "border border-slate-500 bg-transparent"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
