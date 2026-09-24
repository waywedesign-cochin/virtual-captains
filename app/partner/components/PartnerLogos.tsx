"use client";

import React from "react";
import Image from "next/image";
import { Handshake } from "./Icons";

interface PartnerItem {
  id: string;
  name: string;
  logoSrc: string;
  width: number;
  height: number;
}

const PARTNER_LOGOS: PartnerItem[] = [
  {
    id: "jsr",
    name: "JSR",
    logoSrc: "/partners/JSR.png",
    width: 140,
    height: 40,
  },
  {
    id: "skylark",
    name: "Skylark",
    logoSrc: "/partners/SKYLARK.png",
    width: 140,
    height: 40,
  },
  {
    id: "ahad",
    name: "AHAD",
    logoSrc: "/partners/AHAD.png",
    width: 130,
    height: 38,
  },
  {
    id: "moonhive",
    name: "MoonHive",
    logoSrc: "/partners/MOONHIV.png",
    width: 140,
    height: 40,
  },
  {
    id: "unifirm",
    name: "Unifirm",
    logoSrc: "/partners/UNIFIRM.png",
    width: 135,
    height: 38,
  },
];

interface MarqueeRowProps {
  items: PartnerItem[];
  direction?: "left" | "right";
  speedSeconds?: number;
}

function MarqueeRow({ items, direction = "left", speedSeconds = 28 }: MarqueeRowProps) {
  // Quadruple loop to guarantee seamless infinite loop without gaps across wide screens
  const looped = [...items, ...items, ...items, ...items];
  const animKey = `partner-marquee-${direction}-${speedSeconds}`;

  return (
    <>
      <style>{`
        @keyframes ${animKey}-L {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ${animKey}-R {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .anim-${animKey} {
          animation: ${direction === "left" ? `${animKey}-L` : `${animKey}-R`} ${speedSeconds}s linear infinite;
        }
        .anim-${animKey}:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative overflow-hidden w-full py-2">
        <div className={`anim-${animKey} flex gap-4 sm:gap-6 w-max will-change-transform`}>
          {looped.map((partner, idx) => (
            <div
              key={`${partner.id}-${idx}`}
              className="group relative shrink-0 h-17 sm:h-20 w-35 xs:w-[155px] sm:w-46.25 rounded-2xl
                bg-slate-900/50 backdrop-blur-xl border border-white/12 hover:border-[#38bdf8]/50
                flex items-center justify-center px-4 sm:px-6 overflow-hidden
                shadow-[0_8px_30px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.15)]
                transition-all duration-300 hover:scale-103 hover:bg-slate-900/80 cursor-default"
            >
              {/* Subtle inner hover glow */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#38bdf8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <Image
                src={partner.logoSrc}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="max-h-7 sm:max-h-8 w-auto object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.7)] pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function PartnerLogos() {
  return (
    <section className="relative w-full bg-[#040507] py-14 sm:py-20 md:py-24 overflow-hidden border-t border-white/10 select-none">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 sm:w-225 h-87.5 bg-linear-to-r from-[#1d4ed8]/10 via-[#38bdf8]/10 to-[#1d4ed8]/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mb-8 sm:mb-12">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563eb]/15 border border-[#38bdf8]/35 backdrop-blur-md mb-3 text-[#38bdf8] text-[9.5px] sm:text-[10px] font-black uppercase tracking-widest shadow-md">
          <Handshake className="w-3 h-3 text-[#38bdf8]" />
          <span>JOIN OUR GROWING ECOSYSTEM</span>
        </div>

        {/* Section Heading */}
        <h2 className="font-sans font-black text-2xl xs:text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight uppercase">
          Trusted by Forward-Thinking{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-[#38bdf8]">
            Organizations
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-3 max-w-xl text-slate-300 text-xs sm:text-sm font-normal leading-relaxed px-2">
          From premier universities and vocational hubs to rapid-scaling corporate enterprises, our network creates unfair revenue and hiring advantages.
        </p>
      </div>

      {/* Marquee Container with edge fading masks */}
      <div className="relative w-full overflow-hidden flex flex-col gap-3 sm:gap-4">
        {/* Left & Right gradient fade masks */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-36 md:w-56 z-20 bg-linear-to-r from-[#040507] via-[#040507]/90 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-36 md:w-56 z-20 bg-linear-to-l from-[#040507] via-[#040507]/90 to-transparent"
        />

        {/* Row 1: Scrolling Left */}
        <MarqueeRow items={PARTNER_LOGOS} direction="left" speedSeconds={28} />

        {/* Row 2: Scrolling Right */}
        <MarqueeRow items={PARTNER_LOGOS} direction="right" speedSeconds={34} />
      </div>
    </section>
  );
}
