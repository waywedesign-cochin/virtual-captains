"use client";

import { motion } from "framer-motion";
import FloatingAvatars from "./FloatingAvatars";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F3F7] via-white to-white px-5 pb-14 pt-6 sm:px-8 lg:px-12 lg:pb-20">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-10 lg:relative lg:min-h-[600px] lg:justify-center lg:gap-0">
        {/* Left blurb — stacked on mobile, pinned left on desktop */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
          className="order-2 max-w-sm text-center lg:absolute lg:left-0 lg:top-1/2 lg:order-none lg:max-w-[210px] lg:-translate-y-1/2 lg:text-left"
        >
          <p className="text-[13px] font-extrabold uppercase leading-snug tracking-wide">
            <span className="text-[#2F4CDD]">Four Programmes, </span>
            <span className="text-[#E07C4F]">One Operating Partner.</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
            From induction to audit to outbound, Virtual Captains sits inside
            your revenue motion, not on the sidelines.
          </p>
        </motion.div>

        {/* Centre: radar composition + headline */}
        <div className="order-1 relative w-full lg:order-none">
          <FloatingAvatars />

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
              className="text-4xl font-extrabold leading-[1.08] text-[#2F4CDD] sm:text-5xl lg:text-[3.4rem]"
            >
              From Induction
              <br />
              to Revenue
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.35 }}
              className="mt-3 text-sm font-medium text-[#4B5162] sm:text-base"
            >
              Total Sales Floor Management
            </motion.p>
          </div>
        </div>

        {/* Right CTAs — stacked on mobile, pinned right on desktop */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.25 }}
          className="order-3 flex gap-3 lg:absolute lg:right-0 lg:top-1/2 lg:order-none lg:-translate-y-1/2 lg:flex-col lg:items-end"
        >
          <button
            type="button"
            className="rounded-full border border-black/15 bg-white px-6 py-2.5 text-sm font-semibold text-[#1B2559] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Demo
          </button>
          <button
            type="button"
            className="rounded-full bg-[#3A5BE0] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(58,91,224,0.65)] transition hover:-translate-y-0.5 hover:bg-[#2f4cd2]"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  );
}
