import { gsap } from "@/lib/animations/gsap";

/**
 * Shared motion vocabulary.
 *
 * Every section draws its easings and durations from here, which is what makes
 * the page feel like one hand rather than six. Entrances use expo.out; anything
 * tied to scroll progress uses power2.inOut; path draws use a linear ease so
 * the line advances at a constant rate. Nothing bounces, nothing overshoots
 * except the small, deliberate settles noted at their call sites.
 */
export const EASE = {
  out: "expo.out",
  inOut: "power2.inOut",
  draw: "none",
  settle: "back.out(1.7)",
} as const;

export const DURATION = {
  atmosphere: 0.9,
  draw: 1.4,
  node: 0.45,
  label: 0.55,
  figure: 1.6,
  copy: 0.7,
  headline: 1.1,
  cta: 0.7,
} as const;

export const STAGGER = {
  node: 0.07,
  label: 0.07,
  content: 0.09,
} as const;

/** Ambient loops are long and desynchronised so nothing ever visibly pulses. */
export const AMBIENT = {
  driftDuration: 22,
  shimmerDuration: 4.2,
} as const;

/**
 * Reads a CSS custom property off an element.
 *
 * Used so that values needed by both the stylesheet and a tween — clip-path
 * polygons, most importantly — are authored once, in CSS, and the timeline
 * reads them rather than restating them.
 */
export function cssVar(element: Element, name: string): string {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

/**
 * Animates an SVG path so the stroke grows outward from its midpoint in both
 * directions at once.
 *
 * With dash pattern [seg, L] and offset -(L - seg)/2, the visible run is
 * centred on L/2 and seg long; sweeping seg from 0 to L therefore opens the
 * line symmetrically. Far more alive than the usual single-ended
 * strokeDashoffset draw, and it suits an arc, which has a natural apex.
 *
 * strokeDasharray/strokeDashoffset are cleared at the end so the resting state
 * is exactly what the stylesheet specifies.
 */
export function drawFromCentre(
  timeline: gsap.core.Timeline,
  path: SVGPathElement,
  position: gsap.Position,
  duration: number = DURATION.draw
): void {
  const length = path.getTotalLength();
  if (!Number.isFinite(length) || length <= 0) return;

  timeline.fromTo(
    path,
    {
      strokeDasharray: `0 ${length}`,
      strokeDashoffset: -length / 2,
    },
    {
      strokeDasharray: `${length} ${length}`,
      strokeDashoffset: 0,
      duration,
      ease: EASE.draw,
      clearProps: "strokeDasharray,strokeDashoffset",
    },
    position
  );
}

/**
 * Animates an SVG path from one end to the other. Used where a line has a
 * direction of travel — the Curriculum timeline, the Partner feed.
 */
export function drawFromStart(
  timeline: gsap.core.Timeline,
  path: SVGPathElement,
  position: gsap.Position,
  duration: number = DURATION.draw
): void {
  const length = path.getTotalLength();
  if (!Number.isFinite(length) || length <= 0) return;

  timeline.fromTo(
    path,
    { strokeDasharray: length, strokeDashoffset: length },
    {
      strokeDashoffset: 0,
      duration,
      ease: EASE.draw,
      clearProps: "strokeDasharray,strokeDashoffset",
    },
    position
  );
}



/** Typed querySelectorAll that drops the nullable noise at every call site. */
export function all<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function one<T extends Element>(root: ParentNode, selector: string): T | null {
  return root.querySelector<T>(selector);
}
