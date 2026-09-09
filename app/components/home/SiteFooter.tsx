"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BookACallModal from "./BookACallModal";

gsap.registerPlugin(ScrollTrigger);

/**
 * The closing "Book a Call" band plus the site footer.
 *
 * CTA: cursor-follow fill (same interaction language as the hero buttons),
 * now with a floating-label micro-animation, a subtle idle "breathing"
 * glow, and an arrow that slides in on hover to add a bit of intent.
 *
 * Footer: pinned two-phase handoff — big lone wordmark first, then it
 * shrinks/fades while the real footer content (nav buttons, socials, legal
 * row) slides in from the side. Added: animated gradient mesh background,
 * floating orbs for depth, a magnetic hover effect on the nav buttons, and
 * a top-of-page "back to top" affordance. Fully responsive down to small
 * mobile widths, and everything degrades gracefully under
 * prefers-reduced-motion.
 */
export default function SiteFooter() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const ctaSectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const ctaFillRef = useRef<HTMLSpanElement>(null);
  const ctaLabelRef = useRef<HTMLSpanElement>(null);
  const ctaArrowRef = useRef<HTMLSpanElement>(null);
  const ctaEyebrowRef = useRef<HTMLParagraphElement>(null);

  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const legalRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const backToTopRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(
          [ctaRef.current, wordmarkRef.current, actionsRef.current, legalRef.current],
          { opacity: 1, y: 0, x: 0, scale: 1 },
        );
        return;
      }

      // ---------- CTA band ----------
      gsap.set(ctaEyebrowRef.current, { opacity: 0, y: 14 });
      gsap.set(ctaRef.current, { opacity: 0, y: 26, scale: 0.96 });

      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: "top 78%",
          once: true,
        },
      });
      ctaTl
        .to(ctaEyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .to(
          ctaRef.current,
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
          "-=0.35",
        );

      // idle breathing glow behind the CTA
      gsap.to(ctaRef.current, {
        boxShadow: "0 0 0 14px rgba(231,255,61,0.06)",
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const button = ctaRef.current;
      const fill = ctaFillRef.current;
      const arrow = ctaArrowRef.current;
      if (!button || !fill) return;

      gsap.set(arrow, { x: -8, opacity: 0 });

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
        gsap.to(arrow, {
          x: 0,
          opacity: 1,
          color: "#0a0b0f",
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.to(button, {
          scale: 1.03,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
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
        gsap.to(arrow, {
          x: -8,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          overwrite: true,
        });
        gsap.to(button, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const onEnter = (e: PointerEvent) => {
        const rect = button.getBoundingClientRect();
        grow(e.clientX - rect.left, e.clientY - rect.top);
      };
      const onMove = (e: PointerEvent) => {
        const rect = button.getBoundingClientRect();
        gsap.to(fill, {
          left: e.clientX - rect.left,
          top: e.clientY - rect.top,
          duration: 0.5,
          ease: "power3.out",
        });
      };
      const onLeave = (e: PointerEvent) => {
        const rect = button.getBoundingClientRect();
        shrink(e.clientX - rect.left, e.clientY - rect.top);
      };

      button.addEventListener("pointerenter", onEnter);
      button.addEventListener("pointermove", onMove);
      button.addEventListener("pointerleave", onLeave);

      // ---------- Floating orbs (idle drift) ----------
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: 60,
          y: -40,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: -50,
          y: 50,
          duration: 11,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // ---------- Footer pinned reveal ----------
      // The nav buttons sit absolutely centered in the exact same spot as
      // the wordmark (see the stage wrapper in the JSX below), so the
      // moment the logo has faded out, the links are already sitting right
      // there rather than sliding in from off-screen into empty space.
      gsap.set(wordmarkRef.current, { opacity: 0, y: 30, scale: 1 });
      gsap.set(actionsRef.current, { opacity: 0, scale: 0.9, y: 12 });
      gsap.set(legalRef.current, { opacity: 0, x: 70 });
      gsap.set(backToTopRef.current, { opacity: 0, y: 12 });

      gsap
        .timeline({
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
          duration: 0.28,
          ease: "power2.in",
        })
        .to(
          actionsRef.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.35,
            ease: "back.out(1.6)",
          },
          "<0.08", // starts just after the logo begins vanishing, right in its place
        )
        .to(
          legalRef.current,
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
          ">-0.1",
        )
        .to(
          backToTopRef.current,
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          "<0.1",
        );

      return () => {
        button.removeEventListener("pointerenter", onEnter);
        button.removeEventListener("pointermove", onMove);
        button.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ctaSectionRef },
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ================= BOOK A CALL ================= */}
      <section
        ref={ctaSectionRef}
        className="relative -mt-px z-10 w-full overflow-hidden bg-white px-6 py-[clamp(64px,12vh,150px)] text-center sm:px-10"
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.13) 0.65px, transparent 0.65px)",
            backgroundSize: "9px 9px",
          }}
        />
        {/* soft vignette so the dot grid doesn't feel flat edge-to-edge */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 40%, rgba(255,255,255,0.9) 100%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-[clamp(18px,3vh,32px)]">
          <p
            ref={ctaEyebrowRef}
            className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45 sm:text-[12px]"
          >
            Ready when you are
          </p>

          <button
            ref={ctaRef}
            type="button"
            onClick={() => setIsBookingOpen(true)}
            className="group relative isolate cursor-pointer overflow-hidden rounded-full border border-black/25 px-[clamp(34px,7vw,90px)] py-[clamp(14px,2.4vh,26px)] font-serif text-[clamp(1.4rem,3.4vw,2.75rem)] leading-none transition-colors duration-300 hover:border-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-4"
            aria-label="Book a call with Virtual Captains"
          >
            <span
              ref={ctaFillRef}
              className="pointer-events-none absolute z-0 rounded-full bg-[#e7ff3d]"
              style={{ width: 0, height: 0, transform: "scale(0)" }}
            />
            <span className="relative z-10 inline-flex items-center gap-3">
              <span ref={ctaLabelRef} className="text-[#101010]">
                Book a Call
              </span>
              <span
                ref={ctaArrowRef}
                className="inline-block text-[0.75em]"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </span>
          </button>
        </div>
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
        {/* animated dot mesh, same language as the CTA band above */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* floating gradient orbs for depth */}
        <div
          ref={orb1Ref}
          className="pointer-events-none absolute -left-24 -top-24 z-0 h-[340px] w-[340px] rounded-full opacity-30 blur-3xl sm:h-[420px] sm:w-[420px]"
          style={{
            background:
              "radial-gradient(circle, #e7ff3d 0%, transparent 70%)",
          }}
        />
        <div
          ref={orb2Ref}
          className="pointer-events-none absolute -bottom-32 -right-16 z-0 h-[300px] w-[300px] rounded-full opacity-25 blur-3xl sm:h-[380px] sm:w-[380px]"
          style={{
            background:
              "radial-gradient(circle, #7fb0ff 0%, transparent 70%)",
          }}
        />

        {/* top hairline fade so the pin transition doesn't hard-cut */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-gradient-to-b from-black/10 to-transparent" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center">
          {/* Stage: wordmark and nav buttons occupy the exact same footprint,
              stacked on top of each other, so as the logo fades away the
              links are already sitting right where it was — no dead space,
              no slide-in-from-nowhere. */}
          <div className="relative flex w-full items-center justify-center">
            <div ref={wordmarkRef} className="flex w-full justify-center">
              <Image
                src="/home/logo.png"
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
                className="h-auto w-[min(1100px,92%)] drop-shadow-[0_8px_40px_rgba(0,0,0,0.25)] lg:w-[min(1100px,76%)] object-contain"
                priority={false}
              />
            </div>

            <div
              ref={actionsRef}
              className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 px-4 sm:gap-4"
            >
              <button
                type="button"
                className="cursor-pointer rounded-full border border-white/45 bg-white/5 px-7 py-3 text-[12.5px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0a1c52] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-[13.5px]"
              >
                For Individuals
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-full border border-white/45 bg-white/5 px-7 py-3 text-[12.5px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#0a1c52] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-[13.5px]"
              >
                For Organisations
              </button>
            </div>
          </div>

          <div
            ref={legalRef}
            className="mt-[clamp(32px,6vh,72px)] flex w-full flex-col items-center gap-3 border-t border-white/15 py-6 text-[11px] text-white/65 sm:flex-row sm:justify-between sm:text-[12px]"
          >
            <a
              href="#"
              className="order-2 transition-colors hover:text-white sm:order-1"
            >
              Privacy Policy
            </a>
            <p className="order-1 text-center sm:order-2">
              © All Rights Reserved by Virtual Captains {new Date().getFullYear()}
            </p>
            <p className="order-3">
              Built by <span className="text-white/85">Web WeDesign</span>
            </p>
          </div>
        </div>

        {/* back-to-top affordance, only meaningful once the footer content
            has actually revealed */}
        <button
          ref={backToTopRef}
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="absolute bottom-6 right-6 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#0a1c52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:bottom-8 sm:right-8"
        >
          <span aria-hidden="true">&uarr;</span>
        </button>
      </footer>

      <BookACallModal open={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}