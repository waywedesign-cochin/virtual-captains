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

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".hero-word, .hero-cta-pill, .hero-subnav a", {
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
          ".hero-word",
          {
            opacity: 0,
            y: 46,
            rotateX: 35,
            filter: "blur(6px)",
            transformOrigin: "50% 100%",
            stagger: 0.045,
            duration: 1.1,
            ease: "expo.out",
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

      // ambient shimmer through the accent word
      gsap.to(".hero-accent", {
        backgroundPosition: "200% 0",
        duration: 6,
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

        const handleMove = (e: MouseEvent) => {
          const r = hero.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          glowX(px * 220);
          glowY(py * 220);
          dotsX(px * -18);
          dotsY(py * -14);
        };
        const handleLeave = () => {
          glowX(0);
          glowY(0);
          dotsX(0);
          dotsY(0);
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
        <h1 className="max-w-225 font-serif text-[clamp(1.75rem,2.4vw+2.6vh,4.25rem)] font-medium leading-[1.14] tracking-[-0.01em] text-white">
          <span className="block overflow-hidden px-1">
            <span className="hero-word inline-block will-change-transform">
              Turn
            </span>{" "}
            <span className="hero-word inline-block will-change-transform">
              Sales
            </span>
          </span>
          <span className="block overflow-hidden px-1">
            <span className="hero-word hero-accent inline-block bg-size-[200%_auto] bg-linear-to-r from-[#8fd0ff] via-[#22a7ff] to-[#1c8ce0] bg-clip-text italic text-transparent will-change-transform">
              Uncertainty
            </span>{" "}
            <span className="hero-word inline-block will-change-transform">
              Into
            </span>
          </span>
          <span className="block overflow-hidden px-1">
            <span className="hero-word inline-block will-change-transform">
              Sales
            </span>{" "}
            <span className="hero-word inline-block will-change-transform">
              Readiness
            </span>
          </span>
        </h1>

        {/* ---------- CTA PILLS (liquid-fill hover) ---------- */}
        <div className="mt-[clamp(20px,4vh,38px)] flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <LiquidPillButton label="For Individuals" bars={[16]} />
          <LiquidPillButton label="For Organisations" bars={[7, 16, 10, 13]} />
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
 * CTA pill with a cursor-anchored "liquid" fill: a circular blob is born at
 * the exact point the pointer enters, then grows past the button's diagonal
 * so — clipped by the pill's own rounded corners — it reads as the button
 * organically filling with color rather than a flat background swap. Text
 * and icon bars flip to dark ink at the same time for contrast against the
 * lime fill (the source design uses lime-on-dark everywhere else, so dark
 * text on lime keeps that same logic rather than going white-on-lime, which
 * has weak contrast — flip the two color values below if you'd rather keep
 * the label white).
 */
function LiquidPillButton({ label, bars }: { label: string; bars: number[] }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const isFilled = useRef(false);

  useEffect(() => {
    const btn = btnRef.current;
    const fill = fillRef.current;
    if (!btn || !fill) return;

    const mx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
    const my = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

    const growTo = (x: number, y: number) => {
      if (isFilled.current) return;
      isFilled.current = true;
      gsap.killTweensOf([fill, textRef.current, ...barRefs.current]);
      
      const r = btn.getBoundingClientRect();
      const size = Math.hypot(r.width, r.height) * 2.2;
      gsap.set(fill, {
        width: size,
        height: size,
        left: x,
        top: y,
        xPercent: -50,
        yPercent: -50,
      });
      gsap.to(fill, { scale: 1, duration: 0.6, ease: "power3.out", overwrite: true });
      gsap.to([textRef.current, ...barRefs.current], {
        color: "#0a0b0f",
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(barRefs.current, {
        backgroundColor: "#0a0b0f",
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const shrinkFrom = (x: number, y: number) => {
      if (!isFilled.current) return;
      isFilled.current = false;
      gsap.killTweensOf([fill, textRef.current, ...barRefs.current]);
      
      gsap.set(fill, { left: x, top: y });
      gsap.to(fill, { scale: 0, duration: 0.4, ease: "power2.in", overwrite: true });
      gsap.to([textRef.current, ...barRefs.current], {
        color: "#ffffff",
        duration: 0.35,
        ease: "power2.in",
        overwrite: true,
      });
      gsap.to(barRefs.current, {
        backgroundColor: "#e7ff3d",
        duration: 0.35,
        ease: "power2.in",
        overwrite: true,
      });
    };

    const onEnter = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      growTo(e.clientX - r.left, e.clientY - r.top);
    };
    const onLeave = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      shrinkFrom(e.clientX - r.left, e.clientY - r.top);
      mx(0);
      my(0);
    };
    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      mx((e.clientX - r.left - r.width / 2) * 0.28);
      my((e.clientY - r.top - r.height / 2) * 0.5);
    };

    // Global safety net for missed pointerleave events
    const onGlobalPointerMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      const isInside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;

      if (isInside && !isFilled.current) {
        growTo(e.clientX - r.left, e.clientY - r.top);
      } else if (!isInside && isFilled.current) {
        shrinkFrom(e.clientX - r.left, e.clientY - r.top);
        mx(0);
        my(0);
      }
    };

    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);
    btn.addEventListener("pointermove", onMove);
    window.addEventListener("pointermove", onGlobalPointerMove);

    return () => {
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointerleave", onLeave);
      btn.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointermove", onGlobalPointerMove);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      className="hero-cta-pill relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-white/30 bg-white/2 px-5 py-2.5 text-[12.5px] font-medium text-white sm:px-6 sm:py-3 sm:text-[13.5px]"
    >
      <span
        ref={fillRef}
        className="pointer-events-none absolute z-0 rounded-full bg-[#e7ff3d]"
        style={{ width: 0, height: 0, transform: "scale(0)" }}
      />
      <span className="relative z-10 flex h-4 items-end gap-[2.5px]">
        {bars.map((h, i) => (
          <span
            key={i}
            ref={(el) => {
              barRefs.current[i] = el;
            }}
            className="block w-0.75 rounded-sm bg-[#e7ff3d]"
            style={{ height: `${h}px` }}
          />
        ))}
      </span>
      <span ref={textRef} className="relative z-10">
        {label}
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
