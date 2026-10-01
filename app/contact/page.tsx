import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Navbar from "../components/home/Navbar";
import ContactHero from "../components/contact/ContactHero";
import ContactForm from "../components/contact/ContactForm";
import LocationsGlobe from "../components/contact/LocationsGlobe";
import ContactFooter from "../components/contact/ContactFooter";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Talk to Virtual Captains about induction, sales audits, outbound lead generation or a full sales floor partnership. Offices in India and the UAE, serving teams in 8+ countries.",
  path: "/contact",
});

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
