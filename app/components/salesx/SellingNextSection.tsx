"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingZoom } from "@/components/about/useHeadingZoom";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ----------------------------- DATA ----------------------------- */

type Item = { title: string; desc?: string; href?: string };

type CardData = {
  id: string;
  tag: string;
  title: string;
  heading: string;
  body: string;
  bullets?: string[];
  items?: Item[];
  cta: { label: string; href: string; variant: "outline" | "gradient" };
  front: string;
  back: string;
};

const CARDS: CardData[] = [
  {
    id: "students",
    tag: "Yourself",
    title: "STUDENTS & FRESHERS",
    heading: "Get hired, not just shortlisted.",
    body: "Your degree gets you into the room. How you sell yourself gets you the offer.",
    bullets: [
      "Interview rehearsals",
      "Your personal pitch",
      "Speaking under pressure",
      "Hiring partner access",
    ],
    cta: { label: "Start my career path", href: "/individuals", variant: "outline" },
    front: "bg-gradient-to-b from-blue-700 via-indigo-800 to-indigo-950",
    back: "bg-gradient-to-b from-[#0c1a60] to-[#040822]",
  },
  {
    id: "professionals",
    tag: "Your Value",
    title: "WORKING PROFESSIONALS",
    heading: "Be the one they promote.",
    body: "Good work doesn't speak for itself. You do. Learn to make your value impossible to overlook.",
    bullets: [
      "Influence",
      "Negotiation",
      "Stakeholder conversations",
      "Executive presence",
    ],
    cta: { label: "Grow my value", href: "/individuals", variant: "outline" },
    front: "bg-gradient-to-b from-blue-600 via-indigo-900 to-[#070b28]",
    back: "bg-gradient-to-b from-[#0c1a60] to-[#040822]",
  },
  {
    id: "founders",
    tag: "Your Vision",
    title: "FOUNDERS & ENTREPRENEURS",
    heading: "Your product can't pitch itself.",
    body: "You know how to build. Now learn to make customers, investors and early hires believe what you already know.",
    bullets: [
      "Founder-led selling",
      "Investor conversations",
      "Pricing talks",
      "Your first 10 customers",
    ],
    cta: { label: "Sell my vision", href: "/contact", variant: "outline" },
    front: "bg-gradient-to-b from-indigo-600 via-blue-900 to-[#070b28]",
    back: "bg-gradient-to-b from-[#0c1a60] to-[#040822]",
  },
  {
    id: "organisations",
    tag: "Your Product",
    title: "ORGANISATIONS",
    heading: "Turn training into revenue.",
    body: "Most sales training ends when the workshop does. Ours is measured in the pipeline.",
    items: [
      { title: "Groom Studio", desc: "Induction that ramps faster" },
      { title: "Sales Audit", desc: "Find the blind spot" },
      { title: "Outbound Lead Gen", desc: "Fill the pipeline" },
      {
        title: "SalesX",
        desc: "Execution training for teams",
        href: "/salesx",
      },
    ],
    cta: { label: "Build my team", href: "/organisations", variant: "gradient" },
    front: "bg-gradient-to-b from-indigo-800 via-violet-700 to-indigo-950",
    back: "bg-gradient-to-b from-[#101758] to-[#05092a]",
  },
];

/** Share of the pinned scroll spent on the line → portal reveal (1.0 of a 4.0 timeline). */
const REVEAL_PHASE = 0.25;

// Cyclic offset helper: 0 is center, -1 is left, 1 is right, 2 is back
const getOffset = (i: number, active: number) => {
  let diff = (i - active) % 4;
  if (diff > 2) diff -= 4;
  if (diff <= -2) diff += 4;
  return diff;
};

/* ----------------------------- CARD ----------------------------- */

