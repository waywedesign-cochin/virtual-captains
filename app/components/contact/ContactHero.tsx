"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trustStats } from "./data";

gsap.registerPlugin(ScrollTrigger);

export default function ContactHero() {
  const heroRef = useRef<HTMLElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const dotsGlowRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLHeadingElement>(null);

  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const statValRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            eyebrowRef.current,
            headlineRef.current,
            subtitleRef.current,
            ctaRef.current,
            statsContainerRef.current,
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      // Initial state
      gsap.set(eyebrowRef.current, { opacity: 0, y: -20, scale: 0.9 });
      gsap.set(headlineRef.current, { opacity: 0, y: 45, rotateX: 20 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 25 });
      gsap.set(ctaRef.current, { opacity: 0, y: 22, scale: 0.85 });
      gsap.set(statsContainerRef.current, { opacity: 0, y: 35, scale: 0.96 });

      // Intro timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
      })
        .to(
          headlineRef.current,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.1,
            ease: "expo.out",
          },
          "-=0.4"
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.7"
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.5"
        );

      // ScrollTrigger for Stats Count-up
      if (statsContainerRef.current) {
        const statsTl = gsap.timeline({
          scrollTrigger: {
            trigger: statsContainerRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        statsTl.to(statsContainerRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          ease: "power2.out",
        });

        const targetNumbers = [15000, 500, 8];
        targetNumbers.forEach((target, i) => {
          const el = statValRefs.current[i];
          if (!el) return;

          const counter = { val: 0 };
          statsTl.to(
            counter,
            {
              val: target,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: () => {
                const formatted = Math.round(counter.val).toLocaleString("en-US");
                el.textContent = `${formatted}+`;
              },
            },
            "-=0.5"
          );
        });
      }

      // ---------- CURSOR TRACKING & TORCH DOTS PROXIMITY REVEAL ----------
      const hero = heroRef.current;
      const dotsLayer = dotsRef.current;
      const dotsGlow = dotsGlowRef.current;
      const highlightLayer = highlightRef.current;

      if (hero && dotsLayer && dotsGlow) {
        const DOTS_INSET = 40;
        const dotGlow = { x: 0, y: 0, opacity: 0 };

        const applyDotGlow = () => {
          dotsGlow.style.setProperty("--dx", `${dotGlow.x}px`);
          dotsGlow.style.setProperty("--dy", `${dotGlow.y}px`);
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

        // Spotlight setup for central text reveal
        const spotPos = { x: 0, y: 0, opacity: 0 };
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

          // Torch dots reveal
          dotGlowX(cx + DOTS_INSET);
          dotGlowY(cy + DOTS_INSET);
          dotGlowOpacity(1);

          // Headline spotlight glow
          if (highlightLayer && spotlightX && spotlightY && spotlightOpacity) {
            const hlRect = highlightLayer.getBoundingClientRect();
            const relX = e.clientX - hlRect.left;
            const relY = e.clientY - hlRect.top;
            spotlightX(relX);
            spotlightY(relY);

            const isHoveringText =
              relX >= -60 &&
              relX <= hlRect.width + 60 &&
              relY >= -40 &&
              relY <= hlRect.height + 40;

            spotlightOpacity(isHoveringText ? 1 : 0);
          }
        };

        const handleLeave = () => {
          dotGlowOpacity(0);
          if (spotlightOpacity) spotlightOpacity(0);
        };

        hero.addEventListener("mouseenter", handleEnter);
        hero.addEventListener("mousemove", handleMove);
        hero.addEventListener("mouseleave", handleLeave);
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById("contact-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-[#040507] pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-44 lg:pb-24"
    >
      {/* Home page atmospheric gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(100% 70% at 50% 0%, #17387d 0%, #0d1e4c 25%, #071029 50%, #040507 85%)",
        }}
      />

      {/* Floating glowing orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 h-80 w-[min(700px,90vw)] rounded-full bg-[#38bdf8]/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-[#1c4fc0]/25 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-48 h-72 w-72 rounded-full bg-[#e7ff3d]/10 blur-[110px]"
      />

      {/* ---------- TORCH DOT-GRID REVEAL LAYERS ---------- */}
      {/* Layer 1: Dim Base Dots */}
      <div
        ref={dotsRef}
        className="pointer-events-none absolute -inset-10 z-1 will-change-transform"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.16) 1.2px, transparent 1.6px)",
          backgroundSize: "26px 26px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 65%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 65%, transparent 100%)",
        }}
      >
        {/* Layer 2: Bright Torch Glowing Dots (Cursor Revealed) */}
        <div
          ref={dotsGlowRef}
          className="absolute inset-0 will-change-[opacity]"
          style={{
            opacity: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.85) 1.8px, transparent 2.4px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(circle clamp(140px, 16vw, 230px) at var(--dx, 50%) var(--dy, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 20%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.2) 70%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle clamp(140px, 16vw, 230px) at var(--dx, 50%) var(--dy, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 20%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.2) 70%, transparent 100%)",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Container aligned with Navbar */}
      <div className="relative z-10 w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 text-center">
        {/* Eyebrow badge */}
        <div
          ref={eyebrowRef}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-4 py-1.5 shadow-[0_0_20px_rgba(56,189,248,0.15)] will-change-transform"
        >
          <span className="h-2 w-2 rounded-full bg-[#e7ff3d] animate-pulse shadow-[0_0_8px_#e7ff3d]" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
            Get In Touch · Sales Floor Readiness
          </span>
        </div>

        {/* Editorial Serif Headline with Torch Text Reveal */}
        <div className="relative group mx-auto mt-6 max-w-4xl">
          {/* Base Headline */}
          <h1
            ref={headlineRef}
            className="font-serif text-[clamp(2.2rem,4vw+1rem,4.5rem)] font-medium leading-[1.12] tracking-tight text-white select-none will-change-transform"
          >
            Let&apos;s Build Your{" "}
            <span className="italic text-[#8fd0ff] drop-shadow-[0_0_30px_rgba(143,208,255,0.45)]">
              Sales Floor
            </span>{" "}
            Together
          </h1>

          {/* Torch Spotlight Highlight Layer (illuminates on hover near text) */}
          <h1
            ref={highlightRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 font-serif text-[clamp(2.2rem,4vw+1rem,4.5rem)] font-medium leading-[1.12] tracking-tight text-white select-none hidden sm:block will-change-transform"
            style={{
              opacity: 0,
              textShadow:
                "0 0 16px rgba(255,255,255,0.9), 0 0 32px rgba(56,189,248,0.8), 0 0 65px rgba(231,255,61,0.5)",
              WebkitMaskImage:
                "radial-gradient(circle clamp(110px, 14vw, 210px) at var(--mx, 50%) var(--my, 50%), black 0%, black 30%, transparent 100%)",
              maskImage:
                "radial-gradient(circle clamp(110px, 14vw, 210px) at var(--mx, 50%) var(--my, 50%), black 0%, black 30%, transparent 100%)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            Let&apos;s Build Your{" "}
            <span
              className="italic"
              style={{
                color: "#e7ff3d",
                textShadow: "0 0 24px #e7ff3d, 0 0 50px rgba(231,255,61,0.6)",
              }}
            >
              Sales Floor
            </span>{" "}
            Together
          </h1>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mx-auto mt-5 max-w-2xl text-[15px] sm:text-[17px] leading-relaxed text-white/70 font-sans will-change-transform"
        >
          Induction, audit, outbound, or a full operating partnership — tell us
          what your revenue motion needs and a Captain will get back to you
          within one business day.
        </p>

        {/* Call To Action Buttons: Send a Message + For Individuals + For Organisations */}
        <div
          ref={ctaRef}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 will-change-transform"
        >
          <button
            type="button"
            onClick={scrollToForm}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#e7ff3d] hover:bg-[#d8f030] px-7 py-3 text-[12.5px] sm:text-[13.5px] font-bold text-[#0a0b0d] tracking-wide shadow-[0_0_24px_rgba(231,255,61,0.35)] transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98"
          >
            <span>Send a Message</span>
            <span className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
          </button>

          <IndividualButton />
          <OrganisationButton />
        </div>

        {/* Trust Stats Bar with GSAP animated counter */}
        <div
          ref={statsContainerRef}
          className="mx-auto mt-14 max-w-3xl rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6 sm:p-8 shadow-[0_16px_36px_rgba(0,0,0,0.35)] will-change-transform"
        >
          <div className="grid grid-cols-3 divide-x divide-white/10 text-center">
            {trustStats.map((stat, i) => (
              <div key={stat.label} className="px-2 sm:px-4">
                <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  <span
                    ref={(el) => {
                      statValRefs.current[i] = el;
                    }}
                    className="bg-linear-to-r from-white via-white to-[#8fd0ff] bg-clip-text text-transparent"
                  >
                    {stat.value}
                  </span>
                </p>
                <p className="mt-1 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-white/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Button: "For Individuals" with liquid hover effect
 */
function IndividualButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const liquidRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const liquid = liquidRef.current;
    const bar = barRef.current;
    const text = textRef.current;
    if (!btn || !liquid || !bar || !text) return;

    gsap.set(btn, { clearProps: "x,y,transform" });

    const onEnter = () => {
      gsap.to(liquid, {
        scaleX: 1,
        duration: 0.82,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(text, {
        color: "#0a0b0d",
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(bar, {
        backgroundColor: "#0a0b0d",
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
      });
    };

    const onLeave = () => {
      gsap.to(liquid, {
        scaleX: 0,
        duration: 0.58,
        ease: "power2.inOut",
        overwrite: true,
      });
      gsap.to(text, {
        color: "#ffffff",
        duration: 0.45,
        ease: "power2.inOut",
        overwrite: true,
      });
      gsap.to(bar, {
        backgroundColor: "#e7ff3d",
        duration: 0.45,
        ease: "power2.inOut",
        overwrite: true,
      });
    };

    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);

    return () => {
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <Link
      href="/individuals"
      ref={btnRef}
      className="hero-cta-pill group relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-white/30 bg-white/5 px-6 py-3 text-[12.5px] sm:text-[13.5px] font-medium text-white cursor-pointer select-none backdrop-blur-sm transition-all duration-200 hover:border-white/50"
    >
      <span
        ref={liquidRef}
        className="pointer-events-none absolute inset-0 z-0 origin-left rounded-full bg-[#e7ff3d] shadow-[0_0_24px_rgba(231,255,61,0.35)]"
        style={{ transform: "scaleX(0)" }}
      />

      <span className="relative z-10 flex h-4 items-center">
        <span
          ref={barRef}
          className="block h-3.5 w-[3.5px] rounded-[1px] bg-[#e7ff3d] transition-colors"
        />
      </span>

      <span ref={textRef} className="relative z-10 transition-colors">
        For Individuals
      </span>
    </Link>
  );
}

/**
 * Button: "For Organisations" with liquid hover effect and rhythmic equalizer bars
 */
function OrganisationButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);
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

    gsap.set(btn, { clearProps: "x,y,transform" });

    const onEnter = () => {
      gsap.to(fill, {
        scaleX: 1,
        duration: 0.82,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(text, {
        color: "#0a0b0d",
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
      });

      if (animTimelineRef.current) animTimelineRef.current.kill();

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
      animTimelineRef.current = tl;

      tl.set(bars, { opacity: 0.25, backgroundColor: "#0a0b0d" })
        .to(bars[0], { opacity: 1, duration: 0.35, ease: "power1.inOut" })
        .to(bars[1], { opacity: 1, duration: 0.35, ease: "power1.inOut" }, "-=0.1")
        .to(bars[2], { opacity: 1, duration: 0.35, ease: "power1.inOut" }, "-=0.1")
        .to(bars[3], { opacity: 1, duration: 0.35, ease: "power1.inOut" }, "-=0.1")
        .to(bars, { opacity: 1, duration: 0.5, ease: "sine.inOut" })
        .to(bars, { opacity: 0.35, duration: 0.4, ease: "sine.inOut" });
    };

    const onLeave = () => {
      if (animTimelineRef.current) {
        animTimelineRef.current.kill();
        animTimelineRef.current = null;
      }

      gsap.to(fill, {
        scaleX: 0,
        duration: 0.58,
        ease: "power2.inOut",
        overwrite: true,
      });
      gsap.to(text, {
        color: "#ffffff",
        duration: 0.45,
        ease: "power2.inOut",
        overwrite: true,
      });
      gsap.to(bars, {
        opacity: 1,
        backgroundColor: "#e7ff3d",
        duration: 0.45,
        ease: "power2.inOut",
        overwrite: true,
      });
    };

    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);

    return () => {
      if (animTimelineRef.current) animTimelineRef.current.kill();
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <Link
      href="/organisations"
      ref={btnRef}
      className="hero-cta-pill group relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-white/30 bg-white/5 px-6 py-3 text-[12.5px] sm:text-[13.5px] font-medium text-white select-none cursor-pointer backdrop-blur-sm transition-all duration-200 hover:border-white/50"
    >
      <span
        ref={fillRef}
        className="pointer-events-none absolute inset-0 z-0 origin-left rounded-full bg-[#e7ff3d] shadow-[0_0_24px_rgba(231,255,61,0.35)]"
        style={{ transform: "scaleX(0)" }}
      />

      <span className="relative z-10 flex h-4 items-center gap-0.75">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            ref={(el) => {
              barRefs.current[i] = el;
            }}
            className="block h-3.5 w-[3.5px] rounded-[1px] bg-[#e7ff3d] transition-colors"
          />
        ))}
      </span>

      <span ref={textRef} className="relative z-10 transition-colors">
        For Organisations
      </span>
    </Link>
  );
}
