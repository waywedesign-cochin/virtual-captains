"use client";

import React from "react";
import Link from "next/link";

export default function SalesXCTA() {
  const circularMetrics = [
    { value: "99.9%", label: "Uptime SLA", sub: "Enterprise Grade" },
    { value: "50k+", label: "Simulations", sub: "Reps Trained" },
    { value: "4.9/5", label: "Satisfaction", sub: "Leader Rating" },
    { value: "SOC-2", label: "Security", sub: "Type II Certified" },
    { value: "< 24h", label: "Ramp Speed", sub: "Live Onboarding" },
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-[#07090e] border-t border-blue-950/40">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-125 bg-linear-to-r from-blue-700/20 via-cyan-500/15 to-indigo-600/20 blur-[160px] pointer-events-none -z-10" />

      <div className="w-full max-w-350 mx-auto px-4 sm:px-8 lg:px-12 text-center">
        {/* Main CTA Box */}
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-[#38bdf8] backdrop-blur-md mb-6">
            <span>Enterprise Ready</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            Ready to Redefine{" "}
            <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              Your Sales Performance?
            </span>
          </h2>

          <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-300/90 max-w-2xl leading-relaxed">
            Equip your revenue team with the closing conviction required to win in
            today&apos;s skeptical enterprise market. Launch your first simulation in
            under 24 hours.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_35px_rgba(56,189,248,0.5)] transition-all transform hover:scale-105"
            >
              Book an Enterprise Demo →
            </Link>
            <Link
              href="/individuals"
              className="rounded-full border border-blue-500/40 bg-[#0d1436]/80 hover:bg-[#121c4b]/80 px-8 py-3.5 text-xs sm:text-sm font-semibold text-slate-200 transition-all hover:border-blue-400 backdrop-blur-md"
            >
              Start Free Simulation
            </Link>
          </div>
        </div>

        {/* 5 Circular Glowing Metric Badges in a Horizontal Row (Matching slice_4) */}
        <div className="mt-20 sm:mt-28">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 justify-items-center max-w-5xl mx-auto">
            {circularMetrics.map((item, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-blue-500/30 bg-[#0a102e]/85 shadow-[0_0_30px_rgba(56,189,248,0.25)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#38bdf8] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] cursor-pointer"
              >
                {/* Subtle Inner Glow */}
                <div className="absolute inset-2 rounded-full bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors pointer-events-none" />

                <div className="relative z-10 text-center px-2">
                  <div className="text-xl sm:text-2xl font-black text-white group-hover:text-[#38bdf8] transition-colors">
                    {item.value}
                  </div>
                  <div className="text-[11px] font-bold text-slate-300 mt-0.5">
                    {item.label}
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium">
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
