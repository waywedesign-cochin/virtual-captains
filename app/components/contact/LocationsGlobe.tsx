"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { offices } from "./data";
import CountryFlag from "../common/CountryFlag";
import ZoomHeading from "@/components/common/ZoomHeading";

gsap.registerPlugin(ScrollTrigger);

export default function LocationsGlobe() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const officeCardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, ...officeCardsRef.current], {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        return;
      }

      // Initial states
      gsap.set(headerRef.current, { opacity: 0, y: 35 });
      gsap.set(officeCardsRef.current, { opacity: 0, y: 30, scale: 0.96 });

      // Header and Cards timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }).to(
        officeCardsRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 0.85,
          ease: "back.out(1.3)",
        },
        "-=0.4"
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="locations"
      className="relative px-4 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28 bg-[#040507] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 h-125 w-125 rounded-full bg-[#1c4fc0]/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-20 h-64 w-64 rounded-full bg-[#38bdf8]/10 blur-[100px]"
      />

      {/* Container aligned with Navbar */}
      <div className="relative z-10 w-full max-w-372 mx-auto">
        <div ref={headerRef} className="mx-auto max-w-6xl text-center will-change-transform">
          <span className="font-sans text-[10px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-[#38bdf8]">
            Where To Find Us
          </span>
          <ZoomHeading className="mt-4 font-sans text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-white">
            Our Global{" "}
            <span className="italic bg-linear-to-r from-[#38bdf8] to-[#7dd3fc] bg-clip-text text-transparent">
              Footprint
            </span>
          </ZoomHeading>
          <p className="mx-auto mt-5 max-w-4xl text-sm sm:text-lg leading-relaxed text-white/75 font-sans">
            With teams across India, the UAE and Malaysia, we support sales
            organisations across 8+ countries.
          </p>
        </div>

        {/* Office cards — each carries its own compact map window */}
        <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {offices.map((office, i) => (
            <div
              key={office.id}
              ref={(el) => {
                officeCardsRef.current[i] = el;
              }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0c101a]/70 p-3 sm:p-3.5 backdrop-blur-xl shadow-[0_16px_36px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-white/25 hover:bg-[#101626]/80 hover:-translate-y-1 will-change-transform"
            >
              {/* Map window: always dark-styled */}
              <div className="relative h-52 sm:h-60 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c14]">
                <iframe
                  src={office.mapEmbed}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={`Map — Virtual Captains ${office.country} office`}
                  className="h-full w-full border-0 [filter:invert(92%)_hue-rotate(180deg)_contrast(95%)_saturate(120%)]"
                />
                {/* Soft fade into the card + location chip */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#0c101a]/80 to-transparent" />
                <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#040507]/75 px-2.5 py-1 text-[11px] font-medium text-white/85 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e7ff3d] shadow-[0_0_6px_#e7ff3d] animate-pulse" />
                  {office.city}
                </span>
              </div>

              <div className="flex items-start gap-4 px-3 pb-3 pt-5 sm:px-4 sm:pb-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/5 text-2xl shadow-inner">
                  <CountryFlag code={office.flag} className="h-5 w-auto" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {office.country}
                    </h3>
                    <span className="rounded-full border border-[#e7ff3d]/30 bg-[#e7ff3d]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#e7ff3d]">
                      {office.tag}
                    </span>
                  </div>

                  <div className="mt-2.5 text-sm sm:text-[15px] leading-relaxed text-white/65 font-sans">
                    {office.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </div>

                  <a
                    href={office.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#38bdf8] transition-colors hover:text-[#e7ff3d]"
                  >
                    <span>Get Directions</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M7 17 17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
