"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * SalesX hero — one pinned, scroll-driven stage (it replaces the old hero +
 * separate dashboard-image section):
 *
 *   1. Full-bleed video plays under the brand pill + Enroll badge.
 *   2. Scrolling raises the dashboard image from the bottom into place while
 *      the video fades to transparent and vanishes.
 *   3. With the image settled, a gradient rises over its lower half into the
 *      page background and the headline + copy rise in on top of it.
 *   4. Short hold, then the pin releases into the next section.
 *
 * Every animated element has exactly one tween owner (entrance tweens run on
 * inner wrappers, scroll tweens on outer ones) so they can't fight.
 * Reduced motion: no pin — the finished composition is shown.
 * Below 1024px: no pin either — pill, image, copy and Enroll stack in normal
 * flow, so a tall phone screen has no dead gap between image and headline.
 */
// React doesn't reliably render the `muted` attribute, and iOS won't autoplay
// a video it thinks has sound — so force it on the element, and snap it back
// if anything ever unmutes it. The hero videos are always silent.
const keepMuted = (v: HTMLVideoElement | null) => {
  if (!v) return;
  v.muted = true;
  v.defaultMuted = true;
  v.setAttribute("muted", "");
};
const onVolumeChange = (e: React.SyntheticEvent<HTMLVideoElement>) => {
  if (!e.currentTarget.muted) e.currentTarget.muted = true;
};

