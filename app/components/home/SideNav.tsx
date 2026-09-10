// components/home/SideNav.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Order matches the actual scroll order of the page (app/page.tsx)
export const NAV_SECTIONS = [
  "The Promise",
  "Choose Your Path",
  "The Model",
  "Cross Country",
  "Endorsement",
  "The Impact",
  "Hiring Partners",
] as const;

type NavTheme = "light" | "dark";

const activeColor = (theme: NavTheme) =>
  theme === "dark" ? "#ffffff" : "#0a0b0d";
const restingColor = (theme: NavTheme) =>
  theme === "dark" ? "rgba(255,255,255,0.42)" : "rgba(10,11,13,0.32)";

/**
 * Fixed left-edge navigation on desktop (lg and up).
 * Smoothly tracks the user's progress through each section without gaps or flickering,
 * and enables instant, smooth click-to-scroll to every section.
 */
export default function SideNav() {
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [theme, setTheme] = useState<NavTheme>("dark");

  const activeIndexRef = useRef(-1);
  const themeRef = useRef<NavTheme>("dark");

  const setNavState = (idx: number, th?: NavTheme) => {
    if (activeIndexRef.current !== idx) {
      activeIndexRef.current = idx;
      setActiveIndex(idx);
    }
    if (th && themeRef.current !== th) {
      themeRef.current = th;
      setTheme(th);
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const update = () => {
      const vh = window.innerHeight;
      const scrollY = window.__lenis?.scroll ?? window.scrollY;

      const rpPin = ScrollTrigger.getById("roleplay-pin");
      const modelPin = ScrollTrigger.getById("model-pin");
      const ccPin = ScrollTrigger.getById("cross-country-pin");

      const roleplayTrigger =
        rpPin ||
        ScrollTrigger.getAll().find(
          (s) =>
            s.trigger === document.querySelector("[data-nav-override-zone]"),
        );

      if (!roleplayTrigger) {
        // ScrollTriggers may still be registering on initial load
        return;
      }

      const rpStart = roleplayTrigger.start;
      const rpEnd = roleplayTrigger.end;
      // The black hole consumes the screen at ~0.57 of the timeline
      const choosePathThreshold = rpStart + (rpEnd - rpStart) * 0.57;

      // 1. Above RoleplayToConversation (Hero & ScrollText3D): hide nav
      if (scrollY < rpStart - vh * 0.3) {
        setNavState(-1);
        return;
      }

      // 2. RoleplayToConversation - Stage 1: The Promise
      if (scrollY < choosePathThreshold) {
        setNavState(0, "light");
        return;
      }

      // 3. RoleplayToConversation - Stage 2: Choose Your Path (TwoAudiences)
      const modelStart = modelPin ? modelPin.start : rpEnd;
      if (scrollY < modelStart) {
        setNavState(1, "dark");
        return;
      }

      // 4. OurApproach - The Model
      const ccStart = ccPin
        ? ccPin.start
        : modelPin
          ? modelPin.end
          : modelStart + vh * 2;
      if (scrollY < ccStart) {
        setNavState(2, "light");
        return;
      }

      // 5. CrossCountry
      const ccEnd = ccPin ? ccPin.end : ccStart + vh * 3.5;
      if (scrollY < ccEnd + vh * 0.35) {
        setNavState(3, "light");
        return;
      }

      // 6. Trailing static sections: Endorsement, The Impact, Hiring Partners, Footer
      const impactEl = document.querySelector<HTMLElement>(
        '[data-nav-section="The Impact"]',
      );
      const hiringEl = document.querySelector<HTMLElement>(
        '[data-nav-section="Hiring Partners"]',
      );
      const footerEl = document.querySelector<HTMLElement>("footer");

      const impactTop = impactEl
        ? impactEl.getBoundingClientRect().top + scrollY
        : Infinity;
      const hiringTop = hiringEl
        ? hiringEl.getBoundingClientRect().top + scrollY
        : Infinity;
      const footerTop = footerEl
        ? footerEl.getBoundingClientRect().top + scrollY
        : Infinity;

      const midPoint = scrollY + vh * 0.45;

      if (midPoint >= footerTop) {
        setNavState(-1);
        return;
      }

      if (midPoint >= hiringTop) {
        setNavState(6, "light");
        return;
      }

      if (midPoint >= impactTop) {
        setNavState(5, "dark");
        return;
      }

      // Inside Endorsement
      setNavState(4, "dark");
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    ScrollTrigger.addEventListener("refresh", update);
    gsap.ticker.add(update);

    const handleOverride = (event: Event) => {
      const detail = (event as CustomEvent<{ label: string; theme: NavTheme }>)
        .detail;
      const index = NAV_SECTIONS.indexOf(
        detail.label as (typeof NAV_SECTIONS)[number],
      );
      if (index === -1) return;
      setNavState(index, detail.theme);
    };
    window.addEventListener("vc:nav-override", handleOverride);

    return () => {
      window.removeEventListener("scroll", update);
      ScrollTrigger.removeEventListener("refresh", update);
      gsap.ticker.remove(update);
      window.removeEventListener("vc:nav-override", handleOverride);
    };
  }, []);

  useEffect(() => {
    const visible = activeIndex !== -1;

    gsap.to(navRef.current, {
      opacity: visible ? 1 : 0,
      duration: 0.35,
      ease: "power2.out",
    });

    if (!visible) return;

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const distance = Math.abs(i - activeIndex);
      const isActive = i === activeIndex;
      gsap.to(el, {
        opacity: isActive ? 1 : Math.max(0.25, 0.55 - distance * 0.08),
        filter: isActive
          ? "blur(0px)"
          : `blur(${Math.min(distance * 0.6, 1.6)}px)`,
        fontWeight: isActive ? 600 : 400,
        color: isActive ? activeColor(theme) : restingColor(theme),
        duration: 0.4,
        ease: "power2.out",
      });
    });

    const activeEl = itemRefs.current[activeIndex];
    if (arrowRef.current && activeEl) {
      gsap.to(arrowRef.current, {
        opacity: 1,
        y: activeEl.offsetTop,
        color: activeColor(theme),
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [activeIndex, theme]);

  const scrollToSection = (index: number) => {
    const vh = window.innerHeight;
    const currentScroll = window.__lenis?.scroll ?? window.scrollY;

    const rpPin = ScrollTrigger.getById("roleplay-pin");
    const modelPin = ScrollTrigger.getById("model-pin");
    const ccPin = ScrollTrigger.getById("cross-country-pin");

    let targetY: number | null = null;

    switch (index) {
      case 0: // The Promise
        if (rpPin) {
          targetY = rpPin.start + 5;
        } else {
          const el = document.querySelector<HTMLElement>("#salesx");
          if (el) targetY = el.getBoundingClientRect().top + currentScroll;
        }
        break;

      case 1: // Choose Your Path (TwoAudiences inside RoleplayToConversation)
        if (rpPin) {
          targetY = rpPin.start + (rpPin.end - rpPin.start) * 0.68;
        } else {
          const el = document.querySelector<HTMLElement>("#salesx");
          if (el) targetY = el.getBoundingClientRect().top + currentScroll + 1400;
        }
        break;

      case 2: // The Model
        if (modelPin) {
          targetY = modelPin.start + 5;
        } else {
          const el = document.querySelector<HTMLElement>(
            '[data-nav-section="The Model"]',
          );
          if (el) targetY = el.getBoundingClientRect().top + currentScroll;
        }
        break;

      case 3: // Cross Country
        if (ccPin) {
          targetY = ccPin.start + 5;
        } else {
          const el = document.querySelector<HTMLElement>(
            '[data-nav-section="Cross Country"]',
          );
          if (el) targetY = el.getBoundingClientRect().top + currentScroll;
        }
        break;

      case 4: { // Endorsement
        const el = document.querySelector<HTMLElement>(
          '[data-nav-section="Endorsement"]',
        );
        if (el) {
          targetY = el.getBoundingClientRect().top + currentScroll;
        } else if (ccPin) {
          targetY = ccPin.end + vh;
        }
        break;
      }

      case 5: { // The Impact
        const el = document.querySelector<HTMLElement>(
          '[data-nav-section="The Impact"]',
        );
        if (el) {
          targetY = el.getBoundingClientRect().top + currentScroll;
        }
        break;
      }

      case 6: { // Hiring Partners
        const el = document.querySelector<HTMLElement>(
          '[data-nav-section="Hiring Partners"]',
        );
        if (el) {
          targetY = el.getBoundingClientRect().top + currentScroll;
        }
        break;
      }
    }

    if (targetY !== null && !isNaN(targetY)) {
      if (window.__lenis) {
        window.__lenis.scrollTo(targetY, { duration: 1.3, lock: false });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
  };

  return (
    <div
      ref={navRef}
      className="pointer-events-none fixed left-4 top-1/2 z-60 hidden -translate-y-1/2 opacity-0 sm:left-6 lg:left-10 lg:block"
    >
      <div className="relative flex flex-col gap-3">
        <span
          ref={arrowRef}
          style={{ opacity: 0 }}
          className="pointer-events-none absolute -left-4 top-0 text-[9px] will-change-transform"
        >
          ▷
        </span>
        {NAV_SECTIONS.map((label, i) => (
          <button
            type="button"
            key={label}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onClick={() => scrollToSection(i)}
            className="pointer-events-auto cursor-pointer bg-transparent border-0 p-0 text-left whitespace-nowrap text-[11px] tracking-wide will-change-[filter,opacity] transition-transform duration-200 hover:scale-105 active:scale-95"
            aria-label={`Scroll to ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
