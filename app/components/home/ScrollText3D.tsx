"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * 3D Starfield/Tunnel Text Animation
 * Texts emerge from a central vanishing point and fly rapidly past the camera,
 * mimicking a forward movement through space.
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
        <div className="whitespace-nowrap text-[clamp(3rem,10vw,6rem)] font-serif leading-none tracking-tight text-[#0a0b0d]">
          15,000+
        </div>
        <div className="mt-1 whitespace-nowrap text-[clamp(1rem,2.5vw,2rem)] font-serif tracking-wide text-[#111]">
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
        <div className="text-[clamp(1.5rem,5vw,3rem)] font-serif leading-none tracking-tight text-[#0a0b0d]">
          CPD
        </div>
        <div className="mt-0.5 text-[clamp(0.8rem,1.8vw,1.2rem)] font-serif tracking-wide text-[#555]">
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
        <div className="text-[clamp(3.5rem,12vw,7rem)] font-serif leading-none tracking-tight text-[#0a0b0d]">
          8+
        </div>
        <div className="mt-1 text-[clamp(1.5rem,3.5vw,2.5rem)] font-serif tracking-wide text-[#111]">
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
        <div className="text-[clamp(2.5rem,7vw,4.5rem)] font-serif leading-none tracking-tight text-[#0a0b0d]">
          100%
        </div>
        <div className="mt-1 whitespace-nowrap text-[clamp(1rem,2.5vw,1.5rem)] font-serif tracking-wide text-[#111]">
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
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(3rem,8vw,5.5rem)] font-serif leading-none tracking-tight text-[#2557d6]">
          3x
        </div>
        <div className="mt-1 text-[clamp(1rem,2vw,1.5rem)] font-serif tracking-wide text-[#4d82f5]">
          Faster Onboarding
        </div>
      </div>
    ),
    x: "0vw",
    y: "0vh",
  },
];

export default function ScrollText3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

      // Several stats fly in from a leftward vw offset (e.g. "-40vw"). At
      // lg+ widths (>=1024px) the fixed SideNav sits at the left edge, so
      // clamp how far left any stat is allowed to land — below 1024px the
      // nav isn't rendered at all, so no clamp is needed there.
      const NAV_SAFE_LEFT_PX = 200;
      const getSafeX = (vwValue: string) => {
        let px = (parseFloat(vwValue) / 100) * window.innerWidth;
        if (window.innerWidth < 768) {
          px = px * 0.45;
        } else if (window.innerWidth >= 1024 && px < 0) {
          const minPx = NAV_SAFE_LEFT_PX - window.innerWidth / 2;
          return Math.max(px, minPx);
        }
        return px;
      };

      const getSafeY = (vhValue: string) => {
        const vh = parseFloat(vhValue);
        if (window.innerHeight < 700) {
          return `${vh * 0.65}vh`;
        }
        return vhValue;
      };

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

      textRefs.current.forEach((text, i) => {
        if (!text) return;

        // Position strictly in the center and push deep into Z space
        gsap.set(text, {
          xPercent: -50,
          yPercent: -50,
          x: getSafeX(STATS[i].x),
          y: getSafeY(STATS[i].y),
          z: -6000,
          opacity: 0,
        });

        const itemTl = gsap.timeline();

        const isLast = i === STATS.length - 1;

        // 1. Fly forward linearly in 3D space
        itemTl.to(
          text,
          {
            z: 800, // Make the last item stop much closer to the camera so it is bigger
            duration: 1,
            ease: "none", // Constant Z velocity gives natural 3D acceleration
          },
          0,
        );

        // 2. Fade in as it approaches
        itemTl.to(
          text,
          {
            opacity: 1,
            duration: 0.3,
            ease: "power1.inOut",
          },
          0,
        );

        // 3. Fade out before it hits the camera (except the last item, so it stays on screen!)
        if (!isLast) {
          itemTl.to(
            text,
            {
              opacity: 0,
              duration: 0.2,
              ease: "power1.inOut",
            },
            0.8,
          );
        }

        // Add to main timeline staggered so they form a continuous tunnel
        tl.add(itemTl, i * 0.12);
      });
    },
    { scope: sectionRef },
  );

  return (
    <div ref={sectionRef} className="w-full bg-white">
      <section
        className="relative h-screen w-full overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        <div
          className="pointer-events-none absolute opacity-60 inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.13) 0.65px, transparent 0.65px)",
            backgroundSize: "9px 9px",
          }}
        />

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
              className="absolute left-1/2 top-1/2 opacity-0 motion-reduce:relative motion-reduce:left-auto motion-reduce:top-auto motion-reduce:opacity-100 motion-reduce:transform-none"
            >
              {stat.content}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
