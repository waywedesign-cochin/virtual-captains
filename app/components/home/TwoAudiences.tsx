import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const ORG_ITEMS = [
  { title: "Groom Studio", desc: "Induction and onboarding", accent: false },
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

  const rhsContainerRef = useRef<HTMLDivElement>(null);
  const orgsTextRef = useRef<HTMLDivElement>(null);
  const individualsTextRef = useRef<HTMLDivElement>(null);

  const dot1Ref = useRef<HTMLSpanElement>(null);
  const dot2Ref = useRef<HTMLSpanElement>(null);

  const [activeAudience, setActiveAudience] = useState<"orgs" | "individuals">(
    "orgs",
  );

  const toggleAudience = (target: "orgs" | "individuals") => {
    setActiveAudience(target);
    if (target === "orgs") {
      gsap.to(orgsTextRef.current, {
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(individualsTextRef.current, {
        opacity: 0,
        y: 40,
        rotate: 5,
        duration: 0.4,
        ease: "power2.in",
      });
      gsap.to(dot1Ref.current, {
        backgroundColor: "#ffffff",
        borderColor: "transparent",
        duration: 0.3,
      });
      gsap.to(dot2Ref.current, {
        backgroundColor: "rgba(255,255,255,0.3)",
        borderColor: "rgba(255,255,255,0.5)",
        duration: 0.3,
      });
    } else {
      gsap.to(orgsTextRef.current, {
        opacity: 0,
        y: -40,
        rotate: -5,
        duration: 0.4,
        ease: "power2.in",
      });
      gsap.to(individualsTextRef.current, {
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(dot1Ref.current, {
        backgroundColor: "rgba(255,255,255,0.3)",
        borderColor: "rgba(255,255,255,0.5)",
        duration: 0.3,
      });
      gsap.to(dot2Ref.current, {
        backgroundColor: "#ffffff",
        borderColor: "transparent",
        duration: 0.3,
      });
    }
  };

  useGSAP(
    () => {
      // On mobile / tablet, ensure all content is immediately visible in flow
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        gsap.set(
          [
            topTitleRef.current,
            headlineRef.current,
            rhsContainerRef.current,
            bottomNavRef.current,
          ],
          {
            opacity: 1,
            x: 0,
            y: 0,
            clearProps: "transform",
          },
        );
        gsap.set(orgsTextRef.current, { opacity: 1, y: 0, rotate: 0 });
        gsap.set(individualsTextRef.current, { opacity: 0, y: 40, rotate: 5 });
      }
    },
    { scope: sectionRef },
  );

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      // 1. Initial States for desktop pinned animation
      gsap.set(topTitleRef.current, { opacity: 0, y: -20 });
      gsap.set(bottomNavRef.current, { opacity: 0, y: 20 });

      // Calculate exact X offset to perfectly center the headline ONLY on desktop
      let moveX: string | number = 0;
      if (
        typeof window !== "undefined" &&
        window.innerWidth >= 1024 &&
        headlineRef.current
      ) {
        gsap.set(headlineRef.current, { clearProps: "transform" });
        const rect = headlineRef.current.getBoundingClientRect();
        const centerOfElement = rect.left + rect.width / 2;
        const centerOfScreen = window.innerWidth / 2;
        moveX = centerOfScreen - centerOfElement;
      }

      gsap.set(headlineRef.current, { opacity: 0, x: moveX });
      gsap.set(rhsContainerRef.current, { opacity: 0, x: 40 });
      gsap.set(individualsTextRef.current, { opacity: 0, y: 80, rotate: 5 });
      gsap.set(orgsTextRef.current, { opacity: 1, y: 0, rotate: 0 });

      const tl = gsap.timeline();

      // Phase 1: Fade in Top Title and Headline (Headline centered on desktop)
      tl.to(
        topTitleRef.current,
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        0,
      );
      tl.to(
        headlineRef.current,
        { opacity: 1, duration: 1, ease: "power2.out" },
        0.2,
      );

      // Pause to read the centered headline
      tl.to({}, { duration: 1.0 });

      // Phase 2: Slide headline to the left
      tl.to(
        headlineRef.current,
        { x: 0, duration: 1.2, ease: "power2.inOut" },
        "slide",
      );

      // Phase 3: Slide in the RHS content (Wedge + Orgs Text) and Bottom Button
      tl.to(
        rhsContainerRef.current,
        { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
        "slide+=0.4",
      );
      tl.to(
        bottomNavRef.current,
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "slide+=0.6",
      );

      // Pause for the Orgs state
      tl.to({}, { duration: 1.5 });

      // Phase 4: Carousel Rotation (Swap Orgs for Individuals)
      tl.to(
        orgsTextRef.current,
        {
          opacity: 0,
          y: -80,
          rotate: -5,
          duration: 1,
          ease: "power2.in",
          onStart: () => setActiveAudience("individuals"),
        },
        "rotate",
      );

      tl.to(
        individualsTextRef.current,
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 1,
          ease: "power2.out",
        },
        "rotate+=1",
      );

      // Animate Pagination Dots
      tl.to(
        dot1Ref.current,
        {
          backgroundColor: "rgba(255,255,255,0.3)",
          borderColor: "rgba(255,255,255,0.5)",
          duration: 0.5,
        },
        "rotate+=1",
      );

      tl.to(
        dot2Ref.current,
        {
          backgroundColor: "#ffffff",
          borderColor: "transparent",
          duration: 0.5,
        },
        "rotate+=1",
      );

      // Final pause on the second audience panel
      tl.to({}, { duration: 0.8 });

      return tl;
    },
    jumpToProgress: (progress: number) => {},
  }));

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full h-full min-h-screen lg:min-h-0 lg:h-screen overflow-hidden bg-[#050608] lg:rounded-none flex flex-col justify-between"
    >
      {/* Subtle dotted background grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto w-full h-full max-w-[1920px] px-5 sm:px-10 lg:px-16 py-4 sm:py-6 lg:py-4 xl:py-6 flex flex-col justify-between flex-1 overflow-hidden">
        {/* TOP EYEBROW */}
        <p
          ref={topTitleRef}
          className="ta-eyebrow pt-2 sm:pt-4 lg:pt-2 mb-2 sm:mb-3 lg:mb-2 text-center font-mono text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.25em] text-white/50 max-w-xl mx-auto px-4 shrink-0"
        >
          Two Audiences &nbsp;·&nbsp; One Discipline &nbsp;:&nbsp; Execution
        </p>

        {/* MIDDLE ROW: HEADLINE & AUDIENCE CARD */}
        <div className="relative z-10 flex-1 w-full flex items-center justify-center my-auto min-h-0">
          <div className="w-full grid items-center gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-12">
            {/* LEFT COLUMN: HEADLINE */}
            <div className="lg:pl-16 xl:pl-24 flex justify-center lg:block">
              <h2
                ref={headlineRef}
                className="inline-block max-w-xl font-serif text-[clamp(1.75rem,2.8vw,3.25rem)] font-normal leading-[1.16] text-white text-center lg:text-left"
              >
                <span className="block">Turn training</span>
                <span className="block">into measurable</span>
                <span className="block italic text-[#1d63ed]">
                  sale performance
                </span>
              </h2>
            </div>

            {/* RIGHT COLUMN: BACKGROUND SHAPE & AUDIENCE CONTENT */}
            <div
              ref={rhsContainerRef}
              className="relative h-[410px] sm:h-[440px] lg:h-[460px] xl:h-[490px] w-full flex items-center"
            >
              {/* DESKTOP BACKGROUND WEDGE (Preserves natural 724:1084 aspect ratio, avoids squishing) */}
              <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-6 xl:-right-2 w-[140%] xl:w-[150%] h-[135%] xl:h-[145%] hidden lg:flex items-center justify-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home/Vector1.png"
                  alt="Wedge background"
                  className="h-full w-auto max-w-none object-contain opacity-35 mix-blend-screen select-none"
                />
              </div>

              {/* DESKTOP AMBIENT BLUE RADIAL GLOW (Envelops all text in deep luminous blue light) */}
              <div className="pointer-events-none absolute -inset-8 rounded-[36px] bg-[radial-gradient(ellipse_at_60%_50%,_rgba(29,99,237,0.38)_0%,_rgba(20,60,180,0.18)_50%,_transparent_75%)] blur-2xl hidden lg:block" />

              {/* MOBILE & TABLET RESPONSIVE CONTAINER CARD (Active on screens < lg) */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-[#1d63ed]/15 via-white/[0.03] to-transparent backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.45)] lg:hidden overflow-hidden">
                <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#1d63ed]/25 blur-3xl" />
                <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-[#1d63ed]/15 blur-3xl" />
              </div>

              {/* FIRST STATE: Organisations */}
              <div
                ref={orgsTextRef}
                className="absolute inset-0 z-10 flex flex-col justify-center gap-3.5 sm:gap-4 p-5 sm:p-7 lg:py-4 lg:pl-10 xl:pl-14 lg:pr-6 max-w-[450px]"
              >
                {/* Mobile Tab Switcher */}
                <div className="flex lg:hidden items-center gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => toggleAudience("orgs")}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                      activeAudience === "orgs"
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/60 hover:bg-white/15"
                    }`}
                  >
                    For Organisations
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAudience("individuals")}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                      activeAudience === "individuals"
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/60 hover:bg-white/15"
                    }`}
                  >
                    For Individuals
                  </button>
                </div>

                <div>
                  <p className="font-serif text-[15px] sm:text-[17px] italic text-white/85">
                    For Organisations
                  </p>
                  <p className="mt-0.5 font-serif text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.2] text-white">
                    Equip your teams with{" "}
                    <span className="italic text-white/90">
                      real-world practice
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
                ref={individualsTextRef}
                className="absolute inset-0 z-10 flex flex-col justify-center gap-3.5 sm:gap-4 p-5 sm:p-7 lg:py-4 lg:pl-10 xl:pl-14 lg:pr-6 max-w-[450px]"
              >
                {/* Mobile Tab Switcher */}
                <div className="flex lg:hidden items-center gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => toggleAudience("orgs")}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                      activeAudience === "orgs"
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/60 hover:bg-white/15"
                    }`}
                  >
                    For Organisations
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAudience("individuals")}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                      activeAudience === "individuals"
                        ? "bg-white text-black"
                        : "bg-white/10 text-white/60 hover:bg-white/15"
                    }`}
                  >
                    For Individuals
                  </button>
                </div>

                <div>
                  <p className="font-serif text-[15px] sm:text-[17px] italic text-white/85">
                    For Individuals
                  </p>
                  <p className="mt-0.5 font-serif text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.2] text-white">
                    Elevate your own{" "}
                    <span className="italic text-white/90">
                      closing capabilities
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

        {/* BOTTOM PAGINATION & TOGGLE */}
        <div
          ref={bottomNavRef}
          className="relative z-10 mt-2 sm:mt-3 lg:mt-2 flex flex-col items-center gap-2 sm:gap-2.5 shrink-0 pb-1 sm:pb-2"
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
