"use client";

import ZoomHeading from "@/components/common/ZoomHeading";
import { PartnerNetwork } from "@/components/indivuduals/main/PartnerNetwork";
import { PARTNERS } from "@/app/content/partners";

/**
 * Partner page "Trusted by Forward-Thinking Organisations": the Individuals
 * page's logo animation (logos burst out of a glowing core into a grid as you
 * scroll), with this page's own copy. Logos come from the shared
 * PARTNERS list, so new logos show up here automatically.
 */
const EYEBROW = "Join Our Growing Ecosystem";

/** The subtitle, with its key phrases picked out (same words as SUBTITLE). */
function Subtitle({ className = "" }: { className?: string }) {
  return (
    <p className={`leading-relaxed text-slate-400 ${className}`}>
      From <span className="text-white">premier universities</span> and
      vocational hubs to{" "}
      <span className="text-white">rapid-scaling corporate enterprises</span>,
      our network creates{" "}
      <span className="bg-linear-to-r from-[#7dd3fc] to-[#38bdf8] bg-clip-text font-medium text-transparent">
        unfair revenue and hiring advantages
      </span>
      .
    </p>
  );
}

/** Desktop side panel next to the glowing core. */
function SidePanel() {
  const stats = [
    { value: `${PARTNERS.length}+`, label: "Partners" },
    { value: "Universities", label: "& Institutes" },
    { value: "Enterprises", label: "& Startups" },
  ];
  return (
    <div className="relative">
      {/* soft glow so the panel balances the core on the left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[32px] bg-[radial-gradient(ellipse_at_30%_20%,rgba(29,78,216,0.22),transparent_70%)] blur-xl"
      />
      <div className="rounded-2xl border border-white/10 bg-linear-to-br from-white/[0.06] to-white/[0.015] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md xl:p-7">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/30 bg-[#1d4ed8]/15 px-3 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7dd3fc]">
            Partner Network
          </span>
        </div>

        <Subtitle className="text-base xl:text-lg" />

        {/* stats only where there's room above the connector line (≥1400px) */}
        <div className="mt-5 hidden grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-4 min-[1400px]:grid">
          {stats.map((s) => (
            <div key={s.label} className="px-3 first:pl-0 last:pr-0">
              <p className="text-sm font-semibold text-white xl:text-base">
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] text-white/45">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Heading({ className = "" }: { className?: string }) {
  return (
    <ZoomHeading
      className={`font-sans font-medium text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight ${className}`}
    >
      Trusted by{" "}
      <span className="whitespace-nowrap">Forward-Thinking</span>{" "}
      <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-[#7dd3fc] to-[#38bdf8]">
        Organisations
      </span>
    </ZoomHeading>
  );
}

export function PartnerLogos() {
  return (
    <PartnerNetwork
      ariaLabel="Our partner and hiring network"
      className="bg-[#020B25]"
      /* Desktop stage: eyebrow + heading top-left (clear of the core) */
      heading={
        <div className="absolute left-0 top-[8.7%] z-3 max-w-[37%]">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
            {EYEBROW}
          </p>
          <Heading />
        </div>
      }
      /* Desktop stage: subtitle to the right of the core */
      aside={<SidePanel />}
      /* Phones & tablets: centred intro above the logo grid */
      compactIntro={
        <>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8] sm:text-[11px]">
            {EYEBROW}
          </p>
          <Heading />
          <Subtitle className="mx-auto mt-4 max-w-xl px-2 text-sm" />
        </>
      }
    />
  );
}
