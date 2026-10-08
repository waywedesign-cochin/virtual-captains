"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { CheckEligibilityButton, NotifyButton } from "../home/BookACallModal";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// ---------- Offline / Online format tabs ----------
type Format = "offline" | "online";

export function FormatTabs({
  offline,
  online,
}: {
  offline: ReactNode;
  online: ReactNode;
}) {
  const [tab, setTab] = useState<Format>("offline"); // offline first
  const [switched, setSwitched] = useState(false);

  const select = (t: Format) => {
    if (t === tab) return;
    setSwitched(true);
    setTab(t);
  };

  // "See curriculum" in the hero asks for the Offline tab
  useEffect(() => {
    const show = () => {
      if (tab === "offline") return;
      setSwitched(true);
      setTab("offline");
    };
    window.addEventListener("vc:show-offline", show);
    return () => window.removeEventListener("vc:show-offline", show);
  }, [tab]);

  const isOffline = tab === "offline";

  const optionClass = (active: boolean) =>
    `relative z-10 flex cursor-pointer flex-col items-start rounded-full px-6 py-2.5 text-left transition-colors duration-300 ${
      active ? "text-[#0b0e14]" : "text-white/65 hover:text-white"
    }`;

  const subClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-300 ${
      active ? "text-[#0b0e14]/70" : "text-white/40"
    }`;

  // Dot: uses its own colour when inactive, dark when sitting on the active highlight
  const dotClass = (active: boolean, color: string) =>
    `h-2 w-2 rounded-full transition-colors duration-300 ${
      active ? "bg-[#0b0e14]" : color
    }`;

  return (
    // Entrance animation on first load only; panel swaps below fade separately
    <div style={delay(520)} className="vc-in">
      <div
        role="tablist"
        aria-label="Learning format"
        className="relative mb-6 grid w-fit max-w-full grid-cols-2 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur-md"
      >
        {/* sliding highlight */}
        <span
          aria-hidden
          className={`absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-full shadow-md transition-all duration-300 ease-out motion-reduce:transition-none ${
            isOffline
              ? "translate-x-0 bg-[#e7ff3d]"
              : "translate-x-full bg-[#38bdf8]"
          }`}
        />

        <button
          type="button"
          role="tab"
          aria-selected={isOffline}
          onClick={() => select("offline")}
          className={optionClass(isOffline)}
        >
          <span className="whitespace-nowrap text-sm font-bold sm:text-base">
            AI + Human Coaching
          </span>
          <span className={subClass(isOffline)}>
            <span aria-hidden className={dotClass(isOffline, "bg-[#e7ff3d]")} />
            Offline
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={!isOffline}
          onClick={() => select("online")}
          className={optionClass(!isOffline)}
        >
          <span className="whitespace-nowrap text-sm font-bold sm:text-base">
            AI Simulation
          </span>
          <span className={subClass(!isOffline)}>
            <span
              aria-hidden
              className={dotClass(!isOffline, "bg-[#38bdf8]")}
            />
            Online
          </span>
        </button>
      </div>

      <div
        key={tab}
        role="tabpanel"
        className={switched ? "vc-in" : undefined}
        style={switched ? delay(0) : undefined}
      >
        {isOffline ? offline : online}
      </div>
    </div>
  );
}

// ---------- Smooth-scroll link to the Founders Batch section ----------
export function SeeCurriculumLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Make sure the Offline tab is showing
    window.dispatchEvent(new CustomEvent("vc:show-offline"));

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // If the Online tab was open, wait a few frames for the Offline card to mount
    let tries = 0;
    const go = () => {
      const el = document.getElementById("founders-batch-card");
      if (el) {
        el.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
        return;
      }
      if (tries++ < 20) requestAnimationFrame(go);
    };
    go();
  };

  return (
    <a href="#founders-batch" onClick={onClick} className={className}>
      {children}
    </a>
  );
}

// ---------- Offline locations: pick a country, see its cities ----------
type City = {
  name: string;
  status: "open" | "soon";
  date?: string;
  note?: string;
};

type Location = { id: string; name: string; flag: string; cities: City[] };

// Edit here when the client confirms countries and cities.
const LOCATIONS: Location[] = [
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    cities: [
      {
        name: "Kochi",
        status: "open",
        date: "1 Nov 2026",
        note: "50 founders only",
      },
      { name: "Bangalore", status: "soon", note: "Dates to be announced" },
      { name: "Hyderabad", status: "soon", note: "Dates to be announced" },
    ],
  },
  { id: "malaysia", name: "Malaysia", flag: "🇲🇾", cities: [] },
  { id: "oman", name: "Oman", flag: "🇴🇲", cities: [] },
  { id: "other", name: "Other locations", flag: "🌍", cities: [] },
];

const notifyBtnClass =
  "cursor-pointer text-xs font-semibold text-[#38bdf8] transition hover:text-white";

export function OfflineLocations({
  programTitle,
  programSlug,
}: {
  programTitle: string;
  programSlug: string;
}) {
  const [active, setActive] = useState(LOCATIONS[0].id);
  const loc = LOCATIONS.find((l) => l.id === active) ?? LOCATIONS[0];

  return (
    <section className="mb-12 border-b border-white/10 pb-12">
      {" "}
      <p className="text-xs font-semibold uppercase tracking-wider text-[#38bdf8]">
        Where we train
      </p>
      <h3 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">
        Find a batch{" "}
        <span className="bg-linear-to-r from-[#38bdf8] to-[#8b9cff] bg-clip-text italic text-transparent">
          near you
        </span>
      </h3>
      {/* Country chips */}
      <div
        role="tablist"
        aria-label="Location"
        className="mt-6 flex flex-wrap gap-2"
      >
        {LOCATIONS.map((l) => {
          const on = l.id === active;
          return (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(l.id)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                on
                  ? "border-[#e7ff3d]/60 bg-[#e7ff3d]/10 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              <span aria-hidden className="text-base leading-none">
                {l.flag}
              </span>
              {l.name}
            </button>
          );
        })}
      </div>
      {/* Cities for the selected country */}
      <div
        key={loc.id}
        role="tabpanel"
        className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        {loc.cities.length === 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-white/20 bg-white/3 px-6 py-5">
            <p className="text-sm text-white/65">
              {loc.id === "other"
                ? "Not on the list? Tell us where you are and we'll look at bringing SalesX closer."
                : `No ${loc.name} batch announced yet. We'll share dates here first.`}
            </p>
            <NotifyButton
              programTitle={programTitle}
              programSlug={programSlug}
              location={loc.name}
              className={notifyBtnClass}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loc.cities.map((c) => {
              const open = c.status === "open";
              return (
                <article
                  key={c.name}
                  className={`flex flex-col rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${
                    open
                      ? "border-[#e7ff3d]/40 bg-[#e7ff3d]/5"
                      : "border-white/10 bg-[#0b0e14]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-lg font-bold text-white">{c.name}</h4>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        open
                          ? "bg-[#e7ff3d] text-[#0b0e14]"
                          : "border border-white/15 text-white/45"
                      }`}
                    >
                      {open ? "Open" : "Coming soon"}
                    </span>
                  </div>

                  {c.date && (
                    <p className="mt-3 text-sm text-white/70">
                      Batch starts{" "}
                      <span className="font-semibold text-white">{c.date}</span>
                    </p>
                  )}
                  {c.note && (
                    <p className="mt-1 text-xs text-white/50">{c.note}</p>
                  )}

                  <div className="mt-auto pt-5">
                    {open ? (
                      <CheckEligibilityButton
                        programTitle={programTitle}
                        programSlug={programSlug}
                        className="cursor-pointer rounded-full bg-[#e7ff3d] px-5 py-2.5 text-sm font-bold text-[#0b0e14] transition hover:bg-white"
                      />
                    ) : (
                      <NotifyButton
                        programTitle={programTitle}
                        programSlug={programSlug}
                        location={`${c.name}, ${loc.name}`}
                        className={notifyBtnClass}
                      />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Live AI voice simulation demo (auto-plays, scenario chips, replay) ----------
type Scenario = {
  id: string;
  label: string;
  track: string; // which level track this drill belongs to
  module: string; // which module it practises
  persona: string; // who the AI buyer is on this call
  buyer: string;
  you: string;
  feedback: string;
  scores: { label: string; value: number }[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "vendor",
    label: "Vendor switch",
    track: "Intermediate",
    module: "Objection handling",
    persona: "Procurement Head · Skeptical",
    buyer: "We already work with another vendor. Why switch?",
    you: "Fair question. What's one thing you'd change about them today?",
    feedback: "Objection handling: strong. Discovery question asked ✓",
    scores: [
      { label: "Objection handling", value: 88 },
      { label: "Discovery", value: 82 },
      { label: "Next step", value: 60 },
    ],
  },
  {
    id: "price",
    label: "Price pushback",
    track: "Expert",
    module: "Negotiation & closing",
    persona: "Finance Director · Price-sensitive",
    buyer: "Your price is 30% higher than the other quote.",
    you: "Understood. Beyond price, what would make this a clear win for you?",
    feedback: "Moved the talk from price to value. Discovery question asked ✓",
    scores: [
      { label: "Objection handling", value: 79 },
      { label: "Discovery", value: 90 },
      { label: "Next step", value: 55 },
    ],
  },
  {
    id: "later",
    label: "Brush-off",
    track: "Beginner",
    module: "Pre-sales",
    persona: "Operations Lead · Always busy",
    buyer: "Just send me an email. I'm swamped this quarter.",
    you: "Happy to. So I send the right thing, what's your top priority this quarter?",
    feedback: "Brush-off handled. Conversation kept alive ✓",
    scores: [
      { label: "Objection handling", value: 74 },
      { label: "Discovery", value: 85 },
      { label: "Next step", value: 78 },
    ],
  },
];

function Typing() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-white/60 motion-safe:animate-bounce"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </span>
  );
}

/** Animated voice waveform. Bars move only while `active`. */
function Wave({ active, color }: { active: boolean; color: string }) {
  return (
    <div className="flex h-8 items-center gap-0.75" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="vc-wave-bar h-full w-0.75 origin-center rounded-full"
          style={{
            background: color,
            animationDelay: `${(i % 6) * 90}ms`,
            animationDuration: `${700 + (i % 5) * 120}ms`,
            animationPlayState: active ? "running" : "paused",
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}

/** Call participant: avatar with a pulsing ring while speaking. */
function Participant({
  label,
  sub,
  initials,
  speaking,
  gradient,
  ring,
}: {
  label: string;
  sub: string;
  initials: string;
  speaking: boolean;
  gradient: string;
  ring: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
      <div className="relative">
        {speaking && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full motion-safe:animate-ping"
            style={{ background: ring, opacity: 0.35 }}
          />
        )}
        <span
          className={`relative flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white ring-2 transition-all duration-300 sm:h-16 sm:w-16 ${gradient}`}
          style={{
            boxShadow: speaking ? `0 0 0 3px ${ring}` : "none",
            opacity: speaking ? 1 : 0.7,
          }}
        >
          {initials}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-white">{label}</p>
      <p className="max-w-full truncate text-[11px] text-white/50">{sub}</p>
    </div>
  );
}

const fmtTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function RolePlayDemo() {
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0); // bump to replay
  // 0 buyer picking up · 1 buyer speaking · 2 you picking up · 3 you speaking · 4 call ended + scores
  const [stage, setStage] = useState(0);
  const [secs, setSecs] = useState(0); // call timer
  const s = SCENARIOS[index];

  const buyerSpeaking = stage <= 1;
  const youSpeaking = stage === 2 || stage === 3;
  const ended = stage >= 4;

  useEffect(() => {
    setStage(0);
    setSecs(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage(4);
      setSecs(5);
      return;
    }
    const tick = window.setInterval(() => setSecs((x) => x + 1), 1000);
    const stopTick = window.setTimeout(() => window.clearInterval(tick), 4300);
    const timers = [900, 2100, 3300, 4300].map((t, i) =>
      window.setTimeout(() => setStage(i + 1), t),
    );
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(stopTick);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [index, run]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur sm:p-6">
      <style>{`
        @keyframes vc-wave { 0%, 100% { transform: scaleY(0.25); } 50% { transform: scaleY(1); } }
        .vc-wave-bar { animation: vc-wave 0.9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .vc-wave-bar { animation: none; transform: scaleY(0.5); } }
      `}</style>

      {/* Header: live voice simulation */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
            <span className="relative flex h-2 w-2">
              {!ended && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-70 motion-safe:animate-ping" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  ended ? "bg-white/30" : "bg-red-500"
                }`}
              />
            </span>
            Live AI Voice Simulation
          </p>
          <p className="mt-1.5 text-sm text-white/60">
            Start a real-time sales conversation
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/60">
          Demo
        </span>
      </div>

      {/* Where this drill sits in the program */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
        <span className="rounded-full bg-[#8b9cff]/15 px-2.5 py-1 text-[#8b9cff]">
          {s.track} track
        </span>
        <span aria-hidden className="text-white/30">
          ›
        </span>
        <span className="rounded-full bg-[#38bdf8]/15 px-2.5 py-1 text-[#38bdf8]">
          {s.module}
        </span>
      </div>

      {/* Scenario chips */}
      <div
        className="mt-4 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Scenario"
      >
        {SCENARIOS.map((sc, i) => (
          <button
            key={sc.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => {
              setIndex(i);
              setRun((r) => r + 1);
            }}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              i === index
                ? "border-[#38bdf8] bg-[#38bdf8]/15 text-[#38bdf8]"
                : "border-white/10 bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Call card */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#070b1c]/80">
        {/* Call status bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-[11px] font-semibold">
          <span className={ended ? "text-white/45" : "text-emerald-300"}>
            {ended
              ? "Call ended · Scored"
              : stage === 0
                ? "Connecting…"
                : "On call"}
          </span>
          <span className="tabular-nums text-white/60">{fmtTime(secs)}</span>
        </div>

        {/* Participants */}
        <div className="flex items-start justify-between gap-4 px-4 pt-5 sm:px-8">
          <Participant
            label="AI Buyer"
            sub={s.persona}
            initials="AI"
            speaking={buyerSpeaking && !ended}
            gradient="bg-linear-to-br from-[#8b9cff] to-[#2563eb] ring-[#8b9cff]/40"
            ring="rgba(139,156,255,0.6)"
          />
          <Participant
            label="You"
            sub="Sales rep"
            initials="YOU"
            speaking={youSpeaking}
            gradient="bg-linear-to-br from-[#38bdf8] to-[#0ea5e9] ring-[#38bdf8]/40"
            ring="rgba(56,189,248,0.6)"
          />
        </div>

        {/* Live captions */}
        <div
          className="mt-5 space-y-4 border-t border-white/10 px-4 py-4 sm:px-6"
          style={{ minHeight: "11rem" }}
          aria-live="polite"
        >
          <div className="animate-in fade-in border-l-2 border-[#8b9cff] pl-3 duration-300">
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8b9cff]">
                AI Buyer {buyerSpeaking && !ended ? "· speaking" : ""}
              </p>
              <Wave active={buyerSpeaking && !ended} color="#8b9cff" />
            </div>
            <p className="mt-1 text-[15px] leading-relaxed text-white/90">
              {stage >= 1 ? s.buyer : <Typing />}
            </p>
          </div>

          {stage >= 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 border-l-2 border-[#38bdf8] pl-3 duration-300">
              <div className="flex items-center gap-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#38bdf8]">
                  You {youSpeaking ? "· speaking" : ""}
                </p>
                <Wave active={youSpeaking} color="#38bdf8" />
              </div>
              <p className="mt-1 text-[15px] leading-relaxed text-white/90">
                {stage >= 3 ? s.you : <Typing />}
              </p>
            </div>
          )}

          {ended && (
            <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-xs font-medium text-emerald-300 duration-300">
              {s.feedback}
            </div>
          )}
        </div>
      </div>

      {/* Skill scores */}
      <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-white/40">
        Live scoring
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {s.scores.map((sc) => (
          <div key={sc.label}>
            <div className="flex items-center justify-between text-[11px] text-white/55">
              <span>{sc.label}</span>
              <span className="font-semibold text-white/80">
                {ended ? sc.value : "–"}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#38bdf8] to-[#8b9cff] transition-[width] duration-1000 ease-out"
                style={{ width: ended ? `${sc.value}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Context: one call, not the whole program */}
      <div className="mt-4 flex items-start justify-between gap-4 rounded-xl bg-white/5 px-4 py-3">
        <p className="text-[11px] leading-relaxed text-white/55">
          <span className="font-semibold text-white/80">
            One call from the program.
          </span>{" "}
          The full program adds structured tracks, scored practice and
          level-by-level progress. Illustrative demo, not a live session.
        </p>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="shrink-0 cursor-pointer text-xs font-semibold text-[#38bdf8] transition hover:text-white"
        >
          ↻ Replay
        </button>
      </div>
    </div>
  );
}
