"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * `top`/`right` position the dot's own CENTER on the arc curve below (a
 * quadratic whose control point sits at the vertical midpoint, so y is
 * linear in t: `top` is t). `right` is the curve's x-distance from the
 * container's right edge PLUS the dot's own radius — the dot markup is the
 * last child in a `[label, dot]` flex row positioned via `right`, so `right`
 * alone would place the row's (and therefore the dot's) right *edge* on the
 * curve, not the dot's center; +5px (the resting 8px dot's radius) corrects
 * that. Keep both in sync if the path or dot sizes change.
 */
const STAGES = [
  {
    label: "AI real-time rehearsal",
    top: "15%",
    right: "51px",
    illustration: "/home/approach1.svg",
    illustrationAlt:
      "A robot hands off to a walking professional, who steps through a portal to a colleague extending a handshake",
    subheading: "The approach is built on repetition and evaluation.",
    paragraph:
      "AI powers the repetition through real-time rehearsal systems, generating infinite scenarios so reps walk into every real conversation already warmed up.",
  },
  {
    label: "Instant feedback",
    top: "50%",
    right: "115px",
    // PLACEHOLDER illustration (public/home/approach2.svg) — swap once a
    // real matching illustration exists.
    illustration: "/home/approach2.svg",
    illustrationAlt:
      "A speaking figure's feedback flows into a live meter and a stopwatch, signaling an instant read on the rehearsal",
    subheading: "Every rehearsal scores itself while it's still happening.",
    paragraph:
      "PLACEHOLDER COPY — real-time signal on tone, pacing and objection handling, surfaced the moment it happens rather than after the fact.",
  },
  {
    label: "Human evaluation",
    top: "85%",
    right: "51px",
    // PLACEHOLDER illustration (public/home/approach3.svg) — swap once a
    // real matching illustration exists.
    illustration: "/home/approach3.svg",
    illustrationAlt:
      "Two people reviewing a scored checklist together across a table",
    subheading: "A coach closes the loop the software can't.",
    paragraph:
      "PLACEHOLDER COPY — human evaluators review the toughest calls, applying judgment no scoring model can replace.",
  },
];

const ARC_BAND = "h-[clamp(260px,52vh,460px)] w-[300px]";

/**
 * "Simulated by AI / Validated by humans" — the section that follows the
 * Roleplay/TwoAudiences chapter. Three stages (illustration + subheading +
 * paragraph, all absolutely stacked so they share one footprint) crossfade
 * in lockstep with the decorative right-edge arc's highlighted dot, all
 * driven by the same `activeArc` scroll-progress state — dot and content
 * always change in the same React render, so they can't drift out of sync
 * or show two stages at once.
 *
 * The section is pinned, so everything has to fit one viewport: spacing and
 * type use vh-aware clamps, and the illustration is capped by `90vh` of width
 * (its aspect is ~3:1, so that lands it at ~30vh tall) and by
 * `100vw - 560px` so it never runs into the arc.
 */
