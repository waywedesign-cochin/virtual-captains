import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import DotGridSpotlight from "../components/common/DotGridSpotlight";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { NewsHero } from "../components/news/NewsHero";
import { MilestonesStrip } from "../components/news/MilestonesStrip";
import { getAllNews } from "@/sanity/queries";
import { croppedImage, type NewsPost } from "@/sanity/lib/types";
import { MILESTONES } from "@/app/content/milestones";

export const metadata: Metadata = pageMetadata({
  title: "News & Updates",
  description:
    "Company announcements, product releases, partnerships and milestones from Virtual Captains and SalesX.",
  path: "/news-and-updates",
});

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]";

const CONTAINER = "w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12";

/** Editorial section header: dot · spaced title · hairline · optional link. */
function SectionHeader({
  title,
  href,
  linkLabel,
  aside,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
      <h2 className="shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-white sm:text-sm">
        {title}
      </h2>
      <span className="h-px flex-1 bg-linear-to-r from-white/20 to-white/5" />
      {aside}
      {href && linkLabel && (
        <Link
          href={href}
          scroll={false}
          className={`group inline-flex shrink-0 items-center gap-1.5 text-xs sm:text-sm text-white/75 transition-colors hover:text-white ${FOCUS_RING}`}
        >
          {linkLabel}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

/** Big image-led story card for the overview. */
function FeaturedStory({ item }: { item: NewsPost }) {
  return (
    <article className="group relative flex min-h-[340px] sm:min-h-[370px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1c] transition-colors duration-500 hover:border-[#38bdf8]/45">
      {item.image?.url ? (
        <img
          src={item.image.url}
          alt={item.image.alt ?? item.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-br from-[#0c318f] via-[#071b5c] to-[#040507]"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-[#030614] via-[#030614]/70 to-transparent"
      />

      <div className="relative space-y-4 p-6 sm:p-8 lg:max-w-[80%]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/25 bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/85 backdrop-blur-md">
            <time dateTime={item.publishedDate}>
              {formatShortDate(item.publishedDate)}
            </time>
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold leading-[1.15] tracking-tight text-white">
          <Link
            href={`/news-and-updates/${item.slug}`}
            className={`after:absolute after:inset-0 after:content-[''] rounded-sm ${FOCUS_RING}`}
          >
            {item.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm sm:text-[15px] leading-relaxed text-white/70">
          {item.summary}
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
          Read story
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  );
}

/** Compact row: thumbnail · date · title · arrow. */
function StoryRow({ item }: { item: NewsPost }) {
  return (
    <article className="group relative flex items-center gap-4 sm:gap-5 border-b border-white/10 py-3 sm:py-4">
      <div className="relative h-16 w-24 sm:h-[72px] sm:w-40 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#0a0f1c]">
        {item.image?.url && (
          <img
            src={item.image.url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#38bdf8]">
          <time dateTime={item.publishedDate}>
            {formatShortDate(item.publishedDate)}
          </time>
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-sm sm:text-base font-medium leading-snug text-white transition-colors group-hover:text-[#8fd0ff]">
          <Link
            href={`/news-and-updates/${item.slug}`}
            className={`after:absolute after:inset-0 after:content-[''] rounded-sm ${FOCUS_RING}`}
          >
            {item.title}
          </Link>
        </h3>
      </div>
      <span className="hidden sm:grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </article>
  );
}

/** Page chrome: navbar, glow, dot grid, hero and footer. */
function NewsShell({ children }: { children: React.ReactNode }) {
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
        <NewsHero />
        {children}
      </div>

      {/* Same footer as the blog/home page (dark → blue) */}
      <SiteFooter showCTA={false} theme="light-blue" />
    </main>
  );
}

/**
 * Option A (masonry) shapes: a tile keeps the proportions of the image as
 * cropped in the Sanity Studio, so it shows exactly that crop. Only extremes
 * are capped (taller than 4:5 / wider than 1.6:1, so the text always fits).
 * No image → 4:5.
 */
const tileRatio = (item: NewsPost) => {
  if (!item.image) return 4 / 5;
  const { width: w, height: h } = croppedImage(item.image);
  return w && h ? Math.min(1.6, Math.max(4 / 5, w / h)) : 4 / 5;
};

/**
 * Image-led tile in the right-hand marquee (same look as the old gallery
 * block): number, date and title over the banner image.
 * `hidden`: a loop copy, so screen readers and the keyboard meet each story once.
 */
function NewsTile({
  item,
  number,
  hidden = false,
}: {
  item: NewsPost;
  number: number;
  hidden?: boolean;
}) {
  return (
    // padding (not gap) so the track's height is exactly 2 × one set
    <div className="pb-3 sm:pb-4" aria-hidden={hidden || undefined}>
      <article
        style={{ aspectRatio: String(tileRatio(item)) }}
        className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1c] transition-colors duration-500 hover:border-[#38bdf8]/45"
      >
        {item.image?.url ? (
          <img
            // only the part cropped in Sanity, resized on the CDN
            src={croppedImage(item.image, 900).src}
            srcSet={[600, 900, 1200]
              .map((w) => `${croppedImage(item.image!, w).src} ${w}w`)
              .join(", ")}
            sizes="(min-width: 1024px) 20vw, 50vw"
            alt=""
            width={croppedImage(item.image).width || undefined}
            height={croppedImage(item.image).height || undefined}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-br from-[#0c318f] via-[#071b5c] to-[#040507]"
          />
        )}
        {/* readable bottom + subtle top shade for the number */}
        <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#030614]/95 via-[#030614]/35 to-[#030614]/30" />

        <span className="absolute left-3 top-2.5 font-mono text-[10px] tracking-[0.2em] text-white/80 sm:left-4 sm:top-3 sm:text-xs">
          {String(number).padStart(2, "0")}
        </span>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:gap-3 sm:p-4">
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#38bdf8]">
              <time dateTime={item.publishedDate}>
                {formatShortDate(item.publishedDate)}
              </time>
            </p>
            <h3 className="mt-1 line-clamp-3 text-[13px] font-medium leading-snug text-white sm:mt-1.5 sm:text-base">
              <Link
                href={`/news-and-updates/${item.slug}`}
                tabIndex={hidden ? -1 : undefined}
                className={`after:absolute after:inset-0 after:content-[''] rounded-sm ${FOCUS_RING}`}
              >
                {item.title}
              </Link>
            </h3>
          </div>
          <span className="hidden h-8 w-8 shrink-0 place-items-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black sm:grid">
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45"
              aria-hidden="true"
            />
          </span>
        </div>
      </article>
    </div>
  );
}

/**
 * One marquee column. The set is repeated until it's taller than the box
 * (so a short list never leaves a gap), then rendered twice for a seamless
 * -50% loop. Only the very first copy of each story is visible to assistive tech.
 */
function MarqueeColumn({
  items,
  direction,
}: {
  items: { item: NewsPost; number: number }[];
  direction: "up" | "down";
}) {
  // One set must be taller than the box (~620px over a ~260px-wide column,
  // i.e. ≥ 2.7 column-widths of height); tile height = width / ratio.
  const setHeight = items.reduce(
    (sum, { item }) => sum + 1 / tileRatio(item),
    0,
  );
  const repeats = Math.max(1, Math.ceil(2.7 / setHeight));
  const set = Array.from({ length: repeats }, () => items).flat();
  return (
    <div
      className={`vc-marquee-track flex min-w-0 flex-col ${direction === "down" ? "vc-marquee-down" : ""}`}
      style={{ animationDuration: `${Math.max(24, set.length * 7)}s` }}
    >
      {[...set, ...set].map(({ item, number }, i) => (
        <NewsTile
          key={`${i}-${item._id}`}
          item={item}
          number={number}
          hidden={i >= items.length}
        />
      ))}
    </div>
  );
}

export default async function NewsAndUpdatesPage() {
  const allNews = await getAllNews();
  const featured = allNews.find((n) => n.featured) ?? allNews[0];
  const more = allNews.filter((n) => n._id !== featured?._id).slice(0, 2);

  return (
    <NewsShell>
      <div
        className={`${CONTAINER} mb-20 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-0`}
      >
        {/* Latest updates */}
        <section
          aria-label="Latest updates"
          className="lg:col-span-7 lg:border-r lg:border-white/10 lg:pr-8 xl:pr-10"
        >
          <SectionHeader title="Latest Updates" />
          {featured ? (
            <>
              <FeaturedStory item={featured} />
              {more.length > 0 && (
                <div className="mt-2">
                  {more.map((item) => (
                    <StoryRow key={item._id} item={item} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="rounded-2xl border border-white/10 bg-white/4 py-16 text-center text-sm text-white/60">
              Updates are on their way.
            </p>
          )}
        </section>

        {/* All news: endless vertical marquee (hover pauses, reduced-motion stops) */}
        <section
          aria-label="All news"
          className="lg:col-span-5 lg:pl-8 xl:pl-10"
        >
          <SectionHeader
            title="All News"
            aside={
              allNews.length > 0 ? (
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-white/50">
                  {allNews.length} {allNews.length === 1 ? "story" : "stories"}
                </span>
              ) : undefined
            }
          />
          {allNews.length > 0 ? (
            <>
              {/* One column on small phones (<480px) and small laptops (1024–1279px,
                  where the right column is narrow): full-width tiles (short, wide crops
                  stay readable). Hover pauses; reduced-motion stops it. */}
              <div className="vc-marquee relative h-[520px] overflow-hidden min-[480px]:hidden lg:block lg:h-[620px] xl:hidden [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]">
                <MarqueeColumn
                  direction="up"
                  items={allNews.map((item, i) => ({ item, number: i + 1 }))}
                />
              </div>

              {/* 480–1023px and 1280px+: two columns drifting in opposite directions */}
              <div className="vc-marquee relative hidden h-[560px] grid-cols-2 gap-3 overflow-hidden min-[480px]:grid sm:h-[620px] sm:gap-4 lg:hidden xl:grid [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                {(allNews.length > 1 ? [0, 1] : [0]).map((col) => (
                  <MarqueeColumn
                    key={col}
                    direction={col ? "down" : "up"}
                    items={allNews
                      .map((item, i) => ({ item, number: i + 1 }))
                      .filter((_, i) => allNews.length === 1 || i % 2 === col)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="rounded-2xl border border-white/10 bg-white/4 py-16 text-center text-sm text-white/60">
              News is on its way.
            </p>
          )}
        </section>
      </div>

      {MILESTONES.length > 0 && (
        <section aria-label="Milestones" className={`${CONTAINER} mb-24`}>
          <MilestonesStrip milestones={MILESTONES} />
        </section>
      )}
    </NewsShell>
  );
}
