import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import Link from "next/link";
import { NewsHero } from "../components/news/NewsHero";

export const metadata: Metadata = {
  title: "News & Updates | Virtual Captains",
  description:
    "Latest company announcements, product releases, partnerships, and milestones from Virtual Captains and SalesX.",
};

type NewsItem = {
  id: string;
  category: string;
  slug: string;
  date: string;
  iso: string;
  title: string;
  summary: string;
  readTime: string;
  dot: string;
};

const CATEGORIES = [
  { label: "All", slug: "all" },
  { label: "Product Release", slug: "product" },
  { label: "Partnership", slug: "partnership" },
  { label: "Milestone", slug: "milestone" },
  { label: "Company", slug: "company" },
];

const DUMMY_NEWS: NewsItem[] = [
  {
    id: "news-1",
    category: "Product Release",
    slug: "product",
    date: "September 2026",
    iso: "2026-09",
    title: "Virtual Captains Launches SalesX Simulation Engine 2.0",
    summary:
      "Introducing hyper-realistic AI buyer personas with real-time conviction telemetry and multi-stakeholder enterprise scenario simulations.",
    readTime: "4 min read",
    dot: "bg-[#38bdf8]",
  },
  {
    id: "news-2",
    category: "Partnership",
    slug: "partnership",
    date: "August 2026",
    iso: "2026-08",
    title: "Expanding Academic Alliances Across Top Business Schools",
    summary:
      "New university programs co-brand ISM-certified curriculum to bridge the gap between classroom theory and real-world sales execution.",
    readTime: "3 min read",
    dot: "bg-emerald-400",
  },
  {
    id: "news-3",
    category: "Milestone",
    slug: "milestone",
    date: "July 2026",
    iso: "2026-07",
    title: "Over 15,000 Sales Professionals Certified Across 8 Countries",
    summary:
      "A landmark milestone reflecting measurable performance uplifts and faster time-to-quota for our enterprise and individual cohorts.",
    readTime: "3 min read",
    dot: "bg-[#e7ff3d]",
  },
  {
    id: "news-4",
    category: "Product Release",
    slug: "product",
    date: "June 2026",
    iso: "2026-06",
    title: "Manager Coaching Dashboards Now Live in SalesX",
    summary:
      "Team leads can review call replays, score objection handling, and assign follow-up practice from a single view.",
    readTime: "2 min read",
    dot: "bg-[#38bdf8]",
  },
  {
    id: "news-5",
    category: "Company",
    slug: "company",
    date: "May 2026",
    iso: "2026-05",
    title: "Virtual Captains Opens a New Training Hub for Regional Teams",
    summary:
      "The new hub brings live facilitator-led workshops closer to enterprise customers, with hybrid seats for remote participants.",
    readTime: "2 min read",
    dot: "bg-fuchsia-400",
  },
  {
    id: "news-6",
    category: "Partnership",
    slug: "partnership",
    date: "April 2026",
    iso: "2026-04",
    title: "SalesX Integrates With Leading CRM Platforms",
    summary:
      "Practice sessions can now pull real deal context from your CRM, so every simulation mirrors the pipeline your reps actually work.",
    readTime: "3 min read",
    dot: "bg-emerald-400",
  },
];

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]";

const CONTAINER = "w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[11px] font-bold tracking-widest uppercase text-[#38bdf8]">
      {children}
    </span>
    <div className="flex-1 h-px bg-linear-to-r from-[#38bdf8]/30 to-transparent" />
  </div>
);

