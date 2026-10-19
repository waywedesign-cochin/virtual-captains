"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import BookACallModal from "./BookACallModal";

/**
 * SalesX launch poster popup for the home page.
 *
 * Opens once the visitor scrolls past the hero (#home), never over it.
 * Shown at most once per page load: after it's closed it stays closed until
 * a refresh (state lives in memory only, nothing persisted).
 * "Join" swaps the poster for the event form (BookACallModal, mode "event").
 */
export default function LaunchEventPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false); // drives the enter transition
  const [formOpen, setFormOpen] = useState(false);
  const shown = useRef(false);

  // Trigger: hero has scrolled up out of the viewport
  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => {
      if (shown.current) return;
      if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
        shown.current = true;
        setOpen(true);
        io.disconnect();
      }
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setVisible(true));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    // Same scroll lock as BookACallModal
    const lenis = window.__lenis;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      setVisible(false);
      window.removeEventListener("keydown", onKeyDown);
      lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="SalesX Platform launch invitation"
          >
            <div
              className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setOpen(false)}
            />

            <div
              data-lenis-prevent
              className={`relative z-10 flex w-full max-w-[min(26rem,calc((100dvh-9rem)*0.8))] flex-col items-center transition-all duration-300 ease-out ${
                visible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-4 scale-95 opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute -right-2 -top-2 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-black/70 shadow-lg transition-colors hover:text-black sm:-right-3 sm:-top-3"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-none stroke-current stroke-2"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>

              <Image
                src="/home/salesx-launch-poster.jpeg"
                alt="Launching SalesX Platform: the AI-enabled human engine. Inaugurated by Shri. P. K. Kunhalikutty. Only 40 invites for founders. 24 October 2026, Calicut."
                width={1080}
                height={1350}
                sizes="(max-width: 640px) 90vw, 416px"
                className="h-auto w-full rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]"
                priority
              />

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setFormOpen(true);
                }}
                className="mt-4 w-full cursor-pointer rounded-full bg-[#3478e5] py-3 text-[14px] font-medium text-white shadow-[0_8px_20px_-8px_rgba(52,120,229,0.6)] transition-colors hover:bg-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Join the Launch
              </button>
            </div>
          </div>,
          document.body,
        )}

      <BookACallModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        mode="event"
      />
    </>
  );
}
