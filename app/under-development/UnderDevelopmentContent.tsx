"use client";

import Link from "next/link";
import Navbar from "../components/home/Navbar";

export default function UnderDevelopmentContent() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#040507] text-white flex flex-col justify-between selection:bg-[#38bdf8] selection:text-black">
      {/* Top Navigation */}
      <Navbar />

      {/* Atmospheric Background & Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient Glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[min(900px,90vw)] rounded-full bg-gradient-to-b from-[#1852cf]/25 to-transparent blur-[140px]" />

      {/* Clean Minimalist Center */}
      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        {/* Pulsing indicator */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 backdrop-blur-md mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e7ff3d] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e7ff3d]" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
            Notice
          </span>
        </div>

        <h1 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-normal tracking-tight text-white">
          This page is under development
        </h1>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#e7ff3d] hover:bg-[#d8f030] px-7 py-3 text-[13px] sm:text-[14px] font-bold text-[#0a0b0d] shadow-[0_0_24px_rgba(231,255,61,0.35)] transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer"
          >
            <span>Return to Home</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 w-full border-t border-white/10 py-5 text-center text-[12px] text-white/35">
        <p>© {new Date().getFullYear()} Virtual Captains</p>
      </footer>
    </main>
  );
}
