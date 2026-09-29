"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingZoom } from "@/components/about/useHeadingZoom";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const STEPS = ["AI real-time rehearsal", "Instant feedback", "Human evaluation"];

// Dial geometry (px, inside a DIAL_W x DIAL_H box on the right edge). The
// circle's centre sits off the right side so only its left arc shows.
const DIAL_W = 300;
const DIAL_H = 460;
const R = 230;
const CX = DIAL_W + 40; // off-screen centre → a left-facing half arc
const CY = DIAL_H / 2;
const STEP_GAP = 36; // degrees between slots; 180° is the centre (apex)

const CIRC = 2 * Math.PI * R;

/**
 * Fixed slot positions along the arc. Slot 0 = top, 1 = centre (apex),
 * 2 = bottom; -1 / 3 are off-arc parking spots that items fade into.
 * (In SVG space angles > 180° sit above the centre.)
 */
function slotXY(slot: number) {
  const deg = 180 - (slot - 1) * STEP_GAP;
  const rad = (deg * Math.PI) / 180;
  // Rounded: server and browser trig can differ in the last float digits,
  // which React reports as a hydration mismatch on cx/cy/transform.
  const round = (n: number) => Math.round(n * 100) / 100;
  return { x: round(CX + R * Math.cos(rad)), y: round(CY + R * Math.sin(rad)) };
}
// The visible arc spans 108° → 252° (bottom-left → top-left, clockwise in SVG
// space). The progress arc fills that span as the dial turns.
const ARC_START = 180 - 2 * STEP_GAP;
const ARC_SPAN = 4 * STEP_GAP;

const IMG = "/salesx/salesxsim.webp";
// The line-art is used as a mask so a gradient can paint its lines
const MASK = `url(${IMG}) center / contain no-repeat`;

/**
 * "Simulated by AI — Validated by humans". One pinned, scroll-driven stage:
 * the headline rises in, the line illustration draws in left → right with a
 * pink → purple → blue gradient sweeping through its strokes, the right-hand
 * dial is a white curve with three fixed slots, all always filled. The new
 * step always arrives in the highlighted centre: steps move up one slot and
 * the one leaving the top wraps round to the bottom (fading out and back in),
 * while a gradient line draws over the white curve — then the closing title
 * + copy appear.
 *
 * Wide screens (xl+) show the dial; below that the same three steps are a chip row.
 * Short screens / reduced motion: static, everything visible.
 */
