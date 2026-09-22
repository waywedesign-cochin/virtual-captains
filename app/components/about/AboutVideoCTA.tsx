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
  bookCallHref?: string;
}

export default function AboutVideoCTA({
  youtubeEmbedUrl = "https://www.youtube.com/embed/ulkbdVqfCNI?si=oGFGEB6NIAxtmUxS",
  bookCallHref = "/contact",
}: AboutVideoCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const ctaOuterRef = useRef<HTMLDivElement>(null);
  const ctaInnerRef = useRef<HTMLDivElement>(null);
  const pulseRing1Ref = useRef<HTMLDivElement>(null);
  const pulseRing2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(videoWrapperRef.current, { opacity: 0, x: -35 });
      gsap.set(ctaOuterRef.current, { opacity: 0, scale: 0.82 });

      // Entrance animation on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 72%",
        once: true,
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

          // 2. Reveal concentric circular button with spring
          tl.to(
            ctaOuterRef.current,
            {
              opacity: 1,
              scale: 1,
              duration: 1.1,
              ease: "back.out(1.4)",
            },
            0.15
          );

          // 3. Multi-ring ambient breathing / radar pulse
          if (pulseRing1Ref.current) {
            gsap.to(pulseRing1Ref.current, {
              scale: 1.14,
              opacity: 0.6,
              duration: 2.8,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          }
          if (pulseRing2Ref.current) {
            gsap.to(pulseRing2Ref.current, {
              scale: 1.24,
              opacity: 0.35,
              duration: 3.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 0.6,
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label="Video presentation and call booking"
      className="relative w-full overflow-hidden py-14 sm:py-20 md:py-24 lg:py-20 xl:py-28 select-none flex flex-col items-center justify-center"
    >
      {/* ── Ambient Radial Background Lighting ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] lg:w-[1300px] h-[450px] sm:h-[600px] bg-radial from-[#123891]/30 via-[#07194f]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* ── Standard Navbar max-width Container (max-w-372) ── */}
      <div className="w-full max-w-372 mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 relative z-10">
        
        {/* Two-Column Grid: Video on Left, Concentric "Book A Call" on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-14 items-center">
          
          {/* ── LEFT COLUMN: YouTube Iframe Container ── */}
          <div
            ref={videoWrapperRef}
            className="lg:col-span-7 w-full flex items-center justify-center will-change-transform"
          >
            <div className="relative w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-black/90 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl group hover:border-white/35 transition-colors duration-500">
              {/* Subtle top rim light */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10" />
              
              <iframe
                src={youtubeEmbedUrl}
                title="Virtual Captains Video Presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>

          {/* ── RIGHT COLUMN: Concentric Circular "Book A Call" CTA ── */}
          <div className="lg:col-span-5 w-full flex items-center justify-center will-change-transform">
            <Link
              href={bookCallHref}
              aria-label="Book A Call with Virtual Captains"
              className="group relative flex items-center justify-center cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-blue-400 rounded-full"
            >
              {/* Outer Radar Pulse Wave 2 */}
              <div
                ref={pulseRing2Ref}
                className="absolute inset-0 rounded-full bg-blue-500/15 blur-2xl pointer-events-none transition-all duration-500 group-hover:bg-blue-500/25"
              />

              {/* Outer Radar Pulse Wave 1 */}
              <div
                ref={pulseRing1Ref}
                className="absolute inset-0 rounded-full bg-blue-500/25 blur-xl pointer-events-none transition-all duration-300 group-hover:bg-blue-500/40"
              />

              {/* Outer Concentric Semi-Transparent Circle */}
              <div
                ref={ctaOuterRef}
                className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[320px] lg:h-[320px] xl:w-[380px] xl:h-[380px] 2xl:w-[420px] 2xl:h-[420px] rounded-full bg-[#1b4cc4]/30 border border-blue-400/30 backdrop-blur-md flex items-center justify-center shadow-[0_12px_36px_rgba(0,0,0,0.4)] transition-all duration-500 group-hover:bg-[#1b4cc4]/45 group-hover:scale-103 group-hover:border-blue-400/50"
              >
                {/* Inner Concentric Solid / Radiant Blue Disc */}
                <div
                  ref={ctaInnerRef}
                  className="w-38 h-38 sm:w-50 sm:h-50 md:w-56 md:h-56 lg:w-[220px] lg:h-[220px] xl:w-[260px] xl:h-[260px] 2xl:w-[290px] 2xl:h-[290px] rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] shadow-[0_10px_35px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] flex items-center justify-center transition-all duration-300 group-hover:scale-106 group-hover:shadow-[0_0_55px_rgba(59,130,246,0.75)]"
                >
                  {/* Centered Typography: "Book A Call" */}
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-normal tracking-tight text-white font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-104 select-none">
                    Book A Call
                  </span>
                </div>
              </div>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
