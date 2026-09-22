"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const ellipseRef = useRef<SVGEllipseElement>(null);
  const glowEllipseRef = useRef<SVGEllipseElement>(null);
  const metricRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial states
      gsap.set(metricRefs.current, { opacity: 0, scale: 0.85, y: 15 });

      const circumference = 1450;
      if (ellipseRef.current) {
        gsap.set(ellipseRef.current, {
          strokeDasharray: circumference,
          strokeDashoffset: circumference,
          opacity: 0,
        });
      }
      if (glowEllipseRef.current) {
        gsap.set(glowEllipseRef.current, {
          strokeDasharray: circumference,
          strokeDashoffset: circumference,
          opacity: 0,
        });
      }

      // 2. ScrollTrigger Entrance
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          // Draw the neon lime ellipse orbit
          if (ellipseRef.current && glowEllipseRef.current) {
            tl.to(
              [ellipseRef.current, glowEllipseRef.current],
              {
                strokeDashoffset: 0,
                opacity: 1,
                duration: 1.6,
                ease: "power2.inOut",
              },
              0
            );
          }

          // Staggered pop-in for all 6 metrics
          tl.to(
            metricRefs.current,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: "back.out(1.35)",
            },
            0.35
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label="Scale and Impact Metrics"
      className="relative w-full overflow-hidden py-12 sm:py-16 md:py-20 lg:py-18 xl:py-24 2xl:py-28 select-none flex flex-col items-center justify-center"
    >
      {/* ── Ambient Radial Glow ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] lg:w-[1300px] h-[450px] sm:h-[650px] bg-radial from-[#15347d]/35 via-[#0a1b4d]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Standard Navbar max-width Container (max-w-372) */}
      <div className="w-full max-w-372 mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 relative z-10">
        <h2 className="sr-only">
          Scale and Impact: 10+ Industries, 200+ Corporate Sessions, 8+ Countries, 500+ Sales Teams Coached, 15,000+ Professionals Trained, 3 Continents
        </h2>

        {/* ── STAGE: Exact mathematical 3D ellipse and node coordinate layout (Aspect 1024:629) ── */}
        <div className="relative w-full max-w-[1024px] mx-auto aspect-[1024/629] min-h-[260px] sm:min-h-0">
          
          {/* SVG 3D Ellipse Track: Exact 1024x629 Geometry (cx=512, cy=293, rx=320, ry=110, rotate=14.9deg) */}
          <svg
            viewBox="0 0 1024 629"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            {/* Diffused Outer Lime Glow Orbit */}
            <ellipse
              ref={glowEllipseRef}
              cx="512"
              cy="293"
              rx="320"
              ry="110"
              transform="rotate(14.9 512 293)"
              fill="none"
              stroke="#e5ff00"
              strokeWidth="4"
              opacity="0.25"
              filter="blur(4px)"
            />

            {/* Crisp Core Lime Ellipse Orbit */}
            <ellipse
              ref={ellipseRef}
              cx="512"
              cy="293"
              rx="320"
              ry="110"
              transform="rotate(14.9 512 293)"
              fill="none"
              stroke="#e5ff00"
              strokeWidth="1.8"
              filter="drop-shadow(0 0 10px rgba(229, 255, 0, 0.6))"
            />
          </svg>

          {/* Metric 1: 200+ Corporate Sessions Delivered (Top-Left: X=19.4%, Y=12.2%) */}
          <div
            ref={(el) => {
              metricRefs.current[0] = el;
            }}
            style={{ left: "19.4%", top: "12.2%" }}
            className="absolute text-center will-change-transform group cursor-pointer"
          >
            <p className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white font-sans transition-transform duration-300 group-hover:scale-108 group-hover:text-[#e5ff00]">
              200+
            </p>
            <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs lg:text-sm text-slate-200/90 font-sans leading-tight">
              Corporate Sessions
              <br />
              Delivered
            </p>
          </div>

          {/* Metric 2: 10+ Industries (Foreground Far-Left: Dominant / Largest: X=17.9%, Y=40.1%) */}
          <div
            ref={(el) => {
              metricRefs.current[1] = el;
            }}
            style={{ left: "17.9%", top: "40.1%" }}
            className="absolute text-center will-change-transform z-20 group cursor-pointer"
          >
            <p className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.75rem] font-bold tracking-tight text-white font-sans leading-none transition-transform duration-300 group-hover:scale-104 drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] group-hover:text-[#e5ff00]">
              10+
            </p>
            <p className="mt-0.5 sm:mt-1.5 text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-white font-sans tracking-tight">
              Industries
            </p>
          </div>

          {/* Metric 3: 500+ Sales Team Coached (Top-Center / Receding Perspective: X=50.8%, Y=23.1%) */}
          <div
            ref={(el) => {
              metricRefs.current[2] = el;
            }}
            style={{ left: "50.8%", top: "23.1%" }}
            className="absolute text-center will-change-transform opacity-80 group cursor-pointer"
          >
            <p className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-slate-200 font-sans transition-all duration-300 group-hover:scale-108 group-hover:text-white group-hover:opacity-100">
              500+
            </p>
            <p className="mt-0.5 text-[7px] sm:text-[10px] lg:text-[11px] text-slate-400 font-sans leading-tight group-hover:text-slate-200 transition-colors">
              Sales Team
              <br />
              Coached
            </p>
          </div>

          {/* Metric 4: 8+ Countries (Bottom-Center Foreground: X=46.4%, Y=60.7%) */}
          <div
            ref={(el) => {
              metricRefs.current[3] = el;
            }}
            style={{ left: "46.4%", top: "60.7%" }}
            className="absolute text-center will-change-transform z-20 group cursor-pointer"
          >
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white font-sans leading-none transition-transform duration-300 group-hover:scale-108 group-hover:text-[#e5ff00]">
              8+
            </p>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-base md:text-lg lg:text-xl font-medium text-white font-sans tracking-tight">
              Countries
            </p>
          </div>

          {/* Metric 5: 15000+ Professionals Trained (Far-Right / Receding Perspective: X=74.0%, Y=46.1%) */}
          <div
            ref={(el) => {
              metricRefs.current[4] = el;
            }}
            style={{ left: "74.0%", top: "46.1%" }}
            className="absolute text-center will-change-transform opacity-80 group cursor-pointer"
          >
            <p className="text-xs sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-200 font-sans transition-all duration-300 group-hover:scale-108 group-hover:text-white group-hover:opacity-100">
              15000+
            </p>
            <p className="mt-0.5 text-[7px] sm:text-[10px] lg:text-[11px] text-slate-400 font-sans leading-tight group-hover:text-slate-200 transition-colors">
              Professionals
              <br />
              Trained
            </p>
          </div>

          {/* Metric 6: 3 Continents (Bottom-Right Foreground: X=68.4%, Y=67.1%) */}
          <div
            ref={(el) => {
              metricRefs.current[5] = el;
            }}
            style={{ left: "68.4%", top: "67.1%" }}
            className="absolute text-center will-change-transform z-20 group cursor-pointer"
          >
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white font-sans leading-none transition-transform duration-300 group-hover:scale-108 group-hover:text-[#e5ff00]">
              3
            </p>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm md:text-base lg:text-lg font-medium text-white font-sans tracking-tight">
              Continents
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
