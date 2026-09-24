import type { Metadata } from "next";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";

import AboutHero from "../components/about/AboutHero";
import AboutInsideWorld from "../components/about/AboutInsideWorld";
import AboutFounder from "../components/about/AboutFounder";
import AboutMetrics from "../components/about/AboutMetrics";
import AboutPartners from "../components/about/AboutPartners";
import AboutCertifications from "../components/about/AboutCertifications";
import AboutVideoCTA from "../components/about/AboutVideoCTA";

export const metadata: Metadata = {
  title: "About Virtual Captains | Conversational Sales Intelligence",
  description:
    "A smarter way to build sales capability at scale. We empower sales professionals and global organisations with AI simulation and real-world execution capabilities.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#020B25] text-white selection:bg-[#F3FC00] selection:text-black">
      <Navbar />

      {/*
       * Unified body canvas — all sections live inside one continuous
       * background layer. No borders, no colour breaks, no separation.
       */}
      <div className="relative z-10 bg-[#020B25] overflow-x-clip">
        {/* Continuous Subtle Dot Grid System across the entire About page (fades in after hero) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.065) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 600px, black 850px, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 600px, black 850px, black 100%)",
          }}
        />

        {/* Shared ambient nebula glows that float across the whole page */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Top-centre blue core */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-225 sm:w-275 h-175 rounded-full bg-[#0f3591]/20 blur-[160px]" />
          {/* Mid-page warm accent */}
          <div className="absolute top-[35%] right-[-10%] w-162.5 sm:w-212.5 h-162.5 rounded-full bg-[#1a4fc8]/14 blur-[160px]" />
          {/* Bottom-left cool glow */}
          <div className="absolute bottom-[20%] left-[-10%] w-150 sm:w-200 h-150 rounded-full bg-[#0a2a80]/18 blur-[150px]" />
          {/* Deep footer aura */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-237.5 h-125 rounded-full bg-[#0d276b]/15 blur-[160px]" />
        </div>

        {/* 1. Hero Section: Single Centred Headline */}
        <AboutHero />

        {/* 2. Inside Our World: Looping Card & Rotating Half-Circle Animation */}
        <AboutInsideWorld />

        {/* 3. Founder Section: Arch Portrait, Constellation & Narrative Creed */}
        <AboutFounder />

        {/* 4. Metrics Orbit Section: Tilted Ellipse & Global Impact Stats */}
        <AboutMetrics />

        {/* 5. Partner Network Section: 5 Real Partners Cluster & Narrative */}
        <AboutPartners />

        {/* 6. Certifications Section: Giant Watermark Title & 4 Rosette Star Badges */}
        <AboutCertifications />

        {/* 7. Video & Call to Action: YouTube Iframe & Concentric Book A Call Button */}
        <AboutVideoCTA />
      </div>

      {/* Footer: Pure footer without duplicated CTA band */}
      <SiteFooter showCTA={false} />
    </main>
  );
}
