"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { HEADING_REVEAL, HEADING_REVEAL_FROM } from "@/lib/animations/headingReveal";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Feature {
  title: string;
  subtitle?: string;
}

interface Track {
  word: string;
  eyebrow: string;
  headline: string[];
  intro: string;
  features: Feature[];
  ctas: [{ label: string; href: string }, { label: string; href: string }];
}

const TRACKS: Track[] = [
  {
    word: "Individuals",
    eyebrow: "For Individuals",
    headline: ["Prepare Yourself", "for the Deal,", "Not Just the Interview."],
    intro:
      "Enroll in an execution-backed sales training program built to transition students, freshers, founders and professionals into top-performing sellers.",
    features: [
      { title: "VC Certified Sales Professional", subtitle: "Industry-recognised sales credential" },
      { title: "SalesX by Virtual Captains", subtitle: "Execution-backed sales training platform" },
      { title: "Career Placement Support", subtitle: "Direct access to Virtual Captains' hiring network" },
      { title: "Live CRM & Sales-Call Simulations" },
      { title: "Real Sales-Call Practice, Evaluated by Practitioners" },
      { title: "VC Certified Badge (LinkedIn-ready)" },
      { title: "Placement Assistance for Top Performers" },
    ],
    ctas: [
      { label: "Partner With Us", href: "/partner-with-us" },
      { label: "Book Now", href: "/contact" },
    ],
  },
  {
    word: "Organisations",
    eyebrow: "For Organisations",
    headline: ["Hire Proven Sellers,", "Not Potential."],
    intro:
      "Hire revenue-ready sellers who hit targets from day one, or scale your existing sales team with our high-intensity simulation training.",
    features: [
      { title: "Hire VC Certified Grads", subtitle: "Skip the ramp-up, start closing faster" },
      { title: "Custom Corporate Training", subtitle: "Tailored execution programmes for your sales team" },
      { title: "Sales Team Transformation", subtitle: "Backed by Virtual Captains' execution expertise" },
      { title: "Pre-Vetted, Certified Candidates" },
      { title: "Ongoing Performance Coaching" },
      { title: "Access to Virtual Captains' Hiring Network" },
    ],
    ctas: [
      { label: "Partner With Us", href: "/partner-with-us" },
      { label: "Book Now", href: "/contact" },
    ],
  },
];

const WORD_GRADIENT =
  "linear-gradient(90deg, #ff6b35 0%, #ff477e 25%, #a855f7 50%, #38bdf8 75%, #60a5fa 100%)";

// Scroll map of the pinned sequence (0 → 1). Individuals plays completely,
// hands over, then Organisations plays completely.
const P = {
  auraEnd: 0.06,
  unfoldEnd: 0.12,
  rollA: [0.12, 0.46] as const,
  outA: [0.48, 0.56] as const,
  inB: [0.54, 0.64] as const,
  rollB: [0.64, 0.94] as const,
};

