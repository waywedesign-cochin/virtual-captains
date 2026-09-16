import type { Metadata } from "next";

import { HomeSections } from "../components/indivuduals/main/HomeSections";

export const metadata: Metadata = {
  title: "Virtual Captains — Launch Your Career as a High-Performing Seller",
  description:
    "A 12-week cohort programme that turns graduates, switchers and working reps into high-performing B2B sellers through hundreds of live and AI-simulated reps.",
};

import Navbar from "../components/home/Navbar";

export default function IndividualsPage() {
  return (
    <>
      <Navbar />
      <main className="individuals-theme bg-[#0d0749] text-white">
        <HomeSections />
      </main>
    </>
  );
}
