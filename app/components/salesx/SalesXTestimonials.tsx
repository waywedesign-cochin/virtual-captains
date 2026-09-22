"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  rating: number;
  initials: string;
  accentColor: string;
  align: "left" | "right";
}

const testimonials: Testimonial[] = [
  {
    id: 0,
    quote: "\u201cBoosted my confidence and helped me close more deals.\u201d",
    author: "Arjun M",
    role: "Business Development Rep",
    rating: 5,
    initials: "AM",
    accentColor: "#0052cc",
    align: "left",
  },
  {
    id: 1,
    quote: "\u201cPractical training that actually works in real conversations.\u201d",
    author: "Priya S",
    role: "Inside Sales Lead",
    rating: 5,
    initials: "PS",
    accentColor: "#0052cc",
    align: "right",
  },
  {
    id: 2,
    quote: "\u201cOur team improved significantly in handling objections.\u201d",
    author: "Rahul K",
    role: "VP Sales, FinTech Startup",
    rating: 5,
    initials: "RK",
    accentColor: "#0052cc",
    align: "left",
  },
  {
    id: 3,
    quote: "\u201cThe live CRM simulations were a game-changer. Felt real, not rehearsed.\u201d",
    author: "Sneha T",
    role: "Account Executive",
    rating: 5,
    initials: "ST",
    accentColor: "#0052cc",
    align: "right",
  },
  {
    id: 4,
    quote: "\u201cGot placed within 3 weeks of completing the programme.\u201d",
    author: "Dev R",
    role: "SDR, SaaS Enterprise",
    rating: 5,
    initials: "DR",
    accentColor: "#0052cc",
    align: "left",
  },
];

// Duplicated for seamless infinite loop
const marqueeItems = [...testimonials, ...testimonials];

function TestimonialCard({ t }: { t: Testimonial }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`flex w-full mb-3.5 ${t.align === "right" ? "justify-end pr-2" : "justify-start pl-2"}`}
    >
      {/* Card wrapper — relative so the tooltip anchors to it */}
      <div
        className="relative max-w-[88%] sm:max-w-[82%]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Author speech bubble tooltip (appears above on hover) ── */}
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            bottom: "calc(100% + 10px)",
            ...(t.align === "right" ? { right: 0 } : { left: 0 }),
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0) scale(1)" : "translateY(6px) scale(0.96)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            transformOrigin: t.align === "right" ? "bottom right" : "bottom left",
          }}
        >
          {/* Blue bubble */}
          <div
            className="inline-flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,82,204,0.45)]"
            style={{ background: "#0052cc", minWidth: "160px" }}
          >
            {/* Avatar circle */}
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 border-2 border-white/40 overflow-hidden text-slate-800 font-bold text-xs font-sans"
            >
              <svg className="w-6 h-6 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white font-sans leading-tight">{t.author}</p>
              <div className="flex gap-0.5 mt-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-white" style={{ fontSize: "12px" }}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Downward tail — aligned to match card side */}
          <div
            className="absolute -bottom-2"
            style={{
              ...(t.align === "right" ? { right: "18px" } : { left: "18px" }),
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid #0052cc",
            }}
          />
        </div>

        {/* ── Quote card ── */}
        <div
          className="rounded-2xl px-4 py-3.5 cursor-pointer select-none"
          style={{
            background: hovered
              ? "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(12,20,56,0.7) 50%, rgba(7,11,32,0.82) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(8,13,38,0.55) 50%, rgba(6,9,26,0.68) 100%)",
            borderWidth: "1px",
            borderStyle: "solid",
            borderTopColor: hovered
              ? "rgba(56,189,248,0.5)"
              : "rgba(255,255,255,0.15)",
            borderRightColor: hovered
              ? "rgba(56,189,248,0.4)"
              : "rgba(255,255,255,0.09)",
            borderBottomColor: hovered
              ? "rgba(56,189,248,0.4)"
              : "rgba(255,255,255,0.09)",
            borderLeftColor: hovered
              ? "rgba(56,189,248,0.4)"
              : "rgba(255,255,255,0.09)",
            backdropFilter: "blur(16px)",
            boxShadow: hovered
              ? "0 0 20px rgba(56,189,248,0.12), inset 0 1px 0 rgba(255,255,255,0.12)"
              : "inset 0 1px 0 rgba(255,255,255,0.07)",
            transition: "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          }}
        >
          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
            {t.quote}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SalesXTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // GSAP entrance for left heading
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 28 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 72%",
        once: true,
        onEnter: () => {
          gsap.to(headingRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
          });
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#07090e] overflow-hidden border-t border-blue-950/40"
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-5 order-2 lg:order-1 text-left pr-0 lg:pr-6">
            <div ref={headingRef} className="will-change-transform">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-sans">
                Testimonials
              </h2>
              <div className="mt-5 text-lg sm:text-xl text-slate-300 font-sans leading-snug space-y-0.5">
                <div>Tested by Sellers</div>
                <div>Endorsed by Execs</div>
              </div>
            </div>
          </div>

          {/* Center hairline divider */}
          <div className="hidden lg:block lg:col-span-1 relative self-stretch">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-blue-500/25 to-transparent" />
          </div>

          {/* ── RIGHT COLUMN: Vertical marquee ── */}
          <div
            className="lg:col-span-6 order-1 lg:order-2 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Mask fade top + bottom — no overflow:hidden so tooltips aren't clipped */}
            <div
              className="relative"
              style={{
                height: "420px",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%)",
                overflow: "hidden",
              }}
            >
              {/* Scrolling track */}
              <div
                style={{
                  animationName: "marquee-up",
                  animationDuration: "24s",
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  animationPlayState: isPaused ? "paused" : "running",
                  willChange: "transform",
                  paddingTop: "60px", // room for top tooltip
                }}
              >
                {marqueeItems.map((t, idx) => (
                  <TestimonialCard key={`${t.id}-${idx}`} t={t} />
                ))}
              </div>
            </div>

            {/* Paused badge */}
            {isPaused && (
              <div className="absolute top-4 right-3 z-30 px-2.5 py-1 rounded-full bg-white/8 backdrop-blur-sm border border-white/12 text-[10px] text-white/60 font-sans tracking-wide pointer-events-none">
                ⏸ paused
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </section>
  );
}
