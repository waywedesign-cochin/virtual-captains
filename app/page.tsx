import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
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


export const metadata: Metadata = pageMetadata({
  title: "Virtual Captains | Sales Training, SalesX & Sales Floor Management",
  absoluteTitle: true,
  description:
    "Virtual Captains builds revenue-ready sellers and sales teams through SalesX simulation training, sales consulting and total sales floor management across the Middle East and Asia.",
  path: "/",
});

export default function Page() {
  return (
    <main className="block w-full bg-[#040507]">
      <Navbar />
      <SideNav />
      <Hero />
      <ScrollText3D />
      <RoleplayToConversation />
      <OurApproach />
      <CrossCountry />
      <Endorsement />
      <TheImpact />
      <HiringPartners />
      <SiteFooter />
    </main>
  );
}