export default function OurApproach() {
  const sectionRef = useRef<HTMLElement>(null);

  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);

  const illustrationRef = useRef<HTMLImageElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const [activeArc, setActiveArc] = useState(0);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const mm = gsap.matchMedia();

      if (!prefersReducedMotion) {
        // ------------------------------------------------------------
        // ENTRANCE REVEAL (plays once, on scroll into view — only ever
        // seen on stage 0, since activeArc starts there)
        // ------------------------------------------------------------
        gsap.set([eyebrowRef.current, line1Ref.current, line2Ref.current], {
          opacity: 0,
          y: 22,
        });
        gsap.set(illustrationRef.current, {
          clipPath: "inset(0 100% 0 0)",
        });
        gsap.set([subheadingRef.current, paragraphRef.current], {
          opacity: 0,
          y: 16,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        });

        tl.to(eyebrowRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        })
          .to(
            line1Ref.current,
            { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
            "-=0.35",
          )
          .to(
            line2Ref.current,
            { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
            "-=0.42",
          );

        // the first stage's artwork is itself a single continuous line
        // drawing (robot -> walker -> portal -> handshake, left to right),
        // so a left-to-right clip-path wipe reads as the line "drawing
        // itself in"
        tl.to(
          illustrationRef.current,
          { clipPath: "inset(0 0% 0 0)", duration: 1.6, ease: "power1.inOut" },
          "+=0.15",
        );

        tl.to(
          subheadingRef.current,
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.5",
        ).to(
          paragraphRef.current,
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.25",
        );

        // ------------------------------------------------------------
        // SCROLL-DRIVEN ARC + CONTENT (desktop only — pin briefly, scrub
        // progress; the same activeArc state drives both the dot and the
        // stage crossfade below, so they update in the same render)
        // ------------------------------------------------------------
        mm.add("(min-width: 1024px)", () => {
          const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "+=70%",
            pin: true,
            scrub: 0.4,
            onUpdate: (self) => {
              const p = self.progress;
              setActiveArc(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
            },
          });

          return () => trigger.kill();
        });
      }

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-nav-section="The Model"
      data-nav-theme="light"
      className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-[clamp(28px,5vh,72px)] text-[#101010] sm:px-10 lg:px-16"
    >
      {/* dot grid background, matching the rest of the site */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.13) 0.65px, transparent 0.65px)",
          backgroundSize: "9px 9px",
        }}
      />

      {/* ---------- SCROLL-DRIVEN ARC (anchored to the viewport edge) ---------- */}
      <svg
        viewBox="0 0 300 400"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 lg:block ${ARC_BAND}`}
      >
        <path
          d="M 320 0 Q 60 200 320 400"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.25"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div
        className={`pointer-events-none absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 lg:block ${ARC_BAND}`}
      >
        {STAGES.map((stage, i) => (
          <div
            key={stage.label}
            className="absolute flex -translate-y-1/2 items-center gap-3"
            style={{ top: stage.top, right: stage.right }}
          >
            <span
              className={`whitespace-nowrap text-right text-[11px] font-medium tracking-wide transition-all duration-500 ease-out ${
                activeArc === i ? "text-[#101010]" : "text-black/35"
              }`}
            >
              {stage.label}
            </span>
            <span
              className={`shrink-0 rounded-full border transition-all duration-500 ease-out ${
                activeArc === i
                  ? "h-3 w-3 border-transparent bg-[#e7ff3d]"
                  : "h-2 w-2 border-black/25 bg-transparent"
              }`}
            />
          </div>
        ))}
      </div>

      {/* no z-index here on purpose: a stacking context would isolate the
          illustration's mix-blend-darken from the dot grid behind it */}
      <div className="relative flex w-full max-w-[1920px] flex-col items-center">
        {/* ---------- EYEBROW + HEADING ---------- */}
        <span
          ref={eyebrowRef}
          className="mb-[clamp(14px,2.5vh,36px)] block text-center font-mono text-[10px] uppercase tracking-[0.14em] text-black/50 sm:tracking-[0.25em]"
        >
          AI &nbsp;·&nbsp; Human &nbsp;·&nbsp; Two Strengths &nbsp;·&nbsp; One Edge
        </span>

        <h2 className="max-w-3xl text-center font-serif text-[clamp(1.5rem,1.6vw+1.2vh,2.5rem)] font-normal leading-[1.2]">
          <span ref={line1Ref} className="block text-[#101010]">
            Simulated by AI
          </span>
          <span ref={line2Ref} className="block italic text-[#3478e5]">
            Validated by humans
          </span>
        </h2>

        {/* ---------- STAGE CONTENT (illustration + subheading + paragraph),
            all three absolutely stacked and crossfaded by activeArc ---------- */}
        <div className="relative mt-[clamp(18px,3.5vh,48px)] w-full min-h-[clamp(360px,48vh,520px)]">
          {STAGES.map((stage, i) => (
            <div
              key={stage.label}
              className={`absolute inset-0 flex w-full flex-col items-center transition-opacity duration-300 ease-out ${
                activeArc === i ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="w-full max-w-[min(860px,90vh)] lg:max-w-[min(860px,90vh,calc(100vw_-_560px))]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={i === 0 ? illustrationRef : undefined}
                  src={stage.illustration}
                  alt={stage.illustrationAlt}
                  width={949}
                  height={317}
                  // the first illustration ships on an opaque rgb(254,254,254)
                  // plate; brightness rounds that to pure white so
                  // mix-blend-darken drops it out entirely, letting the dot
                  // grid read through. The placeholder SVGs are authored with
                  // a transparent background directly, so they don't need it.
                  className={`h-auto w-full ${i === 0 ? "brightness-[1.01] mix-blend-darken" : ""}`}
                />
              </div>

              <p
                ref={i === 0 ? subheadingRef : undefined}
                className="mt-[clamp(18px,3.5vh,48px)] text-center font-serif text-[clamp(1rem,0.7vw+0.6vh,1.35rem)] italic text-black/80"
              >
                {stage.subheading}
              </p>

              <p
                ref={i === 0 ? paragraphRef : undefined}
                className="mx-auto mt-3 max-w-150 text-center font-sans text-[13px] leading-relaxed text-black/60 sm:text-[14px]"
              >
                {stage.paragraph}
              </p>
            </div>
          ))}
        </div>

        {/* the arc doesn't work as a floating right-edge element on small
            screens, so its three stages become a plain list instead */}
        <ul className="mx-auto mt-6 flex w-max flex-col items-start gap-2 lg:hidden">
          {STAGES.map((stage) => (
            <li
              key={stage.label}
              className="flex items-center gap-2.5 text-[11px] font-medium tracking-wide text-black/45"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black/25" />
              {stage.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
