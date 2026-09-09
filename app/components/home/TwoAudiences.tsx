import React, { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

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

  const whiteIrisRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      // 1. Initial States (Invisible inside the black hole)
      gsap.set(topTitleRef.current, { opacity: 0, y: -20 });
      gsap.set(bottomNavRef.current, { opacity: 0, y: 20 });
      
      // Calculate exact X offset to perfectly center the headline
      let moveX: string | number = "25vw"; // Fallback
      if (headlineRef.current) {
        // Ensure no transform is currently applied before measuring
        gsap.set(headlineRef.current, { clearProps: "transform" });
        const rect = headlineRef.current.getBoundingClientRect();
        const centerOfElement = rect.left + rect.width / 2;
        const centerOfScreen = window.innerWidth / 2;
        moveX = centerOfScreen - centerOfElement;
      }
      
      // Push the single headline to the exact center of the screen initially
      gsap.set(headlineRef.current, { opacity: 0, x: moveX });
      
      gsap.set(rhsContainerRef.current, { opacity: 0, x: 40 });
      gsap.set(individualsTextRef.current, { opacity: 0, y: 80, rotate: 5 });
      gsap.set(orgsTextRef.current, { opacity: 1, y: 0, rotate: 0 });
      gsap.set(whiteIrisRef.current, { scale: 0 });

      const tl = gsap.timeline();

      // Phase 1: Fade in Top Title and Headline (Headline is currently sitting in the center)
      tl.to(topTitleRef.current, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 0);
      tl.to(headlineRef.current, { opacity: 1, duration: 1, ease: "power2.out" }, 0.2);

      // Brief pause to read the headline in the center
      tl.to({}, { duration: 1.0 });

      // Phase 2: Slide the SAME headline to the left
      tl.to(headlineRef.current, { x: 0, duration: 1.2, ease: "power2.inOut" }, "slide");

      // Phase 3: Slide in the RHS content (Wedge + Orgs Text) and Bottom Button
      tl.to(rhsContainerRef.current, { opacity: 1, x: 0, duration: 1, ease: "power2.out" }, "slide+=0.4");
      tl.to(bottomNavRef.current, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "slide+=0.6");

      // Pause briefly for the Orgs state
      tl.to({}, { duration: 1.5 });

      // Phase 4: Carousel Rotation (Swap Orgs for Individuals)
      // We animate the text to mimic a turning wheel, but leave the image static so it acts as the stable plane
      tl.to(
        orgsTextRef.current,
        {
          opacity: 0,
          y: -80,
          rotate: -5,
          duration: 1,
          ease: "power2.in",
        },
        "rotate",
      );

      // Starts right as orgsText finishes fading out (not mid-fade) so the
      // two panels are never both partially visible at once — an earlier
      // 0.5s overlap here made both texts read as double-exposed.
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

      // Final pause
      tl.to({}, { duration: 0.5 });

      // Phase 5: THE WHITE IRIS — mirrors RoleplayToConversation's Phase 8
      // black-hole zoom, inverted. Fades out this section's own foreground,
      // then grows a white circle to swallow the screen. OurApproach (the
      // very next section) is also white-background and sits immediately
      // adjacent in normal flow, so this reads as one continuous motion with
      // no visible seam once the pin releases right after.
      tl.to(
        [topTitleRef.current, headlineRef.current, rhsContainerRef.current, bottomNavRef.current],
        { autoAlpha: 0, duration: 0.4 },
      );

      tl.to(
        whiteIrisRef.current,
        { scale: 24, duration: 1.4, ease: "expo.in" },
        "<",
      );

      return tl;
    },
    jumpToProgress: (progress: number) => {},
  }));

  return (
    <section
      ref={sectionRef}
      // No data-nav-section here on purpose: this section sits absolutely
      // inset-0 inside RoleplayToConversation and shares its bounding rect
      // for the whole pin, so a geometry-based nav trigger here would fire
      // at the same instant as "The Promise". RoleplayToConversation's
      // master timeline dispatches the "Choose Your Path" nav switch itself
      // at the exact scroll progress where this section becomes visible.
      className="relative z-10 w-full min-h-screen overflow-hidden bg-[#050608]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto w-full h-full min-h-screen max-w-[1920px] px-6 py-14 sm:px-10 lg:px-16 lg:py-20 flex flex-col justify-between">
        <p
          ref={topTitleRef}
          className="ta-eyebrow mb-10 pt-8 lg:pt-10 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 lg:mb-20"
        >
          Two Audiences &nbsp;·&nbsp; One Discipline &nbsp;:&nbsp; Execution
        </p>

        <div className="relative z-10 flex-1 w-full flex items-center">
          <div className="w-full grid items-center gap-16 lg:grid-cols-2 lg:gap-4">
            
            {/* SINGLE HEADLINE */}
            {/* lg:pl-32: clears the fixed SideNav's left-edge footprint once
                the headline slides to its resting position at x:0 — the
                outer container's own lg:px-16 wasn't enough on its own.
                Unlike RoleplayToConversation's equivalent fix, this
                container has no xl:px scale-up, so the extra padding must
                stay constant rather than shrinking at xl. */}
            <div className="lg:pl-32">
              <h2 
                ref={headlineRef}
                className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] font-normal leading-[1.2] text-white w-max"
              >
                <span className="block">Turn training</span>
                <span className="block">into measurable</span>
                <span className="block italic text-[#1d63ed]">
                  sale performance
                </span>
              </h2>
            </div>

            {/* right: curved connector + wedge + org content */}
            <div ref={rhsContainerRef} className="relative min-h-115 w-full">
              {/* image background wedge - Made larger and centered to act as the full background plane for the text */}
              <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-[10%] w-[140%] h-[140%] lg:w-[150%] lg:h-[150%]">
                <img
                  src="/home/Vector1.png"
                  alt="Wedge background"
                  className="h-full w-full object-contain object-center opacity-80 mix-blend-screen"
                />
              </div>

              {/* FIRST STATE: Organisations */}
              <div
                ref={orgsTextRef}
                className="absolute inset-0 z-10 flex flex-col justify-center gap-8 pl-8 sm:pl-12 lg:pl-20 xl:pl-28"
              >
                <div>
                  <p className="font-serif text-[17px] italic text-white/80">
                    For Organisations
                  </p>
                  <p className="mt-2 max-w-85 font-serif text-[clamp(1.3rem,2.5vw,1.8rem)] leading-[1.2] text-white">
                    Equip your teams with{" "}
                    <span className="italic text-white/90">
                      real-world practice
                    </span>
                  </p>
                </div>

                <ul className="flex flex-col gap-6">
                  {ORG_ITEMS.map((item) => (
                    <li key={item.title} className="flex gap-4">
                      <span className="mt-2.5 h-0.75 w-4 shrink-0 bg-[#2f6fe0]" />
                      <div>
                        <p
                          className={`text-[16px] font-semibold ${item.accent ? "text-[#1d63ed]" : "text-white"}`}
                        >
                          {item.title}
                        </p>
                        <p className="mt-0.5 max-w-[320px] text-[13px] leading-relaxed text-white/60">
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
                className="absolute inset-0 z-10 flex flex-col justify-center gap-8 pl-8 sm:pl-12 lg:pl-20 xl:pl-28"
              >
                <div>
                  <p className="font-serif text-[17px] italic text-white/80">
                    For Individuals
                  </p>
                  <p className="mt-2 max-w-85 font-serif text-[clamp(1.3rem,2.5vw,1.8rem)] leading-[1.2] text-white">
                    Elevate your own{" "}
                    <span className="italic text-white/90">
                      closing capabilities
                    </span>
                  </p>
                </div>

                <ul className="flex flex-col gap-6">
                  {INDIVIDUAL_ITEMS.map((item) => (
                    <li key={item.title} className="flex gap-4">
                      <span className="mt-2.5 h-0.75 w-4 shrink-0 bg-[#2f6fe0]" />
                      <div>
                        <p
                          className={`text-[16px] font-semibold ${item.accent ? "text-[#1d63ed]" : "text-white"}`}
                        >
                          {item.title}
                        </p>
                        <p className="mt-0.5 max-w-[320px] text-[13px] leading-relaxed text-white/60">
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
      </div>

      {/* WHITE IRIS — grows to swallow the screen at the very end of the
          timeline, transitioning into OurApproach's white background. */}
      <div
        ref={whiteIrisRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      />

      {/* BOTTOM PAGINATION */}
      <div
        ref={bottomNavRef}
        className="relative z-10 mt-12 flex flex-col items-center gap-5"
      >
        <button
          type="button"
          className="rounded-full border border-white/20 px-8 py-3.5 text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-black cursor-pointer"
        >
          Build High-Performing Team
        </button>
        <div className="flex items-center gap-2">
          <span
            ref={dot1Ref}
            className="h-2 w-2 rounded-full bg-white transition-transform"
          />
          <span
            ref={dot2Ref}
            className="h-2 w-2 rounded-full bg-white/30 border border-white/50 transition-transform"
          />
        </div>
      </div>
    </section>
  );
});

TwoAudiences.displayName = "TwoAudiences";
export default TwoAudiences;
