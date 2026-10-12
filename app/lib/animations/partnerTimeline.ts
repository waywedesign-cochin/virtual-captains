import { gsap } from "@/lib/animations/gsap";
import {
  EMISSION_STAGGER,
  EMISSION_WINDOW,
  HUB_SCALE,
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

      // Below desktop the stage isn't rendered (PartnerNetworkCompact takes
      // over), so there is nothing to pin or emit.
      if (conditions.compact) return;

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

      const section = scope.closest("section") || scope;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: EASE.inOut },
      });

      /* 1 — the connector lines draw in first, establishing the network the
         logos are about to join. No clearProps: at full draw the dash covers
         the whole path, which is visually identical to the unset stylesheet
         state, and clearing it mid-scrub only risks a jump as the scrub
         crosses that boundary in either direction. */
      lines.forEach((line, index) => {
        // getTotalLength() is in viewBox units, but with non-scaling-stroke
        // the dash is in screen pixels — once the stretched SVG is taller
        // than its viewBox the dash falls short and leaves a gap. Scale it up.
        const total = line.getTotalLength();
        if (!Number.isFinite(total) || total <= 0) return;
        const svg = line.ownerSVGElement;
        const box = svg?.getBoundingClientRect();
        const vb = svg?.viewBox.baseVal;
        const stretch =
          box && vb && vb.width && vb.height
            ? Math.max(box.width / vb.width, box.height / vb.height, 1)
            : 1;
        const length = total * stretch * 1.05;
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
          { attr: { x1: -1000, x2: 508 } },
          { attr: { x1: 2, x2: 1510 }, duration: 0.6, ease: EASE.inOut },
          EMISSION_WINDOW.start
        );
      }

      /* 4 — each logo starts compressed and scattered inside the hub, then
         travels out to the destination it is already sitting in. Inner
         positions in the grid are staggered to fire first, which is what
         makes the release read as a fan rather than eight things moving at
         once. */
      // Fit the whole fan inside the emission window, however many logos,
      // and release them nearest-the-hub first so it reads as a burst.
      const stagger = Math.min(
        EMISSION_STAGGER,
        ((EMISSION_WINDOW.end - EMISSION_WINDOW.start) * 0.55) / Math.max(logos.length - 1, 1)
      );
      const hubRect = hub.getBoundingClientRect();
      const hubX = hubRect.left + hubRect.width / 2;
      const hubY = hubRect.top + hubRect.height / 2;
      const distance = (el: HTMLElement) => {
        const r = el.parentElement!.getBoundingClientRect();
        return Math.hypot(r.left + r.width / 2 - hubX, r.top + r.height / 2 - hubY);
      };
      const order = new Map(
        [...logos].sort((a, b) => distance(a) - distance(b)).map((el, rank) => [el, rank])
      );
      // Starting state: a halo. Cards are spaced evenly round the hub, each
      // on the side it will fly towards and turned like a spoke, so the
      // burst reads as one shape opening rather than a pile coming apart.
      const towards = (el: HTMLElement) => {
        const r = el.parentElement!.getBoundingClientRect();
        return Math.atan2(r.top + r.height / 2 - hubY, r.left + r.width / 2 - hubX);
      };
      const ringAngle = new Map(
        [...logos]
          .sort((a, b) => towards(a) - towards(b))
          .map((el, k) => [el, -Math.PI + (k / logos.length) * Math.PI * 2])
      );
      logos.forEach((logo, i) => {
        const index = order.get(logo) ?? i;
        const angle = ringAngle.get(logo) ?? 0;

        const fromX = () => {
          const hubBox = hub.getBoundingClientRect();
          const slotBox = logo.parentElement!.getBoundingClientRect();
          const hubCentre = hubBox.left + hubBox.width / 2;
          const slotCentre = slotBox.left + slotBox.width / 2;
          return hubCentre - slotCentre + Math.cos(angle) * hubBox.width * 0.72;
        };
        const fromY = () => {
          const hubBox = hub.getBoundingClientRect();
          const slotBox = logo.parentElement!.getBoundingClientRect();
          const hubCentre = hubBox.top + hubBox.height / 2;
          const slotCentre = slotBox.top + slotBox.height / 2;
          return hubCentre - slotCentre + Math.sin(angle) * hubBox.width * 0.72;
        };

        const start = EMISSION_WINDOW.start + index * stagger;
        const span = EMISSION_WINDOW.end - EMISSION_WINDOW.start;
        const duration = Math.max(span - index * stagger * 0.4, 0.22);

        tl.fromTo(
          logo,
          {
            x: fromX,
            y: fromY,
            scale: HUB_SCALE,
            rotate: (angle * 180) / Math.PI,
            opacity: 0.9,
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

      /* 4b — the glowing core the halo circles collapses as it opens. */
      const core = one<HTMLElement>(scope, "[data-partner-core]");
      if (core) {
        tl.fromTo(
          core,
          { scale: 1, opacity: 1 },
          { scale: 0.3, opacity: 0, duration: 0.35, ease: EASE.inOut },
          EMISSION_WINDOW.start + 0.05
        );
      }

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
