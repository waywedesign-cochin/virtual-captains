"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

/**
 * Hero section for Virtual Captains.
 *
 * Layout notes:
 * - The section is `min-h-[100svh]` and laid out as a column with the nav
 *   pinned top, the headline centered in the remaining space, and the
 *   sub-nav pinned bottom.
 * - Headline font-size and vertical spacing use `clamp()` mixing `vw` and
 *   `vh` units, so text shrinks on short/landscape viewports as well as
 *   narrow ones.
 * - `max-w-[1920px] mx-auto` caps the hero on ultra-wide monitors.
 *
 * Animation split:
 * - GSAP: page-load timeline, cursor-driven glow/grid parallax, the dot-grid
 *   proximity reveal, the magnetic pull on buttons, and the liquid-fill hover
 *   blob on the CTA pills.
 *
 * Dot-grid reveal:
 *   Two identical dot layers are stacked. The base layer is dim (0.16 white,
 *   1px dots). The glow layer sits on top with brighter, slightly fatter dots
 *   (0.42 white, 1.5px) and is masked by a soft radial gradient that eases
 *   toward the cursor. Because only the dots are painted, the page background
 *   stays untouched — the dots appear to light up rather than a blob sliding
 *   underneath them.
 *
 * Requires: `npm install gsap`
 */

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const dotsGlowRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".hero-word-base, .hero-word-highlight, .hero-cta-pill", {
          opacity: 1,
          y: 0,
          clearProps: "all",
        });
        return;
      }

      // ---------- REPEATING TORCH COLOR SYSTEM ----------
      const TORCH_PALETTE = [
        { r: 56, g: 189, b: 248 }, // Electric Sky / Cyan (#38bdf8)
        { r: 99, g: 102, b: 241 }, // Digital Indigo (#6366f1)
        { r: 168, g: 85, b: 247 }, // Neon Violet (#a855f7)
        { r: 20, g: 184, b: 166 }, // Oceanic Teal (#14b8a6)
        { r: 231, g: 255, b: 61 }, // Signature Lime (#e7ff3d)
        { r: 14, g: 165, b: 233 }, // Azure Blue (#0ea5e9)
      ];

      const currentColor = { ...TORCH_PALETTE[0] };
      const hero = heroRef.current;

      const updateTorchStyles = () => {
        if (!hero) return;
        const r = Math.round(currentColor.r);
        const g = Math.round(currentColor.g);
        const b = Math.round(currentColor.b);

        hero.style.setProperty("--torch-color", `rgb(${r}, ${g}, ${b})`);
        hero.style.setProperty("--torch-core", `rgba(${r}, ${g}, ${b}, 0.24)`);
        hero.style.setProperty("--torch-mid", `rgba(${r}, ${g}, ${b}, 0.09)`);
        hero.style.setProperty("--torch-dim", `rgba(${r}, ${g}, ${b}, 0.02)`);
        hero.style.setProperty("--torch-glow", `rgba(${r}, ${g}, ${b}, 0.42)`);
        hero.style.setProperty(
          "--torch-glow-soft",
          `rgba(${r}, ${g}, ${b}, 0.16)`,
        );
      };

      updateTorchStyles();

      const colorTl = gsap.timeline({ repeat: -1 });
      TORCH_PALETTE.forEach((_, i) => {
        const next = TORCH_PALETTE[(i + 1) % TORCH_PALETTE.length];
        colorTl.to(currentColor, {
          r: next.r,
          g: next.g,
          b: next.b,
          duration: 3.6,
          ease: "sine.inOut",
          onUpdate: updateTorchStyles,
        });
      });

      // ---------- INTRO TIMELINE ----------
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(
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
        "+=0.1",
      ).from(
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
      );

      // ---------- CURSOR TRACKING & SPOTLIGHT ----------
      const highlightLayer = highlightRef.current;
      const dotsLayer = dotsRef.current;
      const dotsGlow = dotsGlowRef.current;

      if (hero && dotsLayer) {
        const dotsX = gsap.quickTo(dotsLayer, "x", {
          duration: 1.6,
          ease: "power3.out",
        });
        const dotsY = gsap.quickTo(dotsLayer, "y", {
          duration: 1.6,
          ease: "power3.out",
        });

        // ---------- DOT-GRID PROXIMITY REVEAL ----------
        // The dot layer is offset by `-inset-10` (40px) from the hero box and
        // is itself parallax-transformed, so the mask position is corrected by
        // both: +40px for the inset, minus the live parallax offset so the lit
        // area stays locked to the real cursor instead of drifting with the
        // grid.
        const DOTS_INSET = 40;
        const dotGlow = { x: 0, y: 0, opacity: 0 };

        const applyDotGlow = () => {
          if (!dotsGlow) return;
          const ox = (gsap.getProperty(dotsLayer, "x") as number) || 0;
          const oy = (gsap.getProperty(dotsLayer, "y") as number) || 0;
          dotsGlow.style.setProperty("--dx", `${dotGlow.x - ox}px`);
          dotsGlow.style.setProperty("--dy", `${dotGlow.y - oy}px`);
          dotsGlow.style.opacity = `${dotGlow.opacity}`;
        };

        const dotGlowX = gsap.quickTo(dotGlow, "x", {
          duration: 0.35,
          ease: "power2.out",
          onUpdate: applyDotGlow,
        });
        const dotGlowY = gsap.quickTo(dotGlow, "y", {
          duration: 0.35,
          ease: "power2.out",
          onUpdate: applyDotGlow,
        });
        const dotGlowOpacity = gsap.quickTo(dotGlow, "opacity", {
          duration: 0.5,
          ease: "power2.out",
          onUpdate: applyDotGlow,
        });

        // Keep the mask glued to the grid while the parallax settles.
        const dotGlowTicker = () => applyDotGlow();
        gsap.ticker.add(dotGlowTicker);
        applyDotGlow();

        // Spotlight setup for central text reveal — only activates when hovering near/on text
        const spotPos = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          opacity: 0,
        };
        let spotlightX: ((val: number) => void) | null = null;
        let spotlightY: ((val: number) => void) | null = null;
        let spotlightOpacity: ((val: number) => void) | null = null;

        if (highlightLayer) {
          const updateMask = () => {
            highlightLayer.style.setProperty("--mx", `${spotPos.x}px`);
            highlightLayer.style.setProperty("--my", `${spotPos.y}px`);
            highlightLayer.style.opacity = `${spotPos.opacity}`;
          };
          spotlightX = gsap.quickTo(spotPos, "x", {
            duration: 0.35,
            ease: "power2.out",
            onUpdate: updateMask,
          });
          spotlightY = gsap.quickTo(spotPos, "y", {
            duration: 0.35,
            ease: "power2.out",
            onUpdate: updateMask,
          });
          spotlightOpacity = gsap.quickTo(spotPos, "opacity", {
            duration: 0.45,
            ease: "power2.out",
            onUpdate: updateMask,
          });
          updateMask();
        }

        const handleEnter = (e: MouseEvent) => {
          const r = hero.getBoundingClientRect();
          const cx = e.clientX - r.left;
          const cy = e.clientY - r.top;

          // Snap the dot reveal to the entry point so it fades up in place
          dotGlow.x = cx + DOTS_INSET;
          dotGlow.y = cy + DOTS_INSET;
          applyDotGlow();
          dotGlowX(cx + DOTS_INSET);
          dotGlowY(cy + DOTS_INSET);
          dotGlowOpacity(1);
        };

        const handleMove = (e: MouseEvent) => {
          const r = hero.getBoundingClientRect();
          const cx = e.clientX - r.left;
          const cy = e.clientY - r.top;

          // Dot grid lights up around the cursor (crisp white reveal)
          dotGlowX(cx + DOTS_INSET);
          dotGlowY(cy + DOTS_INSET);
          dotGlowOpacity(1);

          // Subtle parallax on background dots
          const px = cx / r.width - 0.5;
          const py = cy / r.height - 0.5;
          dotsX(px * -20);
          dotsY(py * -16);

          // Color-changing torch light: only activates when hovering over the central text!
          if (highlightLayer && spotlightX && spotlightY && spotlightOpacity) {
            const hlRect = highlightLayer.getBoundingClientRect();
            const relX = e.clientX - hlRect.left;
            const relY = e.clientY - hlRect.top;
            spotlightX(relX);
            spotlightY(relY);

            // Confined strictly to hovering directly on or near the headline text box
            const isHoveringText =
              relX >= -50 &&
              relX <= hlRect.width + 50 &&
              relY >= -30 &&
              relY <= hlRect.height + 30;

            spotlightOpacity(isHoveringText ? 1 : 0);
          }
        };

        const handleLeave = () => {
          dotsX(0);
          dotsY(0);
          dotGlowOpacity(0);
          if (spotlightOpacity) {
            spotlightOpacity(0);
          }
        };

        hero.addEventListener("mouseenter", handleEnter);
        hero.addEventListener("mousemove", handleMove);
        hero.addEventListener("mouseleave", handleLeave);

        return () => {
          gsap.ticker.remove(dotGlowTicker);
          hero.removeEventListener("mouseenter", handleEnter);
          hero.removeEventListener("mousemove", handleMove);
          hero.removeEventListener("mouseleave", handleLeave);
        };
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative mx-auto flex min-h-svh w-full max-w-[1920px] flex-col justify-center overflow-hidden rounded-b-[18px] bg-[#040507] pt-[clamp(110px,13vh,150px)] pb-[clamp(40px,6vh,75px)] sm:rounded-b-3xl lg:rounded-b-[28px]"
    >
      {/* diagonal gradient base */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 100% at -5% -10%, #3f74e6 0%, #1c4fc0 12%, #0c318f 26%, #051d5c 42%, #050b24 60%, #040507 78%)",
        }}
      />

      {/* dot grid — base (dim) layer + cursor-revealed (bright) layer */}
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
      >
        {/*
          Bright dot layer. Same grid origin and size as the parent, so the
          dots line up exactly — this layer just draws them fatter and
          brighter. The parent's bottom-fade mask already clips this child, so
          only the cursor radial is needed here.
        */}
        <div
          ref={dotsGlowRef}
          className="absolute inset-0 will-change-[opacity]"
          style={{
            opacity: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.42) 1.5px, transparent 2.1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(circle clamp(260px, 30vw, 430px) at var(--dx, 50%) var(--dy, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 15%, rgba(0,0,0,0.66) 30%, rgba(0,0,0,0.46) 45%, rgba(0,0,0,0.28) 60%, rgba(0,0,0,0.14) 75%, rgba(0,0,0,0.05) 88%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle clamp(260px, 30vw, 430px) at var(--dx, 50%) var(--dy, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 15%, rgba(0,0,0,0.66) 30%, rgba(0,0,0,0.46) 45%, rgba(0,0,0,0.28) 60%, rgba(0,0,0,0.14) 75%, rgba(0,0,0,0.05) 88%, transparent 100%)",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      </div>

      {/* ---------- HEADLINE (fills remaining space, vertically centered) ---------- */}
      <div className="relative z-3 flex flex-1 flex-col items-center justify-center px-5 py-6 text-center sm:px-8">
        <div className="relative group">
          {/* MAIN TEXT */}
          <h1 className="max-w-225 font-serif text-[clamp(1.75rem,2.4vw+2.6vh,4.25rem)] font-medium leading-[1.14] tracking-[-0.01em] text-white select-none px-4 py-2 -mx-4 -my-2">
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span className="hero-word-base inline-block">Turn</span>{" "}
              <span className="hero-word-base inline-block">Sales</span>
            </span>
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span
                className="hero-word-base hero-accent-base inline-block text-[#8fd0ff] italic px-2 -mx-2"
                style={{
                  textShadow:
                    "0 0 20px var(--torch-glow-soft, rgba(143,208,255,0.45))",
                }}
              >
                Uncertainty
              </span>{" "}
              <span className="hero-word-base inline-block">Into</span>
            </span>
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span className="hero-word-base inline-block">Sales</span>{" "}
              <span className="hero-word-base inline-block">Readiness</span>
            </span>
          </h1>

          {/* HIGHLIGHT TEXT (torch spotlight glow reveal) */}
          <h1
            ref={highlightRef}
            className="pointer-events-none absolute inset-0 max-w-225 font-serif text-[clamp(1.75rem,2.4vw+2.6vh,4.25rem)] font-medium leading-[1.14] tracking-[-0.01em] text-white select-none hidden sm:block px-4 py-2 -mx-4 -my-2"
            style={{
              opacity: 0,
              textShadow:
                "0 0 16px rgba(255,255,255,0.8), 0 0 32px var(--torch-glow), 0 0 60px var(--torch-glow-soft)",
              WebkitMaskImage:
                "radial-gradient(circle clamp(90px, 11vw, 175px) at var(--mx, 50%) var(--my, 50%), black 0%, black 20%, transparent 100%)",
              maskImage:
                "radial-gradient(circle clamp(90px, 11vw, 175px) at var(--mx, 50%) var(--my, 50%), black 0%, black 20%, transparent 100%)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span className="hero-word-highlight inline-block">Turn</span>{" "}
              <span className="hero-word-highlight inline-block">Sales</span>
            </span>
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span
                className="hero-word-highlight hero-accent-highlight inline-block italic px-2 -mx-2 transition-colors duration-300"
                style={{
                  color: "var(--torch-color, #8fd0ff)",
                  textShadow:
                    "0 0 20px var(--torch-glow), 0 0 45px var(--torch-glow-soft)",
                }}
              >
                Uncertainty
              </span>{" "}
              <span className="hero-word-highlight inline-block">Into</span>
            </span>
            <span className="hero-line block px-2 -mx-2 py-0.5">
              <span className="hero-word-highlight inline-block">Sales</span>{" "}
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
    </section>
  );
}

/**
 * Button 1: "For Individuals"
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
      gsap.to(liquid, {
        scaleX: 1,
        duration: 0.52,
        ease: "power2.out",
        overwrite: true,
      });
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
      gsap.to(liquid, {
        scaleX: 0,
        duration: 0.38,
        ease: "power2.in",
        overwrite: true,
      });
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
      <span
        ref={liquidRef}
        className="pointer-events-none absolute inset-0 z-0 origin-left rounded-full bg-[#e7ff3d] shadow-[0_0_24px_rgba(231,255,61,0.35)]"
        style={{ transform: "scaleX(0)" }}
      />

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
      gsap.to(fill, {
        scaleX: 1,
        duration: 0.56,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(text, {
        color: "#0a0b0d",
        duration: 0.32,
        ease: "power2.out",
        overwrite: true,
      });

      if (animTimelineRef.current) animTimelineRef.current.kill();

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });
      animTimelineRef.current = tl;

      tl.set(bars, { opacity: 0.25, backgroundColor: "#0a0b0d" })
        .to(bars[0], { opacity: 1, duration: 0.16, ease: "power1.inOut" })
        .to(
          bars[1],
          { opacity: 1, duration: 0.16, ease: "power1.inOut" },
          "-=0.04",
        )
        .to(
          bars[2],
          { opacity: 1, duration: 0.16, ease: "power1.inOut" },
          "-=0.04",
        )
        .to(
          bars[3],
          { opacity: 1, duration: 0.16, ease: "power1.inOut" },
          "-=0.04",
        )
        .to(bars, { opacity: 1, duration: 0.35 });
    };

    const onLeave = () => {
      if (animTimelineRef.current) {
        animTimelineRef.current.kill();
        animTimelineRef.current = null;
      }

      gsap.to(fill, {
        scaleX: 0,
        duration: 0.38,
        ease: "power2.in",
        overwrite: true,
      });
      gsap.to(text, {
        color: "#ffffff",
        duration: 0.32,
        ease: "power2.in",
        overwrite: true,
      });
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
      <span
        ref={fillRef}
        className="pointer-events-none absolute inset-0 z-0 origin-left rounded-full bg-[#e7ff3d] shadow-[0_0_24px_rgba(231,255,61,0.35)]"
        style={{ transform: "scaleX(0)" }}
      />

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