export default function SalesXSimulated() {
  const sectionRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingZoom(headingRef);
  const progressRef = useRef<SVGCircleElement>(null);
  const cometRef = useRef<SVGCircleElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  // Current + previous step together, so render can tell which item wrapped
  // top → bottom (it fades instead of sliding across the circle)
  const [dial, setDial] = useState({ active: 1, prev: 1 });
  const active = dial.active;
  const setActive = (next: number) =>
    setDial((d) => (d.active === next ? d : { active: next, prev: d.active }));

  // Fill the gradient progress arc (0 → 1) and move the comet to its head
  const setProgress = (progress: number) => {
    const len = (ARC_SPAN / 360) * CIRC * progress;
    progressRef.current?.setAttribute("stroke-dasharray", `${len} ${CIRC}`);
    const headRad = ((ARC_START + (len / CIRC) * 360) * Math.PI) / 180;
    cometRef.current?.setAttribute("cx", String(CX + R * Math.cos(headRad)));
    cometRef.current?.setAttribute("cy", String(CY + R * Math.sin(headRad)));
  };

  useGSAP(
    () => {
      setProgress(1);
      const fitDial = () => {
        // Fit both height and width, so the dial never runs into the artwork
        const scale = Math.min(1, (window.innerHeight * 0.74) / DIAL_H, window.innerWidth / 1500);
        dialRef.current?.style.setProperty("--dial-scale", String(scale));
      };
      fitDial();
      window.addEventListener("resize", fitDial);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 560px)", () => {
        const q = gsap.utils.selector(sectionRef);
        const dialProgress = { p: 0 };
        setProgress(0);
        setActive(0);

        gsap.set(q("[data-sim-foot]"), { opacity: 0, y: 30 });
        gsap.set(artRef.current, { clipPath: "inset(0% 100% 0% 0%)", "--sweep": "0%" });
        gsap.set(q("[data-sim-dial]"), { opacity: 0, x: 40 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * 2.4,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl
          // Illustration draws in left → right; gradient keeps sweeping
          .to(artRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power1.inOut" }, 0.3)
          .to(artRef.current, { "--sweep": "100%", duration: 2.6, ease: "none" }, 0.3)
          .to(q("[data-sim-dial]"), { opacity: 1, x: 0, duration: 0.4 }, 0.5)
          // Steps advance into the centre slot one at a time
          .to(
            dialProgress,
            {
              p: 1,
              duration: 1.6,
              ease: "none",
              onUpdate: () => {
                setProgress(dialProgress.p);
                setActive(Math.min(2, Math.round(dialProgress.p * 2)));
              },
            },
            0.9,
          )
          .to(q("[data-sim-foot]"), { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 }, 1.6)
          .to({}, { duration: 0.5 });

        return () => {
          setProgress(1);
          setActive(1);
        };
      });
      return () => window.removeEventListener("resize", fitDial);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="salesx-sim-title"
      className="relative w-full overflow-hidden bg-salesx-bg text-white py-14 sm:py-20 lg:[@media(min-height:560px)]:h-svh lg:[@media(min-height:560px)]:py-0"
    >
      <div className="relative mx-auto flex h-full w-full max-w-372 flex-col items-center justify-center gap-[clamp(0.9rem,3.2svh,2.25rem)] px-4 sm:px-8 lg:px-12">
        {/* Headline */}
        <h2
          ref={headingRef}
          id="salesx-sim-title"
          className="text-center text-[clamp(1.75rem,min(1rem+2.3vw,6.2svh),3rem)] leading-[1.08] tracking-tight"
        >
          <span className="block font-medium text-white">
            Simulated by AI
          </span>
          <span
            className="block bg-linear-to-r from-[#ec4899] via-[#a855f7] to-[#3b82f6] bg-clip-text font-semibold text-transparent"
          >
            Validated by Humans
          </span>
        </h2>

        {/* Illustration — gradient painted through the line-art mask */}
        <div className="relative w-[min(92vw,900px,120svh)] xl:w-[min(52vw,900px,95svh)]">
          <div
            aria-hidden="true"
            className="absolute inset-x-[10%] inset-y-[5%] -z-10 rounded-full bg-radial from-[#a855f7]/25 via-[#3b82f6]/12 to-transparent blur-[70px]"
          />
          <div
            ref={artRef}
            role="img"
            aria-label="A person walks from an AI practice robot through a portal to a human coach"
            className="aspect-1704/568 w-full drop-shadow-[0_0_14px_rgba(168,85,247,0.45)]"
            style={{
              backgroundImage:
                "linear-gradient(100deg, #f472b6 0%, #ec4899 18%, #a855f7 40%, #6366f1 60%, #3b82f6 80%, #38bdf8 100%)",
              backgroundSize: "200% 100%",
              backgroundPosition: "var(--sweep, 50%) 50%",
              WebkitMask: MASK,
              mask: MASK,
            }}
          />
        </div>

        {/* Steps as chips below the image (phones & tablets) */}
        <ol className="flex flex-wrap items-center justify-center gap-2 xl:hidden" aria-label="How SalesX trains">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
                active === i
                  ? "border-[#3b82f6] bg-[#3b82f6]/20 text-white shadow-[0_0_16px_rgba(59,130,246,0.35)]"
                  : "border-white/15 text-white/55"
              }`}
            >
              {step}
            </li>
          ))}
        </ol>

        {/* Closing title + description */}
        <div className="max-w-2xl xl:max-w-xl text-center">
          <h3 data-sim-foot className="text-[clamp(1.1rem,min(0.9rem+0.8vw,3.6svh),1.5rem)] font-medium leading-snug tracking-tight">
            The Approach Is Built on Repetition and Evaluation
          </h3>
          <p data-sim-foot className="mt-2.5 text-[14px] leading-relaxed text-white/70 sm:text-[15px]">
            AI powers the repetition through real-time rehearsal systems,
            generating infinite scenarios with instant feedback. Human coaches
            provide the evaluation, applied to how each rehearsal holds up in
            practice.
          </p>
        </div>
      </div>

      {/* Right-hand rotating dial (desktop) */}
      <div
        data-sim-dial
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 xl:block"
        style={{ width: DIAL_W, height: DIAL_H }}
      >
       {/* Scales down on shorter screens (origin: right edge, centre) */}
       <div
        ref={dialRef}
        className="absolute inset-0 origin-right"
        style={{ transform: "scale(var(--dial-scale, 1))" }}
       >
        <svg width={DIAL_W} height={DIAL_H} className="absolute inset-0 overflow-visible">
          <defs>
            <linearGradient id="simDialGrad" gradientUnits="userSpaceOnUse" x1={CX - R} y1={CY + R * 0.95} x2={CX - R} y2={CY - R * 0.95}>
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="simDialGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* White track — the coloured line draws over it */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
          {/* Precision tick ring */}
          <circle
            cx={CX}
            cy={CY}
            r={R + 14}
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="6"
            strokeDasharray="1 11"
          />
          {/* Gradient progress arc filling as the steps advance */}
          <circle
            ref={progressRef}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="url(#simDialGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`0 ${CIRC}`}
            transform={`rotate(${ARC_START} ${CX} ${CY})`}
            filter="url(#simDialGlow)"
          />
          {/* Comet on the arc's leading edge */}
          <circle ref={cometRef} r="4" fill="#fff" filter="url(#simDialGlow)" />
          {/* Fixed slot markers (top / bottom) */}
          {[0, 1, 2].map((slot) => {
            const { x, y } = slotXY(slot);
            return <circle key={slot} cx={x} cy={y} r="4" fill="rgba(255,255,255,0.35)" />;
          })}
        </svg>

        {/* Fixed centre node — always the highlighted slot */}
        {(() => {
          const { x, y } = slotXY(1);
          return (
            <div className="absolute left-0 top-0" style={{ transform: `translate(${x}px, ${y}px)` }}>
              <span className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3b82f6] shadow-[0_0_16px_rgba(59,130,246,0.95)]" />
              <span className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-[#3b82f6]/70" />
            </div>
          );
        })()}
        {STEPS.map((step, i) => {
          // Cyclic: active in the centre, previous on top, next at the bottom
          const slotFor = (a: number) => (((i - a + 1) % 3) + 3) % 3;
          const slot = slotFor(active);
          const wrapped = Math.abs(slot - slotFor(dial.prev)) > 1;
          const { x, y } = slotXY(slot);
          const isCentre = slot === 1;
          return (
            <div
              // Re-keyed when it wraps so it fades in at its new slot instead
              // of sliding across the whole circle
              key={wrapped ? `${step}-${active}` : step}
              className={`absolute left-0 top-0 ${
                wrapped
                  ? "animate-in fade-in duration-500"
                  : "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              }`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <span
                className={`absolute right-6 top-0 w-40 -translate-y-1/2 text-right leading-tight transition-all duration-500 ${
                  isCentre ? "text-[18px] font-semibold text-white" : "text-[13px] text-white/45"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
       </div>
      </div>
    </section>
  );
}
