import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DottedBackground from "./DottedBackground";

import { HEADING_REVEAL, HEADING_REVEAL_FROM } from "@/lib/animations/headingReveal";
const ORG_ITEMS = [
  { title: "Grooming Studio", desc: "Induction and onboarding", accent: false },
  { title: "Sales Audit", desc: "Identifying the blind spot", accent: false },
  {
    title: "Outbound Lead Generation",
    desc: "Target prospects directly and build a stronger sales pipeline",
    accent: false,
  },
  {
    title: "SalesX",
    desc: "Execution training for existing teams",
    accent: true,
  },
];

const INDIVIDUAL_ITEMS = [
  {
    title: "Skill Up",
    desc: "Master the fundamentals of conversational sales",
    accent: false,
  },
  { title: "Mock Scenarios", desc: "Practice with AI personas", accent: false },
  {
    title: "Performance Analytics",
    desc: "Track your progress and identify areas for improvement",
    accent: false,
  },
  {
    title: "Pro Certification",
    desc: "Get certified as a top-tier closer",
    accent: true,
  },
];

export interface TwoAudiencesRef {
  getTimeline: () => gsap.core.Timeline;
  jumpToProgress: (progress: number) => void;
}

const TwoAudiences = forwardRef<TwoAudiencesRef, {}>((props, ref) => {
  const sectionRef = useRef<HTMLElement>(null);

  const topTitleRef = useRef<HTMLParagraphElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const headlineLine3Ref = useRef<HTMLSpanElement>(null);

  const rhsContainerRef = useRef<HTMLDivElement>(null);
  const centerDividerRef = useRef<HTMLDivElement>(null);
  const orgsTextRef = useRef<HTMLDivElement>(null);
  const individualsTextRef = useRef<HTMLDivElement>(null);

  const dot1Ref = useRef<HTMLSpanElement>(null);
  const dot2Ref = useRef<HTMLSpanElement>(null);

  const scrubTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const [activeAudience, setActiveAudience] = useState<"orgs" | "individuals">(
    "orgs",
  );

  const toggleAudience = (target: "orgs" | "individuals") => {
    setActiveAudience(target);
    if (scrubTimelineRef.current) {
      gsap.to(scrubTimelineRef.current, {
        progress: target === "orgs" ? 0 : 1,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  useGSAP(
    () => {
      // 1. Ensure layout elements are cleanly positioned & visible for Stage 2
      gsap.set(
        [
          topTitleRef.current,
          headlineRef.current,
          headlineLine1Ref.current,
          headlineLine2Ref.current,
          headlineLine3Ref.current,
          rhsContainerRef.current,
          bottomNavRef.current,
          centerDividerRef.current,
        ],
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          clearProps: "transform",
        },
      );

      // 2. Set initial audience states: Organisations visible, Individuals hidden
      gsap.set(orgsTextRef.current, {
        opacity: 1,
        y: 0,
        rotate: 0,
        pointerEvents: "auto",
      });
      gsap.set(individualsTextRef.current, {
        opacity: 0,
        y: 35,
        rotate: 4,
        pointerEvents: "none",
      });
      gsap.set(dot1Ref.current, {
        backgroundColor: "#ffffff",
        borderColor: "transparent",
        scale: 1.25,
      });
      gsap.set(dot2Ref.current, {
        backgroundColor: "rgba(255,255,255,0.3)",
        borderColor: "rgba(255,255,255,0.5)",
        scale: 1,
      });

      // 3. Build smooth scrub timeline for audience crossfade (progress 0 = Orgs, progress 1 = Individuals)
      const tl = gsap.timeline({ paused: true });

      tl.to(
        orgsTextRef.current,
        {
          opacity: 0,
          y: -35,
          rotate: -4,
          pointerEvents: "none",
          duration: 0.4,
          ease: "power2.inOut",
        },
        0.3,
      );

      tl.to(
        individualsTextRef.current,
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          pointerEvents: "auto",
          duration: 0.4,
          ease: "power2.inOut",
        },
        0.3,
      );

      tl.to(
        dot1Ref.current,
        {
          backgroundColor: "rgba(255,255,255,0.3)",
          borderColor: "rgba(255,255,255,0.5)",
          scale: 1,
          duration: 0.4,
          ease: "power2.inOut",
        },
        0.3,
      );

      tl.to(
        dot2Ref.current,
        {
          backgroundColor: "#ffffff",
          borderColor: "transparent",
          scale: 1.25,
          duration: 0.4,
          ease: "power2.inOut",
        },
        0.3,
      );

      scrubTimelineRef.current = tl;

      if (headlineRef.current) {
        gsap.set(headlineRef.current, {
          ...HEADING_REVEAL_FROM,
          transformOrigin: "center center",
        });

        gsap.to(headlineRef.current, {
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          ...HEADING_REVEAL,
        });
      }
    },
    { scope: sectionRef },
  );

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      return scrubTimelineRef.current || gsap.timeline();
    },
    jumpToProgress: (progress: number) => {
      const clamped = Math.max(0, Math.min(1, progress));
      if (scrubTimelineRef.current) {
        scrubTimelineRef.current.progress(clamped);
      }
      if (clamped >= 0.5) {
        setActiveAudience((prev) => (prev !== "individuals" ? "individuals" : prev));
      } else {
        setActiveAudience((prev) => (prev !== "orgs" ? "orgs" : prev));
      }
    },
  }));

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full overflow-hidden flex flex-col justify-center py-6 sm:py-10 pin:py-0 pin:h-screen pin:min-h-0"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-4 sm:px-10 pin:px-16 py-3 sm:py-6 pin:py-4 pin-xl:py-6 flex flex-col justify-center pin:justify-between flex-1 gap-5 sm:gap-8 pin:gap-0 overflow-hidden">
        {/* TOP EYEBROW */}
        <p
          ref={topTitleRef}
          className="ta-eyebrow text-center font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/50 max-w-xl mx-auto px-4 shrink-0 mb-2 sm:mb-4 pin:mb-2"
        >
          <span className="whitespace-nowrap">Two Audiences · One Discipline</span>{" "}
          <span className="whitespace-nowrap">: Execution</span>
        </p>

        {/* MIDDLE ROW: HEADLINE & AUDIENCE CARD */}
        <div className="relative z-10 flex-1 w-full flex items-center justify-center my-auto min-h-0">
          <div className="relative w-full grid items-center gap-6 sm:gap-10 ta:grid-cols-2 ta:gap-8 pin-xl:gap-12">
            {/* LEFT COLUMN: HEADLINE */}
            <div className="ta:pl-4 pin:pl-28 pin-xl:pl-28 flex justify-center ta:block">
              <h2
                ref={headlineRef}
                className="ta-headline inline-block max-w-xl font-sans text-[clamp(1.5rem,4.5vw,3rem)] ta:text-[clamp(1.75rem,2.9vw,2.25rem)] pin-xl:text-[clamp(1.5rem,4.5vw,3rem)] font-normal leading-[1.16] text-white text-center ta:text-left"
              >
                <span className="block">
                  <span ref={headlineLine1Ref} className="inline-block">
                    Turn Training
                  </span>
                </span>
                <span className="block">
                  <span ref={headlineLine2Ref} className="inline-block">
                    Into Measurable
                  </span>
                </span>
                <span className="block italic text-[#4d82f5]">
                  <span ref={headlineLine3Ref} className="inline-block">
                    Sales Performance
                  </span>
                </span>
              </h2>
            </div>

            {/* CENTER DIVIDER: GLOWING YELLOW BUBBLE WITH CENTER LINE IN BETWEEN LHS & RHS */}
            <div
              ref={centerDividerRef}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden ta:flex flex-col items-center justify-center h-[72%] max-h-95 z-20"
              aria-hidden="true"
            >
              {/* Top line segment */}
              <div className="w-[1.5px] flex-1 bg-linear-to-b from-transparent via-white/15 to-[#e7ff3d]/70 shadow-[0_0_8px_rgba(231,255,61,0.3)]" />

              {/* Yellow bubble with line through its center */}
              <div className="relative my-2 flex items-center justify-center">
                {/* Luminous yellow ambient bloom */}
                <div className="pointer-events-none absolute h-16 w-16 rounded-full bg-[#e7ff3d]/25 blur-xl" />

                {/* Outer glass sphere / ring */}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e7ff3d]/45 bg-[#e7ff3d]/10 backdrop-blur-md shadow-[0_0_20px_rgba(231,255,61,0.35),inset_0_0_12px_rgba(231,255,61,0.15)]">
                  {/* Vertical line through the center of the bubble */}
                  <div className="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-[#e7ff3d] shadow-[0_0_6px_#e7ff3d]" />

                  {/* Inner yellow core bubble */}
                  <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-[#e7ff3d] shadow-[0_0_12px_#e7ff3d,0_0_24px_rgba(231,255,61,0.85)]">
                    {/* Core center slit / line */}
                    <div className="h-full w-[1.5px] bg-[#020617]/75" />
                  </div>
                </div>
              </div>

              {/* Bottom line segment */}
              <div className="w-[1.5px] flex-1 bg-linear-to-b from-[#e7ff3d]/70 via-white/15 to-transparent shadow-[0_0_8px_rgba(231,255,61,0.3)]" />
            </div>

            {/* ============================================================
                RIGHT COLUMN: MOBILE RESPONSIVE CARD (< 1024px)
            ============================================================ */}
            <div className="block ta:hidden w-full max-w-md mx-auto relative z-20">
              {/* Soft atmospheric blue glow */}
              <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-[radial-gradient(ellipse_at_top,rgba(77,130,245,0.2)_0%,transparent_70%)] blur-xl" />

              <div className="relative rounded-2xl sm:rounded-3xl border border-white/12 bg-linear-to-b from-white/[0.08] via-[#071330]/65 to-white/[0.02] backdrop-blur-xl p-5 sm:p-7 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)]">
                {/* Segmented Switcher */}
                <div className="flex p-1 rounded-full bg-black/40 border border-white/10 max-w-[280px] mx-auto mb-5">
                  <button
                    type="button"
                    onClick={() => toggleAudience("orgs")}
                    className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                      activeAudience === "orgs"
                        ? "bg-white text-black shadow-md"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    For Organisations
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAudience("individuals")}
                    className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                      activeAudience === "individuals"
                        ? "bg-white text-black shadow-md"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    For Individuals
                  </button>
                </div>

                {/* Sub-headline */}
                <p className="font-sans text-[1.15rem] sm:text-[1.3rem] leading-snug text-white text-center sm:text-left mb-4">
                  {activeAudience === "orgs" ? (
                    <>
                      From onboarding to closing,<br />
                      <span className="italic text-[#4d82f5]">we execute with you</span>
                    </>
                  ) : (
                    <>
                      Elevate your{" "}
                      <span className="italic text-[#4d82f5]">selling capabilities</span>
                    </>
                  )}
                </p>

                {/* List items */}
                <div className="flex flex-col gap-3.5">
                  {(activeAudience === "orgs" ? ORG_ITEMS : INDIVIDUAL_ITEMS).map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#4d82f5] shadow-[0_0_8px_rgba(77,130,245,0.85)] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-[13.5px] sm:text-[14.5px] font-semibold leading-tight ${
                            item.accent ? "text-[#4d82f5]" : "text-white"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[11.5px] sm:text-[12px] leading-relaxed text-white/65">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Action Button */}
                <div className="mt-5 pt-4 border-t border-white/8 flex justify-center">
                  <Link
                    href={activeAudience === "orgs" ? "/organisations" : "/individuals"}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 hover:bg-white hover:text-black px-6 py-2.5 text-xs sm:text-[13px] font-medium text-white transition-all shadow-sm active:scale-95 group cursor-pointer"
                  >
                    <span>
                      {activeAudience === "orgs"
                        ? "Build High-Performing Team"
                        : "Elevate Closing Capabilities"}
                    </span>
                    <svg
                      className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* ============================================================
                RIGHT COLUMN: DESKTOP SHAPE & AUDIENCE CONTENT (>= 1024px)
            ============================================================ */}
            <div
              ref={rhsContainerRef}
              className="relative hidden ta:flex h-115 pin-xl:h-122.5 w-full items-center"
            >
              {/* DESKTOP BACKGROUND WEDGE (Preserves natural 724:1084 aspect ratio) */}
              <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-6 pin-xl:-right-2 w-[140%] pin-xl:w-[150%] h-[135%] pin-xl:h-[145%] flex items-center justify-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home/Vector1.png"
                  alt="Wedge background"
                  className="h-full w-auto max-w-none object-contain opacity-35 mix-blend-screen select-none"
                />
              </div>

              {/* DESKTOP AMBIENT BLUE RADIAL GLOW */}
              <div className="pointer-events-none absolute -inset-8 rounded-[36px] bg-[radial-gradient(ellipse_at_60%_50%,rgba(29,99,237,0.38)_0%,rgba(20,60,180,0.18)_50%,transparent_75%)] blur-2xl" />

              {/* FIRST STATE: Organisations */}
              <div
                ref={orgsTextRef}
                style={{ opacity: 1 }}
                className="absolute inset-0 z-10 flex flex-col justify-center gap-3.5 sm:gap-4 p-5 sm:p-7 ta:py-4 ta:pl-10 pin-xl:pl-14 ta:pr-6 max-w-112.5"
              >
                <div>
                  <p className="font-sans text-[15px] sm:text-[17px] italic text-white/85">
                    For Organisations
                  </p>
                  <p className="mt-0.5 font-sans text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.2] text-white">
                    From onboarding to closing,<br />
                    <span className="italic text-white/90">
                      we execute with you
                    </span>
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 sm:gap-3">
                  {ORG_ITEMS.map((item) => (
                    <li
                      key={item.title}
                      className="flex gap-3 sm:gap-3.5 items-start"
                    >
                      <span className="mt-1.5 h-0.5 w-3.5 shrink-0 bg-[#2f6fe0] rounded-full" />
                      <div>
                        <p
                          className={`text-[13.5px] sm:text-[14.5px] font-semibold leading-tight ${
                            item.accent ? "text-[#3b82f6]" : "text-white"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="mt-0.5 max-w-[320px] text-[11px] sm:text-[12px] leading-relaxed text-white/65">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SECOND STATE: Individuals */}
              <div
                id="individuals"
                ref={individualsTextRef}
                style={{
                  opacity: 0,
                  pointerEvents: "none",
                  transform: "translateY(35px) rotate(4deg)",
                }}
                className="absolute inset-0 z-10 flex flex-col justify-center gap-3.5 sm:gap-4 p-5 sm:p-7 ta:py-4 ta:pl-10 pin-xl:pl-14 ta:pr-6 max-w-112.5"
              >
                <div>
                  <p className="font-sans text-[15px] sm:text-[17px] italic text-white/85">
                    For Individuals
                  </p>
                  <p className="mt-0.5 font-sans text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.2] text-white">
                    Elevate your{" "}
                    <span className="italic text-white/90">
                      selling capabilities
                    </span>
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 sm:gap-3">
                  {INDIVIDUAL_ITEMS.map((item) => (
                    <li
                      key={item.title}
                      className="flex gap-3 sm:gap-3.5 items-start"
                    >
                      <span className="mt-1.5 h-0.5 w-3.5 shrink-0 bg-[#2f6fe0] rounded-full" />
                      <div>
                        <p
                          className={`text-[13.5px] sm:text-[14.5px] font-semibold leading-tight ${
                            item.accent ? "text-[#3b82f6]" : "text-white"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="mt-0.5 max-w-[320px] text-[11px] sm:text-[12px] leading-relaxed text-white/65">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PAGINATION & TOGGLE (DESKTOP ONLY) */}
        <div
          ref={bottomNavRef}
          className="relative z-10 mt-2 sm:mt-3 pin:mt-2 hidden ta:flex flex-col items-center gap-2 sm:gap-2.5 shrink-0 pb-1 sm:pb-2"
        >
          <button
            type="button"
            onClick={() =>
              toggleAudience(activeAudience === "orgs" ? "individuals" : "orgs")
            }
            className="rounded-full border border-white/20 bg-white/5 px-6 sm:px-8 py-2.5 sm:py-3 text-[12px] sm:text-[13px] font-medium text-white transition-all hover:bg-white hover:text-black cursor-pointer shadow-sm active:scale-95"
          >
            {activeAudience === "orgs"
              ? "Build High-Performing Team"
              : "Elevate Closing Capabilities"}
          </button>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="View Organisations"
              onClick={() => toggleAudience("orgs")}
              className="p-1 cursor-pointer"
            >
              <span
                ref={dot1Ref}
                className={`block h-2 w-2 rounded-full transition-all ${
                  activeAudience === "orgs"
                    ? "bg-white scale-125"
                    : "bg-white/30 border border-white/50"
                }`}
              />
            </button>
            <button
              type="button"
              aria-label="View Individuals"
              onClick={() => toggleAudience("individuals")}
              className="p-1 cursor-pointer"
            >
              <span
                ref={dot2Ref}
                className={`block h-2 w-2 rounded-full transition-all ${
                  activeAudience === "individuals"
                    ? "bg-white scale-125"
                    : "bg-white/30 border border-white/50"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

TwoAudiences.displayName = "TwoAudiences";
export default TwoAudiences;

