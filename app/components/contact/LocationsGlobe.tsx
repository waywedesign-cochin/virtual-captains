"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { offices } from "./data";

gsap.registerPlugin(ScrollTrigger);

export default function LocationsGlobe() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const officeCardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const mapCardRef = useRef<HTMLDivElement>(null);

  const [isDarkMap, setIsDarkMap] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, mapCardRef.current, ...officeCardsRef.current], {
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
      gsap.set(mapCardRef.current, { opacity: 0, y: 45, scale: 0.97 });

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

      // Embedded Map Card reveal
      if (mapCardRef.current) {
        gsap.to(mapCardRef.current, {
          scrollTrigger: {
            trigger: mapCardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
        });
      }
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
        <div ref={headerRef} className="mx-auto max-w-2xl text-center will-change-transform">
          <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
            Where To Find Us · Global Presence
          </span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white">
            Two Offices,{" "}
            <span className="italic text-[#8fd0ff]">One Sales Floor</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/70 font-sans">
            Rooted in India, active across the Gulf, and working with high-growth
            sales teams across 8+ countries in between.
          </p>
        </div>

        {/* Office Detail Cards: Clean 2-Column Responsive Layout */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {offices.map((office, i) => (
            <div
              key={office.id}
              ref={(el) => {
                officeCardsRef.current[i] = el;
              }}
              className="group relative flex items-start gap-5 rounded-2xl border border-white/10 bg-[#0c101a]/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_16px_36px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-white/25 hover:bg-[#101626]/80 hover:-translate-y-1 will-change-transform"
            >
              <span className="grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/5 text-2xl sm:text-3xl shadow-inner">
                {office.flag}
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

                <div className="mt-3 text-sm sm:text-[15px] leading-relaxed text-white/65 font-sans">
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
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#38bdf8] transition-colors hover:text-[#e7ff3d] group-hover:underline"
                >
                  <span>Get Directions</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <path d="M7 17 17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Embedded Interactive Google Map */}
        <div
          ref={mapCardRef}
          className="mt-10 overflow-hidden rounded-[28px] border border-white/12 bg-[#0c101a]/85 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] will-change-transform"
        >
          {/* Map Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4 sm:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-[#e7ff3d] animate-pulse shadow-[0_0_8px_#e7ff3d]" />
              <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                Virtual Captains Headquarters Location
              </h3>
              <span className="hidden sm:inline-block rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/60">
                Panampilly Nagar, Kochi, Kerala
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDarkMap((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1 text-xs text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle map color theme"
              >
                <span>{isDarkMap ? "🌙" : "☀️"}</span>
                <span>{isDarkMap ? "Dark Theme" : "Standard Theme"}</span>
              </button>

              <a
                href="https://www.google.com/maps/search/?api=1&query=9.9552795,76.2960201"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#38bdf8] hover:text-[#e7ff3d] transition-colors"
              >
                <span>Open in Maps</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {/* Map Frame */}
          <div className="relative h-90 sm:h-105 lg:h-115 w-full overflow-hidden bg-[#0a0c14]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.743581568841!2d76.29602009999999!3d9.955279499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0873ac762360cd%3A0xee3e874df53632f8!2sVirtual%20Captains!5e0!3m2!1sen!2sin!4v1789549983677!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: isDarkMap
                  ? "invert(92%) hue-rotate(180deg) contrast(95%) saturate(120%)"
                  : "none",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Virtual Captains Location Map"
              className="h-full w-full transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
