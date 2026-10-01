import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPrograms } from "@/sanity/queries";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import DotGridSpotlight from "../components/common/DotGridSpotlight";
import CurriculumSection from "../components/salesx/CurriculumSection";
import EnrollNowButton from "../components/programs/EnrollModal";

export const metadata: Metadata = pageMetadata({
  title: "Sales Training Programs",
  description:
    "Explore Virtual Captains programs: sales induction, sales audits, outbound lead generation, team development and personal sales training built for real pipeline results.",
  path: "/programs",
});

// Stagger helper for the page-load animation (see .vc-in in ProgramsPage)
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

type Program = {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  audience: "students" | "professionals" | "founders" | "organisations";
  level?: string;
  hours?: number;
  duration?: string;
  format?: string;
  price?: string; // display text, built from priceInr in Sanity
  image?: { url: string; alt?: string };
  highlights?: string[];
  outcome?: string;
  featured?: boolean;
};

const AUDIENCE_LABEL: Record<Program["audience"], string> = {
  students: "Students & Freshers",
  professionals: "Working Professionals",
  founders: "Founders",
  organisations: "Organisations",
};

function ProgramCard({ program, index }: { program: Program; index: number }) {
  const featured = !!program.featured;
  const meta = [
    program.hours ? `${program.hours} hrs` : null,
    program.duration,
    program.level,
  ].filter(Boolean) as string[];

  return (
    <article
      style={delay(520 + index * 90)}
      className={`vc-in group flex flex-col overflow-hidden rounded-3xl border transition-transform duration-300 hover:-translate-y-1 ${
        featured
          ? "border-[#38bdf8]/40 bg-linear-to-br from-[#2563eb] to-[#1e3a8a] text-white shadow-[0_20px_60px_-20px_#2563eb]"
          : "border-white/10 bg-[#0b0e14] text-white hover:border-white/25"
      }`}
    >
      {/* Cover */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-[#0d1438]">
        {program.image ? (
          <img
            src={program.image.url}
            alt={program.image.alt || program.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#1b2a7a] via-[#111a45] to-[#060b26]" />
        )}
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
            featured
              ? "bg-white/20 text-white"
              : "bg-[#060b26]/70 text-[#38bdf8]"
          }`}
        >
          {AUDIENCE_LABEL[program.audience]}
        </span>
        {program.format && (
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#060b26]">
            {program.format}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-7">
        {meta.length > 0 && (
          <p
            className={`text-xs font-semibold ${
              featured ? "text-white/70" : "text-white/55"
            }`}
          >
            {meta.join(" · ")}
          </p>
        )}

        <h3 className="mt-3 text-2xl font-bold leading-snug">
          {program.title}
        </h3>
        {program.tagline && (
          <p
            className={`mt-2 font-serif text-xl italic ${
              featured ? "text-white" : "text-[#8b9cff]"
            }`}
          >
            {program.tagline}
          </p>
        )}

        <p
          className={`mt-4 text-[15px] leading-relaxed ${
            featured ? "text-white/85" : "text-white/75"
          }`}
        >
          {program.description}
        </p>

        {program.highlights && program.highlights.length > 0 && (
          <ul className="mt-5 space-y-2">
            {program.highlights.slice(0, 4).map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm">
                <span
                  aria-hidden
                  className={`mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full ${
                    featured ? "bg-white" : "bg-[#38bdf8]"
                  }`}
                />
                <span className={featured ? "" : "text-white/85"}>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {program.outcome && (
          <p
            className={`mt-5 border-t pt-4 text-sm ${
              featured ? "border-white/20" : "border-white/10"
            }`}
          >
            <span className={featured ? "opacity-70" : "text-white/55"}>
              You leave with:{" "}
            </span>
            <span className="font-semibold">{program.outcome}</span>
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="font-serif text-2xl">{program.price ?? ""}</span>
          <EnrollNowButton
            programTitle={program.title}
            programSlug={program.slug}
            price={program.price}
            className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold transition ${
              featured
                ? "bg-white text-[#1e3a8a] hover:bg-white/90"
                : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
            }`}
          >
            Enroll now
          </EnrollNowButton>
        </div>
      </div>
    </article>
  );
}

// ---------- Testimonials (dummy data, replace with real quotes) ----------
type Testimonial = {
  room: string;
  result: string;
  quote: string;
  name: string;
  detail: string;
  span?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    room: "Student",
    result: "Offer in 2 weeks",
    quote:
      "I froze in every mock interview until the rehearsals. Two weeks later I walked into the real one and got the offer.",
    name: "Aisha K.",
    detail: "Kochi · Placed at a SaaS company",
    span: "lg:col-span-2",
  },
  {
    room: "Professional",
    result: "Promoted",
    quote:
      "I finally handled a price objection without flinching. My manager noticed, and the promotion followed.",
    name: "Rahul M.",
    detail: "Account Manager · Financial services",
  },
  {
    room: "Founder",
    result: "10 first customers",
    quote:
      "I had a great product and no pipeline. Within a month I had my first ten customers.",
    name: "Neha S.",
    detail: "Founder · Early-stage startup",
  },
  {
    room: "Organisation",
    result: "Faster ramp",
    quote:
      "New hires reached quota noticeably faster. Ramp time dropped and the pipeline showed it.",
    name: "Vikram P.",
    detail: "Head of Sales · Logistics company",
    span: "lg:col-span-2",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-160 -translate-x-1/2 rounded-full bg-[#2563eb]/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-[#38bdf8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
            Proof, not promises
          </div>
          <h2 className="mt-6 font-serif text-4xl leading-[1.1] text-white sm:text-5xl">
            Real Rooms.{" "}
            <span className="bg-linear-to-r from-[#38bdf8] to-[#8b9cff] bg-clip-text italic text-transparent">
              Real Results.
            </span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.room}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0b0e14] p-7 transition duration-300 hover:border-[#38bdf8]/40 hover:bg-[#121620] ${
                t.span ?? ""
              }`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 font-serif text-[9rem] leading-none text-white/5"
              >
                “
              </span>

              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                  {t.room}
                </span>
                <span className="bg-linear-to-r from-[#38bdf8] to-[#8b9cff] bg-clip-text text-sm font-semibold text-transparent">
                  {t.result}
                </span>
              </div>

              <blockquote
                className={`relative mt-6 flex-1 font-serif leading-snug text-white ${
                  t.span ? "text-2xl sm:text-3xl" : "text-xl"
                }`}
              >
                {t.quote}
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#38bdf8] to-[#2563eb] text-sm font-bold text-white">
                  {initials(t.name)}
                </span>
                <span className="text-sm">
                  <span className="block font-semibold text-white">
                    {t.name}
                  </span>
                  <span className="block text-white/55">{t.detail}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Partner logos: two-way marquee (add real logos under /public/partners) ----------
type Partner = { name: string; logo?: string };

const PARTNERS_A: Partner[] = [
  { name: "Orbitly", logo: "/programs/orbitly.svg" },
  { name: "Finvara", logo: "/programs/finvara.svg" },
  { name: "Cargonix", logo: "/programs/cargonix.svg" },
  { name: "Steelwave", logo: "/programs/steelwave.svg" },
  { name: "Shopiq", logo: "/programs/shopiq.svg" },
  { name: "Nexora", logo: "/programs/nexora.svg" },
];
const PARTNERS_B: Partner[] = [
  { name: "Ledgerly", logo: "/programs/ledgerly.svg" },
  { name: "Voltaic", logo: "/programs/voltaic.svg" },
  { name: "Brightcart", logo: "/programs/brightcart.svg" },
  { name: "Kestrel", logo: "/programs/kestrel.svg" },
  { name: "Zenora", logo: "/programs/zenora.svg" },
  { name: "Trueline", logo: "/programs/trueline.svg" },
];

const SECTORS = [
  "Enterprise SaaS",
  "Financial services",
  "Logistics",
  "Manufacturing",
  "Consumer tech",
];

function PartnerPill({ name, logo }: Partner) {
  // JPGs have no transparency, so the white-silhouette filter would turn the
  // whole image into a solid white block. Show them on a light tile instead.
  const isJpg = !!logo && /\.jpe?g$/i.test(logo);

  return (
    <div
      className={`mr-4 flex h-16 w-44 shrink-0 items-center justify-center rounded-2xl border border-white/10 px-5 ${
        isJpg ? "bg-white/90" : "bg-white/4"
      }`}
    >
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={130}
          height={36}
          className={
            isJpg
              ? "h-9 w-auto max-w-full object-contain mix-blend-multiply grayscale opacity-70 transition hover:opacity-100 hover:grayscale-0"
              : "h-8 w-auto object-contain opacity-60 brightness-0 invert transition hover:opacity-100"
          }
        />
      ) : (
        <span className="text-sm text-white/35">[Partner logo]</span>
      )}
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: Partner[];
  reverse?: boolean;
}) {
  return (
    <div className="vc-marquee-wrap overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div
        className={`vc-marquee flex w-max ${reverse ? "vc-marquee-rev" : ""}`}
      >
        {items.map((p) => (
          <PartnerPill key={p.name} {...p} />
        ))}
        {items.map((p) => (
          <div key={`dup-${p.name}`} aria-hidden>
            <PartnerPill {...p} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnersMarquee() {
  return (
    <section className="px-6 pb-28 sm:px-10 lg:px-16">
      <style>{`
        @keyframes vc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .vc-marquee { animation: vc-marquee 40s linear infinite; }
        .vc-marquee-rev { animation-direction: reverse; }
        .vc-marquee-wrap:hover .vc-marquee { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .vc-marquee { animation: none; } }
      `}</style>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-4xl leading-[1.1] text-white sm:text-5xl">
            Hired by the Teams{" "}
            <span className="bg-linear-to-r from-[#38bdf8] to-[#8b9cff] bg-clip-text italic text-transparent">
              You Want to Join.
            </span>
          </h2>
          <p className="mt-5 text-base text-white/60">
            Reputed enterprises across India and abroad hire from our
            programmes.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {SECTORS.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-12 space-y-4">
          <MarqueeRow items={PARTNERS_A} />
          <MarqueeRow items={PARTNERS_B} reverse />
        </div>
      </div>
    </section>
  );
}

export default async function ProgramsPage() {
  const docs = await getPrograms();
  const programs: Program[] = docs.map(({ priceInr, ...p }) => ({
    ...p,
    price: priceInr ? `₹${priceInr.toLocaleString("en-IN")}` : "Contact us",
  }));

  return (
    <main className="relative min-h-screen bg-[#040507] text-white selection:bg-[#38bdf8] selection:text-black antialiased overflow-x-clip">
      {/* Page-load entrance: CSS only (transform + opacity), no JS, no flash */}
      <style>{`
        @keyframes vc-in { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
        .vc-in { animation: vc-in .9s cubic-bezier(.22, 1, .36, 1) backwards; animation-delay: var(--d, 0ms); }
        @media (prefers-reduced-motion: reduce) { .vc-in { animation: none; } }
      `}</style>

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

      {/* relative keeps all content above the glow layer */}
      <div className="relative">
        {/* Hero */}
        <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-36 text-center sm:px-10 lg:px-16">
          <div
            style={delay(0)}
            className="vc-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-[#8b9cff] backdrop-blur-md"
          >
            <span>Virtual Captains Programs</span>
          </div>

          <h1
            style={delay(120)}
            className="vc-in max-w-4xl font-serif text-4xl font-normal leading-[1.15] text-white sm:text-5xl lg:text-6xl"
          >
            Structured Enablement from{" "}
            <span className="italic text-[#8b9cff]">Induction</span> to Quota
          </h1>

          <p
            style={delay(260)}
            className="vc-in mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            From new-hire induction to enterprise deal desk coaching, our
            tailored curricula combine human mentorship with generative
            simulations to build resilient, quota-crushing sellers.
          </p>

          <div
            style={delay(380)}
            className="vc-in mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/organisations"
              className="rounded-full bg-[#2563eb] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#1d4ed8]"
            >
              Organisation Curricula
            </Link>
            <Link
              href="/individuals"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Individual Coaching
            </Link>
          </div>
        </section>

        {/* Program cards (from Sanity) */}
        <section className="mx-auto max-w-350 px-6 pb-24 sm:px-10 lg:px-16">
          {programs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p, i) => (
                <ProgramCard key={p._id} program={p} index={i} />
              ))}
            </div>
          ) : (
            <p className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
              New programs are being added. Check back soon or{" "}
              <Link href="/contact" className="text-[#38bdf8] underline">
                talk to us
              </Link>
              .
            </p>
          )}
        </section>

        {/* Curriculum with Students / Professionals / Founders toggle */}
        <CurriculumSection />

        <TestimonialsSection />
        <PartnersMarquee />
      </div>

      {/* Same footer as the blog/news/home page (dark → blue) */}
      <SiteFooter theme="light-blue" />
    </main>
  );
}
