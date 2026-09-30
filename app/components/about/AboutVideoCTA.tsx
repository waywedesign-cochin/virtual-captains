"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CHANNEL_URL = "https://www.youtube.com/@VirtualCaptains";

type ChannelVideo =
  | { kind: "recent"; id: string; title: string; meta: string }
  | { kind: "upcoming"; title: string; meta: string };

// Edit this list as videos go live: a "recent" item needs its YouTube ID
// (the part after watch?v=); "upcoming" items show a Coming Soon card.
const VIDEOS: ChannelVideo[] = [
  { kind: "recent", id: "ulkbdVqfCNI", title: "Virtual Captains Will Turn Your Leads to Lasting Sales", meta: "Latest Video" },
  { kind: "upcoming", title: "Handling Objections Live", meta: "Premieres Soon" },
  { kind: "upcoming", title: "From Fresher to Closer: A SalesX Story", meta: "Premieres Soon" },
];

export default function AboutVideoCTA() {
  const firstRecent = VIDEOS.find((v) => v.kind === "recent");
  const [activeId, setActiveId] = useState(firstRecent && firstRecent.kind === "recent" ? firstRecent.id : "");
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const ctaOuterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sort and refresh all ScrollTriggers across the page to ensure accurate offsets
    const timer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 150);

    const handleLoad = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) {
      if (videoWrapperRef.current) gsap.set(videoWrapperRef.current, { opacity: 1, x: 0 });
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener("load", handleLoad);
      };
    }

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(videoWrapperRef.current, { opacity: 0, x: -35 });
      gsap.set(".vc-audience-cta", { opacity: 0, y: 24 });

      // Entrance animation on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 78%",
        once: true,
        refreshPriority: 5,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          // 1. Reveal video from left
          tl.to(
            videoWrapperRef.current,
            {
              opacity: 1,
              x: 0,
              duration: 0.95,
            },
            0
          );

          // 2. Heading, video list and subscribe button rise in one after the other
          tl.fromTo(
            ".vc-audience-cta",
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
            0.2
          );
        },
      });
    }, sectionRef);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        role="region"
        aria-label="Recent and upcoming YouTube videos"
        className="relative z-20 w-full overflow-hidden py-12 sm:py-16 lg:py-24 select-none flex flex-col items-center justify-center"
      >

        {/* ── Standard Navbar max-width Container (max-w-372) ── */}
        <div className="w-full max-w-372 mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12 relative z-10">
          
          {/* Two-Column Grid: Video on Left, YouTube list on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-14 items-center">
            
            {/* ── LEFT COLUMN: YouTube Iframe Container ── */}
            <div
              ref={videoWrapperRef}
              className="lg:col-span-7 w-full flex items-center justify-center will-change-transform"
            >
              <div className="relative w-full max-w-[calc((100svh-6rem)*16/9)] mx-auto aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-black/90 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl group hover:border-white/35 transition-colors duration-500">
                {/* Subtle top rim light */}
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10" />
                
                <iframe
                  src={`https://www.youtube.com/embed/${activeId}`}
                  title="Virtual Captains Video Presentation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>

            {/* ── RIGHT COLUMN: recent + upcoming YouTube videos ── */}
            <div
              ref={ctaOuterRef}
              className="lg:col-span-5 w-full flex flex-col items-center gap-4 sm:gap-5 lg:items-start lg:pl-6 xl:pl-10"
            >
              <div className="vc-audience-cta text-center lg:text-left">
                <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/50">
                  On YouTube
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-white">
                  Recent &amp;{" "}
                  <span className="bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text italic text-transparent">
                    Upcoming
                  </span>{" "}
                  Videos
                </h2>
              </div>

              <ul className="flex w-full max-w-md flex-col gap-3">
                {VIDEOS.map((v) => {
                  const isActive = v.kind === "recent" && v.id === activeId;
                  const body = (
                    <>
                      <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#0b1a44] sm:w-32">
                        {v.kind === "recent" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,rgba(37,99,235,0.35),transparent_70%)]">
                            <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        )}
                      </span>
                      <span className="flex min-w-0 flex-col text-left">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                            v.kind === "recent" ? "text-[#F3FC00]" : "text-sky-300"
                          }`}
                        >
                          {isActive ? "Now Playing" : v.meta}
                        </span>
                        <span className="mt-1 text-sm sm:text-[15px] font-medium leading-snug text-white">
                          {v.title}
                        </span>
                      </span>
                    </>
                  );
                  const base =
                    "vc-audience-cta flex w-full items-center gap-4 rounded-2xl border p-2.5 pr-4 backdrop-blur-md transition-all duration-300";
                  return (
                    <li key={v.title}>
                      {v.kind === "recent" ? (
                        <button
                          type="button"
                          onClick={() => setActiveId(v.id)}
                          aria-pressed={isActive}
                          className={`${base} cursor-pointer ${
                            isActive
                              ? "border-[#F3FC00]/50 bg-white/[0.08]"
                              : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]"
                          }`}
                        >
                          {body}
                        </button>
                      ) : (
                        <div className={`${base} border-dashed border-white/15 bg-white/[0.02]`}>{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <a
                href={CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="vc-audience-cta group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#F3FC00] px-6 text-sm sm:text-base font-semibold text-[#020B25] shadow-[0_0_28px_rgba(243,252,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(243,252,0,0.4)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
                </svg>
                Subscribe on YouTube
              </a>
            </div>
          </div>

        </div>
      </section>

    </>
  );
}
