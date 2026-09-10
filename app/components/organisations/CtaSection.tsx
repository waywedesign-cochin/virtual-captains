"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function CtaSection() {
  const blobRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;

      gsap.to("[data-blob]", {
        y: -18,
        x: 10,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.6,
      });
    },
    { scope: blobRef }
  );

  return (
    <section
      id="enroll"
      className="relative overflow-hidden px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="text-center lg:text-left"
        >
          <p className="text-sm font-semibold text-[#8A8FA3]">For Organisations</p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight text-[#1B2559] sm:text-4xl lg:text-[2.75rem]">
            Talk to Us About
            <br />
            Your Next Quarter.
          </h2>
          <button
            type="button"
            className="mt-7 rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold text-[#1B2559] transition hover:-translate-y-0.5 hover:bg-black/[0.03] hover:shadow-md"
          >
            Book a Discovery Call
          </button>
        </motion.div>

        <div
          ref={blobRef}
          className="relative mx-auto aspect-square w-full max-w-[360px]"
        >
          <div
            data-blob
            aria-hidden
            className="absolute -left-4 top-2 h-52 w-52 rounded-full bg-[#3A5BE0]/50 blur-[70px]"
          />
          <div
            data-blob
            aria-hidden
            className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-[#6FE0A8]/45 blur-[70px]"
          />

          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="absolute inset-0 m-auto grid h-52 w-52 place-items-center rounded-full border border-white/50 bg-white/25 text-lg font-semibold text-white shadow-2xl backdrop-blur-xl sm:h-60 sm:w-60"
          >
            Enroll Now
          </motion.button>
        </div>
      </div>
    </section>
  );
}
