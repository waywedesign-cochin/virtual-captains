"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingZoom } from "@/components/about/useHeadingZoom";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MomentSlide {
  id: string;
  tag: string;
  tagStyle: React.CSSProperties;
  description: string;
  punchline: string;
}

const MOMENTS: MomentSlide[] = [
  {
    id: "interview",
    tag: "8:59 am",
    tagStyle: {
      backgroundImage:
        "linear-gradient(90deg, #ff5e14 0%, #ea2e82 35%, #9b37ff 70%, #38bdf8 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    description:
      "A final-year student straightens their collar outside the interview room.",
    punchline: "Selling a future they haven't lived yet.",
  },
  {
    id: "appraisal",
    tag: "20 min",
    tagStyle: {
      backgroundImage:
        "linear-gradient(90deg, #f59e0b 0%, #f43f5e 35%, #a855f7 70%, #38bdf8 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    description:
      "The appraisal meeting. The manager leans back and says, “Tell me why.”",
    punchline: "Selling two years of work in twenty minutes.",
  },
  {
    id: "founder",
    tag: "0 clients",
    tagStyle: {
      backgroundImage:
        "linear-gradient(90deg, #ef4444 0%, #f97316 35%, #f59e0b 70%, #38bdf8 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    description:
      "A founder with a brilliant product and an empty pipeline.",
    punchline: "They built it. Now someone has to believe it.",
  },
  {
    id: "q4",
    tag: "Q4",
    tagStyle: {
      backgroundImage:
        "linear-gradient(90deg, #38bdf8 0%, #6366f1 35%, #a855f7 70%, #ec4899 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    description:
      "A trained sales team that knows the pitch by heart and is still missing target.",
    punchline: "The buyer never read the script.",
  },
];

const HEADING_LINES = ["Is Selling Really", "Only the Job", "of Sales &", "Marketing?"];
const HEADING_WHITE = "#ffffff";
const HEADING_BLUE = "#1d72fe";

export default function SalesXMoments() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingZoom(headingRef);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !sectionRef.current || !stageRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isCompact: "(max-width: 1023px)",
      },
      (context) => {
        const { isDesktop } = context.conditions as {
          isDesktop: boolean;
        };

        // Letter-by-letter white → blue sweep, tied to scroll
        const chars = headingRef.current
          ? Array.from(headingRef.current.querySelectorAll<HTMLElement>("[data-char]"))
          : [];
        gsap.set(chars, { color: HEADING_WHITE });

        if (!isDesktop) {
          gsap.to(chars, {
            color: HEADING_BLUE,
            ease: "none",
            stagger: { each: 0.1 },
            duration: 0.6,
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              end: "bottom 35%",
              scrub: 0.6,
            },
          });
          return;
        }

        const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
        if (slides.length < 4) return;

        // Initialize slides: only slide 0 visible, rest hidden and offset
        slides.forEach((slide, idx) => {
          if (idx === 0) {
            gsap.set(slide, {
              autoAlpha: 1,
              y: 0,
              pointerEvents: "auto",
            });
          } else {
            gsap.set(slide, {
              autoAlpha: 0,
              y: 28,
              pointerEvents: "none",
            });
          }
        });

        // Pinned sequential timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=2600",
            pin: stageRef.current,
            scrub: 0.7,
            anticipatePin: 1,
          },
        });

        // Slide 0 pause
        tl.to({}, { duration: 0.6 });

        // Slide 0 -> Slide 1
        tl.to(slides[0], {
          autoAlpha: 0,
          y: -22,
          pointerEvents: "none",
          duration: 0.45,
          ease: "power2.inOut",
        });
        tl.fromTo(
          slides[1],
          { autoAlpha: 0, y: 28, pointerEvents: "none" },
          {
            autoAlpha: 1,
            y: 0,
            pointerEvents: "auto",
            duration: 0.45,
            ease: "power2.out",
          },
          "<+=0.08",
        );
        tl.to({}, { duration: 0.6 });

        // Slide 1 -> Slide 2
        tl.to(slides[1], {
          autoAlpha: 0,
          y: -22,
          pointerEvents: "none",
          duration: 0.45,
          ease: "power2.inOut",
        });
        tl.fromTo(
          slides[2],
          { autoAlpha: 0, y: 28, pointerEvents: "none" },
          {
            autoAlpha: 1,
            y: 0,
            pointerEvents: "auto",
            duration: 0.45,
            ease: "power2.out",
          },
          "<+=0.08",
        );
        tl.to({}, { duration: 0.6 });

        // Slide 2 -> Slide 3
        tl.to(slides[2], {
          autoAlpha: 0,
          y: -22,
          pointerEvents: "none",
          duration: 0.45,
          ease: "power2.inOut",
        });
        tl.fromTo(
          slides[3],
          { autoAlpha: 0, y: 28, pointerEvents: "none" },
          {
            autoAlpha: 1,
            y: 0,
            pointerEvents: "auto",
            duration: 0.45,
            ease: "power2.out",
          },
          "<+=0.08",
        );
        tl.to({}, { duration: 0.7 });

        // Heading sweep spans the exact length of the slide sequence, so the
        // letters turn blue while the moments change and finish together.
        const total = tl.duration();
        const perChar = 0.35;
        tl.to(
          chars,
          { color: HEADING_BLUE, ease: "none", duration: perChar, stagger: { amount: total - perChar } },
          0,
        );
      },
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full bg-salesx-bg text-white selection:bg-[#38bdf8] selection:text-black overflow-hidden"
      aria-label="Moments that Decide a Career"
    >
      {/* Soft deep blue nebula behind left statement matching reference glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] rounded-full bg-radial from-[#1e40af]/22 via-[#1e1b4b]/08 to-transparent blur-[140px] -z-10"
        aria-hidden="true"
      />

      {/* Organic cosmic star particles */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-40 -z-10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="cosmic-dust-moments"
            x="0"
            y="0"
            width="360"
            height="360"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="24" cy="48" r="0.75" fill="#ffffff" opacity="0.6" />
            <circle cx="88" cy="192" r="1.1" fill="#93c5fd" opacity="0.5" />
            <circle cx="152" cy="74" r="0.6" fill="#ffffff" opacity="0.4" />
            <circle cx="218" cy="140" r="1.2" fill="#ffffff" opacity="0.7" />
            <circle cx="274" cy="42" r="0.8" fill="#38bdf8" opacity="0.5" />
            <circle cx="340" cy="110" r="0.7" fill="#ffffff" opacity="0.6" />
            <circle cx="45" cy="310" r="1.1" fill="#ffffff" opacity="0.5" />
            <circle cx="120" cy="260" r="0.7" fill="#60a5fa" opacity="0.4" />
            <circle cx="185" cy="350" r="1" fill="#ffffff" opacity="0.6" />
            <circle cx="260" cy="290" r="0.6" fill="#ffffff" opacity="0.3" />
            <circle cx="310" cy="345" r="1.3" fill="#ffffff" opacity="0.6" />
            <circle cx="345" cy="240" r="0.8" fill="#93c5fd" opacity="0.5" />
            <circle cx="70" cy="115" r="0.5" fill="#ffffff" opacity="0.3" />
            <circle cx="300" cy="180" r="0.9" fill="#ffffff" opacity="0.5" />
            <circle cx="160" cy="205" r="0.5" fill="#ffffff" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cosmic-dust-moments)" />
      </svg>

      {/* Pinned Stage Container: Perfectly centered on desktop */}
      <div
        ref={stageRef}
        className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-0"
      >
        <div className="w-full max-w-372 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-start">
            
            {/* Left Column: Fixed statement */}
            <div className="flex flex-col items-center justify-start text-center lg:items-start lg:text-left">
              <h2
                ref={headingRef}
                aria-label={HEADING_LINES.join(" ")}
                className="font-sans text-[2.25rem] sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-medium leading-[1.12] tracking-tight"
              >
                {HEADING_LINES.map((line, li) => (
                  <span key={line} aria-hidden="true" className={`block ${li === 0 ? "text-[#1d72fe]" : "text-white"}`}>
                    {line.split(" ").map((word, wi) => (
                      <React.Fragment key={wi}>
                        {wi > 0 && " "}
                        <span className="inline-block whitespace-nowrap">
                          {[...word].map((ch, ci) => (
                            <span key={ci} data-char="">
                              {ch}
                            </span>
                          ))}
                        </span>
                      </React.Fragment>
                    ))}
                  </span>
                ))}
              </h2>

              <p className="text-sm sm:text-[15px] xl:text-base mt-6 sm:mt-8 lg:mt-14 font-sans leading-relaxed text-slate-300 max-w-[340px] sm:max-w-[440px] lg:max-w-[380px] text-justify hyphens-auto [text-align-last:center] lg:[text-align-last:left]">
                Look closely at the moments that decide a career. Almost none of
                them happen in a sales department. All of them are sales.
              </p>
            </div>

            {/* Right Column: Pinned changing story */}
            <div className="relative w-full">
              {/* Desktop: Pinned stacked slides using [grid-area:1/1] top-aligned */}
              <div className="hidden lg:grid [grid-template-columns:1fr] w-full items-start">
                {MOMENTS.map((item, index) => (
                  <div
                    key={item.id}
                    ref={(el) => {
                      slideRefs.current[index] = el;
                    }}
                    className="[grid-area:1/1] flex flex-col justify-start will-change-transform"
                  >
                    {/* Big gradient tag (top aligns with 'Is selling really') */}
                    <div className="font-sans text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] font-normal tracking-tight leading-none">
                      <span style={item.tagStyle} className="inline-block">
                        {item.tag}
                      </span>
                    </div>

                    {/* Story description */}
                    <p className="mt-8 lg:mt-10 font-sans text-2xl lg:text-[2rem] xl:text-[2.25rem] font-medium leading-[1.2] tracking-tight text-white max-w-[440px] text-pretty">
                      {item.description}
                    </p>

                    {/* Punchline */}
                    <p className="mt-6 lg:mt-8 font-sans text-2xl lg:text-[2rem] xl:text-[2.25rem] font-semibold leading-[1.2] tracking-tight text-[#2998ff] max-w-[440px] text-pretty">
                      {item.punchline}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mobile / Tablet: swipeable moment cards */}
              <MomentsCarousel />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* Phones & tablets: a native scroll-snap carousel (one card + peek on phones,
   two per view on tablets). Swipe, or tap a dot to jump. */
function MomentsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // The card whose left edge is nearest the track's left edge is "current".
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const left = track.getBoundingClientRect().left;
    let best = 0;
    let bestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const d = Math.abs(card.getBoundingClientRect().left - left - 16);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    // At the very end the last card can't reach the left edge — count it.
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = MOMENTS.length - 1;
    setActive(best);
  };

  const goTo = (i: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[i];
    if (!track || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: card.offsetLeft - 16, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="lg:hidden mt-2" aria-roledescription="carousel" aria-label="Moments that decide a career">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8"
      >
        {MOMENTS.map((item, i) => (
          <article
            key={`mob-${item.id}`}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${MOMENTS.length}`}
            className={`relative flex w-[84%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border bg-white/[0.03] p-6 backdrop-blur-md transition-[border-color,box-shadow] duration-500 sm:w-[calc(50%-0.5rem)] sm:p-7 ${
              i === active
                ? "border-blue-400/40 shadow-[0_0_40px_rgba(41,152,255,0.18)]"
                : "border-white/10"
            }`}
          >
            {/* soft corner glow in the card's own gradient */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-25 blur-3xl"
              style={{ backgroundImage: item.tagStyle.backgroundImage }}
            />
            <span className="text-xs font-medium tracking-[0.2em] text-white/50">
              {String(i + 1).padStart(2, "0")} / {String(MOMENTS.length).padStart(2, "0")}
            </span>
            <span
              style={item.tagStyle}
              className="mt-4 inline-block text-5xl font-normal leading-none tracking-tight sm:text-6xl"
            >
              {item.tag}
            </span>
            <p className="mt-6 text-lg font-medium leading-[1.3] tracking-tight text-white text-pretty sm:text-xl">
              {item.description}
            </p>
            <div className="mt-auto pt-6">
              <div aria-hidden className="mb-4 h-px w-full bg-linear-to-r from-blue-400/50 to-transparent" />
              <p className="text-lg font-semibold leading-[1.3] tracking-tight text-[#2998ff] text-pretty sm:text-xl">
                {item.punchline}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Progress dots */}
      <div className="mt-6 flex items-center justify-center gap-1">
        {MOMENTS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show moment ${i + 1}: ${m.tag}`}
            aria-current={i === active}
            className="cursor-pointer p-2 focus-visible:outline-2 focus-visible:outline-blue-400"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-8 bg-[#2998ff] shadow-[0_0_10px_rgba(41,152,255,0.8)]" : "w-2 bg-white/30"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
