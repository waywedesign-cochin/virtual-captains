"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { CERTIFICATIONS } from "@/app/content/certifications";

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
          // 2. Certification badges bloom in over the marquee with staggered spring reveal
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
      className="relative w-full overflow-hidden py-12 sm:py-16 lg:py-24 select-none flex flex-col items-center justify-center"
    >
      {/* Accessible semantic heading for screen readers */}
      <h2 className="sr-only">Certifications</h2>


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
              <span className="font-serif italic font-light tracking-tight text-[#344E8F] text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] xl:text-[12.5rem] leading-none whitespace-nowrap px-6 sm:px-10 lg:px-14">
                Certifications
              </span>
              <span className="text-[#344E8F]/40 text-xl sm:text-3xl lg:text-5xl select-none">
                •
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FOREGROUND CONTAINER: Certificate Badges Floating In Front ── */}
      <div className="relative z-10 w-full max-w-372 mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 flex flex-col items-center justify-center">
        <div
          ref={badgesContainerRef}
          className="relative z-10 w-full flex items-center justify-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-20 w-full max-w-5xl mx-auto">
            {CERTIFICATIONS.map((item, idx) => (
              <div
                key={item.id}
                ref={(el) => {
                  badgeRefs.current[idx] = el;
                }}
                className="group relative flex flex-col items-center justify-center will-change-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  className={`${item.sizeClass} w-auto drop-shadow-[0_18px_40px_rgba(29,78,216,0.45)] transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2`}
                />
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
