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
    // Same max width + gutters as the navbar and the Curriculum section. The
    // padding lives on the outer box so the absolutely-positioned stage
    // inside measures from the content edge, not the padding edge.
    <div className="mx-auto h-full w-full max-w-372 px-4 sm:px-8 lg:px-12">
      <div className="frame h-full" ref={scope}>
        {children}
      </div>
    </div>
  );
}
