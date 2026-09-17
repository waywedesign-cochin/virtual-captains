"use client";

import React from "react";
import Image from "next/image";

export default function SalesXShowcase() {
  return (
    <section className="relative pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-24 lg:pb-32 overflow-hidden bg-[#000207]">
      {/* Ambient Deep Blue/Indigo Glow behind the Image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 sm:w-240 lg:w-300 h-80 sm:h-120 bg-radial from-[#1e40af]/35 via-[#312e81]/20 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Subtle Star Particles */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(147, 197, 253, 0.4) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center">
          {/* Main Grouped Dashboards Preview */}
          <div className="relative w-full">
            <Image
              src="/salesx/groupdashbords.webp"
              alt="SalesX Dashboard Preview"
              width={2400}
              height={1440}
              unoptimized
              priority
              className="w-full h-auto object-contain select-none drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-[1.01]"
            />

            {/* Bottom Gradient Fade for Deep, Smooth Screen Blending */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-44 sm:h-60 md:h-80 lg:h-96 z-10"
              style={{
                background:
                  "linear-gradient(to top, #000207 0%, #000207 22%, rgba(0, 2, 7, 0.92) 48%, rgba(0, 2, 7, 0.45) 76%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
