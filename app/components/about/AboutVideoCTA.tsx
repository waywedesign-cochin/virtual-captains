"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutVideoCTAProps {
  youtubeEmbedUrl?: string;
}

export default function AboutVideoCTA({
  youtubeEmbedUrl = "https://www.youtube.com/embed/ulkbdVqfCNI?si=oGFGEB6NIAxtmUxS",
}: AboutVideoCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const ctaOuterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sort and refresh all ScrollTriggers across the page to ensure accurate offsets
    const timer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 150);

    const handleLoad = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) {
      if (videoWrapperRef.current) gsap.set(videoWrapperRef.current, { opacity: 1, x: 0 });
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener("load", handleLoad);
      };
    }

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(videoWrapperRef.current, { opacity: 0, x: -35 });
      gsap.set(".vc-audience-cta", { opacity: 0, y: 24 });

      // Entrance animation on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 78%",
        once: true,
        refreshPriority: 5,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          // 1. Reveal video from left
          tl.to(
            videoWrapperRef.current,
            {
              opacity: 1,
              x: 0,
              duration: 0.95,
            },
            0
          );

          // 2. Audience buttons rise in one after the other
          tl.fromTo(
            ".vc-audience-cta",
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
            0.2
          );
        },
      });
    }, sectionRef);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        role="region"
        aria-label="Video presentation and audience paths"
        className="relative z-20 w-full overflow-hidden py-12 sm:py-16 lg:py-24 select-none flex flex-col items-center justify-center"
      >

        {/* ── Standard Navbar max-width Container (max-w-372) ── */}
        <div className="w-full max-w-372 mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 relative z-10">
          
          {/* Two-Column Grid: Video on Left, audience buttons on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-14 items-center">
            
            {/* ── LEFT COLUMN: YouTube Iframe Container ── */}
            <div
              ref={videoWrapperRef}
              className="lg:col-span-7 w-full flex items-center justify-center will-change-transform"
            >
              <div className="relative w-full max-w-[calc((100svh-6rem)*16/9)] mx-auto aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-black/90 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl group hover:border-white/35 transition-colors duration-500">
                {/* Subtle top rim light */}
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10" />
                
                <iframe
                  src={youtubeEmbedUrl}
                  title="Virtual Captains Video Presentation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>

            {/* ── RIGHT COLUMN: Audience choice — each routes to its own page ── */}
            <div
              ref={ctaOuterRef}
              className="lg:col-span-5 w-full flex flex-col items-center gap-4 sm:gap-5 lg:items-start lg:pl-6 xl:pl-10"
            >
              <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/50">
                Where do you fit?
              </p>
              {[
                { href: "/individuals", label: "I'm a Learner", sub: "Build your own sales skills" },
                { href: "/organisations", label: "I'm a Business", sub: "Train and scale your team" },
              ].map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className="vc-audience-cta group relative flex w-full max-w-sm items-center justify-between gap-4 rounded-2xl border border-blue-400/35 bg-[#1b4cc4]/20 px-6 py-4 sm:py-5 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/70 hover:bg-[#1b4cc4]/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <span className="flex flex-col">
                    <span className="text-lg sm:text-xl font-medium tracking-tight text-white">
                      {cta.label}
                    </span>
                    <span className="mt-0.5 text-xs sm:text-[13px] text-white/60">
                      {cta.sub}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:border-[#F3FC00] group-hover:bg-[#F3FC00] group-hover:text-[#020B25]"
                  >
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

    </>
  );
}