export default async function NewsAndUpdatesPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  const params = (await searchParams) ?? {};
  const active =
    CATEGORIES.find((c) => c.slug === params.category)?.slug ?? "all";

  // Featured is always the newest item (independent of filter, like the blog)
  const featured = DUMMY_NEWS[0];

  const filtered =
    active === "all" ? DUMMY_NEWS : DUMMY_NEWS.filter((n) => n.slug === active);
  const gridItems = filtered.filter((n) => n.id !== featured.id);

  return (
    <main className="min-h-screen bg-[#040507] text-white selection:bg-[#38bdf8] selection:text-black font-sans antialiased overflow-x-clip flex flex-col">
      <Navbar />

      <div className="flex-1 w-full pb-16">
        {/* 1. Hero (centered) */}
        <NewsHero />

        {/* 2. Featured card */}
        <section className={`${CONTAINER} mb-16`}>
          <SectionLabel>Featured</SectionLabel>
          <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] p-6 sm:p-8 lg:p-10 border border-white/12 bg-slate-900/50 backdrop-blur-xl hover:border-white/25 transition-all duration-500">
            {/* Left column */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs sm:text-sm font-medium text-slate-400">
                  <time dateTime={featured.iso}>{featured.date}</time>
                </span>

                <h2 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl leading-[1.18] tracking-tight text-white group-hover:text-slate-300 transition-colors">
                  <a
                    href="#"
                    className={`after:absolute after:inset-0 after:content-[''] after:rounded-[inherit] rounded-sm ${FOCUS_RING}`}
                  >
                    {featured.title}
                  </a>
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3">
                  {featured.summary}
                </p>

                <div>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-white/8 text-white">
                    <span className={`h-1.5 w-1.5 rounded-full ${featured.dot}`} />
                    {featured.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e7ff3d] px-5 py-2 text-xs font-bold text-black transition-transform group-hover:translate-x-0.5">
                  Read announcement
                  <span aria-hidden="true">&rarr;</span>
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  {featured.readTime}
                </span>
              </div>
            </div>

            {/* Right column visual */}
            <div
              aria-hidden="true"
              className="lg:col-span-6 overflow-hidden rounded-[20px] sm:rounded-3xl aspect-16/10 relative ring-1 ring-white/10 bg-[radial-gradient(ellipse_at_70%_20%,rgba(56,189,248,0.22),transparent_60%)]"
            >
              <svg
                viewBox="0 0 400 250"
                className="absolute inset-0 h-full w-full group-hover:scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <linearGradient id="fillLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#38bdf8" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[50, 100, 150, 200].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2="400"
                    y1={y}
                    y2={y}
                    stroke="white"
                    strokeOpacity="0.07"
                  />
                ))}
                <path
                  d="M0 200 C40 190 60 165 100 168 S160 128 200 120 S260 140 300 95 S360 60 400 42 L400 250 L0 250 Z"
                  fill="url(#fillLine)"
                />
                <path
                  d="M0 200 C40 190 60 165 100 168 S160 128 200 120 S260 140 300 95 S360 60 400 42"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="300" cy="95" r="5" fill="#e7ff3d" />
                <circle
                  cx="300"
                  cy="95"
                  r="12"
                  fill="none"
                  stroke="#e7ff3d"
                  strokeOpacity="0.5"
                />
              </svg>
              <div className="absolute left-5 bottom-5 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md px-4 py-3">
                <p className="text-xs text-slate-400">Buyer conviction</p>
                <p className="text-2xl font-black text-white">
                  72<span className="text-[#e7ff3d]">%</span>
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* 3. Category filter tabs (same placement as blog) */}
        <section className={`${CONTAINER} mb-12`}>
          <nav
            aria-label="Filter news by category"
            className="flex overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex items-center gap-2 p-1 bg-white/4 rounded-full border border-white/10">
              {CATEGORIES.map((c) => {
                const isActive = c.slug === active;
                return (
                  <Link
                    key={c.slug}
                    href={
                      c.slug === "all"
                        ? "/news-and-updates"
                        : `?category=${c.slug}`
                    }
                    scroll={false}
                    aria-current={isActive ? "page" : undefined}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors select-none ${FOCUS_RING} ${
                      isActive
                        ? "bg-white text-black"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {c.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </section>

        {/* 4. Grid of updates */}
        <section className={`${CONTAINER} mb-24`}>
          <SectionLabel>All Updates</SectionLabel>

          {gridItems.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-white/10 bg-slate-900/50 space-y-2">
              <p className="text-slate-300 text-sm">
                No updates found in this category.
              </p>
              <Link
                href="/news-and-updates"
                className="text-xs font-semibold text-white underline hover:text-[#38bdf8]"
              >
                Reset filters
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {gridItems.map((item) => (
                <li key={item.id} className="flex">
                  <article className="group relative w-full rounded-3xl sm:rounded-[26px] p-5 sm:p-6 border border-white/12 bg-slate-900/50 backdrop-blur-xl hover:border-white/25 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-[#38bdf8] via-[#1d4ed8] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex flex-col">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                        <time dateTime={item.iso}>{item.date}</time>
                      </span>

                      <h3 className="font-sans font-extrabold text-xl sm:text-[22px] text-white group-hover:text-[#38bdf8] transition-colors leading-[1.24] tracking-tight mt-2.5 mb-1.5 line-clamp-2">
                        <a
                          href="#"
                          className={`after:absolute after:inset-0 after:content-[''] rounded-sm ${FOCUS_RING}`}
                        >
                          {item.title}
                        </a>
                      </h3>

                      <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed line-clamp-3 mb-4">
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[11px] font-medium bg-white/8 text-white">
                        <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.readTime}
                      </span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <SiteFooter showCTA={false} />
    </main>
  );
}