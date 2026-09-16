"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@/lib/animations/gsap";
import { buildCurriculumTimeline } from "@/lib/animations/curriculumTimeline";

export function CurriculumStage({ children }: { readonly children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = scope.current;
      if (!element) return;
      buildCurriculumTimeline(element);
    },
    { scope }
  );

  return (
    <div className="frame" ref={scope}>
      {children}
    </div>
  );
}
