import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import OrgHero from "../components/organisations/OrgHero";
import GroomStudio from "../components/organisations/GroomStudio";
import OrgCTA from "../components/organisations/OrgCTA";
import SiteFooter from "../components/home/SiteFooter";

export const metadata: Metadata = {
  title: "Virtual Captains for Organisations — Total Sales Floor Management",
  description:
    "Four enterprise sales programmes, one operating partner. Turn new hires into revenue-ready reps, audit sales floors, and build high-velocity outbound engines.",
};

export default function OrganisationsPage() {
  return (
    <>
      <Navbar />
      <main className="block w-full bg-white min-h-screen text-slate-900 overflow-x-hidden">
        <OrgHero />
        <GroomStudio />
        <OrgCTA />
        {/* Home-page footer, white → blue to flow out of this light page */}
        <SiteFooter showCTA={false} theme="white-blue" />
      </main>
    </>
  );
}
