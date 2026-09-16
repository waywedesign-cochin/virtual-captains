"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@/lib/animations/gsap";
import { buildFooterTimeline } from "@/lib/animations/closingTimelines";

/**
 * `display: contents` so this wrapper never enters the box model — the
 * footer word sits outside `.frame` deliberately (see Footer.tsx), and its
 * `position: absolute` needs to keep resolving against `<footer>` itself,
 * not against this ref-holding div. A ref still needs a real DOM node, this
 * is just one CSS declaration away from being invisible to layout.
 */
export function FooterStage({ children }: { readonly children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = scope.current;
      if (!element) return;
      buildFooterTimeline(element);
    },
    { scope }
  );

  return (
    <div style={{ display: "contents" }} ref={scope}>
      {children}
    </div>
  );
}
