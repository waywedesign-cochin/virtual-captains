"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BookACallModal from "./BookACallModal";
import DottedBackground from "./DottedBackground";

gsap.registerPlugin(ScrollTrigger);

/**
 * The closing "Book a Call" band plus the site footer.
 *
 * CTA: cursor-follow fill (same interaction language as the hero buttons),
 * now with a floating-label micro-animation, a subtle idle "breathing"
 * glow, and an arrow that slides in on hover to add a bit of intent.
 *
 * Footer: pinned two-phase handoff — big lone wordmark first, then it
 * shrinks/fades while the real footer content (nav buttons, socials, legal
 * row) slides in from the side. Added: animated gradient mesh background,
 * floating orbs for depth, a magnetic hover effect on the nav buttons, and
 * a top-of-page "back to top" affordance. Fully responsive down to small
 * mobile widths, and everything degrades gracefully under
 * prefers-reduced-motion.
 */
interface SiteFooterProps {
  showCTA?: boolean;
  theme?: "default" | "subtle" | "dark" | "light-blue";
}

export default function SiteFooter({
  showCTA = true,
  theme,
}: SiteFooterProps) {
  const pathname = usePathname();
  const isLightBlue =
    theme === "light-blue" ||
    pathname === "/individuals" ||
    showCTA ||
    theme === "default";

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const ctaFillRef = useRef<HTMLSpanElement>(null);
  const ctaLabelRef = useRef<HTMLSpanElement>(null);
  const ctaArrowRef = useRef<HTMLSpanElement>(null);
  const ctaEyebrowRef = useRef<HTMLParagraphElement>(null);

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
        if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 1, y: 0, scale: 1 });
        if (ctaEyebrowRef.current) gsap.set(ctaEyebrowRef.current, { opacity: 1, y: 0 });
        if (wordmarkRef.current) gsap.set(wordmarkRef.current, { opacity: 0, visibility: "hidden", display: "none" });
        if (actionsRef.current) gsap.set(actionsRef.current, { opacity: 1, y: 0, scale: 1, pointerEvents: "auto", visibility: "visible" });
        if (legalRef.current) gsap.set(legalRef.current, { opacity: 1, x: 0 });
        if (backToTopRef.current) gsap.set(backToTopRef.current, { opacity: 1, y: 0 });
        return;
      }

      // ---------- CTA band (only when showCTA is enabled) ----------
      let cleanupCTA: (() => void) | undefined;

      if (showCTA && ctaSectionRef.current && ctaRef.current) {
        gsap.set(ctaEyebrowRef.current, { opacity: 0, y: 14 });
        gsap.set(ctaRef.current, { opacity: 0, scale: 0.65, y: 20 });

        const ctaTl = gsap.timeline({
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });
        ctaTl
          .to(ctaEyebrowRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          })
          .to(
            ctaRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              keyframes: [
                {
                  scale: 1.15,
                  opacity: 1,
                  y: -4,
                  duration: 0.42,
                  ease: "power2.out",
                },
                { scale: 0.94, y: 2, duration: 0.22, ease: "sine.inOut" },
                { scale: 1.0, y: 0, duration: 0.21, ease: "power2.out" },
              ],
            },
            "-=0.25",
          );

        // idle breathing glow behind the CTA
        gsap.to(ctaRef.current, {
          boxShadow: "0 0 0 14px rgba(231,255,61,0.06)",
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        const button = ctaRef.current;
        const fill = ctaFillRef.current;
        const arrow = ctaArrowRef.current;

        if (button && fill) {
          const grow = (x: number, y: number) => {
            const rect = button.getBoundingClientRect();
            const size = Math.hypot(rect.width, rect.height) * 2.2;
            gsap.set(fill, {
              width: size,
              height: size,
              left: x,
              top: y,
              xPercent: -50,
              yPercent: -50,
            });
            gsap.to(fill, {
              scale: 1,
              duration: 0.6,
              ease: "power3.out",
              overwrite: true,
            });
            gsap.to(ctaLabelRef.current, {
              color: "#0a0b0f",
              duration: 0.35,
              ease: "power2.out",
              overwrite: true,
            });
            gsap.to(arrow, {
              color: "#0a0b0f",
              duration: 0.35,
              ease: "power2.out",
              overwrite: true,
            });
            gsap.to(button, {
              scale: 1.03,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          };

          const shrink = (x: number, y: number) => {
            gsap.set(fill, { left: x, top: y });
            gsap.to(fill, {
              scale: 0,
              duration: 0.4,
              ease: "power2.in",
              overwrite: true,
            });
            gsap.to(ctaLabelRef.current, {
              color: "#101010",
              duration: 0.3,
              ease: "power2.in",
              overwrite: true,
            });
            gsap.to(arrow, {
              color: "#101010",
              duration: 0.3,
              ease: "power2.in",
              overwrite: true,
            });
            gsap.to(button, {
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          };

          const onEnter = (e: PointerEvent) => {
            const rect = button.getBoundingClientRect();
            grow(e.clientX - rect.left, e.clientY - rect.top);
          };
          const onMove = (e: PointerEvent) => {
            const rect = button.getBoundingClientRect();
            gsap.to(fill, {
              left: e.clientX - rect.left,
              top: e.clientY - rect.top,
              duration: 0.5,
              ease: "power3.out",
            });
          };
          const onLeave = (e: PointerEvent) => {
            const rect = button.getBoundingClientRect();
            shrink(e.clientX - rect.left, e.clientY - rect.top);
          };

          button.addEventListener("pointerenter", onEnter);
          button.addEventListener("pointermove", onMove);
          button.addEventListener("pointerleave", onLeave);

          cleanupCTA = () => {
            button.removeEventListener("pointerenter", onEnter);
            button.removeEventListener("pointermove", onMove);
            button.removeEventListener("pointerleave", onLeave);
          };
        }
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

      // ---------- Footer pinned reveal with zero opacity clashing ----------
      const mm = gsap.matchMedia();

      // Desktop (>= 1024px): Clean, strictly sequential transition with zero opacity overlap
      mm.add("(min-width: 1024px)", () => {
        gsap.set(wordmarkRef.current, { opacity: 0, y: 30, scale: 1, visibility: "visible" });
        gsap.set(actionsRef.current, { opacity: 0, scale: 0.92, y: 16, pointerEvents: "none", visibility: "hidden" });
        gsap.set(legalRef.current, { opacity: 0, x: 50 });
        gsap.set(backToTopRef.current, { opacity: 0, y: 12 });

        if (!footerRef.current) return;

        const footerTl = gsap.timeline({
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            refreshPriority: -1,
          },
        });

        footerTl
          // 1. Wordmark fades in cleanly
          .to(wordmarkRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.28,
            ease: "power2.out",
          })
          .to({}, { duration: 0.16 }) // hold wordmark
          // 2. Wordmark fades OUT COMPLETELY to 0 before actions ever begins
          .to(wordmarkRef.current, {
            opacity: 0,
            scale: 0.85,
            duration: 0.22,
            ease: "power2.in",
          })
          // Immediately hide wordmark from rendering
          .set(wordmarkRef.current, { visibility: "hidden" })
          // 3. Actions reveals ONLY AFTER wordmark is 100% gone
          .set(actionsRef.current, { visibility: "visible" })
          .to(
            actionsRef.current,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              pointerEvents: "auto",
              duration: 0.3,
              ease: "back.out(1.4)",
            },
            "+=0.04", // Positive gap ensures ZERO opacity overlap/clashing!
          )
          .to(
            legalRef.current,
            { opacity: 1, x: 0, duration: 0.28, ease: "power2.out" },
            "-=0.1",
          )
          .to(
            backToTopRef.current,
            { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
            "<0.05",
          )
          .to({}, { duration: 0.15 });

        return () => footerTl.kill();
      });

      // Mobile & Tablet (< 1024px): Direct reveal with actions immediately primary
      mm.add("(max-width: 1023px)", () => {
        gsap.set(wordmarkRef.current, { opacity: 0, display: "none", visibility: "hidden" });
        gsap.set(actionsRef.current, { opacity: 0, y: 24, scale: 0.95, pointerEvents: "auto", visibility: "visible" });
        gsap.set(legalRef.current, { opacity: 0, y: 20 });
        gsap.set(backToTopRef.current, { opacity: 0, y: 12 });

        if (!footerRef.current) return;

        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        mobileTl
          .to(actionsRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
          })
          .to(
            legalRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.25",
          )
          .to(
            backToTopRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: "power2.out",
            },
            "<0.1",
          );

        return () => mobileTl.kill();
      });

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
      }

      return () => {
        cleanupCTA?.();
        colorTl.kill();
        if (footer && onFooterEnter) footer.removeEventListener("pointerenter", onFooterEnter);
        if (footer && onFooterMove) footer.removeEventListener("pointermove", onFooterMove);
        if (footer && onFooterLeave) footer.removeEventListener("pointerleave", onFooterLeave);
      };
    },
    { scope: containerRef },
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={containerRef}>
      {/* ================= BOOK A CALL (Optional) ================= */}
      {showCTA && (
        <section
          ref={ctaSectionRef}
          className="relative -mt-px z-10 flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-20 text-center sm:px-10"
        >
          {/* Subtle Dotted Background (matching second section) */}
          <DottedBackground theme="light" />
          {/* soft luminous vignette */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 45%, transparent 35%, rgba(255,255,255,0.7) 100%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-[clamp(18px,3vh,32px)]">
            <p
              ref={ctaEyebrowRef}
              className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/60 sm:text-[12px]"
            >
              Ready when you are
            </p>

            <button
              ref={ctaRef}
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="group relative isolate cursor-pointer overflow-hidden rounded-full border border-black/25 bg-white/80 backdrop-blur-md px-[clamp(34px,7vw,90px)] py-[clamp(14px,2.4vh,26px)] font-serif text-[clamp(1.4rem,3.4vw,2.75rem)] leading-none transition-all duration-300 hover:border-black/40 hover:shadow-[0_12px_40px_rgba(47,111,224,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-4"
              aria-label="Book a call with Virtual Captains"
            >
              <span
                ref={ctaFillRef}
                className="pointer-events-none absolute z-0 rounded-full bg-[#e7ff3d]"
                style={{ width: 0, height: 0, transform: "scale(0)" }}
              />
              <span className="relative z-10 inline-flex items-center gap-3">
                <span ref={ctaLabelRef} className="text-[#101010]">
                  Book a Call
                </span>
                <span
                  ref={ctaArrowRef}
                  className="inline-block text-[0.75em]"
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              </span>
            </button>

            <p className="mt-2 text-center font-serif text-[clamp(1.25rem,2.5vw,2rem)] font-medium text-[#101010] tracking-tight">
              Great Conversations Create Greater Possibilities
            </p>
          </div>
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <div className={`w-full ${isLightBlue ? "bg-[#06133a]" : "bg-[#020B25]"}`}>
        <footer
          ref={footerRef}
          id="resources"
          className="relative -mt-px flex min-h-svh w-full flex-col justify-between overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 pt-[clamp(36px,6vh,72px)] pb-6 sm:pb-8 text-white"
          style={{
            background: isLightBlue
              ? "linear-gradient(180deg, #ffffff 0%, #f4f8fe 6%, #e2effd 14%, #afd0fa 25%, #66a0f6 38%, #2874ed 50%, #1757d2 64%, #103fa7 78%, #0a1c52 90%, #06133a 100%)"
              : "#020B25",
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

          {/* Dot Grid System with Torch Glow Proximity */}
          <div
            ref={footerDotsRef}
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
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
                  "radial-gradient(var(--torch-color, rgba(255,255,255,0.95)) 1.5px, transparent 2.4px)",
                backgroundSize: "32px 32px",
                maskImage:
                  "radial-gradient(180px circle at var(--dx, -9999px) var(--dy, -9999px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 45%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(180px circle at var(--dx, -9999px) var(--dy, -9999px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 45%, transparent 70%)",
              }}
            />
          </div>

          {/* floating gradient orbs for depth */}
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

          {/* Main Stage: Vertically centered in available viewport space */}
          <div className="relative z-10 mx-auto flex w-full max-w-350 flex-1 flex-col items-center justify-center">
            {/* Stage: wordmark and nav buttons occupy the exact same footprint,
              stacked on top of each other, so as the logo fades away the
              links are already sitting right where it was — no dead space,
              no slide-in-from-nowhere. */}
            <div className="relative flex w-full min-h-55 sm:min-h-62.5 md:min-h-67.5 items-center justify-center">
              <div ref={wordmarkRef} className="flex w-full justify-center">
                <Image
                  src="/home/logo.png"
                  alt="Virtual Captains"
                  width={1200}
                  height={240}
                  // w-[min(1100px,76%)]: sized against the padded container's
                  // own width, not the raw viewport (92vw ignored the container's
                  // lg:px-16 padding and overflowed past it at lg widths). 76%
                  // (not 92%) is deliberate: it leaves enough centering margin
                  // that the logo's left edge clears the fixed SideNav's ~160px
                  // footprint too — the nav stays bold on "Hiring Partners"
                  // through the whole footer, so this isn't just a container-fit
                  // problem, it needs real clearance from the page edge.
                  className="h-auto w-[min(1100px,92%)] drop-shadow-[0_8px_40px_rgba(0,0,0,0.25)] lg:w-[min(1100px,76%)] object-contain"
                  priority={false}
                />
              </div>

              <div
                ref={actionsRef}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 sm:gap-5 px-4"
              >
                <p className="text-center font-serif font-bold text-[clamp(1.4rem,2.8vw,2.35rem)] text-white tracking-tight drop-shadow-sm">
                  Trusted Partner for <br /> People, Teams & Organizations
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <Link
                    href="/individuals"
                    className="cursor-pointer rounded-full border border-white/45 bg-white/5 px-6 sm:px-7 py-2.5 sm:py-3 text-[12px] sm:text-[13.5px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0a1c52] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    For Individuals
                  </Link>
                  <Link
                    href="/organisations"
                    className="cursor-pointer rounded-full border border-white/45 bg-white/5 px-6 sm:px-7 py-2.5 sm:py-3 text-[12px] sm:text-[13.5px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0a1c52] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    For Organisations
                  </Link>
                </div>

                {/* Styled Glowing Jewel Micro-Capsules: Practical Support | Real-World Experience | Measurable Impact */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1.5 max-w-2xl mx-auto">
                  {[
                    { text: "Practical Support", dot: "#38bdf8", glow: "rgba(56,189,248,0.75)" },
                    { text: "Real-World Experience", dot: "#e5ff00", glow: "rgba(229,255,0,0.75)" },
                    { text: "Measurable Impact", dot: "#8fd0ff", glow: "rgba(143,208,255,0.75)" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs md:text-[12.5px] font-medium text-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-300 hover:border-white/40 hover:bg-white/12 hover:text-white hover:scale-105 select-none"
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
          </div>

          {/* Legal / Copyright Bar: Cleanly anchored at the bottom with no dead void */}
          <div
            ref={legalRef}
            className="relative z-10 mx-auto mt-auto flex w-full max-w-350 flex-col items-center gap-3 border-t border-white/15 pt-5 sm:pt-6 pb-1 text-[11px] text-white/65 sm:flex-row sm:justify-between sm:text-[12px]"
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

          {/* back-to-top affordance, only meaningful once the footer content
            has actually revealed */}
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
