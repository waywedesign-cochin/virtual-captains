import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, Calendar, Mail } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Navbar from "../../components/home/Navbar";
import SiteFooter from "../../components/home/SiteFooter";
import DotGridSpotlight from "../../components/common/DotGridSpotlight";
import { NewsShareRow } from "../../components/news/NewsShareRow";
import { getAllNews, getNewsBySlug } from "@/sanity/queries";
import { getNewsCategoryDot, type NewsPost } from "@/sanity/lib/types";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]";

const CONTAINER = "w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

// Same rich-text styling as the blog's article renderer.
const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base sm:text-lg text-white/75 leading-[1.85] font-normal">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-sans text-2xl sm:text-3xl font-normal tracking-tight pt-6 pb-1 bg-linear-to-r from-white via-[#8fd0ff] to-white bg-clip-text text-transparent">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-sans text-xl sm:text-2xl font-normal tracking-tight pt-4 text-white">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <div className="p-6 sm:p-7 rounded-2xl bg-white/5 border border-white/10 border-l-4 border-l-[#1d4ed8] my-6">
        <p className="text-sm sm:text-base text-white italic leading-relaxed font-sans">
          {children}
        </p>
      </div>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="space-y-3 my-5 pl-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="space-y-3 my-5 pl-6 list-decimal marker:text-[#8fd0ff] text-base sm:text-lg text-white/75">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3 text-base sm:text-lg text-white/75 leading-relaxed">
        <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-3 shrink-0" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="leading-relaxed pl-1">{children}</li>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#8fd0ff] underline underline-offset-4 hover:text-[#38bdf8] transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) =>
      value?.url ? (
        <figure className="my-6">
          <img
            src={value.url}
            alt={value.alt || ""}
            loading="lazy"
            className="w-full rounded-2xl border border-white/10"
          />
        </figure>
      ) : null,
  },
};

export async function generateStaticParams() {
  const allNews = await getAllNews();
  return allNews.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    return { title: "News & Updates | Virtual Captains" };
  }

  return {
    title: `${item.seo?.metaTitle || item.title} | Virtual Captains`,
    description: item.seo?.metaDescription || item.summary,
  };
}

function formatMonthDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TitleWithGradientTail({ title }: { title: string }) {
  const words = title.split(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");
  return (
    <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.12]">
      <span className="text-white">
        {head}
        {head ? " " : ""}
      </span>
      <span className="bg-linear-to-r from-[#8fd0ff] via-[#38bdf8] to-[#4d82f5] bg-clip-text text-transparent">
        {tail}
      </span>
    </h1>
  );
}

