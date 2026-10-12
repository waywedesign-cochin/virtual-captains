"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BookACallModal from "@/components/home/BookACallModal";
import ZoomHeading from "@/components/common/ZoomHeading";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function OrgCTA() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = () => setBookingOpen(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Left text reveal
      gsap.from(".cta-text", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Right visuals reveal and subtle parallax
      gsap.fromTo(
        ".cta-circle",
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        ".cta-gradient-blue",
        { y: -30, scale: 0.92 },
        {
          y: 35,
          scale: 1.05,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );

      gsap.fromTo(
        ".cta-gradient-green",
        { y: 30, scale: 0.92 },
        {
          y: -35,
          scale: 1.05,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="w-full bg-white py-12 sm:py-16 lg:py-24 overflow-hidden relative"
    >
      {/* Same fade at the top edge, so the clipped blue orb blends up into
          the programmes showcase instead of starting on a hard line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-28 sm:h-36 bg-linear-to-t from-transparent to-white"
      />
      {/* Fade the glow orbs out to pure white at the bottom edge, so the
          section meets the footer's white → blue gradient without a seam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-28 sm:h-36 bg-linear-to-b from-transparent to-white"
      />

      <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
        {/* Left Content */}
        <div className="z-10 relative flex flex-col items-center text-center md:items-start md:text-left">
          <p className="cta-text text-sm sm:text-base font-normal text-slate-700 mb-2 sm:mb-3.5">
            For Organisations
          </p>
          <ZoomHeading className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-medium text-slate-900 leading-[1.16] tracking-tight mb-6 sm:mb-8 md:mb-10 max-w-lg">
            Talk to Us About<br />Your Next Quarter.
          </ZoomHeading>
          <div className="cta-text">
            <button
              type="button"
              onClick={openBooking}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border border-slate-800 text-slate-900 text-sm sm:text-base font-normal hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Book a Discovery Call
            </button>
          </div>
        </div>

        {/* Right Visuals - 2 Glow Gradients (Top-Right Blue & Bottom-Left Mint Green) + Frosted Glass Circle */}
        <div className="relative w-full min-h-80 sm:min-h-100 md:min-h-115 [@media(max-height:500px)]:min-h-72 flex items-center justify-center">
          {/* 1. TOP-RIGHT Glowing Blue Gradient Orb */}
          <div
            className="cta-gradient-blue absolute -top-8 -right-4 sm:-top-12 sm:right-2 md:-top-16 md:right-6 w-65 h-65 sm:w-85 sm:h-85 md:w-105 md:h-105 rounded-full pointer-events-none transition-transform"
            style={{
              background: "radial-gradient(circle, #3d74f6 0%, #4f83f7 50%, rgba(61, 116, 246, 0.4) 75%, transparent 100%)",
              filter: "blur(60px)",
              opacity: 0.9,
            }}
          />

          {/* 2. BOTTOM-LEFT Glowing Mint-Green Gradient Orb */}
          <div
            className="cta-gradient-green absolute -bottom-8 -left-6 sm:-bottom-12 sm:-left-4 md:-bottom-14 md:left-2 w-55 h-55 sm:w-75 sm:h-75 md:w-92.5 md:h-92.5 rounded-full pointer-events-none transition-transform"
            style={{
              background: "radial-gradient(circle, #52d69f 0%, #6ee7b7 55%, rgba(82, 214, 159, 0.4) 75%, transparent 100%)",
              filter: "blur(55px)",
              opacity: 0.88,
            }}
          />

          {/* Central Frosted Glass Circle Button */}
          <Link
            href="/programs"
            aria-label="Enroll Now"
            className="cta-circle group relative z-20 w-60 h-60 sm:w-72.5 sm:h-72.5 md:w-83.75 md:h-83.75 lg:w-91.25 lg:h-91.25 rounded-full bg-white/25 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.85)] flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-103 hover:bg-white/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.14),inset_0_1.5px_3px_rgba(255,255,255,0.95)]"
          >
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-normal text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.16)] group-hover:scale-105 transition-transform duration-300 select-none">
              Enroll Now
            </span>
          </Link>
        </div>
      </div>
      <BookACallModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        defaultAudience="organisation"
      />
    </section>
  );
}
