import React from "react";
import Image from "next/image";

export default function SalesXShowcase() {
  return (
    <section
      role="region"
      aria-label="SalesX Multi-Perspective Dashboard Preview"
      className="relative pt-6 sm:pt-10 lg:pt-14 pb-16 sm:pb-24 lg:pb-32 overflow-hidden bg-transparent select-none"
    >
      {/* Ambient Deep Blue/Indigo Nebula Glow behind the Dashboards */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] md:w-[850px] lg:w-[1100px] h-[250px] sm:h-[400px] lg:h-[550px] bg-radial from-[#1e40af]/30 via-[#312e81]/15 to-transparent blur-[130px] pointer-events-none -z-10" />

      {/* Subtle Star Particles - Standardized Cosmic Grid Token */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(147, 197, 253, 0.35) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center">
          {/* Main Grouped Dashboards Preview */}
          <div className="relative w-full transition-transform duration-700 ease-out hover:scale-[1.01]">
            <Image
              src="/salesx/groupdashbords.webp"
              alt="SalesX Multi-Perspective Dashboard Preview"
              width={2400}
              height={1440}
              unoptimized
              loading="lazy"
              className="w-full h-auto object-contain select-none drop-shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}