import type { Metadata } from "next";
import SalesXHero from "../components/salesx/SalesXHero";
import SalesXSimulated from "../components/salesx/SalesXSimulated";
import SalesXMethod from "../components/salesx/SalesXMethod";
import SalesXAudience from "../components/salesx/SalesXAudience";
import SalesXMoments from "../components/salesx/SalesXMoments";
import SellingNextSection from "../components/salesx/SellingNextSection";
import SalesXClimb from "../components/salesx/SalesXClimb";
import SkillCardSection from "../components/salesx/SkillCardSection";
import SalesXResultsHub from "../components/salesx/SalesXResultsHub";
import SalesXTestimonials from "../components/salesx/SalesXTestimonials";
import SalesXPartnerCloud from "../components/salesx/SalesXPartnerCloud";
import SalesXCTA from "../components/salesx/SalesXCTA";
import SalesXFooter from "../components/salesx/SalesXFooter";

export const metadata: Metadata = {
  title: "SalesX | High-Velocity AI Sales Simulation Engine",
  description:
    "Execution training for top-tier revenue teams. Measure, simulate, and scale sales closing rates with hyper-realistic AI buyer personas and real-time conviction telemetry.",
};

export default function SalesXPage() {
  return (
    <main className="min-h-screen bg-salesx-bg text-white selection:bg-[#38bdf8] selection:text-black">
      {/* 1. Pinned hero: video → dashboard image rises in → headline over gradient */}
      <SalesXHero />

      {/*
       * Continuous Cosmic Void Canvas:
       * All sections flow seamlessly with zero borders and shared ambient nebula glows.
       */}
      <div className="relative bg-salesx-bg overflow-hidden">
        {/* Shared ambient cosmic nebula lighting */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          {/* Top-mid indigo core */}
          <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full bg-[#1e40af]/15 blur-[160px]" />
          {/* Middle-left blue glow */}
          <div className="absolute top-[32%] -left-40 w-[800px] h-[800px] rounded-full bg-[#1d4ed8]/12 blur-[170px]" />
          {/* Middle-right cyan accent */}
          <div className="absolute top-[52%] -right-40 w-[850px] h-[750px] rounded-full bg-[#0284c7]/10 blur-[160px]" />
          {/* Lower-center deep glow */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full bg-[#1e3a8a]/14 blur-[160px]" />
        </div>

        {/* (The dashboard showcase now lives inside the pinned hero) */}

        {/* 2. Simulated by AI / Validated by humans — pinned illustration + rotating dial */}
        <SalesXSimulated />

        {/* 3. The SalesX Method with Interactive Pinned Slides & 3 Vertical Indicator Dots */}
        <SalesXMethod />

        {/* 4. Career Track for Individuals and Organisations */}
        <SalesXAudience />

        {/* 5. Moments that Decide a Career (Pinned changing story) */}
        <SalesXMoments />

        {/* 6. What are you selling next? (Interactive 3D Perspective Card Stack) */}
        <SellingNextSection />

        {/* 7. The Climb: 3 levels, tab-driven module list (not pinned) */}
        <SalesXClimb />

        {/* 7. The VC Skill Card: A Certificate of Ability */}
        <SkillCardSection />

        {/* 8. Quantified Outcomes: Orbital Results Hub with 4 Satellite Telemetry Nodes */}
        <SalesXResultsHub />

        {/* 6. Conversational Testimonials: Fixed Sticky Left & Real-Time Flowing Chat Bubbles */}
        <SalesXTestimonials />

        {/* 7. Enterprise Partner Network: Dynamic Orbiting Ecosystem Cloud */}
        <SalesXPartnerCloud />

        {/* 8. Ready to Redefine: High-Impact CTA with 5 Glowing Circular Metric Badges */}
        <SalesXCTA />

        {/* 9. Dedicated SalesX Illuminated Footer */}
        <SalesXFooter />
      </div>
    </main>
  );
}
