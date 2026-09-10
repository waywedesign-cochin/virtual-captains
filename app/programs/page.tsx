import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Programs | Virtual Captains Sales Enablement",
  description:
    "Comprehensive sales training programs: Induction, Sales Audit, Outbound Lead Generation, and Executive Negotiation.",
};

export default function ProgramsPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-white selection:bg-[#e7ff3d] selection:text-black">
      <Navbar />

      <section className="relative pt-36 pb-24 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-[#38bdf8] backdrop-blur-md mb-6">
          <span>Virtual Captains Programs</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] max-w-4xl text-white">
          Structured Enablement from{" "}
          <span className="italic text-[#38bdf8]">Induction</span> to Quota
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
          From new-hire induction to enterprise deal desk coaching, our tailored
          curricula combine human mentorship with generative simulations to build
          resilient, quota-crushing sellers.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/organisations"
            className="rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all"
          >
            Organisation Curricula
          </Link>
          <Link
            href="/individuals"
            className="rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all"
          >
            Individual Coaching
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
