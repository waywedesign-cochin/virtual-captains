/**
 * Partner Network transformation parameters.
 *
 * Destinations are deliberately NOT stored as a coordinate table. The logos are
 * rendered inside their destination boxes, so their resting positions come from
 * real layout and are correct at every breakpoint for free. Phase 5 measures
 * those rects once when the ScrollTrigger is built (and again on refresh), then
 * animates each logo from the hub to `transform: none` — which is what makes
 * the scrub exactly reversible and keeps the responsive layouts honest.
 *
 * What does belong here is the part layout cannot express: how the logos are
 * stacked while they are still inside the hub.
 */

/**
 * Small deterministic offsets applied to each logo inside the hub, so the
 * grouped state reads as a dense stack rather than one flat square. Seeded
 * rather than random: the initial state must be identical on every render, or
 * a scrubbed reverse would not land where it started.
 *
 * Values are in hub-relative units (a fraction of the hub's own size), so they
 * scale with the hub instead of drifting at small viewports.
 */
export interface HubOffset {
  readonly dx: number;
  readonly dy: number;
  readonly rotate: number;
}

export const HUB_SCATTER: ReadonlyArray<HubOffset> = [
  { dx: -0.05, dy: -0.035, rotate: -3.2 },
  { dx: 0.04, dy: -0.05, rotate: 2.4 },
  { dx: -0.025, dy: 0.04, rotate: 1.6 },
  { dx: 0.05, dy: 0.025, rotate: -2.1 },
  { dx: -0.04, dy: -0.01, rotate: 3 },
  { dx: 0.015, dy: 0.05, rotate: -1.4 },
  { dx: 0.03, dy: -0.025, rotate: 2.8 },
  { dx: -0.015, dy: 0.015, rotate: -2.6 },
];

/** Scale a logo is compressed to while it is still inside the hub. */
export const HUB_SCALE = 0.22;

/**
 * How far each logo's travel is staggered, as a fraction of the scrubbed
 * timeline. Inner columns land first, which is what makes the emission read as
 * a fan rather than eight things moving at once.
 */
export const EMISSION_STAGGER = 0.06;

/** Portion of the pinned scroll the emission itself occupies. */
export const EMISSION_WINDOW = { start: 0.2, end: 0.7 } as const;
