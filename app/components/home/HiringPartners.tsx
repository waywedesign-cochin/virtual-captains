"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type CirclePod = {
  id: string;
  name: string;
  isCenter: boolean;
  left: number; // percentage from container left
  top: number; // percentage from container top
  size: number; // percentage width & height of container
  bg: string;
  logoSrc?: string;
  fallbackText: string;
  fontSize?: string;
};

/**
 * 9 Circular Pods matching the exact geometry and layout of the design mockup:
 * - Center: Vibrant yellow circle with Logo
 * - Top-Right: Extra-large grey circle with MoonHive
 * - Mid-Left: Large grey circle with AHAD
 * - Top: Medium-large grey circle with Skylark
 * - Bottom-Right: Medium grey circle with Sigma Life
 * - Bottom-Left: Medium-small grey circle with SalesX
 * - Mid-Right: Small grey circle with Logo
 * - Upper-Center-Left: Tiny grey circle with Logo
 *
 * All positions are pre-calculated to ensure 100% collision-free gaps
 * and clean containment inside the double border rings without using transform offsets.
 */
const PODS: CirclePod[] = [
  // 1. Center Yellow Circle (Exact center from mockup: [49.7%, 57.4%], diam: 14.6%)
  {
    id: "center-yellow",
    name: "Virtual Captains",
    isCenter: true,
    left: 42.4,
    top: 50.1,
    size: 14.6,
    bg: "#e2fd00", // Vibrant signature lime yellow
    fallbackText: "Logo",
    fontSize: "clamp(10px, 1.6vw, 14px)",
  },

  // 2. Top-Right Extra Large Circle (The dominant circle: [72.0%, 36.7%], diam: 34.1%)
  {
    id: "pod-top-right",
    name: "MoonHive",
    isCenter: false,
    left: 55.0,
    top: 19.7,
    size: 34.1,
    bg: "#d9d9d9",
    logoSrc: "/home/MoonHive -Logo.jpg.jpeg",
    fallbackText: "Logo",
  },

  // 3. Mid-Left Large Circle ([20.25%, 56.2%], diam: 23.0%)
  {
    id: "pod-mid-left",
    name: "AHAD",
    isCenter: false,
    left: 8.75,
    top: 44.7,
    size: 23.0,
    bg: "#d9d9d9",
    logoSrc: "/home/AHAD - LOGO.png",
    fallbackText: "Logo",
  },

  // 4. Top Medium Circle ([39.9%, 16.9%], diam: 19.0%)
  {
    id: "pod-top",
    name: "Skylark",
    isCenter: false,
    left: 30.4,
    top: 7.4,
    size: 19.0,
    bg: "#d9d9d9",
    logoSrc: "/home/skylark_information_technologies_logo.jpg.jpeg",
    fallbackText: "Logo",
  },

  // 5. Upper-Center-Left Tiny Circle ([37.0%, 38.8%], diam: 12.8%)
  {
    id: "pod-upper-inner",
    name: "Partner",
    isCenter: false,
    left: 30.6,
    top: 32.4,
    size: 12.8,
    bg: "#d9d9d9",
    fallbackText: "Logo",
    fontSize: "clamp(8px, 1.2vw, 11px)",
  },

  // 6. Bottom-Left Medium-Small Circle ([31.9%, 79.8%], diam: 17.2%)
  {
    id: "pod-bottom-left",
    name: "SalesX",
    isCenter: false,
    left: 23.3,
    top: 71.2,
    size: 17.2,
    bg: "#d9d9d9",
    logoSrc: "/home/SalesX Logo Final-01.png",
    fallbackText: "Logo",
  },

  // 7. Bottom-Right Medium Circle ([62.1%, 82.1%], diam: 18.9%)
  {
    id: "pod-bottom-right",
    name: "Sigma Life Unifirm",
    isCenter: false,
    left: 52.65,
    top: 72.65,
    size: 18.9,
    bg: "#d9d9d9",
    logoSrc: "/home/Sigma Life Unifirm Logo Png (1).png",
    fallbackText: "Logo",
  },

  // 8. Mid-Right Small Circle ([80.2%, 67.5%], diam: 13.0%)
  {
    id: "pod-mid-right",
    name: "Partner",
    isCenter: false,
    left: 73.7,
    top: 61.0,
    size: 13.0,
    bg: "#d9d9d9",
    fallbackText: "Logo",
    fontSize: "clamp(8px, 1.2vw, 11px)",
  },
];

