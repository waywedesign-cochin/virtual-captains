import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  MessageCircle,
} from "lucide-react";
import { RollingButton } from "./RollingButton";

/** Quick links shown on the right of the CTA card. */
const QUICK_LINKS = [
  {
    icon: CalendarDays,
    title: "Upcoming Events",
    text: "Be part of our next session",
    href: "/news-and-updates",
  },
  {
    icon: FileText,
    title: "Explore Our Programs",
    text: "Turn sales capability into real impact",
    href: "/programs",
  },
  {
    icon: MessageCircle,
    title: "Have a Question?",
    text: "Our team is here to help",
    href: "/contact",
  },
];

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

        {/* Content Body: pitch on the left, quick links on the right */}
        <div className="relative z-10 grid grid-cols-1 gap-10 p-8 sm:p-14 lg:grid-cols-2 lg:gap-0 lg:p-16">
          <div className="flex flex-col items-center space-y-6 text-center lg:items-start lg:pr-12 lg:text-left">
            {/* Blue Neon Indicator Tag */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#1d4ed8]/15 backdrop-blur-md border border-[#38bdf8]/30 text-[11px] font-mono tracking-wider uppercase text-[#93c5fd] shadow-[0_0_15px_rgba(29,78,216,0.25)]">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse shadow-[0_0_8px_#38bdf8]" />
              <span>Idea → Reality</span>
            </div>

            {/* Heading with Blue-White Gradient Accent */}
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-white tracking-tight leading-[1.12]">
              Got a Great Idea You <br />
              <span className="bg-linear-to-r from-white via-[#bae6fd] to-[#38bdf8] bg-clip-text text-transparent">
                Want to Bring to Life?
              </span>
            </h2>

            <p className="max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
              Whether it&apos;s a new programme, a partnership or a sales
              challenge, talk to a Captain and turn it into a plan that
              delivers.
            </p>

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

          {/* Quick links */}
          <ul className="flex flex-col justify-center divide-y divide-white/10 border-t border-white/10 pt-2 lg:border-t-0 lg:border-l lg:pl-12 lg:pt-0">
            {QUICK_LINKS.map(({ icon: Icon, title, text, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="group flex items-center gap-4 py-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8] sm:gap-5"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#38bdf8]/25 bg-[#1d4ed8]/15 text-[#93c5fd] transition-colors group-hover:border-[#38bdf8]/60 group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-medium text-white sm:text-lg">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-sm text-white/55">
                      {text}
                    </span>
                  </span>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-white/60 transition-all group-hover:translate-x-1 group-hover:text-white"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
};
