"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The ring is drawn in this fixed SVG viewBox — the metrics' orbit uses the
// exact same geometry so the numbers travel precisely along the drawn
// curve instead of an approximated invisible path.
const VIEWBOX = { w: 1024, h: 629 };
const TRACK = { cx: 512, cy: 293, rx: 320, ry: 110, rotateDeg: 14.9 };
const TRACK_ROT_RAD = (TRACK.rotateDeg * Math.PI) / 180;
const TRACK_COS = Math.cos(TRACK_ROT_RAD);
const TRACK_SIN = Math.sin(TRACK_ROT_RAD);

// Each metric's starting angle (degrees) on the track, in the same order
// as the metrics render below — evenly spaced 60° apart around the ring
// (in the same left-to-right/top-to-bottom order as the original design)
// so no two items ever bunch up together as they orbit.
const BASE_ANGLES = [-150, 150, -90, 90, -30, 30];

// A full turn plays out across the pinned scroll distance.
const ROTATION_SWEEP = 360;

// Labels ride a slightly larger concentric ellipse than the drawn ring
// itself, so the text always clears the stroke instead of visually
// cutting through it (labels are anchored top-left, not centered on the
// point, so they need real clearance — more on the Y axis, since that's
// where a number would otherwise straddle the ring at its top/bottom).
const LABEL_RX_SCALE = 1.08;
const LABEL_RY_SCALE = 1.42;

// A point on (or around) the ring, in percent of the stage box.
function trackPoint(angleDeg: number, rxScale = 1, ryScale = 1) {
  const rad = (angleDeg * Math.PI) / 180;
  const px = TRACK.rx * rxScale * Math.cos(rad);
  const py = TRACK.ry * ryScale * Math.sin(rad);
  const x = TRACK.cx + px * TRACK_COS - py * TRACK_SIN;
  const y = TRACK.cy + px * TRACK_SIN + py * TRACK_COS;
  return {
    xPct: (x / VIEWBOX.w) * 100,
    yPct: (y / VIEWBOX.h) * 100,
    localSin: Math.sin(rad),
  };
}

const CENTER_PCT = {
  x: (TRACK.cx / VIEWBOX.w) * 100,
  y: (TRACK.cy / VIEWBOX.h) * 100,
};

function orbitTransform(angleDeg: number) {
  const { xPct, yPct, localSin } = trackPoint(
    angleDeg,
    LABEL_RX_SCALE,
    LABEL_RY_SCALE
  );
  // depth: 0 = far side of the ring (back), 1 = near side (front / camera)
  const depth = (localSin + 1) / 2;
  const eased = depth * depth * (3 - 2 * depth); // smoothstep, punchier falloff
  // Strong size contrast so "closer to the bottom = bigger" reads clearly
  // even at rest, not just mid-scroll. Crispness is handled separately via
  // backfaceVisibility/font-smoothing/force3D rather than by flattening
  // this range.
  const scale = 0.68 + eased * 0.8; // 0.68 back .. 1.48 front
  // Depth reads through opacity, brightness and scale only — no blur, so
  // the bold numerals stay crisp everywhere on the ring instead of
  // looking soft/low-quality when they swing toward the back.
  const opacity = 0.55 + eased * 0.45;
  const brightness = 0.72 + eased * 0.48;
  const glow = eased ** 3;
  const zIndex = Math.round(eased * 40);
  return { x: xPct, y: yPct, scale, opacity, brightness, glow, zIndex };
}

// The point on the orbit where items are biggest / most "in focus" — used
// to anchor a fixed stage-light glow that everything rotates through.
const FRONT_POINT = orbitTransform(90);

