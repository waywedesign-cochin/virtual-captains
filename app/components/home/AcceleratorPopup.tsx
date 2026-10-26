"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Lato } from "next/font/google";

// The design is set in Lato: Light title, Black "NOVEMBER 15"
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700", "900"] });

/* ---------- Edit these for each batch ---------- */
/** First batch start, IST. The countdown runs to this moment. */
const BATCH_START = new Date("2026-11-15T09:30:00+05:30");
const SLOTS_TOTAL = 50;
const SLOTS_TAKEN = 8;
/** Scrolls to the batch card, then opens Check Eligibility after 5s. */
const ENROLL_HREF = "/programs?enroll=1";
/* ----------------------------------------------- */

const PERCENT = Math.round((SLOTS_TAKEN / SLOTS_TOTAL) * 100);
const MONTH = BATCH_START.toLocaleString("en-US", {
  month: "long",
  timeZone: "Asia/Kolkata",
}).toUpperCase();
const DAY = BATCH_START.toLocaleString("en-US", {
  day: "numeric",
  timeZone: "Asia/Kolkata",
});
const EXIT_MS = 320;
/** Opens this long after the page loads, even if the visitor stays on the hero. */
const OPEN_DELAY_MS = 2000;

/**
 * SalesX Accelerator popup for the home page.
 *
 * Opens OPEN_DELAY_MS after the page has loaded (so it lands on the hero
 * once the hero's own intro has played), or straight away if the visitor
 * scrolls past the hero first. At most once per page load — after closing it
 * stays closed until a refresh. Enroll goes to the
 * programs page. Hidden entirely once the batch has started.
 */
