"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Partner {
  id: string;
  name: string;
  logoSrc: string;
  width: number;
  height: number;
}

const PARTNERS: Partner[] = [
  {
    id: "jsr",
    name: "JSR",
    logoSrc: "/partners/JSR.png",
    width: 140,
    height: 40,
  },
  {
    id: "skylark",
    name: "Skylark",
    logoSrc: "/partners/SKYLARK.png",
    width: 140,
    height: 40,
  },
  {
    id: "ahad",
    name: "AHAD",
    logoSrc: "/partners/AHAD.png",
    width: 130,
    height: 38,
  },
  {
    id: "moonhive",
    name: "MoonHive",
    logoSrc: "/partners/MOONHIV.png",
    width: 140,
    height: 40,
  },
  {
    id: "unifirm",
    name: "Unifirm",
    logoSrc: "/partners/UNIFIRM.png",
    width: 135,
    height: 38,
  },
];

export default function AboutPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      gsap.set(headingRef.current, {
        opacity: 0,
        scale: 0.68,
        y: 20,
        transformOrigin: "center center",
      });
      gsap.set(textRef.current, { opacity: 0, y: 30 });
      gsap.set(validCards, { opacity: 0, scale: 0.88, y: 25 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 72%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => {
              // Engage subtle continuous floating physics in zero gravity
              validCards.forEach((card, idx) => {
                gsap.to(card, {
                  y: idx % 2 === 0 ? -6 : 6,
                  duration: 2.6 + (idx % 3) * 0.4,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                  delay: idx * 0.15,
                });
              });
            },
          });

          tl.to(
            headingRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              keyframes: [
                { scale: 1.15, opacity: 1, y: -4, duration: 0.42, ease: "power2.out" },
                { scale: 0.94, y: 2, duration: 0.22, ease: "sine.inOut" },
                { scale: 1.0, y: 0, duration: 0.21, ease: "power2.out" },
              ],
            },
            0
          )
            .to(textRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.18)
            .to(
              validCards,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.1,
                ease: "back.out(1.35)",
              },
              0.25
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
      aria-label="Partner Network"
      className="relative w-full overflow-hidden py-14 sm:py-20 md:py-24 lg:py-20 xl:py-28 select-none flex flex-col items-center justify-center"
    >
      {/* ── Central Blue Radial Ambient Lighting ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] sm:w-[1050px] lg:w-[1350px] h-[500px] sm:h-[700px] bg-radial from-[#13378e]/35 via-[#081c54]/18 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Standard Navbar max-width Container (max-w-372) */}
      <div className="w-full max-w-372 mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 relative z-10">
        
        {/* ── 1. Top Centered Heading ── */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-14 xl:mb-16">
          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-normal tracking-tight text-white font-sans will-change-transform"
          >
            Partner Network
          </h2>
        </div>

        {/* ── 2. Two-Column Body: Description (Left) & Staggered Cards (Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-14 items-center">
          
          {/* Left Column: Mission Description */}
          <div
            ref={textRef}
            className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left pr-0 lg:pr-4 xl:pr-6 will-change-transform max-w-xl mx-auto lg:mx-0 w-full"
          >
            {/* Paragraph 1 with Italic Lime "Demo text" */}
            <p className="text-xs sm:text-sm lg:text-[13.5px] xl:text-base text-slate-200 font-sans leading-relaxed text-center lg:text-left">
              <span className="text-[#e5ff00] italic font-medium mr-1.5 select-none drop-shadow-[0_0_10px_rgba(229,255,0,0.35)]">
                Demo text
              </span>
              At Virtual Captains, we believe great sales are built on more than
              scripts and techniques. They are built on clarity, strategy,
              confidence, and the right human approach.
            </p>

            {/* Paragraph 2 */}
            <p className="mt-4 sm:mt-6 lg:mt-4 xl:mt-7 text-xs sm:text-sm lg:text-[13.5px] xl:text-base text-slate-300/90 font-sans leading-relaxed text-center lg:text-left">
              We are a team of Sales Strategists and Trainers dedicated to
              helping businesses build stronger sales teams and create
              meaningful, measurable growth. Through industry-driven insights,
              practical strategies, and virtual training validated by real
              human expertise, we transform complex sales challenges into clear,
              actionable opportunities.
            </p>
          </div>

          {/* Right Column: 5 Partner Logo Cards in Staggered Constellation Layout */}
          <div className="lg:col-span-7 relative flex items-center justify-center w-full">
            
            {/* Desktop / Tablet Staggered Constellation Layout */}
            <div className="hidden sm:flex flex-col gap-3.5 sm:gap-4 md:gap-5 w-full max-w-xl mx-auto items-center">
              
              {/* Row 1: 2 Cards (JSR, Skylark) */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 lg:gap-10 xl:gap-14 w-full">
                {PARTNERS.slice(0, 2).map((p, idx) => (
                  <div
                    key={p.id}
                    ref={(el) => {
                      cardsRef.current[idx] = el;
                    }}
                    className="relative w-36 sm:w-44 md:w-50 lg:w-46 xl:w-52 h-14 sm:h-16 md:h-18 px-4 sm:px-5 rounded-2xl md:rounded-3xl bg-linear-to-b from-white/12 via-white/6 to-white/2 border border-white/20 hover:border-sky-400/90 shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(56,189,248,0.45),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-106 hover:-translate-y-1 cursor-pointer group will-change-transform overflow-hidden"
                  >
                    {/* Ambient subtle backlight behind logo */}
                    <div className="absolute inset-0 bg-radial from-sky-400/15 via-transparent to-transparent opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none" />

                    <Image
                      src={p.logoSrc}
                      alt={p.name}
                      width={p.width}
                      height={p.height}
                      className="max-h-6 sm:max-h-7.5 md:max-h-8 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                    />
                  </div>
                ))}
              </div>

              {/* Row 2: 3 Cards (AHAD, MoonHive, Unifirm) */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 md:gap-4 lg:gap-3.5 xl:gap-4.5 w-full">
                {PARTNERS.slice(2, 5).map((p, idx) => (
                  <div
                    key={p.id}
                    ref={(el) => {
                      cardsRef.current[idx + 2] = el;
                    }}
                    className="relative w-28 sm:w-34 md:w-42 lg:w-38 xl:w-46 h-13 sm:h-15 md:h-17 px-3 sm:px-4 rounded-2xl md:rounded-3xl bg-linear-to-b from-white/12 via-white/6 to-white/2 border border-white/20 hover:border-sky-400/90 shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(56,189,248,0.45),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-106 hover:-translate-y-1 cursor-pointer group will-change-transform overflow-hidden"
                  >
                    {/* Ambient subtle backlight behind logo */}
                    <div className="absolute inset-0 bg-radial from-sky-400/15 via-transparent to-transparent opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none" />

                    <Image
                      src={p.logoSrc}
                      alt={p.name}
                      width={p.width}
                      height={p.height}
                      className="max-h-5 sm:max-h-6.5 md:max-h-7.5 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                    />
                  </div>
                ))}
              </div>

            </div>

            {/* Mobile Layout (<640px): Clean 2-column responsive grid with last card centered */}
            <div className="sm:hidden grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
              {PARTNERS.map((p, idx) => (
                <div
                  key={`m-${p.id}`}
                  className={`relative h-15 px-4 rounded-2xl bg-linear-to-b from-white/12 via-white/6 to-white/2 border border-white/20 flex items-center justify-center shadow-lg overflow-hidden ${
                    idx === PARTNERS.length - 1 ? "col-span-2 max-w-[180px] mx-auto w-full" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-radial from-sky-400/10 via-transparent to-transparent pointer-events-none" />
                  <Image
                    src={p.logoSrc}
                    alt={p.name}
                    width={p.width}
                    height={p.height}
                    className="max-h-6 w-auto object-contain brightness-0 invert opacity-90"
                  />
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
