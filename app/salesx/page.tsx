import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import SalesXHero from "../components/salesx/SalesXHero";
import SalesXShowcase from "../components/salesx/SalesXShowcase";
import SalesXMethod from "../components/salesx/SalesXMethod";
import SalesXAudience from "../components/salesx/SalesXAudience";
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
    <main className="min-h-screen bg-[#030614] text-white selection:bg-[#38bdf8] selection:text-black">
      {/* Top Main Navigation */}
      <Navbar />

      {/* 1. Full Banner Video Hero with m.webm and Branding Pills */}
      <SalesXHero />

      {/*
       * Continuous Cosmic Void Canvas:
       * All sections flow seamlessly with zero borders and shared ambient nebula glows.
       */}
      <div className="relative bg-[#030614] overflow-hidden">
        {/* Shared ambient cosmic nebula lighting */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Top-mid indigo core */}
          <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full bg-[#1e40af]/15 blur-[160px]" />
          {/* Middle-left blue glow */}
          <div className="absolute top-[32%] -left-40 w-[800px] h-[800px] rounded-full bg-[#1d4ed8]/12 blur-[170px]" />
          {/* Middle-right cyan accent */}
          <div className="absolute top-[52%] -right-40 w-[850px] h-[750px] rounded-full bg-[#0284c7]/10 blur-[160px]" />
          {/* Lower-center deep glow */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full bg-[#1e3a8a]/14 blur-[160px]" />
        </div>

        {/* 2. 3-Layer Stacked Perspective Mockup Showcase */}
        <SalesXShowcase />

        {/* 3. The SalesX Method with Interactive Pinned Slides & 3 Vertical Indicator Dots */}
        <SalesXMethod />

        {/* 4. Career Track for Individuals with Rotating Perspective Halo & Stacked Benefit Cards */}
        <SalesXAudience />

        {/* 5. Quantified Outcomes: Orbital Results Hub with 4 Satellite Telemetry Nodes */}
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
