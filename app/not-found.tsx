import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

/** Root "not found" UI — shown for notFound() calls and unmatched URLs. */
export default function NotFound() {
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
        <p className="bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text font-sans text-[clamp(5rem,18vw,9rem)] font-bold leading-none tracking-tight text-transparent">
          404
        </p>
        <h1 className="mt-4 font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-tight tracking-tight">
          This Page Is <span className="italic text-[#4d82f5]">Off The Map</span>
        </h1>
        <p className="mt-4 font-sans text-sm leading-relaxed text-white/70 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
          get you back on course.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 font-sans text-sm font-medium text-black transition-transform active:scale-95"
          >
            Back To Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
