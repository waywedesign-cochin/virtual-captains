"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { HEADING_REVEAL, HEADING_REVEAL_FROM } from "@/lib/animations/headingReveal";
import { PARTNERS, logoHeight, type Partner } from "@/app/content/partners";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Network layout (laptops+, see NETWORK_QUERY): the title sits at the hub, partners sit on two
 * elliptical orbits around it. Positions are
 * % of the stage so it scales with the container. The inner ring is offset by
 * half a step so its nodes fall between the outer ring's.
 */
const INNER_COUNT = 10;
const RINGS = {
  inner: { rx: 29, ry: 26 }, // % of stage width / height
  outer: { rx: 45.5, ry: 44 },
};
/** How far the rings turn over the pinned scroll (radians). Both rings turn
 *  by the same angle so they keep their interleaved spacing and never collide. */
const SPIN = { inner: 0.55, outer: 0.55 };
// Laptops from 1024px wide (incl. 125% / 150% zoom on common screens) get the network.
const NETWORK_QUERY = "(min-width: 1024px)";

type Node = { p: Partner; angle: number; ring: "inner" | "outer" };

const NODES: Node[] = PARTNERS.map((p, i) => {
  const inner = i < INNER_COUNT;
  const count = inner ? INNER_COUNT : PARTNERS.length - INNER_COUNT;
  const idx = inner ? i : i - INNER_COUNT;
  // start at the top, go clockwise; inner ring offset by half a step
  const angle = -Math.PI / 2 + ((idx + (inner ? 0.5 : 0)) / count) * Math.PI * 2;
  return { p, angle, ring: inner ? "inner" : "outer" };
});

// Rounded so server and browser render identical values — Math.cos/sin can
// differ in the last digits between engines and break hydration
const round = (v: number) => Math.round(v * 1000) / 1000;

/** Node position (% of stage) after the rings have turned by `t` (0…1). */
function posAt(i: number, t = 0) {
  const n = NODES[i];
  const { rx, ry } = RINGS[n.ring];
  const a = n.angle + SPIN[n.ring] * t;
  return { x: round(50 + rx * Math.cos(a)), y: round(50 + ry * Math.sin(a)) };
}

