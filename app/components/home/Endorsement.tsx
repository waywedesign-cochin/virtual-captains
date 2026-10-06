"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DottedBackground from "./DottedBackground";
import { NO_PIN_QUERY, PIN_QUERY } from "./pinQuery";

import {
  HEADING_REVEAL,
  HEADING_REVEAL_FROM,
} from "@/lib/animations/headingReveal";
gsap.registerPlugin(ScrollTrigger);

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Company logo (public/partners/) shown in the avatar circle */
  logo?: string;
  /** "cover" for logos on a solid square background, else "contain" */
  logoFit?: "contain" | "cover";
  /** Optional headshot (public/home/) — takes the circle over the logo */
  photo?: string;
};

/** "Aisha Rahman" → "AR" for the avatar circle. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

/** Client testimonials for the perspective card stack */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We had an excellent experience working with Virtual Captains for our lead generation initiatives. Their team quickly understood our goals, refined our targeting strategy, and helped us build a consistent flow of qualified leads.",
    name: "MoonHive",
    role: "Lead Generation Client",
    logo: "/partners/MOONHIV.png",
  },
  {
    quote:
      "I have had the distinct pleasure of working closely with Roshna since 2021 till 2024 at ThoughtBox. Reporting directly to me as Founder & Managing Director, Roshna was a central pillar of our leadership, managing both Operations and Finance while serving as a key architect of our organizational strategy.",
    name: "Rijaz Sulaiman",
    role: "Founder & Managing Director @ ThoughtBox Online Services Pvt Ltd",
    logo: "/partners/thoughtbox.jpeg",
  },
  {
    quote:
      "Roshna Saffar provided helpful guidance during our sales training. Her practical approach and focus on key strategies contributed to improving our sales skills. I appreciate the insights she shared, which were beneficial in refining our approach to sales. All the best to her and her company in their future endeavors.",
    name: "Anil P",
    role: "Co-Founder & Civil Engineer at KLBUILD Contractors LLP",
    logo: "/partners/klbuild.jpeg",
    logoFit: "cover",
  },
  {
    quote:
      "I highly recommend Roshna Saffar for the position of Sales Strategist. Her innovative strategies and proven track record in driving sales growth make recommended for this role.",
    name: "Vismaya Biju",
    role: "Director & Co-Founder @ Southern Sages Pvt Ltd",
    logo: "/partners/southern-sages.jpeg",
  },
];

const AUTOPLAY_MS = 5200;

