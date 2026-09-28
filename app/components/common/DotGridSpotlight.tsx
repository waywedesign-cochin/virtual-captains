"use client";

import { useEffect, useRef } from "react";

/**
 * Dot-grid hover effect as a reusable page background: a faint dot grid plus
 * a brighter copy revealed in a soft circle around the cursor.
 *
 * variant "footer" (default) — matches the site footer: 32px grid, faint
 *   dots, lit dots that slowly cycle cyan → sky → royal blue → white.
 * variant "hero" — matches the home hero: 26px grid, white lit dots.
 *
 * - Fills its nearest positioned ancestor (absolute inset-0), so it covers a
 *   whole page and stays locked to the cursor while scrolling.
 * - Mouse only (touch has no hover) and off under reduced motion — there it
 *   is just the static grid.
 * - rAF-driven; runs only while the spotlight is moving or visible.
 */

// Same palette and timing as the footer's torch (SiteFooter)
const TORCH = [
  [56, 189, 248], // cyan  #38bdf8
  [143, 208, 255], // sky   #8fd0ff
  [42, 130, 255], // royal #2a82ff
  [255, 255, 255], // white
];
const TORCH_STEP_MS = 3200;

function torchColor(t: number) {
  const pos = (t / TORCH_STEP_MS) % TORCH.length;
  const i = Math.floor(pos);
  const a = TORCH[i];
  const b = TORCH[(i + 1) % TORCH.length];
  const k = pos - i;
  const e = k * k * (3 - 2 * k); // sine-ish ease between stops
  const c = a.map((v, j) => Math.round(v + (b[j] - v) * e));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

const VARIANTS = {
  footer: {
    size: 32,
    base: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
    glowDot: "1.5px, transparent 2.4px",
    radius: 180,
    torch: true,
  },
  hero: {
    size: 26,
    base: "radial-gradient(rgba(255,255,255,0.16) 1.2px, transparent 1.6px)",
    glowDot: "1.8px, transparent 2.4px",
    radius: 200,
    torch: false,
  },
} as const;

export default function DotGridSpotlight({
  variant = "footer",
  className = "",
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  const v = VARIANTS[variant];
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const glow = glowRef.current;
    if (!root || !glow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let targetX = -9999, targetY = -9999, x = -9999, y = -9999;
    let targetOpacity = 0, opacity = 0;
    let raf = 0;

    const tick = (now: number) => {
      x += (targetX - x) * 0.25;
      y += (targetY - y) * 0.25;
      opacity += (targetOpacity - opacity) * 0.15;
      const rect = root.getBoundingClientRect();
      glow.style.setProperty("--dx", `${x - rect.left}px`);
      glow.style.setProperty("--dy", `${y - rect.top}px`);
      glow.style.opacity = opacity.toFixed(3);
      if (v.torch) glow.style.setProperty("--torch", torchColor(now));

      const settled =
        Math.abs(targetX - x) < 0.5 &&
        Math.abs(targetY - y) < 0.5 &&
        Math.abs(targetOpacity - opacity) < 0.01;
      // The torch colour keeps cycling while the spotlight is visible
      const keepGoing = !settled || (v.torch && opacity > 0.01);
      raf = keepGoing ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (targetOpacity === 0) {
        // Appear in place rather than sweeping in from the last position
        x = targetX = e.clientX;
        y = targetY = e.clientY;
      }
      targetX = e.clientX;
      targetY = e.clientY;
      targetOpacity = 1;
      kick();
    };
    const onLeave = () => {
      targetOpacity = 0;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", kick, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", kick);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [v.torch]);

  const mask = `radial-gradient(${v.radius}px circle at var(--dx, -9999px) var(--dy, -9999px), rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 45%, transparent 70%)`;
  const glowColor = v.torch ? "var(--torch, rgba(255,255,255,0.95))" : "rgba(255,255,255,0.75)";

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ backgroundImage: v.base, backgroundSize: `${v.size}px ${v.size}px` }}
    >
      <div
        ref={glowRef}
        className="absolute inset-0 will-change-[opacity]"
        style={{
          opacity: 0,
          backgroundImage: `radial-gradient(${glowColor} ${v.glowDot})`,
          backgroundSize: `${v.size}px ${v.size}px`,
          maskImage: mask,
          WebkitMaskImage: mask,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