function LogoGlass({ p, className = "" }: { p: Partner; className?: string }) {
  return (
    <div
      title={p.name}
      className={`group relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-linear-to-b from-white/10 via-white/5 to-white/2 shadow-[0_10px_28px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400/80 hover:shadow-[0_0_30px_rgba(56,189,248,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-radial from-sky-400/12 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.logoSrc}
        alt={p.name}
        loading="lazy"
        draggable={false}
        style={{ height: `${logoHeight(p.ratio)}%` }}
        className="relative w-auto max-w-full object-contain opacity-80 brightness-0 invert transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]"
      />
    </div>
  );
}

export default function SalesXPartnerCloud() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cameraRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const gridRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const headings = headingRefs.current.filter(Boolean);
      gsap.set(headings, { ...HEADING_REVEAL_FROM, transformOrigin: "center center", force3D: true });
      ScrollTrigger.create({
        trigger: section,
        start: "top 72%",
        once: true,
        onEnter: () => {
          gsap.to(headings, { force3D: true, ...HEADING_REVEAL });
        },
      });

      const mm = gsap.matchMedia();

      // ── Laptops+: pinned cinematic camera ──────────────────────────────────
      mm.add(NETWORK_QUERY, () => {
        const nodes = nodeRefs.current.filter(Boolean) as HTMLDivElement[];

        // Depth: inner ring nearer the lens than the outer ring, so the rings
        // parallax against each other whenever the camera tilts.
        nodes.forEach((el, i) => gsap.set(el, { z: NODES[i].ring === "inner" ? 30 : -30 }));

        // Ring rotation, driven by a proxy so the nodes move together
        const orbit = { t: 0 };
        const placeOrbit = () => {
          nodes.forEach((el, i) => {
            const { x, y } = posAt(i, orbit.t);
            el.style.left = `${x}%`;
            el.style.top = `${y}%`;
          });
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=220%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Open tight on the title, low and tilted; logos fade in from depth
        tl.fromTo(
          cameraRef.current,
          { scale: 2.4, rotateX: 58, rotateZ: -8, y: 240 },
          { scale: 1, rotateX: 0, rotateZ: 0, y: 0, duration: 1.2, ease: "power2.inOut" },
          0,
        )
          .fromTo(
            nodes,
            { opacity: 0, scale: 0.4 },
            { opacity: 1, scale: 1, duration: 0.7, stagger: 0.02, ease: "power2.out" },
            0.25,
          )
          // 2. Rings turn together while the camera settles
          .to(orbit, { t: 1, duration: 2.2, ease: "sine.inOut", onUpdate: placeOrbit }, 0.4)
          // 3. Slow push-in with a gentle roll to close the shot
          .to(
            cameraRef.current,
            { scale: 1.08, rotateX: 0, rotateZ: 0, duration: 1.2, ease: "power1.inOut" },
            1.4,
          )
          .to(hubRef.current, { scale: 1.06, duration: 1.2, ease: "power1.inOut" }, 1.4);

        // Mouse parallax on the rig, a few degrees toward the cursor
        const tiltX = gsap.quickTo(rigRef.current, "rotateX", { duration: 0.9, ease: "power3.out" });
        const tiltY = gsap.quickTo(rigRef.current, "rotateY", { duration: 0.9, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          const r = section.getBoundingClientRect();
          tiltY(((e.clientX - r.left) / r.width - 0.5) * 12);
          tiltX(-((e.clientY - r.top) / r.height - 0.5) * 8);
        };
        const onLeave = () => {
          tiltX(0);
          tiltY(0);
        };
        section.addEventListener("pointermove", onMove);
        section.addEventListener("pointerleave", onLeave);

        // Sections above (e.g. the pinned hero) change the page height after
        // load — re-measure so the pin starts in the right place.
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);

        return () => {
          section.removeEventListener("pointermove", onMove);
          section.removeEventListener("pointerleave", onLeave);
          window.removeEventListener("load", refresh);
          orbit.t = 0;
          placeOrbit();
        };
      });

      // ── Smaller screens: grid cards slide up ─────────────────────────────────
      mm.add(`not all and ${NETWORK_QUERY}`, () => {
        const grid = gridRefs.current.filter(Boolean) as HTMLElement[];
        gsap.fromTo(
          grid,
          { opacity: 0, y: 18, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.03,
            scrollTrigger: { trigger: section, start: "top 72%", once: true },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-label="SalesX Partner Network and Ecosystem"
      className="relative bg-salesx-bg overflow-hidden py-14 sm:py-20 lg:py-24 select-none"
    >
      {/* Central ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] lg:w-[1100px] h-[350px] sm:h-[450px] lg:h-[600px] bg-radial from-[#1e40af]/12 via-[#0a1740]/8 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Starfield dot grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(147, 197, 253, 0.35) 1px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12">
        {/* ── LAPTOPS+: NETWORK — hub title, two orbits ── */}
        <div className="hidden perspective-[1800px] lg:block">
        {/* camera = scroll dolly, rig = mouse tilt; both keep 3D for depth */}
        <div ref={cameraRef} className="transform-3d will-change-transform">
        <div
          ref={rigRef}
          className="relative w-full h-[min(760px,calc(100svh-140px))] 2xl:h-[min(800px,calc(100svh-140px))] transform-3d"
        >
          {/* Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none">
            <div ref={hubRef}>
            <h2
              ref={(el) => {
                headingRefs.current[0] = el;
              }}
              className="text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight text-white font-sans drop-shadow-[0_0_35px_rgba(255,255,255,0.18)] whitespace-nowrap will-change-transform"
            >
              Partner Network
            </h2>
            <p className="mt-3 text-[10px] xl:text-xs 2xl:text-sm text-slate-200 font-light tracking-[0.28em] uppercase font-sans">
              Grow Alongside SalesX
            </p>
            </div>
          </div>

          {/* Nodes */}
          {NODES.map((n, i) => (
            <div
              key={n.p.name}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className="absolute z-10 will-change-transform"
              style={{
                left: `${posAt(i).x}%`,
                top: `${posAt(i).y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <LogoGlass
                p={n.p}
                className={
                  n.ring === "inner"
                    ? "h-11.5 w-28 px-3 py-2 xl:h-14 xl:w-34 xl:px-4 xl:py-3 2xl:h-15 2xl:w-38"
                    : "h-10 w-25 px-2.5 py-2 xl:h-12 xl:w-30 xl:px-3.5 xl:py-2.5 2xl:h-13 2xl:w-34"
                }
              />
            </div>
          ))}
        </div>
        </div>
        </div>

        {/* ── SMALLER SCREENS: title + responsive glass grid ── */}
        <div className="flex flex-col items-center text-center lg:hidden">
          <h2
            ref={(el) => {
              headingRefs.current[1] = el;
            }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans will-change-transform"
          >
            Partner Network
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 font-light tracking-[0.24em] uppercase font-sans">
            Grow Alongside SalesX
          </p>

          {/* Framed logo panel: one glass panel with a glowing gradient
              rim and soft blue glows behind it (no per-logo cards) */}
          <div className="relative mt-10 w-full max-w-3xl">
            {/* side glows */}
            <div aria-hidden className="pointer-events-none absolute -left-6 top-1/4 h-1/2 w-24 rounded-full bg-[#1d4ed8]/20 blur-[60px]" />
            <div aria-hidden className="pointer-events-none absolute -right-6 bottom-1/5 h-1/2 w-24 rounded-full bg-[#38bdf8]/15 blur-[60px]" />
            {/* sparkles */}
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute -right-1 top-6 h-5 w-5 text-[#93c5fd]">
              <path fill="currentColor" d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
            </svg>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute -left-2 bottom-10 h-3 w-3 text-[#F3FC00]">
              <path fill="currentColor" d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
            </svg>

            {/* gradient rim */}
            <div className="relative rounded-[28px] bg-linear-to-br from-[#1d4ed8]/30 via-white/8 to-[#38bdf8]/25 p-[1.5px] shadow-[0_30px_80px_-30px_rgba(29,78,216,0.3)]">
              <div className="rounded-[26.5px] bg-[#071233]/90 p-2 backdrop-blur-xl sm:p-3">
                <div className="rounded-[22px] border border-white/6 bg-linear-to-b from-white/4 to-transparent px-3 py-6 sm:px-6 sm:py-8">
                  <ul className="flex flex-wrap justify-center gap-y-6 sm:gap-y-8">
                    {PARTNERS.map((p, i) => (
                      <li
                        key={`g-${p.name}`}
                        ref={(el) => {
                          gridRefs.current[i] = el;
                        }}
                        title={p.name}
                        className="flex h-11 basis-1/2 items-center justify-center px-3 sm:h-12 sm:basis-1/3 md:basis-1/4"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.logoSrc}
                          alt={p.name}
                          loading="lazy"
                          draggable={false}
                          style={{ height: `${logoHeight(p.ratio)}%` }}
                          className="w-auto max-w-[85%] object-contain opacity-85 brightness-0 invert"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
