/**
 * Hero orbit geometry.
 *
 * The six nav nodes in the reference all sit on one circle. Fitting a circle
 * through the measured node centres (418,194) (613,147) (853,148) (1064,194)
 * at a 1512-wide artboard gives centre (729, 1060) with r = 920 — and the
 * About and Resources nodes fall on the same circle, which is why they read as
 * one continuous system rather than scattered decoration.
 *
 * Deriving every node and label from that circle means a label can never drift
 * away from its node, at any viewport size or animation state.
 */

export const ORBIT_VIEWBOX = { width: 1512, height: 420 } as const;

export interface ArcSpec {
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  /** Sweep half-width in degrees from the apex. */
  readonly spread: number;
}

/** Carries the nav nodes. */
export const PRIMARY_ARC: ArcSpec = { cx: 729, cy: 1060, r: 920, spread: 41 };

/** Decorative companions — concentric and strictly parallel with PRIMARY_ARC, zero collisions. */
export const SECONDARY_ARC: ArcSpec = { cx: 729, cy: 1060, r: 885, spread: 37 };
export const TERTIARY_ARC: ArcSpec = { cx: 729, cy: 1060, r: 850, spread: 33 };

export interface Point {
  readonly x: number;
  readonly y: number;
}

const toRad = (deg: number): number => (deg * Math.PI) / 180;

/** Point on an arc at `angle` degrees from its apex. Positive is clockwise. */
export function pointOnArc(arc: ArcSpec, angle: number): Point {
  const rad = toRad(angle);
  return {
    x: arc.cx + arc.r * Math.sin(rad),
    y: arc.cy - arc.r * Math.cos(rad),
  };
}

/**
 * Point offset radially outward from the arc — used to place a label above its
 * node along the curve's normal, which is why labels lean outward at the ends
 * exactly as they do in the reference.
 */
export function pointOffArc(arc: ArcSpec, angle: number, distance: number): Point {
  const rad = toRad(angle);
  return {
    x: arc.cx + (arc.r + distance) * Math.sin(rad),
    y: arc.cy - (arc.r + distance) * Math.cos(rad),
  };
}

/** SVG path data for the full visible sweep of an arc. */
export function arcPath(arc: ArcSpec): string {
  const start = pointOnArc(arc, -arc.spread);
  const end = pointOnArc(arc, arc.spread);
  const largeArc = arc.spread * 2 > 180 ? 1 : 0;
  return [
    `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
    `A ${arc.r} ${arc.r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
  ].join(" ");
}

/** Distance, in user units, from a node to the baseline of its label. */
export const LABEL_OFFSET = 30;
