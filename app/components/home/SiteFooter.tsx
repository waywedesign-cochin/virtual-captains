"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BookACallModal from "./BookACallModal";

gsap.registerPlugin(ScrollTrigger);

/**
 * The closing "Book a Call" band plus the site footer. The CTA pill carries
 * the cursor-follow fill used on the hero buttons so the page ends on the
 * same interaction language it opened with, and opens a dummy booking-form
 * modal on click. The footer itself is a short pinned sequence: the
 * wordmark shows big and alone first, then on further scroll shrinks away
 * while the actual footer content (nav buttons, legal row) slides in from
 * the side to replace it.
 */
export default function SiteFooter() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const ctaSectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const ctaFillRef = useRef<HTMLSpanElement>(null);
  const ctaLabelRef = useRef<HTMLSpanElement>(null);

  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const legalRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(ctaRef.current, { opacity: 0, y: 26, scale: 0.96 });
      gsap.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: "top 78%",
          once: true,
        },
      });

      const button = ctaRef.current;
      const fill = ctaFillRef.current;
      if (!button || !fill) return;

      const grow = (x: number, y: number) => {
        const rect = button.getBoundingClientRect();
        const size = Math.hypot(rect.width, rect.height) * 2.2;
        gsap.set(fill, {
          width: size,
          height: size,
          left: x,
          top: y,
          xPercent: -50,
          yPercent: -50,
        });
        gsap.to(fill, { scale: 1, duration: 0.6, ease: "power3.out", overwrite: true });
        gsap.to(ctaLabelRef.current, {
          color: "#0a0b0f",
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
      };

      const shrink = (x: number, y: number) => {
        gsap.set(fill, { left: x, top: y });
        gsap.to(fill, { scale: 0, duration: 0.4, ease: "power2.in", overwrite: true });
        gsap.to(ctaLabelRef.current, {
          color: "#101010",
          duration: 0.3,
          ease: "power2.in",
          overwrite: true,
        });
      };

      const onEnter = (e: PointerEvent) => {
        const rect = button.getBoundingClientRect();
        grow(e.clientX - rect.left, e.clientY - rect.top);
      };
      const onLeave = (e: PointerEvent) => {
        const rect = button.getBoundingClientRect();
        shrink(e.clientX - rect.left, e.clientY - rect.top);
      };

      button.addEventListener("pointerenter", onEnter);
      button.addEventListener("pointerleave", onLeave);

      gsap.set(wordmarkRef.current, { opacity: 0, y: 30, scale: 1 });
      gsap.set([actionsRef.current, legalRef.current], { opacity: 0, x: 70 });

      // Pinned two-phase handoff: the wordmark shows big and alone, then
      // shrinks/fades away as the real footer content slides in from the
      // side to take its place — not a plain simultaneous fade-up.
      gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.5,
        },
      })
        .to(wordmarkRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        })
        .to({}, { duration: 0.25 }) // hold on the big wordmark for a beat
        .to(wordmarkRef.current, {
          opacity: 0,
          scale: 0.85,
          duration: 0.3,
          ease: "power2.in",
        })
        .to(
          [actionsRef.current, legalRef.current],
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          },
          "<0.05",
        );

      return () => {
        button.removeEventListener("pointerenter", onEnter);
        button.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ctaSectionRef },
  );

  return (
    <>
      {/* ================= BOOK A CALL ================= */}
      <section
        ref={ctaSectionRef}
        className="relative -mt-px z-10 w-full overflow-hidden bg-white px-6 py-[clamp(56px,11vh,130px)] text-center sm:px-10"
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.13) 0.65px, transparent 0.65px)",
            backgroundSize: "9px 9px",
          }}
        />
        <button
          ref={ctaRef}
          type="button"
          onClick={() => setIsBookingOpen(true)}
          className="relative isolate z-10 cursor-pointer overflow-hidden rounded-full border border-black/25 px-[clamp(38px,7vw,90px)] py-[clamp(14px,2.4vh,26px)] font-serif text-[clamp(1.5rem,3.4vw,2.75rem)] leading-none"
        >
          <span
            ref={ctaFillRef}
            className="pointer-events-none absolute z-0 rounded-full bg-[#e7ff3d]"
            style={{ width: 0, height: 0, transform: "scale(0)" }}
          />
          <span ref={ctaLabelRef} className="relative z-10 text-[#101010]">
            Book a Call
          </span>
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      {/* min-h-svh: this is the last element on the page and gets pinned —
          GSAP can only fully complete a pin on the last page element if its
          own natural (pre-pin) height already exceeds the viewport, since
          there's no later content to supply the extra scrollable room the
          pin's `end` distance needs. Every other pinned section in this
          codebase already relies on the same margin via min-h-svh/h-screen;
          this one just hadn't needed it before the two-phase reveal. */}
      <footer
        ref={footerRef}
        className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden px-6 py-[clamp(48px,9vh,110px)] text-white sm:px-10 lg:px-16"
        style={{
          background:
            "linear-gradient(160deg, #0a1c52 0%, #1544ac 45%, #2f6fe0 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center">
          <div ref={wordmarkRef} className="flex w-full justify-center">
            <Image
              src="/wlogo.png"
              alt="Virtual Captains"
              width={1200}
              height={240}
              // w-[min(1100px,76%)]: sized against the padded container's
              // own width, not the raw viewport (92vw ignored the container's
              // lg:px-16 padding and overflowed past it at lg widths). 76%
              // (not 92%) is deliberate: it leaves enough centering margin
              // that the logo's left edge clears the fixed SideNav's ~160px
              // footprint too — the nav stays bold on "Hiring Partners"
              // through the whole footer, so this isn't just a container-fit
              // problem, it needs real clearance from the page edge.
              className="h-auto w-[min(1100px,92%)] lg:w-[min(1100px,76%)] object-contain"
            />
          </div>

          <div
            ref={actionsRef}
            className="mt-[clamp(28px,5vh,56px)] flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4 px-4"
          >
            <button
              type="button"
              className="w-full sm:w-auto cursor-pointer rounded-full border border-white/45 px-7 py-3 text-[12.5px] font-medium text-white transition-colors hover:bg-white hover:text-[#0a1c52] sm:text-[13.5px]"
            >
              For Individuals
            </button>
            <button
              type="button"
              className="w-full sm:w-auto cursor-pointer rounded-full border border-white/45 px-7 py-3 text-[12.5px] font-medium text-white transition-colors hover:bg-white hover:text-[#0a1c52] sm:text-[13.5px]"
            >
              For Organisations
            </button>
          </div>

          <div
            ref={legalRef}
            className="mt-[clamp(32px,6vh,72px)] flex w-full flex-col items-center gap-3 border-t border-white/15 py-6 text-[11px] text-white/65 sm:flex-row sm:justify-between sm:text-[12px]"
          >
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <p>© All Rights Reserved by Virtual Captains {new Date().getFullYear()}</p>
            <p>
              Built by <span className="text-white/85">Web WeDesign</span>
            </p>
          </div>
        </div>
      </footer>

      <BookACallModal open={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
