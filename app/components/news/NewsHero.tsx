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

export function NewsHero() {
  return (
    <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 max-w-5xl mx-auto px-4 text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-5"
      >
        <motion.div
          variants={wordVariants}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#38bdf8]/30 bg-linear-to-r from-[#1d4ed8]/30 to-[#38bdf8]/10 text-[11px] font-semibold tracking-widest uppercase text-[#7dd3fc]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
          Virtual Captains News
        </motion.div>

        <h1 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-[1.08]">
          <span className="block text-white">
            <motion.span
              variants={wordVariants}
              className="inline-block mr-3 sm:mr-4"
            >
              News,
            </motion.span>
            <motion.span variants={wordVariants} className="inline-block">
              Releases
            </motion.span>
          </span>
          <span className="block">
            <motion.span
              variants={wordVariants}
              className="inline-block mr-3 sm:mr-4 text-white"
            >
              &amp;
            </motion.span>
            <motion.span
              variants={wordVariants}
              className="inline-block bg-linear-to-r from-[#38bdf8] via-[#60a5fa] to-white bg-clip-text text-transparent"
            >
              Milestones
            </motion.span>
          </span>
        </h1>

        <motion.p
          variants={wordVariants}
          className="text-sm sm:text-base md:text-lg text-sky-100/75 max-w-xl mx-auto leading-relaxed pt-2"
        >
          Product releases, partnerships, and milestones from Virtual Captains
          and SalesX, newest first.
        </motion.p>
      </motion.div>
    </section>
  );
}
