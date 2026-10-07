"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { HEADING_REVEAL, HEADING_REVEAL_FROM } from "@/lib/animations/headingReveal";
import { TESTIMONIALS } from "@/app/content/testimonials";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  rating: number;
  logo?: string;
  align: "left" | "right";
}

// Same client quotes as the home page Endorsement section
const testimonials: Testimonial[] = TESTIMONIALS.map((t, i) => ({
  id: i,
  quote: `“${t.quote}”`,
  author: t.name,
  role: t.role,
  rating: 5,
  logo: t.logo,
  align: i % 2 === 0 ? "left" : "right",
}));

// Duplicated for seamless infinite loop
const marqueeItems = [...testimonials, ...testimonials];

function TestimonialCard({ t }: { t: Testimonial }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: "relative", zIndex: hovered ? 40 : 1 }}
      className={`flex w-full mb-3.5 ${t.align === "right" ? "justify-end pr-2" : "justify-start pl-2"}`}
    >
      {/* Card wrapper — relative so the tooltip anchors to it */}
      {/* Raise the hovered/tapped card above its neighbours — Safari otherwise
          paints the bubble under the card above (backdrop-filter layers) */}
      <div
        className="relative max-w-[88%] sm:max-w-[82%]"
        style={{ zIndex: hovered ? 40 : 1, transform: "translateZ(0)" }}
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
            style={{ background: "#0052cc", minWidth: "160px", maxWidth: "min(80vw, 340px)" }}
          >
            {/* Avatar circle */}
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 border-2 border-white/40 overflow-hidden text-slate-800 font-bold text-xs font-sans"
            >
              {t.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={encodeURI(t.logo)} alt="" className="h-full w-full bg-white object-contain p-1" />
              ) : (
                <svg className="w-6 h-6 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white font-sans leading-tight">{t.author}</p>
              <p className="text-[11px] text-white/75 font-sans leading-snug">{t.role}</p>
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
          className="rounded-2xl px-4 py-3.5 select-none"
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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // ── Draggable marquee: auto-scrolls upward, pauses on mouse hover, and can
  // be grabbed and flicked (mouse or touch) with momentum, looping endlessly.
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0); // px scrolled; wraps at half the track height
  const velocity = useRef(0); // px/s momentum after a flick
  const pausedRef = useRef(false);
  const drag = useRef<{ id: number; y: number; t: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const AUTO_SPEED = 28; // px/s
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const track = trackRef.current;
      if (track && !drag.current) {
        if (Math.abs(velocity.current) > 5) {
          offset.current += velocity.current * dt;
          velocity.current *= Math.pow(0.04, dt); // friction
        } else {
          velocity.current = 0;
          if (!pausedRef.current && !reduce) offset.current += AUTO_SPEED * dt;
        }
      }
      if (track) {
        const half = track.scrollHeight / 2;
        if (half > 0) offset.current = ((offset.current % half) + half) % half;
        track.style.transform = `translate3d(0, ${-offset.current}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDragStart = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { id: e.pointerId, y: e.clientY, t: performance.now(), moved: false };
    velocity.current = 0;
  };
  const onDragMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.abs(dy) < 6) return;
    if (!d.moved) {
      d.moved = true;
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    const now = performance.now();
    const dt = Math.max((now - d.t) / 1000, 0.001);
    offset.current -= dy;
    // smoothed release velocity (content follows the finger)
    velocity.current = velocity.current * 0.6 + (-dy / dt) * 0.4;
    d.y = e.clientY;
    d.t = now;
  };
  const onDragEnd = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (d.moved) {
      suppressClick.current = true; // a drag isn't a tap on a card
      if (performance.now() - d.t > 80) velocity.current = 0; // held still
      velocity.current = Math.max(-2500, Math.min(2500, velocity.current));
    }
    drag.current = null;
    setIsDragging(false);
  };

  // GSAP entrance for left heading
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, {
        ...HEADING_REVEAL_FROM,
        transformOrigin: "left center",
        force3D: true,
      });
      if (subtextRef.current) {
        gsap.set(subtextRef.current, {
          opacity: 0,
          y: 16,
        });
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 72%",
        once: true,
        onEnter: () => {
          gsap.to(headingRef.current, {
            force3D: true,
            ...HEADING_REVEAL,
          });
          if (subtextRef.current) {
            gsap.to(subtextRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.75,
              delay: 0.25,
              ease: "power2.out",
            });
          }
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-salesx-bg overflow-hidden"
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

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-5 order-1 lg:order-1 text-center lg:text-left pr-0 lg:pr-6">
            <div>
              <h2
                ref={headingRef}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-sans will-change-transform"
              >
                Testimonials
              </h2>
              <div
                ref={subtextRef}
                className="mt-5 text-lg sm:text-xl text-slate-300 font-sans leading-snug space-y-0.5 will-change-transform"
              >
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
            className="lg:col-span-6 order-2 lg:order-2 relative"
            onPointerEnter={(e) => e.pointerType === "mouse" && setIsPaused(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setIsPaused(false)}
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
              {/* Scrolling track — driven by the rAF loop above */}
              <div
                ref={trackRef}
                onPointerDown={onDragStart}
                onPointerMove={onDragMove}
                onPointerUp={onDragEnd}
                onPointerCancel={onDragEnd}
                onClickCapture={(e) => {
                  if (suppressClick.current) {
                    suppressClick.current = false;
                    e.stopPropagation();
                    e.preventDefault();
                  }
                }}
                className={isDragging ? "cursor-grabbing" : "cursor-grab"}
                style={{
                  willChange: "transform",
                  paddingTop: "60px", // room for top tooltip
                  touchAction: "pan-x", // vertical finger drags move the list
                  userSelect: "none",
                }}
              >
                {marqueeItems.map((t, idx) => (
                  <TestimonialCard key={`${t.id}-${idx}`} t={t} />
                ))}
              </div>
            </div>

            {/* Paused badge */}
            {isPaused && !isDragging && (
              <div className="absolute top-4 right-3 z-30 px-2.5 py-1 rounded-full bg-white/8 backdrop-blur-sm border border-white/12 text-[10px] text-white/60 font-sans tracking-wide pointer-events-none">
                ⏸ paused
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