// Static, non-animated layout for a metric at a given angle — used as the
// server-rendered / no-JS / reduced-motion baseline so the orbit always
// reads correctly even before (or without) any animation running.
function metricStaticStyle(angleDeg: number): React.CSSProperties {
  const { x, y, scale, brightness, glow, zIndex } = orbitTransform(angleDeg);
  return {
    left: `${x}%`,
    top: `${y}%`,
    zIndex,
    transform: `scale(${scale})`,
    filter: `brightness(${brightness.toFixed(
      2
    )}) drop-shadow(0 0 ${(glow * 16).toFixed(1)}px rgba(229,255,0,${(
      glow * 0.65
    ).toFixed(2)}))`,
    // Keeps the browser rasterizing text on its own GPU layer at a stable
    // resolution instead of re-rasterizing every scale change, which is
    // what was reading as the text "losing quality" while animating.
    WebkitFontSmoothing: "antialiased",
    backfaceVisibility: "hidden",
    transformStyle: "preserve-3d",
  };
}

// Faint comet-trail ghosts riding just behind each metric on the same path.
const TRAIL_COUNT = 3;
const TRAIL_GAP_DEG = 6;
const TRAIL_FADE = [0.45, 0.24, 0.1];

function trailStaticStyle(angleDeg: number, k: number): React.CSSProperties {
  const { x, y } = orbitTransform(angleDeg - (k + 1) * TRAIL_GAP_DEG);
  return { left: `${x}%`, top: `${y}%`, opacity: 0 };
}

