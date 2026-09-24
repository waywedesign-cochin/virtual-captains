"use client";

import React, { useState } from "react";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import { HeroSection } from "./components/HeroSection";
import { PartnerLogos } from "./components/PartnerLogos";
import { PartnerModal } from "./components/PartnerModal";
import { PARTNERSHIP_MODELS } from "./data/partnerships";
import { PartnershipModel } from "./types";

export default function PartnerPage() {
  const [models] = useState<PartnershipModel[]>(PARTNERSHIP_MODELS);
  const [selectedModel, setSelectedModel] = useState<PartnershipModel | null>(null);

  return (
    <div className="min-h-screen bg-[#040507] text-white flex flex-col selection:bg-[#38bdf8] selection:text-black font-sans antialiased overflow-x-clip">
      {/* Site Navigation Header */}
      <Navbar />

      {/* Main Experience (Full width, seamless with Navbar) */}
      <main className="w-full flex flex-col">
        <HeroSection
          models={models}
          onSelectModel={(model) => setSelectedModel(model)}
        />
        <PartnerLogos />
      </main>

      {/* Site Footer (CTA Book a Call hidden) */}
      <SiteFooter showCTA={false} />

      {/* Partnership Application Modal */}
      <PartnerModal
        model={selectedModel}
        onClose={() => setSelectedModel(null)}
      />
    </div>
  );
}
