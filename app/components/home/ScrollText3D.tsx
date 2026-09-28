"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DottedBackground from "./DottedBackground";

gsap.registerPlugin(ScrollTrigger);

/**
 * 3D Starfield/Tunnel Text Animation
 * Clean card slide-over presentation without any gradient overlays.
 */

const STATS = [
  {
    id: "iso",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(2.5rem,8vw,5rem)] font-serif leading-none tracking-tight text-[#2557d6]">
          ISO
        </div>
        <div className="mt-1 text-[clamp(1rem,2.5vw,2rem)] font-serif tracking-wide text-[#4d82f5]">
          Certified
        </div>
      </div>
    ),
    x: "-25vw",
    y: "-20vh",
  },
  {
    id: "15k",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="whitespace-nowrap text-[clamp(3rem,10vw,6rem)] font-serif leading-none tracking-tight text-white">
          15,000+
        </div>
        <div className="mt-1 whitespace-nowrap text-[clamp(1rem,2.5vw,2rem)] font-serif tracking-wide text-white/90">
          Professionals Trained
        </div>
      </div>
    ),
    x: "25vw",
    y: "15vh",
  },
  {
    id: "cpd",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(1.5rem,5vw,3rem)] font-serif leading-none tracking-tight text-white">
          CPD
        </div>
        <div className="mt-0.5 text-[clamp(0.8rem,1.8vw,1.2rem)] font-serif tracking-wide text-white/60">
          Accredited
        </div>
      </div>
    ),
    x: "-30vw",
    y: "25vh",
  },
  {
    id: "500",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(2.5rem,6vw,4.5rem)] font-serif leading-none tracking-tight text-[#2557d6]">
          500+
        </div>
        <div className="mt-1 whitespace-nowrap text-[clamp(1rem,2vw,1.5rem)] font-serif tracking-wide text-[#4d82f5]">
          Sales Teams Coached
        </div>
      </div>
    ),
    x: "30vw",
    y: "-25vh",
  },
  {
    id: "8",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(3.5rem,12vw,7rem)] font-serif leading-none tracking-tight text-white">
          8+
        </div>
        <div className="mt-1 text-[clamp(1.5rem,3.5vw,2.5rem)] font-serif tracking-wide text-white/90">
          Countries
        </div>
      </div>
    ),
    x: "-40vw",
    y: "5vh",
  },
  {
    id: "ai",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(2rem,6vw,4rem)] font-serif leading-none tracking-tight text-[#2557d6]">
          AI-Powered
        </div>
        <div className="mt-1 text-[clamp(1rem,2vw,1.5rem)] font-serif tracking-wide text-[#4d82f5]">
          Real-time Feedback
        </div>
      </div>
    ),
    x: "35vw",
    y: "5vh",
  },
  {
    id: "custom",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(2.5rem,7vw,4.5rem)] font-serif leading-none tracking-tight text-white">
          100%
        </div>
        <div className="mt-1 whitespace-nowrap text-[clamp(1rem,2.5vw,1.5rem)] font-serif tracking-wide text-white/90">
          Custom Playbooks
        </div>
      </div>
    ),
    x: "-10vw",
    y: "-30vh",
  },
  {
    id: "roi",
    content: (
      <div className="flex flex-col items-center text-center px-4 max-w-[88vw]">
        <div className="text-[clamp(2.5rem,7vw,5.5rem)] font-serif leading-none tracking-tight text-[#2557d6]">
          3x
        </div>
        <div className="mt-1 text-[clamp(0.95rem,2.2vw,1.45rem)] font-serif tracking-wide text-[#4d82f5] whitespace-nowrap">
          Faster Onboarding
        </div>
      </div>
    ),
    x: "0vw",
    y: "0vh",
  },
];

const MOBILE_COORDS = [
  { x: 0, y: -20 }, // 0: ISO Certified (top)
  { x: 0, y: 15 }, // 1: 15,000+ Professionals (lower)
  { x: 0, y: -18 }, // 2: CPD Accredited (top)
  { x: 0, y: 16 }, // 3: 500+ Sales Teams (lower)
  { x: -14, y: -10 }, // 4: 8+ Countries (upper-left)
  { x: 14, y: 14 }, // 5: AI-Powered (lower-right, separated from 8+)
  { x: 0, y: -18 }, // 6: 100% Custom Playbooks (top)
  { x: 0, y: 0 }, // 7: 3x Faster Onboarding (dead center)
];

