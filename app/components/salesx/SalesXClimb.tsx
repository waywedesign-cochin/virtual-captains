"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useHeadingZoom } from "@/components/about/useHeadingZoom";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ----------------------------- DATA ----------------------------- */

type Level = {
  id: string;
  tab: string;
  label: string;
  range: string;
  title: string;
  modules: { no: string; title: string }[];
};

const LEVELS: Level[] = [
  {
    id: "basic",
    tab: "Basic",
    label: "Level 1",
    range: "Modules 1–3",
    title: "Find Your Voice.",
    modules: [
      { no: "01", title: "Beating stage fear" },
      { no: "02", title: "The self-introduction" },
      { no: "03", title: "Cold calling" },
    ],
  },
  {
    id: "intermediate",
    tab: "Intermediate",
    label: "Level 2",
    range: "Modules 4–7",
    title: "Win the Conversation.",
    modules: [
      { no: "04", title: "Discovery" },
      { no: "05", title: "Objection handling" },
      { no: "06", title: "Multi-channel outreach" },
      { no: "07", title: "Follow-up styles" },
    ],
  },
  {
    id: "expert",
    tab: "Expert",
    label: "Level 3",
    range: "Modules 8–10",
    title: "Close the Deal.",
    modules: [
      { no: "08", title: "Negotiation" },
      { no: "09", title: "Closing" },
      { no: "10", title: "Full-cycle capstone" },
    ],
  },
];

/* Bar heights climb left → right, like steps. */
const BAR_HEIGHTS = ["h-[45%]", "h-[70%]", "h-full"];

/* Auto-climb loop timing (ms): each bar fills quickly, holds just long enough for a
   quick read, then the next one starts. After Expert every bar drains and the
   climb begins again from Basic. */
const FILL_MS = 900;
const HOLD_MS = 1700;
const DRAIN_MS = 500;
const REST_MS = 300;

/* --------------------------- COMPONENT --------------------------- */

export default function SalesXClimb() {
  const [active, setActive] = useState(0);
  // true while every bar drains between loops (content stays on Expert)
  const [draining, setDraining] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const level = LEVELS[active];

  useHeadingZoom(headingRef);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Drive the loop. Re-runs on every step, so a click simply restarts the
  // countdown from the chosen level. Pauses off-screen and while hovered /
  // focused so people can read at their own pace.
  useEffect(() => {
    if (!inView || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const last = LEVELS.length - 1;
    let t: number;
    if (draining) {
      t = window.setTimeout(() => {
        setDraining(false);
        setActive(0);
      }, DRAIN_MS + REST_MS);
    } else if (active === last) {
      t = window.setTimeout(() => setDraining(true), FILL_MS + HOLD_MS);
    } else {
      t = window.setTimeout(() => setActive(active + 1), FILL_MS + HOLD_MS);
    }
    return () => window.clearTimeout(t);
  }, [active, draining, inView, paused]);

  const selectLevel = (i: number) => {
    setDraining(false);
    setActive(i);
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, { opacity: 0, y: 40 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(cardRef.current, { opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: "power3.out" });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Arrow-key navigation across the tablist (WAI-ARIA tabs pattern). */
  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const last = LEVELS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    selectLevel(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="salesx-climb-heading"
      className="relative w-full overflow-hidden bg-salesx-bg px-4 py-14 text-white sm:px-8 sm:py-24 lg:py-28"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400 sm:text-sm">
            The Climb · 10 Modules · 3 Levels
          </p>
          <h2
            id="salesx-climb-heading"
            ref={headingRef}
            className="mx-auto mt-4 max-w-3xl text-3xl font-medium leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            From Your First Hello to Your Hardest Close.
          </h2>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="relative mt-10 rounded-2xl border border-blue-500/25 bg-white/[0.02] p-5 shadow-[0_0_60px_rgba(30,64,175,0.15)] backdrop-blur-md sm:mt-14 sm:rounded-3xl sm:p-8 lg:p-10"
        >
          <p className="text-center text-xs text-blue-400 sm:text-sm md:absolute md:right-8 md:top-6 md:text-right lg:right-10">
            {level.range}
          </p>

          <div className="mt-2 grid grid-cols-1 items-center gap-8 sm:mt-4 md:grid-cols-[1fr_auto_1fr] md:gap-10">
            {/* Title — re-keyed so it animates on each level change */}
            <div
              key={`title-${level.id}`}
              id={`climb-panel-${level.id}`}
              role="tabpanel"
              aria-labelledby={`climb-tab-${level.id}`}
              className="vc-climb-in text-center md:text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80 sm:text-sm">
                {level.label} · <span className="text-violet-400">{level.tab}</span>
              </p>
              <h3 className="mt-3 text-3xl font-normal leading-tight text-white sm:text-4xl lg:text-5xl">
                {level.title}
              </h3>
            </div>

            {/* Level bars = the tabs */}
            <div className="flex flex-col items-center">
              <div
                role="tablist"
                aria-label="Course levels"
                className="flex h-32 items-end gap-5 sm:h-36 sm:gap-7"
              >
                {LEVELS.map((l, i) => {
                  const selected = i === active;
                  const filled = !draining && i <= active;
                  return (
                    <button
                      key={l.id}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      id={`climb-tab-${l.id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={`climb-panel-${l.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => selectLevel(i)}
                      onKeyDown={onTabKeyDown}
                      className={`group relative w-11 cursor-pointer overflow-hidden rounded-t-2xl rounded-b-md border transition-[border-color,box-shadow] duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 sm:w-12 ${BAR_HEIGHTS[i]} ${
                        selected && !draining
                          ? "border-blue-400/60 shadow-[0_0_28px_rgba(59,130,246,0.55)]"
                          : "border-cyan-400/50 hover:border-cyan-300 hover:bg-cyan-400/10"
                      }`}
                    >
                      {/* Liquid fill: rises from the bottom, drains on reset */}
                      <span
                        aria-hidden
                        className="absolute inset-0 origin-bottom bg-gradient-to-b from-indigo-500 to-blue-400 will-change-transform motion-reduce:transition-none!"
                        style={{
                          transform: `scaleY(${filled ? 1 : 0})`,
                          transition: filled
                            ? `transform ${FILL_MS}ms cubic-bezier(0.45, 0, 0.25, 1)`
                            : `transform ${DRAIN_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                        }}
                      />
                      <span className="sr-only">
                        {l.label}: {l.tab}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div aria-hidden className="mt-3 flex gap-5 sm:gap-7">
                {LEVELS.map((l, i) => (
                  <span
                    key={l.id}
                    className={`w-11 text-center text-[10px] transition-colors duration-300 sm:w-12 sm:text-xs ${
                      i === active && !draining ? "text-blue-400" : "text-white/70"
                    }`}
                  >
                    {l.tab}
                  </span>
                ))}
              </div>
            </div>

            {/* Module list */}
            <ul
              key={`list-${level.id}`}
              className="vc-climb-in mx-auto flex w-fit max-w-xs flex-col gap-2.5 md:mx-0 md:w-full md:justify-self-end"
              style={{ animationDelay: "80ms" }}
            >
              {level.modules.map((m) => (
                <li key={m.no} className="flex items-center gap-3 text-sm text-white/90 sm:text-base">
                  <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime-300/80" />
                  <span>
                    <span className="sr-only">Module {m.no}: </span>
                    {m.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-sm text-white/60 sm:text-base text-justify hyphens-auto [text-align-last:center]">
          Every level ends in a live simulation. You don&apos;t move up until you&apos;ve proved it.
        </p>
      </div>
    </section>
  );
}
