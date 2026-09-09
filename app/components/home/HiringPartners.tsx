"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Partner = {
  name: string;
  /** Percent positions inside the cluster circle, plus bubble diameter in px. */
  x: number;
  y: number;
  size: number;
  accent?: boolean;
  /**
   * Drop a logo in public/home/ and set its path here (e.g.
   * "/home/partner-acme.svg"). Without one the bubble shows the placeholder
   * mark below, so swapping in real logos changes nothing about the layout.
   */
  logo?: string;
};

/** PLACEHOLDER SET — replace names/logos with the real hiring partners. */
const PARTNERS: Partner[] = [
  { name: "Northwind", x: 50, y: 46, size: 104 },
  { name: "Vertex", x: 20, y: 28, size: 76 },
  { name: "Lumen", x: 76, y: 24, size: 68 },
  { name: "Cobalt", x: 15, y: 68, size: 82, accent: true },
  { name: "Ridge", x: 78, y: 66, size: 88 },
  { name: "Kite", x: 44, y: 12, size: 56 },
  { name: "Atlas", x: 50, y: 82, size: 62 },
  { name: "Ember", x: 30, y: 48, size: 48 },
  { name: "Nova", x: 68, y: 46, size: 52 },
];

/**
 * "Hiring Partners" — the circular logo cluster. Bubbles scale in on a
 * stagger when the section arrives, then drift on a slow loop so the cluster
 * never sits completely still.
 */
export default function HiringPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  // index 0 (Northwind, the largest/central bubble) leads the entrance
  // alongside the heading/paragraph; the rest follow once that settles.
  const bigBubbleRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set([headingRef.current, bodyRef.current], { opacity: 0, y: 24 });
      gsap.set(clusterRef.current, { opacity: 0 });
      gsap.set(bigBubbleRef.current, { opacity: 0, x: -40, scale: 0.8 });
      gsap.set(bubbleRefs.current, { opacity: 0, scale: 0.5 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.to(clusterRef.current, { opacity: 1, duration: 0.1 })
        .to(
          bigBubbleRef.current,
          { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "power3.out" },
          "<",
        )
        .to(
          headingRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "<0.1",
        )
        .to(
          bodyRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "<0.15",
        )
        // the smaller logos only start popping in once the lead bubble +
        // copy have landed, not concurrently with them
        .to(bubbleRefs.current, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: { each: 0.07, from: "center" },
          ease: "back.out(1.7)",
        });

      // gentle perpetual drift, each bubble on its own rhythm
      [bigBubbleRef.current, ...bubbleRefs.current].forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: i % 2 === 0 ? -10 : 10,
          duration: 3 + (i % 4) * 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.18,
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-nav-section="Hiring Partners"
      data-nav-theme="light"
      className="relative w-full overflow-hidden bg-white px-6 py-[clamp(56px,10vh,120px)] text-[#101010] sm:px-10 lg:px-16"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.13) 0.65px, transparent 0.65px)",
          backgroundSize: "9px 9px",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* ---------- LOGO CLUSTER ---------- */}
        <div
          ref={clusterRef}
          // lg:ml-16: at narrower lg widths the cluster (min(460px,86vw)) is
          // wider than its grid column, so mx-auto lets it overflow evenly
          // both sides — pushing its left edge close enough to the page edge
          // to collide with the fixed SideNav. The margin nudges it clear.
          className="relative mx-auto aspect-square w-[min(460px,86vw)] rounded-full border border-black/8 bg-[radial-gradient(circle_at_50%_50%,rgba(52,120,229,0.07),transparent_68%)] lg:ml-16"
        >
          {PARTNERS.map((partner, i) => (
            <div
              key={partner.name}
              ref={(el) => {
                if (i === 0) bigBubbleRef.current = el;
                else bubbleRefs.current[i - 1] = el;
              }}
              className={`group absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_10px_30px_-14px_rgba(16,16,16,0.35)] ${
                partner.accent
                  ? "bg-[#e7ff3d] text-[#0a0b0f]"
                  : "bg-white text-black/55"
              }`}
              style={{
                left: `${partner.x}%`,
                top: `${partner.y}%`,
                width: partner.size,
                height: partner.size,
              }}
            >
              {partner.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-1/2 w-1/2 object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                />
              ) : (
                <span
                  className="font-serif leading-none opacity-70 transition-all duration-300 group-hover:text-[#3478e5] group-hover:opacity-100"
                  style={{ fontSize: Math.max(11, partner.size * 0.17) }}
                >
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ---------- COPY ---------- */}
        <div className="text-center lg:text-left">
          <h2
            ref={headingRef}
            className="font-serif text-[clamp(1.6rem,2.6vw,2.75rem)] font-normal leading-[1.2]"
          >
            <span className="italic text-[#3478e5]">Get hired</span> by reputed
            enterprises, across India &amp; abroad
          </h2>
          <p
            ref={bodyRef}
            className="mx-auto mt-5 max-w-125 font-sans text-[13px] leading-relaxed text-black/60 sm:text-[14px] lg:mx-0"
          >
            Our certified professionals are placed with organisations that treat
            selling as a discipline — from fast-scaling startups to established
            enterprise sales floors.
          </p>
        </div>
      </div>
    </section>
  );
}
