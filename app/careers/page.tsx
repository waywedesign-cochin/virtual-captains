import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Briefcase, MapPin } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import DotGridSpotlight from "../components/common/DotGridSpotlight";
import { CareersHero } from "../components/careers/CareersHero";
import { formatPostedDate, jobTypeLine } from "../components/careers/careerFormat";
import { getAllCareers } from "@/sanity/queries";
import type { CareerSummary } from "@/sanity/lib/types";

export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description:
    "Open roles at Virtual Captains. Join the team building high-performance sales floors across India, the Middle East and Southeast Asia.",
  path: "/careers",
  keywords: ["Virtual Captains careers", "sales jobs", "sales trainer jobs", "jobs in Kochi"],
});

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

const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function JobCard({ job }: { job: CareerSummary }) {
  return (
    <article className="group relative w-full rounded-3xl sm:rounded-[26px] p-5 sm:p-6 border border-white/10 bg-linear-to-b from-white/6 to-white/2 backdrop-blur-xl shadow-[0_16px_40px_-18px_rgba(0,0,0,0.7)] hover:border-white/20 hover:shadow-[0_24px_50px_-18px_rgba(29,78,216,0.45)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Blue gradient accent top border on hover */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-[#38bdf8] via-[#8fd0ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[11px] font-medium border border-white/12 bg-white/5 text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
            {job.department}
          </span>
          {job.featured && (
            <span className="rounded-full bg-[#e7ff3d]/15 border border-[#e7ff3d]/35 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#e7ff3d]">
              Hiring Now
            </span>
          )}
        </div>

        <h3 className="font-sans text-xl sm:text-[22px] font-medium text-white group-hover:text-[#8fd0ff] transition-colors leading-[1.24] tracking-tight mt-4 mb-2 line-clamp-2">
          <Link
            href={`/careers/${job.slug}`}
            className={`after:absolute after:inset-0 after:content-[''] rounded-sm ${FOCUS_RING}`}
          >
            {job.title}
          </Link>
        </h3>

        <p className="text-sm text-white/60 leading-relaxed line-clamp-3 mb-5">{job.summary}</p>

        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-white/70 mb-5">
          <li className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#8fd0ff]" aria-hidden="true" />
            {job.location}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-[#8fd0ff]" aria-hidden="true" />
            {jobTypeLine(job)}
          </li>
          {job.experience && <li className="text-white/55">{job.experience}</li>}
        </ul>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-[11px] font-mono uppercase tracking-widest text-white/45">
          Posted <time dateTime={job.postedDate}>{formatPostedDate(job.postedDate)}</time>
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-[#e7ff3d] transition-colors">
          View Role
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

export default async function CareersPage({
  searchParams,
}: {
  searchParams?: Promise<{ department?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const jobs = await getAllCareers();

  const departments = [...new Set(jobs.map((j) => j.department).filter(Boolean))].sort();
  const tabs = [
    { label: "All Roles", slug: "all" },
    ...departments.map((d) => ({ label: d, slug: toSlug(d) })),
  ];
  const active = tabs.find((t) => t.slug === params.department)?.slug ?? "all";
  const filtered = active === "all" ? jobs : jobs.filter((j) => toSlug(j.department) === active);

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
      <DotGridSpotlight />

      {/* pt offsets the fixed Navbar */}
      <div className="relative flex-1 w-full pt-20 sm:pt-24 pb-16">
        <CareersHero openRoles={jobs.length} />

        {/* Department filter tabs (same look as news/blog) */}
        {departments.length > 1 && (
          <section className={`${CONTAINER} mb-12`}>
            <nav
              aria-label="Filter roles by department"
              className="-mx-4 flex overflow-x-auto px-4 scrollbar-none [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0"
            >
              <div className="mx-auto flex w-max shrink-0 items-center gap-1.5 p-1 bg-white/4 rounded-full border border-white/10 sm:mx-0">
                {tabs.map((t) => {
                  const isActive = t.slug === active;
                  return (
                    <Link
                      key={t.slug}
                      href={t.slug === "all" ? "/careers" : `?department=${t.slug}`}
                      scroll={false}
                      aria-current={isActive ? "page" : undefined}
                      className={`shrink-0 inline-flex items-center min-h-10 px-4 rounded-full text-[13px] sm:text-sm font-medium transition-colors select-none ${FOCUS_RING} ${
                        isActive
                          ? "bg-white text-black shadow-[0_0_20px_rgba(143,208,255,0.35)]"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </section>
        )}

        {/* Open roles */}
        <section className={`${CONTAINER} mb-16`} aria-labelledby="open-roles">
          <SectionLabel>
            <span id="open-roles">Open Roles</span>
          </SectionLabel>

          {filtered.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white/4 rounded-3xl border border-white/10 space-y-3">
              <p className="text-white text-lg font-medium">
                {jobs.length === 0 ? "No Open Roles Right Now" : "No Roles In This Department"}
              </p>
              <p className="text-white/60 text-sm max-w-md mx-auto">
                {jobs.length === 0
                  ? "We're not actively hiring at the moment, but we're always happy to meet great sales talent."
                  : "Try another department, or see every open role."}
              </p>
              {jobs.length > 0 && (
                <Link href="/careers" className="inline-block text-xs font-semibold text-white underline hover:text-[#8fd0ff]">
                  View All Roles
                </Link>
              )}
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filtered.map((job) => (
                <li key={job._id} className="flex">
                  <JobCard job={job} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Open application */}
        <section className={CONTAINER}>
          <div className="relative overflow-hidden rounded-[28px] sm:rounded-4xl border border-white/10 bg-linear-to-br from-white/[0.07] via-white/3 to-transparent p-8 sm:p-12 text-center sm:text-left">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#1d4ed8]/25 blur-[90px]" />
            <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div className="max-w-xl">
                <h2 className="font-sans text-2xl sm:text-3xl font-medium text-white tracking-tight">
                  Don&apos;t See The Right Role?
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/65 leading-relaxed">
                  Send us your profile and tell us how you&apos;d contribute. We keep strong
                  candidates in mind for upcoming openings.
                </p>
              </div>
              <Link
                href="/contact"
                className={`inline-flex shrink-0 items-center gap-2 rounded-full bg-[#e7ff3d] hover:bg-[#d8f030] px-7 py-3 text-sm font-bold text-[#0a0b0d] shadow-[0_0_24px_rgba(231,255,61,0.3)] transition-all hover:scale-102 ${FOCUS_RING}`}
              >
                Get In Touch
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter showCTA={false} theme="light-blue" />
    </main>
  );
}