function UpdateVisual({ item }: { item: NewsPost }) {
  if (item.image?.url) {
    return (
      <img
        src={item.image.url}
        alt={item.image.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    <svg
      viewBox="0 0 800 260"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`fill-${item._id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[60, 120, 180].map((y) => (
        <line
          key={y}
          x1="0"
          x2="800"
          y1={y}
          y2={y}
          stroke="white"
          strokeOpacity="0.07"
        />
      ))}
      <path
        d="M0 210 C80 195 130 150 200 160 S330 110 400 95 S520 135 600 75 S720 40 800 20 L800 260 L0 260 Z"
        fill={`url(#fill-${item._id})`}
      />
      <path
        d="M0 210 C80 195 130 150 200 160 S330 110 400 95 S520 135 600 75 S720 40 800 20"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="600" cy="75" r="6" fill="#e7ff3d" />
      <circle
        cx="600"
        cy="75"
        r="14"
        fill="none"
        stroke="#e7ff3d"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [item, allNews] = await Promise.all([
    getNewsBySlug(slug),
    getAllNews(),
  ]);

  if (!item) {
    notFound();
  }

  const more = allNews.filter((n) => n._id !== item._id).slice(0, 3);

  return (
    <div className="relative min-h-screen bg-[#040507] text-white flex flex-col selection:bg-[#38bdf8] selection:text-black antialiased font-sans overflow-x-clip">
      <Navbar />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-200"
        style={{
          background:
            "radial-gradient(110% 60% at -5% -10%, #3f74e6 0%, #1c4fc0 12%, #0c318f 26%, #051d5c 42%, #050b24 60%, #040507 78%)",
        }}
      />
      <DotGridSpotlight />

      <article className="relative flex-1 w-full pt-20 sm:pt-24 pb-16">
        {/* Breadcrumb */}
        <div className={`${CONTAINER} pt-8 pb-4`}>
          <Link
            href="/news-and-updates"
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/60 hover:text-[#8fd0ff] transition-colors cursor-pointer group rounded-sm ${FOCUS_RING}`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#8fd0ff]" />
            <span>Back to News &amp; Updates</span>
          </Link>
        </div>

        <div className={`${CONTAINER} py-4 flex gap-10 xl:gap-14 items-start`}>
          {/* LEFT: main content */}
          <div className="min-w-0 flex-1">
            <div className="space-y-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-[#1d4ed8] to-[#0369a1] text-white shadow-[0_2px_10px_rgba(29,78,216,0.25)]">
                  {item.category.title}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
                  <Clock className="w-3 h-3" />
                  {item.readTime}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
                  <Calendar className="w-3 h-3" />
                  {formatMonthDay(item.publishedDate)}
                </span>
              </div>

              <TitleWithGradientTail title={item.title} />

              <div className="flex items-center gap-3.5 pt-2 pb-5">
                <div className="relative w-10 h-10 shrink-0 rounded-full bg-linear-to-br from-[#1d4ed8] to-[#0369a1] flex items-center justify-center text-sm font-bold text-white">
                  VC
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    Virtual Captains Team
                  </p>
                  <p className="text-xs text-white/60">Company Announcement</p>
                </div>
                <div className="h-8 w-px bg-linear-to-b from-transparent via-[#1d4ed8]/30 to-transparent" />
                <div className="text-right">
                  <p className="text-xs font-medium text-white/60">
                    {formatMonthDay(item.publishedDate)}
                  </p>
                  <p className="text-[11px] font-mono text-white/45 uppercase tracking-wider">
                    {item.readTime}
                  </p>
                </div>
              </div>

              <div className="h-px bg-linear-to-r from-[#1d4ed8]/30 via-[#0ea5e9]/15 to-transparent -mt-4" />
            </div>

            {/* Banner */}
            <div className="relative mt-6">
              <div className="absolute -inset-3 rounded-[36px] bg-linear-to-br from-[#1d4ed8]/10 via-[#0ea5e9]/6 to-transparent blur-xl pointer-events-none" />
              <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-white/5 border border-[#1d4ed8]/10 shadow-[0_8px_40px_rgba(29,78,216,0.08)] aspect-video ring-1 ring-[#1d4ed8]/8">
                <UpdateVisual item={item} />
              </div>
            </div>

            {/* Body */}
            <div className="space-y-8 text-white/75 pt-8 leading-[1.85]">
              <div className="flex gap-4">
                <div className="w-1 shrink-0 rounded-full bg-linear-to-b from-[#1d4ed8] to-[#0ea5e9]/30 mt-1 mb-1" />
                <p className="text-lg sm:text-xl md:text-2xl text-white font-sans leading-relaxed font-normal">
                  {item.content?.lead || item.summary}
                </p>
              </div>

              {item.content?.body && item.content.body.length > 0 && (
                <div className="space-y-5">
                  <PortableText
                    value={item.content.body as never}
                    components={portableTextComponents}
                  />
                </div>
              )}
            </div>

            <NewsShareRow title={item.title} />
          </div>

          {/* RIGHT: sticky "More Updates" sidebar (desktop only) */}
          <aside className="hidden xl:block w-[320px] shrink-0 sticky top-28 self-start">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold tracking-widest uppercase bg-linear-to-r from-[#8fd0ff] to-[#38bdf8] bg-clip-text text-transparent">
                More Updates
              </span>
              <div className="flex-1 h-px bg-linear-to-r from-[#1d4ed8]/30 to-transparent" />
            </div>

            {more.length > 0 ? (
              <div className="flex flex-col gap-4">
                {more.map((n) => (
                  <Link
                    key={n._id}
                    href={`/news-and-updates/${n.slug}`}
                    className="group flex gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#1d4ed8]/20 hover:shadow-[0_4px_20px_rgba(29,78,216,0.08)] transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-[#1d4ed8] to-[#0ea5e9] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                    <div className="shrink-0 w-20 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      {n.image?.url ? (
                        <img
                          src={n.image.url}
                          alt={n.image.alt}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${getNewsCategoryDot(n.category.slug)}`}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/8 text-white/65 inline-block mb-1">
                          {n.category.title}
                        </span>
                        <h4 className="text-[13px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#8fd0ff] transition-colors">
                          {n.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-white/45 font-mono mt-1.5">
                        {n.readTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-2 py-10 px-5 rounded-2xl bg-white/5 border border-dashed border-white/15">
                <span className="text-2xl">📰</span>
                <p className="text-xs font-medium text-white/60">
                  More updates coming soon
                </p>
              </div>
            )}

            <Link
              href="/news-and-updates"
              className={`mt-5 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-white/12 text-xs font-semibold text-white/65 hover:text-[#8fd0ff] hover:border-[#1d4ed8]/30 transition-all group ${FOCUS_RING}`}
            >
              <span>View all updates</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </aside>
        </div>

        {/* Mobile-only: More Updates below article */}
        {more.length > 0 && (
          <section className={`xl:hidden ${CONTAINER} mt-16 mb-12`}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold tracking-widest uppercase bg-linear-to-r from-[#8fd0ff] to-[#38bdf8] bg-clip-text text-transparent">
                More Updates
              </span>
              <div className="flex-1 h-px bg-linear-to-r from-[#1d4ed8]/30 to-transparent" />
              <Link
                href="/news-and-updates"
                className="inline-flex items-center gap-1 text-xs font-medium text-white/60 hover:text-[#8fd0ff] transition-colors"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {more.map((n) => (
                <Link
                  key={n._id}
                  href={`/news-and-updates/${n.slug}`}
                  className="group relative bg-white/5 rounded-3xl sm:rounded-[26px] p-4 sm:p-5 border border-white/10 shadow-[0_10px_25px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-[#1d4ed8] via-[#0ea5e9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl sm:rounded-t-[26px]" />

                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-white/45">
                      {formatMonthDay(n.publishedDate)}
                    </span>

                    <h4 className="font-sans text-xl sm:text-[22px] font-normal text-white group-hover:text-[#8fd0ff] transition-colors leading-[1.24] tracking-tight mt-2.5 mb-1.5 line-clamp-2">
                      {n.title}
                    </h4>

                    <p className="text-xs sm:text-[13px] text-white/60 leading-relaxed line-clamp-2 mb-3">
                      {n.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[11px] font-medium bg-white/8 text-white">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getNewsCategoryDot(n.category.slug)}`}
                        />
                        {n.category.title}
                      </span>
                      <span className="text-[11px] font-mono text-white/45">
                        {n.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter section */}
        {/* <section className={`${CONTAINER} mb-8`}>
          <div className="bg-white/5 rounded-[28px] sm:rounded-4xl p-8 sm:p-12 relative overflow-hidden border border-white/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)]">
            <div className="absolute top-0 right-0 w-100 h-100 bg-linear-to-bl from-[#1d4ed8]/25 via-transparent to-transparent opacity-60 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
              <div className="max-w-xl">
                <h3 className="font-sans text-2xl sm:text-3xl text-white">
                  Get company updates in your inbox
                </h3>
              </div>

              <div className="w-full md:w-auto shrink-0">
                <form className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 sm:w-72">
                    <Mail className="w-4 h-4 text-white/45 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#1d4ed8] focus:bg-white/10 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-7 py-3.5 bg-linear-to-r from-[#1d4ed8] to-[#0369a1] hover:from-[#2563eb] hover:to-[#0284c7] text-white text-sm font-semibold rounded-full shadow-[0_4px_14px_rgba(29,78,216,0.2)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section> */}
      </article>

      <SiteFooter showCTA={false} />
    </div>
  );
}
