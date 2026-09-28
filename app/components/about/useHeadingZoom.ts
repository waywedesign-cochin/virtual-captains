"use client";

import { type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * The home page's signature heading entrance: starts small and hidden, then
 * overshoots (1.15), settles back (0.94) and lands at full size — played when
 * the heading itself nears the bottom of the screen, reversed on scroll-back.
 *
 * Only use on headings that have no other transform/opacity animation of
 * their own; two tweens fighting over one element leave it stuck mid-state.
 */
export function useHeadingZoom(ref: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { opacity: 0, scale: 0.65, y: 20, transformOrigin: "center center" });
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 0.85,
      keyframes: [
        { scale: 1.15, opacity: 1, y: -4, duration: 0.42, ease: "power2.out" },
        { scale: 0.94, y: 2, duration: 0.22, ease: "sine.inOut" },
        { scale: 1.0, y: 0, duration: 0.21, ease: "power2.out" },
      ],
    });
  });
}
