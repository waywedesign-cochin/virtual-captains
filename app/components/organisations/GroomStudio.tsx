"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { groomCards, programTabs } from "./data";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function GroomStudio() {
  const [activeTab, setActiveTab] = useState<(typeof programTabs)[number]>(
    programTabs[2]
  );

  return (
    <section id="program" className="px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[380px_1fr] lg:gap-10">
        {/* Left: Groom Studio card */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6C88F5] to-[#3450D8] p-8 text-white shadow-[0_24px_48px_-16px_rgba(52,80,216,0.5)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          />

          <h2 className="text-2xl font-bold">Groom Studio</h2>
          <span className="mt-2 block h-[3px] w-10 rounded-full bg-[#8FE07A]" />

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-white/15 px-3 py-1 font-medium">
              First-Time Induction &amp; Orientation
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              Offline
            </span>
          </div>

          <h3 className="mt-5 text-xl font-bold leading-snug sm:text-2xl">
            Every New Hire Prepared Before Their First Call
          </h3>

          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Groom Studio is a first-of-its-kind offline sales agent onboarding
            programme. Induction, orientation, brand immersion, and
            first-week roleplay come together in-studio, so every new hire
            is ready for the floor before their first live call.
          </p>

          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="mt-7 flex items-center gap-3 rounded-full bg-[#8FE07A] py-1.5 pl-1.5 pr-5 text-sm font-semibold text-[#134A1E] shadow-lg"
          >
            <span className="rounded-full bg-white px-4 py-1.5 font-bold text-[#1B2559]">
              Book
            </span>
            Groom Studio Session
          </motion.button>
        </motion.div>

        {/* Right: tabs + programme cards */}
        <div>
          <div className="flex flex-wrap items-center justify-center gap-6 pb-6 text-sm font-medium text-[#8A8FA3] sm:gap-10 lg:justify-start">
            {programTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="relative py-1 transition-colors"
              >
                <span className={activeTab === tab ? "text-[#1B2559]" : undefined}>
                  {tab}
                </span>
                {activeTab === tab && (
                  <motion.span
                    layoutId="program-tab-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-[#2F4CDD]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {groomCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: easeOut, delay: i * 0.15 }}
                className={`flex flex-col gap-4 overflow-hidden rounded-[24px] bg-gradient-to-br p-5 text-white sm:flex-row sm:items-center ${card.gradient}`}
              >
                <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-24">
                  <Image
                    src={card.image}
                    alt={`${card.title} session in progress`}
                    fill
                    sizes="(min-width: 640px) 96px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold">{card.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/85">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
