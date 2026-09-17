"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import BookACallModal from "../home/BookACallModal";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function CallToAction() {
  const blobRef = useRef<HTMLDivElement>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

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
    <>
      <section
        id="book-a-call"
        className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28 bg-[#040507]"
      >
        {/* Deep ambient background lights */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(28,79,192,0.18), transparent 70%)",
          }}
        />

        {/* Container aligned strictly with Navbar */}
        <div className="relative z-10 w-full max-w-372 mx-auto">
          <div className="relative overflow-hidden rounded-4xl border border-white/12 bg-linear-to-br from-[#0c1326]/90 via-[#070b16]/95 to-[#040507] p-8 sm:p-12 lg:p-16 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
            {/* Background subtle mesh inside the card */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: easeOut }}
                className="text-center lg:text-left"
              >
                <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
                  Prefer To Talk It Through?
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-tight text-white">
                  Book a 20-Minute <br />
                  <span className="italic text-[#8fd0ff] drop-shadow-[0_0_24px_rgba(143,208,255,0.4)]">
                    Strategy Call.
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-white/70 mx-auto lg:mx-0">
                  No pitch deck, no pressure — just a straight conversation about
                  where your sales floor is losing time and where Virtual Captains
                  can plug in.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e7ff3d] hover:bg-[#d8f030] px-8 py-3.5 text-sm font-bold text-[#0a0b0d] tracking-wide shadow-[0_0_24px_rgba(231,255,61,0.35)] transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98"
                  >
                    <span>Schedule 20-Min Strategy Call</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </motion.div>

              {/* Visual Orb & Interactive Centerpiece */}
              <div
                ref={blobRef}
                className="relative mx-auto aspect-square w-full max-w-80 sm:max-w-90"
              >
                <div
                  data-blob
                  aria-hidden
                  className="absolute -left-4 top-2 h-56 w-56 rounded-full bg-[#1c4fc0]/40 blur-[80px]"
                />
                <div
                  data-blob
                  aria-hidden
                  className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#38bdf8]/35 blur-[80px]"
                />
                <div
                  data-blob
                  aria-hidden
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-36 w-36 rounded-full bg-[#e7ff3d]/20 blur-[60px]"
                />

                <motion.button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.6, ease: easeOut }}
                  className="absolute inset-0 m-auto flex flex-col items-center justify-center gap-2 rounded-full border border-white/30 bg-white/8 backdrop-blur-2xl p-6 text-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.2)] transition-all duration-300 hover:border-[#e7ff3d]/60 hover:shadow-[0_0_35px_rgba(231,255,61,0.25)] h-52 w-52 sm:h-60 sm:w-60 cursor-pointer"
                >
                  <span className="h-3 w-3 rounded-full bg-[#e7ff3d] animate-pulse shadow-[0_0_10px_#e7ff3d]" />
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                    Book A Call
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#38bdf8]">
                    20 Min Strategy
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookACallModal
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}
