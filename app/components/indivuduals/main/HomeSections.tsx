import { DarkAtmosphere } from "../layout/DarkAtmosphere";
import { Footer } from "../layout/Footer";
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
      <Footer />
    </>
  );
}
