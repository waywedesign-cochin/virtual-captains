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

/** "Aisha Rahman" → "AR" for avatars without a logo. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/**
 * Chat-message testimonial: the client's logo sits beside the card like a
 * chat avatar, with a sender line (name · role · stars) above the quote —
 * always visible, no hover needed. Cards alternate sides like a conversation.
 */
function TestimonialCard({ t }: { t: Testimonial }) {
  const right = t.align === "right";
  return (
    <div className={`mb-5 flex w-full ${right ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[94%] items-end gap-2.5 sm:max-w-[86%] sm:gap-3 ${right ? "flex-row-reverse" : ""}`}
      >
        {/* Avatar */}
        <div className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/25 bg-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] sm:h-10 sm:w-10">
          {t.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={encodeURI(t.logo)}
              alt=""
              draggable={false}
              className="h-[78%] w-[78%] object-contain"
            />
          ) : (
            <span className="font-sans text-[11px] font-bold text-[#0a1236]">
              {initials(t.author)}
            </span>
          )}
        </div>

        <div className={`flex min-w-0 flex-col ${right ? "items-end" : "items-start"}`}>
          {/* Sender line */}
          <div
            className={`mb-1.5 flex max-w-full flex-wrap items-center gap-x-2 gap-y-0.5 px-1 ${right ? "justify-end text-right" : ""}`}
          >
            <span className="font-sans text-[13px] font-semibold text-white sm:text-sm">
              {t.author}
            </span>
            <span className="font-sans text-[11px] text-slate-400 sm:text-xs">{t.role}</span>
            <span
              role="img"
              aria-label={`${t.rating} out of 5 stars`}
              className="text-[11px] tracking-[1px] text-[#F3FC00]"
            >
              {"★".repeat(t.rating)}
            </span>
          </div>

          {/* Quote bubble — the corner nearest the avatar is squared off */}
          <div
            className={`rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,rgba(8,13,38,0.6)_50%,rgba(6,9,26,0.72)_100%)] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl transition-colors duration-300 hover:border-[#38bdf8]/40 ${right ? "rounded-br-md" : "rounded-bl-md"}`}
          >
            <p className="select-none font-sans text-xs leading-relaxed text-slate-200 sm:text-sm">
              {t.quote}
            </p>
          </div>
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

      <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-24">
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
            {/* Mask fade top + bottom */}
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
