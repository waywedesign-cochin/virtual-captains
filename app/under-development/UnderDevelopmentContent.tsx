"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/home/Navbar";

// Human-readable titles for common route segments
const ROUTE_NAMES: Record<string, string> = {
  "/about": "About Virtual Captains",
  "/salesx": "SalesX Execution Training",
  "/programs": "Sales Programs",
  "/organisations": "For Organisations",
  "/individuals": "For Individuals",
  "/partner": "Partner Network",
  "/resources": "Knowledge & Resources",
  "/contact": "Connect & Book a Call",
};

export default function UnderDevelopmentContent() {
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get("from") || "";
  const normalizedFrom = rawFrom.startsWith("/") ? rawFrom : `/${rawFrom}`;

  // Resolve user-friendly label or fall back to cleaned path
  const pageLabel =
    ROUTE_NAMES[normalizedFrom] ||
    (rawFrom
      ? rawFrom
          .replace(/^\/+/, "")
          .split(/[-_]/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "This Section");

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#040507] text-white flex flex-col justify-between selection:bg-[#38bdf8] selection:text-black">
      {/* Top Navbar */}
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

      {/* Radiant Glow Canopies */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[min(1100px,100vw)] rounded-full bg-gradient-to-b from-[#1852cf]/35 via-[#0e2c7a]/20 to-transparent blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[500px] rounded-full bg-[#e7ff3d]/6 blur-[140px]" />

      {/* Central Content Stage */}
      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-32 text-center sm:px-10">
        {/* Pulsing Status Pill */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 backdrop-blur-xl mb-6 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e7ff3d] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e7ff3d]" />
          </span>
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/80">
            Work In Progress
          </span>
        </div>

        {/* Dynamic Heading */}
        <h1 className="max-w-3xl font-serif text-[clamp(2.2rem,5vw,4.2rem)] font-normal leading-[1.12] tracking-tight text-white">
          <span className="text-white/70 block text-[clamp(1.1rem,2vw,1.6rem)] font-sans uppercase tracking-[0.18em] mb-2">
            {pageLabel}
          </span>
          Under Active Development
        </h1>

        {/* Descriptive Body */}
        <p className="mt-5 max-w-xl font-sans text-[clamp(14px,1.2vw,17px)] leading-relaxed text-white/65">
          This page is currently being refined as part of our scheduled release.
          The primary home experience and core platform simulations are live.
        </p>

        {/* Interactive Highlight Cards */}
        <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 text-left">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.05]">
            <div className="h-2 w-2 rounded-full bg-[#38bdf8] mb-3" />
            <h3 className="font-serif text-[16px] text-white font-medium mb-1">
              AI Simulation Engine
            </h3>
            <p className="text-[12px] text-white/55 leading-relaxed">
              Dynamic buyer personas tailored for realistic conversational pushback.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.05]">
            <div className="h-2 w-2 rounded-full bg-[#e7ff3d] mb-3" />
            <h3 className="font-serif text-[16px] text-white font-medium mb-1">
              Telemetry & Audits
            </h3>
            <p className="text-[12px] text-white/55 leading-relaxed">
              Detailed conviction metrics, pitch pacing, and framework adherence.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.05]">
            <div className="h-2 w-2 rounded-full bg-[#ff7812] mb-3" />
            <h3 className="font-serif text-[16px] text-white font-medium mb-1">
              Custom Playbooks
            </h3>
            <p className="text-[12px] text-white/55 leading-relaxed">
              Enterprise workflows designed specifically for high-velocity revenue teams.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-[#e7ff3d] hover:bg-[#d8f030] px-7 py-3 text-[13px] sm:text-[14px] font-bold text-[#0a0b0d] shadow-[0_0_24px_rgba(231,255,61,0.35)] transition-all duration-200 hover:scale-103 active:scale-98 cursor-pointer"
          >
            <span>Return to Home</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
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

          <Link
            href="/#contact-form"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/35 px-6 py-3 text-[13px] sm:text-[14px] font-medium text-white backdrop-blur-md transition-all duration-200 cursor-pointer"
          >
            <span>Get in Touch</span>
          </Link>
        </div>
      </section>

      {/* Subdued Footer Stamp */}
      <footer className="relative z-10 w-full border-t border-white/10 py-6 text-center text-[12px] text-white/40">
        <p>© {new Date().getFullYear()} Virtual Captains · Client Preview Release</p>
      </footer>
    </main>
  );
}
