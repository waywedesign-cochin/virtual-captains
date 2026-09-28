import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import Link from "next/link";

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
  dot: string; // category color dot
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

export default async function NewsAndUpdatesPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  const params = (await searchParams) ?? {};
  const active =
    CATEGORIES.find((c) => c.slug === params.category)?.slug ?? "all";

  const filtered =
    active === "all" ? DUMMY_NEWS : DUMMY_NEWS.filter((n) => n.slug === active);

  const [featured, ...rest] = filtered;

  return (
    <main className="min-h-screen bg-[#040507] text-white selection:bg-[#38bdf8] selection:text-black font-sans antialiased overflow-x-clip">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-13  w-full mx-auto">
        <div className="pointer-events-none absolute -top-24 left-0 w-175 h-87.5 bg-linear-to-r from-[#1d4ed8]/15 via-[#38bdf8]/10 to-transparent blur-[140px] rounded-full" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h1 className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.02] max-w-3xl">
            What&apos;s new at Virtual Captains
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-sm leading-relaxed lg:pb-2">
            Product releases, partnerships, and milestones from Virtual Captains
            and SalesX, newest first.
          </p>
        </div>

        {/* Filters */}
        <nav
          aria-label="Filter news by category"
          className="relative mt-10 sm:mt-12 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((c) => {
            const isActive = c.slug === active;
            return (
              <Link
                key={c.slug}
                href={
                  c.slug === "all" ? "/news-and-updates" : `?category=${c.slug}`
                }
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${FOCUS_RING} ${
                  isActive
                    ? "bg-white text-black border-white"
                    : "border-white/15 text-slate-300 hover:border-white/40 hover:text-white"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </nav>
      </section>

      {/* Featured story */}
      {featured && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <article className="group relative overflow-hidden rounded-3xl border border-white/12 bg-slate-900/50 backdrop-blur-xl">
            <div className="grid lg:grid-cols-[1.15fr_1fr]">
              {/* Copy */}
              <div className="relative z-10 flex flex-col justify-between gap-10 p-6 sm:p-10 lg:p-12">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className={`h-2 w-2 rounded-full ${featured.dot}`} />
                  <span className="font-semibold text-white">
                    {featured.category}
                  </span>
                  <time dateTime={featured.iso} className="text-slate-400">
                    {featured.date}
                  </time>
                </div>

                <div>
                  <h2 className="font-sans font-black text-2xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] tracking-tight max-w-xl">
                    <a
                      href="#"
                      className={`after:absolute after:inset-0 after:content-[''] rounded-sm ${FOCUS_RING}`}
                    >
                      {featured.title}
                    </a>
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
                    {featured.summary}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#e7ff3d] px-5 py-2 font-bold text-black transition-transform group-hover:translate-x-0.5">
                    Read announcement
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                  <span className="text-slate-400">{featured.readTime}</span>
                </div>
              </div>

              {/* Visual: static conviction-telemetry graphic */}
              <div
                aria-hidden="true"
                className="relative min-h-64 lg:min-h-full border-t lg:border-t-0 lg:border-l border-white/10 bg-[radial-gradient(ellipse_at_70%_20%,rgba(56,189,248,0.22),transparent_60%)]"
              >
                <svg
                  viewBox="0 0 400 300"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <linearGradient id="fillLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#38bdf8" stopOpacity="0.35" />
                      <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[60, 120, 180, 240].map((y) => (
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
                    d="M0 230 C40 220 60 190 100 195 S160 150 200 140 S260 165 300 110 S360 70 400 50 L400 300 L0 300 Z"
                    fill="url(#fillLine)"
                  />
                  <path
                    d="M0 230 C40 220 60 190 100 195 S160 150 200 140 S260 165 300 110 S360 70 400 50"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="300" cy="110" r="5" fill="#e7ff3d" />
                  <circle
                    cx="300"
                    cy="110"
                    r="12"
                    fill="none"
                    stroke="#e7ff3d"
                    strokeOpacity="0.5"
                  />
                </svg>
                <div className="absolute left-6 bottom-6 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md px-4 py-3">
                  <p className="text-xs text-slate-400">Buyer conviction</p>
                  <p className="text-2xl font-black text-white">
                    72<span className="text-[#e7ff3d]">%</span>
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Timeline list */}
      {rest.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-12 sm:pt-16 pb-24">
          <h2 className="text-lg font-bold text-white mb-2">Earlier updates</h2>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {rest.map((item) => (
              <li key={item.id}>
                <article className="group relative grid gap-3 py-7 sm:py-8 md:grid-cols-[10rem_1fr_auto] md:items-baseline md:gap-10 transition-colors hover:bg-white/[0.02]">
                  <div className="flex items-center gap-2.5 text-sm">
                    <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                    <time dateTime={item.iso} className="text-slate-400">
                      {item.date}
                    </time>
                  </div>

                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold text-slate-400 mb-1.5">
                      {item.category}
                    </p>
                    <h3 className="font-sans font-extrabold text-lg sm:text-2xl leading-snug tracking-tight text-white transition-colors group-hover:text-[#38bdf8]">
                      <a
                        href="#"
                        className={`after:absolute after:inset-0 after:content-[''] rounded-sm ${FOCUS_RING}`}
                      >
                        {item.title}
                      </a>
                    </h3>
                    <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-400 md:justify-end">
                    <span>{item.readTime}</span>
                    <span
                      aria-hidden="true"
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white transition-all group-hover:bg-white group-hover:text-black group-hover:border-white"
                    >
                      &rarr;
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer */}
      <SiteFooter showCTA={false} />
    </main>
  );
}
