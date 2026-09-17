import { partner, partnerSlots } from "@/content/site";
import { PartnerLines } from "./PartnerLines";
import { PartnerStage } from "./PartnerStage";
import Image from "next/image";

export function PartnerNetwork() {
  return (
    <section className="section partner" aria-labelledby="partner-heading">
      <PartnerStage>
        <h2 className="partner__title font-serif" id="partner-heading">
          {partner.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        {/* Right side text */}
        <div className="absolute top-[8.7%] md:left-[55%] left-[8.47%] max-md:top-[25%] z-3 max-w-lg pr-4 md:pr-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 shadow-[0_0_16px_rgba(56,189,248,0.15)] mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] animate-pulse shadow-[0_0_6px_#38bdf8]" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#38bdf8]">
              Hiring Network
            </span>
          </div>
          <h3 className="text-white font-serif font-medium text-lg md:text-xl leading-snug mb-2">
            {partner.sideHeading}
          </h3>
          <p className="text-white/70 text-xs md:text-sm leading-relaxed">
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
        <div className="partner__hub opacity-0 pointer-events-none" data-partner-hub="" aria-hidden="true" />

        {/* Each logo rests inside its own destination frame, so the settled
            composition is real layout at every breakpoint. Phase 5 measures
            these rects, throws the logos back into the hub, and scrubs them
            out again — no coordinate table to keep in sync. */}
        <ul className="partner__slots" data-partner-slots="">
          {partnerSlots.map((slot, index) => (
            <li className="partner__slot" key={slot.id} data-partner-slot={index}>
              <span className="partner__logo relative w-full h-full flex items-center justify-center rounded-2xl border border-white/10 bg-white/4 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/8" data-partner-logo={index}>
                {slot.image ? (
                  <Image 
                    src={slot.image} 
                    alt={slot.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-contain p-4 md:p-6 hover:scale-110 transition-all duration-300"
                  />
                ) : (
                  <span className="font-semibold text-white/80">{slot.name}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </PartnerStage>
    </section>
  );
}
