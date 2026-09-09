import CrossCountry from "./components/home/CrossCountry";
import Endorsement from "./components/home/Endorsement";
import Hero from "./components/home/Hero";
import HiringPartners from "./components/home/HiringPartners";
import OurApproach from "./components/home/OurApproach";
import RoleplayToConversation from "./components/home/RoleplayToConversation";
import ScrollText3D from "./components/home/ScrollText3D";
import SideNav from "./components/home/SideNav";
import SiteFooter from "./components/home/SiteFooter";
import TheImpact from "./components/home/TheImpact";

export default function Page() {
  return (
    <main className="block w-full">
      <SideNav />
      <Hero />
      <ScrollText3D />
      <RoleplayToConversation />

      {/*
        TwoAudiences is now fully integrated inside RoleplayToConversation
        to achieve the seamless "inside the black hole" transformation transition!
      */}

      <OurApproach />
      <CrossCountry />
      <Endorsement />
      <TheImpact />
      <HiringPartners />
      <SiteFooter />
    </main>
  );
}
