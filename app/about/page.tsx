import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";

import AboutHero from "../components/about/AboutHero";
import AboutInsideWorld from "../components/about/AboutInsideWorld";
import AboutFounder from "../components/about/AboutFounder";
import AboutMetrics from "../components/about/AboutMetrics";
import AboutPartners from "../components/about/AboutPartners";
import AboutCertifications from "../components/about/AboutCertifications";
import AboutVideoCTA from "../components/about/AboutVideoCTA";
import { getYouTubeVideos } from "@/sanity/queries";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Founded on 16+ years of enterprise sales leadership, Virtual Captains builds sales capability at scale through SalesX simulation training and real-world sales execution.",
  path: "/about",
});

export default async function AboutPage() {
  const videos = await getYouTubeVideos();
  return (
    <main className="min-h-screen bg-[#020B25] text-white selection:bg-[#F3FC00] selection:text-black">
      <Navbar />

      {/*
       * Unified body canvas — all sections live inside one continuous
       * background layer. No borders, no colour breaks, no separation.
       */}
      <div className="relative z-10 bg-[#020B25] overflow-x-clip">
        {/* Continuous subtle dot grid across the entire About page, hero
            included, so no section reads as a separate band */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.065) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

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

        {/* 7. Video & audience paths: YouTube video + Learner / Business buttons */}
        <AboutVideoCTA initialVideos={videos} />

        {/* Blend the page navy into the footer's near-black so the hand-off
            has no visible colour edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative z-0 h-12 sm:h-20 lg:h-40 bg-linear-to-b from-transparent to-[#040507]"
        />
      </div>

      {/* Home-page footer without the "Book a Call" band; theme kept
          light-blue explicitly, since turning the band off would otherwise
          switch the footer to its plain black variant */}
      <SiteFooter showCTA={false} theme="light-blue" />
    </main>
  );
}
