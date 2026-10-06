import Image from "next/image";
import type { CSSProperties } from "react";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// ---------- Page hero (sits above the format tabs) ----------
const HERO_LEVELS = [
  { name: "Beginner", bars: 1 },
  { name: "Intermediate", bars: 2 },
  { name: "Expert", bars: 3 },
];

function OrbitGraphic() {
  return (
    <div
      aria-hidden
      className="relative mx-auto hidden h-64 w-64 shrink-0 lg:block"
    >
      {/* soft glow */}
      <div className="absolute inset-6 rounded-full bg-[#2563eb]/25 blur-3xl" />

      {/* rings */}
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-8 rounded-full border border-dashed border-[#38bdf8]/30" />
      <div className="absolute inset-16 rounded-full border border-white/10" />

      {/* orbiting AI node */}
      <div
        className="absolute inset-0 motion-safe:animate-spin"
        style={{ animationDuration: "14s" }}
      >
        <span className="absolute left-1/2 top-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#38bdf8]/50 bg-[#0b0e14] text-[10px] font-bold text-[#38bdf8]">
          AI
        </span>
      </div>

      {/* orbiting Human node (opposite direction) */}
      <div
        className="absolute inset-8 motion-safe:animate-spin"
        style={{ animationDuration: "18s", animationDirection: "reverse" }}
      >
        <span className="absolute bottom-0 left-1/2 flex h-9 w-9 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border border-[#e7ff3d]/50 bg-[#0b0e14] text-[9px] font-bold text-[#e7ff3d]">
          YOU
        </span>
      </div>

      {/* core */}
      {/* core: SalesX logo */}
      <div className="absolute inset-18 flex items-center justify-center rounded-full border border-white/15 bg-[#0b0e14] shadow-[0_0_40px_-8px_#38bdf8]">
        <Image
          src="/salesx/salesx.png"
          alt="SalesX"
          width={64}
          height={64}
          className="h-14 w-14 object-contain"
        />
      </div>
    </div>
  );
}

export function ProgramsHero() {
  return (
    <header
      style={delay(0)}
      className="vc-in relative mb-12 flex items-center justify-between gap-10"
    >
      <div className="max-w-2xl">
        {/* eyebrow */}
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
          <span
            aria-hidden
            className="h-px w-10 bg-linear-to-r from-[#38bdf8] to-transparent"
          />
          SalesX Programs
        </p>

        {/* headline */}
        <h2 className="mt-5 font-serif text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl">
          The AI-driven{" "}
          <span className="relative inline-block">
            <span className="bg-linear-to-r from-[#38bdf8] via-[#8b9cff] to-[#e7ff3d] bg-clip-text italic text-transparent">
              human engine
            </span>
            {/* hand-drawn style underline */}
            <svg
              aria-hidden
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              className="absolute -bottom-2 left-0 h-2.5 w-full"
            >
              <path
                d="M2 8 C 40 2, 90 12, 130 6 S 185 4, 198 7"
                fill="none"
                stroke="#38bdf8"
                strokeOpacity="0.6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          for selling skills
        </h2>

        {/* subcopy */}
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
          Practise with AI role-play online, or train face-to-face with SalesX
          coaches at our centres. Every program runs across three levels:
        </p>

        {/* levels as chips */}
        <div className="mt-5 flex flex-wrap gap-2.5">
          {HERO_LEVELS.map((l) => (
            <span
              key={l.name}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-3 pr-4 text-xs font-semibold text-white/85 backdrop-blur transition hover:border-[#38bdf8]/40"
            >
              <span aria-hidden className="flex gap-0.5">
                {[0, 1, 2].map((b) => (
                  <span
                    key={b}
                    className={`h-1 w-3.5 rounded-full ${
                      b < l.bars ? "bg-[#38bdf8]" : "bg-white/15"
                    }`}
                  />
                ))}
              </span>
              {l.name}
            </span>
          ))}
        </div>
      </div>

      <OrbitGraphic />
    </header>
  );
}
