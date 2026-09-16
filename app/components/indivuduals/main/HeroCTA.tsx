"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";

interface HeroCTAProps {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

export function HeroCTA({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: HeroCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnterPrimary = () => {
    gsap.to(".cta-path-primary", { filter: "brightness(1.15)", duration: 0.3 });
  };
  const handleMouseLeavePrimary = () => {
    gsap.to(".cta-path-primary", { filter: "brightness(1)", duration: 0.3 });
  };

  const handleMouseEnterSecondary = () => {
    gsap.to(".cta-path-secondary", {
      filter: "brightness(1.15)",
      duration: 0.3,
    });
  };
  const handleMouseLeaveSecondary = () => {
    gsap.to(".cta-path-secondary", { filter: "brightness(1)", duration: 0.3 });
  };

  return (
    <div
      ref={containerRef}
      className="hero__cta-composition relative w-full max-w-[1440px] mx-auto"
      style={{ height: "clamp(56px, 5.29vw, 80px)" }}
    >
      {/* SVG Background Layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1284 89"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="applyGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6B21D9" />
            <stop offset="50%" stopColor="#7135DF" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>

          <linearGradient id="partnerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3B62EB" />
            <stop offset="100%" stopColor="#4D8CF5" />
          </linearGradient>
        </defs>

        {/* Left Shape (Apply) */}
        <path
          className="cta-path-primary transition-all"
          d="M 131.6 0.5 
             H 638.2 
             V 88 
             H 277.9 
             C 256.5 88, 236.1 79.3, 221.2 64.0 
             L 178.9 20.5 
             C 166.5 7.7, 149.4 0.5, 131.6 0.5 
             Z"
          fill="url(#applyGrad)"
        />

        {/* Right Shape (Partner) */}
        <path
          className="cta-path-secondary transition-all"
          d="M 638.2 0.5 
             H 1084.8 
             C 1067.3 0.5, 1050.5 7.4, 1038.1 19.8 
             L 989.3 68.6 
             C 976.9 81.0, 960.1 88, 942.6 88 
             H 638.2 
             V 0.5 
             Z"
          fill="url(#partnerGrad)"
        />
      </svg>

      {/* HTML Overlay Links Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Link Wrapper */}
        <div
          className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-auto z-10"
          style={{
            left: "32.8%", // Visual centroid of the left shape
            transform: "translateX(-50%)",
            width: "30%", // Safely confines text within the shape
          }}
        >
          <Link
            href={primaryHref}
            className="w-full text-center font-bold text-white tracking-[-0.005em] outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
            style={{ fontSize: "var(--fs-cta-label)" }}
            onMouseEnter={handleMouseEnterPrimary}
            onMouseLeave={handleMouseLeavePrimary}
            onFocus={handleMouseEnterPrimary}
            onBlur={handleMouseLeavePrimary}
          >
            {primaryLabel}
          </Link>
        </div>

        {/* Right Link Wrapper */}
        <div
          className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-auto z-10"
          style={{
            left: "64.3%", // Visual centroid of the right shape
            transform: "translateX(-50%)",
            width: "30%", // Safely confines text within the shape
          }}
        >
          <Link
            href={secondaryHref}
            className="w-full text-center font-bold text-white tracking-[-0.005em] outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
            style={{ fontSize: "var(--fs-cta-label)" }}
            onMouseEnter={handleMouseEnterSecondary}
            onMouseLeave={handleMouseLeaveSecondary}
            onFocus={handleMouseEnterSecondary}
            onBlur={handleMouseLeaveSecondary}
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
