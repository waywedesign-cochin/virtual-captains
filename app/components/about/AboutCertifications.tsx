"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import {
  CARD_BADGE_CLASS,
  CARD_CERTIFICATIONS,
  ROUND_BADGE_CLASS,
  ROUND_CERTIFICATIONS,
  type Certification,
} from "@/app/content/certifications";

function Badge({ item, className }: { item: Certification; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.image}
      alt={item.alt}
      width={item.width}
      height={item.height}
      loading="lazy"
      decoding="async"
      className={`${className} drop-shadow-[0_18px_40px_rgba(29,78,216,0.45)]`}
    />
  );
}

export default function AboutCertifications() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(marqueeContainerRef.current, { opacity: 0.4, scale: 1 });
        return;
      }
      // Giant marquee text zooms in behind the badges once the section is in view
      gsap.set(marqueeContainerRef.current, {
        opacity: 0,
        scale: 0.85,
        transformOrigin: "center center",
      });
      gsap.to(marqueeContainerRef.current, {
        opacity: 0.4,
        scale: 1,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
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
        <div className="relative z-10 flex w-full flex-col items-center gap-8 sm:gap-10">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14">
            {ROUND_CERTIFICATIONS.map((item) => (
              <Badge key={item.id} item={item} className={ROUND_BADGE_CLASS} />
            ))}
          </div>
          {CARD_CERTIFICATIONS.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {CARD_CERTIFICATIONS.map((item) => (
                <Badge key={item.id} item={item} className={CARD_BADGE_CLASS} />
              ))}
            </div>
          )}
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
