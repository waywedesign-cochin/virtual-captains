"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Lato } from "next/font/google";

// The design is set in Lato: Light "ACCELERATOR" / "THANK YOU", Black CTA
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700", "900"] });

/* ---------- Edit these for each batch ---------- */
/** Shown on the corner ribbon: "First batch starts <MONTH>". */
const BATCH_MONTH = "November";
/** Scrolls to the batch card, then opens Check Eligibility after 5s. */
const ENROLL_HREF = "/programs?enroll=1";
/* ----------------------------------------------- */

const EXIT_MS = 320;
/** Opens this long after the page loads, even if the visitor stays on the hero. */
const OPEN_DELAY_MS = 2000;

/**
 * SalesX Accelerator popup for the home page ("Thank you for your interest",
 * registrations under review, last window to check eligibility).
 *
 * Opens OPEN_DELAY_MS after the page has loaded (so it lands on the hero
 * once the hero's own intro has played), or straight away if the visitor
 * scrolls past the hero first. At most once per page load — after closing it
 * stays closed until a refresh. Check Eligibility goes to the programs page.
 */
export default function AcceleratorPopup() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
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

        {/* Corner ribbon, flush to the card's right edge */}
        <div className="sx-ribbon sx-in" style={{ "--d": 1 } as Style}>
          <span className="sx-ribbon-label">First batch starts</span>
          <span className="sx-ribbon-month">{BATCH_MONTH}</span>
        </div>

        <div className="sx-grid">
          {/* ---- Top left ---- */}
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
            <p className="sx-status sx-in" style={{ "--d": 3 } as Style}>
              <Spinner />
              Registrations are currently under review
            </p>
          </div>

          {/* ---- Top right ---- */}
          <div className="sx-thanks sx-in" style={{ "--d": 3 } as Style}>
            <p className="sx-thanks-big">Thank you</p>
            <p className="sx-thanks-sub">for your interest!</p>
            <span className="sx-thanks-rule" aria-hidden />
          </div>

          {/* ---- Bottom left ---- */}
          <div className="sx-note sx-in" style={{ "--d": 4 } as Style}>
            <p>
              You can still check your eligibility for the programme, and
              shortlisted applicants will be placed in a queue
            </p>
            <Chevrons />
          </div>

          {/* ---- Bottom right ---- */}
          <div className="sx-cta sx-in" style={{ "--d": 5 } as Style}>
            <span className="sx-reg">Last window to join</span>
            <Link href={ENROLL_HREF} onClick={close} className="sx-enroll">
              Check Eligibility
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type Style = React.CSSProperties & Record<`--${string}`, string | number>;

/** Lime "loading" ring of 12 ticks that steps round, like the design's icon. */
function Spinner() {
  return (
    <svg className="sx-spinner" viewBox="0 0 24 24" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="12"
          y1="2.5"
          x2="12"
          y2="7"
          transform={`rotate(${i * 30} 12 12)`}
          opacity={0.3 + (i / 11) * 0.7}
        />
      ))}
    </svg>
  );
}

