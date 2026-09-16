import { gsap } from "@/lib/animations/gsap";
import {
  EMISSION_STAGGER,
  EMISSION_WINDOW,
  HUB_SCALE,
  HUB_SCATTER,
} from "@/lib/partnerLayout";
import { all, EASE, one } from "@/lib/animations/shared";

/**
 * Partner Network: a hub condenses into eight logos, then releases them
 * outward into the grid they actually occupy.
 *
 * The trick that makes this exactly reversible with no coordinate table to
 * keep in sync: the logos already sit inside their real destination frames
 * in normal document flow — `transform: none` IS their correct resting
 * position at every breakpoint, for free. All this timeline does is start
 * each logo displaced back toward the hub (measured live, not hand-typed)
 * and animate it to `x: 0, y: 0, scale: 1, rotate: 0`. Scrubbing the
 * ScrollTrigger backward un-emits them, because that is literally what the
 * tween's start state is.
 *
 * Distances are measured with `getBoundingClientRect()` through function-
 * based tween values rather than once at build time, so `invalidateOnRefresh`
 * re-measures them on any layout change (a resize crossing a breakpoint, a
 * font swap) instead of the emission silently drifting stale.
 */
export function buildPartnerTimeline(scope: HTMLElement): void {
  const media = gsap.matchMedia(scope);

  media.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
      compact: "(max-width: 1023px)",
    },
    (context) => {
      const conditions = context.conditions;
      if (!conditions?.motion) return;

      const compact = conditions.compact === true;

      const hub = one<HTMLElement>(scope, "[data-partner-hub]");
      const hubPlate = one<HTMLElement>(scope, ".partner__hub-plate");
      const logos = all<HTMLElement>(scope, "[data-partner-logo]");
      const releaseNode = one<HTMLElement>(scope, "[data-partner-release-node]");
      const lines = all<SVGPathElement>(scope, "[data-partner-line]");
      const floorGradient = scope.querySelector<SVGLinearGradientElement>(
        "#partnerFloorGradient"
      );

      if (!hub || logos.length === 0) {
        console.warn("buildPartnerTimeline failed to find hub or logos", { hub, logos: logos.length });
        return;
      }
      console.log("buildPartnerTimeline successfully found hub and logos", { hub, logos: logos.length });

      const section = scope.closest('section') || scope;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 50%", // Start when section reaches middle of screen
          end: "+=100%",    // Scrub for 100% of height
          scrub: 1,
          pin: false,       // Don't pin to avoid layout issues, just scrub
        },
        defaults: { ease: EASE.inOut },
      });

      /* 1 — the connector lines draw in first, establishing the network the
         logos are about to join. No clearProps: at full draw the dash covers
         the whole path, which is visually identical to the unset stylesheet
         state, and clearing it mid-scrub only risks a jump as the scrub
         crosses that boundary in either direction. */
      lines.forEach((line, index) => {
        const length = line.getTotalLength();
        if (!Number.isFinite(length) || length <= 0) return;
        tl.fromTo(
          line,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 0.5, ease: EASE.draw },
          index * 0.03
        );
      });

      /* 2 — removed hub condensation animation as requested; hub remains invisible anchor */

      /* 3 — the floor's bloom travels across as the emission happens, rather
         than sitting static — this is what makes the network read as being
         energised rather than just decorated. Shifting the gradient vector
         (not the stops) slides the same bright band along the path. */
      if (floorGradient) {
        tl.fromTo(
          floorGradient,
          { attr: { x1: -400, x2: 570 } },
          { attr: { x1: 110, x2: 1080 }, duration: 0.6, ease: EASE.inOut },
          EMISSION_WINDOW.start
        );
      }

      /* 4 — each logo starts compressed and scattered inside the hub, then
         travels out to the destination it is already sitting in. Inner
         positions in the grid are staggered to fire first, which is what
         makes the release read as a fan rather than eight things moving at
         once. */
      logos.forEach((logo, index) => {
        const scatter = HUB_SCATTER[index % HUB_SCATTER.length] ?? {
          dx: 0,
          dy: 0,
          rotate: 0,
        };

        const fromX = () => {
          const hubBox = hub.getBoundingClientRect();
          const slotBox = logo.parentElement!.getBoundingClientRect();
          const hubCentre = hubBox.left + hubBox.width / 2;
          const slotCentre = slotBox.left + slotBox.width / 2;
          return hubCentre - slotCentre + scatter.dx * hubBox.width;
        };
        const fromY = () => {
          const hubBox = hub.getBoundingClientRect();
          const slotBox = logo.parentElement!.getBoundingClientRect();
          const hubCentre = hubBox.top + hubBox.height / 2;
          const slotCentre = slotBox.top + slotBox.height / 2;
          return hubCentre - slotCentre + scatter.dy * hubBox.height;
        };

        const start = EMISSION_WINDOW.start + index * EMISSION_STAGGER;
        const span = EMISSION_WINDOW.end - EMISSION_WINDOW.start;
        const duration = Math.max(span - index * EMISSION_STAGGER * 0.4, 0.22);

        tl.fromTo(
          logo,
          {
            x: fromX,
            y: fromY,
            scale: HUB_SCALE,
            rotate: scatter.rotate,
            opacity: 1,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration,
            ease: EASE.out,
          },
          start
        );
      });

      /* 5 — the release node pulses awake right as the emission lands. */
      if (releaseNode) {
        tl.fromTo(
          releaseNode,
          { scale: 0.4, opacity: 0.4 },
          { scale: 1, opacity: 1, duration: 0.3, ease: EASE.settle },
          EMISSION_WINDOW.end - 0.1
        );
      }
    }
  );
}
