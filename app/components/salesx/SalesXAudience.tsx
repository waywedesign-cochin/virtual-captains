"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AudienceItem {
  id: number;
  title: string;
  subtitle: string;
}

export default function SalesXAudience() {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const centerAuraRef = useRef<HTMLDivElement>(null);
  const centerTitleRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const wheelWindowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const items: AudienceItem[] = [
    {
      id: 0,
      title: "ISM Certified Sales Professional™",
      subtitle: "Globally recognised credential",
    },
    {
      id: 1,
      title: "SalesX by Virtual Captains",
      subtitle: "Execution-backed sales training platform",
    },
    {
      id: 2,
      title: "Career Placement Support",
      subtitle: "Direct access to Virtual Captains' hiring network",
    },
    {
      id: 3,
      title: "Live CRM & Sales-Call Simulations",
      subtitle: "Practice live enterprise objection handling & CRM navigation",
    },
    {
      id: 4,
      title: "Real Sales-Call Practice, Evaluated by Practitioners",
      subtitle: "Objective feedback from seasoned revenue leaders",
    },
    {
      id: 5,
      title: "VC Certified Badge (LinkedIn-ready)",
      subtitle: "Verifiable competency & closing skill accreditation",
    },
    {
      id: 6,
      title: "Placement Assistance for Top Performers",
      subtitle: "Priority fast-track recruitment opportunities",
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
      !centerTitleRef.current ||
      !leftColRef.current ||
      !rightColRef.current ||
      !wheelWindowRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const cardEls = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cardEls.length < items.length) return;

      const isMobile = window.innerWidth < 1024;
      // Cylinder geometry radius: 155px on mobile, 195px on desktop
      const cylinderRadius = isMobile ? 150 : 195;
      const stepAngleDeg = isMobile ? 27 : 24;

      // 1. Initial entrance states
      gsap.set(centerTitleRef.current, { opacity: 0, scale: 0.85 });
      if (centerAuraRef.current)
        gsap.set(centerAuraRef.current, { opacity: 0, scale: 0.6 });
      gsap.set(leftColRef.current, {
        opacity: 0,
        x: -45,
        pointerEvents: "none",
      });
      gsap.set(rightColRef.current, {
        opacity: 0,
        x: 45,
        pointerEvents: "none",
      });

      // CRITICAL: Set xPercent/yPercent ONCE per card so GSAP never recalculates
      // layout-affecting properties on every frame — this eliminates the jitter.
      gsap.set(cardEls, {
        xPercent: -50,
        yPercent: -50,
        force3D: true,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      });

      /**
       * Front-view 3D Cylindrical Wheel Math:
       * Places every card along the vertical frontal circumference of a cylinder.
       * - Center card (float diff = 0): Y=0, Z=0, rotateX=0, scale=1.03, opacity=1.0 (Highlighted!)
       * - Cards above (diff < 0): Y < 0, Z < 0, rotateX < 0 (tilts backward into background), opacity falls off
       * - Cards below (diff > 0): Y > 0, Z < 0, rotateX > 0 (tilts forward into background), opacity falls off
       */
      const renderCylinderWheel = (currentFloat: number) => {
        cardEls.forEach((card, i) => {
          const delta = i - currentFloat;
          const thetaDeg = delta * stepAngleDeg;
          const thetaRad = (thetaDeg * Math.PI) / 180;
          const absDelta = Math.abs(delta);

          // Front-facing cylindrical wheel coordinates
          // Round y to nearest 0.5px to prevent sub-pixel jitter without visible stutter
          const yRaw = cylinderRadius * Math.sin(thetaRad);
          const y = Math.round(yRaw * 2) / 2;
          // Pin Z to integer pixels to avoid sub-pixel compositor oscillation
          const z = Math.round(cylinderRadius * (Math.cos(thetaRad) - 1));
          const rotateX = -thetaDeg;

          // Graduated order of opacity: Center is 1.0, cards above & below fade out with depth
          const opacity =
            Math.abs(thetaDeg) > 85
              ? 0
              : Math.max(0.06, Math.pow(Math.cos(thetaRad), 3.2));

          const scale = Math.max(0.85, 1.025 - Math.min(absDelta, 2.5) * 0.055);
          const isCenter = absDelta < 0.45;

          // Only mutate GPU-compositable properties per frame.
          // xPercent/yPercent are set once above and NEVER touched again here.
          gsap.set(card, {
            y,
            z,
            rotateX,
            scale,
            opacity,
            force3D: true,
            zIndex: isCenter ? 25 : Math.max(1, 15 - Math.round(absDelta)),
            visibility: opacity > 0.02 ? "visible" : "hidden",
          });

          // Center Highlight: Active card in the middle slot gets pure liquid glass styling
          if (isCenter) {
            card.style.border = "1px solid rgba(56, 189, 248, 0.55)";
            card.style.borderTop = "1px solid rgba(255, 255, 255, 0.5)";
            card.style.boxShadow =
              "inset 0 1px 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 1px 0 rgba(56, 189, 248, 0.15)";
            card.style.background =
              "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(14, 25, 65, 0.5) 40%, rgba(10, 18, 48, 0.65) 100%)";
            card.style.backdropFilter = "blur(24px) saturate(180%)";
            (
              card.style as unknown as Record<string, string>
            ).webkitBackdropFilter = "blur(24px) saturate(180%)";
            const titleEl = card.querySelector(
              ".card-title",
            ) as HTMLElement | null;
            if (titleEl) titleEl.style.color = "#38bdf8";
            const subEl = card.querySelector(
              ".card-subtitle",
            ) as HTMLElement | null;
            if (subEl) subEl.style.color = "#e2e8f0";
          } else {
            card.style.border = "1px solid rgba(255, 255, 255, 0.08)";
            card.style.borderTop = "1px solid rgba(255, 255, 255, 0.14)";
            card.style.boxShadow =
              "inset 0 1px 0.5px 0 rgba(255, 255, 255, 0.1)";
            card.style.background =
              "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(7, 12, 32, 0.4) 50%, rgba(7, 11, 30, 0.55) 100%)";
            card.style.backdropFilter = "blur(16px) saturate(150%)";
            (
              card.style as unknown as Record<string, string>
            ).webkitBackdropFilter = "blur(16px) saturate(150%)";
            const titleEl = card.querySelector(
              ".card-title",
            ) as HTMLElement | null;
            if (titleEl) titleEl.style.color = "#94a3b8";
            const subEl = card.querySelector(
              ".card-subtitle",
            ) as HTMLElement | null;
            if (subEl) subEl.style.color = "#475569";
          }
        });
      };

      // Set initial wheel state centered on Card 0
      renderCylinderWheel(0);

      // 2. Master pinned presentation ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2200",
          pin: stageRef.current,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // Phase 1: Center Blue Gradient & "Individuals" reveal (0.00 -> 0.12)
            if (p < 0.12) {
              const ratio = p / 0.12;
              gsap.set(centerTitleRef.current, {
                opacity: ratio,
                scale: 0.85 + ratio * 0.15,
              });
              if (centerAuraRef.current) {
                gsap.set(centerAuraRef.current, {
                  opacity: ratio,
                  scale: 0.6 + ratio * 0.4,
                });
              }
              gsap.set(leftColRef.current, {
                opacity: 0,
                x: -45,
                pointerEvents: "none",
              });
              gsap.set(rightColRef.current, {
                opacity: 0,
                x: 45,
                pointerEvents: "none",
              });
            }
            // Phase 2: Left & Right columns unfold into 3-column layout (0.12 -> 0.22)
            else if (p < 0.22) {
              const ratio = (p - 0.12) / 0.1;
              gsap.set(centerTitleRef.current, { opacity: 1, scale: 1 });
              if (centerAuraRef.current)
                gsap.set(centerAuraRef.current, { opacity: 1, scale: 1 });

              gsap.set(leftColRef.current, {
                opacity: ratio,
                x: -45 * (1 - ratio),
                pointerEvents: ratio > 0.5 ? "auto" : "none",
              });
              gsap.set(rightColRef.current, {
                opacity: ratio,
                x: 45 * (1 - ratio),
                pointerEvents: ratio > 0.5 ? "auto" : "none",
              });

              // Keep card 0 in center
              renderCylinderWheel(0);
              setActiveCardIndex(0);
            }
            // Phase 3: 3D Cylindrical Wheel Roll (0.22 -> 0.88)
            // As user scrolls, the wheel rotates forward: the next card below replaces the middle card!
            else {
              gsap.set(centerTitleRef.current, { opacity: 1, scale: 1 });
              if (centerAuraRef.current)
                gsap.set(centerAuraRef.current, { opacity: 1, scale: 1 });
              gsap.set(leftColRef.current, {
                opacity: 1,
                x: 0,
                pointerEvents: "auto",
              });
              gsap.set(rightColRef.current, {
                opacity: 1,
                x: 0,
                pointerEvents: "auto",
              });

              const rollRatio = gsap.utils.clamp(
                0,
                1,
                (p - 0.22) / (0.88 - 0.22),
              );
              const currentFloat = rollRatio * (items.length - 1);

              renderCylinderWheel(currentFloat);

              const roundedIndex = Math.round(currentFloat);
              setActiveCardIndex(roundedIndex);
            }
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger || null;
    }, sectionRef);

    return () => ctx.revert();
  }, [items.length]);

  // Clicking any card rotates the wheel directly so that card becomes the highlighted center card
  const handleCardClick = (index: number) => {
    if (!scrollTriggerRef.current) {
      setActiveCardIndex(index);
      return;
    }
    const st = scrollTriggerRef.current;
    // Map card index to progress position in Phase 3
    const progressTarget = 0.22 + (index / (items.length - 1)) * (0.88 - 0.22);
    const targetScroll = st.start + (st.end - st.start) * progressTarget;

    const lenis = (
      window as unknown as {
        __lenis?: { scrollTo: (target: number, opts?: object) => void };
      }
    ).__lenis;
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 0.8, lock: false });
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#030612] select-none overflow-hidden"
    >
      {/* Pinned Stage: Dynamic viewport fit across all devices */}
      <div
        ref={stageRef}
        className="h-dvh min-h-150 w-full flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-8 lg:px-12 py-6"
      >
        {/* Deep Space Background Ambient Glow */}
        <div
          ref={centerAuraRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 sm:w-120 lg:w-162.5 h-75 sm:h-105 bg-radial from-[#1e40af]/30 via-[#312e81]/15 to-transparent blur-[120px] pointer-events-none -z-10 transition-transform duration-300"
        />

        {/* Subtle Constellation Grid Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none -z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(147, 197, 253, 0.35) 1px, transparent 0)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Main Content Grid matching 3-zone layout */}
        <div className="w-full max-w-372 mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* 1. LEFT COLUMN: Value Proposition & Action Buttons */}
            <div
              ref={leftColRef}
              className="lg:col-span-4 text-center lg:text-left flex flex-col items-center lg:items-start pr-0 lg:pr-6 will-change-transform order-2 lg:order-1"
            >
              {/* Eyebrow label */}
              <span className="inline-flex items-center gap-1.5 mb-3 text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-sky-400/80 font-sans">
                <span className="w-4 h-px bg-sky-400/60" />
                For Individuals
                <span className="w-4 h-px bg-sky-400/60" />
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-[1.75rem] xl:text-[2.2rem] font-extrabold tracking-tight text-white leading-[1.2] font-sans">
                Prepare Yourself
                <br />
                for the Deal,
                <br />
                Not Just the Interview
              </h2>

              <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-104 mx-auto lg:mx-0 font-sans">
                Enroll in an execution-backed sales training program built to
                transition students, freshers, and professionals into
                top-performing sellers.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col items-center lg:items-start gap-3 w-full max-w-sm mx-auto lg:mx-0">
                {/* View Course Details */}
                <Link
                  href="/individuals"
                  className="group w-full flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 hover:bg-white/10 hover:border-white/50 px-6 py-3 text-sm font-semibold text-white/90 hover:text-white transition-all duration-300 backdrop-blur-md hover:shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                >
                  <span>View Course Details</span>
                  <svg
                    className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                {/* Book Free Counselling */}
                <Link
                  href="/contact"
                  className="group w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 border border-blue-400/40 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(30,58,138,0.5)] hover:shadow-[0_0_35px_rgba(56,189,248,0.45)] transition-all duration-300 transform hover:scale-[1.015] active:scale-[0.985]"
                >
                  <span>Book Free Counselling</span>
                  <svg
                    className="w-4 h-4 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* 2. CENTER COLUMN: Flanked by vertical hairline dividers with gradient "Individuals" */}
            <div className="lg:col-span-4 relative flex items-center justify-center min-h-20 sm:min-h-35 lg:min-h-115 order-1 lg:order-2">
              {/* Left Vertical Glowing Hairline Divider */}
              <div className="hidden lg:block absolute left-0 top-6 bottom-6 w-px bg-linear-to-b from-transparent via-blue-500/35 to-transparent" />

              {/* Center Gradient Title: Orange -> Pink -> Purple -> Cyan */}
              <div
                ref={centerTitleRef}
                className="relative px-4 text-center will-change-transform"
              >
                <span
                  className="text-3xl sm:text-4xl lg:text-[2.6rem] xl:text-[3.25rem] font-extrabold tracking-tight bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(168,85,247,0.4)] font-sans select-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #ff6b35 0%, #ff477e 25%, #a855f7 50%, #38bdf8 75%, #60a5fa 100%)",
                  }}
                >
                  Individuals
                </span>
              </div>

              {/* Right Vertical Glowing Hairline Divider */}
              <div className="hidden lg:block absolute right-0 top-6 bottom-6 w-px bg-linear-to-b from-transparent via-blue-500/35 to-transparent" />
            </div>

            {/* 3. RIGHT COLUMN: Frontal 3D Cylindrical Roller Wheel */}
            <div
              ref={rightColRef}
              className="lg:col-span-4 relative flex items-center justify-center pl-0 lg:pl-4 will-change-transform order-3"
            >
              {/* 3D Wheel Viewing Stage */}
              <div
                ref={wheelWindowRef}
                className="relative w-full max-w-md h-90 sm:h-105 lg:h-115 flex items-center justify-center"
                style={{
                  perspective: "1100px",
                  perspectiveOrigin: "center center",
                  // Mask lives on a separate stacking context so it never forces
                  // the composited card layer to repaint during scroll.
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
                  // Isolate this stacking context so child GPU layers don't leak
                  isolation: "isolate",
                  // Force the container itself onto the compositor
                  transform: "translateZ(0)",
                  willChange: "transform",
                }}
              >
                {/* Cards mounted on the virtual 3D front-view cylinder with liquid glass styling */}
                {items.map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      ref={(el) => {
                        cardRefs.current[index] = el;
                      }}
                      onClick={() => handleCardClick(index)}
                      className="absolute w-[88%] max-w-xs sm:max-w-sm cursor-pointer rounded-2xl backdrop-blur-2xl p-3.5 sm:p-4 border select-none will-change-transform overflow-hidden flex items-center justify-center text-center"
                      style={{
                        // Static layout anchor — GSAP's xPercent/yPercent use these as origin.
                        // They are pure CSS, never written by GSAP on each frame.
                        top: "50%",
                        left: "50%",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        // Disable CSS transitions — GSAP owns all transforms
                        transition: "none",
                      }}
                    >
                      {/* Specular liquid glass top sheen */}
                      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                      <div className="text-center flex flex-col items-center justify-center w-full relative z-10">
                        <h4 className="card-title text-xs sm:text-sm font-semibold text-center transition-colors duration-200">
                          {item.title}
                        </h4>

                        {item.subtitle && (
                          <p className="card-subtitle mt-0.5 text-[10px] sm:text-xs leading-relaxed text-center transition-colors duration-200">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
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
