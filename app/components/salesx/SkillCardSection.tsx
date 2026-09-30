"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingZoom } from "@/components/about/useHeadingZoom";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BANDS = [
  {
    label: "Band 1",
    title: "Developing",
    containerClass: "border border-amber-600/40 bg-[#060919]/90",
    labelClass: "text-slate-400",
  },
  {
    label: "Band 2",
    title: "Competent",
    containerClass: "border border-blue-500/40 bg-[#060919]/90",
    labelClass: "text-slate-400",
  },
  {
    label: "Band 3",
    title: "Proficient",
    containerClass: "border border-blue-400/60 bg-[#12235c]",
    labelClass: "text-blue-200/80",
    hasCertIcon: true,
  },
  {
    label: "Band 4",
    title: "VC Elite",
    containerClass:
      "border border-indigo-400/50 bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#7c3aed] shadow-[0_0_30px_rgba(99,102,241,0.35)]",
    labelClass: "text-white/80",
    isElite: true,
  },
];

const SKILLS = [
  { id: "outreaching", label: "Outreaching" },
  { id: "cold-calling", label: "Cold Calling" },
  { id: "objection-handling", label: "Objection\nHandling" },
  { id: "negotiation", label: "Negotiation" },
  { id: "closure", label: "Closure" },
];

