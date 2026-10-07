"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DottedBackground from "./DottedBackground";
import { NO_PIN_QUERY, PIN_QUERY } from "./pinQuery";

import { HEADING_REVEAL, HEADING_REVEAL_FROM } from "@/lib/animations/headingReveal";
gsap.registerPlugin(ScrollTrigger);

interface ModelSlide {
  id: string;
  number: string;
  title: string;
  shortLabel: string[];
  tagline: string;
  description: string;
  image: string;
}

const AUTOPLAY_MS = 4500;

const MODEL_SLIDES: ModelSlide[] = [
  {
    id: "outbound",
    number: "01",
    title: "Outbound Lead Generation",
    shortLabel: ["Outbound Lead", "Generation"],
    tagline: "MORE PIPELINE. REAL OPPORTUNITIES.",
    description:
      "Find, reach and engage the right prospects. We help you start more conversations with decision-makers and fill your pipeline with real opportunities.",
    image: "/home/models/Outbond.webp",
  },
  {
    id: "consulting",
    number: "02",
    title: "Sales Consulting",
    shortLabel: ["Sales", "Consulting"],
    tagline: "STRATEGY. PROCESS. REVENUE.",
    description:
      "Build a stronger sales strategy, sharpen your processes and identify the opportunities that can move revenue forward.",
    image: "/home/models/sales training.webp",
  },
  {
    id: "team",
    number: "03",
    title: "Team Development",
    shortLabel: ["Team", "Development"],
    tagline: "PEOPLE. PERFORMANCE. RESULTS.",
    description:
      "We help you build and train sales teams that know how to prospect, communicate, handle objections and close with confidence.",
    image: "/home/models/team dev.webp",
  },
  {
    id: "personal",
    number: "04",
    title: "Personal Sales Training",
    shortLabel: ["Personal", "Sales Training"],
    tagline: "SKILLS. CONFIDENCE. GROWTH.",
    description:
      "Practical training, coaching and mentoring for sales professionals to strengthen their skills and perform better.",
    image: "/home/models/personal.webp",
  },
];

