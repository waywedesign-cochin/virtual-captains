"use client";

import { type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { HEADING_REVEAL, HEADING_REVEAL_FROM } from "@/lib/animations/headingReveal";
gsap.registerPlugin(ScrollTrigger);

/**
 * The site-wide heading entrance (see lib/animations/headingReveal): a
 * smooth fade + rise that settles from 92% scale on a long ease-out — played
 * when the heading itself nears the bottom of the screen, reversed on
 * scroll-back.
 *
 * Only use on headings that have no other transform/opacity animation of
 * their own; two tweens fighting over one element leave it stuck mid-state.
 */
export function useHeadingZoom(ref: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { ...HEADING_REVEAL_FROM, transformOrigin: "center center" });
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse",
        // Measure after every pin on the page has added its spacer; otherwise
        // headings below a pinned section fire early and have already
        // finished zooming by the time they scroll into view.
        refreshPriority: -1,
      },
      ...HEADING_REVEAL,
    });
    ScrollTrigger.sort();
  });
}
