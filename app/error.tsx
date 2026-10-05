"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

/** Root error boundary — catches render errors in any page below the root layout. */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center overflow-hidden bg-[#030612] px-4 py-24 text-center text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, #0d1f6e 0%, #070d3a 45%, #030612 75%)",
        }}
      />

      <div className="relative z-10 flex max-w-xl flex-col items-center">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-white/50">
          Something Went Wrong
        </span>
        <h1 className="mt-3 font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-tight tracking-tight">
          We Hit An <span className="italic text-[#4d82f5]">Unexpected Snag</span>
        </h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-white/70 sm:text-base">
          This page didn&apos;t load as expected. Please try again, and if the
          problem continues, head back home.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-white/35">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-7 py-3 font-sans text-sm font-medium text-black transition-transform active:scale-95"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
          >
            Back To Home
          </Link>
        </div>
      </div>
    </main>
  );
}
