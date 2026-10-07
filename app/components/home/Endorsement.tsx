"use client";

import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DottedBackground from "./DottedBackground";
import { NO_PIN_QUERY, PIN_QUERY } from "./pinQuery";
import TestimonialDrum from "../common/TestimonialDrum";
import { TESTIMONIALS } from "@/app/content/testimonials";

import {
  HEADING_REVEAL,
  HEADING_REVEAL_FROM,
} from "@/lib/animations/headingReveal";
gsap.registerPlugin(ScrollTrigger);

/** Home shows every client quote except Deepak Nair's (SalesX keeps it). */
const HOME_TESTIMONIALS = TESTIMONIALS.filter((t) => t.name !== "Deepak Nair");

/**
 * "Our Partners & Clients" — client quotes on a horizontal cylinder. On
 * pinned desktops scrolling turns the drum; elsewhere it autoplays.
 */
export default function Endorsement() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  /** Drum position while pinned (scroll-driven); null = drum runs itself. */
  const [scrollPos, setScrollPos] = useState<number | null>(null);
  const N = HOME_TESTIMONIALS.length;

  // Arrows/dots while pinned: scroll (through Lenis) to that quote's spot.
  const scrollToQuote = useCallback(
    (index: number) => {
      const st = ScrollTrigger.getById("endorsement-pin");
      if (!st) return;
      const target = st.start + (st.end - st.start) * (index / (N - 1));
      if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.1, lock: false });
      else window.scrollTo({ top: target, behavior: "smooth" });
    },
    [N],
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: pin the section and let scroll turn the drum
      mm.add(PIN_QUERY, () => {
        setScrollPos(0);
        const pinTl = gsap.timeline({
          scrollTrigger: {
            id: "endorsement-pin",
            trigger: sectionRef.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * 0.7 * (N - 1),
            pin: true,
            anticipatePin: 1,
            scrub: 0.6,
            snap: {
              snapTo: 1 / (N - 1),
              duration: { min: 0.2, max: 0.5 },
              delay: 0.08,
              ease: "power2.inOut",
            },
            onUpdate: (self) => setScrollPos(self.progress * (N - 1)),
          },
        });
        pinTl.to({}, { duration: 1 });
        return () => {
          pinTl.kill();
          setScrollPos(null);
        };
      });

      mm.add(NO_PIN_QUERY, () => {
        gsap.set(sectionRef.current, { clearProps: "transform" });
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 0, y: 15 });
      gsap.set(headingRef.current, {
        ...HEADING_REVEAL_FROM,
        transformOrigin: "center center",
      });
      gsap.set(stackRef.current, { opacity: 0, y: 40 });

      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
      if (eyebrowRef.current) {
        entranceTl.to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
      entranceTl
        .to(headingRef.current, { ...HEADING_REVEAL }, eyebrowRef.current ? "-=0.25" : undefined)
        .to(stackRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3");
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="endorsement"
      data-nav-section="Endorsement"
      data-nav-theme="dark"
      className="relative z-10 flex min-h-0 pin:min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-12 sm:py-16 pin:pt-[clamp(68px,12vh,152px)] pin:[@media(max-height:540px)]:pt-14 pin:[@media(max-height:540px)]:pb-3 pin:pb-[clamp(28px,5vh,72px)] text-white sm:px-10 pin:px-16"
      style={{
        background:
          "linear-gradient(180deg, #0c318f 0%, #051d5c 40%, #050b24 75%, #040507 100%)",
      }}
    >
      <DottedBackground theme="dark" />

      <div className="relative z-10 flex w-full max-w-[1920px] flex-col items-center">
        <span
          ref={eyebrowRef}
          className="mb-[clamp(12px,2vh,24px)] block text-center font-sans text-[10px] uppercase tracking-[0.25em] text-white/50"
        >
          <span className="whitespace-nowrap">Social Proof · Enterprise</span>{" "}
          <span className="whitespace-nowrap">· Individual · Global</span>
        </span>

        <h2
          ref={headingRef}
          className="max-w-2xl text-center font-sans text-[clamp(1.75rem,2.2vw+1.2vh,3rem)] font-normal leading-[1.18] text-white"
        >
          Our Partners & Clients
        </h2>

        <div
          ref={stackRef}
          className="mt-[clamp(28px,5vh,60px)] w-full pin:[@media(max-height:640px)]:[zoom:0.85] pin:[@media(max-height:540px)]:[zoom:0.72]"
        >
          <TestimonialDrum
            items={HOME_TESTIMONIALS}
            scrollPos={scrollPos}
            onSelect={scrollToQuote}
          />
        </div>
      </div>
    </section>
  );
}
