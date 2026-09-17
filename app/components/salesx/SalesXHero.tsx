"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SalesXHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[1080px] overflow-hidden bg-[#030616] flex items-center justify-center">
      {/* Full-bleed Background Video */}
      <video
        ref={videoRef}
        src="/salesx/m.webm"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover select-none"
      />

      {/* Subtle Vignette & Gradient Transition to Next Section */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(3,6,22,0.4)_100%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-linear-to-t from-[#07090e] via-[#07090e]/70 to-transparent pointer-events-none" />

      {/* Top Center Floating Pill: [ SALESX | Virtual Captains ] matching screenshot */}
      <div className="absolute top-20 sm:top-24 md:top-28 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-3 sm:gap-4 rounded-full border border-white/20 bg-[#0a0f2d]/80 px-5 sm:px-7 py-2 sm:py-2.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] select-none">
          {/* SALESX Logo */}
          <div className="flex items-center font-sans tracking-wide">
            <span className="font-extrabold text-white text-sm sm:text-base tracking-wider">SALES</span>
            <span className="text-[#38bdf8] font-black text-base sm:text-lg ml-0.5">X</span>
          </div>

          {/* Vertical Divider */}
          <span className="h-4 sm:h-5 w-px bg-white/25" />

          {/* Virtual Captains Brand */}
          <div className="flex items-center gap-2">
            <div className="relative w-4 h-4 sm:w-5 sm:h-5">
              <Image
                src="/home/logo.png"
                alt="Virtual Captains"
                fill
                sizes="(max-width: 640px) 16px, 20px"
                className="object-contain brightness-150"
              />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[11px] sm:text-xs font-bold text-white">Virtual</div>
              <div className="text-[11px] sm:text-xs font-bold text-white/90">Captains</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Floating Pill Badge: [ India's first sales execution-backed training program | Enroll Now ] */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 right-4 sm:right-8 md:right-16 z-20">
        <div className="flex items-center gap-3 sm:gap-4 rounded-full border border-white/20 bg-[#0b1028]/85 px-4 sm:px-6 py-2.5 sm:py-3 backdrop-blur-xl shadow-[0_14px_45px_rgba(0,0,0,0.75)]">
          <div className="text-left font-sans pr-1 sm:pr-2">
            <p className="text-[10px] sm:text-xs font-medium text-white/95 leading-tight">
              India&apos;s first sales
            </p>
            <p className="text-[10px] sm:text-xs font-medium text-white/95 leading-tight">
              execution-backed
            </p>
            <p className="text-[10px] sm:text-xs font-medium text-white/95 leading-tight">
              training program
            </p>
          </div>

          <Link
            href="/individuals"
            className="inline-flex items-center justify-center rounded-full bg-white hover:bg-slate-100 px-4 sm:px-6 py-2 sm:py-2.5 shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer select-none shrink-0"
          >
            <span className="text-[#f97316] font-extrabold text-xs sm:text-sm">Enroll</span>
            <span className="text-[#6366f1] font-extrabold text-xs sm:text-sm ml-1">Now</span>
          </Link>
        </div>
      </div>

      {/* Bottom Left Audio Control */}
      <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-8 md:left-12 z-20">
        <button
          type="button"
          onClick={toggleMute}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 hover:bg-black/65 px-3.5 py-2 text-xs font-medium text-white/80 backdrop-blur-md transition-all cursor-pointer hover:text-white shadow-lg"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? (
            <>
              <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
              <span className="hidden sm:inline text-[11px]">Unmute</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-[#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span className="hidden sm:inline text-[11px] text-[#38bdf8]">Mute</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
