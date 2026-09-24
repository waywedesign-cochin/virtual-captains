"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export default function SalesXHero() {
  const [selectedBrand, setSelectedBrand] = useState<"salesx" | "captains">("salesx");

  const heroRef = useRef<HTMLElement>(null);
  const brandPillRef = useRef<HTMLDivElement>(null);
  const enrollBadgeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial visual states
      if (brandPillRef.current) {
        gsap.set(brandPillRef.current, { y: -30, opacity: 0, scale: 0.92 });
      }
      if (enrollBadgeRef.current) {
        gsap.set(enrollBadgeRef.current, { y: 35, opacity: 0, scale: 0.92 });
      }
      if (videoRef.current) {
        gsap.set(videoRef.current, { scale: 1.04, opacity: 0.85 });
      }

      // 2. Smooth entrance sequence
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (videoRef.current) {
        tl.to(videoRef.current, { scale: 1, opacity: 1, duration: 1.4 }, 0);
      }
      if (brandPillRef.current) {
        tl.to(
          brandPillRef.current,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.0,
            ease: "back.out(1.4)",
          },
          0.2
        );
      }
      if (enrollBadgeRef.current) {
        tl.to(
          enrollBadgeRef.current,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.95,
            ease: "power3.out",
          },
          0.35
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      role="region"
      aria-label="SalesX Hero Section"
      className="relative w-full h-screen min-h-[560px] max-h-[1080px] overflow-hidden bg-transparent flex items-center justify-center select-none"
    >
      {/* Semantic Accessible Heading for SEO & Screen Readers */}
      <h1 className="sr-only">
        SalesX | High-Velocity AI Sales Simulation Engine by Virtual Captains
      </h1>

      {/* Full-bleed Background Video - Permanently Muted with Hardware Acceleration */}
      <video
        ref={videoRef}
        src="/salesx/m.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-bottom select-none pointer-events-none will-change-transform"
      />

      {/* Ambient Vignette & Gradient Seamless Transition to Next Section */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(2,5,20,0.55)_100%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-linear-to-t from-[#020514] via-[#020514]/60 to-transparent pointer-events-none" />

      {/* Top Center Floating Brand Switcher Pill: Liquid Glassmorphism */}
      <div
        ref={brandPillRef}
        className="absolute top-5 sm:top-6 md:top-7 left-1/2 -translate-x-1/2 z-30 select-none will-change-transform"
      >
        <div className="relative group">
          {/* Ambient Liquid Glass Outer Glow */}
          <div className="absolute -inset-1 rounded-full bg-linear-to-r from-sky-500/25 via-indigo-500/20 to-blue-500/25 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

          {/* Liquid Glassmorphic Chassis */}
          <div
            role="tablist"
            aria-label="Brand Selector"
            className="relative flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full border border-white/20 hover:border-white/35 bg-[#050920]/80 backdrop-blur-2xl shadow-[0_14px_45px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(255,255,255,0.06)] transition-all duration-300"
          >
            {/* 1. SALESX Brand (Default Selected) */}
            <button
              type="button"
              role="tab"
              aria-selected={selectedBrand === "salesx"}
              aria-label="SalesX Platform"
              onClick={() => setSelectedBrand("salesx")}
              className={`relative flex items-center justify-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-300 cursor-pointer ${
                selectedBrand === "salesx"
                  ? "bg-linear-to-b from-white/25 via-white/14 to-white/6 text-white border border-white/40 shadow-[0_4px_22px_rgba(56,189,248,0.4),inset_0_1px_1px_rgba(255,255,255,0.75)] backdrop-blur-xl"
                  : "text-white/60 hover:text-white/95 hover:bg-white/8 border border-transparent"
              }`}
              title="SalesX Platform"
            >
              <div className="relative h-4.5 sm:h-5 w-18 sm:w-22 flex items-center justify-center">
                <Image
                  src="/salesx/salesx-logo.png"
                  alt="SalesX"
                  width={110}
                  height={28}
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    selectedBrand === "salesx"
                      ? "brightness-115 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)] scale-102"
                      : "opacity-60 grayscale-35 hover:opacity-95 hover:grayscale-0"
                  }`}
                  priority
                />
              </div>
            </button>

            {/* Subtle Liquid Glass Divider */}
            <span className="h-4 sm:h-5 w-px bg-linear-to-b from-transparent via-white/30 to-transparent mx-0.5 pointer-events-none" />

            {/* 2. VIRTUAL CAPTAINS Brand */}
            <Link
              href="/"
              onClick={() => setSelectedBrand("captains")}
              className={`relative flex items-center justify-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-300 cursor-pointer ${
                selectedBrand === "captains"
                  ? "bg-linear-to-b from-white/25 via-white/14 to-white/6 text-white border border-white/40 shadow-[0_4px_22px_rgba(255,255,255,0.3),inset_0_1px_1px_rgba(255,255,255,0.75)] backdrop-blur-xl"
                  : "text-white/60 hover:text-white/95 hover:bg-white/8 border border-transparent"
              }`}
              title="Virtual Captains Main Platform"
            >
              <div className="relative h-4.5 sm:h-5 w-24 sm:w-28 flex items-center justify-center">
                <Image
                  src="/wlogo.png"
                  alt="Virtual Captains"
                  width={130}
                  height={28}
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    selectedBrand === "captains"
                      ? "brightness-125 drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] scale-102"
                      : "opacity-60 grayscale-35 hover:opacity-95 hover:grayscale-0"
                  }`}
                  priority
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Floating Pill Badge: Centered on mobile, bottom-right on sm+ */}
      <div
        ref={enrollBadgeRef}
        className="absolute bottom-6 sm:bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 md:right-16 z-20 w-max max-w-[calc(100%-2rem)] will-change-transform"
      >
        <div className="relative group">
          {/* Subtle glowing halo on hover */}
          <div className="absolute -inset-1 rounded-full bg-linear-to-r from-blue-600/25 to-indigo-600/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

          <div className="flex items-center gap-3 sm:gap-4 rounded-full border border-white/20 group-hover:border-white/35 bg-[#080d26]/85 px-4 sm:px-6 py-2.5 sm:py-3 backdrop-blur-xl shadow-[0_14px_45px_rgba(0,0,0,0.75),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-300">
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
      </div>
    </section>
  );
}