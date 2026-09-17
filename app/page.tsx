import CrossCountry from "./components/home/CrossCountry";
import Endorsement from "./components/home/Endorsement";
import Hero from "./components/home/Hero";
import HiringPartners from "./components/home/HiringPartners";
import Navbar from "./components/home/Navbar";
import OurApproach from "./components/home/OurApproach";
import RoleplayToConversation from "./components/home/RoleplayToConversation";
import ScrollText3D from "./components/home/ScrollText3D";
import SideNav from "./components/home/SideNav";
import SiteFooter from "./components/home/SiteFooter";
import TheImpact from "./components/home/TheImpact";

export default function Page() {
  return (
    <main className="block w-full bg-[#040507]">
      <Navbar />
      <SideNav />
      <Hero />
      {/* 3D Text Section slides smoothly over Hero */}
      <ScrollText3D />
      <RoleplayToConversation />

      {/*
        TwoAudiences is now fully integrated inside RoleplayToConversation
        to achieve the seamless "inside the black hole" transformation transition!
      */}

      <OurApproach />
      <CrossCountry />
      {/* 
        Corrected Wrapper: 
        Uses relative positioning and a fixed minimum height so it takes up proper space 
        in the scroll flow without overlapping the components above or below it.
      */}

      <Endorsement />
      <TheImpact />
      <HiringPartners />
      <SiteFooter />
    </main>
  );
}