export default function ScrollText3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const container = containerRef.current;
      if (!section || !container) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) return;

      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;

      // Several stats fly in from a leftward vw offset (e.g. "-40vw"). At
      // lg+ widths (>=1024px) the fixed SideNav sits at the left edge, so
      // clamp how far left any stat is allowed to land — below 1024px the
      // nav isn't rendered at all, so no clamp is needed there.
      const NAV_SAFE_LEFT_PX = 200;
      const getSafeX = (index: number, vwValue: string) => {
        if (isMobile && MOBILE_COORDS[index]) {
          return (MOBILE_COORDS[index].x / 100) * window.innerWidth;
        }
        let px = (parseFloat(vwValue) / 100) * window.innerWidth;
        if (window.innerWidth >= 1024 && px < 0) {
          const minPx = NAV_SAFE_LEFT_PX - window.innerWidth / 2;
          return Math.max(px, minPx);
        }
        return px;
      };

      const getSafeY = (index: number, vhValue: string) => {
        if (isMobile && MOBILE_COORDS[index]) {
          return `${MOBILE_COORDS[index].y}vh`;
        }
        const vh = parseFloat(vhValue);
        if (window.innerHeight < 700) {
          return `${vh * 0.65}vh`;
        }
        return vhValue;
      };

      // Zoom-in entrance animation for intro heading
      if (introRef.current) {
        gsap.set(introRef.current, {
          opacity: 0,
          scale: 0.65,
          y: 20,
          transformOrigin: "center center",
        });

        gsap.to(introRef.current, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          opacity: 1,
          y: 0,
          duration: 0.85,
          keyframes: [
            { scale: 1.15, opacity: 1, y: -4, duration: 0.42, ease: "power2.out" },
            { scale: 0.94, y: 2, duration: 0.22, ease: "sine.inOut" },
            { scale: 1.0, y: 0, duration: 0.21, ease: "power2.out" },
          ],
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%", // Fast scrolling duration for all devices
          pin: true,
          anticipatePin: 1, // Fixes glitching when entering/exiting the pin
          scrub: 0.5, // Snappier scrub
        },
      });

      // Fade out intro title as scroll begins
      if (introRef.current) {
        tl.to(
          introRef.current,
          {
            opacity: 0,
            scale: 0.85,
            y: -40,
            duration: 0.15,
            ease: "power2.in",
          },
          0,
        );
      }

      textRefs.current.forEach((text, i) => {
        if (!text) return;

        const isLast = i === STATS.length - 1;
        const initialZ = isMobile ? -3600 : -6000;

        // Position strictly in the center and push deep into Z space
        gsap.set(text, {
          xPercent: -50,
          yPercent: -50,
          x: getSafeX(i, STATS[i].x),
          y: getSafeY(i, STATS[i].y),
          z: initialZ,
          opacity: 0,
        });

        const itemTl = gsap.timeline();

        // Calibrate final Z distance: on mobile, stop at gentle z=120 so it never gets cut off
        const targetZ = isLast
          ? isMobile
            ? 120
            : isTablet
              ? 350
              : 650
          : isMobile
            ? 450
            : 800;

        // 1. Fly forward linearly in 3D space
        itemTl.to(
          text,
          {
            z: targetZ,
            duration: 1,
            ease: "none", // Constant Z velocity gives natural 3D acceleration
          },
          0,
        );

        // 2. Fade in only as it approaches the readable zone (avoids background clustering)
        itemTl.fromTo(
          text,
          { opacity: 0 },
          {
            opacity: 1,
            duration: isMobile ? 0.24 : 0.3,
            ease: "power1.inOut",
          },
          isMobile ? 0.32 : 0.12,
        );

        // 3. Fade out before it hits the camera (except the last item, so it stays on screen!)
        if (!isLast) {
          itemTl.to(
            text,
            {
              opacity: 0,
              duration: isMobile ? 0.2 : 0.2,
              ease: "power1.inOut",
            },
            isMobile ? 0.68 : 0.8,
          );
        }

        // Add to main timeline staggered so they form a continuous tunnel without overlapping
        tl.add(itemTl, i * (isMobile ? 0.15 : 0.12));
      });
    },
    { scope: sectionRef },
  );

  return (
    <div
      ref={sectionRef}
      className="relative z-10 w-full bg-[#040507]"
    >
      <section
        className="relative h-screen w-full overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        <DottedBackground theme="dark" />

        {/* Intro title — visible before scroll animation begins */}
        <div
          ref={introRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
        >
          <p className="text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase text-[#4d82f5]/75 mb-3">
            By the Numbers
          </p>
          <h2 className="font-serif text-[clamp(2rem,5vw,4rem)] font-bold text-white tracking-tight leading-tight text-center">
            Impact That Speaks
          </h2>
          <div className="mt-4 h-0.75 w-12 rounded-full bg-[#2557d6]/50" />
        </div>

        <div
          ref={containerRef}
          className="relative z-10 mx-auto h-full w-full max-w-[1920px] motion-reduce:flex motion-reduce:flex-col motion-reduce:items-center motion-reduce:justify-center motion-reduce:gap-12 motion-reduce:py-20"
          style={{ transformStyle: "preserve-3d" }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.id}
              ref={(el) => {
                textRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 opacity-0 motion-reduce:relative motion-reduce:left-auto motion-reduce:top-auto motion-reduce:opacity-100 motion-reduce:transform-none pointer-events-none w-max max-w-[92vw]"
            >
              {stat.content}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
