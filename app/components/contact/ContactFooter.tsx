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
 * Dedicated Interactive Footer for Contact Page.
 *
 * Features:
 * - Dark luxury background seamless with the contact page (#040507 -> #06133a).
 * - Pinned two-phase reveal with the wide /home/logo.png wordmark.
 * - Header: "Trusted Partner for People, Teams & Organizations".
 * - Buttons with liquid hover linking directly to For Individuals and For Organisations.
 * - 3 glowing jewel micro-capsules: Practical Support, Real-World Experience, Measurable Impact.
 * - Dual-layer chromatic cycling torch dots with cursor proximity revealing.
 * - Ambient cursor aura glow.
 * - Back-to-top button.
 */
export default function ContactFooter() {
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
      <div className="w-full bg-[#040507]">
        <footer
          ref={footerRef}
          id="resources"
          className="relative -mt-px flex min-h-svh w-full flex-col justify-center overflow-hidden px-6 py-[clamp(48px,9vh,110px)] text-white sm:px-10 lg:px-16"
          style={{
            background:
              "linear-gradient(180deg, #040507 0%, #06112c 25%, #0e307e 55%, #0a1c52 82%, #06133a 100%)",
          }}
        >
          {/* Torch Aura Glow Layer */}
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

          {/* Dot Grid System */}
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

          {/* Floating orbs */}
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

          <div className="relative z-10 mx-auto flex w-full max-w-350 flex-col items-center">
            {/* Stage: wordmark and nav buttons */}
            <div className="relative flex w-full items-center justify-center">
              <div ref={wordmarkRef} className="flex w-full justify-center">
                <Image
                  src="/home/logo.png"
                  alt="Virtual Captains"
                  width={1200}
                  height={240}
                  className="h-auto w-[min(1100px,92%)] drop-shadow-[0_8px_40px_rgba(0,0,0,0.25)] lg:w-[min(1100px,76%)] object-contain"
                  priority={false}
                />
              </div>

              <div
                ref={actionsRef}
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-4 sm:gap-6"
              >
                <p className="text-center font-serif font-bold text-[clamp(1.5rem,3vw,2.5rem)] text-white tracking-tight drop-shadow-sm">
                  Trusted Partner for <br /> People, Teams & Organizations
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <Link
                    href="/individuals"
                    className="cursor-pointer rounded-full border border-white/45 bg-white/5 px-7 py-3 text-[12.5px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0a1c52] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-[13.5px]"
                  >
                    For Individuals
                  </Link>
                  <Link
                    href="/organisations"
                    className="cursor-pointer rounded-full border border-white/45 bg-white/5 px-7 py-3 text-[12.5px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0a1c52] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-[13.5px]"
                  >
                    For Organisations
                  </Link>
                </div>

                {/* Styled Cool Micro-Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-2">
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
              </div>
            </div>

            <div
              ref={legalRef}
              className="mt-[clamp(32px,6vh,72px)] flex w-full flex-col items-center gap-3 border-t border-white/15 py-6 text-[11px] text-white/65 sm:flex-row sm:justify-between sm:text-[12px]"
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
