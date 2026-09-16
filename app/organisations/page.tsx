import Navbar from "../components/home/Navbar";
import OrgHero from "../components/organisations/OrgHero";
import GroomStudio from "../components/organisations/GroomStudio";
import OrgCTA from "../components/organisations/OrgCTA";
import { Footer } from "../components/indivuduals/layout/Footer";


export default function OrganisationsPage() {
  return (
    <>
      <Navbar />
      <main className="block w-full bg-[#f8f9fa] min-h-screen text-slate-900 overflow-hidden">

        <OrgHero />
        <GroomStudio />
        <OrgCTA />
        <Footer scrollingWord="ORGANISATIONS" />
      </main>
    </>
  );
}
