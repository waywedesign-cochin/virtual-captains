"use client";

import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

/** Editorial hero: centred on phones/tablets, left-aligned on desktop. */
export function NewsHero() {
  return (
    <section className="relative w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 pt-14 pb-10 sm:pt-20 sm:pb-12 text-center lg:text-left">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-5"
      >
        <motion.div
          variants={wordVariants}
          className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]" />
          Insights That Drive Progress
          <span className="hidden h-px w-10 bg-[#38bdf8]/60 sm:block" />
        </motion.div>

        <h1 className="font-sans font-bold text-[40px] sm:text-6xl lg:text-7xl xl:text-[84px] tracking-[-0.03em] leading-[1.05]">
          <motion.span
            variants={wordVariants}
            className="inline-block text-white"
          >
            News, Releases &amp;
          </motion.span>{" "}
          <motion.span
            variants={wordVariants}
            className="inline-block bg-linear-to-r from-[#38bdf8] to-[#3b82f6] bg-clip-text text-transparent"
          >
            Milestones
          </motion.span>
        </h1>

        <motion.p
          variants={wordVariants}
          className="max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base md:text-lg leading-relaxed text-white/70"
        >
          Product updates, partnerships and company milestones from Virtual
          Captains and SalesX. Real progress, real impact.
        </motion.p>
      </motion.div>
    </section>
  );
}
