import { gsap } from "@/lib/animations/gsap";
import { all, EASE, one } from "@/lib/animations/shared";

export function buildCurriculumTimeline(scope: HTMLElement): void {
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

      if (conditions.compact) {
        buildCompactReveal(scope);
        return;
      }

      // Desktop: Sticky Scroll Interactions
      const stage = one<HTMLElement>(scope, "[data-curriculum-stage]");
      const timelineFill = one<HTMLElement>(scope, "[data-timeline-fill]");
      const cards = all<HTMLElement>(scope, "[data-curriculum-card]");
      const nodes = all<HTMLElement>(scope, "[data-timeline-node]");

      if (!stage || !timelineFill || cards.length === 0) return;

      // 1. Animate the timeline fill based on scroll depth of the stage
      gsap.fromTo(
        timelineFill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top 50%", // Start filling when stage hits middle
            end: "bottom 70%", // Finish filling near the end of the cards
            scrub: true,
          },
        },
      );

      // 2. Animate each card and its node as they enter the viewport
      cards.forEach((card, i) => {
        const node = nodes[i];

        // The card visual entry
        gsap.fromTo(
          card,
          { opacity: 0.3, scale: 0.95, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: EASE.out,
            scrollTrigger: {
              trigger: card,
              start: "top 75%", // Highlight when card is in the lower-middle
              end: "bottom 25%", // Fade out when it goes too high
              toggleActions: "play reverse play reverse", // active/inactive state
            },
          },
        );

        // The node dot light up
        if (node) {
          gsap.fromTo(
            node,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: EASE.settle,
              scrollTrigger: {
                trigger: card,
                start: "top 65%", // Dot lights up just as card becomes active
                toggleActions: "play reverse play reverse",
              },
            },
          );
        }
      });
    },
  );
}

function buildCompactReveal(scope: HTMLElement): void {
  const items = all<HTMLElement>(scope, "[data-curriculum-rail-item]");

  // Same zoom-bounce heading entrance used across the site
  const heading = one<HTMLElement>(scope, "[data-curriculum-compact-heading]");
  if (heading) {
    gsap.set(heading, { opacity: 0, scale: 0.65, y: 20 });
    gsap.to(heading, {
      scrollTrigger: { trigger: heading, start: "top 88%", toggleActions: "play none none reverse" },
      opacity: 1,
      y: 0,
      duration: 0.85,
      keyframes: [
        { scale: 1.15, opacity: 1, y: -4, duration: 0.42, ease: "power2.out" },
        { scale: 0.94, y: 2, duration: 0.22, ease: "sine.inOut" },
        { scale: 1.0, y: 0, duration: 0.21, ease: "power2.out" },
      ],
    });
  }

  items.forEach((item) => {
    gsap.fromTo(
      item,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: EASE.out,
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}
