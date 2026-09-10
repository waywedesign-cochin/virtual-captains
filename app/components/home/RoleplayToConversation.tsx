"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TwoAudiences, { TwoAudiencesRef } from "./TwoAudiences";

gsap.registerPlugin(ScrollTrigger);

const RIGHT_TEXT = [
  "Sales",
  "training",
  "teaches",
  "the",
  "framework.",
  "It",
  "rarely",
  "prepares",
  "you",
  "for",
  "the",
  "buyer",
  "going",
  "off-script.",
  "Objections",
  "arrive",
  "out",
  "of",
  "order.",
  "Interest",
  "fades",
  "mid-sentence.",
  "The",
  "deal",
  "moves",
  "on",
  "its",
  "own",
  "clock,",
  "not",
  "the",
  "process.",
];

export default function RoleplayToConversation() {
  const sectionRef = useRef<HTMLElement>(null);

  const rightTextRef = useRef<HTMLParagraphElement>(null);

  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const ring4Ref = useRef<HTMLDivElement>(null);

  const validateRef = useRef<HTMLSpanElement>(null);
  const rehearseRef = useRef<HTMLSpanElement>(null);
  const executeRef = useRef<HTMLSpanElement>(null);
  const refineRef = useRef<HTMLSpanElement>(null);

  const topRowRef = useRef<HTMLDivElement>(null);
  const titleBlockRef = useRef<HTMLDivElement>(null);
  const rightTextContainerRef = useRef<HTMLDivElement>(null);
  const mainHeadingRef = useRef<HTMLHeadingElement>(null);
  const headingLine1Ref = useRef<HTMLSpanElement>(null);
  const headingLine2Ref = useRef<HTMLSpanElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const diagramContainerRef = useRef<HTMLDivElement>(null);
  const diagramIntroRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  
  const twoAudiencesContainerRef = useRef<HTMLDivElement>(null);
  const twoAudiencesRef = useRef<TwoAudiencesRef>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /*
       * ============================================================
       * DESKTOP
       * ============================================================
       */
      mm.add("(min-width: 1024px)", () => {
        const wordElements =
          rightTextRef.current?.querySelectorAll(".word-reveal");

        if (!wordElements?.length) return;

        /*
         * ------------------------------------------------------------
         * INITIAL STATES
         * ------------------------------------------------------------
         */

        // Right paragraph starts dim
        gsap.set(wordElements, {
          opacity: 0.2,
        });

        // Diagram heading starts small & hidden
        gsap.set(diagramIntroRef.current, {
          autoAlpha: 0,
          scale: 0.85,
          y: 15,
        });

        // Rings
        gsap.set(
          [
            ring1Ref.current,
            ring2Ref.current,
            ring3Ref.current,
            ring4Ref.current,
          ],
          { autoAlpha: 0 },
        );

        /*
         * Texts start hidden and zoom in when active.
         */
        gsap.set(
          [
            validateRef.current,
            rehearseRef.current,
            executeRef.current,
            refineRef.current,
          ],
          {
            opacity: 0,
            scale: 0.7,
            transformOrigin: "center center",
          },
        );

        // Bottom caption starts small & hidden
        gsap.set(bottomTextRef.current, {
          autoAlpha: 0,
          scale: 0.85,
          y: 15,
        });

        // Compute layout offsets for centering on screen and transition to text-left
        const computeLayout = () => {
          if (
            typeof window === "undefined" ||
            window.innerWidth < 1024 ||
            !titleBlockRef.current ||
            !headingLine1Ref.current ||
            !headingLine2Ref.current ||
            !eyebrowRef.current
          ) {
            return { startX: 0, line1Shift: 0, line2Shift: 0, eyebrowShift: 0 };
          }

          const prevTitleTransform = titleBlockRef.current.style.transform;
          const prevEyeTransform = eyebrowRef.current.style.transform;
          const prevL1Transform = headingLine1Ref.current.style.transform;
          const prevL2Transform = headingLine2Ref.current.style.transform;

          titleBlockRef.current.style.transform = "none";
          eyebrowRef.current.style.transform = "none";
          headingLine1Ref.current.style.transform = "none";
          headingLine2Ref.current.style.transform = "none";

          const titleRect = titleBlockRef.current.getBoundingClientRect();
          const W = titleRect.width;
          const screenCenterX = window.innerWidth / 2;
          const titleCenterX = titleRect.left + W / 2;
          const startX = screenCenterX - titleCenterX;

          const wEye = eyebrowRef.current.getBoundingClientRect().width;
          const w1 = headingLine1Ref.current.getBoundingClientRect().width;
          const w2 = headingLine2Ref.current.getBoundingClientRect().width;
          const maxW = Math.max(W, w1, w2);

          const eyebrowShift = Math.max(0, (maxW - wEye) / 2);
          const line1Shift = Math.max(0, (maxW - w1) / 2);
          const line2Shift = Math.max(0, (maxW - w2) / 2);

          titleBlockRef.current.style.transform = prevTitleTransform;
          eyebrowRef.current.style.transform = prevEyeTransform;
          headingLine1Ref.current.style.transform = prevL1Transform;
          headingLine2Ref.current.style.transform = prevL2Transform;

          return { startX, line1Shift, line2Shift, eyebrowShift };
        };

        let layout = computeLayout();

        if (typeof document !== "undefined" && document.fonts) {
          document.fonts.ready.then(() => {
            layout = computeLayout();
            ScrollTrigger.refresh();
          });
        }

        // Set up the container overlap states for Desktop
        gsap.set(topRowRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(titleBlockRef.current, {
          autoAlpha: 0,
          scale: 0.65,
          x: layout.startX,
          transformOrigin: "center center",
        });
        gsap.set(
          [eyebrowRef.current, headingLine1Ref.current, headingLine2Ref.current],
          { x: 0 },
        );
        gsap.set(rightTextContainerRef.current, {
          autoAlpha: 0,
          x: 40,
        });
        gsap.set(diagramContainerRef.current, { autoAlpha: 0, y: 30, scale: 0.95 });

        /*
         * ============================================================
         * MASTER SCROLL TIMELINE
         * ============================================================
         */

        let lastLabelWasChoosePath: boolean | null = null;

        const tl = gsap.timeline({
          scrollTrigger: {
            id: "roleplay-pin",
            trigger: sectionRef.current,
            start: "top top",
            end: "+=3800", // Normalized brisk distance for faster scroll progression
            scrub: 0.35,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              layout = computeLayout();
            },
            onEnter: () => {
              lastLabelWasChoosePath = false;
              window.dispatchEvent(
                new CustomEvent("vc:nav-override", {
                  detail: { label: "The Promise", theme: "light" },
                }),
              );
            },
            onEnterBack: () => {
              lastLabelWasChoosePath = true;
              window.dispatchEvent(
                new CustomEvent("vc:nav-override", {
                  detail: { label: "Choose Your Path", theme: "dark" },
                }),
              );
            },
            onUpdate: (self) => {
              const isChoosePath = self.progress >= 0.57;
              if (isChoosePath === lastLabelWasChoosePath) return;
              lastLabelWasChoosePath = isChoosePath;
              window.dispatchEvent(
                new CustomEvent("vc:nav-override", {
                  detail: isChoosePath
                    ? { label: "Choose Your Path", theme: "dark" }
                    : { label: "The Promise", theme: "light" },
                }),
              );
            },
          },
        });

        /*
         * ============================================================
         * PHASE 1 — TITLE JUMPS IN CENTER, SLIDES TO LEFT, REVEALS RIGHT TEXT
         * ============================================================
         */

        // Step 1: Title block zooms in with jumping effect in the CENTER of the screen (natively text-center!)
        tl.to(
          titleBlockRef.current,
          {
            autoAlpha: 1,
            duration: 0.85,
            keyframes: [
              { scale: 1.15, autoAlpha: 1, duration: 0.42, ease: "power2.out" },
              { scale: 0.94, duration: 0.22, ease: "sine.inOut" },
              { scale: 1.0, duration: 0.21, ease: "power2.out" },
            ],
          },
          0,
        );

        // Step 2: Sits centered for a moment while reading
        tl.to({}, { duration: 0.45 });

        // Step 3: Slides to the LEFT (x: 0) AND smoothly transitions lines to flush text-left!
        tl.fromTo(
          titleBlockRef.current,
          { x: () => layout.startX },
          {
            x: 0,
            duration: 0.85,
            ease: "power2.inOut",
          },
          "slideLeft",
        );
        tl.fromTo(
          eyebrowRef.current,
          { x: 0 },
          {
            x: () => -layout.eyebrowShift,
            duration: 0.85,
            ease: "power2.inOut",
          },
          "slideLeft",
        );
        tl.fromTo(
          headingLine1Ref.current,
          { x: 0 },
          {
            x: () => -layout.line1Shift,
            duration: 0.85,
            ease: "power2.inOut",
          },
          "slideLeft",
        );
        tl.fromTo(
          headingLine2Ref.current,
          { x: 0 },
          {
            x: () => -layout.line2Shift,
            duration: 0.85,
            ease: "power2.inOut",
          },
          "slideLeft",
        );

        // Step 4: Simultaneously fade in the right text block from the right
        tl.to(
          rightTextContainerRef.current,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.65,
            ease: "power2.out",
          },
          "slideLeft+=0.15",
        );

        // Step 5: Reveal the words in the right paragraph
        const TOTAL_WORD_REVEAL_TIME = 1.6;
        const staggerTime =
          (TOTAL_WORD_REVEAL_TIME - 0.1) / wordElements.length;

        tl.to(
          wordElements,
          {
            opacity: 1,
            duration: 0.1,
            stagger: staggerTime,
            ease: "none",
          },
          "slideLeft+=0.35",
        );

        /*
         * ============================================================
         * PHASE 1.5 — TRANSITION (HIDE TOP ROW, SHOW DIAGRAM CONTAINER)
         * ============================================================
         */
        
        const TRANSITION_START = 3.6;
        const ZOOM_START = TRANSITION_START + 4.0;
        const CHOOSE_YOUR_PATH_AT = ZOOM_START + 0.8;

        tl.to(
          topRowRef.current,
          { autoAlpha: 0, y: -30, scale: 0.95, duration: 0.5, ease: "power2.inOut" },
          TRANSITION_START,
        );

        tl.to(
          diagramContainerRef.current,
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "power2.out" },
          TRANSITION_START + 0.2,
        );

        /*
         * ============================================================
         * PHASE 2 — DIAGRAM INTRO TEXT (ZOOMS IN)
         * ============================================================
         */

        tl.to(
          diagramIntroRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.45,
            ease: "back.out(1.2)",
          },
          TRANSITION_START + 0.4,
        );

        /*
         * ============================================================
         * PHASE 3 — REHEARSE (RING & ZOOM IN LABEL)
         * ============================================================
         */

        tl.fromTo(
          ring4Ref.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.55, ease: "power2.out" },
          TRANSITION_START + 0.8,
        );

        tl.to(
          rehearseRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "back.out(1.3)",
          },
          TRANSITION_START + 1.0,
        );

        /*
         * ============================================================
         * PHASE 4 — EXECUTE (RING & ZOOM IN LABEL)
         * ============================================================
         */

        tl.fromTo(
          ring3Ref.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.55, ease: "power2.out" },
          TRANSITION_START + 1.6,
        );

        tl.to(
          executeRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "back.out(1.3)",
          },
          TRANSITION_START + 1.8,
        );

        /*
         * ============================================================
         * PHASE 5 — VALUATE (RING & ZOOM IN LABEL)
         * ============================================================
         */

        tl.fromTo(
          ring2Ref.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.55, ease: "power2.out" },
          TRANSITION_START + 2.4,
        );

        tl.to(
          validateRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "back.out(1.3)",
          },
          TRANSITION_START + 2.6,
        );

        /*
         * ============================================================
         * PHASE 6 — REFINE (RING & ZOOM IN LABEL)
         * ============================================================
         */

        tl.fromTo(
          ring1Ref.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.55, ease: "power2.out" },
          TRANSITION_START + 3.1,
        );

        tl.to(
          refineRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "back.out(1.3)",
          },
          TRANSITION_START + 3.2,
        );

        /*
         * ============================================================
         * PHASE 7 — FINAL CAPTION (ZOOMS IN)
         * ============================================================
         */

        tl.to(
          bottomTextRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          TRANSITION_START + 3.6,
        );

        /*
         * ============================================================
         * PHASE 8 — THE BLACK HOLE ZOOM (Transition to Two Audiences)
         * ============================================================
         */

        // Fade out all other elements so they don't float on top of the black circle
        tl.to(
          [
            diagramIntroRef.current,
            bottomTextRef.current,
            ring1Ref.current,
            ring2Ref.current,
            ring3Ref.current,
            validateRef.current,
            executeRef.current,
            refineRef.current,
            rehearseRef.current,
            topRowRef.current
          ],
          { autoAlpha: 0, duration: 0.35 },
          ZOOM_START,
        );

        // Zoom the innermost circle and turn it black!
        tl.to(
          ring4Ref.current,
          {
            backgroundColor: "#050608",
            borderColor: "transparent",
            scale: 150, // Massive scale to swallow the screen
            duration: 1.1,
            ease: "expo.in", // Classic hyper-zoom acceleration
          },
          ZOOM_START,
        );

        // Transition to Two Audiences!
        // Make the container visible right as the black hole consumes the screen
        tl.to(
          twoAudiencesContainerRef.current,
          { autoAlpha: 1, duration: 0 },
          CHOOSE_YOUR_PATH_AT
        );

        // Finally, run the Two Audiences internal timeline (title sliding, disc rotating, etc)
        // Since TwoAudiences is now full-bleed pitch black, it perfectly continues the black hole transition!
        if (twoAudiencesRef.current) {
          tl.add(twoAudiencesRef.current.getTimeline(), ZOOM_START + 0.9);
        }

        /*
         * Small final breathing movement to let the last scene sit for a moment.
         */
        tl.to({}, { duration: 0.4 });
      });

      /*
       * ============================================================
       * MOBILE
       * ============================================================
       *
       * No pinning on mobile.
       * Everything stays readable and the words are immediately
       * visible.
       */
      mm.add("(max-width: 1023px)", () => {
        const wordElements =
          rightTextRef.current?.querySelectorAll(".word-reveal");

        if (wordElements) {
          gsap.set(wordElements, {
            opacity: 1,
          });
        }

        gsap.set(
          [
            titleBlockRef.current,
            rightTextContainerRef.current,
            mainHeadingRef.current,
            headingLine1Ref.current,
            headingLine2Ref.current,
            eyebrowRef.current,
            diagramIntroRef.current,
            ring1Ref.current,
            ring2Ref.current,
            ring3Ref.current,
            ring4Ref.current,
            validateRef.current,
            rehearseRef.current,
            executeRef.current,
            refineRef.current,
            bottomTextRef.current,
            twoAudiencesContainerRef.current,
          ],
          {
            clearProps: "all",
          },
        );
      });

      return () => mm.revert();
    },
    {
      scope: sectionRef,
    },
  );

  return (
    <section
      ref={sectionRef}
      id="salesx"
      // No data-nav-section here on purpose: this section's own bounding
      // rect stays under the viewport's 55% line for its entire pin,
      // including the whole time TwoAudiences (nested inside it) should be
      // showing "Choose Your Path" — a generic nav tag would re-answer
      // "The Promise" on every scroll frame and fight the vc:nav-override
      // event dispatched below. This component owns both of its own labels
      // via that event instead.
      //
      // data-nav-override-zone tells SideNav's poll to stand down entirely
      // while this element is under the 55% line — without it, the poll
      // finds no tagged section here (since there's no data-nav-section) and
      // falls back to "nothing active," immediately undoing whatever the
      // vc:nav-override event just set.
      data-nav-override-zone="true"
      className="relative min-h-screen overflow-x-hidden overflow-y-visible bg-white text-[#101010] lg:overflow-hidden lg:h-screen"
    >
      {/* ============================================================
          DOT GRID BACKGROUND
      ============================================================ */}

      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.13) 0.65px, transparent 0.65px)",
          backgroundSize: "9px 9px",
        }}
      />

      {/* ============================================================
          MAIN CONTAINER
      ============================================================ */}
      <div className="relative mx-auto flex min-h-svh w-full max-w-[1920px] flex-col justify-between px-6 py-12 sm:px-10 lg:h-screen lg:px-14 lg:py-[6%] xl:px-[8%] lg:grid lg:grid-cols-1 lg:grid-rows-1">
        {/* ==========================================================
            TOP ROW: TITLE & RIGHT TEXT
        ========================================================== */}
        <div
          ref={topRowRef}
          // lg:pl-32 xl:pl-8: this row is vertically centered on the full
          // viewport height at lg+, landing squarely in the fixed SideNav's
          // vertical band — extra left clearance keeps "What Drives Us" and
          // the heading from rendering behind the nav's labels. Less is
          // needed at xl since the container's own xl:px-[8%] already grows.
          className="relative z-20 w-full lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col lg:justify-center lg:pl-32 xl:pl-8"
        >
          <div className="flex w-full flex-col justify-between gap-6 lg:flex-row lg:items-start lg:gap-10">
            {/* TOP LEFT TITLE (Starts centered on screen with centered text, then slides to left and aligns left) */}
            <div
              ref={titleBlockRef}
              className="w-full lg:w-fit max-w-150 xl:max-w-175 text-center"
            >
              <span className="block">
                <span
                  ref={eyebrowRef}
                  className="mb-4 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-black/65 sm:text-[11px] lg:mb-6 lg:text-[13px] lg:whitespace-nowrap"
                >
                  What Drives Us
                </span>
              </span>
              <h2
                ref={mainHeadingRef}
                className="font-serif text-[clamp(1.5rem,2.5vw+1rem,3rem)] font-normal leading-[1.05] tracking-[-0.04em]"
              >
                <span className="block">
                  <span ref={headingLine1Ref} className="inline-block lg:whitespace-nowrap">
                    From Roleplays
                  </span>
                </span>
                <span className="block">
                  <span ref={headingLine2Ref} className="inline-block lg:whitespace-nowrap">
                    to{" "}
                    <span className="italic text-[#3478e5]">
                      Real Conversation
                    </span>
                  </span>
                </span>
              </h2>
            </div>

            {/* RIGHT TEXT */}
            <div
              ref={rightTextContainerRef}
              className="w-full max-w-[320px] sm:max-w-100 lg:max-w-112.5 xl:max-w-125"
            >
              <p
                ref={rightTextRef}
                className="font-sans text-[clamp(12px,1vw,16px)] leading-[1.6] text-black/75"
              >
                {RIGHT_TEXT.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="word-reveal mr-1 inline-block opacity-100 lg:mr-1.5 lg:opacity-[0.2]"
                  >
                    {word}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================================
            CENTER DIAGRAM
        ========================================================== */}
        <div ref={diagramContainerRef} className="relative z-10 mx-auto mt-10 flex w-full flex-1 flex-col items-center justify-center lg:col-start-1 lg:row-start-1 lg:mt-0 lg:max-w-250 xl:max-w-300">
          {/* Diagram intro */}
          <div ref={diagramIntroRef} className="text-center">
            <p className="font-sans text-[clamp(11px,1vw,15px)] leading-[1.6] text-black/80">
              Virtual Captains was built for that gap.
              <br />
              We designed the model around three moves:
            </p>
          </div>
          {/* ========================================================
              OVAL STAGE
          ======================================================== */}
          <div className="relative mx-auto mt-6 h-40 w-full max-w-250 sm:h-45 lg:mt-8 lg:h-[clamp(200px,22vh,280px)]">
            {/* ------------------------------------------------------
                OUTER / FIRST OVAL
            ------------------------------------------------------ */}
            <div
              ref={ring1Ref}
              className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-black/30"
            >
              <span
                ref={refineRef}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 bg-white px-2 font-serif text-[clamp(22px,2vw,36px)] italic leading-none text-[#3478e5]"
              >
                Refine
              </span>
            </div>

            {/* ------------------------------------------------------
                MIDDLE / SECOND OVAL
            ------------------------------------------------------ */}
            <div
              ref={ring2Ref}
              className="absolute left-1/2 top-1/2 h-full w-[71.4%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-black/25"
            >
              <span
                ref={validateRef}
                className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-white px-2 font-serif text-[clamp(16px,1.5vw,26px)] italic leading-none text-[#3478e5]"
              >
                Valuate
              </span>
            </div>

            {/* ------------------------------------------------------
                INNER / THIRD OVAL
            ------------------------------------------------------ */}
            <div
              ref={ring3Ref}
              className="absolute left-1/2 top-1/2 h-full w-[42.8%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-black/25"
            >
              <span
                ref={executeRef}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 bg-white px-2 font-serif text-[clamp(16px,1.5vw,26px)] italic leading-none text-[#3478e5]"
              >
                Execute
              </span>
            </div>

            {/* ------------------------------------------------------
                INNERMOST / FOURTH OVAL (PERFECT CIRCLE)
            ------------------------------------------------------ */}
            <div
              ref={ring4Ref}
              className="absolute left-1/2 top-1/2 aspect-square h-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/20"
            >
              <span
                ref={rehearseRef}
                className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-white px-2 font-serif text-[clamp(12px,1vw,17px)] italic leading-none text-[#3478e5]"
              >
                Rehearse
              </span>
            </div>
          </div>

          {/* ========================================================
              BOTTOM CAPTION
          ======================================================== */}
          <div ref={bottomTextRef} className="mt-8 text-center lg:mt-10">
            <p className="font-sans text-[clamp(10px,1vw,14px)] leading-[1.6] text-black/75">
              It&apos;s roleplay-first by design, and every outcome is audited,
              <br />
              never assumed.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          TWO AUDIENCES OVERLAY
      ============================================================ */}
      <div 
        ref={twoAudiencesContainerRef} 
        className="relative z-30 flex items-center justify-center w-full h-full opacity-100 pointer-events-auto mt-12 sm:mt-16 lg:mt-0 lg:absolute lg:inset-0 lg:z-50 lg:opacity-0 lg:pointer-events-none"
      >
        <div className="pointer-events-auto w-full h-full">
          <TwoAudiences ref={twoAudiencesRef} />
        </div>
      </div>
    </section>
  );
}
