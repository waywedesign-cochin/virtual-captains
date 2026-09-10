"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Drives all scrolling through Lenis instead of the native wheel/touch
 * handler, then syncs it with GSAP's ticker so every ScrollTrigger-pinned
 * section scrubs off the same eased scroll position rather than raw,
 * steppy wheel deltas.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      syncTouch: true,
    });

    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    // The page has many independently-mounted pinned sections, each
    // inserting its own pin-spacer into the document as it registers —
    // meaning the page's true scrollable height keeps growing well after
    // Lenis first measures it. Without this, Lenis's cached scroll limit
    // goes stale and silently caps how far the user can actually scroll,
    // short of newly added content further down the page (this is the
    // standard GSAP+Lenis integration requirement, not optional wiring).
    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    // Deferred, not immediate: this effect can fire before every other
    // section's own pin-registering effect has run, so an immediate
    // refresh() here would still measure a too-short document.
    const initialRefresh = window.setTimeout(() => ScrollTrigger.refresh(), 200);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.clearTimeout(initialRefresh);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
