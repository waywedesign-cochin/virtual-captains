import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import UnderDevelopmentContent from "./UnderDevelopmentContent";

export const metadata = pageMetadata({
  title: "Under Development",
  description: "This page is under development.",
  path: "/under-development",
  noIndex: true,
});

export default function UnderDevelopmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-[#040507] text-white/50">
          <span className="font-sans text-xs uppercase tracking-widest">
            Loading...
          </span>
        </div>
      }
    >
      <UnderDevelopmentContent />
    </Suspense>
  );
}
