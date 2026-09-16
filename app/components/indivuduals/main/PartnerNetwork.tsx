import { partner, partnerSlots } from "@/content/site";
import { PartnerLines } from "./PartnerLines";
import { PartnerStage } from "./PartnerStage";
import Image from "next/image";

export function PartnerNetwork() {
  return (
    <section className="section partner" aria-labelledby="partner-heading">
      <PartnerStage>
        <h2 className="partner__title" id="partner-heading">
          {partner.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        {/* Right side text */}
        <div className="absolute top-[8.7%] md:left-[55%] left-[8.47%] max-md:top-[25%] z-[3] max-w-lg pr-4 md:pr-8">
          <h3 className="text-blue-400 font-medium text-lg md:text-xl leading-snug mb-3">
            {partner.sideHeading}
          </h3>
          <p className="text-(--white) text-xs md:text-sm leading-relaxed opacity-80">
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
              <span className="partner__logo relative w-full h-full flex items-center justify-center" data-partner-logo={index}>
                {slot.image ? (
                  <Image 
                    src={slot.image} 
                    alt={slot.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, 20vw"
                    className="object-contain p-4 md:p-6 hover:scale-110 transition-all duration-300"
                  />
                ) : (
                  slot.name
                )}
              </span>
            </li>
          ))}
        </ul>
      </PartnerStage>
    </section>
  );
}
