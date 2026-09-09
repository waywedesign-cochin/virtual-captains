"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dummy "Book a Call" form dialog — no backend, just a form that shows a
 * fake confirmation and closes. No modal/dialog pattern existed anywhere
 * else in the codebase, so this is a from-scratch, self-contained
 * implementation: closes on backdrop click, Escape, or the X button, and
 * traps nothing beyond that (a fuller a11y focus-trap can be layered on
 * later if this becomes a permanent fixture rather than a placeholder).
 */
export default function BookACallModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Reset back to the form the next time it's opened.
  useEffect(() => {
    if (open) setSubmitted(false);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-a-call-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-110 max-h-[90vh] overflow-y-auto rounded-2xl border border-black/10 bg-white p-6 sm:p-9 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.45)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3478e5]/10">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 fill-none stroke-[#3478e5] stroke-2"
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="mt-5 font-serif text-2xl text-[#101010]">
              Thanks — we&apos;ll be in touch
            </h3>
            <p className="mt-2 max-w-80 font-sans text-[13px] leading-relaxed text-black/55">
              This is a placeholder confirmation — no call has actually been
              booked yet.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <h3
              id="book-a-call-title"
              className="pr-8 font-serif text-2xl text-[#101010]"
            >
              Book a Call
            </h3>
            <p className="mt-1.5 font-sans text-[13px] text-black/55">
              Dummy form — no submissions are sent anywhere yet.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-black/70">Name</span>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[#3478e5]"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-black/70">Email</span>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  className="rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[#3478e5]"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-black/70">Message</span>
                <textarea
                  rows={3}
                  placeholder="What would you like to talk about?"
                  className="resize-none rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[#3478e5]"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full cursor-pointer rounded-full bg-[#101010] py-3 text-[13.5px] font-medium text-white transition-colors hover:bg-[#3478e5]"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