function Stars() {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-3.5 w-3.5 fill-white"
        >
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
        setActive(
          (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
        );
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
  // reading a card under the pointer. Restarting on every `active` change
  // gives each card its full time after a tap/swipe — a free-running interval
  // could fire right after a manual change and skip a card. On pinned
  // desktop layouts the scroll position drives the cards, so no autoplay.
  useEffect(() => {
    if (!onScreen || hovered) return;
    if (window.matchMedia(PIN_QUERY).matches) return;
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [onScreen, hovered, go, active]);

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
      const mm = gsap.matchMedia();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      if (eyebrowRef.current)
        gsap.set(eyebrowRef.current, { opacity: 0, y: 15 });
      gsap.set(headingRef.current, {
        ...HEADING_REVEAL_FROM,
        transformOrigin: "center center",
      });
      gsap.set(stackRef.current, { opacity: 0, y: 40 });

      // Entrance animation for header & stack
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      if (eyebrowRef.current) {
        entranceTl.to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      entranceTl
        .to(
          headingRef.current,
          {
            ...HEADING_REVEAL,
          },
          eyebrowRef.current ? "-=0.25" : undefined,
        )
        .to(
          stackRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.3",
        );

      // Desktop: Pinned testimonial scrub — no curtain exit
      mm.add(PIN_QUERY, () => {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            id: "endorsement-pin",
            trigger: sectionRef.current,
            start: "top top",
            end: () =>
              "+=" +
              (typeof window !== "undefined" ? window.innerHeight : 900) * 2.2,
            pin: true,
            anticipatePin: 1,
            scrub: 0.6,
            onUpdate: (self) => {
              const p = self.progress;
              const cardIndex = Math.min(
                TESTIMONIALS.length - 1,
                Math.floor(p * TESTIMONIALS.length),
              );
              setActive(cardIndex);
            },
          },
        });

        // Give room to scrub testimonials
        pinTl.to({}, { duration: 2.5 });

        return () => pinTl.kill();
      });

      mm.add(NO_PIN_QUERY, () => {
        gsap.set(sectionRef.current, { clearProps: "transform" });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="endorsement"
      data-nav-section="Endorsement"
      data-nav-theme="dark"
      className="relative z-10 flex min-h-0 pin:min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-10 sm:py-14 pin:pt-[clamp(68px,12vh,152px)] pin:[@media(max-height:540px)]:pt-14 pin:[@media(max-height:540px)]:pb-3 pin:pb-[clamp(28px,5vh,72px)] text-white sm:px-10 pin:px-16"
      style={{
        background:
          "linear-gradient(180deg, #0c318f 0%, #051d5c 40%, #050b24 75%, #040507 100%)",
      }}
    >
      {/* Background Dot Grid (matching second section) */}
      <DottedBackground theme="dark" />

      <div className="relative z-10 flex w-full max-w-[1920px] flex-col items-center">
        {/* ---------- EYEBROW ---------- */}
        <span
          ref={eyebrowRef}
          className="mb-[clamp(12px,2vh,24px)] block text-center font-sans text-[10px] uppercase tracking-[0.25em] text-white/50"
        >
          <span className="whitespace-nowrap">Social Proof · Enterprise</span>{" "}
          <span className="whitespace-nowrap">· Individual · Global</span>
        </span>

        {/* ---------- HEADING ---------- */}
        <h2
          ref={headingRef}
          className="max-w-2xl text-center font-sans text-[clamp(1.75rem,2.2vw+1.2vh,3rem)] font-normal leading-[1.18] text-white"
        >
          Our Partners & Clients
        </h2>

        {/* Stack + controls shrink together on short pinned desktops (the
            section is locked to one screen there, so it must fit 480px+) */}
        <div className="flex w-full flex-col items-center pin:[@media(max-height:640px)]:[zoom:0.85] pin:[@media(max-height:540px)]:[zoom:0.72]">
          {/* ---------- CARD STACK ---------- */}
          <div
            ref={stackRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative mt-[clamp(24px,4vh,48px)] flex w-full max-w-5xl touch-pan-y items-center justify-center [--fan-1:20%] [--fan-2:38%] sm:[--fan-1:40%] sm:[--fan-2:74%]"
            style={{ height: "clamp(400px, 50vh, 440px)" }}
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
                  className={`absolute flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-5 sm:p-5.5 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[transform,opacity,filter]`}
                  style={{
                    // Fixed card size set inline so it can never fall back to
                    // stretching across the stack
                    width: "min(84vw, 320px)",
                    height: "400px",
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
                      className="h-6.5 w-8 shrink-0 text-white/90"
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

                    <p
                      className={`mt-3 font-sans text-[13px] sm:text-[14px] font-normal leading-[1.45] text-justify hyphens-auto transition-colors duration-500 ${isCenter ? "text-white" : "text-white/70"}`}
                    >
                      {item.quote}
                    </p>
                  </div>

                  {/* ---------- BOTTOM LEFT: Name, Role & 5 White Stars ---------- */}
                  <div className="relative z-10 mt-auto flex items-center gap-3 pt-2">
                    {/* Avatar: headshot if one is set, otherwise an initials circle */}
                    <span
                      aria-hidden="true"
                      className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full p-[1.5px] sm:h-13 sm:w-13 ${
                        isCenter
                          ? "bg-linear-to-br from-[#F3FC00] to-[#D08817]"
                          : "bg-white/25"
                      }`}
                    >
                      {item.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.photo}
                          alt=""
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : item.logo ? (
                        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.logo}
                            alt=""
                            className={
                              item.logoFit === "cover"
                                ? "h-full w-full object-cover"
                                : "h-[72%] w-[72%] object-contain"
                            }
                          />
                        </span>
                      ) : (
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-[#0b2a73] font-sans text-[15px] font-semibold tracking-wide text-white">
                          {initials(item.name)}
                        </span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-sans text-[15.5px] sm:text-[17px] font-medium text-white tracking-wide">
                        {item.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] sm:text-[12px] leading-snug text-white/75 font-sans tracking-wide">
                        {item.role}
                      </p>
                      <div className="mt-1.5">
                        <Stars />
                      </div>
                    </div>
                  </div>

                </article>
              );
            })}
          </div>

          {/* ---------- CONTROLS ---------- */}
          <div className="relative z-10 mt-[clamp(18px,3vh,40px)] flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:h-9 sm:w-9"
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

            {/* The visible pill stays 8px tall; the button around it is a 24×24px
              hit area (WCAG 2.5.8 minimum) so the dots are tappable */}
            <div className="flex items-center">
              {TESTIMONIALS.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show testimonial from ${item.name}`}
                  aria-current={i === active}
                  className="group flex h-6 min-w-6 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-500 ${
                      i === active
                        ? "w-6 bg-white"
                        : "w-2 bg-white/30 group-hover:bg-white/60"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:h-9 sm:w-9"
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
      </div>
    </section>
  );
}
