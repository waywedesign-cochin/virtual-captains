"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useHeadingZoom } from "./useHeadingZoom";

gsap.registerPlugin(ScrollTrigger);

type Metric = {
  value: string;
  label: string;
  /** Long values get a smaller centre size so they fit inside the rings */
  long?: boolean;
};

// One metric per hexagon corner, in the order they are revealed.
const METRICS: Metric[] = [
  { value: "200+", label: "Corporate Sessions Delivered" },
  { value: "10+", label: "Industries" },
  { value: "500+", label: "Sales Teams Coached" },
  { value: "8+", label: "Countries" },
  { value: "15,000+", label: "Professionals Trained", long: true },
  { value: "3", label: "Continents" },
];

// Pointy-top hexagon: corners every 60°, starting at the top, clockwise.
const CORNER_ANGLES = [-90, -30, 30, 90, 150, 210];

// Hexagon only where it has room; phones & rotated phones get a card grid.
// Mirrors the `hex:` variant in app/globals.css.
const HEX_QUERY = "(min-width: 768px) and (min-height: 501px)";
const NO_HEX_QUERY = "(max-width: 767px), (max-height: 500px)";

/** Corner position in % of the square stage. */
function corner(i: number) {
  const a = (CORNER_ANGLES[i] * Math.PI) / 180;
  return { x: 50 + 50 * Math.cos(a), y: 50 + 50 * Math.sin(a) };
}

const HEX_POINTS = CORNER_ANGLES.map((_, i) => {
  const { x, y } = corner(i);
  return `${x},${y}`;
}).join(" ");

/**
 * Where a corner's label sits relative to its dot — always OUTSIDE the
 * hexagon. Phones: top/upper corners put the label above the dot, bottom/
 * lower corners below it, and side labels lean outward (toward the screen
 * edge) so they clear the hexagon's slanted edges without running off
 * screen. md+: side labels sit beside their corner, pointing outward.
 */
const SIDE_MD_RIGHT =
  "md:top-1/2 md:bottom-auto md:left-full md:translate-x-0 md:-translate-y-1/2 md:m-0 md:ml-4 md:text-left";
const SIDE_MD_LEFT =
  "md:top-1/2 md:bottom-auto md:left-auto md:right-full md:translate-x-0 md:-translate-y-1/2 md:m-0 md:mr-4 md:text-right";
// Side labels are anchored at the corner and extend only outward, lifted
// clear of the slanted edges (mb-6/mt-6), so no part falls inside the shape.
const LABEL_PLACEMENT = [
  `bottom-full left-1/2 -translate-x-1/2 mb-2.5 text-center`, // top
  `bottom-full left-0 -translate-x-3 mb-6 text-left ${SIDE_MD_RIGHT}`, // upper-right
  `top-full left-0 -translate-x-3 mt-6 text-left ${SIDE_MD_RIGHT}`, // lower-right
  `top-full left-1/2 -translate-x-1/2 mt-2.5 text-center`, // bottom
  `top-full right-0 translate-x-3 mt-6 text-right ${SIDE_MD_LEFT}`, // lower-left
  `bottom-full right-0 translate-x-3 mb-6 text-right ${SIDE_MD_LEFT}`, // upper-left
];

/**
 * "By the numbers" — a pinned hexagon. Each metric zooms into the centre,
 * then travels out to its own corner (which lights up) while the hexagon's
 * outline traces progress. When all six corners are filled the title returns,
 * and the whole stage recedes as the next section scrolls in.
 *
 * Reduced motion: no pin — the hexagon renders with every corner filled.
 */
