import type { Metadata } from "next";
import Header from "../components/organisations/Header";
import Hero from "../components/organisations/Hero";
import GroomStudio from "../components/organisations/GroomStudio";
import CtaSection from "../components/organisations/CtaSection";
import Footer from "../components/organisations/Footer";
// import Header from "@/components/organisations/Header";
// import Hero from "@/components/organisations/Hero";
// import GroomStudio from "@/components/organisations/GroomStudio";
// import CtaSection from "@/components/organisations/CtaSection";
// import Footer from "@/components/organisations/Footer";

export const metadata: Metadata = {
  title: "Virtual Captains | From Induction to Revenue",
  description:
    "Total sales floor management for organisations — induction, orientation, audit, and outbound, all inside your revenue motion.",
};

// Server component shell: only the sections that need interactivity or
// animation are marked "use client" (see components/organisations/*).
export default function OrganisationsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <Header />
      <Hero />
      <GroomStudio />
      <CtaSection />
      <Footer />
    </main>
  );
}
