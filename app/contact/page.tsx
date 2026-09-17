import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import ContactHero from "../components/contact/ContactHero";
import ContactForm from "../components/contact/ContactForm";
import LocationsGlobe from "../components/contact/LocationsGlobe";
import ContactFooter from "../components/contact/ContactFooter";

export const metadata: Metadata = {
  title: "Contact Virtual Captains | Talk To A Sales Floor Captain",
  description:
    "Reach Virtual Captains for induction, sales audit, outbound, or a full operating partnership. Offices in India and the UAE, serving teams in 8+ countries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#040507] text-white">
      <Navbar />
      <ContactHero />
      <ContactForm />
      <LocationsGlobe />
      <ContactFooter />
    </main>
  );
}
