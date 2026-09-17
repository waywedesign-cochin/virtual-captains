"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@/lib/animations/gsap";
import { buildPartnerTimeline } from "@/lib/animations/partnerTimeline";

export function PartnerStage({ children }: { readonly children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = scope.current;
      if (!element) return;
      buildPartnerTimeline(element);
    },
    { scope }
  );

  return (
    <div className="frame w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12" style={{ height: "100%" }} ref={scope}>
      {children}
    </div>
  );
}
