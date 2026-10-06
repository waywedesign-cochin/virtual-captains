"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

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

  const isOffline = tab === "offline";

  const optionClass = (active: boolean) =>
    `relative z-10 flex cursor-pointer flex-col items-start rounded-full px-6 py-2.5 text-left transition-colors duration-300 ${
      active ? "text-[#0b0e14]" : "text-white/65 hover:text-white"
    }`;

  const subClass = (active: boolean) =>
    `text-[11px] font-medium transition-colors duration-300 ${
      active ? "text-[#0b0e14]/70" : "text-white/40"
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
          <span className="whitespace-nowrap text-xs font-bold sm:text-sm">
            AI + Human Coaching
          </span>
          <span className={subClass(isOffline)}>Offline</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={!isOffline}
          onClick={() => select("online")}
          className={optionClass(!isOffline)}
        >
          <span className="whitespace-nowrap text-xs font-bold sm:text-sm">
            AI Simulation
          </span>
          <span className={subClass(!isOffline)}>Online</span>
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

// ---------- Sample drill demo (auto-plays, scenario chips, replay) ----------
type Scenario = {
  id: string;
  label: string;
  track: string; // which level track this drill belongs to
  module: string; // which module it practises
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

const DRILL_STEPS = ["Buyer speaks", "You respond", "Scored"];

export function RolePlayDemo() {
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0); // bump to replay
  // 0 buyer typing · 1 buyer msg · 2 you typing · 3 your msg · 4 feedback + scores
  const [stage, setStage] = useState(0);
  const s = SCENARIOS[index];

  // Which drill step we're on (for the progress tracker)
  const currentStep = stage <= 1 ? 0 : stage <= 3 ? 1 : 2;

  useEffect(() => {
    setStage(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage(4);
      return;
    }
    const timers = [900, 2100, 3300, 4300].map((t, i) =>
      window.setTimeout(() => setStage(i + 1), t),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [index, run]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur sm:p-6">
      {/* Header: this is ONE drill from the program */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Sample drill
        </p>
        <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/60">
          Demo
        </span>
      </div>

      {/* Where this drill sits in the program */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
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

      {/* Drill progress: start, respond, scored */}
      <ol className="mt-4 flex items-center gap-2" aria-label="Drill progress">
        {DRILL_STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-1.5">
            <span
              className={`h-1 rounded-full transition-colors duration-500 ${
                i <= currentStep ? "bg-[#38bdf8]" : "bg-white/10"
              }`}
            />
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                i === currentStep ? "text-white/80" : "text-white/35"
              }`}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      {/* Conversation */}
      <div
        className="mt-4 space-y-3"
        style={{ minHeight: "11.5rem" }}
        aria-live="polite"
      >
        <div className="max-w-sm animate-in fade-in slide-in-from-bottom-2 rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3 text-sm leading-relaxed text-white/85 duration-300">
          <span className="font-bold text-white">AI Buyer: </span>
          {stage >= 1 ? s.buyer : <Typing />}
        </div>

        {stage >= 2 && (
          <div className="flex justify-end">
            <div className="max-w-sm animate-in fade-in slide-in-from-bottom-2 rounded-2xl rounded-tr-sm border border-[#38bdf8]/20 bg-[#2563eb]/25 px-4 py-3 text-sm leading-relaxed text-white/90 duration-300">
              <span className="font-bold text-[#38bdf8]">You: </span>
              {stage >= 3 ? s.you : <Typing />}
            </div>
          </div>
        )}

        {stage >= 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-xs font-medium text-emerald-300 duration-300">
            {s.feedback}
          </div>
        )}
      </div>

      {/* Skill scores */}
      <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
        {s.scores.map((sc) => (
          <div key={sc.label}>
            <div className="flex items-center justify-between text-[11px] text-white/55">
              <span>{sc.label}</span>
              <span className="font-semibold text-white/80">
                {stage >= 4 ? sc.value : "–"}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#38bdf8] to-[#8b9cff] transition-[width] duration-1000 ease-out"
                style={{ width: stage >= 4 ? `${sc.value}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Context: one drill, not the whole program */}
      <div className="mt-4 flex items-start justify-between gap-4 rounded-xl bg-white/5 px-4 py-3">
        <p className="text-[11px] leading-relaxed text-white/55">
          <span className="font-semibold text-white/80">
            One drill from the program.
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
