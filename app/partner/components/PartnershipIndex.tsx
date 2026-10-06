"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PartnershipModel } from "../types";

interface PartnershipIndexProps {
  models: PartnershipModel[];
  onSelectModel: (model: PartnershipModel) => void;
}

/**
 * "Partnership Index" — an editorial, magazine-style list instead of cards.
 * Each partnership is a full-width row led by an enormous outlined verb
 * (EDUCATE / BUILD / AMPLIFY). The open row fills its verb with its own
 * accent colour and unfolds its story + CTA; the others stay as quiet
 * outlined lines. Hover opens a row on desktop; tap opens it on touch.
 */
export const PartnershipIndex: React.FC<PartnershipIndexProps> = ({ models, onSelectModel }) => {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="partnership-index"
      aria-labelledby="partnership-index-title"
      className="relative w-full overflow-hidden bg-[#020B25] px-4 pt-20 pb-12 sm:px-8 sm:pt-28 sm:pb-16 lg:px-12"
    >
      {/* Ambient glow that follows the open row's accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-24 h-[30rem] w-[30rem] rounded-full bg-[#1d4ed8]/20 blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-372">
        {/* Section header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
              Choose Your Collaboration Model
            </p>
            <h2
              id="partnership-index-title"
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white"
            >
              Three Ways to Grow With SalesX
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            Educate the next generation, build your sales force, or amplify your brand — pick the
            partnership that fits.
          </p>
        </div>

        {/* The index */}
        <ul className="mt-12 sm:mt-16 border-b border-white/10">
          {models.map((m, i) => {
            const isOpen = open === i;
            return (
              <li
                key={m.id}
                className="relative border-t border-white/10"
                onMouseEnter={() => setOpen(i)}
              >
                {/* Accent line that grows across the top edge of the open row */}
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ scaleX: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 -top-px h-px origin-left bg-linear-to-r from-[#38bdf8] via-[#2563eb] to-transparent"
                />

                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-expanded={isOpen}
                  aria-controls={`partner-panel-${m.id}`}
                  className="group flex w-full cursor-pointer items-center gap-4 py-5 text-left sm:gap-8 sm:py-7"
                >
                  <span className="w-7 shrink-0 font-sans tabular-nums text-[11px] sm:w-28 sm:text-xs uppercase tracking-[0.2em] text-white/45">
                    {m.number}
                    <span className="hidden sm:inline"> — {m.verb}</span>
                  </span>

                  {/* The giant verb: outlined when closed, filled when open */}
                  <span
                    className={`relative min-w-0 flex-1 truncate bg-clip-text pb-[0.06em] font-black uppercase leading-[0.9] tracking-[-0.04em] text-transparent text-[clamp(2.75rem,11vw,9.5rem)] transition-[background-image,-webkit-text-stroke-color] duration-500 ${
                      isOpen
                        ? "bg-linear-to-r from-white via-[#7dd3fc] to-[#38bdf8]"
                        : "group-hover:[-webkit-text-stroke-color:rgba(125,211,252,0.6)]"
                    }`}
                    style={{ WebkitTextStroke: `1.5px ${isOpen ? "transparent" : "rgba(255,255,255,0.25)"}` }}
                  >
                    {m.verb}
                  </span>

                  {/* Arrow disc turns to point down into the open row */}
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border sm:h-16 sm:w-16"
                    style={{
                      borderColor: isOpen ? "#38bdf8" : "rgba(255,255,255,0.2)",
                      color: isOpen ? "#38bdf8" : "rgba(255,255,255,0.6)",
                      backgroundColor: isOpen ? "rgba(56,189,248,0.1)" : "transparent",
                    }}
                  >
                    <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`partner-panel-${m.id}`}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-8 sm:pb-10 lg:grid-cols-12 lg:gap-10 lg:pl-36">
                        <div className="lg:col-span-5">
                          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#38bdf8]">
                            {m.title}
                          </p>
                          <h3 className="mt-3 text-2xl sm:text-3xl lg:text-[2rem] font-medium leading-tight tracking-tight text-white">
                            {m.headline}
                          </h3>
                        </div>
                        <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
                          <p className="text-sm sm:text-base leading-relaxed text-slate-300">{m.description}</p>
                          <button
                            type="button"
                            onClick={() => onSelectModel(m)}
                            className="group/cta inline-flex min-h-12 w-fit cursor-pointer items-center gap-3 rounded-full bg-[#e7ff3d] px-6 text-sm sm:text-base font-semibold text-[#020B25] shadow-[0_0_28px_rgba(231,255,61,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d8f030]"
                          >
                            {m.ctaText}
                            <span aria-hidden="true" className="transition-transform duration-300 group-hover/cta:translate-x-1">
                              →
                            </span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
