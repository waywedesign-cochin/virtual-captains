"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function OrgHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animate the text and rings in
      gsap.from(".hero-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Rhythmic repeating concentric circle pulse animation (clearly evident and alive)
      const rings = gsap.utils.toArray<HTMLElement>(".hero-ring");

      gsap.from(rings, {
        scale: 0.6,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        onComplete: () => {
          // Continuous harmonic wave that travels through the concentric circles
          rings.forEach((ring, i) => {
            gsap.to(ring, {
              scale: 1.15 + i * 0.02,
              opacity: 0.35 + (5 - (i % 5)) * 0.12,
              duration: 2.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.28,
            });
          });
        },
      });

      // Bubbles initial animation and floating
      const bubbles = gsap.utils.toArray(".hero-bubble");

      gsap.from(bubbles, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.5)",
        delay: 0.5,
        onComplete: () => {
          // Continuous floating animation
          bubbles.forEach((bubble: any, i) => {
            gsap.to(bubble, {
              y: "random(-15, 15)",
              x: "random(-15, 15)",
              rotation: "random(-3, 3)",
              duration: "random(3, 5)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.2,
            });
          });
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[75vh] bg-white flex items-center justify-center overflow-hidden py-24 lg:py-32"
    >
      {/* Background Rings - Thick sculptural concentric circles matching earlier design */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[1, 2, 3, 4].map((ring) => (
          <div
            key={ring}
            className="hero-ring absolute rounded-full border-4 sm:border-[8px] md:border-[14px] lg:border-[16px] border-slate-200"
            style={{
              width: `calc(10vw + ${ring * 9}vw)`,
              height: `calc(10vw + ${ring * 9}vw)`,
              minWidth: `${140 + ring * 100}px`,
              minHeight: `${140 + ring * 100}px`,
              opacity: ring === 4 ? 0.25 : 0.85 - ring * 0.15,
            }}
          />
        ))}
      </div>

      {/* Top dark gradient for navbar visibility - much smoother blend */}
      <div className="absolute top-0 left-0 right-0 h-[55vh] bg-linear-to-b from-neutral-900/30 via-neutral-900/10 to-transparent pointer-events-none" />

      <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
        {/* Left Text */}
        <div className="lg:col-span-3 hero-text text-center lg:text-left order-2 lg:order-1 pt-8 lg:pt-0">
          <h3 className="text-[#2563eb] text-[11px] font-bold uppercase tracking-widest mb-1">
            FOUR PROGRAMMES,
          </h3>
          <h3 className="text-[#f97316] text-[11px] font-bold uppercase tracking-widest mb-3">
            ONE OPERATING PARTNER.
          </h3>
          <p className="text-black text-[13px] leading-relaxed max-w-60 mx-auto lg:mx-0 font-medium">
            From induction to audit to outbound, Virtual Captains sits inside
            your revenuemotion, not on the sidelines
          </p>
        </div>

        {/* Center Visual & Title */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-125 md:min-h-150 order-1 lg:order-2">
          {/* Main Title - No background card */}
          <div className="text-center z-10 hero-text">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-[#2563eb] mb-2 leading-[1.1] tracking-tight">
              From Induction
              <br />
              to Revenue
            </h1>
            <h2 className="text-lg md:text-2xl text-black font-medium mt-4">
              Total Sales Floor Management
            </h2>
          </div>

          {/* Floating Bubbles */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top Left - Groom Studio (Green) */}
            <div className="hero-bubble absolute top-[0%] left-[5%] sm:top-[2%] sm:left-[25%] md:left-[30%] bg-[#aee7aa] text-[#0f3d0f] px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-[15px] shadow-[0_8px_20px_rgba(174,231,170,0.4)] leading-tight text-center">
              Groom
              <br />
              Studio
            </div>

            {/* Top Right - Sales Audit (Cyan) */}
            <div className="hero-bubble absolute top-[12%] right-[2%] sm:top-[18%] sm:right-[22%] md:right-[28%] bg-[#a6e6db] text-[#0f3d36] px-3 py-1 sm:px-5 sm:py-1.5 rounded-full font-medium text-[10px] sm:text-[13px] shadow-[0_6px_16px_rgba(166,230,219,0.4)]">
              Sales Audit
            </div>

            {/* Bottom Left - SalesX Training (Blue) */}
            <div className="hero-bubble absolute bottom-[5%] left-[2%] sm:bottom-[8%] sm:left-[12%] md:left-[22%] bg-[#3b82f6] text-white px-5 py-3 sm:px-7 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-xl shadow-[0_12px_24px_rgba(59,130,246,0.35)] leading-tight text-center">
              SalesX
              <br />
              Training
            </div>

            {/* Bottom Right - Outbound Lead Gen (Peach) */}
            <div className="hero-bubble absolute bottom-[10%] right-[5%] sm:bottom-[15%] sm:right-[25%] md:right-[32%] bg-[#dfaf9b] text-[#3d1e0f] px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-[14px] shadow-[0_8px_20px_rgba(223,175,155,0.4)] leading-tight text-center">
              Outbound
              <br />
              Lead Gen
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="lg:col-span-3 hero-text flex flex-row lg:flex-col gap-4 justify-center lg:justify-end items-center lg:items-end order-3 pt-4 lg:pt-0">
          <Link
            href="/demo"
            className="px-8 py-2.5 rounded-full border border-black bg-white text-black hover:bg-slate-50 transition-colors w-36 text-center text-[13.5px] font-medium shadow-sm"
          >
            Demo
          </Link>
          <Link
            href="/get-started"
            className="px-8 py-2.5 rounded-full bg-[#3b82f6] text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 w-36 text-center text-[13.5px] font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