/** Three green chevrons that light up in sequence, pointing at the CTA. */
function Chevrons() {
  return (
    <svg className="sx-chevrons" viewBox="0 0 64 40" aria-hidden>
      <defs>
        <linearGradient id="sx-chev" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#16c25a" />
          <stop offset="1" stopColor="#b8ec5c" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${4 + i * 16} 4 L${20 + i * 16} 20 L${4 + i * 16} 36`}
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </svg>
  );
}

const STYLES = `
.sx-root {
  --lime-a: #8fdb58; --lime-b: #c8e361;
  --hot-a: #ff3a33; --hot-b: #ff8a4c;
  --glass-edge: rgba(255,255,255,.55);
  position: fixed; inset: 0; z-index: 100;
  display: grid; grid-template-columns: minmax(0, 1fr); place-items: center;
  padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
  color: #fff;
}

/* Backdrop: deep tint that eases in */
.sx-backdrop {
  position: absolute; inset: 0;
  background: radial-gradient(120% 90% at 50% 40%, rgba(10,28,70,.55), rgba(2,6,18,.82));
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  will-change: opacity;
  animation: sx-fade .6s cubic-bezier(.22,1,.36,1) both;
}

/* ---- Premium glass card ----
   The card is a size container: on desktop every measurement is a share of
   the card's width (cqi), taken from the design, so it keeps the design's
   exact proportions at any screen size. */
.sx-card {
  container: sx / inline-size;
  position: relative; isolation: isolate;
  width: 100%; max-width: 1000px; min-width: 0;
  max-height: calc(100dvh - 32px);
  overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain;
  scrollbar-width: none;
  border-radius: 28px;
  background:
    radial-gradient(90% 70% at 0% 0%, rgba(78,140,255,.16), transparent 60%),
    linear-gradient(145deg, rgba(34,46,70,.80), rgba(16,24,40,.84));
  backdrop-filter: blur(28px) saturate(170%);
  -webkit-backdrop-filter: blur(28px) saturate(170%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.28),
    inset 0 -1px 0 rgba(255,255,255,.06),
    inset 0 0 40px rgba(120,170,255,.08),
    0 30px 80px -20px rgba(0,0,0,.7),
    0 0 90px -10px rgba(60,120,255,.35);
  animation: sx-pop 1s linear(0, .22 9%, .66 20%, .98 31%, 1.07 38%, 1.08 43%, 1.04 52%, .99 64%, 1) both;
  transform-origin: 50% 60%;
  will-change: transform, opacity;
}
.sx-card::-webkit-scrollbar { display: none; }
/* Light-catching rim */
.sx-card::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 2px;
  background: linear-gradient(135deg, var(--glass-edge), rgba(255,255,255,.10) 30%, rgba(255,255,255,.06) 60%, rgba(255,255,255,.5));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none; z-index: 4;
}
/* Fine grain so the glass doesn't look like flat plastic */
.sx-card::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; z-index: -1;
  opacity: .07; mix-blend-mode: overlay; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.sx-sheen { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; pointer-events: none; z-index: 0; }
.sx-sheen::before {
  content: ""; position: absolute; top: -20%; bottom: -20%; width: 35%; left: 0;
  background: linear-gradient(100deg, transparent, rgba(255,255,255,.10), transparent);
  transform: translateX(-150%) skewX(-18deg);
  animation: sx-sweep 1.6s .45s cubic-bezier(.45,0,.2,1) both;
}

.sx-close {
  position: absolute; top: 12px; right: 12px; z-index: 5;
  width: 36px; height: 36px; border-radius: 999px; display: grid; place-items: center;
  background: rgba(255,255,255,.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14);
  color: rgba(255,255,255,.75); cursor: pointer; transition: background .2s, color .2s, transform .2s;
}
.sx-close:hover { background: rgba(255,255,255,.16); color: #fff; transform: rotate(90deg); }
.sx-close:focus-visible { outline: 2px solid var(--lime-b); outline-offset: 2px; }
.sx-close svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; }

/* ================= Phones (card narrower than 640px) =================
   One centred column; the ribbon sits on top, flush to the right edge. */
.sx-ribbon {
  position: relative; z-index: 3;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  width: fit-content; margin: 0 auto;
  padding: 12px 22px 24px;
  background: linear-gradient(180deg, var(--hot-a), var(--hot-b));
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 14px), 50% 100%, 0 calc(100% - 14px));
  box-shadow: 0 10px 30px -10px rgba(255,80,60,.7);
}
.sx-ribbon-label { font-size: 10.5px; font-weight: 700; letter-spacing: .02em; text-transform: uppercase; line-height: 1.1; }
.sx-ribbon-month { font-size: 20px; font-weight: 900; letter-spacing: .01em; text-transform: uppercase; line-height: 1.05; }

.sx-grid {
  position: relative; z-index: 2;
  display: grid; gap: 20px; padding: 18px 22px 24px;
  grid-template-areas: "main" "thanks" "note" "cta";
}
.sx-main { grid-area: main; min-width: 0; display: flex; flex-direction: column; align-items: center; text-align: center; }
.sx-thanks { grid-area: thanks; display: flex; flex-direction: column; align-items: center; text-align: center; }
.sx-note { grid-area: note; }
.sx-cta { grid-area: cta; }

