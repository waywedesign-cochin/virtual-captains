"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { footerColumns } from "./data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Footer() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      // Subtle scroll-linked parallax: the giant wordmark drifts and
      // tightens up as it scrolls through view, reinforcing depth.
      gsap.fromTo(
        "[data-banner-text]",
        { xPercent: -2, letterSpacing: "-0.02em" },
        {
          xPercent: 2,
          letterSpacing: "0em",
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

  return (
    <div className="relative isolate">
      {/* Giant wordmark that fades from the page background into the footer */}
      <div
        ref={bannerRef}
        className="relative h-[120px] overflow-hidden bg-gradient-to-b from-white to-[#0F1D52] sm:h-[160px] lg:h-[200px]"
      >
        <span
          data-banner-text
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 select-none bg-gradient-to-b from-[#C8D1F5] to-[#0F1D52] bg-clip-text text-center text-[16vw] font-extrabold uppercase leading-none tracking-tight text-transparent sm:text-[13vw] lg:text-[8.5rem]"
        >
          Organisations
        </span>
      </div>

      <footer className="bg-gradient-to-b from-[#0F1D52] to-[#0A1440] px-5 pb-8 pt-10 text-white sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="mx-auto grid max-w-[1400px] gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <Link href="/" className="flex items-center gap-2">
              <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
                <path d="M16 2 28.5 8.2v9.6c0 8.2-5.7 11.3-12.5 12.2C9.2 29.1 3.5 26 3.5 17.8V8.2L16 2Z" fill="#fff" />
                <path d="M16 6.4 24.4 10.4v7.4c0 6-3.8 8.1-8.4 9-4.6-.9-8.4-3-8.4-9v-7.4L16 6.4Z" fill="#0F1D52" />
              </svg>
              <span className="text-[15px] font-bold leading-[1.05]">
                Virtual
                <br />
                Captains
              </span>
            </Link>
          </div>

          {footerColumns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <ul className="flex flex-col gap-3 text-sm text-white/70">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="text-lg font-bold">SalesX</p>
            <a
              href="#book-a-call"
              className="mt-4 inline-block rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/20"
            >
              Book A Call
            </a>
          </div>
        </motion.div>

        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <a href="#" className="hover:text-white/80">
            Privacy Policy
          </a>
          <p>&copy; All Rights Reserved by Virtual Captains {new Date().getFullYear()}</p>
          <a
            href="https://waywedesign.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/80"
          >
            Built By Way WeDesign
          </a>
        </div>
      </footer>
    </div>
  );
}
