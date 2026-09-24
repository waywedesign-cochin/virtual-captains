"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TwoAudiences, { TwoAudiencesRef } from "./TwoAudiences";
import DottedBackground from "./DottedBackground";

gsap.registerPlugin(ScrollTrigger);

const PROMISE_PARAGRAPH_1 = [
  "Sales", "success", "is", "built", "on", "more", "than", "individual", "tactics.",
  "It", "takes", "a", "clear", "understanding", "of", "the", "market,", "a", "strong", "sales",
  "development", "strategy,", "disciplined", "outbound", "execution,", "and", "the", "ability",
  "to", "adapt", "when", "the", "business", "landscape", "changes."
];

const PROMISE_PARAGRAPH_2 = [
  "Virtual", "Captains", "brings", "these", "elements", "together", "to", "help", "businesses",
  "build", "stronger", "sales", "pipelines,", "engage", "the", "right", "prospects,", "and",
  "turn", "outbound", "opportunities", "into", "sustainable", "growth."
];

export default function RoleplayToConversation() {
  const sectionRef = useRef<HTMLElement>(null);
  const stage1Ref = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const mainHeadingRef = useRef<HTMLHeadingElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  
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
        const wordElements = rightTextRef.current?.querySelectorAll(".word-reveal");
        if (!wordElements?.length) return;

        // INITIAL STATES
        gsap.set(wordElements, { opacity: 0 });
        gsap.set(eyebrowRef.current, { opacity: 0, scale: 0.85, y: 15 });
        gsap.set(mainHeadingRef.current, { opacity: 0, scale: 0.85, y: 20 });
        gsap.set(twoAudiencesContainerRef.current, { autoAlpha: 0, scale: 0.95 });

        // HEADING ENTRY TIMELINE (Triggers before pinning)
        gsap.to([eyebrowRef.current, mainHeadingRef.current], {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%", // triggers when section is 40% into the viewport
          },
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        });

        // MASTER SCROLL TIMELINE — pinned, no curtain exit
        const masterTl = gsap.timeline({
          scrollTrigger: {
            id: "roleplay-pin",
            trigger: sectionRef.current,
            start: "top top",
            end: () => "+=" + (5400 + (typeof window !== "undefined" ? window.innerHeight : 900)),
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            onUpdate: (self) => {
              if (twoAudiencesRef.current) {
                if (self.progress > 0.48 && self.progress <= 0.86) {
                  const nestedProgress = gsap.utils.normalize(
                    0.48,
                    0.86,
                    self.progress,
                  );
                  twoAudiencesRef.current.jumpToProgress(nestedProgress);
                } else if (self.progress > 0.86) {
                  twoAudiencesRef.current.jumpToProgress(1);
                } else {
                  twoAudiencesRef.current.jumpToProgress(0);
                }
              }
            },
          },
        });

        // 1. Reveal Paragraph Words letter by letter / word by word
        masterTl.to(
          wordElements,
          {
            opacity: 1,
            stagger: 0.04,
            duration: 0.1,
            ease: "none",
          },
          "+=0.2"
        );

        // 2. Hold for a moment to let the user read
        masterTl.to({}, { duration: 0.8 });

        // 3. Fade out Stage 1 and transition background (stays dark)
        masterTl.to(stage1Ref.current, {
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "power2.inOut",
        });

        // 4. Fade in TwoAudiences (Stage 2)
        masterTl.to(
          twoAudiencesContainerRef.current,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        );

        // 5. Give TwoAudiences room to scroll/scrub
        masterTl.to({}, { duration: 3.2 });
      });

      /*
       * ============================================================
       * MOBILE / TABLET (No pin)
       * ============================================================
       */
      mm.add("(max-width: 1023px)", () => {
        const wordElements = rightTextRef.current?.querySelectorAll(".word-reveal");
        
        gsap.set([eyebrowRef.current, mainHeadingRef.current, twoAudiencesContainerRef.current, sectionRef.current], {
          clearProps: "all",
        });
        
        gsap.set(sectionRef.current, { backgroundColor: "#071430" });
        
        if (wordElements) {
          gsap.set(wordElements, { opacity: 1 });
        }

        if (twoAudiencesRef.current) {
          twoAudiencesRef.current.jumpToProgress(0);
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section 
      ref={sectionRef} 
      data-nav-override-zone
      className="relative z-10 w-full overflow-hidden min-h-dvh"
      style={{
        background: "linear-gradient(180deg, #040507 0%, #050b24 25%, #051d5c 60%, #0c318f 100%)",
      }}
    >
      {/* Dotted Background (persists across stages) */}
      <DottedBackground theme="dark" />

      {/* ============================================================
          STAGE 1: OUR PROMISE
      ============================================================ */}
      <div 
        ref={stage1Ref}
        className="relative z-10 flex h-dvh w-full flex-col items-center justify-center p-4 sm:p-8"
      >

        <div className="relative z-10 text-center mb-6 sm:mb-8 md:mb-10">
          <span 
            ref={eyebrowRef} 
            className="text-[11px] sm:text-[13px] uppercase tracking-[0.3em] text-white/50 mb-3 sm:mb-4 block font-bold"
          >
            WHAT WE BELIEVE
          </span>
          <h2 
            ref={mainHeadingRef} 
            className="font-serif text-[clamp(2.1rem,3.4vw,3.6rem)] leading-[1.14] text-white font-normal"
          >
            Driven by <span className="italic text-[#4d82f5]">Sales Execution</span>
          </h2>
        </div>
        
        <div 
          ref={rightTextRef} 
          className="relative z-10 max-w-3xl text-center px-4 sm:px-6 space-y-3.5 sm:space-y-4.5"
        >
          <p className="font-sans text-[clamp(0.92rem,1.15vw,1.15rem)] leading-[1.7] text-white/75 font-normal sm:font-medium">
            {PROMISE_PARAGRAPH_1.map((word, i) => (
              <span key={`p1-${i}`} className="word-reveal inline-block mr-[0.28em] opacity-15">
                {word}
              </span>
            ))}
          </p>
          <p className="font-sans text-[clamp(0.92rem,1.15vw,1.15rem)] leading-[1.7] text-white/75 font-normal sm:font-medium">
            {PROMISE_PARAGRAPH_2.map((word, i) => (
              <span key={`p2-${i}`} className="word-reveal inline-block mr-[0.28em] opacity-15">
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* ============================================================
          STAGE 2: TWO AUDIENCES (Choose Your Path)
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
