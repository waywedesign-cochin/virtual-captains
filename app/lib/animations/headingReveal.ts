/**
 * Site-wide heading entrance — the single source of truth for how section
 * headings appear. Tune it here and every page follows.
 *
 * One smooth motion, no overshoot: the heading fades in, rises slightly and
 * settles from a gentle 92% scale over a long ease-out ("expo.out" starts
 * decisively and lands softly). This replaced the old 0.85s
 * zoom-overshoot-bounce keyframes (65% → 115% → 94% → 100%), which read as
 * rushed and playful rather than premium.
 *
 * Usage:
 *   gsap.set(el, { ...HEADING_REVEAL_FROM, transformOrigin: "center center" });
 *   gsap.to(el, { opacity: 1, y: 0, ...HEADING_REVEAL, scrollTrigger: {...} });
 */

/** Starting state (hidden) — spread into gsap.set / fromTo "from" vars. */
export const HEADING_REVEAL_FROM = {
  opacity: 0,
  scale: 0.92,
  y: 24,
} as const;

/** Resting state + timing — spread last so it overrides duration/ease. */
export const HEADING_REVEAL = {
  opacity: 1,
  scale: 1,
  y: 0,
  duration: 1.2,
  ease: "expo.out",
} as const;
