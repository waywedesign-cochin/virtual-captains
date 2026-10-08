import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@portabletext/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";
import Navbar from "../../components/home/Navbar";
import SiteFooter from "../../components/home/SiteFooter";
import DotGridSpotlight from "../../components/common/DotGridSpotlight";
import { CareerApplyForm } from "../../components/careers/CareerApplyForm";
import { careerPortableText } from "../../components/careers/careerPortableText";
import { formatPostedDate, formatSalary, jobTypeLine } from "../../components/careers/careerFormat";
import { getAllCareers, getCareerBySlug } from "@/sanity/queries";
import {
  EMPLOYMENT_TYPE_LABEL,
  WORKPLACE_TYPE_LABEL,
  type Career,
} from "@/sanity/lib/types";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]";

const CONTAINER = "w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const jobs = await getAllCareers();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getCareerBySlug(slug).catch(() => null);

  if (!job) {
    return pageMetadata({
      title: "Careers",
      description: "Open roles at Virtual Captains.",
      path: "/careers",
      noIndex: true,
    });
  }

  return pageMetadata({
    title: job.seo?.metaTitle || `${job.title} — ${job.location}`,
    description: job.seo?.metaDescription || job.summary,
    path: `/careers/${job.slug}`,
    keywords: [job.title, job.department, `${job.department} jobs`, `jobs in ${job.location}`],
  });
}

/** Plain text from Portable Text, for structured data. */
function toPlainText(blocks?: PortableTextBlock[]) {
  return (blocks ?? [])
    .filter((b) => b._type === "block")
    .map((b) =>
      ((b.children as { text?: string }[] | undefined) ?? []).map((c) => c.text ?? "").join(""),
    )
    .join("\n");
}

/** Google for Jobs structured data (schema.org JobPosting). */
function jobPostingJsonLd(job: Career) {
  const description = [
    job.summary,
    toPlainText(job.aboutRole),
    toPlainText(job.responsibilities),
    toPlainText(job.requirements),
  ]
    .filter(Boolean)
    .join("\n\n");

  const [city, ...rest] = job.location.split(",").map((s) => s.trim());
  const salary = job.salary;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: job.postedDate,
    ...(job.validThrough && { validThrough: job.validThrough }),
    employmentType: job.employmentType,
    hiringOrganization: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: city,
        ...(rest.length && { addressCountry: rest.join(", ") }),
      },
    },
    ...(job.workplaceType === "remote" && { jobLocationType: "TELECOMMUTE" }),
    ...(job.experience && { experienceRequirements: job.experience }),
    ...(salary?.showOnSite &&
      (salary.min || salary.max) && {
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: salary.currency || "INR",
          value: {
            "@type": "QuantitativeValue",
            ...(salary.min && { minValue: salary.min }),
            ...(salary.max && { maxValue: salary.max }),
            unitText: salary.unit || "YEAR",
          },
        },
      }),
    directApply: true,
    url: `${SITE_URL}/careers/${job.slug}`,
  };
}

function TitleWithGradientTail({ title }: { title: string }) {
  const words = title.split(" ");
  const head = words.slice(0, -1).join(" ");
  const tail = words.slice(-1).join(" ");
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

function JobSection({ title, blocks }: { title: string; blocks?: PortableTextBlock[] }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <section className="space-y-4">
      <h2 className="font-sans text-2xl sm:text-3xl font-normal tracking-tight bg-linear-to-r from-white via-[#8fd0ff] to-white bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="space-y-5">
        <PortableText value={blocks} components={careerPortableText} />
      </div>
    </section>
  );
}