export default function HiringPartners() {
  const sectionRef = useRef<HTMLElement>(null);
  const clusterWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(headingRef.current, {
        opacity: 0,
        scale: 0.65,
        y: 20,
        transformOrigin:
          typeof window !== "undefined" && window.innerWidth >= 1024
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

      tl.to(clusterWrapperRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.85,
        ease: "power3.out",
      }).to(
        headingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          keyframes: [
            { scale: 1.15, opacity: 1, y: -4, duration: 0.42, ease: "power2.out" },
            { scale: 0.94, y: 2, duration: 0.22, ease: "sine.inOut" },
            { scale: 1.0, y: 0, duration: 0.21, ease: "power2.out" },
          ],
        },
        "-=0.45",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="partner"
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
        className="pointer-events-none absolute inset-0 z-0 opacity-75"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.22) 1.1px, transparent 1.1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-310 grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* ---------- LEFT: EXACT MOCKUP CIRCLE CLUSTER ---------- */}
        <div className="flex justify-center lg:col-span-7">
          <div
            ref={clusterWrapperRef}
            className="relative aspect-square w-[min(480px,88vw)] sm:w-[min(520px,90vw)] max-w-full select-none"
          >
            {/* Outer subtle faint boundary ring */}
            <div className="pointer-events-none absolute inset-0 rounded-full border border-black/15" />

            {/* Inner crisp thin boundary ring containing all pods */}
            <div className="absolute inset-[3.5%] rounded-full border border-black/85 bg-white/20 backdrop-blur-[1px]">
              {/* 8 Scattered Circular Pods matching mockup */}
              {PODS.map((pod) => (
                <div
                  key={pod.id}
                  className={`group absolute rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-105 cursor-pointer select-none ${
                    pod.isCenter
                      ? "shadow-[0_1px_3px_rgba(0,0,0,0.12)] z-20 hover:shadow-[0_4px_16px_rgba(226,253,0,0.45)]"
                      : "shadow-[0_1px_3px_rgba(0,0,0,0.06)] z-10 hover:!bg-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] hover:z-30"
                  }`}
                  style={{
                    left: `${pod.left}%`,
                    top: `${pod.top}%`,
                    width: `${pod.size}%`,
                    height: `${pod.size}%`,
                    backgroundColor: pod.bg,
                  }}
                  title={pod.name}
                >
                  {pod.isCenter ? (
                    <span
                      className="font-serif font-normal text-black select-none tracking-tight transition-transform duration-200 group-hover:scale-105"
                      style={{ fontSize: pod.fontSize }}
                    >
                      {pod.fallbackText}
                    </span>
                  ) : pod.logoSrc ? (
                    <div className="flex h-full w-full items-center justify-center p-[16%]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pod.logoSrc}
                        alt={pod.name}
                        className="max-h-[52%] max-w-[66%] object-contain filter grayscale contrast-125 opacity-85 mix-blend-multiply transition-all duration-300 group-hover:grayscale-0 group-hover:contrast-100 group-hover:opacity-100 group-hover:scale-108"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <span
                      className="font-serif font-normal text-[#101010] select-none tracking-tight transition-transform duration-200 group-hover:scale-105"
                      style={{ fontSize: pod.fontSize }}
                    >
                      {pod.fallbackText}
                    </span>
                  )}
                </div>
              ))}
            </div>
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
