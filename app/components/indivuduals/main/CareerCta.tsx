"use client";

import { useRef } from "react";
import { careerCta } from "@/content/site";
import { BookACallButton } from "../ui/BookACallButton";
import { gsap } from "@/lib/animations/gsap";
import { useGSAP } from "@/lib/animations/gsap";
import { one } from "@/lib/animations/shared";

import { HEADING_REVEAL, HEADING_REVEAL_FROM } from "@/lib/animations/headingReveal";
export function CareerCta() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = scope.current;
      if (!element) return;

      const media = gsap.matchMedia(element);

      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023px)",
        },
        (context) => {
          if (!context.conditions?.motion) return;
          const { isDesktop } = context.conditions;

          const textContainer = one<HTMLElement>(element, "#career-heading");

          // Phones & tablets: no pin — the headline zooms in like every other
          // heading, and the button is already visible beneath it.
          if (!isDesktop) {
            if (!textContainer) return;
            gsap.set(textContainer, { ...HEADING_REVEAL_FROM, });
            gsap.to(textContainer, {
              scrollTrigger: {
                trigger: textContainer,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
              ...HEADING_REVEAL,
            });
            return;
          }

          const leftPart = one<HTMLElement>(element, "[data-career-left]");
          const rightPart = one<HTMLElement>(element, "[data-career-right]");
          const button = one<HTMLElement>(element, "[data-career-button]");
          const wrapper = one<HTMLElement>(element, "[data-career-button-wrapper]");

          if (!leftPart || !rightPart || !button || !textContainer || !wrapper) return;

          const section = element.closest("section") || element;

          // Initialize wrapper state based on device
          gsap.set(wrapper, {
            width: isDesktop ? "1ch" : "100%",
            height: isDesktop ? "auto" : "0px",
          });

          // Phase 1: Pin the section, zoom the text in, then split it and show the button
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=200%",
              pin: true,
              pinSpacing: true,
              scrub: 1,
            },
          });

          // Punchy "super zoom" — overshoots well past normal size so the
          // growth actually reads, then settles back to resting size before
          // the split so the offset math below stays accurate to the text's
          // real width.
          tl.fromTo(
            textContainer,
            { scale: 0.75 },
            { scale: 1.35, duration: 0.8, ease: "back.out(1.7)" },
          ).to(textContainer, {
            scale: 1,
            duration: 0.3,
            ease: "power1.out",
          });

          // Animate the wrapper to open up space between the words naturally
          tl.to(
            wrapper,
            {
              width: isDesktop ? "320px" : "100%",
              height: isDesktop ? "auto" : "100px",
              duration: 1.5,
              ease: "power2.inOut",
            },
            "split",
          );

          // Pop in the button
          tl.to(
            button,
            {
              scale: 1,
              opacity: 1,
              pointerEvents: "auto",
              duration: 0.8,
              ease: "back.out(1.5)",
            },
            "split+=0.4",
          );

          // Phase 3: Fly out the text and grow the button to a reasonable limit
          const flyoutDistance = window.innerWidth;
          
          tl.to(
            leftPart,
            {
              x: isDesktop ? -flyoutDistance : 0,
              y: isDesktop ? 0 : -flyoutDistance,
              opacity: 0,
              duration: 1,
              ease: "power2.in",
            },
            "flyout",
          );
          
          tl.to(
            rightPart,
            {
              x: isDesktop ? flyoutDistance : 0,
              y: isDesktop ? 0 : flyoutDistance,
              opacity: 0,
              duration: 1,
              ease: "power2.in",
            },
            "flyout",
          );

          // Grow the button to a limited size so it sits nicely in the center
          tl.to(
            button,
            {
              scale: 2, // Limited scale instead of massive
              duration: 1.5,
              ease: "back.out(1.2)",
            },
            "flyout+=0.2",
          );
        },
      );
    },
    { scope },
  );

  return (
    <section
      id="career"
      className="relative w-full bg-white text-center text-slate-900 py-12 sm:py-16 lg:py-0 lg:min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="career-heading"
      ref={scope}
    >
      <div
        className="relative flex items-center justify-center w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12"
        data-career-container=""
      >
        <h2
          className="flex flex-col lg:flex-row items-center justify-center w-full relative z-10 type-h2 font-medium will-change-transform text-balance"
          id="career-heading"
        >
          <span
            data-career-left=""
            className="inline-block lg:whitespace-nowrap will-change-transform text-center"
          >
            {careerCta.lead.trim()}
          </span>

          {/* Wrapper that grows to push text apart (desktop). Below lg it sits
              after the text, with the button already showing. */}
          <div
            data-career-button-wrapper=""
            className="order-last mt-8 flex items-center justify-center will-change-auto lg:order-0 lg:mt-0"
          >
            <div
              data-career-button=""
              className="flex items-center justify-center lg:scale-0 lg:opacity-0 lg:pointer-events-none lg:whitespace-nowrap"
            >
              {/* White pill with a solid black border (the old faint-border
                  white variant disappeared on this white section) */}
              <BookACallButton variant="outline" />
            </div>
          </div>

          <span
            data-career-right=""
            className="inline-flex flex-wrap lg:flex-nowrap justify-center items-center gap-x-[1ch] lg:whitespace-nowrap will-change-transform text-center"
          >
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 font-serif italic">
              {careerCta.accent}
            </span>
            <span>{careerCta.trail.trim()}</span>
          </span>
        </h2>
      </div>
    </section>
  );
}
