import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import DotGridSpotlight from "../components/common/DotGridSpotlight";
import Link from "next/link";
import { NewsHero } from "../components/news/NewsHero";
import { getAllNews, getNewsCategories } from "@/sanity/queries";
import { getNewsCategoryDot } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "News & Updates | Virtual Captains",
  description:
    "Latest company announcements, product releases, partnerships, and milestones from Virtual Captains and SalesX.",
};

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]";

const CONTAINER = "w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-[#38bdf8]">
      {children}
    </span>
    <div className="flex-1 h-px bg-linear-to-r from-[#38bdf8]/35 to-transparent" />
  </div>
);

function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default async function NewsAndUpdatesPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  const params = (await searchParams) ?? {};

  const [allNews, categories] = await Promise.all([
    getAllNews(),
    getNewsCategories(),
  ]);

  const tabs = [
    { label: "All", slug: "all" },
    ...categories.map((c) => ({ label: c.title, slug: c.slug })),
  ];
  const active = tabs.find((c) => c.slug === params.category)?.slug ?? "all";

  // Featured is always the newest item (independent of filter, like the blog),
  // or whichever post is marked `featured` in Sanity, if any.
  const featured = allNews.find((n) => n.featured) ?? allNews[0];

  const filtered =
    active === "all"
      ? allNews
      : allNews.filter((n) => n.category.slug === active);
  const gridItems =
    active === "all"
      ? filtered.filter((n) => n._id !== featured?._id)
      : filtered;
  return (
    <main className="relative min-h-screen bg-[#040507] text-white flex flex-col selection:bg-[#38bdf8] selection:text-black antialiased font-sans overflow-x-clip">
      <Navbar />

      {/* Home-page atmosphere: diagonal blue glow from the top-left + dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-225"
        style={{
          background:
            "radial-gradient(120% 70% at -5% -10%, #3f74e6 0%, #1c4fc0 12%, #0c318f 26%, #051d5c 42%, #050b24 60%, #040507 78%)",
        }}
      />
      {/* Home-hero dot grid: dots light up around the cursor, page-wide */}
      <DotGridSpotlight />

      {/* pt offsets the fixed Navbar */}
      <div className="relative flex-1 w-full pt-20 sm:pt-24 pb-16">
        {/* 1. Hero (centered) */}
        <NewsHero />

        {/* 2. Featured card */}
        {/* 2. Featured card */}
        {featured && (
          <section className={`${CONTAINER} mb-16`}>
            <SectionLabel>Featured</SectionLabel>
            <article
              className={`group relative grid grid-cols-1 ${
                featured.image?.url ? "lg:grid-cols-12" : ""
              } gap-8 items-center rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] p-5 sm:p-8 lg:p-10 border border-white/10 bg-linear-to-br from-white/[0.07] via-white/3 to-transparent backdrop-blur-xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] hover:border-white/20 hover:shadow-[0_28px_70px_-20px_rgba(29,78,216,0.45)] transition-all duration-500`}
            >
              {/* Left column */}
              <div
                className={`${
                  featured.image?.url ? "lg:col-span-6" : ""
                } flex flex-col justify-between space-y-6`}
              >
                <div className="space-y-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">
                    <time dateTime={featured.publishedDate}>
                      {formatMonthYear(featured.publishedDate)}
                    </time>
                  </span>

                  <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-medium text-white group-hover:text-[#8fd0ff] transition-colors leading-[1.18] tracking-tight">
                    <Link
                      href={`/news-and-updates/${featured.slug}`}
                      className={`after:absolute after:inset-0 after:content-[''] after:rounded-[inherit] rounded-sm ${FOCUS_RING}`}
                    >
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="text-[15px] sm:text-base text-white/65 leading-relaxed line-clamp-3">
                    {featured.summary}
                  </p>

                  <div>
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium border border-white/15 bg-white/5 text-white/85">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getNewsCategoryDot(featured.category.slug)}`}
                      />
                      {featured.category.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#e7ff3d] px-5 py-2 text-xs font-bold text-black transition-transform group-hover:translate-x-0.5">
                    Read announcement
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                  <span className="text-xs font-mono text-white/50 uppercase tracking-wider">
                    {featured.readTime}
                  </span>
                </div>
              </div>

              {/* Right column: banner image only */}
              {featured.image?.url && (
                <div className="lg:col-span-6 overflow-hidden rounded-[20px] sm:rounded-3xl aspect-16/10 relative ring-1 ring-white/10 bg-white/5">
                  <img
                    src={featured.image.url}
                    alt={featured.image.alt ?? featured.title}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                </div>
              )}
            </article>
          </section>
        )}

        {/* 3. Category filter tabs (same look as blog) */}
        <section className={`${CONTAINER} mb-12`}>
          <nav
            aria-label="Filter news by category"
            className="flex overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex items-center gap-1.5 p-1 bg-white/4 rounded-full border border-white/10">
              {tabs.map((c) => {
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
                    className={`shrink-0 inline-flex items-center min-h-10 px-4 rounded-full text-[13px] sm:text-sm font-medium transition-colors select-none ${FOCUS_RING} ${
                      isActive
                        ? "bg-white text-black shadow-[0_0_20px_rgba(143,208,255,0.35)]"
                        : "text-white/60 hover:text-white"
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
            <div className="text-center py-16 bg-white/4 rounded-3xl border border-white/10 space-y-2">
              <p className="text-white/60 text-sm">
                No updates found in this category.
              </p>
              <Link
                href="/news-and-updates"
                className="text-xs font-semibold text-white underline hover:text-[#8fd0ff]"
              >
                Reset filters
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {gridItems.map((item) => (
                <li key={item._id} className="flex">
                  <article className="group relative w-full rounded-3xl sm:rounded-[26px] p-4 sm:p-5 border border-white/10 bg-linear-to-b from-white/6 to-white/2 backdrop-blur-xl shadow-[0_16px_40px_-18px_rgba(0,0,0,0.7)] hover:border-white/20 hover:shadow-[0_24px_50px_-18px_rgba(29,78,216,0.45)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    {/* Blue gradient accent top border on hover */}
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-[#38bdf8] via-[#8fd0ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex flex-col">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-white/45">
                        <time dateTime={item.publishedDate}>
                          {formatMonthYear(item.publishedDate)}
                        </time>
                      </span>

                      <h3 className="font-sans text-xl sm:text-[22px] font-medium text-white group-hover:text-[#8fd0ff] transition-colors leading-[1.24] tracking-tight mt-2.5 mb-1.5 line-clamp-2">
                        <Link
                          href={`/news-and-updates/${item.slug}`}
                          className={`after:absolute after:inset-0 after:content-[''] rounded-sm ${FOCUS_RING}`}
                        >
                          {item.title}
                        </Link>
                      </h3>

                      <p className="text-sm text-white/60 leading-relaxed line-clamp-3 mb-4">
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[11px] font-medium border border-white/12 bg-white/5 text-white/80">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getNewsCategoryDot(item.category.slug)}`}
                        />
                        {item.category.title}
                      </span>
                      <span className="text-[11px] font-mono text-white/45">
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

      {/* Same footer as the blog/home page (dark → blue) */}
      <SiteFooter showCTA={false} theme="light-blue" />
    </main>
  );
}
