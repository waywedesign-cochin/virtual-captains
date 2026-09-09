"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /**
   * Drop a headshot in public/home/ and put its path here (e.g.
   * "/home/testimonial-david.jpg"). Without one the card falls back to an
   * initials plate, so the layout is identical either way.
   */
  photo?: string;
};

// PLACEHOLDER avatar (public/home/avatar-placeholder.svg) — a generated
// silhouette, not a real photo. Reused across every card below until real
// headshots are supplied; swapping each entry's `photo` to a real file is
// the only change needed later.
const PLACEHOLDER_AVATAR = "/home/avatar-placeholder.svg";

/** PLACEHOLDER COPY — swap for the real quotes, names and roles. */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Our team is having better conversations and moving deals forward with confidence.",
    name: "David John",
    role: "Sales Director, Enterprise",
    photo: PLACEHOLDER_AVATAR,
  },
  {
    quote:
      "The roleplay sessions exposed gaps our old training never touched. Objection handling improved within weeks.",
    name: "Aisha Rahman",
    role: "Head of Revenue, SaaS",
    photo: PLACEHOLDER_AVATAR,
  },
  {
    quote:
      "We finally have a way to audit what good selling actually looks like, instead of guessing at it.",
    name: "Marcus Silva",
    role: "VP Sales Enablement",
    photo: PLACEHOLDER_AVATAR,
  },
  {
    quote:
      "New hires are productive in a third of the time. The rehearsal-first model is the difference.",
    name: "Priya Nair",
    role: "Talent Development Lead",
    photo: PLACEHOLDER_AVATAR,
  },
];

const AUTOPLAY_MS = 5200;

function Stars() {
  return (
    <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-[#e7ff3d]">
          <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * "Our Partners, In Their Own Words" — a stacked testimonial carousel. The
 * active card sits front and centre with its neighbours scaled back behind it;
 * it advances on a timer, and pauses while the pointer is over the stack or
 * the section is off screen.
 */
export default function Endorsement() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  const go = useCallback((direction: number) => {
    setActive(
      (current) =>
        (current + direction + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  }, []);

  // Only advance while the section is actually on screen and nobody is
  // reading a card under the pointer.
  useEffect(() => {
    if (!onScreen || hovered) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [onScreen, hovered, go]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set([eyebrowRef.current, headingRef.current], { opacity: 0, y: 20 });
      gsap.set(stackRef.current, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      })
        .to(
          headingRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.4",
        )
        .to(
          stackRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.45",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-nav-section="Endorsement"
      data-nav-theme="dark"
      className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-[#050608] px-6 py-[clamp(40px,7vh,96px)] text-white sm:px-10 lg:px-16"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[70vh] -translate-y-1/2"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(37,87,214,0.28) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-[1920px] flex-col items-center">
        <span
          ref={eyebrowRef}
          className="mb-[clamp(12px,2.2vh,28px)] block text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 sm:tracking-[0.25em]"
        >
          Our Partners &nbsp;·&nbsp; In Their Own Words
        </span>

        <h2
          ref={headingRef}
          className="max-w-3xl text-center font-serif text-[clamp(1.5rem,1.6vw+1.2vh,2.5rem)] font-normal leading-[1.2]"
        >
          Trusted by teams who <span className="italic text-[#6fa4ff]">sell for a living</span>
        </h2>

        {/* ---------- CARD STACK ---------- */}
        <div
          ref={stackRef}
          className="relative mt-[clamp(24px,4.5vh,64px)] flex w-full max-w-5xl items-center justify-center"
          style={{ height: "clamp(300px, 42vh, 400px)" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {TESTIMONIALS.map((item, i) => {
            // signed shortest offset from the active card, so the stack wraps
            const raw = i - active;
            const half = TESTIMONIALS.length / 2;
            const offset =
              raw > half ? raw - TESTIMONIALS.length : raw < -half ? raw + TESTIMONIALS.length : raw;
            const distance = Math.abs(offset);
            const isActive = offset === 0;

            return (
              <article
                key={item.name}
                aria-hidden={!isActive}
                className="absolute w-[min(92vw,420px)] rounded-2xl border border-white/10 p-6 transition-all duration-700 ease-out sm:p-7"
                style={{
                  // only the immediate neighbours peek out; anything further
                  // back would land on top of them and collide. 0.55 (not
                  // the earlier 0.32) so neighbours read as "next up," not
                  // blocked out.
                  transform: `translateX(${offset * 52}%) scale(${isActive ? 1 : 0.85})`,
                  opacity: distance > 1 ? 0 : isActive ? 1 : 0.55,
                  zIndex: TESTIMONIALS.length - distance,
                  pointerEvents: isActive ? "auto" : "none",
                  background: isActive
                    ? "linear-gradient(160deg, #2557d6 0%, #14337f 60%, #0d2154 100%)"
                    : "linear-gradient(160deg, #16243f 0%, #0d1526 100%)",
                  boxShadow: isActive
                    ? "0 30px 70px -20px rgba(37,87,214,0.55)"
                    : "0 20px 40px -24px rgba(0,0,0,0.8)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 fill-white/25"
                  aria-hidden="true"
                >
                  <path d="M9.5 6C6.5 7.6 4.8 10.2 4.8 13.3c0 2.8 1.7 4.7 4 4.7 2 0 3.5-1.5 3.5-3.5 0-1.9-1.3-3.3-3.1-3.3-.4 0-.8.1-.9.1.3-1.4 1.7-3 3.4-4L9.5 6zm9 0c-3 1.6-4.7 4.2-4.7 7.3 0 2.8 1.7 4.7 4 4.7 2 0 3.5-1.5 3.5-3.5 0-1.9-1.3-3.3-3.1-3.3-.4 0-.8.1-.9.1.3-1.4 1.7-3 3.4-4L18.5 6z" />
                </svg>

                <p className="mt-4 font-serif text-[clamp(1rem,0.6vw+0.7vh,1.25rem)] leading-[1.45] text-white">
                  {item.quote}
                </p>

                <div className="mt-6 flex items-center gap-3.5">
                  {item.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/12 font-serif text-[15px] text-white/80">
                      {item.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="truncate text-[12px] text-white/55">{item.role}</p>
                  </div>
                  <div className="ml-auto">
                    <Stars />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ---------- CONTROLS ---------- */}
        <div className="relative z-10 mt-[clamp(18px,3vh,40px)] flex items-center gap-5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show testimonial from ${item.name}`}
                aria-current={i === active}
                className={`h-2 cursor-pointer rounded-full transition-all duration-500 ${
                  i === active ? "w-6 bg-white" : "w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
