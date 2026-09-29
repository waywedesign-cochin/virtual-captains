"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import BackToTop from "../common/BackToTop";
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

const FOOTER_COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Individuals", href: "/individuals" },
      { label: "Organisations", href: "/organisations" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blogs", href: "/blogs" },
      { label: "Newsletter", href: "#newsletter" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
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
        gsap.set(linksColRef.current, { opacity: 0, y: 24 });
      }
      if (centerLogoRef.current) {
        gsap.set(centerLogoRef.current, { opacity: 0 });
      }
      if (ctaColRef.current) {
        gsap.set(ctaColRef.current, { opacity: 0, y: 24, scale: 0.98 });
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
                y: 0,
                duration: 0.75,
                ease: "power3.out",
              },
              0.55
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
                y: 0,
                scale: 1,
                duration: 0.85,
                ease: "power3.out",
              },
              0.35
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
      className="relative overflow-hidden bg-gradient-to-b from-salesx-bg via-[#040d30] to-[#071b5c] pt-10 sm:pt-24 lg:pt-28 pb-8 sm:pb-10 text-white"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center justify-items-center mb-10 sm:mb-16 lg:mb-20">
          {certifications.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => {
                certBadgesRef.current[idx] = el;
              }}
              className="relative flex flex-col items-center justify-center will-change-transform last:col-span-2 sm:last:col-span-1"
            >
              {/* 32-Point Blue Star Badge */}
              <div className="relative w-28 h-28 sm:w-34 sm:h-34 md:w-38 md:h-38 lg:w-44 lg:h-44 xl:w-48 xl:h-48 flex items-center justify-center">
                {/* Star Image */}
                <div
                  role="img"
                  aria-label={item.title}
                  className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                >
                  <div className="w-full h-full bg-[#344E8F]" style={{ maskImage: `url(${item.badgeImage})`, WebkitMaskImage: `url(${item.badgeImage})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }} />
                </div>

                {/* Center "Certification" Label */}
                <div className="absolute inset-0 flex items-center justify-center p-3 text-center pointer-events-none">
                  <span className="text-white text-xs sm:text-sm lg:text-base font-semibold tracking-wide font-sans drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
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

        {/* ── 3. CTA CARD: one clear next step before the link grid ── */}
        <div
          ref={ctaColRef}
          className="relative mt-10 sm:mt-14 overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-white/[0.07] via-white/[0.03] to-transparent p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)] will-change-transform"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-radial from-blue-500/30 to-transparent blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
                Start Practising
              </p>
              <h3 className="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-white">
                Your Next Deal Deserves A Rehearsal.
              </h3>
              <p className="mt-2 max-w-lg mx-auto md:mx-0 text-sm sm:text-[15px] leading-relaxed text-slate-300/85">
                Talk to a Captain about the SalesX programme for yourself or your team.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:shrink-0">
              <Link
                href="/contact"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-7 text-sm sm:text-base font-medium text-white shadow-[0_0_28px_rgba(59,130,246,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(99,102,241,0.7)] active:translate-y-0"
              >
                Book A Call
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </Link>
              <Link
                href="/individuals"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-7 text-sm sm:text-base font-medium text-white/90 transition-colors duration-300 hover:border-white/40 hover:bg-white/5"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>

        {/* ── 4. LINK GRID: brand blurb + three labelled columns ── */}
        <div
          ref={linksColRef}
          className="mt-12 sm:mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-12 will-change-transform"
        >
          <div ref={centerLogoRef} className="col-span-2 sm:col-span-3 lg:col-span-5">
            <Link href="/" aria-label="Virtual Captains Home" className="inline-block">
              <Image
                src="/wlogo.png"
                alt="Virtual Captains"
                width={220}
                height={44}
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300/80">
              Execution-backed sales training. SalesX is where every seller rehearses
              the conversation before it counts.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="lg:col-span-2 last:col-span-2 sm:last:col-span-1 lg:last:col-span-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm sm:text-[15px] text-slate-300 transition-colors duration-200 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── 5. BOTTOM BAR ── */}
        <div
          ref={copyrightRef}
          className="mt-12 sm:mt-16 flex flex-col-reverse items-center gap-4 border-t border-white/10 pt-6 text-xs sm:text-sm text-slate-400 sm:flex-row sm:justify-between will-change-transform"
        >
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Virtual Captains. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://waywedesign.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Built By Way WeDesign
            </a>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
