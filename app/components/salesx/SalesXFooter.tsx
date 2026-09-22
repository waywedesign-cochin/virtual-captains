"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 5 Certification badges (extensible with custom names / partner logos later as requested)
export interface CertificationItem {
  id: string;
  title: string;
  subtitle?: string;
  badgeImage: string;
}

const certifications: CertificationItem[] = [
  {
    id: "cert-1",
    title: "Certification",
    subtitle: "Sales Simulation",
    badgeImage: "/salesx/Star.png",
  },
  {
    id: "cert-2",
    title: "Certification",
    subtitle: "Objection Mastery",
    badgeImage: "/salesx/Star.png",
  },
  {
    id: "cert-3",
    title: "Certification",
    subtitle: "Enterprise Closing",
    badgeImage: "/salesx/Star.png",
  },
  {
    id: "cert-4",
    title: "Certification",
    subtitle: "Revenue Intelligence",
    badgeImage: "/salesx/Star.png",
  },
  {
    id: "cert-5",
    title: "Certification",
    subtitle: "Pipeline Velocity",
    badgeImage: "/salesx/Star.png",
  },
];

// Deterministic cosmic star coordinates (avoids SSR hydration mismatches)
const COSMIC_STARS = [
  { top: "6%", left: "8%", size: 2, opacity: 0.85, animDur: "3.2s" },
  { top: "12%", left: "22%", size: 1.5, opacity: 0.6, animDur: "4.1s" },
  { top: "8%", left: "42%", size: 2.5, opacity: 0.9, animDur: "2.8s" },
  { top: "15%", left: "62%", size: 1.5, opacity: 0.55, animDur: "3.8s" },
  { top: "10%", left: "82%", size: 2, opacity: 0.8, animDur: "3.5s" },
  { top: "18%", left: "94%", size: 2.5, opacity: 0.85, animDur: "2.9s" },
  { top: "28%", left: "14%", size: 1.5, opacity: 0.6, animDur: "4.4s" },
  { top: "34%", left: "28%", size: 2, opacity: 0.75, animDur: "3.7s" },
  { top: "30%", left: "72%", size: 1.5, opacity: 0.5, animDur: "4.2s" },
  { top: "38%", left: "88%", size: 2, opacity: 0.75, animDur: "3.1s" },
  { top: "52%", left: "6%", size: 2.5, opacity: 0.9, animDur: "3.3s" },
  { top: "58%", left: "24%", size: 1.5, opacity: 0.5, animDur: "4.0s" },
  { top: "54%", left: "78%", size: 2, opacity: 0.8, animDur: "3.6s" },
  { top: "62%", left: "92%", size: 1.5, opacity: 0.65, animDur: "3.9s" },
  { top: "72%", left: "12%", size: 2, opacity: 0.7, animDur: "3.4s" },
  { top: "78%", left: "36%", size: 1.5, opacity: 0.55, animDur: "4.3s" },
  { top: "75%", left: "68%", size: 2.5, opacity: 0.85, animDur: "2.7s" },
  { top: "84%", left: "84%", size: 1.5, opacity: 0.6, animDur: "4.1s" },
  { top: "90%", left: "20%", size: 2, opacity: 0.75, animDur: "3.5s" },
  { top: "92%", left: "55%", size: 1.5, opacity: 0.5, animDur: "3.8s" },
];

