"use client";

import { useEffect, useState } from "react";
import BackToTop from "../common/BackToTop";

/**
 * Floating back-to-top arrow pinned to the bottom-right corner. Fades in once
 * the visitor has scrolled past the first screen.
 */
export default function SalesXScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed right-4 bottom-4 z-50 transition-all duration-300 sm:right-6 sm:bottom-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <BackToTop className="bg-[#071233]/70 shadow-[0_8px_24px_rgba(0,0,0,0.45)]" />
    </div>
  );
}
