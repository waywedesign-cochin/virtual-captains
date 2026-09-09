"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Bubble = {
  id: string;
  name: string;
  logo?: string;
  badge?: {
    primary: string;
    sub?: string;
  };
  /** Position in percent relative to the cluster circle */
  x: number;
  y: number;
  size: number;
  isAccent?: boolean;
  isFrosted?: boolean;
};

/**
 * 4 partner logos from /public/home/ used once only:
 * - MoonHive (/home/MoonHive -Logo.jpg.jpeg)
 * - AHAD (/home/AHAD - LOGO.png)
 * - Skylark (/home/be39b0cf2217e231f0988b7ac5933626.jpg.jpeg)
 * - Sigma Life Unifirm (/home/Sigma Life Unifirm Logo Png (1).png)
 * Excludes person.png, approach*.svg, Vector1.png, and SalesX logos as requested.
 */
const BUBBLES: Bubble[] = [
  {
    // Largest partner logo (East) — MoonHive
    id: "moonhive",
    name: "MoonHive",
    logo: "/home/MoonHive -Logo.jpg.jpeg",
    x: 69,
    y: 45,
    size: 126,
  },
  {
    // Major partner logo (West) — AHAD
    id: "ahad",
    name: "AHAD",
    logo: "/home/AHAD - LOGO.png",
    x: 29,
    y: 52,
    size: 118,
  },
  {
    // Major partner logo (North) — Skylark
    id: "skylark",
    name: "Skylark",
    logo: "/home/be39b0cf2217e231f0988b7ac5933626.jpg.jpeg",
    x: 48,
    y: 25,
    size: 112,
  },
  {
    // Major partner logo (South) — Sigma Life Unifirm
    id: "sigma",
    name: "Sigma Life Unifirm",
    logo: "/home/Sigma Life Unifirm Logo Png (1).png",
    x: 52,
    y: 73,
    size: 116,
  },
  {
    // ACCENT FOCAL BUBBLE (Center badge: 50+ Partners)
    id: "accent-center",
    name: "Hiring Network",
    badge: { primary: "50+", sub: "Partners" },
    x: 48,
    y: 48,
    size: 86,
    isAccent: true,
  },
  {
    // Satellite bubble (South-West) — Global Network
    id: "satellite-1",
    name: "Global Network",
    badge: { primary: "Global", sub: "Network" },
    x: 26,
    y: 70,
    size: 64,
    isFrosted: true,
  },
  {
    // Satellite bubble (South-East) — +25 Hiring
    id: "satellite-2",
    name: "More Enterprises",
    badge: { primary: "+25", sub: "Hiring" },
    x: 72,
    y: 67,
    size: 58,
    isFrosted: true,
  },
  {
    // Satellite bubble (North-West) — Top Tier
    id: "satellite-3",
    name: "Top Tier",
    badge: { primary: "Top", sub: "Tier" },
    x: 28,
    y: 32,
    size: 60,
    isFrosted: true,
  },
  {
    // Satellite bubble (North-East) — 100% Verified
    id: "satellite-4",
    name: "Verified",
    badge: { primary: "100%", sub: "Verified" },
    x: 70,
    y: 27,
    size: 62,
    isFrosted: true,
  },
];

/**
 * "Hiring Partners" — Concentric circular logo cluster with floating bubbles
 * and "Get hired by reputed enterprises, across India & abroad" heading,
 * transitioning smoothly from blue down to white.
 */
