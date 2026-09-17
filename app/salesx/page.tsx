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
    <main className="min-h-screen bg-[#07090e] text-white selection:bg-[#38bdf8] selection:text-black">
      {/* Top Main Navigation */}
      <Navbar />

      {/* 1. Full Banner Video Hero with m.webm and Branding Pills */}
      <SalesXHero />

      {/* 2. 3-Layer Stacked Perspective Mockup Showcase */}
      <SalesXShowcase />

      {/* 3. The SalesX Method with Interactive Pinned Slides & 3 Vertical Indicator Dots */}
      <SalesXMethod />

      {/* Career Track for Individuals with Rotating Perspective Halo & Stacked Benefit Cards */}
      <SalesXAudience />

      {/* Quantified Outcomes: Orbital Results Hub with 4 Satellite Telemetry Nodes */}
      <SalesXResultsHub />

      {/* Conversational Testimonials: Fixed Sticky Left & Real-Time Flowing Chat Bubbles */}
      <SalesXTestimonials />

      {/* Enterprise Partner Network: Dynamic Orbiting Ecosystem Cloud */}
      <SalesXPartnerCloud />

      {/* Ready to Redefine: High-Impact CTA with 5 Glowing Circular Metric Badges */}
      <SalesXCTA />

      {/* Dedicated SalesX Illuminated Footer */}
      <SalesXFooter />
    </main>
  );
}
