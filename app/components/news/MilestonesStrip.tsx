"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Milestone } from "@/app/content/milestones";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]";

const ARROW = `grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 text-white transition hover:border-white hover:bg-white hover:text-black ${FOCUS_RING}`;

/**
 * Horizontal timeline: dot + year on a hairline, title and place below.
 * Scrolls sideways (swipe or the arrow buttons) when it doesn't fit.
 */
export function MilestonesStrip({ milestones }: { milestones: Milestone[] }) {
  const trackRef = useRef<HTMLOListElement>(null);
  const scroll = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({
      left: dir * trackRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });

  return (
    <div className="flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-start lg:gap-10">
      <div className="flex shrink-0 items-center gap-4 lg:w-48 lg:pt-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-white sm:text-sm">
          Milestones
        </h2>
      </div>

      <ol
        ref={trackRef}
        className="flex min-w-0 flex-1 snap-x snap-mandatory gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {milestones.map((m, i) => (
          <li
            key={`${m.year}-${m.title}-${i}`}
            className="w-[75%] shrink-0 snap-start pr-6 sm:w-1/2 lg:w-1/3"
          >
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#38bdf8] shadow-[0_0_12px_#38bdf8]" />
              <span className="text-base font-semibold text-white">
                {m.year}
              </span>
              <span className="h-px flex-1 bg-white/12" />
            </div>
            <p className="mt-3 pl-5 text-sm leading-relaxed text-white/75">
              {m.title}
              {m.place && (
                <span className="block text-white/45">{m.place}</span>
              )}
            </p>
          </li>
        ))}
      </ol>

      {milestones.length > 3 && (
        <div className="flex shrink-0 gap-2 self-center lg:self-start">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous milestones"
            className={ARROW}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next milestones"
            className={ARROW}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
