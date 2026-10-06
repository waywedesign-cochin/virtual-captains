"use client";

import Image from "next/image";
import { useRef } from "react";
import { partner, partnerSlots } from "@/content/site";
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
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" }),
      });
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-8 sm:py-16"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 shadow-[0_0_16px_rgba(56,189,248,0.15)] backdrop-blur-md">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
        <span className="type-eyebrow text-[#38bdf8]">
          Hiring Network
        </span>
      </div>

      <h2
        ref={headingRef}
        className="mt-4 type-h2 font-light text-white"
      >
        {partner.title.join(" ")}
      </h2>

      <h3 className="mx-auto mt-5 max-w-xl type-h3 font-medium text-white">
        {partner.sideHeading}
      </h3>
      <p className="mx-auto mt-3 max-w-xl type-body text-white/70 text-justify hyphens-auto [text-align-last:center]">
        {partner.sideBody}
      </p>

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {partnerSlots.map((slot) => (
          <li
            key={slot.id}
            data-partner-tile=""
            className="relative flex aspect-3/2 items-center justify-center rounded-2xl border border-white/10 bg-white/4 backdrop-blur-xl"
          >
            {slot.image ? (
              <Image
                src={slot.image}
                alt={slot.name}
                fill
                sizes="(max-width: 640px) 45vw, 22vw"
                className="object-contain p-5"
              />
            ) : (
              <span className="font-semibold text-white/80">{slot.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
