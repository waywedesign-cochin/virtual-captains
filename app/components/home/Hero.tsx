"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import Image from "next/image";

/**
 * Hero section for Virtual Captains.
 *
 * Layout notes:
 * - The section is `min-h-[100svh]` and laid out as a column with the nav
 *   pinned top, the headline centered in the remaining space, and the
 *   sub-nav pinned bottom. That's what guarantees the bottom link row is
 *   visible on first paint on any device, instead of relying on a fixed
 *   pixel height that only works on one screen size.
 * - Headline font-size and vertical spacing use `clamp()` mixing `vw` and
 *   `vh` units, so text shrinks on short/landscape viewports as well as
 *   narrow ones (a pure `vw` clamp only handles width, and can overflow a
 *   short laptop or landscape-phone screen).
 * - `max-w-[1920px] mx-auto` caps the hero on ultra-wide monitors while
 *   staying full-bleed on everything at or below that.
 *
 * Animation split:
 * - GSAP: page-load timeline, cursor-driven glow/grid parallax, the
 *   magnetic pull on buttons, and the liquid-fill hover blob on the CTA
 *   pills — all continuous/imperative jobs.
 * - Motion (`motion/react`): the simple declarative hover/tap state on the
 *   "Book a call" button.
 *
 * Requires: `npm install gsap motion`
 */