.sx-eyebrow { font-size: 12px; font-weight: 400; letter-spacing: .03em; text-transform: uppercase; }
.sx-logo { margin-top: 14px; width: 140px; height: auto; }
.sx-title {
  margin-top: 6px; font-weight: 300; line-height: 1; letter-spacing: .01em; text-transform: uppercase;
  font-size: clamp(32px, 9.4vw, 40px); white-space: nowrap; color: #196cd6;
}
.sx-status { margin-top: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; color: #a6e36a; text-align: left; }
.sx-spinner {
  width: 24px; height: 24px; flex: none;
  stroke: #a6e36a; stroke-width: 2.4; stroke-linecap: round;
  animation: sx-spin 1.2s steps(12) infinite;
}

.sx-thanks-big {
  font-size: clamp(34px, 10vw, 44px); font-weight: 400; line-height: 1; text-transform: uppercase; white-space: nowrap;
  background: linear-gradient(90deg, var(--hot-a), var(--hot-b));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.sx-thanks-sub { margin-top: 4px; font-size: 20px; font-weight: 400; }
.sx-thanks-rule { margin-top: 12px; width: 120px; height: 1.5px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent); }

/* Glass note with chevrons */
.sx-note {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 18px; border-radius: 20px;
  background: linear-gradient(90deg, rgba(255,255,255,.03), rgba(255,255,255,.12)), rgba(40,54,78,.55);
  box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.28), inset 0 1px 0 rgba(255,255,255,.3), 0 14px 30px -16px rgba(0,0,0,.6);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
}
.sx-note p { flex: 1; font-size: 13px; line-height: 1.5; }
/* Phones: arrows point down at the button below */
.sx-chevrons { transform: rotate(90deg); }
.sx-chevrons { width: 46px; height: 30px; flex: none; fill: none; stroke: url(#sx-chev); stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
.sx-chevrons path { animation: sx-chev 1.5s ease-in-out infinite; }

/* CTA */
.sx-cta { display: flex; flex-direction: column; align-items: stretch; gap: 10px; }
.sx-reg { text-align: center; font-size: 11px; letter-spacing: .32em; margin-right: -.32em; text-transform: uppercase; color: rgba(255,255,255,.9); }
.sx-enroll {
  position: relative; overflow: hidden;
  display: grid; place-items: center; height: 52px; border-radius: 999px;
  padding: 0 24px; white-space: nowrap;
  font-size: 18px; font-weight: 900; letter-spacing: .02em; text-transform: uppercase; color: #0b0e14;
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

/* ================= Tablet & desktop: the design, to scale =================
   Sizes are the design's pixels ÷ its 1120px card width, as cqi. */
@container sx (min-width: 640px) {
  .sx-ribbon {
    position: absolute; right: 0; top: 4.9cqi; margin: 0;
    padding: 1.9cqi 2.6cqi 1.6cqi 4.4cqi;
    display: flex; align-items: flex-end; text-align: right; width: auto;
    background: linear-gradient(100deg, var(--hot-a), var(--hot-b));
    clip-path: polygon(3cqi 0, 100% 0, 100% 100%, 3cqi 100%, 0 50%);
  }
  .sx-ribbon-label { font-size: max(10px, 1.32cqi); }
  .sx-ribbon-month { font-size: max(18px, 2.5cqi); }

  .sx-grid {
    padding: 5.4cqi 6.6cqi 5.8cqi;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    grid-template-areas: "main thanks" "note cta";
    column-gap: 7cqi; row-gap: 2.8cqi;
  }
  .sx-main { align-items: flex-start; text-align: left; }
  .sx-thanks { align-self: end; align-items: flex-end; text-align: right; padding-bottom: 2.2cqi; }
  .sx-cta { align-self: center; }

  .sx-eyebrow { font-size: max(11px, 1.36cqi); }
  .sx-logo { margin-top: 7.2cqi; width: 18.4cqi; }
  .sx-title { margin-top: .6cqi; font-size: 5.9cqi; }
  .sx-status { margin-top: 3.4cqi; gap: 1.2cqi; font-size: max(13px, 1.95cqi); }
  .sx-spinner { width: 3.1cqi; height: 3.1cqi; }

  .sx-thanks-big { font-size: 5.6cqi; }
  .sx-thanks-sub { margin-top: .4cqi; font-size: 2.9cqi; }
  .sx-thanks-rule { margin-top: 1.4cqi; width: 13.5cqi; background: rgba(255,255,255,.55); }

  .sx-note { flex-direction: row; text-align: left; gap: 2cqi; padding: 2.4cqi 3cqi; border-radius: 2.2cqi; }
  .sx-note p { font-size: max(12px, 1.5cqi); }
  .sx-chevrons { width: 7.8cqi; height: 5cqi; transform: none; margin: 0; }

  .sx-cta { gap: 1.6cqi; }
  .sx-reg { font-size: max(10px, 1.36cqi); letter-spacing: .45em; margin-right: -.45em; }
  .sx-enroll { height: 6.4cqi; padding: 0 2.6cqi; font-size: 2.45cqi; }
}

/* ---- Entrance / exit ---- */
.sx-in { animation: sx-in .8s cubic-bezier(.22,1,.36,1) both; animation-delay: calc(var(--d, 0) * 60ms + 280ms); }
.sx-ribbon.sx-in { animation-name: sx-slide; }

.is-closing .sx-backdrop { animation: sx-fade .3s ease-in reverse both; }
.is-closing .sx-card { animation: sx-out .3s cubic-bezier(.4,0,1,1) both; }

@keyframes sx-fade { from { opacity: 0; } }
@keyframes sx-pop { from { opacity: 0; transform: translate3d(0, 36px, 0) scale(.92); } 30% { opacity: 1; } }
@keyframes sx-out { to { opacity: 0; transform: translate3d(0, 14px, 0) scale(.96); } }
@keyframes sx-in { from { opacity: 0; transform: translate3d(0, 12px, 0); } }
@keyframes sx-slide { from { opacity: 0; transform: translate3d(40px, 0, 0); } }
@keyframes sx-sweep { to { transform: translateX(420%) skewX(-18deg); } }
@keyframes sx-spin { to { transform: rotate(360deg); } }
@keyframes sx-chev { 0%, 100% { opacity: .35; } 40% { opacity: 1; } }
@keyframes sx-shine { 0%, 60% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(220%) skewX(-20deg); } }

@media (prefers-reduced-motion: reduce) {
  .sx-root *, .sx-root *::before, .sx-root *::after { animation: none !important; transition: none !important; }
}
`;
