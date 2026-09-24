"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DottedBackground from "./DottedBackground";

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
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [activeStep, setActiveStep] = useState(0);

  const prevIndex = (activeStep - 1 + 4) % 4;
  const nextIndex = (activeStep + 1) % 4;

  const activeSlide = MODEL_SLIDES[activeStep];
  const prevSlide = MODEL_SLIDES[prevIndex];
  const nextSlide = MODEL_SLIDES[nextIndex];

  const goToStep = (stepIndex: number) => {
    setActiveStep(stepIndex);

    const st = scrollTriggerRef.current;
    if (st && typeof window !== "undefined" && window.innerWidth >= 1024) {
      const start = st.start;
      const end = st.end;
      const total = end - start;
      const targets = [0.08, 0.35, 0.65, 0.92];
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
      const mm = gsap.matchMedia();

      // Desktop: Pinned scroll through the 4 capability slides
      mm.add("(min-width: 1024px)", () => {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            id: "model-pin",
            trigger: sectionRef.current,
            start: "top top",
            end: "+=240%",
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
              const p = self.progress;
              // Divide into 4 quarters: [0 - 0.25], [0.25 - 0.5], [0.5 - 0.75], [0.75 - 1.0]
              const step = Math.min(3, Math.floor(p * 4));
              setActiveStep(step);
            },
          },
        });

        scrollTriggerRef.current = pinTl.scrollTrigger || null;

        const spacer = (
          pinTl.scrollTrigger as unknown as { spacer?: HTMLElement }
        )?.spacer;
        if (spacer) {
          spacer.style.backgroundColor = "#ffffff";
        }

        return () => {
          pinTl.kill();
          scrollTriggerRef.current = null;
        };
      });

      // Mobile / Tablet: Smooth scrub
      mm.add("(max-width: 1023px)", () => {
        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 30%",
            scrub: true,
            onUpdate: (self) => {
              const p = self.progress;
              const step = Math.min(3, Math.floor(p * 4));
              setActiveStep(step);
            },
          },
        });

        return () => mobileTl.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      data-nav-section="The Model"
      data-nav-theme="light"
      className="relative flex h-screen max-h-dvh w-full flex-col justify-between overflow-hidden bg-white px-4 sm:px-8 lg:px-12 pt-24 pb-6 sm:pb-8 lg:pt-26 lg:pb-8 text-[#101010]"
    >
      {/* Subtle Dotted Background Grid (matching second section) */}
      <DottedBackground theme="light" />

      <div className="relative z-10 mx-auto flex h-full max-h-dvh w-full max-w-375 flex-col justify-between items-center">
        {/* ============================================================
            1. CONSTANT TOP HEADER (Below Floating Navbar)
        ============================================================ */}
        <div className="text-center pt-1 sm:pt-2 shrink-0">
          <span className="block font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.24em] text-black/45 mb-1.5 sm:mb-2">
            target. engage. Convert.
          </span>
          <h2 className="font-serif text-[clamp(1.55rem,2.2vw,2.4rem)] font-normal leading-[1.12] text-[#101010]">
            <span className="italic text-[#1d63ed] block">
              A Complete Sales Engine
            </span>
            <span className="block mt-0.5">
              for Modern Businesses
            </span>
          </h2>
        </div>

        {/* ============================================================
            2. CENTER CONTENT STAGE (Illustration + Bottom Copy)
            w-full max-w-xl ensures text never squishes or clips
        ============================================================ */}
        <div className="relative flex flex-col items-center justify-center flex-1 w-full max-w-xl lg:max-w-2xl mx-auto min-h-0 my-auto py-2">
          {/* Active Illustration Stage */}
          <div className="relative h-40 sm:h-46.25 lg:h-51.25 xl:h-56.25 max-h-[28vh] w-full flex items-center justify-center shrink-0">
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
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-auto max-h-full object-contain select-none mix-blend-multiply"
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Dynamic Description & Bold Tagline */}
          <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center px-4 shrink-0 mt-3 sm:mt-4">
            <p className="font-sans text-[13px] sm:text-[14px] leading-relaxed text-black/75 max-w-lg mx-auto transition-opacity duration-300">
              {activeSlide.description}
            </p>
            <p className="mt-2 font-sans text-[14px] sm:text-[15.5px] font-bold tracking-wider text-[#101010] transition-opacity duration-300">
              {activeSlide.tagline}
            </p>
          </div>
        </div>

        {/* ============================================================
            3. MOBILE / TABLET PILL BUTTON SELECTOR (< 1024px)
        ============================================================ */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 lg:hidden pb-1 shrink-0">
          {MODEL_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToStep(idx)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeStep === idx
                  ? "bg-[#101010] text-[#e7ff3d] shadow-sm font-semibold scale-102"
                  : "bg-black/6 text-black/60 hover:bg-black/10"
              }`}
            >
              <span className="mr-1 opacity-60 font-mono text-[9px]">
                {slide.number}
              </span>
              {slide.title}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================
          4. RIGHT-HAND SIDE CURVATURE DIAL (Desktop >= 1024px)
          Features clean 3-node arc: Previous (top), Active (center apex), Next (bottom)
      ============================================================ */}
      <div className="pointer-events-none absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 lg:block h-115 w-80 xl:w-90">
        <svg viewBox="0 0 320 460" className="h-full w-full overflow-visible">
          {/* Subtle Ambient Arc Glow */}
          <path
            d="M 300 20 Q -20 230 300 440"
            stroke="rgba(0,0,0,0.03)"
            strokeWidth="3.5"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          {/* Main Curved Guide Line */}
          <path
            d="M 300 20 Q -20 230 300 440"
            stroke="rgba(0,0,0,0.16)"
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
              className="select-none transition-all duration-300 ease-out group-hover:fill-black"
              style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              fill="rgba(0,0,0,0.42)"
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
              fill="#ffffff"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth={1.4}
              className="transition-all duration-300 group-hover:stroke-[#1d63ed]"
            />
          </g>

          {/* 2. CENTER NODE: Current Active Capability (At the Apex) */}
          <g className="pointer-events-auto">
            <text
              x={120}
              y={224}
              textAnchor="end"
              className="select-none transition-all duration-300 ease-out"
              style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              fill="#101010"
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
              className="select-none transition-all duration-300 ease-out group-hover:fill-black"
              style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
              fill="rgba(0,0,0,0.42)"
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
              fill="#ffffff"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth={1.4}
              className="transition-all duration-300 group-hover:stroke-[#1d63ed]"
            />
          </g>
        </svg>
      </div>
    </section>
  );
}
