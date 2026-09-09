"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  value: number;
  suffix: string;
  label: string;
  /** Tailwind column placement, mirroring the staggered layout in the design. */
  className: string;
  size: "lg" | "md";
};

const STATS: Stat[] = [
  {
    value: 8,
    suffix: "+",
    label: "Countries",
    // lg:pl-36: clears the fixed SideNav's left-edge footprint — without it
    // this stat (the only one flush against the left edge) renders directly
    // behind the nav's labels.
    className: "lg:col-start-1 lg:row-start-1 lg:justify-self-start lg:pl-36",
    size: "md",
  },
  {
    value: 200,
    suffix: "+",
    label: "Corporate sessions delivered",
    className: "lg:col-start-2 lg:row-start-1 lg:justify-self-center",
    size: "lg",
  },
  {
    value: 15000,
    suffix: "+",
    label: "Professionals trained",
    className: "lg:col-start-3 lg:row-start-1 lg:justify-self-end",
    size: "lg",
  },
  {
    value: 10,
    suffix: "+",
    label: "Industries",
    className: "lg:col-start-1 lg:row-start-2 lg:justify-self-end lg:pr-10",
    size: "md",
  },
  {
    value: 500,
    suffix: "+",
    label: "Sales teams coached",
    className: "lg:col-start-2 lg:row-start-2 lg:justify-self-center lg:pl-16",
    size: "lg",
  },
];

/**
 * "The Impact" — the blue stats band. Numbers count up once when the section
 * scrolls into view; the deliberately uneven column/row placement echoes the
 * scattered layout in the design rather than a tidy grid.
 */
export default function TheImpact() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const valueRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Render the final numbers (and the final white background) immediately
      // when motion is unwelcome.
      if (prefersReducedMotion) {
        valueRefs.current.forEach((el, i) => {
          if (el) el.textContent = STATS[i].value.toLocaleString("en-US");
        });
        gsap.set(sectionRef.current, { "--stop1": "#eaf1fd", "--stop2": "#ffffff" });
        return;
      }

      gsap.set(itemRefs.current, { opacity: 0, y: 28 });
      // Black -> dark blue -> light sky blue -> white, matching the black
      // hand-off from Endorsement on one end and HiringPartners' white on
      // the other.
      gsap.set(sectionRef.current, { "--stop1": "#050608", "--stop2": "#0b1f5c" });

      const buildBackgroundAndCount = (tl: gsap.core.Timeline) => {
        tl.to(
          sectionRef.current,
          { "--stop1": "#0b1f5c", "--stop2": "#2f6fe0", duration: 0.7, ease: "none" },
          0,
        )
          .to(
            sectionRef.current,
            { "--stop1": "#2f6fe0", "--stop2": "#8ec3f5", duration: 0.7, ease: "none" },
            0.7,
          )
          .to(
            sectionRef.current,
            { "--stop1": "#eaf1fd", "--stop2": "#ffffff", duration: 0.7, ease: "none" },
            1.4,
          );

        STATS.forEach((stat, i) => {
          const el = valueRefs.current[i];
          if (!el) return;
          const counter = { value: 0 };
          tl.to(
            counter,
            {
              value: stat.value,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(counter.value).toLocaleString("en-US");
              },
            },
            0.15 + i * 0.09,
          );
        });

        // The background's final leg lands on white, which the stats' white
        // text can't survive — fade the stats out right as that happens
        // (they've already fully counted up by now) so nothing is ever read
        // against low contrast; the section then hands off to
        // HiringPartners' white background as plain, empty white.
        tl.to(itemRefs.current, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, 1.9);
      };

      const mm = gsap.matchMedia();

      // Desktop: pinned (not just `once: true`) and scrubbed, so the full
      // stat + background reveal must play out before the section releases
      // and normal scrolling resumes — the user can't scroll straight past
      // it mid-animation. Gated to desktop like every other pinned section
      // in this codebase — capturing scroll for this long reads as broken
      // on a touch device rather than intentional.
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 0.5,
          },
        });

        tl.to(
          itemRefs.current,
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: "power2.out" },
          0,
        );
        buildBackgroundAndCount(tl);
      });

      // Mobile/tablet: same visual sequence, but scrubbed to the section's
      // ordinary scroll-through instead of pinning it — the user's scroll
      // stays theirs the whole time.
      mm.add("(max-width: 1023px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });

        tl.to(
          itemRefs.current,
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: "power2.out" },
          0,
        );
        buildBackgroundAndCount(tl);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-nav-section="The Impact"
      data-nav-theme="dark"
      className="relative w-full overflow-hidden px-6 py-[clamp(64px,12vh,140px)] text-white sm:px-10 lg:px-16"
      style={{
        background: "linear-gradient(135deg, var(--stop1, #0b1f5c), var(--stop2, #2f6fe0))",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3 lg:gap-y-20">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`flex flex-col items-center text-center lg:items-start lg:text-left ${stat.className}`}
          >
            <p
              className={`font-serif leading-none tracking-tight ${
                stat.size === "lg"
                  ? "text-[clamp(2.75rem,5vw,4.5rem)]"
                  : "text-[clamp(2.25rem,3.6vw,3.25rem)]"
              }`}
            >
              <span
                ref={(el) => {
                  valueRefs.current[i] = el;
                }}
              >
                0
              </span>
              {stat.suffix}
            </p>
            <p className="mt-2 max-w-[220px] font-serif text-[clamp(0.95rem,1.2vw,1.25rem)] leading-snug text-white/80">
              {stat.label}
            </p>
            <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[#e7ff3d]" />
          </div>
        ))}
      </div>
    </section>
  );
}
