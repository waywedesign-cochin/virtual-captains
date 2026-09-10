import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources | Sales Research & Frameworks",
  description:
    "Explore case studies, sales call teardowns, behavioral playbooks, and conversational intelligence benchmarks.",
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-white selection:bg-[#e7ff3d] selection:text-black">
      <Navbar />

      <section className="relative pt-36 pb-24 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-[#e7ff3d] backdrop-blur-md mb-6">
          <span>Insights &amp; Research</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] max-w-4xl text-white">
          Sales Intelligence &amp;{" "}
          <span className="italic text-[#e7ff3d]">Behavioral</span> Frameworks
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
          Access research papers, playbooks, objection teardowns, and conversational
          benchmarks distilled from over 15,000 sales professionals across 8+ countries.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/organisations"
            className="rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all"
          >
            Read Case Studies
          </Link>
          <Link
            href="/salesx"
            className="rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all"
          >
            Try SalesX Demo
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
