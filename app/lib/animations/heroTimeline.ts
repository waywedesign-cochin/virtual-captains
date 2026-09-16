import { gsap } from "@/lib/animations/gsap";
import {
  all,
  AMBIENT,
  cssVar,
  drawFromCentre,
  DURATION,
  EASE,
  one,
  STAGGER,
} from "@/lib/animations/shared";

/**
 * Hero entrance.
 *
 * Runs on load rather than on scroll — the hero is already in view. The order
 * is deliberate and reads as one thought: the atmosphere settles, the orbit
 * draws itself outward from its apex, its nodes light up in geometric order,
 * each label arrives just behind its own node, the figure resolves, and only
 * then does the copy speak. The CTA is last, opening outward from the seam
 * where the two buttons meet.
 *
 * Everything is expressed with `.from()` and `.fromTo()` against values that
 * live in the stylesheet, so the resting state is exactly the static build:
 * if this never runs — no JS, an error, reduced motion — the hero is complete
 * and correct.
 */
export function buildHeroTimeline(scope: HTMLElement): void {
  const media = gsap.matchMedia(scope);

  media.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
      compact: "(max-width: 767px)",
    },
    (context) => {
      const conditions = context.conditions;
      if (!conditions?.motion) return;

      const compact = conditions.compact === true;

      const wash = one<HTMLElement>(document, ".atmosphere__wash");
      const grain = one<HTMLElement>(document, ".atmosphere__grain");
      const arcs = all<SVGPathElement>(scope, "[data-orbit-arc]");
      const system = one<SVGGElement>(scope, "[data-orbit-system]");
      const items = all<SVGGElement>(scope, "[data-orbit-item]");
      const halo = one<HTMLElement>(scope, ".hero__halo");
      const figure = one<HTMLElement>(scope, ".hero__figure");
      const eyebrow = one<HTMLElement>(scope, ".hero__eyebrow");
      const headline = one<HTMLElement>(scope, ".hero__headline");
      const underline = one<HTMLElement>(scope, ".hero__cta-underline");
      const ctaComposition = one<HTMLElement>(scope, ".hero__cta-composition");

      const tl = gsap.timeline({
        defaults: { ease: EASE.out },
        // A beat before anything moves, so the page has visibly arrived
        // before it starts performing.
        delay: 0.15,
      });

      /* 1 — atmosphere ---------------------------------------------------- */
      if (wash) {
        tl.from(wash, { opacity: 0, duration: DURATION.atmosphere }, 0);
      }
      if (grain) {
        tl.from(grain, { opacity: 0, duration: DURATION.atmosphere }, 0);
      }

      /* 2 — the orbit draws outward from its apex -------------------------- */
      // Outer arcs lead, the node-bearing arc lands last, so the system reads
      // as building toward the line the navigation actually sits on.
      const arcOrder: SVGPathElement[] = [...arcs].sort((a, b) => {
        const rank = (el: SVGPathElement): number =>
          el.dataset.orbitArc === "primary" ? 2 : el.dataset.orbitArc === "secondary" ? 1 : 0;
        return rank(a) - rank(b);
      });

      arcOrder.forEach((arc, index) => {
        drawFromCentre(tl, arc, 0.15 + index * 0.2);
      });

      /* 3 — nodes fire in geometric order, apex outward -------------------- */
      // Sorted by distance from the apex rather than DOM order, so the light
      // travels along the arc instead of jumping between sides.
      const centre = scope.getBoundingClientRect().width / 2;
      const ordered = [...items].sort((a, b) => {
        const offset = (el: SVGGElement): number => {
          const node = el.querySelector<SVGCircleElement>("[data-orbit-node]");
          if (!node) return 0;
          return Math.abs(node.getBoundingClientRect().left - centre);
        };
        return offset(a) - offset(b);
      });

      ordered.forEach((item, index) => {
        const node = item.querySelector<SVGCircleElement>("[data-orbit-node]");
        const glow = item.querySelector<SVGCircleElement>("[data-orbit-node-glow]");
        const label = item.querySelector<SVGTextElement>("[data-orbit-label]");
        const at = 0.9 + index * STAGGER.node;

        // Radius rather than scale: an SVG circle has no reliable transform
        // origin across engines, and r animates cleanly at any viewBox scale.
        if (node) {
          const r = node.getAttribute("r") ?? "4.2";
          tl.fromTo(
            node,
            { attr: { r: 0 } },
            { attr: { r }, duration: DURATION.node, ease: EASE.settle },
            at
          );
        }
        if (glow) {
          const r = glow.getAttribute("r") ?? "13";
          tl.fromTo(
            glow,
            { attr: { r: 0 }, opacity: 0 },
            { attr: { r }, opacity: 1, duration: DURATION.node * 1.6, ease: EASE.out },
            at
          );
        }
        if (label) {
          tl.from(
            label,
            { opacity: 0, y: 8, duration: DURATION.label },
            at + 0.15
          );
        }
      });

      /* 4 — the figure resolves ------------------------------------------- */
      if (halo) {
        tl.from(halo, { opacity: 0, duration: DURATION.figure }, 1.15);
      }
      if (figure) {
        tl.from(
          figure,
          {
            opacity: 0,
            scale: 1.04,
            transformOrigin: "50% 0%",
            duration: DURATION.figure,
          },
          1.2
        );
      }

      /* 5 — copy ------------------------------------------------------------ */
      if (eyebrow) {
        tl.from(eyebrow, { opacity: 0, y: 18, duration: DURATION.copy }, 1.45);
      }

      if (headline) {
        // A light wipe travelling left to right, driven by the mask's own
        // custom property, plus a blur that clears as it passes. The gradient
        // appears to be lit rather than faded in.
        tl.fromTo(
          headline,
          { "--reveal": "-14%", filter: "blur(14px)", opacity: 0 },
          {
            "--reveal": "100%",
            filter: "blur(0px)",
            opacity: 1,
            duration: DURATION.headline,
            ease: EASE.inOut,
            // --reveal is deliberately left inline at its resting 100%:
            // clearProps on a custom property is not worth relying on, and the
            // value it lands on is the value the stylesheet declares anyway.
            clearProps: "filter",
          },
          1.55
        );
      }

      /* 6 — the CTA system opens outward from the seam --------------------- */
      if (underline) {
        gsap.set(underline, { scaleX: 0, opacity: 0 });
        tl.to(
          underline,
          { scaleX: 1, opacity: 1, duration: 0.9, ease: EASE.out },
          2.05
        );
      }

      if (ctaComposition) {
        tl.fromTo(
          ctaComposition,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: DURATION.cta,
            ease: EASE.inOut,
          },
          2.25
        );
      }

      /* 7 — ambient ---------------------------------------------------------
         The whole orbit drifts as one body, so a label can never separate from
         its node, and the drift is small enough (2px over 22s) to register as
         atmosphere rather than motion. Skipped on compact viewports, where it
         buys nothing and costs a permanent compositor layer.                 */
      if (system && !compact) {
        gsap.to(system, {
          y: 2.5,
          scale: 1.0025,
          transformOrigin: "50% 0%",
          duration: AMBIENT.driftDuration,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 3,
        });

        all<SVGCircleElement>(scope, "[data-orbit-node-glow]").forEach((glow, index) => {
          gsap.to(glow, {
            opacity: 0.72,
            duration: AMBIENT.shimmerDuration + index * 0.37,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 3 + index * 0.6,
          });
        });

        // A slow, barely-there drift on the figure itself — small enough to
        // read as ambient presence rather than motion, in the same register
        // as the orbit's own drift above.
        if (figure) {
          gsap.to(figure, {
            y: -8,
            scale: 1.012,
            transformOrigin: "50% 0%",
            duration: AMBIENT.driftDuration * 0.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 2,
          });
        }
        if (halo) {
          gsap.to(halo, {
            opacity: 0.75,
            scale: 1.06,
            duration: AMBIENT.shimmerDuration * 1.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 2.4,
          });
        }

        // "Torch shining on a line" loop — instead of drawing the path, the path
        // is fully rendered but hidden by an SVG mask. We animate the mask's
        // "torch spot" (a rectangle with a soft gradient) across the screen.
        all<SVGRectElement>(scope, ".orbit__torch-spot").forEach((spot, index) => {
          const speed = 6 + index * 2.5; // primary 6s, secondary 8.5s
          const startDelay = 3.5 + index * 1.2;

          // The SVG viewBox is 1512 wide. We animate from well off-screen left
          // to well off-screen right so the light enters and exits smoothly.
          gsap.fromTo(
            spot,
            { attr: { x: -600 } },
            {
              attr: { x: 1700 },
              duration: speed,
              ease: "none",
              repeat: -1,
              delay: startDelay,
            }
          );
        });

        // The CTA lines (bracket and underline) share a similar travelling light effect.
        const ctaMaskRects = all<HTMLElement>(scope, ".hero__cta-mask-rect");
        if (ctaMaskRects.length > 0) {
          gsap.fromTo(
            ctaMaskRects,
            { attr: { x: -400, x1: -400, x2: 0 } },
            {
              attr: { x: 1400, x1: 1400, x2: 1800 },
              duration: AMBIENT.shimmerDuration * 1.5,
              ease: "linear",
              repeat: -1,
              delay: 4,
            }
          );
        }
      }
    }
  );
}