function Arrow() {
  return (
    <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function Ctas({ track, className = "" }: { track: Track; className?: string }) {
  const [outline, primary] = track.ctas;
  return (
    <div className={`flex flex-col gap-2.5 xl:gap-3 w-full max-w-sm ${className}`}>
      <Link
        href={outline.href}
        className="group w-full min-h-10 xl:min-h-11 flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 hover:bg-white/10 hover:border-white/50 px-5 xl:px-6 py-2 xl:py-3 text-xs xl:text-sm font-semibold text-white/90 hover:text-white transition-all duration-300 backdrop-blur-md"
      >
        <span>{outline.label}</span>
        <Arrow />
      </Link>
      <Link
        href={primary.href}
        className="group w-full min-h-10 xl:min-h-11 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 border border-blue-400/40 px-5 xl:px-6 py-2 xl:py-3 text-xs xl:text-sm font-semibold text-white shadow-[0_0_25px_rgba(30,58,138,0.5)] hover:shadow-[0_0_35px_rgba(56,189,248,0.45)] transition-all duration-300"
      >
        <span>{primary.label}</span>
        <Arrow />
      </Link>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 mb-3 text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-sky-400/80">
      <span className="w-4 h-px bg-sky-400/60" />
      {children}
      <span className="w-4 h-px bg-sky-400/60" />
    </span>
  );
}

export default function SalesXAudience() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const titleOuterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wheelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[][]>([[], []]);
  const pillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const flowRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        pin: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        flow: "(max-width: 1023px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { pin, reduce } = context.conditions ?? {};
        if (reduce) return;

        // ── Phones, tablets: natural flow, each block reveals ──
        if (!pin) {
          const flow = flowRef.current;
          if (!flow) return;
          flow.querySelectorAll<HTMLElement>("[data-sx-reveal]").forEach((el) => {
            gsap.set(el, { ...HEADING_REVEAL_FROM });
            gsap.to(el, {
              scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
              ...HEADING_REVEAL,
            });
          });
          flow.querySelectorAll<HTMLElement>("[data-sx-list]").forEach((list) => {
            gsap.from(list.children, {
              opacity: 0,
              y: 20,
              duration: 0.6,
              stagger: 0.06,
              ease: "power2.out",
              scrollTrigger: { trigger: list, start: "top 85%", toggleActions: "play none none reverse" },
            });
          });
          return;
        }

        // ── Desktop: one pinned sequence, Individuals → Organisations ──
        const outers = titleOuterRefs.current as HTMLDivElement[];
        const inners = titleInnerRefs.current as HTMLDivElement[];
        const lefts = leftRefs.current as HTMLDivElement[];
        const wheels = wheelRefs.current as HTMLDivElement[];
        const cards = cardRefs.current.map((set) => set.filter(Boolean) as HTMLDivElement[]);
        const pills = pillRefs.current as HTMLSpanElement[];
        if (!sectionRef.current || !stageRef.current || outers.length < 2 || inners.length < 2) return;

        const radius = 195;
        const stepDeg = 24;
        const expo = gsap.parseEase("expo.out");
        const seg = (p: number, [a, b]: readonly [number, number]) => gsap.utils.clamp(0, 1, (p - a) / (b - a));

        // Heading entrance for "Individuals" (inner wrapper — the scrubbed
        // hand-over below only ever touches the outer wrapper).
        gsap.set(inners[0], { ...HEADING_REVEAL_FROM, transformOrigin: "center center" });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
          onEnter: () => gsap.to(inners[0], { ...HEADING_REVEAL }),
        });
        gsap.set(inners[1], { ...HEADING_REVEAL_FROM, transformOrigin: "center center" });

        cards.forEach((set) =>
          gsap.set(set, { xPercent: -50, yPercent: -50, force3D: true, backfaceVisibility: "hidden" }),
        );

        const renderWheel = (set: HTMLDivElement[], current: number) => {
          set.forEach((card, i) => {
            const delta = i - current;
            const thetaDeg = delta * stepDeg;
            const theta = (thetaDeg * Math.PI) / 180;
            const abs = Math.abs(delta);
            const opacity = Math.abs(thetaDeg) > 85 ? 0 : Math.max(0.06, Math.pow(Math.cos(theta), 3.2));
            const isCenter = abs < 0.45;
            gsap.set(card, {
              y: Math.round(radius * Math.sin(theta) * 2) / 2,
              z: Math.round(radius * (Math.cos(theta) - 1)),
              rotateX: -thetaDeg,
              scale: Math.max(0.85, 1.025 - Math.min(abs, 2.5) * 0.055),
              opacity,
              zIndex: isCenter ? 25 : Math.max(1, 15 - Math.round(abs)),
              visibility: opacity > 0.02 ? "visible" : "hidden",
            });
            card.dataset.center = isCenter ? "true" : "false";
          });
        };

        const show = (el: HTMLElement, o: number, x: number) =>
          gsap.set(el, { opacity: o, x, visibility: o > 0.01 ? "visible" : "hidden", pointerEvents: o > 0.6 ? "auto" : "none" });

        const update = (p: number) => {
          const aura = gsap.utils.clamp(0, 1, p / P.auraEnd);
          if (auraRef.current) gsap.set(auraRef.current, { opacity: aura, scale: 0.6 + aura * 0.4 });

          const unfold = gsap.utils.clamp(0, 1, (p - P.auraEnd) / (P.unfoldEnd - P.auraEnd));
          const out = seg(p, P.outA);
          const inn = expo(seg(p, P.inB));

          // Individuals: unfold, roll, then step back
          gsap.set(outers[0], { opacity: 1 - out, scale: 1 - 0.08 * out, y: -24 * out });
          show(lefts[0], unfold * (1 - out), -45 * (1 - unfold) - 30 * out);
          show(wheels[0], unfold * (1 - out), 45 * (1 - unfold) + 30 * out);
          renderWheel(cards[0], seg(p, P.rollA) * (cards[0].length - 1));

          // Organisations: heading reveal (scrubbed, same values), then roll
          gsap.set(inners[1], {
            opacity: inn,
            scale: HEADING_REVEAL_FROM.scale + (1 - HEADING_REVEAL_FROM.scale) * inn,
            y: HEADING_REVEAL_FROM.y * (1 - inn),
          });
          show(lefts[1], inn, -45 * (1 - inn));
          show(wheels[1], inn, 45 * (1 - inn));
          renderWheel(cards[1], seg(p, P.rollB) * (cards[1].length - 1));

          const onB = p >= (P.outA[0] + P.inB[1]) / 2;
          pills.forEach((pill, i) => (pill.dataset.active = String(i === (onB ? 1 : 0))));
        };

        update(0);

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=4200",
          pin: stageRef.current,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => update(self.progress),
        });
        scrollTriggerRef.current = st;

        return () => {
          scrollTriggerRef.current = null;
        };
      },
    );

    return () => mm.revert();
  }, []);

  // Clicking a card rolls its wheel so that card becomes the centre one
  const handleCardClick = (track: number, index: number) => {
    const st = scrollTriggerRef.current;
    if (!st) return;
    const [a, b] = track === 0 ? P.rollA : P.rollB;
    const n = TRACKS[track].features.length - 1;
    const target = st.start + (st.end - st.start) * (a + (index / n) * (b - a));
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(target, { duration: 0.8, lock: false });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative bg-salesx-bg select-none overflow-hidden" aria-label="Who SalesX is for">
      {/* ── Pinned stage (desktop & laptop, motion allowed) ── */}
      <div
        ref={stageRef}
        className="hidden lg:motion-safe:flex h-screen min-h-screen w-full flex-col items-center justify-center relative overflow-hidden px-6 lg:px-8 xl:px-12 py-3 lg:py-4 xl:py-6"
      >
        <div
          ref={auraRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-162.5 h-105 bg-radial from-[#1e40af]/30 via-[#312e81]/15 to-transparent blur-[120px] pointer-events-none -z-10"
        />
        {/* Constellation grid, faded at the edges so the section has no visible border */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none -z-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(147, 197, 253, 0.35) 1px, transparent 0)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
          }}
        />

        <div className="w-full max-w-372 mx-auto relative z-10 my-auto">
          <div className="grid grid-cols-12 gap-4 lg:gap-6 items-center">
            {/* Left: copy + CTAs, both tracks stacked in one grid cell */}
            <div className="col-span-4 grid">
              {TRACKS.map((t, ti) => (
                <div
                  key={t.word}
                  ref={(el) => {
                    leftRefs.current[ti] = el;
                  }}
                  className="[grid-area:1/1] self-center flex flex-col items-start text-left pr-4 xl:pr-6 opacity-0 invisible will-change-transform"
                >
                  <Eyebrow>{t.eyebrow}</Eyebrow>
                  <h3 className="text-xl lg:text-2xl xl:text-[2.2rem] font-extrabold tracking-tight text-white leading-[1.2]">
                    {t.headline.map((line, i) => (
                      <React.Fragment key={line}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </h3>
                  <p className="mt-3 lg:mt-4 xl:mt-5 text-xs lg:text-sm xl:text-base text-slate-300 leading-relaxed max-w-104">{t.intro}</p>
                  <Ctas track={t} className="mt-4 lg:mt-6 xl:mt-8" />
                </div>
              ))}
            </div>

            {/* Centre: the audience word, flanked by hairlines */}
            <div className="col-span-4 relative flex items-center justify-center min-h-80 lg:min-h-95 xl:min-h-115">
              <div className="absolute left-0 top-4 lg:top-6 bottom-4 lg:bottom-6 w-px bg-linear-to-b from-transparent via-blue-500/35 to-transparent" />
              {TRACKS.map((t, ti) => (
                <div
                  key={t.word}
                  ref={(el) => {
                    titleOuterRefs.current[ti] = el;
                  }}
                  className={`${ti === 0 ? "relative" : "absolute inset-0 flex items-center justify-center"} px-4 text-center will-change-transform`}
                >
                  <div
                    ref={(el) => {
                      titleInnerRefs.current[ti] = el;
                    }}
                    className="will-change-transform"
                  >
                    <h2
                      className="text-2xl lg:text-3xl xl:text-[2.6rem] 2xl:text-[3.25rem] font-extrabold tracking-tight bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                      style={{ backgroundImage: WORD_GRADIENT }}
                    >
                      {t.word}
                    </h2>
                  </div>
                </div>
              ))}
              <div className="absolute right-0 top-4 lg:top-6 bottom-4 lg:bottom-6 w-px bg-linear-to-b from-transparent via-blue-500/35 to-transparent" />
            </div>

            {/* Right: one 3D wheel per track, stacked */}
            <div className="col-span-4 relative flex items-center justify-center pl-2 lg:pl-4">
              <div className="relative w-full max-w-md h-80 lg:h-95 xl:h-115">
                {TRACKS.map((t, ti) => (
                  <div
                    key={t.word}
                    ref={(el) => {
                      wheelRefs.current[ti] = el;
                    }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 invisible"
                    style={{
                      perspective: "1100px",
                      maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
                      isolation: "isolate",
                    }}
                  >
                    {t.features.map((f, i) => (
                      <div
                        key={f.title}
                        ref={(el) => {
                          cardRefs.current[ti][i] = el;
                        }}
                        onClick={() => handleCardClick(ti, i)}
                        data-center="false"
                        className="sx-wheel-card group absolute w-[90%] max-w-xs xl:max-w-sm cursor-pointer rounded-2xl p-3 xl:p-4 overflow-hidden flex items-center justify-center text-center will-change-transform border border-white/8 border-t-white/14 bg-linear-to-br from-white/5 via-[#070c20]/40 to-[#070b1e]/55 backdrop-blur-lg data-[center=true]:border-sky-400/55 data-[center=true]:border-t-white/50 data-[center=true]:from-white/12 data-[center=true]:via-[#0e1941]/50 data-[center=true]:to-[#0a1230]/65 data-[center=true]:backdrop-blur-2xl data-[center=true]:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.35)]"
                        style={{ top: "50%", left: "50%", transformStyle: "preserve-3d", transition: "none" }}
                      >
                        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                        <div className="relative z-10 flex flex-col items-center">
                          <h4 className="sx-card-title text-xs lg:text-sm font-semibold text-slate-400 group-data-[center=true]:text-sky-400">{f.title}</h4>
                          {f.subtitle && <p className="sx-card-sub mt-0.5 text-[11px] lg:text-xs leading-relaxed text-slate-600 group-data-[center=true]:text-slate-200">{f.subtitle}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Which half of the sequence we're in */}
        <div className="absolute bottom-3 lg:bottom-5 xl:bottom-8 left-1/2 -translate-x-1/2 flex gap-2" aria-hidden="true">
          {TRACKS.map((t, ti) => (
            <span
              key={t.word}
              ref={(el) => {
                pillRefs.current[ti] = el;
              }}
              data-active={ti === 0 ? "true" : "false"}
              className="rounded-full border px-3 py-0.5 xl:py-1 text-[10px] xl:text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors duration-300 border-white/10 text-white/35 data-[active=true]:border-sky-400/50 data-[active=true]:text-sky-300"
            >
              {t.word}
            </span>
          ))}
        </div>
      </div>

      {/* ── Flow layout (phones, tablets, reduced motion) ── */}
      <div ref={flowRef} className="lg:motion-safe:hidden px-4 sm:px-8">
        {TRACKS.map((t) => (
          <div key={t.word} className="max-w-3xl mx-auto py-12 sm:py-16 flex flex-col items-center text-center">
            <div data-sx-reveal className="mb-6">
              <h2
                className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                style={{ backgroundImage: WORD_GRADIENT }}
              >
                {t.word}
              </h2>
            </div>
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h3 data-sx-reveal className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-[1.2] text-balance">
              {t.headline.join(" ")}
            </h3>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">{t.intro}</p>
            <ul data-sx-list className="mt-8 grid w-full gap-3 sm:grid-cols-2 text-left">
              {t.features.map((f) => (
                <li
                  key={f.title}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/4 p-4 backdrop-blur-md"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                  <span>
                    <span className="block text-sm font-semibold text-white">{f.title}</span>
                    {f.subtitle && <span className="mt-0.5 block text-xs text-slate-400 leading-relaxed">{f.subtitle}</span>}
                  </span>
                </li>
              ))}
            </ul>
            <Ctas track={t} className="mt-8 sm:flex-row sm:max-w-lg" />
          </div>
        ))}
      </div>
    </section>
  );
}