const NAV_LINKS = [
  "About",
  "SalesX",
  "Organisations",
  "Individuals",
  "Partner",
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".hero-word-base, .hero-word-highlight, .hero-cta-pill, .hero-subnav a", {
          opacity: 1,
          y: 0,
          clearProps: "all",
        });
        return;
      }

      // ---------- INTRO TIMELINE ----------
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-logo", { opacity: 0, y: -16, duration: 0.7 })
        .from(".hero-nav-pill", { opacity: 0, y: -16, duration: 0.7 }, "<0.08")
        .from(".hero-book-btn", { opacity: 0, y: -16, duration: 0.7 }, "<0.08")
        .from(
          ".hero-word-base, .hero-word-highlight",
          {
            opacity: 0,
            y: 36,
            rotateX: 25,
            transformOrigin: "50% 100%",
            stagger: 0.045,
            duration: 1.1,
            ease: "expo.out",
            clearProps: "all",
          },
          "-=0.25",
        )
        .from(
          ".hero-cta-pill",
          {
            opacity: 0,
            y: 22,
            scale: 0.85,
            stagger: 0.14,
            duration: 0.9,
            ease: "back.out(1.6)",
          },
          "-=0.5",
        )
        .from(
          ".hero-subnav a",
          { opacity: 0, y: 12, stagger: 0.06, duration: 0.6 },
          "-=0.45",
        );

      // ambient gentle glow pulse on the accent word
      gsap.to(".hero-accent-base", {
        textShadow: "0 0 20px rgba(143,208,255,0.45)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ambient breathing glow
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.08,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "50% 50%",
        });
      }

      // ---------- CURSOR PARALLAX ----------
      const hero = heroRef.current;
      const highlightLayer = highlightRef.current;
      if (hero && glowRef.current && dotsRef.current) {
        const glowX = gsap.quickTo(glowRef.current, "x", {
          duration: 1.1,
          ease: "power3.out",
        });
        const glowY = gsap.quickTo(glowRef.current, "y", {
          duration: 1.1,
          ease: "power3.out",
        });
        const dotsX = gsap.quickTo(dotsRef.current, "x", {
          duration: 1.6,
          ease: "power3.out",
        });
        const dotsY = gsap.quickTo(dotsRef.current, "y", {
          duration: 1.6,
          ease: "power3.out",
        });

        // Spotlight setup
        const spotPos = { x: window.innerWidth / 2, y: window.innerHeight / 2, opacity: 0 };
        let spotlightX: ((val: number) => void) | null = null;
        let spotlightY: ((val: number) => void) | null = null;
        let spotlightOpacity: ((val: number) => void) | null = null;

        if (highlightLayer) {
          const updateMask = () => {
            highlightLayer.style.setProperty("--mx", `${spotPos.x}px`);
            highlightLayer.style.setProperty("--my", `${spotPos.y}px`);
            highlightLayer.style.opacity = `${spotPos.opacity}`;
          };
          spotlightX = gsap.quickTo(spotPos, "x", { duration: 0.5, ease: "power3.out", onUpdate: updateMask });
          spotlightY = gsap.quickTo(spotPos, "y", { duration: 0.5, ease: "power3.out", onUpdate: updateMask });
          spotlightOpacity = gsap.quickTo(spotPos, "opacity", { duration: 0.5, ease: "power2.out", onUpdate: updateMask });
          updateMask();
        }

        const handleMove = (e: MouseEvent) => {
          const r = hero.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          glowX(px * 220);
          glowY(py * 220);
          dotsX(px * -18);
          dotsY(py * -14);

          if (highlightLayer && spotlightX && spotlightY && spotlightOpacity) {
            const hlRect = highlightLayer.getBoundingClientRect();
            spotlightX(e.clientX - hlRect.left);
            spotlightY(e.clientY - hlRect.top);
            spotlightOpacity(1);
          }
        };
        const handleLeave = () => {
          glowX(0);
          glowY(0);
          dotsX(0);
          dotsY(0);

          if (spotlightOpacity) {
            spotlightOpacity(0);
          }
        };

        hero.addEventListener("mousemove", handleMove);
        hero.addEventListener("mouseleave", handleLeave);

        return () => {
          hero.removeEventListener("mousemove", handleMove);
          hero.removeEventListener("mouseleave", handleLeave);
        };
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative mx-auto flex min-h-svh w-full max-w-[1920px] flex-col overflow-hidden rounded-b-[18px] bg-[#040507] sm:rounded-b-3xl lg:rounded-b-[28px]"
    >
      {/* diagonal gradient base */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 100% at -5% -10%, #3f74e6 0%, #1c4fc0 12%, #0c318f 26%, #051d5c 42%, #050b24 60%, #040507 78%)",
        }}
      />

      {/* cursor-reactive glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -left-56 -top-56 z-1 h-140 w-140 rounded-full blur-[6px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(90,150,255,0.35) 0%, rgba(60,110,230,0.12) 45%, transparent 72%)",
        }}
      />

      {/* dot grid */}
      <div
        ref={dotsRef}
        className="pointer-events-none absolute -inset-10 z-1 will-change-transform"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1.4px)",
          backgroundSize: "26px 26px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.5) 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.5) 70%, transparent 100%)",
        }}
      />

      {/* ---------- NAV (pinned top) ---------- */}
      <nav className="relative z-3 flex items-center justify-between gap-2 px-3 pt-[clamp(14px,3vh,40px)] xs:px-4 sm:gap-3 sm:px-10 lg:px-14">
        <div className="hero-logo flex items-center gap-2">
          <Logo className="h-8 w-32 shrink-0 sm:h-11 sm:w-48 lg:h-12 lg:w-52" />
        </div>

        <div className="hero-nav-pill flex items-center gap-0.5 rounded-full bg-[#eef0f4] p-0.5 sm:p-1.5">
          <button
            type="button"
            className="rounded-full px-2.5 py-1 text-[11px] font-medium text-[#20232b] transition-colors sm:px-5 sm:py-2 sm:text-[13.5px]"
          >
            Home
          </button>
          <button
            type="button"
            className="flex items-center gap-0.5 rounded-full bg-[#0a0b0d] px-2.5 py-1 text-[11px] font-medium text-[#e7ff3d] sm:px-5 sm:py-2 sm:text-[13.5px]"
          >
            Role&nbsp;-&nbsp;play
          </button>
        </div>

        <motion.button
          type="button"
          whileHover={{ backgroundColor: "#f5f6f9", color: "#050608" }}
          transition={{ duration: 0.35 }}
          className="hero-book-btn inline-flex items-center justify-center whitespace-nowrap rounded-full border border-white/50 px-2.5 py-1.5 text-[9.5px] font-semibold tracking-wider text-white sm:px-6 sm:py-3 sm:text-[12.5px]"
        >
          BOOK A CALL
        </motion.button>
      </nav>

      {/* ---------- HEADLINE (fills remaining space, vertically centered) ---------- */}
      <div className="relative z-3 flex flex-1 flex-col items-center justify-center px-5 py-6 text-center sm:px-8">
        <div className="relative group">
          {/* MAIN TEXT (Base - Restored to original brightness) */}
          <h1 className="max-w-225 font-serif text-[clamp(1.75rem,2.4vw+2.6vh,4.25rem)] font-medium leading-[1.14] tracking-[-0.01em] text-white select-none px-4 py-2 -mx-4 -my-2">
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span className="hero-word-base inline-block">
                Turn
              </span>{" "}
              <span className="hero-word-base inline-block">
                Sales
              </span>
            </span>
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span className="hero-word-base hero-accent-base inline-block text-[#8fd0ff] italic px-2 -mx-2">
                Uncertainty
              </span>{" "}
              <span className="hero-word-base inline-block">
                Into
              </span>
            </span>
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span className="hero-word-base inline-block">
                Sales
              </span>{" "}
              <span className="hero-word-base inline-block">
                Readiness
              </span>
            </span>
          </h1>

          {/* HIGHLIGHT TEXT (Vibrant Glow Reveal) */}
          <h1 
            ref={highlightRef}
            className="pointer-events-none absolute inset-0 max-w-225 font-serif text-[clamp(1.75rem,2.4vw+2.6vh,4.25rem)] font-medium leading-[1.14] tracking-[-0.01em] text-white select-none hidden sm:block [text-shadow:0_0_20px_rgba(255,255,255,0.7),0_0_40px_rgba(143,208,255,0.5)] px-4 py-2 -mx-4 -my-2"
            style={{
              opacity: 0,
              WebkitMaskImage: "radial-gradient(circle clamp(150px, 19vw, 300px) at var(--mx, 50%) var(--my, 50%), black 0%, black 20%, transparent 100%)",
              maskImage: "radial-gradient(circle clamp(150px, 19vw, 300px) at var(--mx, 50%) var(--my, 50%), black 0%, black 20%, transparent 100%)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span className="hero-word-highlight inline-block">
                Turn
              </span>{" "}
              <span className="hero-word-highlight inline-block">
                Sales
              </span>
            </span>
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span className="hero-word-highlight hero-accent-highlight inline-block text-[#e6f4ff] [text-shadow:0_0_25px_rgba(143,208,255,0.9),0_0_50px_rgba(34,167,255,0.6)] italic px-2 -mx-2">
                Uncertainty
              </span>{" "}
              <span className="hero-word-highlight inline-block">
                Into
              </span>
            </span>
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span className="hero-word-highlight inline-block">
                Sales
              </span>{" "}
              <span className="hero-word-highlight inline-block">
                Readiness
              </span>
            </span>
          </h1>
        </div>

        {/* ---------- CTA PILLS ---------- */}
        <div className="mt-[clamp(20px,4vh,38px)] flex flex-wrap items-center justify-center gap-3 sm:gap-4 relative z-10">
          <IndividualButton />
          <OrganisationButton />
        </div>
      </div>

      {/* ---------- SUBNAV (pinned bottom) ---------- */}
      <div className="hero-subnav relative z-3 flex flex-wrap items-center justify-center gap-y-2 px-5 pb-[clamp(16px,4vh,40px)] pt-[clamp(10px,2.5vh,28px)] sm:px-8">
        {NAV_LINKS.map((link, i) => (
          <a
            key={link}
            href="#"
            className={`relative px-3 text-[11px] font-medium text-white/55 transition-colors hover:text-white sm:px-6 sm:text-[13px] ${
              i > 0
                ? "before:absolute before:left-0 before:top-1/2 before:h-3 before:w-px before:-translate-y-1/2 before:bg-white/18 sm:before:h-3.5"
                : ""
            }`}
          >
            {link}
          </a>
        ))}
      </div>
    </section>
  );
}