export default function AcceleratorPopup() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (Date.now() >= BATCH_START.getTime()) return;

    let timer: number | undefined;
    let io: IntersectionObserver | undefined;
    const show = () => {
      if (shown.current) return;
      shown.current = true;
      window.clearTimeout(timer);
      io?.disconnect();
      // Next frame, so the open never lands mid-layout or mid-scroll-tick
      requestAnimationFrame(() => setOpen(true));
    };

    // Timed: count from full load so it never competes with the hero intro
    const startTimer = () => {
      timer = window.setTimeout(show, OPEN_DELAY_MS);
    };
    if (document.readyState === "complete") startTimer();
    else window.addEventListener("load", startTimer, { once: true });

    // Early: visitor scrolled past the hero before the timer fired
    const hero = document.getElementById("home");
    if (hero) {
      io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) show();
      });
      io.observe(hero);
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", startTimer);
      io?.disconnect();
    };
  }, []);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, EXIT_MS);
  }, []);

  // Escape to close + lock the page behind (same as the other site dialogs)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    const lenis = window.__lenis;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  if (!open) return null;

  return createPortal(
    <div
      className={`sx-root ${lato.className} ${closing ? "is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sx-title"
    >
      <style>{STYLES}</style>
      <div className="sx-backdrop" onClick={close} />

      <div className="sx-card" data-lenis-prevent>
        <span className="sx-sheen" aria-hidden />

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="sx-close"
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="sx-grid">
          {/* ---- Left ---- */}
          <div className="sx-main">
            <p className="sx-eyebrow sx-in" style={{ "--d": 0 } as Style}>
              Online &amp; Offline
            </p>
            <Image
              src="/salesx/salesx-logo.png"
              alt="SalesX by Virtual Captains"
              width={846}
              height={232}
              className="sx-logo sx-in"
              style={{ "--d": 1 } as Style}
            />
            <h2 id="sx-title" className="sx-title sx-in" style={{ "--d": 2 } as Style}>
              Accelerator
            </h2>

            <div className="sx-row sx-in" style={{ "--d": 3 } as Style}>
              <Countdown />
              <p className="sx-copy">
                Be among the first to experience SalesX and take your sales
                career to the next level.
              </p>
            </div>
          </div>

          {/* ---- Right ---- */}
          <div className="sx-side">
            <div className="sx-date sx-tile sx-in" style={{ "--d": 2 } as Style}>
              <span className="sx-date-label">First batch starts</span>
              <span className="sx-date-month">{MONTH}</span>
              <span className="sx-date-day">{DAY}</span>
            </div>
            <span className="sx-hot sx-in" style={{ "--d": 3 } as Style}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#fff"
                  d="M12.6 1.5c.4 3-1.2 4.6-2.7 6.3C8.3 9.6 6.5 11.5 6.5 14.6a5.5 5.5 0 0 0 11 0c0-2.4-1-4.4-2.2-5.9-.2 1.3-.9 2.3-1.9 2.6.6-3.4-.2-7.1-.8-9.8Z"
                />
                <path
                  fill="#ff5a36"
                  d="M12 21.2a2.9 2.9 0 0 1-2.9-2.9c0-1.7 1.3-2.7 2.3-4 .3 1 .9 1.6 1.7 1.8.1-.8.6-1.4 1.2-1.7.4.9.6 1.9.6 2.9A2.9 2.9 0 0 1 12 21.2Z"
                />
              </svg>
              Limited slots
            </span>
          </div>

          {/* ---- Bottom ---- */}
          <div className="sx-progress sx-in" style={{ "--d": 4 } as Style}>
            <LiquidBar />
            <span className="sx-slots-note">
              {SLOTS_TAKEN}/{SLOTS_TOTAL} Slots
            </span>
          </div>

          <div className="sx-cta sx-in" style={{ "--d": 5 } as Style}>
            <span className="sx-reg">Registration open</span>
            <Link href={ENROLL_HREF} onClick={close} className="sx-enroll">
              Enroll
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type Style = React.CSSProperties & Record<`--${string}`, string | number>;

/** Live days / hours / minutes to BATCH_START. Each digit box rolls on change. */
function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const total = Math.max(0, Math.floor((BATCH_START.getTime() - now) / 1000));
  const parts = [
    { label: "Days", value: Math.floor(total / 86400) },
    { label: "Hours", value: Math.floor((total % 86400) / 3600) },
    { label: "Min", value: Math.floor((total % 3600) / 60) },
  ];

  return (
    <div
      className="sx-count"
      role="timer"
      aria-label={`${parts[0].value} days, ${parts[1].value} hours, ${parts[2].value} minutes until the first batch`}
    >
      {parts.map((p, i) => (
        <div key={p.label} className="sx-count-cell">
          <span className="sx-count-label">{p.label}</span>
          <div className="sx-count-wrap">
            {i > 0 && <span className="sx-colon" aria-hidden>:</span>}
            <span className="sx-count-box sx-tile">
              {/* key change re-mounts the number → roll-in animation */}
              <span key={p.value} className="sx-count-num">
                {p.value}
              </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Slots bar: a glossy tube that fills like liquid — the front edge is a
 * moving wave, and the % counts up in step with the fill.
 */
function LiquidBar() {
  // Reduced motion: start full, skip the fill animation
  const [reduce] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [shown, setShown] = useState(reduce ? PERCENT : 0);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const startAt = performance.now() + 550; // after the card lands
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - startAt) / dur));
      const eased = 1 - Math.pow(1 - p, 4);
      setShown(eased * PERCENT);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div
      className="sx-bar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={SLOTS_TOTAL}
      aria-valuenow={SLOTS_TAKEN}
      aria-label={`${SLOTS_TAKEN} of ${SLOTS_TOTAL} slots filled`}
    >
      {/* Liquid front: the fill's right edge is masked into a rolling wave,
          so its shading runs through the wave with no seam */}
      <div className="sx-fill" style={{ width: `calc(${shown}% + 9px)` }}>
        <span className="sx-fill-pct">{Math.round(shown)}%</span>
      </div>
      <span className="sx-bar-total">{SLOTS_TOTAL} slots</span>
    </div>
  );
}

const STYLES = `
.sx-root {
  --lime-a: #8fdb58; --lime-b: #c8e361;
  --glass-edge: rgba(255,255,255,.55);
  --reg-h: 14px;
  position: fixed; inset: 0; z-index: 100;
  display: grid; grid-template-columns: minmax(0, 1fr); place-items: center;
  padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
  color: #fff;
}

/* Backdrop: deep tint that eases in with a growing blur */
.sx-backdrop {
  position: absolute; inset: 0;
  background: radial-gradient(120% 90% at 50% 40%, rgba(10,28,70,.55), rgba(2,6,18,.82));
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  will-change: opacity;
  animation: sx-fade .6s cubic-bezier(.22,1,.36,1) both;
}

/* ---- Premium glass card ---- */
.sx-card {
  position: relative; isolation: isolate;
  width: 100%; max-width: 740px; min-width: 0;
  max-height: calc(100dvh - 32px);
  overflow-y: auto; overscroll-behavior: contain;
  scrollbar-width: none;
  border-radius: 26px;
  padding: clamp(18px, 3.4vw, 30px);
  background:
    radial-gradient(90% 70% at 0% 0%, rgba(78,140,255,.20), transparent 60%),
    radial-gradient(70% 60% at 100% 100%, rgba(139,224,78,.10), transparent 60%),
    linear-gradient(145deg, rgba(38,52,80,.72), rgba(14,20,34,.78));
  backdrop-filter: blur(28px) saturate(170%);
  -webkit-backdrop-filter: blur(28px) saturate(170%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.28),
    inset 0 -1px 0 rgba(255,255,255,.06),
    inset 0 0 40px rgba(120,170,255,.08),
    0 0 0 1px rgba(255,255,255,.04),
    0 30px 80px -20px rgba(0,0,0,.7),
    0 0 90px -10px rgba(60,120,255,.35);
  animation: sx-pop 1s linear(0, .22 9%, .66 20%, .98 31%, 1.07 38%, 1.08 43%, 1.04 52%, .99 64%, 1) both;
  transform-origin: 50% 60%;
  will-change: transform, opacity;
}
.sx-card::-webkit-scrollbar { display: none; }
/* Light-catching rim: bright top-left & bottom-right, fading between */
.sx-card::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1.5px;
  background: linear-gradient(135deg, var(--glass-edge), rgba(255,255,255,.08) 30%, rgba(255,255,255,.04) 60%, rgba(255,255,255,.45));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none; z-index: 1;
}
/* Fine grain so the glass doesn't look like flat plastic */
.sx-card::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; z-index: -1;
  opacity: .07; mix-blend-mode: overlay; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
/* One light sweep across the glass as it lands */
.sx-sheen {
  position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; z-index: 0;
}
.sx-sheen::before {
  content: ""; position: absolute; top: -20%; bottom: -20%; width: 35%; left: 0;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,.10), transparent);
  transform: translateX(-150%) skewX(-18deg);
  animation: sx-sweep 1.6s .45s cubic-bezier(.45,0,.2,1) both;
}