export default function AboutMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  // Entrance zoom on the h2 itself; the scroll timeline only moves the
  // wrapper (titleRef), so the two never animate the same element.
  const titleHeadingRef = useRef<HTMLHeadingElement>(null);
  useHeadingZoom(titleHeadingRef);
  const cardsHeadingRef = useRef<HTMLHeadingElement>(null);
  useHeadingZoom(cardsHeadingRef);
  const progressRef = useRef<SVGPolygonElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const centerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cornerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rippleRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Phones / rotated phones: cards rise in one after another
      mm.add(NO_HEX_QUERY, () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const cards = gsap.utils.toArray<HTMLElement>(".vc-metric-card", sectionRef.current);
        gsap.set(cards, { opacity: 0, y: 24 });
        ScrollTrigger.batch(cards, {
          start: "top 90%",
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }),
        });
      });

      mm.add(`(prefers-reduced-motion: no-preference) and ${HEX_QUERY}`, () => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        const progress = progressRef.current;
        if (!section || !stage || !progress) return;

        const centers = centerRefs.current.filter(Boolean) as HTMLDivElement[];
        const corners = cornerRefs.current.filter(Boolean) as HTMLDivElement[];
        const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];

        // Hexagon perimeter in viewBox units (side = radius = 50)
        const PERIMETER = 300;
        gsap.set(progress, { strokeDasharray: PERIMETER, strokeDashoffset: PERIMETER });
        gsap.set(centers, { opacity: 0, scale: 0.4, xPercent: -50, yPercent: -50 });
        gsap.set(corners, { opacity: 0, scale: 0.6 });
        gsap.set(dots, { scale: 0.5, opacity: 0.35 });

        // Slow idle spin of the dashed ring (not scroll-bound)
        if (ringRef.current) {
          gsap.to(ringRef.current, {
            rotation: 360,
            svgOrigin: "50 50",
            duration: 60,
            ease: "none",
            repeat: -1,
          });
        }

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            id: "about-metrics-pin",
            trigger: section,
            start: "top top",
            end: () => "+=" + window.innerHeight * 4.2,
            pin: true,
            anticipatePin: 1,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Title leaves the centre
        tl.to(titleRef.current, { opacity: 0, scale: 0.8, duration: 0.4, ease: "power2.in" }, 0.2);

        const STEP = 1.1;
        centers.forEach((el, i) => {
          const at = 0.5 + i * STEP;
          const { x, y } = corner(i);
          const stageBox = () => stage.getBoundingClientRect();

          // 1. Zoom into the centre
          tl.to(el, { opacity: 1, scale: 1, duration: 0.35 }, at);

          // 2. Travel out to its corner, shrinking away as the corner lights up
          tl.to(
            el,
            {
              x: () => ((x - 50) / 100) * stageBox().width,
              y: () => ((y - 50) / 100) * stageBox().height,
              scale: 0.25,
              opacity: 0,
              duration: 0.4,
              ease: "power2.in",
            },
            at + 0.65,
          );
          tl.to(corners[i], { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.8)" }, at + 0.95);
          tl.to(dots[i], { scale: 1, opacity: 1, duration: 0.25 }, at + 0.95);
          // Landing ripple: a ring expands and fades from the corner
          if (rippleRefs.current[i]) {
            tl.fromTo(
              rippleRefs.current[i],
              { scale: 1, opacity: 0.9 },
              { scale: 5, opacity: 0, duration: 0.45, ease: "power1.out" },
              at + 0.95,
            );
          }
          tl.to(
            progress,
            { strokeDashoffset: PERIMETER - (PERIMETER / 6) * (i + 1), duration: 0.4, ease: "none" },
            at + 0.7,
          );
        });

        // All corners filled: the title comes back to close the sequence
        tl.to(
          titleRef.current,
          { opacity: 1, scale: 1, duration: 0.4 },
          0.5 + METRICS.length * STEP,
        );
        tl.to({}, { duration: 0.5 });

        // After the pin releases, the stage recedes while the next section
        // scrolls in — so the hand-off never leaves a blank screen.
        const pinST = tl.scrollTrigger!;
        gsap.fromTo(
          stage,
          { opacity: 1, scale: 1 },
          {
            opacity: 0,
            scale: 0.85,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: () => pinST.end,
              end: () => pinST.end + window.innerHeight * 0.8,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-metrics-title"
      className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-12 sm:py-16 hex:min-h-svh hex:py-24 hex:motion-safe:h-svh hex:motion-safe:pt-20 hex:motion-safe:pb-6"
    >
      {/* Full metric list for screen readers — the visual sequence is decorative */}
      <ul className="sr-only">
        {METRICS.map((m) => (
          <li key={m.label}>
            {m.value} {m.label}
          </li>
        ))}
      </ul>

      {/* ── Phones & rotated phones: heading + card grid ── */}
      <div className="w-full max-w-3xl hex:hidden">
        <div className="text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 sm:text-[11px]">
            By the numbers
          </span>
          <h2
            ref={cardsHeadingRef}
            aria-hidden="true"
            className="mt-2 text-[clamp(1.6rem,6vw,2.4rem)] font-medium leading-[1.15] tracking-tight text-white"
          >
            Our{" "}
            <span className="bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text italic text-transparent">
              Global
            </span>{" "}
            Impact
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4" aria-hidden="true">
          {METRICS.map((m) => (
            <div
              key={`card-${m.label}`}
              className="vc-metric-card flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm sm:py-6"
            >
              <p className="text-[clamp(1.5rem,7vw,2.1rem)] font-bold leading-none tracking-tight text-white">
                {m.value}
              </p>
              <p className="mt-2 text-xs leading-tight text-white/70 text-balance sm:text-[13px]">
                {m.label}
              </p>
              <span className="mt-3 h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.9)]" />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={stageRef}
        className="@container relative hidden hex:block aspect-square w-[min(62vw,calc(100svh-280px),440px)] min-w-44 md:w-[min(46vw,calc(100svh-240px),480px)]"
      >
        {/* Ambient core glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.55)_0%,rgba(29,78,216,0.22)_45%,transparent_72%)] blur-2xl"
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          {/* Inner rings */}
          <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(147,197,253,0.14)" strokeWidth="0.3" />
          <circle
            ref={ringRef}
            cx="50"
            cy="50"
            r="29"
            fill="none"
            stroke="rgba(147,197,253,0.22)"
            strokeWidth="0.3"
            strokeDasharray="1.2 2.4"
          />
          <circle cx="50" cy="50" r="21" fill="rgba(37,99,235,0.08)" stroke="rgba(147,197,253,0.12)" strokeWidth="0.3" />

          {/* Hexagon outline + scroll progress trace */}
          <polygon
            points={HEX_POINTS}
            fill="rgba(15,40,110,0.18)"
            stroke="rgba(147,197,253,0.22)"
            strokeWidth="0.3"
            strokeLinejoin="round"
          />
          <polygon
            ref={progressRef}
            points={HEX_POINTS}
            fill="none"
            stroke="url(#aboutHexProgress)"
            strokeWidth="0.45"
            style={{ filter: "drop-shadow(0 0 1.2px rgba(96,165,250,0.9))" }}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="aboutHexProgress" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
          </defs>
        </svg>

        {/* Centre title (start + end of the sequence) */}
        <div
          ref={titleRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-[14%] text-center"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50 sm:text-[11px]">
            By the numbers
          </span>
          <h2
            ref={titleHeadingRef}
            id="about-metrics-title"
            className="mt-2 text-[max(20px,8.5cqw)] font-medium leading-[1.15] tracking-tight text-white"
          >
            Our{" "}
            <span className="bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text italic text-transparent">
              Global
            </span>{" "}
            Impact
          </h2>
        </div>

        {/* Centre metrics — one at a time */}
        {METRICS.map((m, i) => (
          <div
            key={`c-${m.label}`}
            ref={(el) => {
              centerRefs.current[i] = el;
            }}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 w-[58%] text-center opacity-0 motion-reduce:hidden"
          >
            <p
              className={`font-bold leading-none tracking-tight text-white drop-shadow-[0_4px_24px_rgba(37,99,235,0.6)] ${
                // cqw = % of the hexagon's width, so the number always
                // fits inside the rings whatever the screen size
                m.long ? "text-[10.5cqw]" : "text-[17cqw]"
              }`}
            >
              {m.value}
            </p>
            <p className="mx-auto mt-[2.5cqw] max-w-[90%] text-[max(12px,4.4cqw)] font-medium leading-tight text-white/90 text-balance">
              {m.label}
            </p>
          </div>
        ))}

        {/* Corner markers — filled as each metric lands */}
        {METRICS.map((m, i) => {
          const { x, y } = corner(i);
          return (
            <div
              key={`k-${m.label}`}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-hidden="true"
            >
              <span
                ref={(el) => {
                  rippleRefs.current[i] = el;
                }}
                className="pointer-events-none absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/70 opacity-0"
              />
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className="absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(96,165,250,0.85)]"
              />
              <div
                ref={(el) => {
                  cornerRefs.current[i] = el;
                }}
                className={`absolute w-max max-w-[4.5rem] sm:max-w-[7rem] md:max-w-[9rem] ${LABEL_PLACEMENT[i]}`}
              >
                <p className="text-[clamp(0.95rem,3.4vw,1.5rem)] font-bold leading-none tracking-tight text-white">
                  {m.value}
                </p>
                <p className="mt-1 text-[10px] leading-tight text-white/70 text-balance sm:text-xs">
                  {m.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
