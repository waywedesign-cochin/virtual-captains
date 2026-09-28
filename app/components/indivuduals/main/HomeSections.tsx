import { DarkAtmosphere } from "../layout/DarkAtmosphere";
import SiteFooter from "@/components/home/SiteFooter";
import { CareerCta } from "./CareerCta";
import { Curriculum } from "./Curriculum";

import { Hero } from "./Hero";
import { PartnerNetwork } from "./PartnerNetwork";
import { WhoThisIsFor } from "./WhoThisIsFor";

export function HomeSections() {
  return (
    <>
      <DarkAtmosphere>
        <Hero />
        <Curriculum />
        <PartnerNetwork />
      </DarkAtmosphere>
      <WhoThisIsFor />
      <CareerCta />
      {/* Same footer as the home page, without its "Book a Call" CTA band */}
      <SiteFooter showCTA={false} theme="light-blue" />
    </>
  );
}
