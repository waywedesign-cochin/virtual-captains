"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function SalesXFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#05070e] pt-20 pb-12 border-t border-blue-950/60 text-white">
      {/* Subtle Bottom Ambient Blue Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-t from-blue-700/20 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Prominent Illuminated SalesX Center Wordmark (Matching slice_4) */}
        <div className="flex flex-col items-center justify-center text-center pb-16 border-b border-blue-950/60">
          <div className="relative mb-3">
            {/* Glowing Backdrop Aura */}
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-600/30 via-cyan-400/20 to-indigo-600/30 blur-2xl rounded-full pointer-events-none" />

            <div className="relative flex items-center justify-center gap-1 font-black tracking-widest text-4xl sm:text-6xl md:text-7xl font-sans">
              <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                SALES
              </span>
              <span className="text-[#38bdf8] drop-shadow-[0_0_30px_rgba(56,189,248,0.9)]">
                X
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md font-sans">
            The Enterprise Revenue Simulation & High-Velocity Closing Engine
          </p>
        </div>

        {/* 3 Columns Layout (Matching slice_4 bottom row) */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-blue-950/60">
          {/* Left: Navigation links */}
          <div className="md:col-span-4 flex flex-wrap gap-6 text-xs sm:text-sm text-slate-400">
            <Link href="/organisations" className="hover:text-[#38bdf8] transition-colors">
              For Teams
            </Link>
            <Link href="/individuals" className="hover:text-[#38bdf8] transition-colors">
              For Individuals
            </Link>
            <Link href="/contact" className="hover:text-[#38bdf8] transition-colors">
              Enterprise
            </Link>
            <Link href="/" className="hover:text-[#38bdf8] transition-colors">
              Virtual Captains
            </Link>
          </div>

          {/* Center: Brand badge */}
          <div className="md:col-span-4 flex items-center justify-center">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-blue-900/40 bg-[#090d26]/80 backdrop-blur-md">
              <div className="relative h-6 w-6">
                <Image
                  src="/home/SalesX Logo Final White.png"
                  alt="SalesX Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-slate-300">
                A Virtual Captains Innovation
              </span>
            </div>
          </div>

          {/* Right: Action button */}
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all transform hover:scale-105"
            >
              Request Simulation Demo →
            </Link>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} SalesX by Virtual Captains. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">
              Security & Compliance
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
