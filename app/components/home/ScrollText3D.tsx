"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DottedBackground from "./DottedBackground";
import { PIN_QUERY } from "./pinQuery";

import { HEADING_REVEAL, HEADING_REVEAL_FROM } from "@/lib/animations/headingReveal";
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
        <div className="text-[clamp(2.5rem,8vw,5rem)] font-sans leading-none tracking-tight text-[#2557d6]">
          ISO
        </div>
        <div className="mt-1 text-[clamp(1rem,2.5vw,2rem)] font-sans tracking-wide text-[#4d82f5]">
          Certified
        </div>
      </div>
    ),
    x: -25, // vw
    y: -20, // vh
  },
  {
    id: "15k",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="whitespace-nowrap text-[clamp(3rem,10vw,6rem)] font-sans leading-none tracking-tight text-white">
          15,000+
        </div>
        <div className="mt-1 whitespace-nowrap text-[clamp(1rem,2.5vw,2rem)] font-sans tracking-wide text-white/90">
          Professionals Trained
        </div>
      </div>
    ),
    x: 25, // vw
    y: 15, // vh
  },
  {
    id: "cpd",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(1.5rem,5vw,3rem)] font-sans leading-none tracking-tight text-white">
          CPD
        </div>
        <div className="mt-0.5 text-[clamp(0.8rem,1.8vw,1.2rem)] font-sans tracking-wide text-white/60">
          Accredited
        </div>
      </div>
    ),
    x: -30, // vw
    y: 25, // vh
  },
  {
    id: "500",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(2.5rem,6vw,4.5rem)] font-sans leading-none tracking-tight text-[#2557d6]">
          500+
        </div>
        <div className="mt-1 whitespace-nowrap text-[clamp(1rem,2vw,1.5rem)] font-sans tracking-wide text-[#4d82f5]">
          Sales Teams Coached
        </div>
      </div>
    ),
    x: 30, // vw
    y: -25, // vh
  },
  {
    id: "8",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(3.5rem,12vw,7rem)] font-sans leading-none tracking-tight text-white">
          8+
        </div>
        <div className="mt-1 text-[clamp(1.5rem,3.5vw,2.5rem)] font-sans tracking-wide text-white/90">
          Countries
        </div>
      </div>
    ),
    x: -40, // vw
    y: 5, // vh
  },
  {
    id: "ai",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(2rem,6vw,4rem)] font-sans leading-none tracking-tight text-[#2557d6]">
          AI-Powered
        </div>
        <div className="mt-1 text-[clamp(1rem,2vw,1.5rem)] font-sans tracking-wide text-[#4d82f5]">
          Real-time Feedback
        </div>
      </div>
    ),
    x: 35, // vw
    y: 5, // vh
  },
  {
    id: "custom",
    content: (
      <div className="flex flex-col items-center text-center">
        <div className="text-[clamp(2.5rem,7vw,4.5rem)] font-sans leading-none tracking-tight text-white">
          100%
        </div>
        <div className="mt-1 whitespace-nowrap text-[clamp(1rem,2.5vw,1.5rem)] font-sans tracking-wide text-white/90">
          Custom Playbooks
        </div>
      </div>
    ),
    x: -10, // vw
    y: -30, // vh
  },
  {
    id: "roi",
    content: (
      <div className="flex flex-col items-center text-center px-4 max-w-[88vw]">
        <div className="text-[clamp(2.5rem,7vw,5.5rem)] font-sans leading-none tracking-tight text-[#2557d6]">
          3x
        </div>
        <div className="mt-1 text-[clamp(0.95rem,2.2vw,1.45rem)] font-sans tracking-wide text-[#4d82f5] whitespace-nowrap">
          Faster Onboarding
        </div>
      </div>
    ),
    x: 0, // vw
    y: 0, // vh
  },
];

/**
 * Phone layout (< 768px). There is no room to scatter stats across the
 * screen, so they alternate above/below centre (`side` −1 / +1) with only a
 * slight horizontal drift (`x`, in vw). Combined with the mobile stagger
 * below, at most two stats are on screen at once and those two always sit on
 * opposite sides of centre — so they can never overlap.
 */
