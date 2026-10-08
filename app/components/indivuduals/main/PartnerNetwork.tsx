import { partner, partnerSlots } from "@/content/site";
import { PartnerLines } from "./PartnerLines";
import { PartnerStage } from "./PartnerStage";
import { PartnerNetworkCompact } from "./PartnerNetworkCompact";
import { logoHeight } from "@/app/content/partners";
import ZoomHeading from "@/components/common/ZoomHeading";

export function PartnerNetwork() {
  return (
    <section className="section partner" aria-label="Partner Network">
      {/* Phones & tablets: flowing layout, no pinned stage */}
      <div className="lg:hidden">
        <PartnerNetworkCompact />
      </div>

      {/* Desktop: the pinned, percentage-positioned stage */}
      <div className="hidden h-full lg:block">
      <PartnerStage>
        <ZoomHeading className="partner__title type-h2" id="partner-heading">
          {partner.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </ZoomHeading>

        {/* Right side text */}
        <div className="absolute top-[8.7%] md:left-[55%] left-[8.47%] max-md:top-[25%] z-3 max-w-lg pr-4 md:pr-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 shadow-[0_0_16px_rgba(56,189,248,0.15)] mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] animate-pulse shadow-[0_0_6px_#38bdf8]" />
            <span className="type-eyebrow text-[#38bdf8]">
              Hiring Network
            </span>
          </div>
          <h3 className="type-h3 font-medium text-white mb-2">
            {partner.sideHeading}
          </h3>
          <p className="type-body text-white/70 text-justify hyphens-auto">
            {partner.sideBody}
          </p>
        </div>

        <PartnerLines />
        <span
          className="partner__release-node"
          data-partner-release-node=""
          aria-hidden="true"
        />

        {/* Hub for GSAP to measure the center coordinate, kept invisible so logos stack is visible */}
        {/* Glowing core the logo halo circles before the release */}
        <span className="partner__core" data-partner-core="" aria-hidden="true">
          <span className="partner__core-ring" />
        </span>

        <div className="partner__hub opacity-0 pointer-events-none" data-partner-hub="" aria-hidden="true" />

        {/* Each logo rests inside its own destination frame, so the settled
            composition is real layout at every breakpoint. Phase 5 measures
            these rects, throws the logos back into the hub, and scrubs them
            out again — no coordinate table to keep in sync. */}
        <ul className="partner__slots" data-partner-slots="">
          {partnerSlots.map((slot, index) => (
            <li className="partner__slot" key={slot.id} data-partner-slot={index}>
              <span className="partner__logo group absolute inset-0 flex items-center justify-center rounded-xl border border-[#0c8cf5]/35 bg-[#0d1530] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[border-color,background-color,box-shadow] duration-300 hover:border-[#38bdf8]/50 hover:bg-[#121d40] hover:shadow-[0_0_22px_-4px_rgba(56,189,248,0.45)]" data-partner-logo={index}>
                {slot.image ? (
                  <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slot.image}
                    alt={slot.name}
                    loading="lazy"
                    draggable={false}
                    style={{ height: `${logoHeight(slot.ratio ?? 2)}%` }}
                    className="w-auto max-w-full object-contain opacity-75 brightness-0 invert transition-[transform,opacity] duration-300 group-hover:scale-105 group-hover:opacity-100"
                  />
                  </>
                ) : (
                  <span className="font-semibold text-white/80">{slot.name}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </PartnerStage>
      </div>
    </section>
  );
}
