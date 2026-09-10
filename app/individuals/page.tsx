import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Individuals | Master the Art of Closing",
  description:
    "Accelerate your sales career. Practice with AI buyer personas, get personalized coach evaluation, and earn top-tier certification.",
};

export default function IndividualsPage() {
  return (
    <main className="min-h-screen bg-[#07090e] text-white selection:bg-[#e7ff3d] selection:text-black">
      <Navbar />

      <section className="relative pt-36 pb-24 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-[#e7ff3d] backdrop-blur-md mb-6">
          <span>Individual Acceleration</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] max-w-4xl text-white">
          Master the Art of{" "}
          <span className="italic text-[#e7ff3d]">Conversational</span> Selling
        </h1>

        <p className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
          Level up from SDR to Account Executive or Enterprise Closer.
          Get safe-to-fail sandbox environments to practice objection handling,
          pricing discovery, and closing strategies.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/salesx"
            className="rounded-full bg-[#e7ff3d] hover:bg-[#d4ed35] px-6 py-3 text-sm font-bold text-[#07090e] shadow-[0_0_24px_rgba(231,255,61,0.4)] transition-all"
          >
            Start Practicing
          </Link>
          <Link
            href="/programs"
            className="rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all"
          >
            View Tracks
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
