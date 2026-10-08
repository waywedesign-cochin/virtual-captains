"use client";

import { useEffect, useState } from "react";

/**
 * Phones & tablets only (the desktop sidebar keeps Apply Now in view): a
 * bottom bar that slides up once the reader is past the job header, and
 * gets out of the way once the application form is on screen.
 */
export function MobileApplyBar({ title, meta }: { title: string; meta: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const form = document.getElementById("apply");
    const io = form
      ? new IntersectionObserver(
          // hidden while the form is on screen or already scrolled past
          ([entry]) => setFormVisible(entry.isIntersecting || entry.boundingClientRect.top < 0),
          {
            rootMargin: "0px 0px -20% 0px",
          },
        )
      : null;
    if (form) io?.observe(form);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = scrolled && !formVisible;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-300 xl:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-[#38bdf8]/30 bg-[#0a0d16]/90 p-2.5 pl-4 shadow-[0_-10px_40px_rgba(0,0,0,0.6),0_0_30px_-10px_rgba(56,189,248,0.4)] backdrop-blur-xl">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          <p className="truncate text-[11px] text-white/55">{meta}</p>
        </div>
        <a
          href="#apply"
          tabIndex={show ? 0 : -1}
          className="shrink-0 rounded-full bg-[#e7ff3d] px-5 py-2.5 text-sm font-bold text-[#0a0b0d] shadow-[0_0_20px_rgba(231,255,61,0.35)] transition-transform active:scale-95"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
}