const MOBILE_COORDS = [
  { x: -6, side: -1 }, // 0: ISO Certified
  { x: 5, side: 1 }, // 1: 15,000+ Professionals
  { x: 6, side: -1 }, // 2: CPD Accredited
  { x: -5, side: 1 }, // 3: 500+ Sales Teams
  { x: -6, side: -1 }, // 4: 8+ Countries
  { x: 5, side: 1 }, // 5: AI-Powered
  { x: 0, side: -1 }, // 6: 100% Custom Playbooks
  { x: 0, side: 0 }, // 7: 3x Faster Onboarding (dead center)
];

/**
 * Per-breakpoint tunnel tuning. Each stat gets a 1-unit sub-timeline (fly
 * from `startZ` to `endZ`), visible between `fadeInAt` and
 * `fadeOutAt + fadeOutDur`; `stagger` spaces consecutive stats. On phones
 * the stagger is at least half that visible window, which is what caps the
 * number of simultaneously visible stats at two.
 */
const TUNNEL = {
  mobile: {
    startZ: -3600,
    endZ: 450,
    lastZ: 120,
    fadeInAt: 0.3,
    fadeInDur: 0.22,
    fadeOutAt: 0.66,
    fadeOutDur: 0.2,
    firstAt: 0.05,
    stagger: 0.3,
    pinLength: "+=260%",
  },
  desktop: {
    startZ: -6000,
    endZ: 800,
    lastZ: 650,
    fadeInAt: 0.12,
    fadeInDur: 0.3,
    fadeOutAt: 0.8,
    fadeOutDur: 0.2,
    firstAt: 0.2,
    stagger: 0.12,
    pinLength: "+=150%",
  },
};