// Deterministic PRNG (same output every render/build) so the starfield
// doesn't shift between server and client render.
function seededRandom(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const STAR_COUNT = 46;
const starRandom = seededRandom(1337);
const STARS = Array.from({ length: STAR_COUNT }, () => ({
  left: starRandom() * 100,
  top: starRandom() * 100,
  size: 1 + starRandom() * 1.6,
  delay: starRandom() * 5,
  duration: 2.6 + starRandom() * 3.4,
  baseOpacity: 0.25 + starRandom() * 0.45,
}));

export default function AboutMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ellipseRef = useRef<SVGEllipseElement>(null);
  const glowEllipseRef = useRef<SVGEllipseElement>(null);
  const echoEllipseRef = useRef<SVGEllipseElement>(null);
  const metricRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trailRefs = useRef<(HTMLSpanElement | null)[][]>(
    Array.from({ length: BASE_ANGLES.length }, () => [])
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    let removePointerListeners: (() => void) | undefined;

    const ctx = gsap.context(() => {
      // Places every metric (and its trailing comet ghosts) on the orbit
      // for a given rotation offset.
      const applyOrbit = (rotation: number, immediate: boolean) => {
        metricRefs.current.forEach((el, i) => {
          if (!el) return;
          const { x, y, scale, opacity, brightness, glow, zIndex } =
            orbitTransform(BASE_ANGLES[i] + rotation);
          gsap.set(el, {
            left: `${x}%`,
            top: `${y}%`,
            scale,
            zIndex,
            force3D: true,
            filter: `brightness(${brightness.toFixed(
              2
            )}) drop-shadow(0 0 ${(glow * 16).toFixed(
              1
            )}px rgba(229,255,0,${(glow * 0.65).toFixed(2)}))`,
            ...(immediate ? {} : { opacity }),
          });

          trailRefs.current[i]?.forEach((trailEl, k) => {
            if (!trailEl) return;
            const t = orbitTransform(
              BASE_ANGLES[i] + rotation - (k + 1) * TRAIL_GAP_DEG
            );
            gsap.set(trailEl, {
              left: `${t.x}%`,
              top: `${t.y}%`,
              scale: t.scale * 0.4,
              zIndex: Math.max(zIndex - k - 1, 0),
              opacity: immediate ? 0 : t.opacity * TRAIL_FADE[k],
            });
          });
        });
      };

      // 1. Initial states: park every metric on the orbit at rotation 0,
      // hidden and slightly lifted, ready to pop in.
      applyOrbit(0, true);
      gsap.set(metricRefs.current, { opacity: 0, y: 15 });

      const circumference = 1450;
      if (ellipseRef.current) {
        gsap.set(ellipseRef.current, {
          strokeDasharray: circumference,
          strokeDashoffset: circumference,
          opacity: 0,
        });
      }
      if (glowEllipseRef.current) {
        gsap.set(glowEllipseRef.current, {
          strokeDasharray: circumference,
          strokeDashoffset: circumference,
          opacity: 0,
        });
      }
      if (echoEllipseRef.current) {
        gsap.set(echoEllipseRef.current, {
          strokeDasharray: circumference,
          strokeDashoffset: circumference,
          opacity: 0,
        });
      }

      // 2. ScrollTrigger Entrance
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          // Draw the neon lime ellipse orbit — dimmed down from full
          // opacity so the ring reads as an ambient track, not a
          // competing light source next to the metric text.
          if (ellipseRef.current) {
            tl.to(
              ellipseRef.current,
              {
                strokeDashoffset: 0,
                opacity: 0.55,
                duration: 1.6,
                ease: "power2.inOut",
              },
              0
            );
          }
          if (glowEllipseRef.current) {
            tl.to(
              glowEllipseRef.current,
              {
                strokeDashoffset: 0,
                opacity: 0.16,
                duration: 1.6,
                ease: "power2.inOut",
              },
              0
            );
          }

          // Draw the fainter violet spiral-arm echo, slightly behind
          if (echoEllipseRef.current) {
            tl.to(
              echoEllipseRef.current,
              {
                strokeDashoffset: 0,
                opacity: 0.25,
                duration: 1.8,
                ease: "power2.inOut",
              },
              0.1
            );
          }

          // Staggered pop-in for all 6 metrics
          const validMetrics = metricRefs.current.filter(Boolean);
          if (validMetrics.length > 0) {
            tl.to(
              validMetrics,
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: "back.out(1.35)",
              },
              0.35
            );
          }
        },
      });

      // 3. Pin the section and drive one full orbit turn off scroll
      // progress. The ring itself stays put — a fixed track — while every
      // metric (and its trail) travels along that exact drawn curve, so
      // the motion reads as numbers correctly orbiting a stationary ring
      // rather than the ring itself flexing or sweeping around.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 1.4}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        refreshPriority: 10,
        onUpdate: (self) => {
          const angle = self.progress * ROTATION_SWEEP;
          applyOrbit(angle, false);
        },
      });

      ScrollTrigger.refresh();

      // 4. Pointer parallax: on devices with a real mouse, the whole stage
      // tilts gently toward the cursor, so the scene still feels alive
      // between scrolls instead of only reacting on scroll ticks.
      const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches;
      if (canHover && stageRef.current) {
        gsap.set(stageRef.current, {
          transformPerspective: 1400,
          transformStyle: "preserve-3d",
        });
        const quickRotateY = gsap.quickTo(stageRef.current, "rotationY", {
          duration: 0.7,
          ease: "power3.out",
        });
        const quickRotateX = gsap.quickTo(stageRef.current, "rotationX", {
          duration: 0.7,
          ease: "power3.out",
        });

        const handlePointerMove = (e: PointerEvent) => {
          if (!stageRef.current) return;
          const rect = stageRef.current.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width - 0.5;
          const relY = (e.clientY - rect.top) / rect.height - 0.5;
          quickRotateY(relX * 12);
          quickRotateX(-relY * 8);
        };
        const handlePointerLeave = () => {
          quickRotateY(0);
          quickRotateX(0);
        };

        const stageEl = stageRef.current;
        stageEl.addEventListener("pointermove", handlePointerMove);
        stageEl.addEventListener("pointerleave", handlePointerLeave);

        removePointerListeners = () => {
          stageEl.removeEventListener("pointermove", handlePointerMove);
          stageEl.removeEventListener("pointerleave", handlePointerLeave);
        };
      }
    }, sectionRef);

    return () => {
      removePointerListeners?.();
      ctx.revert();
    };
  }, []);

  const renderTrail = (i: number) =>
    Array.from({ length: TRAIL_COUNT }, (_, k) => (
      <span
        key={k}
        ref={(el) => {
          trailRefs.current[i][k] = el;
        }}
        aria-hidden
        style={{
          ...trailStaticStyle(BASE_ANGLES[i], k),
          width: 6,
          height: 6,
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-[#D08817] to-[#F3FC00] pointer-events-none shadow-[0_0_8px_#F3FC00]"
      />
    ));

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label="Scale and Impact Metrics"
      className="relative w-full h-dvh max-h-dvh overflow-hidden select-none flex flex-col items-center justify-center px-4"
    >
      <style>{`
        @keyframes vc-twinkle {
          0%, 100% { opacity: var(--vc-star-base, 0.3); transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes vc-core-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vc-star, .vc-core { animation: none !important; }
        }
      `}</style>

      {/* ── Ambient Radial Glow: Unified deep blue matching the entire page canvas ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 sm:w-250 lg:w-325 h-112.5 sm:h-162.5 bg-radial from-[#103387]/30 via-[#061845]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Standard Navbar max-width Container (max-w-372) */}
      <div
        style={{ perspective: "1400px" }}
        className="w-full max-w-372 mx-auto sm:px-6 md:px-8 lg:px-8 xl:px-12 relative z-10 flex items-center justify-center"
      >
        <h2 className="sr-only">
          Scale and Impact: 10+ Industries, 200+ Corporate Sessions, 8+ Countries, 500+ Sales Teams Coached, 15,000+ Professionals Trained, 3 Continents
        </h2>

        {/* ── STAGE: Exact mathematical 3D ellipse and node coordinate layout (Aspect 1024:629), capped to the viewport so it never overflows below the fold ── */}
        <div
          ref={stageRef}
          className="relative w-full max-w-5xl max-h-[80vh] mx-auto aspect-1024/629 min-h-55"
        >

          {/* Starfield: a scattered, twinkling dust of distant stars */}
          <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
            {STARS.map((star, i) => (
              <span
                key={i}
                className="vc-star absolute rounded-full bg-white"
                style={
                  {
                    left: `${star.left}%`,
                    top: `${star.top}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    opacity: star.baseOpacity,
                    boxShadow: `0 0 ${star.size * 2.5}px rgba(255,255,255,0.85)`,
                    animation: `vc-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
                    "--vc-star-base": star.baseOpacity,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Stage light: fixed glow at the orbit's front apex — whatever
              metric swings through here is the one the "camera" is on */}
          <div
            aria-hidden
            style={{
              left: `${FRONT_POINT.x}%`,
              top: `${FRONT_POINT.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-55 h-55 sm:w-80 sm:h-80 rounded-full bg-linear-to-r from-[#D08817]/20 to-[#F3FC00]/25 blur-[70px] pointer-events-none motion-safe:animate-pulse"
          />

          {/* SVG 3D Ellipse Track: Exact 1024x629 Geometry (cx=512, cy=293, rx=320, ry=110, rotate=14.9deg) */}
          <svg
            viewBox="0 0 1024 629"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="metricsOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D08817" />
                <stop offset="100%" stopColor="#F3FC00" />
              </linearGradient>
            </defs>

            {/* Fainter violet echo band — a smaller, stationary inner ring
                that reads as a second spiral arm layered behind the main one */}
            <ellipse
              ref={echoEllipseRef}
              cx="512"
              cy="293"
              rx="320"
              ry="78"
              transform="rotate(14.9 512 293)"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="1.4"
              opacity="0.25"
              filter="blur(1.5px)"
            />

            {/* Diffused Outer Gradient Glow Orbit */}
            <ellipse
              ref={glowEllipseRef}
              cx="512"
              cy="293"
              rx="320"
              ry="110"
              transform="rotate(14.9 512 293)"
              fill="none"
              stroke="url(#metricsOrbitGrad)"
              strokeWidth="4"
              opacity="0.22"
              filter="blur(4px)"
            />

            {/* Crisp Core Gradient Ellipse Orbit */}
            <ellipse
              ref={ellipseRef}
              cx="512"
              cy="293"
              rx="320"
              ry="110"
              transform="rotate(14.9 512 293)"
              fill="none"
              stroke="url(#metricsOrbitGrad)"
              strokeWidth="1.8"
              opacity="0.75"
              filter="drop-shadow(0 0 10px rgba(243, 252, 0, 0.6))"
            />
          </svg>

          {/* Galactic nucleus: the bright core every metric orbits around */}
          <div
            aria-hidden
            style={{ left: `${CENTER_PCT.x}%`, top: `${CENTER_PCT.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="vc-core w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-white shadow-[0_0_24px_10px_rgba(243,252,0,0.5)]" style={{ animation: "vc-core-pulse 3.2s ease-in-out infinite" }} />
          </div>

          {/* Metric 1: 200+ Corporate Sessions Delivered */}
          {renderTrail(0)}
          <div
            ref={(el) => {
              metricRefs.current[0] = el;
            }}
            style={metricStaticStyle(BASE_ANGLES[0])}
            className="absolute text-center will-change-transform group cursor-pointer"
          >
            <p className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white font-sans transition-transform duration-300 group-hover:scale-108 group-hover:text-[#F3FC00]">
              200+
            </p>
            <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs lg:text-sm text-slate-200/90 font-sans leading-tight">
              Corporate Sessions
              <br />
              Delivered
            </p>
          </div>

          {/* Metric 2: 10+ Industries */}
          {renderTrail(1)}
          <div
            ref={(el) => {
              metricRefs.current[1] = el;
            }}
            style={metricStaticStyle(BASE_ANGLES[1])}
            className="absolute text-center will-change-transform group cursor-pointer"
          >
            <p className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.75rem] font-bold tracking-tight text-white font-sans leading-none transition-transform duration-300 group-hover:scale-104 drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] group-hover:text-[#F3FC00]">
              10+
            </p>
            <p className="mt-0.5 sm:mt-1.5 text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-white font-sans tracking-tight">
              Industries
            </p>
          </div>

          {/* Metric 3: 500+ Sales Team Coached */}
          {renderTrail(2)}
          <div
            ref={(el) => {
              metricRefs.current[2] = el;
            }}
            style={metricStaticStyle(BASE_ANGLES[2])}
            className="absolute text-center will-change-transform group cursor-pointer"
          >
            <p className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-slate-200 font-sans transition-all duration-300 group-hover:scale-108 group-hover:text-white group-hover:opacity-100">
              500+
            </p>
            <p className="mt-0.5 text-[7px] sm:text-[10px] lg:text-[11px] text-slate-400 font-sans leading-tight group-hover:text-slate-200 transition-colors">
              Sales Team
              <br />
              Coached
            </p>
          </div>

          {/* Metric 4: 8+ Countries */}
          {renderTrail(3)}
          <div
            ref={(el) => {
              metricRefs.current[3] = el;
            }}
            style={metricStaticStyle(BASE_ANGLES[3])}
            className="absolute text-center will-change-transform group cursor-pointer"
          >
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white font-sans leading-none transition-transform duration-300 group-hover:scale-108 group-hover:text-[#F3FC00]">
              8+
            </p>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-base md:text-lg lg:text-xl font-medium text-white font-sans tracking-tight">
              Countries
            </p>
          </div>

          {/* Metric 5: 15000+ Professionals Trained */}
          {renderTrail(4)}
          <div
            ref={(el) => {
              metricRefs.current[4] = el;
            }}
            style={metricStaticStyle(BASE_ANGLES[4])}
            className="absolute text-center will-change-transform group cursor-pointer"
          >
            <p className="text-xs sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-200 font-sans transition-all duration-300 group-hover:scale-108 group-hover:text-white group-hover:opacity-100">
              15000+
            </p>
            <p className="mt-0.5 text-[7px] sm:text-[10px] lg:text-[11px] text-slate-400 font-sans leading-tight group-hover:text-slate-200 transition-colors">
              Professionals
              <br />
              Trained
            </p>
          </div>

          {/* Metric 6: 3 Continents */}
          {renderTrail(5)}
          <div
            ref={(el) => {
              metricRefs.current[5] = el;
            }}
            style={metricStaticStyle(BASE_ANGLES[5])}
            className="absolute text-center will-change-transform group cursor-pointer"
          >
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white font-sans leading-none transition-transform duration-300 group-hover:scale-108 group-hover:text-[#F3FC00]">
              3
            </p>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm md:text-base lg:text-lg font-medium text-white font-sans tracking-tight">
              Continents
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
