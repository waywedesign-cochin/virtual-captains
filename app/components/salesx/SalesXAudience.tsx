"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SalesXAudience() {
  const [activeItem, setActiveItem] = useState<number>(2); // Default to "Career Placement Support" matching Image 3

  const items = [
    {
      id: 0,
      title: "ISM Certified Sales Professional™",
      subtitle: "Globally recognised credential",
    },
    {
      id: 1,
      title: "SalesX by Virtual Captains",
      subtitle: "Execution-backed sales training platform",
    },
    {
      id: 2,
      title: "Career Placement Support",
      subtitle: "Direct access to Virtual Captains' hiring network",
      isHighlight: true,
    },
    {
      id: 3,
      title: "Live CRM & Sales-Call Simulations",
      subtitle: "",
    },
    {
      id: 4,
      title: "Real Sales-Call Practice, Evaluated by Practitioners",
      subtitle: "",
    },
    {
      id: 5,
      title: "VC Certified Badge (LinkedIn-ready)",
      subtitle: "",
    },
    {
      id: 6,
      title: "Placement Assistance for Top Performers",
      subtitle: "",
    },
  ];

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden bg-[#07090e] border-t border-blue-950/40">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-125 bg-blue-900/10 blur-[160px] pointer-events-none -z-10" />

      <div className="w-full max-w-350 mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Left Column: Heading, Paragraph, and 2 Stacked Buttons */}
          <div className="lg:col-span-4 text-left pr-0 lg:pr-4">
            {/* 3-line Heading matching Image 3 */}
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-[1.18] font-sans">
              Prepare Yourself<br />
              for the Deal,<br />
              Not Just the Interview
            </h2>

            {/* Subtitle paragraph matching Image 3 */}
            <p className="mt-6 text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-sm">
              Enroll in a execution-backed sales training program built to transition
              students, freshers, and professionals into top-performing sellers.
            </p>

            {/* 2 Stacked Action Buttons matching Image 3 */}
            <div className="mt-8 flex flex-col items-start gap-3 w-full max-w-xs">
              <Link
                href="/individuals"
                className="w-full text-center rounded-xl border border-white/40 bg-[#0c102a]/60 hover:bg-white/10 hover:border-white px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-all backdrop-blur-md"
              >
                View Course Details
              </Link>
              <Link
                href="/contact"
                className="w-full text-center rounded-xl bg-linear-to-r from-[#0e2154] to-[#123078] hover:from-[#132c6e] hover:to-[#1740a0] border border-blue-500/40 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_rgba(30,58,138,0.4)] transition-all"
              >
                Book Free Counselling
              </Link>
            </div>
          </div>

          {/* Center Column: Flanked by 2 vertical blue lines with gradient "Individuals" */}
          <div className="lg:col-span-4 relative flex items-center justify-center min-h-75 lg:min-h-115">
            {/* Left Vertical Divider Line */}
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-blue-500/30 to-transparent" />

            {/* Center Gradient Title */}
            <div className="relative px-4 text-center">
              <span
                className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.35)] font-sans select-none"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #ff6b35 0%, #ff477e 25%, #a855f7 50%, #38bdf8 75%, #60a5fa 100%)",
                }}
              >
                Individuals
              </span>
            </div>

            {/* Right Vertical Divider Line */}
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-blue-500/30 to-transparent" />
          </div>

          {/* Right Column: 7 Stacked Capsule Cards matching Image 3 */}
          <div className="lg:col-span-4 space-y-2.5 sm:space-y-3 pl-0 lg:pl-4">
            {items.map((item) => {
              const isSelected = activeItem === item.id;
              const hasSub = !!item.subtitle;

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 backdrop-blur-xl ${
                    isSelected
                      ? "border border-blue-500/90 bg-linear-to-r from-[#0b1744] via-[#0f215e] to-[#0c194a] shadow-[0_0_30px_rgba(56,189,248,0.35)] p-4 sm:p-5"
                      : "border border-blue-950/70 bg-[#070b1e]/70 hover:border-blue-900/60 hover:bg-[#090f2b]/80 p-3 sm:p-3.5"
                  }`}
                >
                  <div className="text-left">
                    <h4
                      className={`text-xs sm:text-sm font-semibold transition-colors ${
                        isSelected
                          ? "text-[#38bdf8] font-bold"
                          : "text-slate-300 group-hover:text-white"
                      }`}
                    >
                      {item.title}
                    </h4>

                    {hasSub && (
                      <p
                        className={`mt-0.5 text-[10px] sm:text-xs leading-relaxed ${
                          isSelected ? "text-slate-200" : "text-slate-500"
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
