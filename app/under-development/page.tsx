import { Suspense } from "react";
import UnderDevelopmentContent from "./UnderDevelopmentContent";

export const metadata = {
  title: "Under Development | Virtual Captains",
  description:
    "This section is currently under active development. Return to the home page to explore Virtual Captains.",
};

export default function UnderDevelopmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-[#040507] text-white/50">
          <span className="font-mono text-xs uppercase tracking-widest">
            Loading...
          </span>
        </div>
      }
    >
      <UnderDevelopmentContent />
    </Suspense>
  );
}