/* Small glass tiles (date card, countdown boxes) */
.sx-tile {
  position: relative;
  background: linear-gradient(160deg, rgba(255,255,255,.10), rgba(255,255,255,.03));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.25), inset 0 0 0 1px rgba(255,255,255,.12), 0 10px 24px -12px rgba(0,0,0,.6);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
}

.sx-close {
  position: absolute; top: 10px; right: 10px; z-index: 3;
  width: 36px; height: 36px; border-radius: 999px; display: grid; place-items: center;
  background: rgba(255,255,255,.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14);
  color: rgba(255,255,255,.75); cursor: pointer; transition: background .2s, color .2s, transform .2s;
}
.sx-close:hover { background: rgba(255,255,255,.16); color: #fff; transform: rotate(90deg); }
.sx-close:focus-visible { outline: 2px solid var(--lime-b); outline-offset: 2px; }
.sx-close svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; }

/* ---- Layout: stacked on phones, two columns from tablet up ---- */
.sx-grid {
  position: relative; z-index: 2;
  display: grid; gap: 16px;
  grid-template-areas: "main" "side" "progress" "cta";
}
.sx-main { grid-area: main; min-width: 0; }
.sx-side { grid-area: side; display: flex; align-items: stretch; gap: 12px; }
.sx-progress { grid-area: progress; min-width: 0; }
.sx-cta { grid-area: cta; display: flex; flex-direction: column; gap: 8px; align-self: start; }

@media (min-width: 720px) {
  .sx-grid {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas: "main side" "progress cta";
    column-gap: 24px; row-gap: 18px;
    align-items: end;
  }
  .sx-side { flex-direction: column; align-self: start; margin-top: 30px; }
  /* "Registration open" sits above the button, so push the bar down by the
     label's height: bar and Enroll then share one centre line */
  .sx-progress { align-self: start; padding-top: calc(var(--reg-h) + 8px); }
  .sx-card { border-radius: 30px; }
}

