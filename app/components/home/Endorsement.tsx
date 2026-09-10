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

// Default avatar image for testimonials
const PLACEHOLDER_AVATAR = "/home/person.png";

/** Testimonials dataset — 5 cards for the 5-card perspective stack */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Our team is having better conversations and moving deals forward with confidence",
    name: "David John",
    role: "Region",
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
  {
    quote:
      "Consistent pitch execution across distributed teams has been our biggest win this quarter.",
    name: "Elena Rostova",
    role: "Global VP of Sales",
    photo: PLACEHOLDER_AVATAR,
  },
];

const AUTOPLAY_MS = 5200;

function Stars() {
  return (
    <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-white">
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

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActive((prev) => (prev + 1) % TESTIMONIALS.length);
      } else {
        setActive((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      }
    }
    touchStartX.current = null;
  };

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

      if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 0, y: 15 });
      gsap.set(headingRef.current, {
        opacity: 0,
        scale: 0.65,
        y: 20,
        transformOrigin: "center center",
      });
      gsap.set(stackRef.current, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      if (eyebrowRef.current) {
        tl.to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      tl.to(
        headingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          keyframes: [
            { scale: 1.15, opacity: 1, y: -4, duration: 0.42, ease: "power2.out" },
            { scale: 0.94, y: 2, duration: 0.22, ease: "sine.inOut" },
            { scale: 1.0, y: 0, duration: 0.21, ease: "power2.out" },
          ],
        },
        eyebrowRef.current ? "-=0.25" : undefined,
      ).to(
        stackRef.current,
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.3",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-nav-section="Endorsement"
      data-nav-theme="dark"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050608] px-4 py-[clamp(28px,5vh,72px)] text-white sm:px-10 lg:px-16"
    >
      {/* Background Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 flex w-full max-w-[1920px] flex-col items-center">
        {/* ---------- EYEBROW ---------- */}
        <span
          ref={eyebrowRef}
          className="mb-[clamp(12px,2vh,24px)] block text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/50"
        >
          Social Proof &nbsp;·&nbsp; Enterprise &nbsp;·&nbsp; Individual &nbsp;·&nbsp; Global
        </span>

        {/* ---------- HEADING ---------- */}
        <h2
          ref={headingRef}
          className="max-w-2xl text-center font-serif text-[clamp(1.75rem,2.2vw+1.2vh,3rem)] font-normal leading-[1.18] text-white"
        >
          Our Partners, in Their Own Words.
        </h2>

        {/* ---------- CARD STACK ---------- */}
        <div
          ref={stackRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative mt-[clamp(24px,4vh,48px)] flex w-full max-w-5xl items-center justify-center [--fan-1:20%] [--fan-2:38%] sm:[--fan-1:44%] sm:[--fan-2:78%]"
          style={{ height: "clamp(410px, 50vh, 460px)" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {TESTIMONIALS.map((item, i) => {
            // signed shortest offset from the active card, so the stack wraps
            const raw = i - active;
            const half = TESTIMONIALS.length / 2;
            const offset =
              raw > half
                ? raw - TESTIMONIALS.length
                : raw < -half
                  ? raw + TESTIMONIALS.length
                  : raw;
            const distance = Math.abs(offset);
            const isCenter = offset === 0;
            const isNear = distance === 1;
            const isFar = distance === 2;

            // Responsive fanning percentages
            const translateX =
              offset === 0
                ? "0%"
                : offset === 1
                  ? "var(--fan-1)"
                  : offset === 2
                    ? "var(--fan-2)"
                    : offset === -1
                      ? "calc(-1 * var(--fan-1))"
                      : "calc(-1 * var(--fan-2))";

            const scale = isCenter ? 1 : isNear ? 0.88 : isFar ? 0.76 : 0.65;
            // Keep visible cards solid to eliminate see-through ghosting, and fade only at the outer wings
            const opacity = isCenter ? 1 : isNear ? 0.95 : isFar ? 0.52 : 0;
            const zIndex = 30 - distance * 10;
            // Cinematic depth-of-field blur: active card is razor-sharp, background cards are progressively blurred
            const filter = isCenter
              ? "blur(0px) brightness(1)"
              : isNear
                ? "blur(3px) brightness(0.68)"
                : isFar
                  ? "blur(6px) brightness(0.42)"
                  : "blur(10px) brightness(0.2)";

            return (
              <article
                key={item.name}
                aria-hidden={!isCenter}
                onClick={() => setActive(i)}
                className={`absolute flex h-97.5 w-[min(88vw,320px)] sm:h-105 sm:w-87.5 cursor-pointer flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-7 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[transform,opacity,filter]`}
                style={{
                  transform: `translateX(${translateX}) scale(${scale})`,
                  opacity,
                  filter,
                  zIndex,
                  pointerEvents: distance <= 2 ? "auto" : "none",
                  background: isCenter
                    ? "linear-gradient(165deg, #1d62f4 0%, #1653dc 50%, #1142b6 100%)"
                    : isNear
                      ? "linear-gradient(165deg, #0e2b6c 0%, #07173b 100%)"
                      : "linear-gradient(165deg, #081738 0%, #040c20 100%)",
                  boxShadow: isCenter
                    ? "0 24px 60px -12px rgba(29, 98, 244, 0.55)"
                    : isNear
                      ? "0 14px 36px -10px rgba(0, 0, 0, 0.75)"
                      : "0 10px 24px -8px rgba(0, 0, 0, 0.85)",
                  border: isCenter
                    ? "1px solid rgba(255, 255, 255, 0.25)"
                    : isNear
                      ? "1px solid rgba(255, 255, 255, 0.08)"
                      : "1px solid rgba(255, 255, 255, 0.04)",
                }}
              >
                {/* ---------- TOP LEFT: Outline Quote & Copy ---------- */}
                <div className="relative z-10 flex flex-col">
                  {/* Outline double-quote symbol */}
                  <svg
                    viewBox="0 0 44 36"
                    fill="none"
                    className="h-8 w-10 shrink-0 text-white/90"
                    aria-hidden="true"
                  >
                    <path
                      d="M13 16C16.3137 16 19 18.6863 19 22C19 25.3137 16.3137 28 13 28C9.68629 28 7 25.3137 7 22C7 15 12 7 20 4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M32 16C35.3137 16 38 18.6863 38 22C38 25.3137 38 28 32 28C28.6863 28 26 25.3137 26 22C26 15 31 7 39 4"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>

                  <p className={`mt-3.5 max-w-46.25 sm:max-w-51.25 font-serif text-[14px] sm:text-[15.5px] font-normal leading-[1.38] transition-colors duration-500 ${isCenter ? "text-white" : "text-white/70"}`}>
                    {item.quote}
                  </p>
                </div>

                {/* ---------- BOTTOM LEFT: Name, Role & 5 White Stars ---------- */}
                <div className="relative z-10 mt-auto max-w-42.5 pt-3">
                  <h4 className="font-serif text-[17px] sm:text-[18.5px] font-medium text-white tracking-wide">
                    {item.name}
                  </h4>
                  <p className="mt-0.5 text-[12px] text-white/75 font-sans tracking-wide">
                    {item.role}
                  </p>
                  <div className="mt-2">
                    <Stars />
                  </div>
                </div>

                {/* ---------- BOTTOM RIGHT: Cut-out portrait clipped at card bottom ---------- */}
                {item.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.photo}
                    alt={item.name}
                    className={`pointer-events-none absolute -bottom-1 -right-2 h-[80%] max-h-87.5 w-[58%] select-none object-contain object-bottom z-0 transition-opacity duration-500 ${isCenter ? "opacity-100" : "opacity-70"}`}
                  />
                )}
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
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-none stroke-current stroke-2"
            >
              <path
                d="M15 5l-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
                  i === active
                    ? "w-6 bg-white"
                    : "w-2 bg-white/30 hover:bg-white/60"
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
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-none stroke-current stroke-2"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