export default function OurApproach() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [activeStep, setActiveStep] = useState(0);
  // Non-pinned layouts (phones, tablets, short windows) run the slides as a
  // timed carousel instead of tying them to scroll position.
  const [isPinned, setIsPinned] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const autoplay = !isPinned && onScreen && !paused && !reduceMotion;

  useEffect(() => {
    const pinMq = window.matchMedia(PIN_QUERY);
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setIsPinned(pinMq.matches);
      setReduceMotion(motionMq.matches);
    };
    sync();
    pinMq.addEventListener("change", sync);
    motionMq.addEventListener("change", sync);

    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.35 },
    );
    if (node) observer.observe(node);

    return () => {
      pinMq.removeEventListener("change", sync);
      motionMq.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, []);

  // Restarting on every step change gives each slide its full time, including
  // right after the user taps a pill.
  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(
      () => setActiveStep((step) => (step + 1) % MODEL_SLIDES.length),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [autoplay, activeStep]);

  const prevIndex = (activeStep - 1 + 4) % 4;
  const nextIndex = (activeStep + 1) % 4;

  const activeSlide = MODEL_SLIDES[activeStep];
  const prevSlide = MODEL_SLIDES[prevIndex];
  const nextSlide = MODEL_SLIDES[nextIndex];

  const goToStep = (stepIndex: number) => {
    setActiveStep(stepIndex);

    const st = scrollTriggerRef.current;
    if (st && window.matchMedia(PIN_QUERY).matches) {
      const start = st.start;
      const end = st.end;
      const total = end - start;
      const targets = [0.06, 0.25, 0.48, 0.68];
      const targetScroll = start + targets[stepIndex] * total;

      if (window.__lenis) {
        window.__lenis.scrollTo(targetScroll, { duration: 1.1, lock: false });
      } else {
        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    }
  };

  useGSAP(
    () => {
      // Signature Zoom-in Heading Entrance
      if (headerRef.current) {
        gsap.set(headerRef.current, {
          ...HEADING_REVEAL_FROM,
          transformOrigin: "center center",
        });

        gsap.to(headerRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          ...HEADING_REVEAL,
        });
      }

      const mm = gsap.matchMedia();

      // Desktop: Pinned scroll through the 4 capability slides — no curtain exit
      mm.add(PIN_QUERY, () => {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            id: "model-pin",
            trigger: sectionRef.current,
            start: "top top",
            end: () =>
              "+=" +
              (typeof window !== "undefined" ? window.innerHeight : 900) * 3.2,
            pin: true,
            anticipatePin: 1,
            scrub: 0.5,
            onUpdate: (self) => {
              const p = self.progress;
              const step = Math.min(3, Math.floor(p * 4));
              setActiveStep(step);
            },
          },
        });

        // Give room to scroll through the 4 capability slides
        pinTl.to({}, { duration: 3.0 });

        scrollTriggerRef.current = pinTl.scrollTrigger || null;

        return () => {
          pinTl.kill();
          scrollTriggerRef.current = null;
        };
      });

      // Mobile / Tablet / short windows: timed carousel (see autoplay effect)
      mm.add(NO_PIN_QUERY, () => {
        gsap.set(sectionRef.current, { clearProps: "transform" });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      data-nav-section="The Model"
      data-nav-theme="dark"
      className="relative -mt-px z-10 flex min-h-0 pin:h-screen pin:max-h-dvh w-full flex-col justify-center pin:justify-between overflow-hidden px-4 sm:px-8 pin:px-12 py-10 sm:py-14 pin:pt-26 pin:pb-8 text-white"
      style={{
        background: "linear-gradient(180deg, #0c318f 0%, #051d5c 40%, #050b24 75%, #040507 100%)",
      }}
    >
      {/* Subtle Dotted Background Grid */}
      <DottedBackground theme="dark" />

      <div className="relative z-10 mx-auto flex w-full max-w-375 flex-col justify-center pin:justify-between items-center gap-5 sm:gap-6 pin:gap-0 pin:h-full pin:max-h-dvh">
        {/* ============================================================
            1. CONSTANT TOP HEADER
        ============================================================ */}
        <div ref={headerRef} className="text-center pt-1 sm:pt-2 shrink-0">
          <span className="block font-sans text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.24em] text-white/40 mb-1.5 sm:mb-2">
            target. engage. Convert.
          </span>
          <h2 className="font-sans text-[clamp(1.4rem,4.2vw,2.4rem)] font-normal leading-[1.15] text-white">
            <span className="italic text-[#4d82f5] block">
              A Complete Sales Engine
            </span>
            <span className="block mt-0.5">for Modern Businesses</span>
          </h2>
        </div>

        {/* ============================================================
            2. CENTER CONTENT STAGE (Illustration + Bottom Copy)
        ============================================================ */}
        <div className="relative flex flex-col items-center justify-center flex-1 w-full max-w-xl pin:max-w-2xl mx-auto min-h-0 my-auto py-2">
          {/* Active Illustration Stage */}
          <div className="relative h-44 sm:h-52 pin:h-64 pin-xl:h-72 max-h-[34vh] w-full flex items-center justify-center shrink-0">
            {MODEL_SLIDES.map((slide, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-400 ease-out ${
                    isActive
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-auto max-h-full object-contain select-none brightness-110 contrast-110"
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Dynamic Description & Bold Tagline */}
          <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center px-4 shrink-0 mt-3 sm:mt-4">
            <p className="font-sans text-[13px] sm:text-[14px] leading-relaxed text-white/70 max-w-lg mx-auto transition-opacity duration-300">
              {activeSlide.description}
            </p>
            <p className="mt-2 font-sans text-[13.5px] sm:text-[15px] font-bold tracking-wider text-white transition-opacity duration-300">
              {activeSlide.tagline}
            </p>
          </div>
        </div>

        {/* ============================================================
            3. MOBILE / TABLET PILL BUTTON SELECTOR (< 1024px)
        ============================================================ */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 mt-2 pin:hidden pb-1 shrink-0 max-w-md"
          onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {MODEL_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToStep(idx)}
              aria-pressed={activeStep === idx}
              className={`relative overflow-hidden inline-flex min-h-9 items-center px-3.5 rounded-full text-[12px] font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                activeStep === idx
                  ? "bg-[#e7ff3d] text-[#0a0b0d] shadow-sm font-semibold scale-102"
                  : "bg-white/8 text-white/60 hover:bg-white/15"
              }`}
            >
              <span className="mr-1 opacity-60 font-sans text-[9px]">
                {slide.number}
              </span>
              {slide.title}
              {/* Autoplay countdown — mirrors the timer: remounts (restarts)
                  on every slide and hides while autoplay is paused */}
              {activeStep === idx && autoplay && (
                <span
                  key={activeStep}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#0a0b0d]/35"
                  style={{ animation: `vc-fill ${AUTOPLAY_MS}ms linear forwards` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================
          4. RIGHT-HAND SIDE CURVATURE DIAL (Desktop >= 1024px)
      ============================================================ */}
      <div className="pointer-events-none absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 pin:block h-115 w-80 pin-xl:w-90">
        <svg viewBox="0 0 320 460" className="h-full w-full overflow-visible">
          {/* Subtle Ambient Arc Glow */}
          <path
            d="M 300 20 Q -20 230 300 440"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="3.5"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          {/* Main Curved Guide Line */}
          <path
            d="M 300 20 Q -20 230 300 440"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.25"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          {/* 1. TOP NODE: Previous Capability */}
          <g
            onClick={() => goToStep(prevIndex)}
            className="cursor-pointer pointer-events-auto group"
          >
            <text
              x={188}
              y={90}
              textAnchor="end"
              className="select-none transition-all duration-300 ease-out group-hover:fill-white"
              style={{ fontFamily: "var(--font-sans)" }}
              fill="rgba(255,255,255,0.42)"
              fontSize="12.5"
              fontWeight="400"
            >
              <tspan x={188} dy={0}>
                {prevSlide.shortLabel[0]}
              </tspan>
              <tspan x={188} dy={15}>
                {prevSlide.shortLabel[1]}
              </tspan>
            </text>
            <circle
              cx={205}
              cy={96}
              r={5.5}
              fill="transparent"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={1.4}
              className="transition-all duration-300 group-hover:stroke-[#4d82f5]"
            />
          </g>

          {/* 2. CENTER NODE: Current Active Capability (At the Apex) */}
          <g className="pointer-events-auto">
            <text
              x={120}
              y={224}
              textAnchor="end"
              className="select-none transition-all duration-300 ease-out"
              style={{ fontFamily: "var(--font-sans)" }}
              fill="#ffffff"
              fontSize="18"
              fontWeight="700"
              letterSpacing="-0.01em"
            >
              <tspan x={120} dy={0}>
                {activeSlide.shortLabel[0]}
              </tspan>
              <tspan x={120} dy={22}>
                {activeSlide.shortLabel[1]}
              </tspan>
            </text>

            {/* Glowing Ambient Halo when Active */}
            <circle
              cx={140}
              cy={230}
              r={18}
              fill="rgba(231,255,61,0.42)"
              className="animate-pulse"
            />

            {/* Bright Yellow Apex Node Circle */}
            <circle
              cx={140}
              cy={230}
              r={9.5}
              fill="#e7ff3d"
              stroke="#0a0b0d"
              strokeWidth={2}
            />
          </g>

          {/* 3. BOTTOM NODE: Next Capability */}
          <g
            onClick={() => goToStep(nextIndex)}
            className="cursor-pointer pointer-events-auto group"
          >
            <text
              x={188}
              y={358}
              textAnchor="end"
              className="select-none transition-all duration-300 ease-out group-hover:fill-white"
              style={{ fontFamily: "var(--font-sans)" }}
              fill="rgba(255,255,255,0.42)"
              fontSize="12.5"
              fontWeight="400"
            >
              <tspan x={188} dy={0}>
                {nextSlide.shortLabel[0]}
              </tspan>
              <tspan x={188} dy={15}>
                {nextSlide.shortLabel[1]}
              </tspan>
            </text>
            <circle
              cx={205}
              cy={364}
              r={5.5}
              fill="transparent"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={1.4}
              className="transition-all duration-300 group-hover:stroke-[#4d82f5]"
            />
          </g>
        </svg>
      </div>
    </section>
  );
}

