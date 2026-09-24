import React from "react";
import { motion } from "motion/react";
import { RollingButton } from "./RollingButton";

interface CTASectionProps {
  onBookCall: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onBookCall }) => {
  return (
    <section className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-4xl sm:rounded-[36px] overflow-hidden bg-linear-to-br from-[#060b18] via-[#091533] to-[#04060c] text-white border border-[#1d4ed8]/30 shadow-[0_24px_64px_-16px_rgba(29,78,216,0.35)] flex flex-col"
      >
        {/* Background Looping Video */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <video
            src="/assets/blog/cta_video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-45 mix-blend-screen scale-105"
          />
          {/* Subtle black and blue vignette overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-[#04060c] via-[#091533]/50 to-transparent" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#070b14]/40 to-[#04060c]/85" />
        </div>

        {/* Ambient Blue Glowing Orbs */}
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-[#1d4ed8]/35 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-[#0284c7]/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#3b82f6]/15 rounded-full blur-[90px] pointer-events-none" />

        {/* Dotted Grid Pattern Effect Inside */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(147, 197, 253, 0.45) 1.25px, transparent 1.25px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Content Body */}
        <div className="relative z-10 p-8 sm:p-14 lg:p-16 flex flex-col items-start max-w-2xl space-y-6">
          {/* Blue Neon Indicator Tag */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#1d4ed8]/15 backdrop-blur-md border border-[#38bdf8]/30 text-[11px] font-mono tracking-wider uppercase text-[#93c5fd] shadow-[0_0_15px_rgba(29,78,216,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <span>Idea → Reality</span>
          </div>

          {/* Heading with Blue-White Gradient Accent */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-white tracking-tight leading-[1.12]">
            Got a great idea you <br />
            <span className="bg-linear-to-r from-white via-[#bae6fd] to-[#38bdf8] bg-clip-text text-transparent">
              want to bring to life?
            </span>
          </h2>

          {/* Glowing CTA Button */}
          <div className="pt-2">
            <RollingButton
              text="Book a call"
              onClick={onBookCall}
              variant="white"
              size="lg"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
