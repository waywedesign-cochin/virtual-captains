"use client";

import { useRef } from "react";
import { partner, partnerSlots } from "@/content/site";
import { logoHeight } from "@/app/content/partners";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/animations/gsap";
import { useHeadingZoom } from "@/components/about/useHeadingZoom";

/**
 * Partner Network for phones & tablets (< 1024px).
 *
 * The desktop version is a percentage-positioned, scroll-pinned stage that
 * only composes at desktop proportions. Here it becomes an ordinary section:
 * centred intro, then the logos in a tidy grid that rises in as it scrolls
 * into view — no pinning, nothing to collide, fine in any orientation.
 */
export function PartnerNetworkCompact() {
  const scope = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingZoom(headingRef);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tiles = gsap.utils.toArray<HTMLElement>("[data-partner-tile]");
      gsap.set(tiles, { opacity: 0, y: 24 });
      ScrollTrigger.batch(tiles, {
        start: "top 92%",
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power3.out" }),
      });
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="mx-auto w-full max-w-372 px-4 py-12 text-center sm:px-8 sm:py-16"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 shadow-[0_0_16px_rgba(56,189,248,0.15)] backdrop-blur-md">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
        <span className="type-eyebrow text-[#38bdf8]">
          Hiring Network
        </span>
      </div>

      <h2
        ref={headingRef}
        className="mt-4 type-h2 font-medium text-white"
      >
        {partner.title.join(" ")}
      </h2>

      <h3 className="mx-auto mt-5 max-w-xl type-h3 font-medium text-white">
        {partner.sideHeading}
      </h3>
      <p className="mx-auto mt-3 max-w-xl type-body text-white/70 text-justify hyphens-auto [text-align-last:center]">
        {partner.sideBody}
      </p>

      <ul className="mt-10 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-6">
        {partnerSlots.map((slot) => (
          <li
            key={slot.id}
            data-partner-tile=""
            className="relative flex h-14 items-center justify-center rounded-xl px-3 py-3 sm:h-16 border border-white/10 bg-white/4 backdrop-blur-xl"
          >
            {slot.image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={slot.image}
                    alt={slot.name}
                    loading="lazy"
                    draggable={false}
                    style={{ height: `${logoHeight(slot.ratio ?? 2)}%` }}
                    className="w-auto max-w-full object-contain opacity-80 brightness-0 invert"
                  />
              </>
            ) : (
              <span className="font-semibold text-white/80">{slot.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
