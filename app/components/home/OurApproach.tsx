"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * 3-step sequence:
 * 1. Heading ("Simulated by AI / Validated by humans")
 * 2. Main Illustration (/home/approach1.svg)
 * 3. Sub-text ("The approach is built on repetition and evaluation...")
 *
 * Coordinates (x, y) sit exactly on the quadratic bezier curve:
 * Path: M 320 20 Q 100 220 320 420 (in viewBox 0 0 320 440)
 * - t = 0.16 -> (260.9, 84.0)
 * - t = 0.50 -> (140.0, 220.0)
 * - t = 0.84 -> (260.9, 356.0)
 */
const PAGINATION_STEPS = [
  {
    number: 1,
    label: "Heading",
    x: 244.6,
    y: 73.2,
  },
  {
    number: 2,
    label: "AI Rehearsal",
    x: 185.0,
    y: 210.0,
  },
  {
    number: 3,
    label: "Sub-text",
    x: 244.6,
    y: 346.8,
  },
];

export default function OurApproach() {
  const sectionRef = useRef<HTMLElement>(null);

  // Step 1: Heading elements
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  // Step 2: Main illustration element
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<HTMLImageElement>(null);

  // Step 3: Sub-text elements
  const subtextWrapperRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const applyStepStyles = (step: number) => {
    setActiveStep(step);
    if (step === 0) {
      gsap.to(imageWrapperRef.current, { opacity: 0, duration: 0.4 });
      gsap.to(illustrationRef.current, {
        clipPath: "inset(0 100% 0 0)",
        duration: 0.4,
      });
      gsap.to(subtextWrapperRef.current, { opacity: 0, y: 20, duration: 0.4 });
    } else if (step === 1) {
      gsap.to(imageWrapperRef.current, { opacity: 1, duration: 0.4 });
      gsap.to(illustrationRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.5,
      });
      gsap.to(subtextWrapperRef.current, { opacity: 0, y: 20, duration: 0.4 });
    } else if (step === 2) {
      gsap.to(imageWrapperRef.current, { opacity: 1, duration: 0.4 });
      gsap.to(illustrationRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.5,
      });
      gsap.to(subtextWrapperRef.current, { opacity: 1, y: 0, duration: 0.5 });
    }
  };

  const goToStep = (stepIndex: number) => {
    setActiveStep(stepIndex);
    const st = scrollTriggerRef.current;
    if (st && window.innerWidth >= 1024) {
      const start = st.start;
      const end = st.end;
      const total = end - start;
      const targets = [0.08, 0.5, 0.92];
      const targetScroll = start + targets[stepIndex] * total;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    } else {
      applyStepStyles(stepIndex);
    }
  };

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            eyebrowRef.current,
            line1Ref.current,
            line2Ref.current,
            imageWrapperRef.current,
            subtextWrapperRef.current,
          ],
          { opacity: 1, y: 0 },
        );
        gsap.set(illustrationRef.current, { clipPath: "none" });
        return;
      }

      // Initial state before entrance
      gsap.set([eyebrowRef.current, line1Ref.current, line2Ref.current], {
        opacity: 0,
        y: 24,
      });
      gsap.set(imageWrapperRef.current, {
        opacity: 0,
      });
      gsap.set(illustrationRef.current, {
        clipPath: "inset(0 100% 0 0)",
      });
      gsap.set(subtextWrapperRef.current, {
        opacity: 0,
        y: 20,
      });

      // ---------------------------------------------------------------------
      // 1. ENTRANCE: Reveal Heading on approach
      // ---------------------------------------------------------------------
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      });

      entranceTl
        .to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        })
        .to(
          line1Ref.current,
          { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
          "-=0.35",
        )
        .to(
          line2Ref.current,
          { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
          "-=0.42",
        );

      const mm = gsap.matchMedia();

      // ---------------------------------------------------------------------
      // 2. DESKTOP: Pinned Step-by-Step scrub (Heading -> Image -> Sub-text)
      // ---------------------------------------------------------------------
      mm.add("(min-width: 1024px)", () => {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
              const p = self.progress;
              if (p < 0.34) {
                setActiveStep(0);
              } else if (p < 0.67) {
                setActiveStep(1);
              } else {
                setActiveStep(2);
              }
            },
          },
        });

        scrollTriggerRef.current = pinTl.scrollTrigger || null;

        // Step 1: Heading is visible (from entrance). Hold from 0 to 0.15.
        // Step 2: Reveal Image between 0.15 and 0.45
        pinTl.to(
          imageWrapperRef.current,
          { opacity: 1, duration: 0.1, ease: "power1.out" },
          0.15,
        );
        pinTl.to(
          illustrationRef.current,
          { clipPath: "inset(0 0% 0 0)", duration: 0.35, ease: "power1.inOut" },
          0.15,
        );

        // Step 3: Reveal Sub-text between 0.55 and 0.85
        pinTl.to(
          subtextWrapperRef.current,
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          0.55,
        );

        // Hold at end to view complete section comfortably
        pinTl.to({}, { duration: 0.15 });

        const spacer = (pinTl.scrollTrigger as unknown as { spacer?: HTMLElement })?.spacer;
        if (spacer) {
          spacer.style.backgroundColor = "#ffffff";
        }

        return () => {
          pinTl.kill();
          scrollTriggerRef.current = null;
        };
      });

      // ---------------------------------------------------------------------
      // 3. MOBILE / TABLET: Scroll scrub through 1 -> 2 -> 3
      // ---------------------------------------------------------------------
      mm.add("(max-width: 1023px)", () => {
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 30%",
            scrub: true,
            onUpdate: (self) => {
              const p = self.progress;
              if (p < 0.34) {
                setActiveStep(0);
              } else if (p < 0.67) {
                setActiveStep(1);
              } else {
                setActiveStep(2);
              }
            },
          },
        });

        mobileTl.to(
          imageWrapperRef.current,
          { opacity: 1, duration: 0.15 },
          0.15,
        );
        mobileTl.to(
          illustrationRef.current,
          { clipPath: "inset(0 0% 0 0)", duration: 0.35 },
          0.15,
        );
        mobileTl.to(
          subtextWrapperRef.current,
          { opacity: 1, y: 0, duration: 0.3 },
          0.55,
        );

        return () => mobileTl.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-nav-section="The Model"
      data-nav-theme="light"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-[clamp(28px,5vh,72px)] text-[#101010] sm:px-10 lg:px-16"
    >
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.13) 0.65px, transparent 0.65px)",
          backgroundSize: "9px 9px",
        }}
      />

      {/* ---------- RIGHT-SIDE SCROLL-DRIVEN ARC & 3 BUBBLES ---------- */}
      <div className="pointer-events-none absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 lg:block h-[clamp(320px,48vh,440px)] w-[300px]">
        <svg viewBox="0 0 300 420" className="h-full w-full overflow-visible">
          {/* Subtle glow behind arc */}
          <path
            d="M 300 20 Q 70 210 300 400"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="3.5"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          {/* Main Curved Guide Line */}
          <path
            d="M 300 20 Q 70 210 300 400"
            stroke="rgba(0,0,0,0.16)"
            strokeWidth="1.5"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          {/* 3 Pagination Bubbles & Labels */}
          {PAGINATION_STEPS.map((step, i) => {
            const isActive = activeStep === i;

            return (
              <g
                key={step.number}
                onClick={() => goToStep(i)}
                className="cursor-pointer pointer-events-auto group"
              >
                {/* Step Label to the left of the bubble */}
                <text
                  x={step.x - 18}
                  y={step.y + 4}
                  textAnchor="end"
                  className="select-none font-sans transition-all duration-300 ease-out"
                  fill={isActive ? "#101010" : "rgba(0,0,0,0.4)"}
                  fontSize={isActive ? "12" : "11"}
                  fontWeight={isActive ? "700" : "500"}
                  letterSpacing="0.02em"
                >
                  {step.label}
                </text>

                {/* Ambient Glow behind active bubble */}
                {isActive && (
                  <circle
                    cx={step.x}
                    cy={step.y}
                    r="17"
                    fill="rgba(231,255,61,0.45)"
                    className="animate-pulse"
                  />
                )}

                {/* Bubble Circle - Perfectly Centered on the Line */}
                <circle
                  cx={step.x}
                  cy={step.y}
                  r={isActive ? "12" : "9.5"}
                  fill={isActive ? "#e7ff3d" : "#ffffff"}
                  stroke={isActive ? "#0a0b0d" : "rgba(0,0,0,0.25)"}
                  strokeWidth={isActive ? "2" : "1.25"}
                  className="transition-all duration-300 ease-out group-hover:stroke-[#3478e5]"
                />

                {/* Number 1, 2, 3 inside the bubble */}
                <text
                  x={step.x}
                  y={step.y + (isActive ? 3.5 : 3)}
                  textAnchor="middle"
                  className="select-none font-sans transition-all duration-300 ease-out"
                  fill={isActive ? "#0a0b0d" : "rgba(0,0,0,0.55)"}
                  fontSize={isActive ? "10.5" : "9"}
                  fontWeight={isActive ? "800" : "600"}
                >
                  {step.number}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Main Content Flow */}
      <div className="relative flex w-full max-w-[1920px] flex-col items-center">
        {/* ---------- STEP 1: EYEBROW + HEADING ---------- */}
        <span
          ref={eyebrowRef}
          className="mb-[clamp(14px,2.5vh,36px)] block text-center font-mono text-[10px] uppercase tracking-[0.14em] text-black/50 sm:tracking-[0.25em]"
        >
          AI &nbsp;·&nbsp; Human &nbsp;·&nbsp; Two Strengths &nbsp;·&nbsp; One Edge
        </span>

        <h2 className="max-w-3xl text-center font-serif text-[clamp(1.5rem,1.6vw+1.2vh,2.5rem)] font-normal leading-[1.2]">
          <span ref={line1Ref} className="block text-[#101010]">
            Simulated by AI
          </span>
          <span ref={line2Ref} className="block italic text-[#3478e5]">
            Validated by humans
          </span>
        </h2>

        {/* ---------- UNIFIED STAGE CONTENT ---------- */}
        <div className="mt-[clamp(20px,3.5vh,44px)] flex w-full flex-col items-center">
          {/* STEP 2: Main Illustration (Single artwork) */}
          <div
            ref={imageWrapperRef}
            className="w-full max-w-[min(880px,90vh)] lg:max-w-[min(880px,90vh,calc(100vw-560px))]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={illustrationRef}
              src="/home/approach1.svg"
              alt="AI and human collaboration in sales rehearsal"
              width={949}
              height={317}
              className="h-auto w-full brightness-[1.01] mix-blend-darken"
            />
          </div>

          {/* STEP 3: Sub-text block */}
          <div
            ref={subtextWrapperRef}
            className="mt-[clamp(16px,3vh,40px)] flex flex-col items-center text-center"
          >
            <p
              ref={subheadingRef}
              className="font-serif text-[clamp(1.05rem,0.7vw+0.6vh,1.35rem)] italic text-black/85"
            >
              The approach is built on repetition and evaluation.
            </p>

            <p
              ref={paragraphRef}
              className="mx-auto mt-3 max-w-150 font-sans text-[13px] leading-relaxed text-black/60 sm:text-[14px]"
            >
              AI powers the repetition through real-time rehearsal systems,
              generating infinite scenarios so reps walk into every real
              conversation already warmed up.
            </p>
          </div>
        </div>

        {/* Mobile / Tablet Stage Selector (Pills 1, 2, 3) */}
        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-2 px-3 lg:hidden">
          {PAGINATION_STEPS.map((step, idx) => (
            <button
              key={step.number}
              type="button"
              onClick={() => goToStep(idx)}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-[11.5px] font-medium transition-all duration-300 ${
                activeStep === idx
                  ? "bg-[#101010] text-[#e7ff3d] shadow-sm scale-105"
                  : "bg-black/5 text-black/60 hover:bg-black/10"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                  activeStep === idx
                    ? "bg-[#e7ff3d] text-[#0a0b0d]"
                    : "bg-black/20 text-white"
                }`}
              >
                {step.number}
              </span>
              {step.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