// Example card: one candidate's real-looking result
const EXAMPLE = {
  name: "Candidate Name",
  band: BANDS[3],
  scores: [50, 38, 65, 43, 52],
};

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function SkillCardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingZoom(headingRef);

  useEffect(() => {
    // Refresh ScrollTrigger so pinned sections above (SalesXMoments, etc.) don't displace triggers
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) {
      return () => clearTimeout(refreshTimer);
    }

    const ctx = gsap.context(() => {
      // Trigger smooth entrance animation when scrolled into view
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ".sc-band",
            { y: 22, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
            },
          );
          gsap.fromTo(
            ".sc-skill",
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.06,
              ease: "power3.out",
            },
          );
          gsap.fromTo(
            ".sc-arc",
            { strokeDashoffset: CIRCUMFERENCE },
            {
              strokeDashoffset: 0,
              duration: 1.4,
              ease: "power2.inOut",
              stagger: 0.08,
            },
          );
          // Example card: arcs fill to each score, dots travel to the arc's end
          gsap.fromTo(
            ".sc-ex-arc",
            { strokeDashoffset: CIRCUMFERENCE },
            {
              strokeDashoffset: (_: number, el: Element) => Number((el as SVGElement).dataset.offset),
              duration: 1.4,
              ease: "power2.inOut",
              stagger: 0.08,
              delay: 0.3,
            },
          );
          gsap.fromTo(
            ".sc-ex-dot",
            { rotate: 0 },
            {
              rotate: (_: number, el: Element) => Number((el as HTMLElement).dataset.rot),
              duration: 1.4,
              ease: "power2.inOut",
              stagger: 0.08,
              delay: 0.3,
              transformOrigin: "50% 50%",
            },
          );
          gsap.fromTo(
            ".sc-dot",
            { rotate: 0 },
            {
              rotate: 360,
              duration: 1.4,
              ease: "power2.inOut",
              stagger: 0.08,
              transformOrigin: "50% 50%",
            },
          );
        },
      });

      // Subtle pulse glow on the VC Elite card
      gsap.to(".sc-elite", {
        boxShadow: "0 0 45px rgba(99,102,241,0.65)",
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-transparent px-4 sm:px-8 xl:px-12 py-12 sm:py-20 lg:py-28 text-white"
      aria-label="The VC Skill Card"
    >
      {/* Background glow matching top-left radiance */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(29,78,216,0.32),transparent_55%)] -z-10"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-372">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 text-center sm:gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:text-left">
          <h2 ref={headingRef} className="text-3xl sm:text-4xl lg:text-[2.75rem] font-medium leading-[1.15] tracking-tight">
            <span className="sc-heading block text-white">
              Not a certificate
            </span>
            <span className="sc-heading block text-white mt-1">
              of attendance.
            </span>
            <span className="sc-heading block font-semibold text-[#1d72fe] mt-1">
              A certificate of ability.
            </span>
          </h2>

          <div className="sc-intro max-w-md lg:max-w-sm lg:pt-1">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-[#1d72fe]">
              THE VC SKILL CARD
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Scored 0–100 on the five skills that decide whether a deal
              happens. Pass with 60+ in four of the five. Not there yet? A resit
              within 30 days is included.
            </p>
          </div>
        </div>

        {/* Outer Card container */}
        <div className="mt-10 rounded-2xl sm:rounded-3xl border border-[#1e40af]/50 bg-[#03081c]/75 backdrop-blur-md p-6 sm:p-8 lg:p-10 xl:p-12 shadow-[0_0_50px_rgba(30,64,175,0.15)]">
          {/* Bands Row */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {BANDS.map((band) => (
              <div
                key={band.title}
                className={`sc-band relative flex flex-col items-center justify-center rounded-xl sm:rounded-2xl px-4 py-4 sm:py-5 text-center transition-all duration-300 hover:brightness-110 ${band.containerClass} ${
                  band.isElite ? "sc-elite" : ""
                }`}
              >
                {/* Band Label & Optional Cert Icon */}
                <div className="relative flex items-center justify-center w-full">
                  <span className={`text-[11px] sm:text-xs font-medium ${band.labelClass}`}>
                    {band.label}
                  </span>
                  {band.hasCertIcon && (
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute right-0 h-3.5 w-3.5 text-blue-300/90 fill-none stroke-current"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  )}
                </div>

                <span className="mt-1 text-base sm:text-lg font-semibold text-white tracking-tight">
                  {band.title}
                </span>

                {/* VC Elite top-right diamond badge */}
                {band.isElite && (
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-fuchsia-400/80 bg-[#1e0f38] shadow-[0_0_12px_rgba(217,70,239,0.7)]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-fuchsia-400/20 stroke-fuchsia-300"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
                      <path d="M2 9h20M12 21L7 9m5 12l5-12" />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Skill rings */}
          <div className="mt-10 sm:mt-14 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 justify-items-center items-start">
            {SKILLS.map((skill, i) => (
              <div
                key={skill.id}
                className={`sc-skill flex flex-col items-center ${
                  i === SKILLS.length - 1 ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                {/* Circle Container */}
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
                  <svg
                    viewBox="0 0 110 110"
                    className="h-full w-full -rotate-90"
                    aria-hidden="true"
                  >
                    {/* Dark bold navy background track matching screenshot */}
                    <circle
                      cx="55"
                      cy="55"
                      r={RADIUS}
                      fill="none"
                      strokeWidth="10"
                      className="stroke-[#0c224d]"
                    />
                    {/* Animated arc with smooth glow */}
                    <circle
                      cx="55"
                      cy="55"
                      r={RADIUS}
                      fill="none"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={0}
                      className="sc-arc stroke-[#1d4ed8]"
                    />
                  </svg>

                  {/* Orbiting fuchsia glowing marker dot at 12 o'clock */}
                  <div className="sc-dot pointer-events-none absolute inset-0">
                    <span className="absolute left-1/2 top-[4%] h-2.5 w-4 sm:h-3 sm:w-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d946ef] shadow-[0_0_12px_#d946ef,0_0_20px_rgba(217,70,239,0.7)]" />
                  </div>

                  {/* Center label */}
                  <span className="absolute inset-0 flex items-center justify-center text-sm sm:text-base font-semibold text-white tracking-wide">
                    0-100
                  </span>
                </div>

                {/* Skill Title with clean line wrapping */}
                <span className="mt-4 max-w-[8rem] text-center text-xs sm:text-sm font-normal text-white/90 leading-tight whitespace-pre-line">
                  {skill.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Example card: what a candidate actually receives ── */}
        <p className="mt-12 sm:mt-16 text-center text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/50 lg:text-left">
          Example
        </p>
        <div className="mt-3 rounded-2xl sm:rounded-3xl border border-[#1e40af]/50 bg-[#03081c]/75 backdrop-blur-md p-6 sm:p-8 lg:p-10 xl:p-12 shadow-[0_0_50px_rgba(30,64,175,0.15)]">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                VC Skill Card
              </h3>
              <p className="mt-1.5 text-sm sm:text-base text-slate-300">{EXAMPLE.name}</p>
            </div>
            <div
              className={`sc-band flex min-w-44 flex-col items-center justify-center rounded-xl sm:rounded-2xl px-6 py-4 sm:py-5 text-center ${EXAMPLE.band.containerClass}`}
            >
              <span className={`text-[11px] sm:text-xs font-medium ${EXAMPLE.band.labelClass}`}>
                {EXAMPLE.band.label}
              </span>
              <span className="mt-1 text-base sm:text-lg font-semibold text-white tracking-tight">
                {EXAMPLE.band.title}
              </span>
            </div>
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 justify-items-center items-start">
            {SKILLS.map((skill, i) => {
              const score = EXAMPLE.scores[i];
              return (
                <div
                  key={`ex-${skill.id}`}
                  className={`sc-skill flex flex-col items-center ${
                    i === SKILLS.length - 1 ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <div className="relative h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
                    <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90" aria-hidden="true">
                      <circle cx="55" cy="55" r={RADIUS} fill="none" strokeWidth="10" className="stroke-[#0c224d]" />
                      <circle
                        cx="55"
                        cy="55"
                        r={RADIUS}
                        fill="none"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
                        data-offset={CIRCUMFERENCE * (1 - score / 100)}
                        className="sc-ex-arc stroke-[#1d4ed8]"
                      />
                    </svg>
                    <div
                      className="sc-ex-dot pointer-events-none absolute inset-0"
                      data-rot={score * 3.6}
                      style={{ transform: `rotate(${score * 3.6}deg)` }}
                    >
                      <span className="absolute left-1/2 top-[4%] h-2.5 w-4 sm:h-3 sm:w-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d946ef] shadow-[0_0_12px_#d946ef,0_0_20px_rgba(217,70,239,0.7)]" />
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                      {score}
                    </span>
                  </div>
                  <span className="mt-4 max-w-[8rem] text-center text-xs sm:text-sm font-normal text-white/90 leading-tight whitespace-pre-line">
                    {skill.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
