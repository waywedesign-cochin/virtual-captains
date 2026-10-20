"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers resize the viewport whenever the address bar shows/hides
// (e.g. on every scroll-direction change). By default ScrollTrigger refreshes
// on that, which re-measures every section mid-scroll and can stall the page
// or snap it back to the hero. Set globally so it covers every route.
ScrollTrigger.config({ ignoreMobileResize: true });

// ignoreMobileResize still refreshes when the height changes by more than
// 25%. In-app browsers with tall toolbars (e.g. the Google app on iPhone)
// cross that when their bars reappear on scroll-up, which snapped the page
// back to the top. On touch screens, drop resize from the auto-refresh events
// entirely and only refresh when the width really changes (rotation).
if (typeof window !== "undefined" && ScrollTrigger.isTouch === 1) {
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    ScrollTrigger.refresh();
  });
}

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
  // Sanity Studio scrolls inside its own panes; Lenis would swallow the
  // wheel there (it only moves the window), so the Studio keeps native scroll.
  const isStudio = usePathname()?.startsWith("/studio") ?? false;

  useEffect(() => {
    if (isStudio) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky exponential momentum decay
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      syncTouch: false, // Let native 120Hz touch/trackpads glide with zero drag
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
  }, [isStudio]);

  return null;
}
