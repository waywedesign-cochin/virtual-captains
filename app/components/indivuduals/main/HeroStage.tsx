"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@/lib/animations/gsap";
import { buildHeroTimeline } from "@/lib/animations/heroTimeline";

/**
 * Client boundary for the Hero.
 *
 * It owns the animation lifecycle and nothing else: the markup inside it is
 * still rendered on the server and passed through as children, so the hero's
 * content is in the HTML whether or not this ever hydrates.
 *
 * `useGSAP` scopes every selector to this element and reverts the whole
 * context on unmount, so no tween can leak into another section.
 */
export function HeroStage({ children }: { readonly children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = scope.current;
      if (!element) return;
      buildHeroTimeline(element);
    },
    { scope }
  );

  return (
    <div className="frame hero__frame" ref={scope}>
      {children}
    </div>
  );
}
