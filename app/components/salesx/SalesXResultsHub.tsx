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
    <section
      role="region"
      aria-label="Quantified SalesX Outcomes and Results Hub"
      className="relative py-20 sm:py-24 lg:py-28 overflow-hidden bg-[#030612]"
    >
      {/* ── Deep blue radial gradient background ── */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, #0d1f6e 0%, #070d3a 40%, #030612 72%)",
        }}
      />

      {/* Subtle Constellation Grid Background matching cosmic continuum */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(147, 197, 253, 0.35) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Extra soft bloom centred on the orbit */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle at center, rgba(30,64,175,0.35) 0%, transparent 65%)",
          filter: "blur(56px)",
        }}
      />

      {/* ── Orbit composition ── */}
      <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center">
        {/* Outer wrapper: aspect-square, px-10 on mobile prevents satellites bleeding off screen */}
        <div className="relative w-full max-w-75 sm:max-w-100 md:max-w-115 lg:max-w-130 aspect-square flex items-center justify-center">
          {/* Subtle orbit ring outline behind everything */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: "1px dashed rgba(147,197,253,0.14)",
            }}
          />

          {/* ── Blue glow behind the center circle ── */}
          {/* Outer wide bloom */}
          <div
            className="absolute z-0 rounded-full pointer-events-none"
            style={{
              width: "55%",
              height: "55%",
              background:
                "radial-gradient(circle at center, rgba(37,99,235,0.55) 0%, rgba(29,78,216,0.3) 40%, transparent 70%)",
              filter: "blur(28px)",
            }}
          />
          {/* Tight inner bright core */}
          <div
            className="absolute z-0 rounded-full pointer-events-none"
            style={{
              width: "28%",
              height: "28%",
              background:
                "radial-gradient(circle at center, rgba(96,165,250,0.7) 0%, rgba(59,130,246,0.4) 50%, transparent 80%)",
              filter: "blur(12px)",
            }}
          />

          {/* ── Central Circle: Results ── */}
          <div className="relative z-10 flex h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 items-center justify-center rounded-full border border-blue-500/50 bg-[#070b1e]/90 shadow-[0_0_40px_rgba(30,58,138,0.4)] backdrop-blur-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-sans">
              Results
            </h2>
          </div>

          {/* ── Rotating ring that carries the 4 satellite circles ──
               The ring itself is invisible; only the satellites are visible.
               Each satellite counter-rotates so its text stays upright. ── */}
          <div
            className="absolute inset-0"
            style={{ animation: "orbit-ring 18s linear infinite" }}
          >
            {/* TOP (12 o'clock) */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
              style={{ animation: "counter-rotate 18s linear infinite" }}
            >
              <div
                className={`flex flex-col items-center justify-center text-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border bg-[#07090e]/90 backdrop-blur-sm transition-colors duration-300 cursor-pointer ${
                  hoveredCircle === "top"
                    ? "border-[#38bdf8] shadow-[0_0_24px_rgba(56,189,248,0.5)]"
                    : "border-white/30"
                }`}
                onMouseEnter={() => setHoveredCircle("top")}
                onMouseLeave={() => setHoveredCircle(null)}
              >
                <div className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight font-sans">
                  {circles[0].value}
                </div>
                {circles[0].lines.map((l, i) => (
                  <div
                    key={i}
                    className="text-[9px] sm:text-[10px] md:text-xs text-slate-300 font-sans leading-tight"
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT (3 o'clock) */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20"
              style={{ animation: "counter-rotate 18s linear infinite" }}
            >
              <div
                className={`flex flex-col items-center justify-center text-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border bg-[#07090e]/90 backdrop-blur-sm transition-colors duration-300 cursor-pointer ${
                  hoveredCircle === "right"
                    ? "border-[#38bdf8] shadow-[0_0_24px_rgba(56,189,248,0.5)]"
                    : "border-white/30"
                }`}
                onMouseEnter={() => setHoveredCircle("right")}
                onMouseLeave={() => setHoveredCircle(null)}
              >
                <div className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight font-sans">
                  {circles[1].value}
                </div>
                {circles[1].lines.map((l, i) => (
                  <div
                    key={i}
                    className="text-[9px] sm:text-[10px] md:text-xs text-slate-300 font-sans leading-tight"
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM (6 o'clock) */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20"
              style={{ animation: "counter-rotate 18s linear infinite" }}
            >
              <div
                className={`flex flex-col items-center justify-center text-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border bg-[#07090e]/90 backdrop-blur-sm transition-colors duration-300 cursor-pointer ${
                  hoveredCircle === "bottom"
                    ? "border-[#38bdf8] shadow-[0_0_24px_rgba(56,189,248,0.5)]"
                    : "border-white/30"
                }`}
                onMouseEnter={() => setHoveredCircle("bottom")}
                onMouseLeave={() => setHoveredCircle(null)}
              >
                <div className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight font-sans">
                  {circles[2].value}
                </div>
                {circles[2].lines.map((l, i) => (
                  <div
                    key={i}
                    className="text-[9px] sm:text-[10px] md:text-xs text-slate-300 font-sans leading-tight"
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>

            {/* LEFT (9 o'clock) */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20"
              style={{ animation: "counter-rotate 18s linear infinite" }}
            >
              <div
                className={`flex flex-col items-center justify-center text-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border bg-[#07090e]/90 backdrop-blur-sm transition-colors duration-300 cursor-pointer ${
                  hoveredCircle === "left"
                    ? "border-[#38bdf8] shadow-[0_0_24px_rgba(56,189,248,0.5)]"
                    : "border-white/30"
                }`}
                onMouseEnter={() => setHoveredCircle("left")}
                onMouseLeave={() => setHoveredCircle(null)}
              >
                <div className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight font-sans">
                  {circles[3].value}
                </div>
                {circles[3].lines.map((l, i) => (
                  <div
                    key={i}
                    className="text-[9px] sm:text-[10px] md:text-xs text-slate-300 font-sans leading-tight"
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbit-ring {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes counter-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </section>
  );
}
