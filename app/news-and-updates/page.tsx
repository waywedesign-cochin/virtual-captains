import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News & Updates | Virtual Captains",
  description:
    "Latest company announcements, product releases, partnerships, and milestones from Virtual Captains and SalesX.",
};

const DUMMY_NEWS = [
  {
    id: "news-1",
    category: "Product Release",
    date: "September 2026",
    title: "Virtual Captains Launches SalesX Simulation Engine 2.0",
    summary:
      "Introducing hyper-realistic AI buyer personas with real-time conviction telemetry and multi-stakeholder enterprise scenario simulations.",
    badgeColor: "bg-[#2563eb]/20 text-[#38bdf8] border-[#38bdf8]/30",
  },
  {
    id: "news-2",
    category: "Partnership",
    date: "August 2026",
    title: "Expanding Academic Alliances Across Top Business Schools",
    summary:
      "New university programs co-brand ISM-certified curriculum to bridge the gap between classroom theory and real-world sales execution.",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "news-3",
    category: "Milestone",
    date: "July 2026",
    title: "Over 15,000 Sales Professionals Certified Across 8 Countries",
    summary:
      "A landmark milestone reflecting measurable performance uplifts and faster time-to-quota for our enterprise and individual cohorts.",
    badgeColor: "bg-[#e7ff3d]/20 text-[#e7ff3d] border-[#e7ff3d]/30",
  },
];

export default function NewsAndUpdatesPage() {
  return (
    <main className="min-h-screen bg-[#040507] text-white selection:bg-[#38bdf8] selection:text-black font-sans antialiased overflow-x-clip">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-175 h-87.5 bg-linear-to-r from-[#1d4ed8]/15 via-[#38bdf8]/15 to-[#1d4ed8]/15 blur-[140px] rounded-full" />

        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-[#38bdf8] mb-4 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
          <span>COMPANY &amp; ECOSYSTEM</span>
        </div>

        {/* Headline */}
        <h1 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-[1.1] max-w-4xl">
          News &amp;{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-[#38bdf8]">
            Updates
          </span>
        </h1>

        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Stay informed with the latest announcements, platform innovations,
          strategic partnerships, and milestone achievements from Virtual Captains.
        </p>
      </section>

      {/* News Cards Grid */}
      <section className="relative pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {DUMMY_NEWS.map((item) => (
            <article
              key={item.id}
              className="group relative rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/12 hover:border-[#38bdf8]/50 p-6 flex flex-col justify-between shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(56,189,248,0.15)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${item.badgeColor}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.date}
                  </span>
                </div>

                <h2 className="font-sans font-black text-lg sm:text-xl text-white leading-snug mb-2.5 group-hover:text-[#38bdf8] transition-colors">
                  {item.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-6 mt-auto flex items-center justify-between border-t border-white/8">
                <span className="text-xs font-bold text-[#38bdf8] group-hover:text-white transition-colors">
                  Read Announcement &rarr;
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <SiteFooter showCTA={false} />
    </main>
  );
}