export default function SalesXHero() {
  const [selectedBrand, setSelectedBrand] = useState<"salesx" | "captains">("salesx");

  const sectionRef = useRef<HTMLElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const enrollOuterRef = useRef<HTMLDivElement>(null);
  const enrollInnerRef = useRef<HTMLDivElement>(null);
  const pillInnerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: reduce)", () => {
        // Finished composition, no motion
        gsap.set(videoLayerRef.current, { autoAlpha: 0 });
        gsap.set(enrollOuterRef.current, { autoAlpha: 0 });
      });

      // Compact screens: just the page-load entrance, no scroll stage
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.from(pillInnerRef.current, { y: -30, opacity: 0, scale: 0.92, duration: 1, ease: "back.out(1.4)", delay: 0.2 });
        gsap.from(copyRef.current, { y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.3 });
      });

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]", copyRef.current);

        // Page-load entrance (inner wrappers only)
        gsap.from(pillInnerRef.current, { y: -30, opacity: 0, scale: 0.92, duration: 1, ease: "back.out(1.4)", delay: 0.2 });
        gsap.from(enrollInnerRef.current, { y: 35, opacity: 0, scale: 0.92, duration: 0.95, ease: "power3.out", delay: 0.35 });

        // Scroll stage start state
        gsap.set(imageRef.current, { y: () => window.innerHeight * 0.95, scale: 0.9 });
        gsap.set(fadeRef.current, { opacity: 0 });
        gsap.set(lines, { opacity: 0, y: 40 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * 2.2,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1 → image rises in while the video fades out and vanishes
        tl.to(imageRef.current, { y: 0, scale: 1, duration: 1, ease: "power2.out" }, 0)
          .to(videoLayerRef.current, { opacity: 0, scale: 1.08, duration: 0.85, ease: "power1.in" }, 0.1)
          .to(enrollOuterRef.current, { autoAlpha: 0, y: 20, duration: 0.3 }, 0.1)
          // 2 → gradient rises over the image, copy comes in on top
          .to(fadeRef.current, { opacity: 1, duration: 0.5 }, 1)
          .to(lines, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: "power3.out" }, 1.15)
          // 3 → hold before release
          .to({}, { duration: 0.6 });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label="SalesX Hero Section"
      className="relative w-full h-svh overflow-hidden bg-salesx-bg select-none max-lg:h-auto max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-8 max-lg:pb-14 sm:max-lg:gap-10"
    >
      <h1 className="sr-only">
        SalesX | High-Velocity AI Sales Simulation Engine by Virtual Captains
      </h1>

      {/* ── Layer 1: video (fades to transparent as the image rises) ── */}
      <div ref={videoLayerRef} className="absolute inset-0 will-change-[opacity,transform] max-lg:hidden">
        <video
          src="/salesx/m.mp4"
          autoPlay
          loop
          muted
          ref={keepMuted}
          onVolumeChange={onVolumeChange}
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-bottom pointer-events-none"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(2,5,20,0.55)_100%)] pointer-events-none" />
      </div>

      {/* ── Phones & tablets: portrait video fills the first screen, then the
          stacked image + copy follow. (Desktop uses the landscape video above.) */}
      <div className="relative -mb-16 h-svh w-full shrink-0 overflow-hidden lg:hidden">
        <video
          src="/salesx/hero-mobile.mp4"
          autoPlay
          loop
          muted
          ref={keepMuted}
          onVolumeChange={onVolumeChange}
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-b from-transparent via-[#030614]/70 to-[#030614] pointer-events-none" />
      </div>

      {/* ── Layer 2: dashboard image (rises from the bottom) ──
          Width is capped by both viewport width and height so it composes on
          phones, tablets, desktops and rotated phones alike. */}
      <div className="absolute inset-x-0 top-[11%] sm:top-[9%] flex justify-center px-4 pointer-events-none max-lg:static max-lg:w-full">
        <div
          ref={imageRef}
          className="relative w-[min(94vw,1180px,128svh)] [@media(max-height:500px)]:w-[min(94vw,110svh)] will-change-transform"
        >
          <div className="absolute inset-[8%] -z-10 rounded-full bg-radial from-[#1e40af]/45 via-[#312e81]/20 to-transparent blur-[90px]" />
          <Image
            src="/salesx/groupdashbords.webp"
            alt="SalesX dashboards — practice sessions, scores and coaching views"
            width={2400}
            height={1440}
            priority
            unoptimized
            className="h-auto w-full object-contain drop-shadow-[0_25px_80px_rgba(0,0,0,0.9)]"
          />
        </div>
      </div>

      {/* ── Layer 3: gradient rising over the image's lower half ── */}
      <div
        ref={fadeRef}
        className="absolute inset-x-0 bottom-0 h-[62%] pointer-events-none max-lg:hidden bg-linear-to-b from-transparent via-[#030614]/85 to-[#030614]"
      />

      {/* ── Layer 4: headline + copy ── */}
      <div
        ref={copyRef}
        className="absolute inset-x-0 bottom-[7%] sm:bottom-[9%] z-10 mx-auto max-lg:static flex max-w-3xl flex-col items-center px-5 text-center font-sans"
      >
        <h2 className="text-[clamp(2rem,1.1rem+3.6vw,4.5rem)] font-medium leading-[1.05] tracking-tight [@media(max-height:500px)]:text-[clamp(1.5rem,5svh,2.25rem)]">
          <span data-hero-line className="block text-white">
            Everyone Sells.
          </span>
          <span
            data-hero-line
            className="block bg-linear-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa] bg-clip-text font-semibold text-transparent"
          >
            Few Are Trained To.
          </span>
        </h2>
        <p
          data-hero-line
          className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75 sm:mt-5 sm:text-base [@media(max-height:500px)]:mt-2 [@media(max-height:500px)]:text-[13px]"
        >
          The interview. The appraisal. The investor meeting. The client who is
          about to walk. Every turning point in a career is a conversation, and
          every conversation is a sale. We train the human who has to walk into it.
        </p>
      </div>

      {/* ── Brand switcher pill (top) ── */}
      <div className="absolute inset-x-0 top-5 sm:top-6 md:top-7 z-30 flex justify-center px-4 pointer-events-none">
        <div ref={pillInnerRef} className="relative group pointer-events-auto">
          <div className="absolute -inset-1 rounded-full bg-linear-to-r from-sky-500/25 via-indigo-500/20 to-blue-500/25 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <div
            role="tablist"
            aria-label="Brand Selector"
            className="relative flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full border border-white/20 hover:border-white/35 bg-[#050920]/80 backdrop-blur-2xl shadow-[0_14px_45px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(255,255,255,0.06)] transition-all duration-300"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedBrand === "salesx"}
              aria-label="SalesX Platform"
              onClick={() => setSelectedBrand("salesx")}
              className={`relative flex items-center justify-center px-4 sm:px-5 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                selectedBrand === "salesx"
                  ? "bg-linear-to-b from-white/25 via-white/14 to-white/6 text-white border border-white/40 shadow-[0_4px_22px_rgba(56,189,248,0.4),inset_0_1px_1px_rgba(255,255,255,0.75)] backdrop-blur-xl"
                  : "text-white/60 hover:text-white/95 hover:bg-white/8 border border-transparent"
              }`}
            >
              <div className="relative h-4.5 sm:h-5 w-18 sm:w-22 flex items-center justify-center">
                <Image
                  src="/salesx/salesx-logo.png"
                  alt="SalesX"
                  width={110}
                  height={28}
                  className="w-full h-full object-contain brightness-115 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                  priority
                />
              </div>
            </button>

            <span className="h-4 sm:h-5 w-px bg-linear-to-b from-transparent via-white/30 to-transparent mx-0.5 pointer-events-none" />

            <Link
              href="/"
              onClick={() => setSelectedBrand("captains")}
              className="relative flex items-center justify-center px-4 sm:px-5 py-2 rounded-full transition-all duration-300 cursor-pointer text-white/60 hover:text-white/95 hover:bg-white/8 border border-transparent"
              title="Virtual Captains Main Platform"
            >
              <div className="relative h-4.5 sm:h-5 w-24 sm:w-28 flex items-center justify-center">
                <Image
                  src="/wlogo.png"
                  alt="Virtual Captains"
                  width={130}
                  height={28}
                  className="w-full h-full object-contain opacity-60 grayscale-35 hover:opacity-95 hover:grayscale-0 transition-all duration-300"
                  priority
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Enroll badge (fades out as the stage takes over) ── */}
      <div
        ref={enrollOuterRef}
        className="absolute bottom-6 sm:bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 md:right-16 z-20 w-max max-w-[calc(100%-2rem)] max-lg:static max-lg:translate-x-0"
      >
        <div ref={enrollInnerRef} className="relative group">
          <div className="absolute -inset-1 rounded-full bg-linear-to-r from-blue-600/25 to-indigo-600/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          <div className="flex items-center gap-4 sm:gap-5 rounded-full border border-white/20 group-hover:border-white/35 bg-[#080d26]/85 py-2 pl-5 pr-2 sm:py-2.5 sm:pl-6 sm:pr-2.5 backdrop-blur-xl shadow-[0_14px_45px_rgba(0,0,0,0.75),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-300">
            {/* Eyebrow + one line, instead of three hard-broken lines */}
            <div className="text-left font-sans">
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#60a5fa] leading-none">
                India&apos;s First
              </p>
              <p className="mt-1.5 text-[13px] sm:text-sm font-medium text-white/95 leading-snug">
                Execution-Backed Sales Training
              </p>
            </div>
            <Link
              href="/programs"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white hover:bg-slate-100 px-5 sm:px-6 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer select-none shrink-0"
            >
              <span className="text-[#f97316] font-extrabold text-xs sm:text-sm">Enroll</span>
              <span className="text-[#6366f1] font-extrabold text-xs sm:text-sm ml-1">Now</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