function Card({
  data,
  offset,
  spacing,
  onSelect,
}: {
  data: CardData;
  offset: number;
  spacing: number;
  onSelect: () => void;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const flipped = useRef(false);
  const first = useRef(true);
  const isActive = offset === 0;

  const setFlip = (value: boolean) => {
    flipped.current = value;
    gsap.to(flipRef.current, {
      rotationY: value ? 180 : 0,
      duration: 0.7,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  };

  const resetTilt = () => {
    gsap.to(tiltRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  // 3D coverflow positioning based on offset
  useEffect(() => {
    let targetX = 0;
    let targetRotY = 0;
    let targetScale = 1;
    let targetOpacity = 1;
    let targetZIndex = 30;

    if (offset === 0) {
      // Center focused card
      targetX = 0;
      targetRotY = 0;
      targetScale = 1;
      targetOpacity = 1;
      targetZIndex = 30;
    } else if (offset === -1) {
      // Left preview card
      targetX = -spacing;
      targetRotY = 22;
      targetScale = 0.88;
      targetOpacity = 0.72;
      targetZIndex = 20;
    } else if (offset === 1) {
      // Right preview card
      targetX = spacing;
      targetRotY = -22;
      targetScale = 0.88;
      targetOpacity = 0.72;
      targetZIndex = 20;
    } else {
      // Back card in depth
      targetX = 0;
      targetRotY = 0;
      targetScale = 0.76;
      targetOpacity = 0;
      targetZIndex = 10;
    }

    gsap.set(outerRef.current, { zIndex: targetZIndex });
    gsap.to(outerRef.current, {
      x: targetX,
      scale: targetScale,
      rotationY: targetRotY,
      opacity: targetOpacity,
      duration: first.current ? 0 : 0.8,
      ease: "power3.out",
      overwrite: "auto",
    });
    first.current = false;

    if (!isActive && flipped.current) {
      setFlip(false);
      resetTilt();
    }
  }, [offset, spacing, isActive]);

  const onPointerEnter = (e: React.PointerEvent) => {
    if (isActive && e.pointerType === "mouse") setFlip(true);
  };

  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    setFlip(false);
    resetTilt();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(tiltRef.current, {
      rotationX: -py * 12,
      rotationY: px * 12,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onClick = (e: React.MouseEvent) => {
    if (!isActive) {
      onSelect();
      return;
    }
    // If clicking a link inside the back card, allow standard navigation
    if ((e.target as HTMLElement).closest("a")) return;
    setFlip(!flipped.current);
  };

  const ctaClass =
    data.cta.variant === "gradient"
      ? "bg-gradient-to-r from-pink-600 to-blue-500 text-white shadow-lg shadow-fuchsia-900/40 hover:brightness-110"
      : "border border-blue-400/70 text-blue-300 hover:bg-blue-500/10";

  return (
    <div
      ref={outerRef}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      onClick={onClick}
      className={`col-start-1 row-start-1 h-[430px] w-[270px] [transform-style:preserve-3d] sm:h-[460px] sm:w-[320px] transition-shadow duration-300 cursor-pointer ${
        isActive ? "pointer-events-auto" : "pointer-events-auto hover:brightness-125"
      }`}
    >
      <div
        ref={tiltRef}
        className="h-full w-full [transform-style:preserve-3d]"
      >
        <div
          ref={flipRef}
          className="relative h-full w-full [transform-style:preserve-3d]"
        >
          {/* FRONT */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-white/15 px-6 text-center shadow-[0_20px_60px_rgba(37,99,235,0.35)] [backface-visibility:hidden] ${data.front}`}
          >
            <span className="rounded-full border border-pink-500/50 px-4 py-1 text-xs sm:text-sm font-medium">
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-blue-400 bg-clip-text text-transparent">
                {data.tag}
              </span>
            </span>
            <h3 className="mt-8 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl text-white">
              {data.title}
            </h3>
            <span className="absolute bottom-5 text-[10px] uppercase tracking-widest text-white/50">
              Hover / tap to explore
            </span>
          </div>

          {/* BACK */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-blue-400/30 px-6 text-center shadow-[0_20px_60px_rgba(37,99,235,0.35)] [backface-visibility:hidden] [transform:rotateY(180deg)] ${data.back}`}
          >
            <h3 className="text-xl font-medium leading-tight sm:text-2xl text-white">
              {data.heading}
            </h3>
            <p className="mt-3 max-w-[16rem] text-xs leading-relaxed text-white/70">
              {data.body}
            </p>

            {data.bullets && (
              <ul className="mt-5 space-y-2.5 text-left text-xs sm:text-sm w-full max-w-[15rem]">
                {data.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-white/90">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {data.items && (
              <ul className="mt-4 w-full max-w-[15rem] space-y-2 text-left">
                {data.items.map((it) => {
                  const inner = (
                    <>
                      <span className="block text-xs font-semibold text-white sm:text-sm">
                        {it.title}
                        {it.href ? " →" : ""}
                      </span>
                      {it.desc && (
                        <span className="block text-[11px] text-white/60">
                          {it.desc}
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={it.title}>
                      {it.href ? (
                        <Link
                          href={it.href}
                          className="block rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 transition hover:border-fuchsia-400/60 hover:bg-white/10"
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div className="px-3 py-1">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <Link
              href={data.cta.href}
              className={`mt-6 rounded-full px-5 py-2 text-xs font-semibold transition sm:text-sm ${ctaClass}`}
            >
              {data.cta.label} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- SECTION ---------------------------- */

export default function SellingNextSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  // While a click-driven scroll runs, ignore scroll-derived indices so the
  // stack doesn't flick through every card it passes on the way.
  const lockedRef = useRef(false);

  useHeadingZoom(titleRef);

  const [active, setActive] = useState(0);
  const [spacing, setSpacing] = useState(330);

  // Responsive 3D fan spacing
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setSpacing(w < 640 ? 170 : w < 1024 ? 260 : 330);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const selectCard = (index: number) => {
    setActive(index);
    if (scrollTriggerRef.current) {
      const st = scrollTriggerRef.current;
      const totalScroll = st.end - st.start;
      const cardScrollSpan = totalScroll * (1 - REVEAL_PHASE);
      const targetScroll =
        st.start +
        totalScroll * REVEAL_PHASE +
        ((index + 0.5) / CARDS.length) * cardScrollSpan;
      lockedRef.current = true;
      const unlock = () => {
        lockedRef.current = false;
      };
      if (window.__lenis) {
        window.__lenis.scrollTo(targetScroll, {
          duration: 0.9,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          onComplete: unlock,
        });
      } else {
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
        window.setTimeout(unlock, 900);
      }
    }
  };

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    // Below 1024px there is no pin or portal reveal: heading, line and the
    // card stack sit in normal flow, and cards change by tap / dots.
    mm.add("(min-width: 1024px)", () => {
      // Glow line eases in just after the heading
      gsap.from(".ss-line", {
        opacity: 0,
        scaleX: 0.5,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ss-line", start: "top 88%", toggleActions: "play none none reverse" },
      });

      // State object tracking horizontal expansion (h: 0 -> 1) and vertical opening (v: 0 -> 1)
      const revealState = {
        h: 0, // 0 = initial width, 1 = full screen width
        v: 0, // 0 = line height, 1 = full screen height
      };

      // Mathematical function that expands the line with 100% left-right symmetry in parallel
      const updateReveal = () => {
        if (!sectionRef.current || !revealRef.current) return;
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const screenW = sectionRect.width || window.innerWidth;
        const screenH = sectionRect.height || window.innerHeight;
        const halfW = screenW / 2;

        // Base initial half-width (starts at 130px, so initial full line is 260px)
        const initialHalfW = Math.min(130, halfW - 20);
        // Current half-width expands outward symmetrically
        const currentHalfW = initialHalfW + (halfW - initialHalfW) * revealState.h;
        // Both left and right insets are IDENTICAL: distance from screen edge to line tip
        const hInset = Math.max(0, Math.round(halfW - currentHalfW));

        // Center Y position of the line
        let lineCenterY = screenH / 2 + 54;
        if (lineRef.current) {
          const lRect = lineRef.current.getBoundingClientRect();
          lineCenterY = Math.round(lRect.top - sectionRect.top + lRect.height / 2);
        }

        const initialHalfH = 2; // 4px tall initial beam
        const topDistance = lineCenterY - initialHalfH;
        const bottomDistance = screenH - lineCenterY - initialHalfH;

        const topInset = Math.max(0, Math.round(topDistance * (1 - revealState.v)));
        const bottomInset = Math.max(0, Math.round(bottomDistance * (1 - revealState.v)));

        // Apply clipPath with identical left & right insets (hInset)
        revealRef.current.style.clipPath = `inset(${topInset}px ${hInset}px ${bottomInset}px ${hInset}px round ${
          revealState.v > 0.05 ? 0 : 2
        }px)`;

        // Keep the blue glow indicator line width precisely synchronized with currentHalfW
        if (lineRef.current) {
          lineRef.current.style.width = `${Math.round(currentHalfW * 2)}px`;
          lineRef.current.style.opacity = `${Math.max(0, 1 - revealState.v * 2.2)}`;
        }
      };

      // Set initial state
      revealState.h = 0;
      revealState.v = 0;
      updateReveal();
      gsap.set(stageRef.current, { scale: 0.94, opacity: 0 });
      gsap.set(veilRef.current, { opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (lockedRef.current) return;
            const p = self.progress;
            if (p < REVEAL_PHASE) {
              setActive(0);
              return;
            }
            const cardP = (p - REVEAL_PHASE) / (1 - REVEAL_PHASE);
            const idx = Math.min(
              CARDS.length - 1,
              Math.max(0, Math.floor(cardP * CARDS.length)),
            );
            setActive(idx);
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger || null;

      // ── STEP 1: PARALLEL SYMMETRIC HORIZONTAL LINE EXPANSION ──
      // Title dissolves smoothly
      tl.to(
        headingRef.current,
        { opacity: 0, y: -30, duration: 0.35, ease: "power2.in" },
        0,
      );

      // Line expands simultaneously on left and right in parallel
      tl.to(
        revealState,
        {
          h: 1,
          duration: 0.45,
          ease: "power2.inOut",
          onUpdate: updateReveal,
        },
        0,
      );

      // ── STEP 2: VERTICAL PORTAL OPENING ONCE LINE REACHES EDGES ──
      tl.to(
        revealState,
        {
          v: 1,
          duration: 0.55,
          ease: "power2.inOut",
          onUpdate: updateReveal,
        },
        0.45,
      );

      // Veil fades out as the stage reveals
      tl.to(
        veilRef.current,
        { opacity: 0, duration: 0.4, ease: "power1.in" },
        0.55,
      );

      // 3D card stage scales into view
      tl.to(
        stageRef.current,
        { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" },
        0.55,
      );

      // ── STEP 3: SCROLL DISTANCE TO CYCLE THROUGH 3D CAROUSEL ──
      tl.to({}, { duration: 3.0 }, 1.0);

      window.addEventListener("resize", updateReveal);
      document.fonts?.ready.then(() => {
        updateReveal();
        ScrollTrigger.refresh();
      });

      return () => {
        window.removeEventListener("resize", updateReveal);
        scrollTriggerRef.current = null;
        if (revealRef.current) revealRef.current.style.clipPath = "";
        if (lineRef.current) {
          lineRef.current.style.width = "260px";
          lineRef.current.style.opacity = "";
        }
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-salesx-bg text-white select-none max-lg:h-auto max-lg:py-14 sm:max-lg:py-20"
      aria-label="What are you selling next"
    >
      {/* ---------- INITIAL SCREEN ---------- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none z-10 max-lg:static max-lg:mb-4">
        <div ref={headingRef}>
          <h2 ref={titleRef} className="ss-title text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-white tracking-tight">
            What are you
            <br />
            <span className="font-semibold text-white">selling next?</span>
          </h2>
        </div>
        <div
          ref={lineRef}
          className="ss-line mt-6 h-[3px] rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.9)] mx-auto transition-none"
          style={{ width: "260px" }}
        />
      </div>

      {/* ---------- REVEALED SCREEN (starts clipped to the line) ---------- */}
      <div
        ref={revealRef}
        className="absolute inset-0 bg-[#030614] bg-[radial-gradient(ellipse_at_center,rgba(30,64,175,0.45),#030614_70%)] [clip-path:inset(100%_0_0_0)] z-20 overflow-hidden max-lg:relative max-lg:inset-auto max-lg:h-130 sm:max-lg:h-140 max-lg:bg-none max-lg:bg-transparent max-lg:[clip-path:none]"
      >
        {/* Blue beam veil during expansion */}
        <div
          ref={veilRef}
          className="pointer-events-none absolute inset-0 z-30 bg-blue-600 shadow-[0_0_50px_rgba(37,99,235,1)] max-lg:hidden"
        />

        {/* 3D Coverflow Stage with Center, Left, and Right cards */}
        <div
          ref={stageRef}
          className="grid h-full w-full place-items-center [perspective:1400px] overflow-hidden"
        >
          {CARDS.map((card, i) => {
            const offset = getOffset(i, active);
            return (
              <Card
                key={card.id}
                data={card}
                offset={offset}
                spacing={spacing}
                onSelect={() => selectCard(i)}
              />
            );
          })}
        </div>

        {/* Interactive Progress indicator dots */}
        <div className="absolute bottom-8 max-lg:bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {CARDS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectCard(i)}
              className="cursor-pointer p-1 focus:outline-none"
              aria-label={`Go to ${c.title}`}
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