export default function ScrollText3D() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Two nested nodes so the one-shot entrance (inner) and the scroll-scrubbed
  // exit (outer) never animate the same element. Sharing one element let the
  // entrance tween finish *after* a fast flick had already scrubbed the title
  // out, leaving "Impact That Speaks" stuck on screen over the stats.
  const introRef = useRef<HTMLDivElement>(null);
  const introInnerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !containerRef.current) return;

      const mm = gsap.matchMedia();

      // Rebuilt whenever a breakpoint flips (rotation, window resize), so
      // phone/desktop tuning never goes stale. The callback only runs while
      // at least one query matches, so the width queries must cover every
      // viewport (isDesktop looks unused, but dropping it disables the tunnel
      // on tall desktops).
      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isDesktop: "(min-width: 1024px)",
          isShort: "(max-height: 699px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, isTablet, isShort, reduceMotion } =
            context.conditions as Record<string, boolean>;
          if (reduceMotion) return;

          const cfg = isMobile ? TUNNEL.mobile : TUNNEL.desktop;
          const lastZ = isMobile ? cfg.lastZ : isTablet ? 350 : cfg.lastZ;

          // Several stats fly in from a leftward vw offset (e.g. -40vw). At
          // pinned-layout viewports (PIN_QUERY) the fixed SideNav sits at the left edge, so
          // clamp how far left any stat is allowed to land — elsewhere the
          // nav isn't rendered at all, so no clamp is needed there.
          const NAV_SAFE_LEFT_PX = 200;
          const getSafeX = (index: number) => {
            const vw = window.innerWidth;
            if (isMobile) return (MOBILE_COORDS[index].x / 100) * vw;
            const px = (STATS[index].x / 100) * vw;
            if (window.matchMedia(PIN_QUERY).matches && px < 0) {
              return Math.max(px, NAV_SAFE_LEFT_PX - vw / 2);
            }
            return px;
          };

          const getSafeY = (index: number) => {
            const vh = window.innerHeight;
            if (isMobile) {
              // At least 110px off-centre so stacked stats clear each other
              // even on very short phones.
              return MOBILE_COORDS[index].side * Math.max(vh * 0.18, 110);
            }
            return (STATS[index].y / 100) * vh * (isShort ? 0.65 : 1);
          };

          // Positions are viewport-relative, so re-place on every refresh
          // (resize, orientation change) — context.add keeps them revertible.
          const place = context.add("place", () => {
            textRefs.current.forEach((text, i) => {
              if (text) gsap.set(text, { x: getSafeX(i), y: getSafeY(i) });
            });
          }) as () => void;

          // Zoom-in entrance animation for intro heading
          if (introInnerRef.current) {
            gsap.set(introInnerRef.current, {
              ...HEADING_REVEAL_FROM,
              transformOrigin: "center center",
            });

            gsap.to(introInnerRef.current, {
              scrollTrigger: {
                // The heading itself, not the section: the title sits mid
                // way down a full-screen section, so a section trigger played
                // the zoom while it was still below the fold on phones.
                trigger: introInnerRef.current,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
              ...HEADING_REVEAL,
            });
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: cfg.pinLength,
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
                duration: isMobile ? 0.2 : 0.15,
                ease: "power2.in",
              },
              0,
            );
          }

          textRefs.current.forEach((text, i) => {
            if (!text) return;

            const isLast = i === STATS.length - 1;

            // Center the stat on its anchor and push deep into Z space
            gsap.set(text, {
              xPercent: -50,
              yPercent: -50,
              z: cfg.startZ,
              opacity: 0,
            });

            const itemTl = gsap.timeline();

            // 1. Fly forward linearly in 3D space. The last stat stops short
            //    of the camera so it stays readable (never cut off on phones).
            itemTl.to(
              text,
              {
                z: isLast ? lastZ : cfg.endZ,
                duration: 1,
                ease: "none", // Constant Z velocity gives natural 3D acceleration
              },
              0,
            );

            // 2. Fade in only as it approaches the readable zone (avoids background clustering)
            itemTl.fromTo(
              text,
              { opacity: 0 },
              { opacity: 1, duration: cfg.fadeInDur, ease: "power1.inOut" },
              cfg.fadeInAt,
            );

            // 3. Fade out before it hits the camera (except the last item, so it stays on screen!)
            if (!isLast) {
              itemTl.to(
                text,
                { opacity: 0, duration: cfg.fadeOutDur, ease: "power1.inOut" },
                cfg.fadeOutAt,
              );
            }

            tl.add(itemTl, cfg.firstAt + i * cfg.stagger);
          });

          place();
          ScrollTrigger.addEventListener("refresh", place);
          return () => ScrollTrigger.removeEventListener("refresh", place);
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <div
      ref={sectionRef}
      className="relative z-10 w-full bg-[#040507]"
    >
      <section
        className="relative h-svh w-full overflow-hidden motion-reduce:h-auto motion-reduce:py-24 sm:motion-reduce:py-32"
        style={{ perspective: "1200px" }}
      >
        <DottedBackground theme="dark" />

        {/* Intro title — visible before scroll animation begins */}
        <div
          ref={introRef}
          className="absolute inset-0 z-20 flex items-center justify-center px-6 pointer-events-none motion-reduce:relative motion-reduce:inset-auto"
        >
          <div ref={introInnerRef} className="flex flex-col items-center">
            <p className="text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase text-[#4d82f5]/75 mb-3">
              By the Numbers
            </p>
            <h2 className="font-sans text-[clamp(2rem,5vw,4rem)] font-bold text-white tracking-tight leading-tight text-center text-balance">
              Impact That Speaks
            </h2>
            <div className="mt-4 h-0.75 w-12 rounded-full bg-[#2557d6]/50" />
          </div>
        </div>

        {/* Reduced motion: no tunnel — the stats settle into a plain grid */}
        <div
          ref={containerRef}
          className="relative z-10 mx-auto h-full w-full max-w-[1920px] motion-reduce:mt-14 motion-reduce:grid motion-reduce:h-auto motion-reduce:max-w-6xl motion-reduce:grid-cols-1 motion-reduce:place-items-center motion-reduce:gap-x-8 motion-reduce:gap-y-12 motion-reduce:px-6 sm:motion-reduce:grid-cols-2 xl:motion-reduce:grid-cols-3"
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

