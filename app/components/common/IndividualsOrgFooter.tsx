"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BookACallModal from "../home/BookACallModal";

gsap.registerPlugin(ScrollTrigger);

/**
 * Dedicated Interactive GSAP Footer for For Individuals and For Organisations pages.
 *
 * Features:
 * - Seamless White Blend: Starts pure white (#ffffff) matching the white sections above,
 *   flowing through sky-blue tones into deep royal cobalt and midnight navy.
 * - Pinned Two-Phase Reveal: Prominent /home/logo.png wordmark is pinned, then on scroll
 *   it scales down and disappears, smoothly revealing the rich 4-column navigation grid.
 * - Multi-Column Page Links: Direct links across Company, Programmes, Resources, and Talk to a Captain.
 * - Styled Cool Micro-Capsules: "Practical Support", "Real-World Experience", "Measurable Impact"
 *   with glowing jewel neon indicators and hover scale micro-animations.
 * - Dual-Layer Chromatic Torch Dots: Cursor proximity revealing with 7-color smooth cycling.
 * - Ambient Cursor Aura Glow & Floating Orbs.
 * - White "Book a Call" button (bg-white text-black border border-white).
 * - Back-to-top button.
 */
export default function IndividualsOrgFooter() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const footerDotsRef = useRef<HTMLDivElement>(null);
  const footerDotsGlowRef = useRef<HTMLDivElement>(null);
  const footerTorchAuraRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const legalRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const backToTopRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(
          [
            wordmarkRef.current,
            actionsRef.current,
            legalRef.current,
          ].filter(Boolean),
          { opacity: 1, y: 0, x: 0, scale: 1 },
        );
        return;
      }

      // ---------- Floating orbs (idle drift) ----------
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: 60,
          y: -40,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: -50,
          y: 50,
          duration: 11,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // ---------- Footer pinned reveal ----------
      gsap.set(wordmarkRef.current, { opacity: 0, y: 30, scale: 1 });
      gsap.set(actionsRef.current, { opacity: 0, scale: 0.9, y: 12, pointerEvents: "none" });
      gsap.set(legalRef.current, { opacity: 0, x: 70 });
      gsap.set(backToTopRef.current, { opacity: 0, y: 12 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 0.5,
          },
        })
        .to(wordmarkRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        })
        .to({}, { duration: 0.25 })
        .to(wordmarkRef.current, {
          opacity: 0,
          scale: 0.85,
          duration: 0.28,
          ease: "power2.in",
        })
        .to(
          actionsRef.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            pointerEvents: "auto",
            duration: 0.35,
            ease: "back.out(1.6)",
          },
          "<0.08",
        )
        .to(
          legalRef.current,
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
          ">-0.1",
        )
        .to(
          backToTopRef.current,
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          "<0.1",
        );

      // ---------- FOOTER CHROMATIC TORCH COLOR SYSTEM ----------
      const TORCH_PALETTE = [
        { r: 56, g: 189, b: 248 }, // Electric Cyan (#38bdf8)
        { r: 231, g: 255, b: 61 }, // Electric Lime (#e7ff3d)
        { r: 143, g: 208, b: 255 }, // Sky Ice Blue (#8fd0ff)
        { r: 42, g: 130, b: 255 }, // Royal Blue (#2a82ff)
        { r: 218, g: 60, b: 240 }, // Neon Violet (#da3cf0)
        { r: 255, g: 214, b: 10 }, // Radiant Yellow (#ffd60a)
        { r: 255, g: 120, b: 18 }, // Sunset Orange (#ff7812)
      ];

      const torchColorObj = { ...TORCH_PALETTE[0] };
      const setGlowCssVar = () => {
        if (!footerRef.current) return;
        const { r, g, b } = torchColorObj;
        footerRef.current.style.setProperty(
          "--torch-color",
          `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
        );
        footerRef.current.style.setProperty(
          "--torch-glow",
          `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.95)`
        );
        footerRef.current.style.setProperty(
          "--torch-glow-soft",
          `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.28)`
        );
        footerRef.current.style.setProperty(
          "--torch-dim",
          `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.08)`
        );
      };
      setGlowCssVar();

      const colorTl = gsap.timeline({ repeat: -1 });
      for (let i = 0; i < TORCH_PALETTE.length; i++) {
        const next = TORCH_PALETTE[(i + 1) % TORCH_PALETTE.length];
        colorTl.to(torchColorObj, {
          r: next.r,
          g: next.g,
          b: next.b,
          duration: 3.2,
          ease: "sine.inOut",
          onUpdate: setGlowCssVar,
        });
      }

      // ---------- FOOTER TORCH DOTS PROXIMITY REVEAL ----------
      const dotsGlow = footerDotsGlowRef.current;
      const torchAura = footerTorchAuraRef.current;
      const footer = footerRef.current;
      let onFooterEnter: ((e: PointerEvent) => void) | null = null;
      let onFooterMove: ((e: PointerEvent) => void) | null = null;
      let onFooterLeave: ((e: PointerEvent) => void) | null = null;

      if (footer && dotsGlow) {
        const dotGlow = { x: -9999, y: -9999, opacity: 0 };

        const applyDotGlow = () => {
          if (!dotsGlow) return;
          dotsGlow.style.setProperty("--dx", `${dotGlow.x}px`);
          dotsGlow.style.setProperty("--dy", `${dotGlow.y}px`);
          dotsGlow.style.opacity = `${dotGlow.opacity}`;
          if (torchAura) {
            torchAura.style.setProperty("--dx", `${dotGlow.x}px`);
            torchAura.style.setProperty("--dy", `${dotGlow.y}px`);
            torchAura.style.opacity = `${dotGlow.opacity * 0.75}`;
          }
        };

        const dotGlowX = gsap.quickTo(dotGlow, "x", {
          duration: 0.25,
          ease: "power2.out",
          onUpdate: applyDotGlow,
        });
        const dotGlowY = gsap.quickTo(dotGlow, "y", {
          duration: 0.25,
          ease: "power2.out",
          onUpdate: applyDotGlow,
        });
        const dotGlowOpacity = gsap.quickTo(dotGlow, "opacity", {
          duration: 0.35,
          ease: "power2.out",
          onUpdate: applyDotGlow,
        });

        onFooterEnter = (e: PointerEvent) => {
          const r = footer.getBoundingClientRect();
          const cx = e.clientX - r.left;
          const cy = e.clientY - r.top;
          dotGlow.x = cx;
          dotGlow.y = cy;
          dotGlow.opacity = 1;
          applyDotGlow();
          dotGlowX(cx);
          dotGlowY(cy);
          dotGlowOpacity(1);
        };

        onFooterMove = (e: PointerEvent) => {
          const r = footer.getBoundingClientRect();
          const cx = e.clientX - r.left;
          const cy = e.clientY - r.top;
          dotGlowX(cx);
          dotGlowY(cy);
          dotGlowOpacity(1);
        };

        onFooterLeave = () => {
          dotGlowOpacity(0);
        };

        footer.addEventListener("pointerenter", onFooterEnter);
        footer.addEventListener("pointermove", onFooterMove);
        footer.addEventListener("pointerleave", onFooterLeave);

        return () => {
          if (onFooterEnter) footer.removeEventListener("pointerenter", onFooterEnter);
          if (onFooterMove) footer.removeEventListener("pointermove", onFooterMove);
          if (onFooterLeave) footer.removeEventListener("pointerleave", onFooterLeave);
          colorTl.kill();
        };
      }
    },
    { scope: containerRef },
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ================= FOOTER ================= */}
      <div className="w-full bg-white">
        <footer
          ref={footerRef}
          id="resources"
          className="relative -mt-px flex min-h-svh w-full flex-col justify-between overflow-hidden px-6 pt-[clamp(36px,6vh,72px)] pb-6 sm:pb-8 text-white sm:px-10 lg:px-16"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #f4f8fe 6%, #e2effd 14%, #afd0fa 25%, #66a0f6 38%, #2874ed 50%, #1757d2 64%, #103fa7 78%, #0a1c52 90%, #06133a 100%)",
          }}
        >
          {/* Torch Aura Glow Layer (Cursor-following ambient glow) */}
          <div
            ref={footerTorchAuraRef}
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              opacity: 0,
              background:
                "radial-gradient(220px circle at var(--dx, -9999px) var(--dy, -9999px), var(--torch-glow-soft, rgba(56,189,248,0.25)) 0%, var(--torch-dim, rgba(231,255,61,0.06)) 50%, transparent 75%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 18%, black 45%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 18%, black 45%)",
            }}
          />

          {/* Dot Grid System: Base Dim Layer + Cursor-Revealed Bright Torch Dots */}
          <div
            ref={footerDotsRef}
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.2) 1.2px, transparent 1.6px)",
              backgroundSize: "26px 26px",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 20%, black 40%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 20%, black 40%)",
            }}
          >
            {/* Layer 2: Bright Torch Glowing Dots (Cursor Revealed) */}
            <div
              ref={footerDotsGlowRef}
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0,
                backgroundImage:
                  "radial-gradient(var(--torch-color, rgba(255,255,255,0.95)) 1.85px, transparent 2.4px)",
                backgroundSize: "26px 26px",
                maskImage:
                  "radial-gradient(180px circle at var(--dx, -9999px) var(--dy, -9999px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 45%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(180px circle at var(--dx, -9999px) var(--dy, -9999px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 45%, transparent 70%)",
              }}
            />
          </div>

          {/* Floating gradient orbs for depth */}
          <div
            ref={orb1Ref}
            className="pointer-events-none absolute -left-24 top-[22%] z-0 h-85 w-85 rounded-full opacity-30 blur-3xl sm:h-105 sm:w-105"
            style={{
              background:
                "radial-gradient(circle, #e7ff3d 0%, transparent 70%)",
            }}
          />
          <div
            ref={orb2Ref}
            className="pointer-events-none absolute -bottom-32 -right-16 z-0 h-75 w-75 rounded-full opacity-25 blur-3xl sm:h-95 sm:w-95"
            style={{
              background:
                "radial-gradient(circle, #7fb0ff 0%, transparent 70%)",
            }}
          />

          {/* Stage: Vertically centered in available viewport space */}
          <div className="relative z-10 mx-auto flex w-full max-w-372 px-4 sm:px-8 lg:px-12 flex-1 flex-col items-center justify-center">
            {/* Stage: wordmark and nav content */}
            <div className="relative flex w-full items-center justify-center min-h-115 sm:min-h-125 lg:min-h-130">
              <div ref={wordmarkRef} className="flex w-full justify-center items-center py-8 sm:py-16">
                <Image
                  src="/home/logo.png"
                  alt="Virtual Captains"
                  width={1200}
                  height={240}
                  className="h-auto w-[min(1100px,92%)] drop-shadow-[0_8px_40px_rgba(0,0,0,0.25)] lg:w-[min(1100px,76%)] object-contain"
                  priority={false}
                />
              </div>

              {/* Revealed 4-Column Directory Grid & Action Bar */}
              <div
                ref={actionsRef}
                className="absolute inset-0 flex flex-col justify-between py-2 sm:py-4 w-full pointer-events-none"
              >
                {/* Header Row: Micro-Pills */}
                <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-2.5 border-b border-white/10 pb-5 w-full">
                  {[
                    { text: "Practical Support", dot: "#38bdf8", glow: "rgba(56,189,248,0.7)" },
                    { text: "Real-World Experience", dot: "#e7ff3d", glow: "rgba(231,255,61,0.7)" },
                    { text: "Measurable Impact", dot: "#8fd0ff", glow: "rgba(143,208,255,0.7)" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/4 backdrop-blur-md px-3.5 py-1.5 text-[11px] sm:text-xs font-medium text-white/85 shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-300 hover:border-white/35 hover:bg-white/10 hover:text-white hover:scale-105 select-none"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                        style={{
                          backgroundColor: item.dot,
                          boxShadow: `0 0 8px ${item.glow}`,
                        }}
                      />
                      <span className="tracking-wide">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Multi-Column Links of Different Pages */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 w-full py-4 sm:py-6">
                  {/* Column 1: Company / Main Pages */}
                  <div className="flex flex-col gap-2.5 sm:gap-3">
                    <p className="font-mono text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.22em] text-[#38bdf8]">
                      Company
                    </p>
                    <nav className="flex flex-col gap-2 text-xs sm:text-[13.5px] text-white/75" aria-label="Company Links">
                      <Link href="/" className="w-fit transition-colors hover:text-white">Home</Link>
                      <Link href="/about" className="w-fit transition-colors hover:text-white">About Us</Link>
                      <Link href="/individuals" className="w-fit transition-colors hover:text-white">For Individuals</Link>
                      <Link href="/organisations" className="w-fit transition-colors hover:text-white">For Organisations</Link>
                      <Link href="/partner" className="w-fit transition-colors hover:text-white">Hiring Partners</Link>
                    </nav>
                  </div>

                  {/* Column 2: Programmes */}
                  <div className="flex flex-col gap-2.5 sm:gap-3">
                    <p className="font-mono text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.22em] text-[#e7ff3d]">
                      Programmes
                    </p>
                    <nav className="flex flex-col gap-2 text-xs sm:text-[13.5px] text-white/75" aria-label="Programmes Links">
                      <Link href="/salesx" className="w-fit transition-colors hover:text-white">SalesX Training</Link>
                      <Link href="/organisations#programmes-showcase" className="w-fit transition-colors hover:text-white">Groom Studio</Link>
                      <Link href="/organisations#programmes-showcase" className="w-fit transition-colors hover:text-white">Sales Floor Audit</Link>
                      <Link href="/organisations#programmes-showcase" className="w-fit transition-colors hover:text-white">Outbound Engine</Link>
                      <Link href="/individuals#curriculum" className="w-fit transition-colors hover:text-white">12-Week Curriculum</Link>
                    </nav>
                  </div>

                  {/* Column 3: Resources & Contact */}
                  <div className="flex flex-col gap-2.5 sm:gap-3">
                    <p className="font-mono text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.22em] text-[#8fd0ff]">
                      Resources
                    </p>
                    <nav className="flex flex-col gap-2 text-xs sm:text-[13.5px] text-white/75" aria-label="Resources Links">
                      <Link href="/blog" className="w-fit transition-colors hover:text-white">Field Notes & Blogs</Link>
                      <Link href="/newsletter" className="w-fit transition-colors hover:text-white">Newsletter</Link>
                      <Link href="/contact" className="w-fit transition-colors hover:text-white">Contact Sales Floor</Link>
                      <Link href="/privacy" className="w-fit transition-colors hover:text-white">Privacy Policy</Link>
                      <Link href="/terms" className="w-fit transition-colors hover:text-white">Terms &amp; Conditions</Link>
                      <Link href="/refund" className="w-fit transition-colors hover:text-white">Refund / Cancellation</Link>
                    </nav>
                  </div>

                  {/* Column 4: Booking & Quick Connect */}
                  <div className="flex flex-col gap-3 col-span-2 sm:col-span-2 md:col-span-1">
                    <p className="font-mono text-[10.5px] sm:text-[11.5px] font-semibold uppercase tracking-[0.22em] text-white/90">
                      Talk to a Captain
                    </p>
                    <p className="text-xs text-white/65 leading-relaxed">
                      Straight conversation about where your sales floor can scale.
                    </p>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setIsBookingOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-white px-6 py-2.5 text-xs sm:text-sm font-bold text-black tracking-wide shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.18)] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                      >
                        <span>Book a Call</span>
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal / Copyright Bar: Cleanly anchored at the bottom with no dead void */}
            <div
              ref={legalRef}
              className="relative z-10 mx-auto mt-auto flex w-full max-w-372 px-4 sm:px-8 lg:px-12 flex-col items-center gap-3 border-t border-white/15 pt-5 sm:pt-6 pb-1 text-[11px] text-white/65 sm:flex-row sm:justify-between sm:text-[12px]"
            >
              <div className="order-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:order-1 sm:justify-start">
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
                <span className="text-white/30 select-none">·</span>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-white"
                >
                  Terms &amp; Conditions
                </Link>
                <span className="text-white/30 select-none">·</span>
                <Link
                  href="/refund"
                  className="transition-colors hover:text-white"
                >
                  Refund Policy
                </Link>
                <span className="text-white/30 select-none">·</span>
                <Link
                  href="/refund#disclaimer"
                  className="transition-colors hover:text-white"
                >
                  Disclaimer
                </Link>
              </div>
              <p className="order-1 text-center sm:order-2">
                © All Rights Reserved by Virtual Captains{" "}
                {new Date().getFullYear()}
              </p>
              <p className="order-3">
                Built by <span className="text-white/85">Web WeDesign</span>
              </p>
            </div>
          </div>

          {/* back-to-top affordance */}
          <button
            ref={backToTopRef}
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="absolute bottom-6 right-6 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#0a1c52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:bottom-8 sm:right-8"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-none stroke-current stroke-2"
            >
              <path
                d="M12 19V5M5 12l7-7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </footer>
      </div>

      <BookACallModal
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
