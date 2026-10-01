import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

import { HomeSections } from "../components/indivuduals/main/HomeSections";

export const metadata: Metadata = pageMetadata({
  title: "Sales Training Course for Individuals",
  description:
    "A 12-week cohort programme that turns graduates, career switchers and working reps into high-performing B2B sellers through live practice, AI simulations and placement support.",
  path: "/individuals",
});

import Navbar from "../components/home/Navbar";

export default function IndividualsPage() {
  return (
    <>
      <Navbar />
      <main className="individuals-theme bg-[#040507] text-white min-h-screen overflow-x-hidden">
        <HomeSections />
      </main>
    </>
  );
}
