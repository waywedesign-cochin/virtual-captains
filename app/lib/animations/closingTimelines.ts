import { gsap } from "@/lib/animations/gsap";
import { all, EASE, one } from "@/lib/animations/shared";

/**
 * Career CTA: a single line of type revealing upward, word by word, the
 * instant it's worth reading — this section is one line of type in a large
 * deliberate void, so the reveal has to be the whole event.
 *
 * Each word is already wrapped in its own `inline-block overflow-hidden`
 * clip (a Tailwind-utility span built in Phase 2 specifically for this) —
 * the inner `[data-career-word]` span just needs to travel from below that clip up to
 * its resting position. Plays once, forward only: unlike Curriculum or
 * Partner Network this isn't a diagram that benefits from scrubbing back
 * and forth, it's a line being said once.
 *
 * The two words inside `[data-career-accent]` (`grad-text`, a gradient painted
 * via `background-clip: text`) are an exception: giving such a span a
 * `transform` — even a no-op `translateY(0%)` — makes Chromium stop
 * painting the gradient fill for that element entirely, confirmed by
 * screenshotting both states rather than assumed. Those two words fade in
 * instead of sliding; every other word gets the full upward slide. Built
 * word-by-word rather than as one staggered array so the two techniques can
 * interleave while keeping one continuous left-to-right reveal order.
 */
export function buildCareerTimeline(scope: HTMLElement): void {
  const media = gsap.matchMedia(scope);

  media.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)",
    },
    (context) => {
      if (!context.conditions?.motion) return;
      const { isDesktop } = context.conditions;

      const textContainer = one<HTMLElement>(scope, "#career-heading");
      const leftPart = one<HTMLElement>(scope, "[data-career-left]");
      const rightPart = one<HTMLElement>(scope, "[data-career-right]");
      const button = one<HTMLElement>(scope, "[data-career-button]");

      if (!leftPart || !rightPart || !button || !textContainer) return;

      const section = scope.closest('section') || scope;

      // Phase 1: Pin the section, scale up the text, then split it and show the button
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top", // Starts exactly when the section hits the top of screen
          end: "+=150%", // Keep it pinned for 1.5x screen height
          pin: true,
          pinSpacing: true,
          scrub: 1,
        },
      });

      // Scale up the text container
      tl.fromTo(
        textContainer,
        { scale: 0.8 },
        { scale: 1, duration: 1, ease: "power1.inOut" }
      );

      const xOffset = isDesktop ? "25vw" : "0";
      const yOffset = isDesktop ? "0" : "15vh";

      tl.to(leftPart, {
        x: isDesktop ? `-${xOffset}` : "0",
        y: isDesktop ? "0" : `-${yOffset}`,
        duration: 1.5,
        ease: "power2.inOut",
      }, "split");

      tl.to(rightPart, {
        x: isDesktop ? xOffset : "0",
        y: isDesktop ? "0" : yOffset,
        duration: 1.5,
        ease: "power2.inOut",
      }, "split");

      tl.to(button, {
        scale: 1,
        opacity: 1,
        pointerEvents: "auto",
        duration: 1,
        ease: "back.out(1.5)",
      }, "split+=0.2"); // Starts shortly after split begins
    }
  );
}

/**
 * Footer: the giant word drifts a small, constant amount as the footer
 * passes through the viewport — atmosphere, not a reveal (the word itself
 * needs none; it's white type that simply emerges as the background behind
 * it darkens, per the note in Footer.tsx). Everything else in the grid rises
 * in together once, the same "said once" logic as the Career CTA above.
 */
export function buildFooterTimeline(scope: HTMLElement): void {
  const media = gsap.matchMedia(scope);

  media.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      if (!context.conditions?.motion) return;

      const word = one<HTMLElement>(scope, "[data-footer-word]");
      if (word) {
        gsap.fromTo(
          word,
          { y: -18 },
          {
            y: 18,
            ease: EASE.draw,
            scrollTrigger: {
              trigger: scope,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      }

      const gridItems = all<HTMLElement>(scope, "[data-footer-grid] > *");
      if (gridItems.length > 0) {
        gsap.from(gridItems, {
          opacity: 0,
          y: 28,
          duration: 0.7,
          ease: EASE.out,
          stagger: 0.08,
          scrollTrigger: {
            trigger: scope,
            start: "top 68%",
            toggleActions: "play none none none",
          },
        });
      }

      const bar = one<HTMLElement>(scope, "[data-footer-bar]");
      if (bar) {
        gsap.from(bar, {
          opacity: 0,
          y: 16,
          duration: 0.6,
          ease: EASE.out,
          scrollTrigger: {
            trigger: bar,
            start: "top 94%",
            toggleActions: "play none none none",
          },
        });
      }
    }
  );
}