/** Key facts card — sticky sidebar on desktop, inline on smaller screens. */
function JobOverview({ job, className = "" }: { job: Career; className?: string }) {
  const salary = formatSalary(job.salary);
  const rows = [
    { icon: Building2, label: "Department", value: job.department },
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Briefcase, label: "Employment", value: EMPLOYMENT_TYPE_LABEL[job.employmentType] },
    { icon: Users, label: "Workplace", value: WORKPLACE_TYPE_LABEL[job.workplaceType] },
    job.experience && { icon: Clock, label: "Experience", value: job.experience },
    salary && { icon: Wallet, label: "Salary", value: salary },
    job.openings && job.openings > 1 && { icon: Users, label: "Openings", value: String(job.openings) },
    { icon: Calendar, label: "Posted", value: formatPostedDate(job.postedDate) },
    job.validThrough && { icon: Calendar, label: "Apply By", value: formatPostedDate(job.validThrough) },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-linear-to-b from-white/6 to-white/2 p-5 sm:p-6 backdrop-blur-xl shadow-[0_16px_40px_-18px_rgba(0,0,0,0.7)] ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[11px] font-bold tracking-widest uppercase bg-linear-to-r from-[#8fd0ff] to-[#38bdf8] bg-clip-text text-transparent">
          Job Overview
        </span>
        <div className="flex-1 h-px bg-linear-to-r from-[#1d4ed8]/30 to-transparent" />
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 xl:grid-cols-1">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/6 border border-white/10">
              <Icon className="h-4 w-4 text-[#8fd0ff]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <dt className="text-[11px] uppercase tracking-wider text-white/45">{label}</dt>
              <dd className="text-sm font-medium text-white wrap-break-word">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
      <a
        href="#apply"
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#e7ff3d] hover:bg-[#d8f030] py-3 text-sm font-bold text-[#0a0b0d] shadow-[0_0_24px_rgba(231,255,61,0.3)] transition-all hover:scale-102 ${FOCUS_RING}`}
      >
        Apply Now
        <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  );
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [job, allJobs] = await Promise.all([getCareerBySlug(slug), getAllCareers()]);

  if (!job) notFound();

  const more = allJobs.filter((j) => j._id !== job._id).slice(0, 3);

  return (
    <div className="relative min-h-screen bg-[#040507] text-white flex flex-col selection:bg-[#38bdf8] selection:text-black antialiased font-sans overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobPostingJsonLd(job)).replace(/</g, "\\u003c"),
        }}
      />
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
            href="/careers"
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/60 hover:text-[#8fd0ff] transition-colors cursor-pointer group rounded-sm ${FOCUS_RING}`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#8fd0ff]" />
            <span>Back to Careers</span>
          </Link>
        </div>

        <div className={`${CONTAINER} py-4 flex gap-10 xl:gap-14 items-start`}>
          {/* LEFT: main content */}
          <div className="min-w-0 flex-1">
            <div className="space-y-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-[#1d4ed8] to-[#0369a1] text-white shadow-[0_2px_10px_rgba(29,78,216,0.25)]">
                  {job.department}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
                  <Briefcase className="w-3 h-3" />
                  {jobTypeLine(job)}
                </span>
              </div>

              <TitleWithGradientTail title={job.title} />

              <div className="h-px bg-linear-to-r from-[#1d4ed8]/30 via-[#0ea5e9]/15 to-transparent" />
            </div>

            {/* Lead */}
            <div className="flex gap-4 pt-8">
              <div className="w-1 shrink-0 rounded-full bg-linear-to-b from-[#1d4ed8] to-[#0ea5e9]/30 mt-1 mb-1" />
              <p className="text-lg sm:text-xl md:text-2xl text-white font-sans leading-relaxed font-normal">
                {job.summary}
              </p>
            </div>

            {/* Overview inline below desktop */}
            <JobOverview job={job} className="mt-8 xl:hidden" />

            {/* Job description */}
            <div className="space-y-12 pt-12">
              <JobSection title="About The Role" blocks={job.aboutRole} />
              <JobSection title="Key Responsibilities" blocks={job.responsibilities} />
              <JobSection title="Requirements" blocks={job.requirements} />
              <JobSection title="Nice To Have" blocks={job.niceToHave} />
              <JobSection title="What We Offer" blocks={job.benefits} />

              {job.hiringProcess && job.hiringProcess.length > 0 && (
                <section className="space-y-5">
                  <h2 className="font-sans text-2xl sm:text-3xl font-normal tracking-tight bg-linear-to-r from-white via-[#8fd0ff] to-white bg-clip-text text-transparent">
                    Hiring Process
                  </h2>
                  <ol className="grid gap-3 sm:grid-cols-2">
                    {job.hiringProcess.map((step, i) => (
                      <li
                        key={`${step}-${i}`}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/4 p-4"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#1d4ed8] to-[#0369a1] text-sm font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="text-sm sm:text-base text-white/85">{step}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              <p className="text-sm text-white/50 leading-relaxed border-t border-white/10 pt-6">
                Virtual Captains is an equal opportunity employer. We welcome applicants of every
                background and do not discriminate on the basis of gender, religion, caste, age,
                disability or any other protected characteristic.
              </p>
            </div>

            {/* Application form */}
            <section id="apply" className="scroll-mt-28 pt-16" aria-labelledby="apply-heading">
              <div className="mb-6 text-center sm:text-left">
                <span className="font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-[#38bdf8]">
                  Apply
                </span>
                <h2 id="apply-heading" className="mt-2 font-sans text-2xl sm:text-3xl font-medium text-white tracking-tight">
                  Apply For This Role
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/60">
                  Takes about 3 minutes. Fields marked * are required.
                </p>
              </div>
              <CareerApplyForm jobSlug={job.slug} jobTitle={job.title} />
            </section>
          </div>

          {/* RIGHT: sticky overview + more roles (desktop only) */}
          <aside className="hidden xl:block w-[320px] shrink-0 sticky top-28 self-start space-y-6">
            <JobOverview job={job} />

            {more.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[11px] font-bold tracking-widest uppercase bg-linear-to-r from-[#8fd0ff] to-[#38bdf8] bg-clip-text text-transparent">
                    More Open Roles
                  </span>
                  <div className="flex-1 h-px bg-linear-to-r from-[#1d4ed8]/30 to-transparent" />
                </div>
                <div className="flex flex-col gap-3">
                  {more.map((j) => (
                    <Link
                      key={j._id}
                      href={`/careers/${j.slug}`}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-all duration-300 hover:border-[#1d4ed8]/30"
                    >
                      <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-[#1d4ed8] to-[#0ea5e9] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/8 text-white/65 inline-block mb-1">
                        {j.department}
                      </span>
                      <h3 className="text-[13px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#8fd0ff] transition-colors">
                        {j.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-white/45">{j.location}</p>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/careers"
                  className={`mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-white/12 text-xs font-semibold text-white/65 hover:text-[#8fd0ff] hover:border-[#1d4ed8]/30 transition-all group ${FOCUS_RING}`}
                >
                  <span>View All Roles</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </aside>
        </div>

        {/* Below desktop: more roles after the form */}
        {more.length > 0 && (
          <section className={`xl:hidden ${CONTAINER} mt-16`}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold tracking-widest uppercase bg-linear-to-r from-[#8fd0ff] to-[#38bdf8] bg-clip-text text-transparent">
                More Open Roles
              </span>
              <div className="flex-1 h-px bg-linear-to-r from-[#1d4ed8]/30 to-transparent" />
              <Link
                href="/careers"
                className="inline-flex items-center gap-1 text-xs font-medium text-white/60 hover:text-[#8fd0ff] transition-colors"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {more.map((j) => (
                <Link
                  key={j._id}
                  href={`/careers/${j.slug}`}
                  className="group relative bg-white/5 rounded-3xl p-5 border border-white/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-[#1d4ed8] via-[#0ea5e9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-white/45">
                    {j.department}
                  </span>
                  <h3 className="font-sans text-xl font-normal text-white group-hover:text-[#8fd0ff] transition-colors leading-[1.24] tracking-tight mt-2 mb-1.5 line-clamp-2">
                    {j.title}
                  </h3>
                  <p className="text-xs text-white/60">
                    {j.location} · {jobTypeLine(j)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <SiteFooter showCTA={false} />
    </div>
  );
}