export default function SalesXFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const certBadgesRef = useRef<(HTMLDivElement | null)[]>([]);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const linksColRef = useRef<HTMLDivElement>(null);
  const centerLogoRef = useRef<HTMLDivElement>(null);
  const ctaColRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Force Lenis & ScrollTrigger to refresh dimensions so scroll is never blocked
    const refreshScrollDimensions = () => {
      ScrollTrigger.refresh();
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.resize();
      }
    };

    refreshScrollDimensions();
    const t1 = setTimeout(refreshScrollDimensions, 150);
    const t2 = setTimeout(refreshScrollDimensions, 600);
    const t3 = setTimeout(refreshScrollDimensions, 1500);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !footerRef.current) return;

    const ctx = gsap.context(() => {
      const badges = certBadgesRef.current.filter(Boolean) as HTMLDivElement[];

      // Initial states (safe opacity that transitions smoothly without staying hidden)
      if (badges.length > 0) {
        gsap.set(badges, { scale: 0.6, opacity: 0, y: 30, rotation: -12 });
      }
      if (logoBoxRef.current) {
        gsap.set(logoBoxRef.current, { opacity: 0, y: 30, scale: 0.96 });
      }
      if (linksColRef.current) {
        gsap.set(linksColRef.current, { opacity: 0, x: -25 });
      }
      if (centerLogoRef.current) {
        gsap.set(centerLogoRef.current, { opacity: 0, scale: 0.92 });
      }
      if (ctaColRef.current) {
        gsap.set(ctaColRef.current, { opacity: 0, x: 25, scale: 0.94 });
      }
      if (copyrightRef.current) {
        gsap.set(copyrightRef.current, { opacity: 0, y: 15 });
      }

      // ScrollTrigger Entrance Sequence (start: "top 95%" triggers as soon as section peeks in)
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 95%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          // 1. 5 Certification Badges pop-in
          if (badges.length > 0) {
            tl.to(
              badges,
              {
                scale: 1,
                opacity: 1,
                y: 0,
                rotation: 0,
                duration: 0.85,
                stagger: 0.1,
                ease: "back.out(1.5)",
                onComplete: () => {
                  // Ambient zero-gravity float
                  badges.forEach((b, i) => {
                    gsap.to(b, {
                      y: i % 2 === 0 ? -6 : 6,
                      duration: 3.0 + (i % 3) * 0.4,
                      repeat: -1,
                      yoyo: true,
                      ease: "sine.inOut",
                    });
                  });
                },
              },
              0
            );
          }

          // 2. Framed SalesX Logo Box un-scales & fades in
          if (logoBoxRef.current) {
            tl.to(
              logoBoxRef.current,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.9,
                ease: "power3.out",
              },
              0.2
            );
          }

          // 3. Middle 3-Column Row
          if (linksColRef.current) {
            tl.to(
              linksColRef.current,
              {
                opacity: 1,
                x: 0,
                duration: 0.75,
                ease: "power3.out",
              },
              0.35
            );
          }

          if (centerLogoRef.current) {
            tl.to(
              centerLogoRef.current,
              {
                opacity: 1,
                scale: 1,
                duration: 0.75,
                ease: "power3.out",
              },
              0.4
            );
          }

          if (ctaColRef.current) {
            tl.to(
              ctaColRef.current,
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.85,
                ease: "back.out(1.4)",
              },
              0.45
            );
          }

          // 4. Bottom Copyright Row
          if (copyrightRef.current) {
            tl.to(
              copyrightRef.current,
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
              },
              0.6
            );
          }
        },
      });

      // Fail-safe visibility timeout: guarantees all elements are 100% visible even if scroll doesn't fire
      const visibilityTimer = setTimeout(() => {
        gsap.to(
          [
            ...badges,
            logoBoxRef.current,
            linksColRef.current,
            centerLogoRef.current,
            ctaColRef.current,
            copyrightRef.current,
          ].filter(Boolean),
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.5,
          }
        );
      }, 1000);

      return () => clearTimeout(visibilityTimer);
    }, footerRef);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      ctx.revert();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#020512] via-[#040d30] to-[#071b5c] pt-16 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 text-white"
    >
      {/* ── Deterministic Twinkling Cosmic Stars ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {COSMIC_STARS.map((star, idx) => (
          <div
            key={`cosmic-star-${idx}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: star.animDur,
              boxShadow: "0 0 6px rgba(255, 255, 255, 0.9)",
            }}
          />
        ))}
      </div>

      {/* Radiant Royal Blue Nebula Glow at Bottom Center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] lg:w-[1300px] h-[450px] bg-radial from-[#1e40af]/35 via-[#1d4ed8]/18 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Standardized Max-Width Container Matching All Sections Above */}
      <div className="relative z-10 w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12">
        {/* ── 1. CERTIFICATION STARS ROW (Matching Reference Screenshots 1 & 2) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center justify-items-center mb-14 sm:mb-20 lg:mb-24">
          {certifications.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => {
                certBadgesRef.current[idx] = el;
              }}
              className="group relative flex flex-col items-center justify-center cursor-pointer will-change-transform last:col-span-2 sm:last:col-span-1 md:last:col-span-1"
            >
              {/* 32-Point Blue Star Badge */}
              <div className="relative w-28 h-28 sm:w-34 sm:h-34 md:w-38 md:h-38 lg:w-44 lg:h-44 xl:w-48 xl:h-48 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                {/* Glowing Radial Halo on Hover */}
                <div className="absolute inset-0 rounded-full bg-blue-600/0 group-hover:bg-blue-600/35 blur-xl transition-all duration-300 pointer-events-none" />

                {/* Star Image */}
                <Image
                  src={item.badgeImage}
                  alt={item.title}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_0_25px_rgba(37,99,235,0.75)] transition-all duration-300"
                  priority={false}
                />

                {/* Center "Certification" Label matching reference screenshot */}
                <div className="absolute inset-0 flex items-center justify-center p-3 text-center pointer-events-none">
                  <span className="text-white text-xs sm:text-sm lg:text-base font-semibold tracking-wide font-sans drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] group-hover:text-cyan-100 transition-colors">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── 2. SALESX CENTER LOGO (Clean borderless presentation) ── */}
        <div
          ref={logoBoxRef}
          className="relative w-full max-w-3xl mx-auto flex items-center justify-center py-4 sm:py-8 will-change-transform"
        >
          {/* Subtle soft blue aura behind logo */}
          <div className="absolute inset-0 max-w-lg mx-auto bg-radial from-blue-500/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="relative w-full max-w-xl md:max-w-2xl h-24 sm:h-32 md:h-40 flex items-center justify-center">
            <Image
              src="/salesx/salesx-logo.png"
              alt="SalesX by Virtual Captains"
              width={850}
              height={260}
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-transform duration-300 hover:scale-103"
              priority
            />
          </div>
        </div>

        {/* ── 3. THREE-COLUMN MIDDLE ROW (Blogs/Newsletter/Contact | Virtual Captains | Book A Call) ── */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-center">
          {/* Left Column: Vertical Links */}
          <div
            ref={linksColRef}
            className="flex flex-col items-center md:items-start space-y-3 sm:space-y-4 text-center md:text-left will-change-transform"
          >
            <Link
              href="/blogs"
              className="text-base sm:text-lg text-slate-300 font-normal hover:text-white hover:translate-x-1 transition-all duration-200 block"
            >
              Blogs
            </Link>
            <Link
              href="#newsletter"
              className="text-base sm:text-lg text-slate-300 font-normal hover:text-white hover:translate-x-1 transition-all duration-200 block"
            >
              Newsletter
            </Link>
            <Link
              href="/contact"
              className="text-base sm:text-lg text-slate-300 font-normal hover:text-white hover:translate-x-1 transition-all duration-200 block"
            >
              Contact
            </Link>
          </div>

          {/* Center Column: Virtual Captains Brand Logo */}
          <div
            ref={centerLogoRef}
            className="flex items-center justify-center will-change-transform"
          >
            <Link
              href="/"
              className="inline-block group cursor-pointer"
              aria-label="Virtual Captains Home"
            >
              <div className="relative h-9 sm:h-10 md:h-11 w-44 sm:w-52 flex items-center justify-center">
                <Image
                  src="/wlogo.png"
                  alt="Virtual Captains"
                  width={220}
                  height={44}
                  className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Right Column: Book A Call Button with Vibrant Glow */}
          <div
            ref={ctaColRef}
            className="flex justify-center md:justify-end will-change-transform"
          >
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 border border-indigo-400/40 text-base sm:text-lg font-medium text-white tracking-wide shadow-[0_0_30px_rgba(59,130,246,0.5),0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_40px_rgba(99,102,241,0.7),0_0_35px_rgba(56,189,248,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
            >
              <span className="relative z-10 font-sans font-medium text-white group-hover:text-cyan-100 transition-colors">
                Book A Call
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>
          </div>
        </div>

        {/* ── 4. BOTTOM COPYRIGHT ROW (Matching Reference Screenshot 2) ── */}
        <div
          ref={copyrightRef}
          className="mt-16 sm:mt-24 pt-8 border-t border-blue-900/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-300/80 font-sans will-change-transform text-center md:text-left"
        >
          {/* Left: Legal Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            <Link
              href="/privacy"
              className="underline hover:text-white transition-colors"
            >
              • Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="underline hover:text-white transition-colors"
            >
              • Terms &amp; Conditions
            </Link>
            <Link
              href="/refund"
              className="underline hover:text-white transition-colors"
            >
              • Refund Policy
            </Link>
            <Link
              href="/refund#disclaimer"
              className="underline hover:text-white transition-colors"
            >
              • Disclaimer
            </Link>
          </div>

          {/* Center: © All Right Reserved by Virtual Captain 2026y */}
          <div className="text-slate-300">
            © All Right Reserved by Virtual Captain 2026y
          </div>

          {/* Right: • Built By Way WeDesign */}
          <div>
            <a
              href="https://waywedesign.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              • Built By Way WeDesign
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
