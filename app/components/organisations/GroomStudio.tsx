"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { allProgrammes, ProgramCard } from "./data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// Split title into first word with blue-to-white gradient line and remaining words
function renderStyledTitle(fullTitle: string) {
  const parts = fullTitle.split(" ");
  const firstWord = parts[0];
  const rest = parts.slice(1).join(" ");

  return (
    <span className="relative inline-flex items-baseline gap-2 pb-1.5">
      <span className="relative inline-block font-bold text-slate-900">
        {firstWord}
        {/* Blue to white gradient line underneath */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 sm:-bottom-1.5 left-0 w-full h-1 sm:h-1.25 rounded-full bg-linear-to-r from-[#2563eb] via-[#60a5fa] to-white"
          style={{
            background:
              "linear-gradient(to right, #2563eb, #60a5fa 70%, #ffffff 100%)",
          }}
        />
      </span>
      <span className="font-medium text-slate-800">{rest}</span>
    </span>
  );
}

export default function GroomStudio() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Active card index per programme
  const [cardIndices, setCardIndices] = useState<number[]>([0, 0, 0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe support for mobile and tablets
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Switch card within the active programme
  const changeCard = useCallback((progIdx: number, newCardIdx: number) => {
    setCardIndices((prev) => {
      const next = [...prev];
      const numCards = allProgrammes[progIdx].cards.length;
      next[progIdx] = (newCardIdx + numCards) % numCards;
      return next;
    });
  }, []);

  const prevCard = useCallback(() => {
    changeCard(activeTab, cardIndices[activeTab] - 1);
  }, [activeTab, cardIndices, changeCard]);

  const nextCard = useCallback(() => {
    changeCard(activeTab, cardIndices[activeTab] + 1);
  }, [activeTab, cardIndices, changeCard]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      nextCard();
    } else if (distance < -minSwipeDistance) {
      prevCard();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Auto-advance cards inside the currently active programme
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCardIndices((prev) => {
        const next = [...prev];
        const numCards = allProgrammes[activeTab].cards.length;
        next[activeTab] = (next[activeTab] + 1) % numCards;
        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [activeTab, isPaused]);

  // Direct tab click navigation
  const handleTabClick = (index: number) => {
    if (!trackRef.current) return;
    const st = ScrollTrigger.getById("groom-scroll-trigger");
    if (st) {
      const scrollStart = st.start;
      const scrollRange = st.end - st.start;
      const targetProgress = (index + 0.15) / 4;
      const targetScroll = scrollStart + targetProgress * scrollRange;

      if (window.__lenis) {
        window.__lenis.scrollTo(targetScroll, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    }
  };

  useGSAP(
    () => {
      const pinEl = pinRef.current;
      const trackEl = trackRef.current;
      if (!pinEl || !trackEl) return;

      const numStages = allProgrammes.length;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          id: "groom-scroll-trigger",
          trigger: trackEl,
          start: "top top",
          end: "+=380%",
          pin: pinEl,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const currentIdx = Math.min(
              numStages - 1,
              Math.floor(p * numStages),
            );
            setActiveTab(currentIdx);
          },
        },
      });

      // Initial state
      allProgrammes.forEach((_, i) => {
        if (i === 0) {
          gsap.set(`.prog-slide-${i}`, { autoAlpha: 1, zIndex: 10 });
          gsap.set(`.prog-slide-${i} .text-node`, { y: 0, opacity: 1 });
          gsap.set(`.prog-slide-${i} .cards-stack`, { y: 0, opacity: 1 });
        } else {
          gsap.set(`.prog-slide-${i}`, { autoAlpha: 0, zIndex: 5 });
          gsap.set(`.prog-slide-${i} .text-node`, { y: 25, opacity: 0 });
          gsap.set(`.prog-slide-${i} .cards-stack`, { y: 25, opacity: 0 });
        }
      });

      // Smooth clean transitions across programmes on scroll
      for (let i = 0; i < numStages - 1; i++) {
        const nextIdx = i + 1;
        const outLabel = `trans-${i}-out`;
        const inLabel = `trans-${i}-in`;

        masterTl.addLabel(outLabel, "+=0.35");

        // Clean exit
        masterTl.to(
          `.prog-slide-${i} .text-node`,
          {
            y: -20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.in",
          },
          outLabel,
        );

        masterTl.to(
          `.prog-slide-${i} .cards-stack`,
          {
            y: -20,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
          },
          outLabel,
        );

        masterTl.set(`.prog-slide-${i}`, { autoAlpha: 0, zIndex: 1 }, `+=0.05`);
        masterTl.set(`.prog-slide-${nextIdx}`, { autoAlpha: 1, zIndex: 10 });

        // Clean entrance
        masterTl.addLabel(inLabel, "<");

        masterTl.fromTo(
          `.prog-slide-${nextIdx} .text-node`,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: "power3.out",
          },
          inLabel,
        );

        masterTl.fromTo(
          `.prog-slide-${nextIdx} .cards-stack`,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          },
          `${inLabel}+=0.08`,
        );

        masterTl.to({}, { duration: 0.4 });
      }
    },
    { scope: trackRef },
  );

  return (
    <section
      ref={trackRef}
      id="programmes-showcase"
      className="relative w-full bg-[#f8f9fa] text-slate-900"
      style={{ minHeight: "400vh" }}
    >
      {/* Pinned Viewport Container - Dynamic 100dvh for mobile address bar resilience */}
      <div
        ref={pinRef}
        className="sticky top-0 left-0 w-full h-screen h-[100dvh] max-h-screen max-h-[100dvh] overflow-hidden flex flex-col justify-between pt-16 sm:pt-20 lg:pt-22 pb-3 sm:pb-5 px-4 sm:px-8 lg:px-12 bg-[#f8f9fa]"
      >
        <div className="w-full max-w-372 mx-auto flex flex-col h-full justify-between">
          {/* Top Header: Responsive title and horizontally-scrollable tabs on mobile */}
          <div className="w-full border-b border-slate-200 pb-2 sm:pb-3 mb-1.5 sm:mb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-4">
              {/* LEFT: Active Programme Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-slate-900 tracking-tight transition-all duration-300 shrink-0">
                {renderStyledTitle(allProgrammes[activeTab].tabTitle)}
              </h2>

              {/* RIGHT: Other Programme Tabs */}
              <div className="flex items-center gap-3.5 sm:gap-5 md:gap-7 text-xs sm:text-sm lg:text-base font-medium overflow-x-auto no-scrollbar scroll-smooth py-0.5 -mb-1 max-w-full">
                {allProgrammes.map((p, idx) => {
                  const isActive = idx === activeTab;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleTabClick(idx)}
                      className={`relative py-1 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                        isActive
                          ? "text-slate-900 font-semibold"
                          : "text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      <span>{p.tabTitle}</span>
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-blue-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Content Slides Container */}
          <div
            className="relative flex-1 flex flex-col justify-between min-h-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {allProgrammes.map((prog, pIdx) => {
              const currentCardIdx = cardIndices[pIdx] || 0;
              const totalCards = prog.cards.length;

              // 3 overlapping cards: Left behind, Center in front, Right behind
              const prevIdx = (currentCardIdx - 1 + totalCards) % totalCards;
              const nextIdx = (currentCardIdx + 1) % totalCards;

              const prevCardItem = prog.cards[prevIdx];
              const activeCard = prog.cards[currentCardIdx];
              const nextCardItem = prog.cards[nextIdx];

              return (
                <div
                  key={prog.id}
                  className={`prog-slide-${pIdx} absolute inset-0 flex flex-col justify-between pointer-events-auto`}
                >
                  {/* Top Text Row: Responsive 2-column layout */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-4 md:gap-6 lg:gap-8 items-start mb-1 sm:mb-2">
                    {/* Left Column: Badges, Headline & Action CTA */}
                    <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between">
                      <div>
                        <div className="text-node flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5 flex-wrap">
                          <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-800">
                            {prog.badgeCategory}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 border border-red-200/80 bg-red-50 text-red-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            {prog.badgeMode}
                          </span>
                        </div>

                        <h3 className="text-node text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-[#2563eb] leading-snug tracking-tight mb-2 sm:mb-2.5">
                          {prog.title}
                        </h3>
                      </div>

                      <div className="text-node flex items-center">
                        <Link
                          href={prog.ctaAction}
                          className="group inline-flex items-center gap-2 bg-white border border-slate-200/90 rounded-full pl-2 pr-3 sm:pr-3.5 py-1 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                          {/* <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#8FE07A] flex items-center justify-center text-[#134A1E] font-bold text-[9px] sm:text-[10px]">
                            Book
                          </div> */}
                          <span className="text-[11px] sm:text-xs font-semibold text-slate-800">
                            {prog.ctaText}
                          </span>
                          <svg
                            className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Full narrative description without truncation */}
                    <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-center md:pl-5 lg:pl-6 border-l-0 md:border-l md:border-slate-200/80 pt-0.5">
                      <p className="text-node text-xs sm:text-[13px] md:text-sm text-slate-600 leading-relaxed font-normal">
                        {prog.description}
                      </p>
                    </div>
                  </div>

                  {/* Overlapping Stacked Cards Stage with Touch Swipe Support */}
                  <div
                    className="cards-stack flex-1 flex flex-col justify-center items-center my-auto w-full py-0.5 sm:py-1"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div className="relative flex items-center justify-center w-full max-w-4xl mx-auto my-auto min-h-[225px] sm:min-h-[280px] md:min-h-[320px] select-none">
                      {/* Left Floating Deck Nav Arrow */}
                      <button
                        type="button"
                        onClick={prevCard}
                        aria-label="Previous card"
                        className="absolute left-0 sm:left-1 md:left-2 z-30 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      {/* Left Card (Overlapping behind center) */}
                      <div
                        onClick={prevCard}
                        className={`absolute left-1 sm:left-[5%] md:left-[8%] lg:left-[12%] z-10 w-[175px] sm:w-[245px] md:w-[275px] h-[195px] sm:h-[255px] md:h-[285px] rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 md:p-6 flex flex-col items-center justify-center text-center text-white cursor-pointer shadow-lg scale-90 sm:scale-100 opacity-60 sm:opacity-95 transition-all duration-500 hover:scale-95 sm:hover:scale-102 hover:z-25 ${prevCardItem.bgClass}`}
                      >
                        <div className="bg-white/20 border border-white/30 backdrop-blur-md rounded-xl sm:rounded-2xl py-1.5 sm:py-2 px-3 sm:px-5 font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-4 shadow-xs select-none">
                          {prevCardItem.title}
                        </div>
                        <p className="text-[10px] sm:text-xs md:text-[13px] font-medium leading-relaxed max-w-[145px] sm:max-w-[190px] text-white select-none line-clamp-3 sm:line-clamp-none">
                          {prevCardItem.description}
                        </p>
                      </div>

                      {/* Center Card (Hero / Featured) */}
                      <div
                        className={`relative z-20 w-[235px] sm:w-[285px] md:w-[315px] h-[225px] sm:h-[285px] md:h-[320px] rounded-2xl sm:rounded-[30px] p-4 sm:p-6 md:p-7 flex flex-col items-center justify-center text-center text-white shadow-2xl shadow-blue-600/35 transition-all duration-500 ${activeCard.bgClass}`}
                      >
                        <div className="bg-white/25 border border-white/35 backdrop-blur-md rounded-xl sm:rounded-2xl py-1.5 sm:py-2.5 px-4 sm:px-7 font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-4 shadow-inner select-none">
                          {activeCard.title}
                        </div>
                        <p className="text-[11px] sm:text-xs md:text-sm lg:text-[15px] font-medium leading-relaxed max-w-[195px] sm:max-w-[225px] text-white select-none">
                          {activeCard.description}
                        </p>
                      </div>

                      {/* Right Card (Overlapping behind center) */}
                      <div
                        onClick={nextCard}
                        className={`absolute right-1 sm:right-[5%] md:right-[8%] lg:right-[12%] z-10 w-[175px] sm:w-[245px] md:w-[275px] h-[195px] sm:h-[255px] md:h-[285px] rounded-2xl sm:rounded-[28px] p-3.5 sm:p-5 md:p-6 flex flex-col items-center justify-center text-center text-white cursor-pointer shadow-lg scale-90 sm:scale-100 opacity-60 sm:opacity-95 transition-all duration-500 hover:scale-95 sm:hover:scale-102 hover:z-25 ${nextCardItem.bgClass}`}
                      >
                        <div className="bg-white/20 border border-white/30 backdrop-blur-md rounded-xl sm:rounded-2xl py-1.5 sm:py-2 px-3 sm:px-5 font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-4 shadow-xs select-none">
                          {nextCardItem.title}
                        </div>
                        <p className="text-[10px] sm:text-xs md:text-[13px] font-medium leading-relaxed max-w-[145px] sm:max-w-[190px] text-white select-none line-clamp-3 sm:line-clamp-none">
                          {nextCardItem.description}
                        </p>
                      </div>

                      {/* Right Floating Deck Nav Arrow */}
                      <button
                        type="button"
                        onClick={nextCard}
                        aria-label="Next card"
                        className="absolute right-0 sm:right-1 md:right-2 z-30 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Dedicated Prominent Pagination Bar */}
                    <div className="mt-2 sm:mt-3 flex items-center justify-center gap-2 sm:gap-3 z-30">
                      {/* Prev Button */}
                      <button
                        type="button"
                        onClick={prevCard}
                        aria-label="Previous card slide"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      {/* Clickable Pagination Dots with Active Expansion */}
                      <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs">
                        {prog.cards.map((c, cIdx) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => changeCard(pIdx, cIdx)}
                            aria-label={`Jump to card ${cIdx + 1}: ${c.title}`}
                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                              currentCardIdx === cIdx
                                ? "w-5 sm:w-6 bg-blue-600 shadow-xs"
                                : "w-1.5 sm:w-2 bg-slate-300 hover:bg-slate-400"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Next Button */}
                      <button
                        type="button"
                        onClick={nextCard}
                        aria-label="Next card slide"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      {/* Card Counter Badge */}
                      <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 tracking-wider">
                        {currentCardIdx + 1} / {totalCards}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
