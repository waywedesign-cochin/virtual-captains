"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "./data";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-black/3 bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-350 items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Virtual Captains home">
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
              <path d="M16 2 28.5 8.2v9.6c0 8.2-5.7 11.3-12.5 12.2C9.2 29.1 3.5 26 3.5 17.8V8.2L16 2Z" fill="#2F4CDD" />
              <path d="M16 6.4 24.4 10.4v7.4c0 6-3.8 8.1-8.4 9-4.6-.9-8.4-3-8.4-9v-7.4L16 6.4Z" fill="#fff" />
            </svg>
            <span className="hidden text-[15px] font-bold leading-[1.05] text-[#1B2559] sm:block">
              Virtual
              <br />
              Captains
            </span>
          </Link>

          <button
            type="button"
            className="whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#1B2559] shadow-sm transition-shadow hover:shadow-md"
          >
            Organisations
          </button>
        </div>

        <nav className="hidden items-center gap-8 text-[15px] text-[#3C4257] lg:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="group relative py-1">
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#2F4CDD] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#book-a-call"
            className="hidden whitespace-nowrap rounded-full bg-[#2F4CDD] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(47,76,221,0.6)] transition-colors hover:bg-[#2540c2] sm:inline-block"
          >
            Book A Call
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-[#1B2559] lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-black/5 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[15px] text-[#3C4257] hover:bg-black/3"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="#book-a-call"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-[#2F4CDD] px-5 py-2.5 text-center text-sm font-semibold text-white"
              >
                Book A Call
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
