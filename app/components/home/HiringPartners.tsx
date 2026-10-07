"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DottedBackground from "./DottedBackground";

import { HEADING_REVEAL, HEADING_REVEAL_FROM } from "@/lib/animations/headingReveal";
gsap.registerPlugin(ScrollTrigger);

import { PARTNERS, logoHeight, type Partner } from "@/app/content/partners";

const HALF = Math.ceil(PARTNERS.length / 2);
const ROWS = [PARTNERS.slice(0, HALF), PARTNERS.slice(HALF)];

/** Edge fade so logos drift in and out instead of being cut off. */
const EDGE_MASK =
  "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)";

function LogoCard({ partner }: { partner: Partner }) {
  return (
    <li
      title={partner.name}
      className="group flex h-18 w-40 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/4 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#38bdf8]/50 hover:bg-white/8 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_22px_-4px_rgba(56,189,248,0.4)] sm:h-22 sm:w-48 sm:px-6"
    >
      {/* Logos render as one-colour white marks so every brand reads
          evenly on the glass */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.logoSrc}
        alt={partner.name}
        loading="lazy"
        draggable={false}
        style={{ height: `${logoHeight(partner.ratio)}%` }}
        className="w-auto max-w-full object-contain opacity-70 brightness-0 invert transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
      />
    </li>
  );
}

/**
 * "Our Network" — two rows of client/partner logo cards drifting in opposite
 * directions. Rows pause under the mouse and stay still for reduced motion.
 */
export default function HiringPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 0, y: 15 });
      gsap.set(headingRef.current, {
        ...HEADING_REVEAL_FROM,
        transformOrigin: "center center",
      });
      gsap.set(marqueeRef.current, { opacity: 0, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });
      if (eyebrowRef.current) {
        tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
      }
      tl.to(headingRef.current, { ...HEADING_REVEAL }, eyebrowRef.current ? "-=0.25" : 0).to(
        marqueeRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.35",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="partner"
      data-nav-section="Partner"
      data-nav-theme="dark"
      className="relative -mt-px z-10 flex w-full flex-col justify-center overflow-hidden py-14 sm:py-20 pin:py-28 text-white"
      style={{
        background:
          "linear-gradient(180deg, #0c318f 0%, #051d5c 40%, #050b24 75%, #040507 100%)",
      }}
    >
      <DottedBackground theme="dark" />

      {/* ---------- HEADLINE ---------- */}
      <div className="relative z-10 mx-auto flex w-full max-w-310 flex-col items-center px-5 text-center sm:px-10">
        <span
          ref={eyebrowRef}
          className="mb-[clamp(12px,2vh,20px)] block font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/50"
        >
          Our network
        </span>
        <h2
          ref={headingRef}
          className="font-sans text-[clamp(1.75rem,4vw,3.25rem)] font-normal leading-[1.15] text-white"
        >
          Building <span className="italic text-[#1d63ed]">Better Sales</span>{" "}
          <span className="sm:block">Through Partnership</span>
        </h2>
      </div>

      {/* ---------- LOGO MARQUEE: two rows, opposite directions ---------- */}
      <div
        ref={marqueeRef}
        className="relative z-10 mt-10 flex flex-col gap-5 sm:mt-14 sm:gap-6"
        aria-label="Clients and partners"
        role="region"
      >
        {ROWS.map((row, r) => (
          <div
            key={r}
            // overflow-hidden is needed for the loop; the padding (offset by
            // the negative margin) leaves room so the hover lift and glow
            // aren't clipped
            className="partner-marquee -my-3 overflow-hidden py-3"
            // mask per row (not on the wrapper): a mask also clips to its own
            // box, and the wrapper's box doesn't include the rows' padding
            style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
          >
            {/* The row is rendered twice so the -50% loop is seamless; the
                copy is hidden from screen readers. */}
            <div
              className="partner-track flex w-max"
              style={{
                animationDirection: r === 0 ? "normal" : "reverse",
                animationDuration: `${row.length * 9}s`,
              }}
            >
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5"
                >
                  {/* each half holds the row twice so it's wider than even
                      ultra-wide screens — no gap at the end of the loop */}
                  {[...row, ...row].map((p, i) => (
                    <LogoCard key={`${p.name}-${i}`} partner={p} />
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes partner-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .partner-track {
          animation-name: partner-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (hover: hover) {
          .partner-marquee:hover .partner-track { animation-play-state: paused; }
        }
        @media (prefers-reduced-motion: reduce) {
          .partner-track { animation: none; }
          .partner-marquee { overflow-x: auto; }
        }
      `}</style>
    </section>
  );
}
