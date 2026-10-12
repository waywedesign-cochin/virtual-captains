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
      {/* FAQ (Individuals questions): light, on white, continuing the
          white CareerCta above into the white → blue footer below */}
      <FaqSection group="individuals" tone="light" background="#ffffff" />
      {/* Same footer as the home page, without its "Book a Call" CTA band */}
      {/* white → blue footer (same as Organisations) so the light sections
          above flow into it */}
      <SiteFooter showCTA={false} theme="white-blue" />
    </>
  );
}
