"use client";

import React, { useState } from "react";

interface ResultCircle {
  id: string;
  position: "top" | "right" | "bottom" | "left";
  value: string;
  lines: string[];
}

export default function SalesXResultsHub() {
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null);

  const circles: ResultCircle[] = [
    {
      id: "top",
      position: "top",
      value: "500+",
      lines: ["Careers", "Launched"],
    },
    {
      id: "right",
      position: "right",
      value: "43%",
      lines: ["Average", "Revenue", "Growth"],
    },
    {
      id: "bottom",
      position: "bottom",
      value: "4.9/5",
      lines: ["Learner", "Rating"],
    },
    {
      id: "left",
      position: "left",
      value: "20+",
      lines: ["Enterprise", "Clients"],
    },
  ];

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden bg-[#07090e] border-t border-blue-950/40">
      {/* Subtle Central Radial Glow matching Image 4 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 bg-blue-700/10 blur-[160px] pointer-events-none -z-10" />

      <div className="w-full max-w-300 mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center">
        {/* Symmetric 5-Circle Composition matching Image 4 */}
        <div className="relative w-full max-w-145 sm:max-w-160 md:max-w-175 aspect-square flex items-center justify-center">
          {/* Central Circle: "Results" */}
          <div className="relative z-10 flex h-44 w-44 sm:h-56 sm:w-56 md:h-64 md:w-64 items-center justify-center rounded-full border border-blue-500/50 bg-[#070b1e]/90 shadow-[0_0_40px_rgba(30,58,138,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-blue-400 hover:shadow-[0_0_50px_rgba(56,189,248,0.4)]">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
              Results
            </h2>
          </div>

          {/* Top Satellite Circle (12 o'clock): 500+ Careers Launched */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center text-center w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border bg-[#07090e] transition-all duration-300 cursor-pointer ${
              hoveredCircle === "top"
                ? "border-[#38bdf8] shadow-[0_0_30px_rgba(56,189,248,0.5)] scale-105"
                : "border-white/30 hover:border-white/70"
            }`}
            onMouseEnter={() => setHoveredCircle("top")}
            onMouseLeave={() => setHoveredCircle(null)}
          >
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight font-sans">
              {circles[0].value}
            </div>
            {circles[0].lines.map((l, i) => (
              <div key={i} className="text-[10px] sm:text-xs text-slate-200 font-sans leading-tight">
                {l}
              </div>
            ))}
          </div>

          {/* Right Satellite Circle (3 o'clock): 43% Average Revenue Growth */}
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center text-center w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border bg-[#07090e] transition-all duration-300 cursor-pointer ${
              hoveredCircle === "right"
                ? "border-[#38bdf8] shadow-[0_0_30px_rgba(56,189,248,0.5)] scale-105"
                : "border-white/30 hover:border-white/70"
            }`}
            onMouseEnter={() => setHoveredCircle("right")}
            onMouseLeave={() => setHoveredCircle(null)}
          >
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight font-sans">
              {circles[1].value}
            </div>
            {circles[1].lines.map((l, i) => (
              <div key={i} className="text-[10px] sm:text-xs text-slate-200 font-sans leading-tight">
                {l}
              </div>
            ))}
          </div>

          {/* Bottom Satellite Circle (6 o'clock): 4.9/5 Learner Rating */}
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center text-center w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border bg-[#07090e] transition-all duration-300 cursor-pointer ${
              hoveredCircle === "bottom"
                ? "border-[#38bdf8] shadow-[0_0_30px_rgba(56,189,248,0.5)] scale-105"
                : "border-white/30 hover:border-white/70"
            }`}
            onMouseEnter={() => setHoveredCircle("bottom")}
            onMouseLeave={() => setHoveredCircle(null)}
          >
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight font-sans">
              {circles[2].value}
            </div>
            {circles[2].lines.map((l, i) => (
              <div key={i} className="text-[10px] sm:text-xs text-slate-200 font-sans leading-tight">
                {l}
              </div>
            ))}
          </div>

          {/* Left Satellite Circle (9 o'clock): 20+ Enterprise Clients */}
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center text-center w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border bg-[#07090e] transition-all duration-300 cursor-pointer ${
              hoveredCircle === "left"
                ? "border-[#38bdf8] shadow-[0_0_30px_rgba(56,189,248,0.5)] scale-105"
                : "border-white/30 hover:border-white/70"
            }`}
            onMouseEnter={() => setHoveredCircle("left")}
            onMouseLeave={() => setHoveredCircle(null)}
          >
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight font-sans">
              {circles[3].value}
            </div>
            {circles[3].lines.map((l, i) => (
              <div key={i} className="text-[10px] sm:text-xs text-slate-200 font-sans leading-tight">
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
