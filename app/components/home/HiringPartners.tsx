"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Partner = {
  id: string;
  name: string;
  src: string;
};

/**
 * ONLY the 4 partner logos from /public/home/ — nothing from outside:
 * 1. MoonHive (/home/MoonHive -Logo.jpg.jpeg)
 * 2. AHAD (/home/AHAD - LOGO.png)
 * 3. Skylark (/home/skylark_information_technologies_logo.jpg.jpeg)
 * 4. Sigma Life Unifirm (/home/Sigma Life Unifirm Logo Png (1).png)
 */
const PARTNERS: Partner[] = [
  {
    id: "moonhive",
    name: "MoonHive",
    src: "/home/MoonHive -Logo.jpg.jpeg",
  },
  {
    id: "ahad",
    name: "AHAD",
    src: "/home/AHAD - LOGO.png",
  },
  {
    id: "skylark",
    name: "Skylark",
    src: "/home/skylark_information_technologies_logo.jpg.jpeg",
  },
  {
    id: "sigma",
    name: "Sigma Life Unifirm",
    src: "/home/Sigma Life Unifirm Logo Png (1).png",
  },
];

/**
 * 3 Symmetrical, balanced positions inside the normal circle (120° triad layout)
 * This allows 3 logos to be prominently displayed at a time, while the 4th logo
 * rotates in by vanishing one by one slowly.
 */
const SLOTS = [
  { id: "top", x: 50, y: 28 },
  { id: "bottom-right", x: 69, y: 65 },
  { id: "bottom-left", x: 31, y: 65 },
];

export default function HiringPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Initial 3 slots showing partners 0, 1, 2 (the 4th waits in queue)
  const [slotPartners, setSlotPartners] = useState<number[]>([0, 1, 2]);

  // Which slot is currently in the slow vanishing transition
  const [fadingSlot, setFadingSlot] = useState<number | null>(null);

  const nextPartnerIndexRef = useRef(3);
  const currentSlotToChangeRef = useRef(0);
  const isHoveredRef = useRef(false);

  // Slowly vanish one logo at a time and reveal the waiting partner from the pool
  useEffect(() => {
    const interval = setInterval(() => {
      if (isHoveredRef.current) return;

      const slotToFade = currentSlotToChangeRef.current;
      currentSlotToChangeRef.current = (slotToFade + 1) % SLOTS.length;

      // 1. Vanish slowly
      setFadingSlot(slotToFade);

      // 2. After 550ms, swap in the next partner from the pool and softly appear
      setTimeout(() => {
        setSlotPartners((prev) => {
          let nextP = nextPartnerIndexRef.current;
          let attempts = 0;
          while (prev.includes(nextP) && attempts < PARTNERS.length) {
            nextP = (nextP + 1) % PARTNERS.length;
            attempts++;
          }
          nextPartnerIndexRef.current = (nextP + 1) % PARTNERS.length;

          const updated = [...prev];
          updated[slotToFade] = nextP;
          return updated;
        });

        requestAnimationFrame(() => {
          setFadingSlot(null);
        });
      }, 550);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(headingRef.current, { opacity: 0, y: 35 });
      gsap.set(circleRef.current, { opacity: 0, scale: 0.9 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      });

      tl.to(circleRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.0,
        ease: "power3.out",
      }).to(
        headingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
        },
        "-=0.6",
      );
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

      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* ---------- LEFT: CLEAN NORMAL CIRCLE WITH BALANCED LOGO PODS ---------- */}
        <div className="flex justify-center lg:col-span-7">
          <div
            ref={circleRef}
            onMouseEnter={() => {
              isHoveredRef.current = true;
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
            }}
            className="relative aspect-square w-[min(480px,90vw)] rounded-full border border-black/10 bg-white/40 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.08)] backdrop-blur-[4px]"
          >
            {/* Minimal subtle inner guide rings */}
            <div className="pointer-events-none absolute inset-6 rounded-full border border-black/5 sm:inset-8" />
            <div className="pointer-events-none absolute inset-20 rounded-full border border-dashed border-black/6 sm:inset-24" />

            {/* Ambient center soft glow */}
            <div className="pointer-events-none absolute inset-[24%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.2)_60%,transparent_100%)]" />

            {/* Clean Logo Pods */}
            {SLOTS.map((slot, index) => {
              const partnerIndex = slotPartners[index] ?? index;
              const partner = PARTNERS[partnerIndex];
              const isFading = fadingSlot === index;

              return (
                <div
                  key={slot.id}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-white border border-black/8 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.09)] p-3 sm:p-4 transition-all duration-600 ease-out cursor-pointer hover:scale-110 hover:shadow-[0_18px_38px_-8px_rgba(37,99,235,0.25),0_0_0_1.5px_rgba(37,99,235,0.35)] hover:z-20 w-[112px] h-[112px] sm:w-[132px] sm:h-[132px] ${
                    isFading
                      ? "opacity-0 scale-75 blur-xs"
                      : "opacity-100 scale-100 blur-0"
                  }`}
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                  }}
                  title={partner.name}
                >
                  {/* Default: Black & White / Grayscale. Hover: Full authentic brand color! */}
                  <div className="flex h-full w-full items-center justify-center filter grayscale contrast-125 opacity-75 transition-all duration-300 ease-out group-hover:grayscale-0 group-hover:contrast-100 group-hover:opacity-100 group-hover:scale-105">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partner.src}
                      alt={partner.name}
                      className="h-[75%] w-[80%] select-none object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              );
            })}
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