.sx-eyebrow { font-size: 11.5px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; color: #fff; }
.sx-logo { margin-top: 14px; width: clamp(118px, 18vw, 150px); height: auto; }
.sx-title {
  margin-top: 4px; font-weight: 300; line-height: 1; letter-spacing: .01em; text-transform: uppercase;
  font-size: clamp(30px, 8.6vw, 54px); white-space: nowrap;
  color: #196cd6;
}

.sx-row { margin-top: 18px; display: flex; flex-wrap: wrap; align-items: center; gap: 14px 22px; }
.sx-copy { flex: 1 1 180px; max-width: 230px; margin-top: 18px; font-size: 13px; line-height: 1.5; color: #fff; }
@media (max-width: 719px) { .sx-copy { margin-top: 0; } }

/* Countdown */
.sx-count { display: flex; gap: 0; }
.sx-count-cell { display: flex; flex-direction: column; align-items: center; }
.sx-count-cell:not(:first-child) { margin-left: 4px; }
.sx-count-label { font-size: 10px; letter-spacing: .26em; text-transform: uppercase; color: #fff; margin-bottom: 6px; padding-left: 12px; }
.sx-count-cell:first-child .sx-count-label { padding-left: 0; }
.sx-count-wrap { display: flex; align-items: center; }
.sx-colon { width: 12px; text-align: center; color: var(--lime-a); font-weight: 700; }
.sx-count-box {
  display: grid; place-items: center; overflow: hidden;
  width: clamp(52px, 15vw, 60px); height: clamp(52px, 15vw, 60px); border-radius: 10px;
}
.sx-count-num {
  font-size: clamp(24px, 6.6vw, 30px); font-weight: 300; font-variant-numeric: tabular-nums;
  animation: sx-roll .5s cubic-bezier(.2,.9,.25,1.2) both;
}

/* Date card */
.sx-date {
  flex: 1; border-radius: 18px; padding: 14px 18px 8px;
  display: flex; flex-direction: column; align-items: flex-start;
}
.sx-date-label {
  font-size: 10.5px; font-weight: 500; letter-spacing: .04em; text-transform: uppercase; color: #fff;
  padding-bottom: 6px; width: fit-content;
  background: linear-gradient(90deg, var(--lime-a), transparent) bottom left / 100% 1.5px no-repeat;
}
.sx-date-month { margin-top: 8px; font-size: clamp(17px, 4.6vw, 22px); font-weight: 900; letter-spacing: .01em; line-height: 1; }
.sx-date-day {
  font-size: clamp(60px, 17vw, 108px); font-weight: 900; line-height: .9; letter-spacing: -.05em;
  margin-right: -.05em; /* undo the trailing letter-spacing so it centres true */
  background: linear-gradient(120deg, var(--lime-a), var(--lime-b));
  -webkit-background-clip: text; background-clip: text; color: transparent;

}
.sx-hot {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border-radius: 12px; padding: 10px; align-self: center;
  font-size: 14px; font-weight: 900; letter-spacing: .03em; text-transform: uppercase; white-space: nowrap;
  background: linear-gradient(90deg, #ff3530, #fe8f4a);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 10px 30px -10px rgba(255,80,60,.7);
  animation: sx-in .7s both, sx-pulse 2.4s 1.6s ease-in-out infinite;
  animation-delay: calc(var(--d, 0) * 70ms + 300ms), 1.6s;
}
.sx-hot svg { width: 18px; height: 18px; flex: none; }
@media (min-width: 720px) { .sx-hot { align-self: stretch; } }
/* Phones: date tile + slots chip sit side by side, chip stacked text */
/* Phones: one centred column */
@media (max-width: 719px) {
  .sx-main { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .sx-row { flex-direction: column; align-items: center; }
  .sx-copy { flex: none; max-width: 300px; }
  .sx-side { flex-direction: column; }
  .sx-hot { align-self: stretch; }
  .sx-slots-note { padding-left: 0; text-align: center; }

  /* Date card: centred label, then a compact "NOVEMBER 15" on one line */
  .sx-date {
    flex: none; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: baseline;
    column-gap: 10px; padding: 12px 16px 12px; text-align: center;
  }
  .sx-date-label { flex-basis: 100%; width: auto; padding-bottom: 8px; background-position: bottom center; background-size: 64px 1.5px; }
  .sx-date-label { background-image: linear-gradient(90deg, transparent, var(--lime-a), transparent); }
  .sx-date-month { margin-top: 10px; font-size: 22px; line-height: 1; }
  .sx-date-day { margin-top: 10px; font-size: 22px; line-height: 1; letter-spacing: .01em; margin-right: 0; }
}

/* ---- Liquid slots bar ---- */
.sx-bar {
  position: relative; height: 44px; border-radius: 999px; overflow: hidden;
  background:
    linear-gradient(90deg, rgba(255,255,255,0) 70%, rgba(255,255,255,.08)),
    linear-gradient(180deg, #323f52, #3d4a5b);
  box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.32), 0 8px 24px -12px rgba(0,0,0,.5);
}
.sx-fill {
  position: absolute; inset: 0 auto 0 0; min-width: 44px;
  border-radius: 999px 0 0 999px;
  background: linear-gradient(90deg, var(--lime-a), var(--lime-b));
  display: flex; align-items: center;
  --wave: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 100' preserveAspectRatio='none'%3E%3Cpath d='M0 0H9C17 12.5 17 37.5 9 50C1 62.5 1 87.5 9 100H0Z'/%3E%3C/svg%3E");
  -webkit-mask: linear-gradient(#000 0 0) left / calc(100% - 17px) 100% no-repeat, var(--wave) right 0 top 0 / 18px 100% repeat-y;
  mask: linear-gradient(#000 0 0) left / calc(100% - 17px) 100% no-repeat, var(--wave) right 0 top 0 / 18px 100% repeat-y;
  animation: sx-wave 1.1s linear infinite;
}
.sx-fill-pct {
  position: relative; z-index: 2; width: 100%; text-align: center; padding-right: 10px;
  font-size: 17px; font-weight: 500; font-variant-numeric: tabular-nums; color: #fff;
  text-shadow: 0 1px 4px rgba(40,90,0,.3);
}
.sx-bar-total {
  position: absolute; right: 24px; top: 50%; transform: translateY(-50%);
  font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: rgba(255,255,255,.55);
}
.sx-slots-note { display: block; margin-top: 6px; padding-left: 16px; font-size: 12px; font-style: italic; color: rgba(255,255,255,.8); }

/* CTA */
.sx-reg { height: var(--reg-h); line-height: var(--reg-h); text-align: center; font-size: 10.5px; letter-spacing: .3em; text-transform: uppercase; color: rgba(255,255,255,.85); }
.sx-enroll {
  position: relative; overflow: hidden;
  display: grid; place-items: center; height: 44px; border-radius: 999px;
  font-size: 21px; font-weight: 900; letter-spacing: .04em; text-transform: uppercase; color: #0b0e14;
  background: linear-gradient(90deg, var(--lime-a), var(--lime-b));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 14px 34px -12px rgba(160,230,80,.75);
  transition: transform .25s cubic-bezier(.2,.9,.3,1.3), box-shadow .25s;
}
.sx-enroll::after {
  content: ""; position: absolute; inset: 0; transform: translateX(-120%) skewX(-20deg);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
  animation: sx-shine 3.2s 2s ease-in-out infinite;
}
.sx-enroll:hover { transform: translateY(-2px) scale(1.02); box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 18px 40px -10px rgba(160,230,80,.9); }
.sx-enroll:active { transform: scale(.98); }
.sx-enroll:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

/* ---- Entrance / exit ---- */
.sx-in { animation: sx-in .8s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--d, 0) * 60ms + 280ms); }

.is-closing .sx-backdrop { animation: sx-fade .3s ease-in reverse both; }
.is-closing .sx-card { animation: sx-out .3s cubic-bezier(.4,0,1,1) both; }

@keyframes sx-fade { from { opacity: 0; } }
@keyframes sx-pop { from { opacity: 0; transform: translate3d(0, 36px, 0) scale(.92); } 30% { opacity: 1; } }
@keyframes sx-out { to { opacity: 0; transform: translate3d(0, 14px, 0) scale(.96); } }
@keyframes sx-in { from { opacity: 0; transform: translate3d(0, 12px, 0); } }
@keyframes sx-sweep { to { transform: translateX(420%) skewX(-18deg); } }
@keyframes sx-roll { from { transform: translateY(70%); opacity: 0; filter: blur(3px); } }
@keyframes sx-wave {
  from { -webkit-mask-position: left, right 0 top 0; mask-position: left, right 0 top 0; }
  to { -webkit-mask-position: left, right 0 top 44px; mask-position: left, right 0 top 44px; }
}
@keyframes sx-shine { 0%, 60% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(220%) skewX(-20deg); } }
@keyframes sx-pulse { 0%, 100% { box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 10px 30px -10px rgba(255,80,60,.7); } 50% { box-shadow: inset 0 1px 0 rgba(255,255,255,.35), 0 10px 40px -6px rgba(255,80,60,.95); } }

@media (prefers-reduced-motion: reduce) {
  .sx-root *, .sx-root *::before, .sx-root *::after { animation: none !important; transition: none !important; }
}
`;
