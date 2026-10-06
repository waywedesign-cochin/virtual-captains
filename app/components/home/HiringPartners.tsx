"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DottedBackground from "./DottedBackground";
import { NO_PIN_QUERY, PIN_QUERY } from "./pinQuery";

import { HEADING_REVEAL, HEADING_REVEAL_FROM } from "@/lib/animations/headingReveal";
gsap.registerPlugin(ScrollTrigger);

type Slot = {
  left: number; // percentage from ring left
  top: number; // percentage from ring top
  size: number; // percentage width & height of ring
};

type Partner = {
  name: string;
  logoSrc: string;
  invert?: boolean;
};

/**
 * Fixed bubble positions inside the ring (% of the inner ring). They keep at
 * least ~4% clear between any two bubbles, enough that the 105% hover zoom
 * never makes neighbours touch.
 */
const SLOTS: Slot[] = [
  { left: 51, top: 24, size: 32 }, // top-right (largest)
  { left: 12, top: 37, size: 26 }, // mid-left
  { left: 27, top: 11, size: 22 }, // top
  { left: 27.5, top: 67.5, size: 21 }, // bottom-left
  { left: 55, top: 63, size: 24 }, // bottom-right
];

/**
 * Partner logos (all from public/partners/). Add new partners here — when
 * there are more partners than SLOTS, the circle shows them in "pages": the
 * section pins on desktop and scrolling swaps the logos in place; on
 * phones/tablets the pages cycle on their own.
 */
const PARTNERS: Partner[] = [
  { name: "MoonHive", logoSrc: "/partners/MOONHIV.png" },
  { name: "AHAD", logoSrc: "/partners/AHAD.png" },
  { name: "Skylark", logoSrc: "/partners/SKYLARK.png" },
  { name: "JSR", logoSrc: "/partners/JSR.png", invert: true },
  { name: "Sigma Life Unifirm", logoSrc: "/partners/UNIFIRM.png", invert: true },
  { name: "Sigma Life Unifirm", logoSrc: "/partners/SIGMA-LIFE-UNIFIRM.png" },
  { name: "Bangalore Bioinnovation Centre", logoSrc: "/partners/bbc-logo.png" },
];

const PAGE_COUNT = Math.ceil(PARTNERS.length / SLOTS.length);

/** Partner shown in `slot` on `page` — the last page wraps round to the start
 *  so no bubble is ever left empty. */
const partnerAt = (page: number, slot: number) =>
  PARTNERS[(page * SLOTS.length + slot) % PARTNERS.length];

