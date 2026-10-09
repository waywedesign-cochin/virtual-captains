"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A vertical news column that drifts on its own AND can be scrolled by hand:
 * swipe on touch screens, mouse wheel / trackpad, or click-and-drag with a
 * mouse. It's a real scroll container, so the browser handles touch and
 * wheel natively; we only nudge `scrollTop` while nobody is interacting.
 *
 * `children` must contain the item list TWICE (copy A then copy B): when the
 * position passes the half-way point it jumps back by half, which is
 * invisible because both halves look the same — an endless loop in either
 * direction.
 *
 * Hover (mouse) pauses it; after a touch / wheel / drag it resumes ~2s later.
 * With "reduce motion" it never auto-scrolls, but manual scrolling still works.
 */
export function AutoScrollColumn({
  children,
  direction = "up",
  speed = 28, // px per second
  className = "",
}: {
  children: ReactNode;
  direction?: "up" | "down";
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dir = direction === "down" ? -1 : 1;
    const half = () => el.scrollHeight / 2;

    let pos = direction === "down" ? half() : 0; // float, avoids rounding stalls
    let hovering = false;
    let resumeAt = 0; // timestamp until which auto-scroll waits
    let last = performance.now();
    let raf = 0;
    el.scrollTop = pos;

    const wrap = () => {
      const h = half();
      if (h <= 0) return;
      if (pos >= h) pos -= h;
      else if (pos < 0) pos += h;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced && !hovering && now >= resumeAt && !dragging) {
        pos += dir * speed * dt;
        wrap();
        el.scrollTop = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Manual scroll (wheel / touch / keyboard): follow it and keep it looping
    const pause = () => (resumeAt = performance.now() + 2000);
    const onScroll = () => {
      if (Math.abs(el.scrollTop - pos) > 1) {
        pos = el.scrollTop;
        wrap();
        if (pos !== el.scrollTop) el.scrollTop = pos;
      }
    };
    const onWheel = () => pause();
    const onTouch = () => pause();

    // Mouse drag to scroll (touch already scrolls natively)
    let dragging = false;
    let moved = 0;
    let startY = 0;
    let startPos = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      moved = 0;
      startY = e.clientY;
      startPos = pos;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dy = e.clientY - startY;
      moved = Math.max(moved, Math.abs(dy));
      if (moved > 4) {
        el.style.cursor = "grabbing";
        pos = startPos - dy;
        wrap();
        el.scrollTop = pos;
      }
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = "";
      pause();
    };
    // A drag shouldn't also open the story under the pointer
    const onClick = (e: MouseEvent) => {
      if (moved > 4) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouch, { passive: true });
    el.addEventListener("touchmove", onTouch, { passive: true });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", pause);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouch);
      el.removeEventListener("touchmove", onTouch);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", pause);
    };
  }, [direction, speed]);

  return (
    <div
      ref={ref}
      // data-lenis-prevent: the site's smooth scroller leaves wheel events
      // here alone, so the wheel scrolls this column instead of the page
      data-lenis-prevent
      className={`h-full min-w-0 cursor-grab touch-pan-y overflow-y-auto overscroll-contain select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}
