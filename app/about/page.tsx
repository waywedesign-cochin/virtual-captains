import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Virtual Captains | Conversational Sales Intelligence",
  description:
    "We empower sales professionals and global organisations with AI simulation and real-world execution capabilities.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-white selection:bg-[#e7ff3d] selection:text-black">
      <Navbar />

      <section className="relative pt-36 pb-24 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-[#e7ff3d] backdrop-blur-md mb-6">
          <span>About Virtual Captains</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] max-w-4xl text-white">
          Pioneering the Future of{" "}
          <span className="italic text-[#38bdf8]">Conversational</span> Sales
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
          Virtual Captains bridges the gap between training and real-world sales performance.
          Through AI-driven simulations and behavioral science, we help sales teams build
          the confidence and muscle memory needed to close high-stakes deals.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/organisations"
            className="rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all"
          >
            For Organisations
          </Link>
          <Link
            href="/individuals"
            className="rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all"
          >
            For Individuals
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