export default function HiringPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const clusterWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);

  /** Logo swap from page `from` to page `to`, staggered across bubbles. */
  const swap = (tl: gsap.core.Timeline, from: number, to: number, at: string | number) => {
    const q = gsap.utils.selector(sectionRef);
    tl.to(
      q(`[data-page="${from}"]`),
      {
        autoAlpha: 0,
        scale: 0.4,
        rotate: -20,
        filter: "blur(6px)",
        duration: 0.5,
        ease: "power2.in",
        stagger: 0.07,
      },
      at,
    ).fromTo(
      q(`[data-page="${to}"]`),
      { autoAlpha: 0, scale: 0.4, rotate: 20, filter: "blur(6px)" },
      {
        autoAlpha: 1,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "back.out(1.6)",
        stagger: 0.07,
      },
      "<0.3",
    );
  };

  const setupRotation = () => {
    const mm = gsap.matchMedia();
    // Desktop: pin the section and let scroll drive the swaps.
    mm.add(PIN_QUERY, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${(PAGE_COUNT - 1) * 90}%`,
          pin: true,
          scrub: 0.6,
        },
      });
      for (let p = 0; p < PAGE_COUNT - 1; p++) {
        // short hold on each page so a logo set is readable before it swaps
        swap(tl, p, p + 1, p === 0 ? 0.3 : "+=0.4");
      }
      tl.to({}, { duration: 0.3 });
    });
    // Phones/tablets: no pin — cycle the pages on a loop while on screen.
    mm.add(NO_PIN_QUERY, () => {
      const tl = gsap.timeline({ repeat: -1, paused: true });
      for (let p = 0; p < PAGE_COUNT; p++) {
        swap(tl, p, (p + 1) % PAGE_COUNT, "+=2.4");
      }
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    });
  };

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (eyebrowRef.current)
          gsap.set(eyebrowRef.current, { opacity: 1, y: 0 });
        gsap.set([headingRef.current, clusterWrapperRef.current], {
          opacity: 1,
          scale: 1,
          y: 0,
        });
        return;
      }

      if (eyebrowRef.current) {
        gsap.set(eyebrowRef.current, { opacity: 0, y: 15 });
      }

      gsap.set(headingRef.current, {
        ...HEADING_REVEAL_FROM,
        transformOrigin:
          window.matchMedia(PIN_QUERY).matches
            ? "left center"
            : "center center",
      });
      gsap.set(clusterWrapperRef.current, { opacity: 0, scale: 0.94 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      if (PAGE_COUNT > 1) setupRotation();

      tl.to(clusterWrapperRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.85,
        ease: "power3.out",
      });

      // Eyebrow + heading get their own trigger: below lg they sit under the
      // cluster, so tying them to the section top started the zoom before
      // the heading was on screen.
      const headingTl = gsap.timeline({
        scrollTrigger: {
          trigger: eyebrowRef.current ?? headingRef.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      if (eyebrowRef.current) {
        headingTl.to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      headingTl.to(
        headingRef.current,
        {
          ...HEADING_REVEAL,
        },
        eyebrowRef.current ? "-=0.25" : 0,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="partner"
      data-nav-section="Partner"
      data-nav-theme="dark"
      className="relative -mt-px z-10 flex w-full flex-col justify-center overflow-hidden px-5 py-10 sm:py-14 pin:py-28 pin:pl-36 pin:pr-16 text-white sm:px-10"
      style={{
        background:
          "linear-gradient(180deg, #0c318f 0%, #051d5c 40%, #050b24 75%, #040507 100%)",
      }}
    >
      {/* Background Dot Grid */}
      <DottedBackground theme="dark" />

      <div className="relative z-10 mx-auto grid w-full max-w-310 grid-cols-1 items-center gap-12 pin:grid-cols-12 pin:gap-8">
        {/* ---------- LEFT: EXACT MOCKUP CIRCLE CLUSTER ---------- */}
        <div className="flex justify-center pin:col-span-7">
          <div
            ref={clusterWrapperRef}
            className="relative aspect-square w-[min(380px,82vw)] sm:w-[min(430px,80vw)] max-w-full select-none"
          >
            {/* Outer subtle faint boundary ring */}
            <div className="pointer-events-none absolute inset-0 rounded-full border border-white/15" />

            {/* Inner crisp thin boundary ring containing all pods */}
            <div className="absolute inset-[3.5%] rounded-full border border-white/20 bg-white/5 backdrop-blur-[1px]">
              {SLOTS.map((slot, i) => (
                <div
                  key={i}
                  className="group absolute rounded-full overflow-hidden transition-[scale,box-shadow] duration-300 ease-out hover:scale-105 select-none shadow-[0_1px_3px_rgba(255,255,255,0.06)] z-10 hover:shadow-[0_10px_28px_rgba(0,0,0,0.25)] hover:z-30"
                  style={{
                    left: `${slot.left}%`,
                    top: `${slot.top}%`,
                    width: `${slot.size}%`,
                    height: `${slot.size}%`,
                    backgroundColor: "#d9d9d9",
                  }}
                >
                  {Array.from({ length: PAGE_COUNT }, (_, page) => {
                    const partner = partnerAt(page, i);
                    return (
                      <div
                        key={page}
                        data-page={page}
                        title={partner.name}
                        className="absolute inset-0 flex items-center justify-center p-[9%]"
                        style={page === 0 ? undefined : { opacity: 0, visibility: "hidden" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={partner.logoSrc}
                          alt={partner.name}
                          className={`max-h-[72%] max-w-[92%] object-contain transition-all duration-300 group-hover:scale-108 ${
                            partner.invert
                              ? "invert contrast-125 opacity-80 group-hover:opacity-100"
                              : "contrast-105 opacity-90 group-hover:opacity-100"
                          }`}
                          loading="lazy"
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- RIGHT: HEADLINE ---------- */}
        <div className="flex flex-col items-center pin:items-start text-center pin:text-left pin:col-span-5">
          <span
            ref={eyebrowRef}
            className="mb-[clamp(12px,2vh,20px)] block font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/50"
          >
            Our network
          </span>
          <h2
            ref={headingRef}
            className="font-sans text-[clamp(1.75rem,5vw,3.6rem)] pin:text-[clamp(2rem,3.2vw,3.25rem)] font-normal leading-[1.15] text-white"
          >
            {/* Desktop: "Building Better Sales" on one line, "Through
                Partnership" beneath it */}
            <span className="pin:block pin:whitespace-nowrap">
              Building <span className="italic text-[#1d63ed]">Better Sales</span>
            </span>{" "}
            <span className="pin:block">Through Partnership</span>
          </h2>
        </div>
      </div>
    </section>
  );
}

