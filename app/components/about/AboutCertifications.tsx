"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CertificationBadge {
  id: string;
  title: string;
  track: string;
}

const CERTIFICATIONS: CertificationBadge[] = [
  { id: "cert-1", title: "Certification", track: "Sales Simulation" },
  { id: "cert-2", title: "Certification", track: "Objection Mastery" },
  { id: "cert-3", title: "Certification", track: "Enterprise Closing" },
  { id: "cert-4", title: "Certification", track: "Revenue Intelligence" },
];

export default function AboutCertifications() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const badgesContainerRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const validBadges = badgeRefs.current.filter(Boolean) as HTMLDivElement[];

      if (!prefersReducedMotion) {
        // Initial entrance state
        gsap.set(marqueeContainerRef.current, {
          opacity: 0,
          scale: 0.85,
          transformOrigin: "center center",
        });

        gsap.set(validBadges, {
          opacity: 0,
          scale: 0.35,
          rotation: -25,
          y: 40,
          transformOrigin: "center center",
        });

        // Master Entrance Timeline
        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            // Continuous subtle zero-gravity breathing / floating animation for each badge
            validBadges.forEach((badge, idx) => {
              gsap.to(badge, {
                y: idx % 2 === 0 ? -9 : 9,
                rotation: idx % 2 === 0 ? 2 : -2,
                duration: 2.8 + (idx % 2) * 0.6,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: idx * 0.15,
              });
            });
          },
        });

        // 1. Giant Horizontal Marquee zooms in smoothly behind the badges
        tl.to(marqueeContainerRef.current, {
          opacity: 0.4,
          scale: 1,
          duration: 1.1,
          ease: "power2.out",
        })
          // 2. 4 Certification Badges bloom in over the marquee with staggered spring reveal
          .to(
            validBadges,
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              y: 0,
              duration: 0.95,
              stagger: 0.12,
              ease: "back.out(1.6)",
            },
            "-=0.7"
          );

        // Trigger entrance when section reaches 75% of viewport
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
          onEnter: () => {
            tl.play();
          },
        });
      } else {
        // Reduced motion fallback: show elements directly
        gsap.set(marqueeContainerRef.current, { opacity: 0.4, scale: 1 });
        gsap.set(validBadges, { opacity: 1, scale: 1, y: 0, rotation: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label="Certifications"
      className="relative w-full overflow-hidden py-14 sm:py-20 md:py-24 lg:py-20 xl:py-28 select-none flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] xl:min-h-[540px]"
    >
      {/* Accessible semantic heading for screen readers */}
      <h2 className="sr-only">Certifications</h2>

      {/* ── Deep Royal Blue Ambient Radial Background Glow ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[950px] lg:w-[1300px] h-[400px] sm:h-[550px] bg-radial from-[#123996]/35 via-[#081d5a]/20 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* ── Giant Horizontal Continuous Marquee Scrolling Behind Badges ── */}
      <div
        ref={marqueeContainerRef}
        aria-hidden="true"
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full overflow-hidden whitespace-nowrap pointer-events-none select-none z-0 will-change-transform"
      >
        <div className="inline-flex items-center will-change-transform cert-marquee-track">
          {/* 8 items (two 4-item cycles) for an infinite, gapless, seamless loop */}
          {[...Array(8)].map((_, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="font-serif italic font-light tracking-tight text-[#2550b3] text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] xl:text-[12.5rem] leading-none whitespace-nowrap px-6 sm:px-10 lg:px-14 drop-shadow-[0_0_50px_rgba(23,61,161,0.45)]">
                Certifications
              </span>
              <span className="text-[#3b82f6]/40 text-xl sm:text-3xl lg:text-5xl select-none">
                •
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FOREGROUND CONTAINER: 4 Serrated Rosette Badges Floating In Front ── */}
      <div className="relative z-10 w-full max-w-372 mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 flex flex-col items-center justify-center">
        <div
          ref={badgesContainerRef}
          className="relative z-10 w-full flex items-center justify-center"
        >
          {/* Responsive Layout: 4 badges horizontal on desktop/tablet, 2x2 grid on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-16 items-center justify-items-center w-full max-w-5xl mx-auto">
            {CERTIFICATIONS.map((item, idx) => (
              <div
                key={item.id}
                ref={(el) => {
                  badgeRefs.current[idx] = el;
                }}
                className="group relative flex flex-col items-center justify-center cursor-pointer will-change-transform"
              >
                {/* 32-Point Serrated Rosette Seal Container */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-38 md:h-38 lg:w-44 lg:h-44 xl:w-52 xl:h-52 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                  {/* Subtle Vibrant Blue Glow on Hover */}
                  <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/35 blur-2xl transition-all duration-300 pointer-events-none" />

                  {/* 32-Point Blue Serrated Rosette Star Badge */}
                  <Image
                    src="/salesx/Star.png"
                    alt={item.title}
                    width={220}
                    height={220}
                    className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.65)] group-hover:drop-shadow-[0_0_35px_rgba(37,99,235,0.85)] transition-all duration-300 pointer-events-none"
                    priority={false}
                  />

                  {/* Center "Certification" White Typography */}
                  <div className="absolute inset-0 flex items-center justify-center p-3 text-center pointer-events-none select-none">
                    <span className="text-white text-xs sm:text-sm md:text-sm lg:text-base font-medium tracking-wide font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:text-cyan-100 transition-colors">
                      {item.title}
                    </span>
                  </div>
                </div>

                {/* Subtle Accessible Label on Focus / Screen-readers */}
                <span className="sr-only">
                  {item.title} — {item.track}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Keyframes for Smooth Hardware-Accelerated Continuous Marquee ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .cert-marquee-track {
              animation: certificationsMarquee 36s linear infinite;
            }
            @keyframes certificationsMarquee {
              0% {
                transform: translate3d(0%, 0, 0);
              }
              100% {
                transform: translate3d(-50%, 0, 0);
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .cert-marquee-track {
                animation: none !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}
