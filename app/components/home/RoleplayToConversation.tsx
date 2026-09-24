"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TwoAudiences, { TwoAudiencesRef } from "./TwoAudiences";
import DottedBackground from "./DottedBackground";

gsap.registerPlugin(ScrollTrigger);

const PROMISE_TEXT = [
  "Sales", "success", "is", "built", "on", "more", "than", "individual", "tactics.",
  "It", "takes", "a", "clear", "understanding", "of", "the", "market,", "strong", "sales", "strategy,",
  "disciplined", "execution,", "and", "the", "expertise", "to", "adapt", "when", "the",
  "business", "landscape", "changes.", "Virtual", "Captains", "brings", "these",
  "elements", "together", "to", "help", "businesses", "strengthen", "their", "sales",
  "function", "and", "create", "sustainable", "performance."
];

export default function RoleplayToConversation() {
  const sectionRef = useRef<HTMLElement>(null);
  const stage1Ref = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const mainHeadingRef = useRef<HTMLHeadingElement>(null);
  const rightTextRef = useRef<HTMLParagraphElement>(null);
  
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

        // MASTER SCROLL TIMELINE
        const masterTl = gsap.timeline({
          scrollTrigger: {
            id: "roleplay-pin",
            trigger: sectionRef.current,
            start: "top top",
            end: "+=6000",
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              if (twoAudiencesRef.current) {
                if (self.progress > 0.57) {
                  const nestedProgress = gsap.utils.normalize(
                    0.57,
                    1,
                    self.progress,
                  );
                  twoAudiencesRef.current.jumpToProgress(nestedProgress);
                } else {
                  twoAudiencesRef.current.jumpToProgress(0);
                }
              }
            },
          },
        });

        // 1. Zoom in Eyebrow and Heading (Zoom effect)
        // (Moved to separate ScrollTrigger above so it happens earlier)

        // 2. Reveal Paragraph Words letter by letter / word by word
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

        // 3. Hold for a moment to let the user read
        masterTl.to({}, { duration: 0.8 });

        // 4. Fade out Stage 1 and transition background to dark
        masterTl.to(stage1Ref.current, {
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "power2.inOut",
        });
        
        masterTl.to(sectionRef.current, {
          backgroundColor: "#0a0b0d",
          duration: 0.8,
          ease: "power2.inOut",
        }, "<"); // animate bg concurrently with fade out

        // Animate dots to white so they persist nicely
        masterTl.to("#dotPattern circle", {
          fill: "#ffffff",
          opacity: 0.15,
          duration: 0.8,
          ease: "power2.inOut",
        }, "<");

        // 5. Fade in TwoAudiences (Stage 2)
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

        // 6. Give TwoAudiences room to scroll/scrub
        masterTl.to({}, { duration: 3.5 });
      });

      /*
       * ============================================================
       * MOBILE / TABLET (No pin)
       * ============================================================
       */
      mm.add("(max-width: 1023px)", () => {
        const wordElements = rightTextRef.current?.querySelectorAll(".word-reveal");
        
        gsap.set([eyebrowRef.current, mainHeadingRef.current, twoAudiencesContainerRef.current], {
          clearProps: "all",
        });
        
        gsap.set(sectionRef.current, { backgroundColor: "#0a0b0d" }); // default to dark for flow
        
        if (wordElements) {
          gsap.set(wordElements, { opacity: 1 });
        }

        if (twoAudiencesRef.current) {
          twoAudiencesRef.current.jumpToProgress(0); // Start with Organisations
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section 
      ref={sectionRef} 
      data-nav-override-zone
      className="relative w-full bg-white overflow-hidden min-h-dvh"
    >
      {/* Dotted Background (persists across stages) */}
      <DottedBackground theme="light" />

      {/* ============================================================
          STAGE 1: OUR PROMISE
      ============================================================ */}
      <div 
        ref={stage1Ref}
        className="relative z-10 flex h-dvh w-full flex-col items-center justify-center p-4 sm:p-8"
      >

        <div className="relative z-10 text-center mb-10 sm:mb-16">
          <span 
            ref={eyebrowRef} 
            className="text-[11px] sm:text-[13px] uppercase tracking-[0.3em] text-[#141414]/60 mb-6 sm:mb-8 block font-bold"
          >
            What Drives Us
          </span>
          <h2 
            ref={mainHeadingRef} 
            className="font-serif text-[clamp(2.5rem,4vw,4.5rem)] leading-[1.1] text-[#141414] font-normal"
          >
            The Benchmark for<br />
            <span className="italic text-[#1d4ed8]">Strategic Sales Execution</span>
          </h2>
        </div>
        
        <div className="relative z-10 max-w-4xl text-center px-4 sm:px-8">
          <p 
            ref={rightTextRef} 
            className="font-sans text-[clamp(1.1rem,1.8vw,1.8rem)] leading-[1.6] text-[#141414] font-medium"
          >
            {PROMISE_TEXT.map((word, i) => (
              <span key={i} className="word-reveal inline-block mr-[0.3em] opacity-15">
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
        className="relative z-30 flex items-center justify-center w-full h-full opacity-100 pointer-events-auto mt-12 sm:mt-16 lg:mt-0 lg:absolute lg:inset-0 lg:z-50 lg:opacity-0 lg:pointer-events-none p-3 sm:p-4 lg:p-3 xl:p-4"
      >
        <div className="pointer-events-auto w-full h-full">
          <TwoAudiences ref={twoAudiencesRef} />
        </div>
      </div>
    </section>
  );
}