/**
 * Button 1: "For Individuals"
 * Single bar icon with liquid download progress fill animation:
 * A liquid progress wave fills the pill smoothly from left to right,
 * flipping the single bar and label to dark ink on hover.
 */
function IndividualButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const liquidRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const liquid = liquidRef.current;
    const bar = barRef.current;
    const text = textRef.current;
    if (!btn || !liquid || !bar || !text) return;

    const mx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
    const my = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

    const onEnter = () => {
      // 1. Liquid fill sweeps from left to right like download progress
      gsap.to(liquid, {
        scaleX: 1,
        duration: 0.52,
        ease: "power2.out",
        overwrite: true,
      });

      // 2. Single bar and text smoothly flip to dark ink
      gsap.to(text, {
        color: "#0a0b0d",
        duration: 0.32,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(bar, {
        backgroundColor: "#0a0b0d",
        duration: 0.32,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const onLeave = () => {
      // 1. Liquid drains back to left
      gsap.to(liquid, {
        scaleX: 0,
        duration: 0.38,
        ease: "power2.in",
        overwrite: true,
      });

      // 2. Single bar and text return to default white and lime
      gsap.to(text, {
        color: "#ffffff",
        duration: 0.32,
        ease: "power2.in",
        overwrite: true,
      });
      gsap.to(bar, {
        backgroundColor: "#e7ff3d",
        duration: 0.32,
        ease: "power2.in",
        overwrite: true,
      });

      mx(0);
      my(0);
    };

    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      mx((e.clientX - r.left - r.width / 2) * 0.24);
      my((e.clientY - r.top - r.height / 2) * 0.42);
    };

    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);
    btn.addEventListener("pointermove", onMove);

    return () => {
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointerleave", onLeave);
      btn.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      className="hero-cta-pill group relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-white/30 bg-white/[0.03] px-5 py-2.5 text-[12.5px] font-medium text-white sm:px-6 sm:py-3 sm:text-[13.5px] cursor-pointer select-none"
    >
      {/* Liquid pill fill (sweeps left to right) */}
      <span
        ref={liquidRef}
        className="pointer-events-none absolute inset-0 z-0 origin-left rounded-full bg-[#e7ff3d] shadow-[0_0_24px_rgba(231,255,61,0.35)]"
        style={{ transform: "scaleX(0)" }}
      />

      {/* Single Bar Icon */}
      <span className="relative z-10 flex h-4 items-center">
        <span
          ref={barRef}
          className="block h-[14px] w-[3.5px] rounded-[1px] bg-[#e7ff3d] transition-colors"
        />
      </span>

      <span ref={textRef} className="relative z-10 transition-colors">
        For Individuals
      </span>
    </button>
  );
}

/**
 * Button 2: "For Organisations"
 * 4 EQUALLY SIZED BARS with classic Windows-style loading animation:
 * Each bar fills sequentially (bar 1 -> bar 2 -> bar 3 -> bar 4),
 * and the full button bar fills up with lime #e7ff3d!
 */
function OrganisationButton() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const animTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const fill = fillRef.current;
    const text = textRef.current;
    const bars = barRefs.current;
    if (!btn || !fill || !text || bars.some((b) => !b)) return;

    const mx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
    const my = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

    const onEnter = () => {
      // 1. Full pill bar fills from left to right like a loading progress bar
      gsap.to(fill, {
        scaleX: 1,
        duration: 0.56,
        ease: "power2.out",
        overwrite: true,
      });

      // 2. Text smoothly flips to dark ink
      gsap.to(text, {
        color: "#0a0b0d",
        duration: 0.32,
        ease: "power2.out",
        overwrite: true,
      });

      // 3. Classic Windows loading animation: 4 equal bars fill sequentially
      if (animTimelineRef.current) animTimelineRef.current.kill();

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });
      animTimelineRef.current = tl;

      // Start all bars in dimmed unlit state
      tl.set(bars, { opacity: 0.25, backgroundColor: "#0a0b0d" })
        .to(bars[0], { opacity: 1, duration: 0.16, ease: "power1.inOut" })
        .to(bars[1], { opacity: 1, duration: 0.16, ease: "power1.inOut" }, "-=0.04")
        .to(bars[2], { opacity: 1, duration: 0.16, ease: "power1.inOut" }, "-=0.04")
        .to(bars[3], { opacity: 1, duration: 0.16, ease: "power1.inOut" }, "-=0.04")
        .to(bars, { opacity: 1, duration: 0.35 });
    };

    const onLeave = () => {
      if (animTimelineRef.current) {
        animTimelineRef.current.kill();
        animTimelineRef.current = null;
      }

      // Pill bar drains back to left
      gsap.to(fill, {
        scaleX: 0,
        duration: 0.38,
        ease: "power2.in",
        overwrite: true,
      });

      // Text returns to white
      gsap.to(text, {
        color: "#ffffff",
        duration: 0.32,
        ease: "power2.in",
        overwrite: true,
      });

      // Bars return to default idle lime color
      gsap.to(bars, {
        opacity: 1,
        backgroundColor: "#e7ff3d",
        duration: 0.32,
        ease: "power2.in",
        overwrite: true,
      });

      mx(0);
      my(0);
    };

    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      mx((e.clientX - r.left - r.width / 2) * 0.24);
      my((e.clientY - r.top - r.height / 2) * 0.42);
    };

    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);
    btn.addEventListener("pointermove", onMove);

    return () => {
      if (animTimelineRef.current) animTimelineRef.current.kill();
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointerleave", onLeave);
      btn.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      className="hero-cta-pill group relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-white/30 bg-white/[0.03] px-5 py-2.5 text-[12.5px] font-medium text-white sm:px-6 sm:py-3 sm:text-[13.5px] select-none cursor-pointer"
    >
      {/* Full bar fill container (sweeps left to right) */}
      <span
        ref={fillRef}
        className="pointer-events-none absolute inset-0 z-0 origin-left rounded-full bg-[#e7ff3d] shadow-[0_0_24px_rgba(231,255,61,0.35)]"
        style={{ transform: "scaleX(0)" }}
      />

      {/* 4 EQUALLY SIZED BARS (Windows-style loading sequence) */}
      <span className="relative z-10 flex h-4 items-center gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            ref={(el) => {
              barRefs.current[i] = el;
            }}
            className="block h-[14px] w-[3.5px] rounded-[1px] bg-[#e7ff3d] transition-colors"
          />
        ))}
      </span>

      <span ref={textRef} className="relative z-10 transition-colors">
        For Organisations
      </span>
    </button>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/wlogo.png"
      alt="Logo"
      width={200}
      height={40}
      className={className}
      priority
    />
  );
}
