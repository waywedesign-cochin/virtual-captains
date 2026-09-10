import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SalesX | High-Velocity Execution Training",
  description:
    "Execution training for top-tier revenue teams. Measure, simulate, and scale sales closing rates with AI personas.",
};

export default function SalesXPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-white selection:bg-[#e7ff3d] selection:text-black">
      <Navbar />

      <section className="relative pt-36 pb-24 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#e7ff3d]/30 bg-[#e7ff3d]/10 px-3.5 py-1 text-xs font-semibold text-[#e7ff3d] backdrop-blur-md mb-6">
          <span>SalesX Acceleration Platform</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] max-w-4xl text-white">
          Turn Sales Uncertainty Into{" "}
          <span className="italic text-[#e7ff3d]">Predictable</span> Revenue
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
          SalesX puts your account executives through high-pressure simulations
          with hyper-realistic buyer personas, providing instant feedback and
          quantifiable readiness scores before they ever hop on a live call.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/organisations"
            className="rounded-full bg-[#e7ff3d] hover:bg-[#d4ed35] px-6 py-3 text-sm font-bold text-[#07090e] shadow-[0_0_24px_rgba(231,255,61,0.4)] transition-all"
          >
            Explore For Teams
          </Link>
          <Link
            href="/individuals"
            className="rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all"
          >
            Certification Track
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
