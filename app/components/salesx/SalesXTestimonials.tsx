"use client";

import React, { useState } from "react";

export default function SalesXTestimonials() {
  const [activeBubble, setActiveBubble] = useState<number>(0);

  const bubbles = [
    {
      id: 0,
      text: "“Boosted my confidence and helped me close more deals.”",
      align: "left",
      isHighlighted: true,
    },
    {
      id: 1,
      text: "“Practical training that actually works in real conversations.”",
      align: "right",
      isHighlighted: false,
    },
    {
      id: 2,
      text: "“Our team improved significantly in handling objections.”",
      align: "left",
      isHighlighted: false,
    },
  ];

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden bg-[#07090e] border-t border-blue-950/40">
      {/* Subtle Starfield / Grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.25) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="w-full max-w-325 mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative">
          {/* Left Column: Heading and Subtitle matching Image 5 */}
          <div className="lg:col-span-5 text-left pr-0 lg:pr-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-sans">
              Testimonials
            </h2>
            <div className="mt-6 text-xl sm:text-2xl text-slate-200 font-sans leading-snug">
              <div>Tested by Sellers</div>
              <div>Endorsed by Execs</div>
            </div>
          </div>

          {/* Thin Vertical Center Divider Line matching Image 5 */}
          <div className="hidden lg:block absolute left-[42%] top-0 bottom-0 w-px bg-linear-to-b from-transparent via-blue-500/25 to-transparent" />

          {/* Right Column: Conversational Chat Bubble Layout matching Image 5 */}
          <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-5 pl-0 lg:pl-10">
            {/* Top Avatar Speech Bubble: Arjun M ★★★★★ (Royal Blue with tail) */}
            <div className="flex justify-end pr-2 sm:pr-8">
              <div className="relative inline-flex items-center gap-3 rounded-2xl bg-[#0052cc] px-4 py-2.5 shadow-[0_10px_25px_rgba(0,82,204,0.4)]">
                {/* Avatar Photo */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 border-2 border-white/40 overflow-hidden text-slate-800 font-bold text-xs">
                  <svg className="w-6 h-6 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>

                <div className="text-left">
                  <div className="text-sm font-bold text-white font-sans">
                    Arjun M
                  </div>
                  <div className="text-xs text-white tracking-widest">
                    ★★★★★
                  </div>
                </div>

                {/* Speech Bubble Tail pointing down */}
                <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#0052cc]" />
              </div>
            </div>

            {/* Quote Bubble 1 (Offset Left): "Boosted my confidence and helped me close more deals." */}
            <div className="flex justify-start">
              <div
                onClick={() => setActiveBubble(0)}
                className={`max-w-md rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer ${
                  activeBubble === 0
                    ? "border border-[#38bdf8] bg-[#0c1438]/90 shadow-[0_0_30px_rgba(56,189,248,0.4)]"
                    : "border border-blue-950 bg-[#080d26]/80 hover:border-blue-900"
                }`}
              >
                <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
                  {bubbles[0].text}
                </p>
              </div>
            </div>

            {/* Quote Bubble 2 (Offset Right): "Practical training that actually works in real conversations." */}
            <div className="flex justify-end">
              <div
                onClick={() => setActiveBubble(1)}
                className={`max-w-md rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer ${
                  activeBubble === 1
                    ? "border border-[#38bdf8] bg-[#0c1438]/90 shadow-[0_0_30px_rgba(56,189,248,0.4)]"
                    : "border border-blue-950 bg-[#080d26]/80 hover:border-blue-900"
                }`}
              >
                <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
                  {bubbles[1].text}
                </p>
              </div>
            </div>

            {/* Quote Bubble 3 (Offset Left): "Our team improved significantly in handling objections." */}
            <div className="flex justify-start">
              <div
                onClick={() => setActiveBubble(2)}
                className={`max-w-md rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer ${
                  activeBubble === 2
                    ? "border border-[#38bdf8] bg-[#0c1438]/90 shadow-[0_0_30px_rgba(56,189,248,0.4)]"
                    : "border border-blue-950 bg-[#080d26]/80 hover:border-blue-900"
                }`}
              >
                <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
                  {bubbles[2].text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
