// components/home/SideNav.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Order matches the actual scroll order of the page (app/page.tsx), not
// alphabetical or design-doc order — the active index only advances sanely
// if this list and the real DOM order agree.
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
 * Fixed left-edge nav, present once for the whole page (at `lg` and up —
 * hidden entirely below that). Only visible while a real, labeled section
 * (`data-nav-section="<label>"` + `data-nav-theme="light" | "dark"`) is on
 * screen — hidden over Hero, ScrollText3D, or any other untagged stretch of
 * the page, not shown in some dim "resting" state.
 *
 * Detection is a continuous poll, not per-section ScrollTrigger
 * onEnter/onEnterBack callbacks: on every scroll frame (and on
 * ScrollTrigger's `refresh`, which fires after any pinned section's height
 * recalculates), it directly reads which tagged element's bounding rect
 * currently straddles the viewport's 55% line and sets state from that live
 * answer. This is what makes it correct in both scroll directions — an
 * edge-triggered enter/leave callback can desync from live layout on a pinned
 * section (RoleplayToConversation, CrossCountry and OurApproach all pin),
 * since pinning changes document height out from under cached trigger
 * boundaries; a value recomputed fresh every frame can't get stuck stale.
 *
 * One real label, "Choose Your Path", has no DOM tag at all: it lives on
 * TwoAudiences, which sits absolutely inset-0 inside RoleplayToConversation
 * and shares its parent's bounding rect for the whole pinned scroll, so a
 * geometry check on it would answer "The Promise" for the entire pin instead
 * of switching when the black-hole transition actually reveals it.
 * RoleplayToConversation's own timeline instead dispatches a
 * `vc:nav-override` CustomEvent at the exact scroll progress that matters,
 * toggling between "The Promise" and "Choose Your Path" for its whole pinned
 * duration — which is also why RoleplayToConversation's root section carries
 * no `data-nav-section` of its own: it would otherwise fight the poll above,
 * which re-answers "The Promise" on every single frame regardless of the
 * override.
 */
export default function SideNav() {
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [theme, setTheme] = useState<NavTheme>("dark");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const straddles55 = (el: HTMLElement, vh: number) => {
      const r = el.getBoundingClientRect();
      return r.top <= vh * 0.55 && r.bottom >= vh * 0.55;
    };

    const update = () => {
      const vh = window.innerHeight;

      // RoleplayToConversation owns its own nav state (both "The Promise"
      // and "Choose Your Path") via the vc:nav-override event below, for its
      // entire pinned duration — while its zone is under the 55% line, the
      // poll must not touch activeIndex at all, in either direction.
      const overrideZones = gsap.utils.toArray<HTMLElement>(
        "[data-nav-override-zone]",
      );
      if (overrideZones.some((zone) => straddles55(zone, vh))) return;

      const sections = gsap.utils.toArray<HTMLElement>("[data-nav-section]");
      const current = sections.find((s) => straddles55(s, vh));

      if (!current) {
        setActiveIndex(-1);
        return;
      }

      const label = current.dataset.navSection!;
      const sectionTheme = (current.dataset.navTheme as NavTheme) || "light";
      setActiveIndex(
        NAV_SECTIONS.indexOf(label as (typeof NAV_SECTIONS)[number]),
      );
      setTheme(sectionTheme);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    ScrollTrigger.addEventListener("refresh", update);

    const handleOverride = (event: Event) => {
      const detail = (event as CustomEvent<{ label: string; theme: NavTheme }>)
        .detail;
      const index = NAV_SECTIONS.indexOf(
        detail.label as (typeof NAV_SECTIONS)[number],
      );
      if (index === -1) return;
      setActiveIndex(index);
      setTheme(detail.theme);
    };
    window.addEventListener("vc:nav-override", handleOverride);

    return () => {
      window.removeEventListener("scroll", update);
      ScrollTrigger.removeEventListener("refresh", update);
      window.removeEventListener("vc:nav-override", handleOverride);
    };
  }, []);

  useEffect(() => {
    const visible = activeIndex !== -1;

    gsap.to(navRef.current, {
      opacity: visible ? 1 : 0,
      duration: 0.4,
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
        duration: 0.5,
        ease: "power2.out",
      });
    });

    const activeEl = itemRefs.current[activeIndex];
    if (arrowRef.current && activeEl) {
      gsap.to(arrowRef.current, {
        opacity: 1,
        y: activeEl.offsetTop,
        color: activeColor(theme),
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [activeIndex, theme]);

  return (
    <div
      ref={navRef}
      // z-60: the RoleplayToConversation -> TwoAudiences transition puts a
      // full-bleed overlay at z-50 right when this nav needs to read
      // "Choose Your Path", so the nav has to sit above every section overlay
      // in the page, not just the default stacking order.
      className="pointer-events-none fixed left-4 top-1/2 z-60 hidden -translate-y-1/2 opacity-0 sm:left-6 lg:left-10 lg:block"
    >
      <div className="relative flex flex-col gap-3">
        <span
          ref={arrowRef}
          style={{ opacity: 0 }}
          className="absolute -left-4 top-0 text-[9px] will-change-transform"
        >
          ▷
        </span>
        {NAV_SECTIONS.map((label, i) => (
          <div
            key={label}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="whitespace-nowrap text-[11px] tracking-wide will-change-[filter,opacity]"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
