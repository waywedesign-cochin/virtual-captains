"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { socialLinks } from "./data";
import { NAV_ITEMS } from "../home/Navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function SiteFooter() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        "[data-banner-text]",
        { xPercent: -2, letterSpacing: "-0.02em" },
        {
          xPercent: 2,
          letterSpacing: "0.02em",
          ease: "none",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    },
    { scope: bannerRef }
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative isolate overflow-hidden bg-[#040507]">
      {/* Dynamic parallax text banner */}
      <div
        ref={bannerRef}
        className="relative h-27.5 sm:h-37.5 lg:h-47.5 overflow-hidden border-t border-white/10"
        style={{
          background:
            "linear-gradient(180deg, #040507 0%, #06112c 50%, #0a1b4d 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <span
          data-banner-text
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 select-none bg-linear-to-b from-white/30 via-white/15 to-transparent bg-clip-text text-center font-serif text-[15vw] sm:text-[12vw] lg:text-[7.5rem] font-black uppercase leading-none tracking-tight text-transparent"
        >
          Virtual Captains
        </span>
      </div>

      {/* Footer Body */}
      <footer className="relative bg-[#060e24] px-4 pt-12 pb-8 sm:px-8 sm:pt-16 sm:pb-12 lg:px-12 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Container aligned strictly with Navbar */}
        <div className="relative z-10 w-full max-w-372 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* 1. Brand column */}
            <div className="flex flex-col items-start gap-4">
              <Link href="/" className="inline-block group" aria-label="Virtual Captains Home">
                <Image
                  src="/wlogo.png"
                  alt="Virtual Captains"
                  width={160}
                  height={32}
                  className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
                />
              </Link>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-xs">
                Turn sales uncertainty into sales readiness. High-impact live
                and AI-simulated rehearsals for high-growth revenue teams.
              </p>
              <div className="flex gap-2.5 mt-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition-colors hover:border-[#38bdf8] hover:text-white hover:bg-white/10"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* 2. Navigation column 1 */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#38bdf8] font-semibold mb-4">
                Explore
              </p>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-white/70 font-medium">
                {NAV_ITEMS.slice(0, 4).map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-[#e7ff3d]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Navigation column 2 */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#38bdf8] font-semibold mb-4">
                Programs
              </p>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-white/70 font-medium">
                {NAV_ITEMS.slice(4).map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-[#e7ff3d]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="text-[#e7ff3d] font-semibold transition-colors hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* 4. SalesX Fast CTA */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#38bdf8] font-semibold mb-4">
                Sales Readiness
              </p>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4">
                Ready to transform your sales floor performance?
              </p>
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-[#e7ff3d] hover:text-[#0a0b0d] border border-white/20 hover:border-transparent px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-300 shadow-md cursor-pointer"
              >
                Let&apos;s Connect &rarr;
              </a>
            </div>
          </motion.div>

          {/* Legal / Copyright Row with Back to top */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row text-xs text-white/50">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-start">
              <Link href="/privacy" className="hover:text-white/80 transition-colors">
                Privacy Policy
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-white/80 transition-colors">
                Terms &amp; Conditions
              </Link>
              <span>·</span>
              <Link href="/refund" className="hover:text-white/80 transition-colors">
                Refund Policy
              </Link>
              <span>·</span>
              <Link href="/refund#disclaimer" className="hover:text-white/80 transition-colors">
                Disclaimer
              </Link>
            </div>

            <p className="text-center">
              &copy; {new Date().getFullYear()} Virtual Captains. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <span className="text-white/40">
                Built by{" "}
                <a
                  href="https://waywedesign.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Way WeDesign
                </a>
              </span>

              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-200 hover:border-white/50 hover:bg-white hover:text-black cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-none stroke-current stroke-2"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
