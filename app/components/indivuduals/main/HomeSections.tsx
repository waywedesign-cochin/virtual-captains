import { DarkAtmosphere } from "../layout/DarkAtmosphere";
import SiteFooter from "@/components/home/SiteFooter";
import { CareerCta } from "./CareerCta";
import { FaqSection } from "@/components/common/FaqSection";
import { Curriculum } from "./Curriculum";

import { Hero } from "./Hero";
import { WhoThisIsFor } from "./WhoThisIsFor";

export function HomeSections() {
  return (
    <>
      <DarkAtmosphere>
        <Hero />
        <Curriculum />
      </DarkAtmosphere>
      <WhoThisIsFor />
      <CareerCta />
      {/* FAQ (Individuals questions): light, continuing the white CareerCta
          above, then fading into the footer's near-black below the cards */}
      <FaqSection
        group="individuals"
        tone="light"
        background="linear-gradient(to bottom, #ffffff 0%, #ffffff 84%, #040507 100%)"
      />
      {/* Same footer as the home page, without its "Book a Call" CTA band */}
      <SiteFooter showCTA={false} theme="light-blue" />
    </>
  );
}