export default function HiringPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bubbleRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(headingRef.current, { opacity: 0, y: 35 });
      gsap.set(clusterRef.current, { opacity: 0, scale: 0.85, rotate: -4 });
      gsap.set(bubbleRefs.current, { opacity: 0, scale: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      });

      tl.to(clusterRef.current, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1.1,
        ease: "power3.out",
      })
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
          },
          "-=0.7",
        )
        .to(
          bubbleRefs.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            stagger: { each: 0.08, from: "center" },
            ease: "back.out(1.8)",
          },
          "-=0.6",
        );

      // Subtle organic micro-float animation keeping bubbles inside the circle
      bubbleRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: i % 2 === 0 ? -4 : 4,
          x: i % 3 === 0 ? 3 : -3,
          duration: 3.2 + (i % 4) * 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.12,
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-nav-section="Hiring Partners"
      data-nav-theme="light"
      className="relative -mt-px z-10 flex w-full flex-col justify-center overflow-hidden px-6 py-20 text-[#101010] sm:px-10 lg:py-28 lg:pl-36 lg:pr-16"
      style={{
        background:
          "linear-gradient(180deg, #1f5be0 0%, #4a88f4 16%, #9fc3fa 34%, #e5efff 54%, #ffffff 74%, #ffffff 100%)",
      }}
    >
      {/* Background Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
        {/* ---------- LEFT: CONCENTRIC CIRCULAR LOGO CLUSTER ---------- */}
        <div className="flex justify-center lg:col-span-7">
          <div
            ref={clusterRef}
            className="relative aspect-square w-[min(540px,92vw)] overflow-hidden rounded-full border border-black/10 bg-white/10 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.08)] backdrop-blur-[2px]"
          >
            {/* Outer concentric accent ring */}
            <div className="pointer-events-none absolute inset-3 rounded-full border border-black/8 sm:inset-4" />
            {/* Mid dashed orbit ring */}
            <div className="pointer-events-none absolute inset-8 rounded-full border border-dashed border-black/10 sm:inset-10" />
            {/* Inner faint guide circle */}
            <div className="pointer-events-none absolute inset-20 rounded-full border border-black/5 sm:inset-24" />
            {/* Center soft ambient glow */}
            <div className="pointer-events-none absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.15)_65%,transparent_100%)]" />

            {/* Floating Logo Bubbles */}
            {BUBBLES.map((bubble, i) => (
              <div
                key={bubble.id}
                ref={(el) => {
                  bubbleRefs.current[i] = el;
                }}
                className={`group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-all duration-300 ease-out hover:scale-108 hover:z-30 ${
                  bubble.isAccent
                    ? "bg-white text-black border border-black/15 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.12)] hover:bg-[#e7ff3d] hover:text-[#0a0b0d] hover:border-[#e7ff3d] hover:shadow-[0_4px_32px_rgba(231,255,61,0.75),0_0_16px_#e7ff3d]"
                    : bubble.isFrosted
                      ? "bg-white/70 text-black/85 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] border border-white/80 backdrop-blur-md hover:bg-white hover:text-[#2563eb] hover:border-[#2563eb]/40 hover:shadow-[0_12px_28px_-6px_rgba(37,99,235,0.25)]"
                      : "bg-white p-1 sm:p-1.5 text-black shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] border border-black/10 hover:shadow-[0_20px_40px_-8px_rgba(37,99,235,0.25),0_4px_16px_rgba(0,0,0,0.08)] hover:border-[#2563eb]/40"
                }`}
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `clamp(${Math.round(bubble.size * 0.72)}px, ${(bubble.size / 4.2).toFixed(1)}vw, ${bubble.size}px)`,
                  height: `clamp(${Math.round(bubble.size * 0.72)}px, ${(bubble.size / 4.2).toFixed(1)}vw, ${bubble.size}px)`,
                }}
              >
                {bubble.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bubble.logo}
                    alt={bubble.name}
                    className="h-[84%] w-[84%] object-contain select-none filter grayscale contrast-[1.7] brightness-90 opacity-95 transition-all duration-300 ease-out group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:opacity-100 group-hover:scale-108"
                    loading="lazy"
                  />
                ) : bubble.badge ? (
                  <div className="flex flex-col items-center justify-center text-center select-none px-1">
                    <span
                      className={`font-bold leading-none tracking-tight transition-colors duration-300 ${
                        bubble.isAccent
                          ? "font-sans text-[clamp(15px,2.2vw,20px)] text-[#0a0b0d]"
                          : "font-sans text-[clamp(12px,1.7vw,15px)] text-black/90 group-hover:text-[#2563eb]"
                      }`}
                    >
                      {bubble.badge.primary}
                    </span>
                    {bubble.badge.sub && (
                      <span
                        className={`mt-0.5 font-bold leading-none tracking-wider uppercase transition-colors duration-300 ${
                          bubble.isAccent
                            ? "text-[9px] sm:text-[10px] text-black/80"
                            : "text-[7.5px] sm:text-[8.5px] text-black/60 group-hover:text-[#2563eb]/90"
                        }`}
                      >
                        {bubble.badge.sub}
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- RIGHT: HEADLINE ---------- */}
        <div className="text-center lg:col-span-5 lg:text-left">
          <h2
            ref={headingRef}
            className="font-serif text-[clamp(1.85rem,2.6vw,2.9rem)] font-normal leading-[1.22] text-[#111827]"
          >
            <span className="italic text-[#2563eb]">Get hired</span> by reputed
            <br />
            enterprises, across
            <br />
            India &amp; abroad
          </h2>
        </div>
      </div>
    </section>
  );
}
