import { CheckEligibilityButton, WaitlistButton } from "../home/BookACallModal";
import { FormatTabs, RolePlayDemo } from "./FoundersBatchClient";
import { ProgramsHero } from "./ProgramsHero";

// Static content (not from Sanity). Edit here when the client changes details.
const FOUNDERS_BATCH = {
  title: "SalesX Founders Batch",
  slug: "salesx-founders-batch",
  description:
    "AI + human coaching for founders who want to sell their own product, from first contact to signed deal.",
  modules: [
    "Prospecting",
    "Pre-sales",
    "Discovery",
    "Objection handling",
    "Presentation techniques",
    "Negotiation & closing",
  ],
};

const ONLINE_PROGRAM = {
  title: "SalesX AI Simulation (Online)",
  slug: "salesx-ai-simulation-online",
  features: [
    "AI buyer personas for every stage of the sale",
    "Instant feedback and skill scores",
    "Beginner, Intermediate and Expert tracks",
  ],
  // How the online program works (shown under the demo)
  steps: [
    {
      title: "Choose your track",
      text: "Beginner, Intermediate or Expert, matched to where you are today.",
    },
    {
      title: "Rehearse with AI buyers",
      text: "Practise real conversations for every stage of the sale.",
    },
    {
      title: "Get scored on every call",
      text: "Instant feedback and skill scores after each drill.",
    },
    {
      title: "Repeat, then level up",
      text: "Go again until it sticks, then move up to the next level.",
    },
  ],
};

const LEVELS = [
  {
    name: "Beginner",
    bars: 1,
    text: "For those new to selling. Build the basics: finding prospects, opening conversations and asking the right questions.",
  },
  {
    name: "Intermediate",
    bars: 2,
    text: "For people already selling. Sharpen discovery, handle objections with confidence and present with impact.",
  },
  {
    name: "Expert",
    bars: 3,
    text: "For senior sellers and founders. Master complex negotiations, large deals and consistent closing.",
  },
];

// Staircase offsets (desktop): beginner sits lowest, expert highest
const STEP = ["md:mt-12", "md:mt-6", ""];

const panelClass =
  "relative overflow-hidden rounded-[2rem] border border-[#38bdf8]/25 bg-[#0b0e14] p-7 sm:p-12";

function Glows() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#2563eb]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#8b9cff]/15 blur-3xl"
      />
    </>
  );
}
// ---------- "What you'll cover": simple looping highlight (CSS only) ----------
const COVER_STEP = 2; // seconds each module stays lit

const coverCss = `
@keyframes vc-cover-row {
  0%       { border-color: rgba(255,255,255,.1); background: rgba(255,255,255,.05); }
  3%, 15%  { border-color: rgba(56,189,248,.55); background: rgba(56,189,248,.12); }
  19%, 100%{ border-color: rgba(255,255,255,.1); background: rgba(255,255,255,.05); }
}
@keyframes vc-cover-num {
  0%       { background: #0b0e14; color: #38bdf8; }
  3%, 15%  { background: #38bdf8; color: #04121f; }
  19%, 100%{ background: #0b0e14; color: #38bdf8; }
}
@media (prefers-reduced-motion: reduce) {
  .vc-cover * { animation: none !important; }
}
`;

function CoverJourney({ modules }: { modules: string[] }) {
  const cycle = modules.length * COVER_STEP;
  const anim = (name: string, i: number) => ({
    animation: `${name} ${cycle}s ease-in-out infinite`,
    animationDelay: `${i * COVER_STEP}s`,
  });

  return (
    <div className="vc-cover rounded-3xl border border-white/10 bg-white/3 p-6 sm:p-8">
      <style>{coverCss}</style>

      <p className="text-xs font-semibold uppercase tracking-wider text-[#38bdf8]">
        What you&apos;ll cover
      </p>
      <p className="mt-4 text-xs font-medium text-white/45">First contact</p>

      <ol className="relative mt-3">
        <div
          aria-hidden
          className="absolute bottom-5 left-5 top-5 w-px bg-linear-to-b from-[#38bdf8] via-[#8b9cff] to-[#e7ff3d]/70"
        />
        {modules.map((m, i) => (
          <li key={m} className="relative flex items-center gap-4 py-2">
            <span
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#38bdf8]/40 text-xs font-bold"
              style={anim("vc-cover-num", i)}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className="flex-1 rounded-2xl border px-4 py-3 text-[15px] font-semibold text-white"
              style={anim("vc-cover-row", i)}
            >
              {m}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-xs font-medium text-[#e7ff3d]/80">Signed deal</p>
    </div>
  );
}
// ---------- Offline: AI + Human Coaching (the Founders Batch) ----------
function OfflinePanel() {
  return (
    <article className={panelClass}>
      <Glows />

      <div className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left: pitch, key facts, CTA */}
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#e7ff3d]/30 bg-[#e7ff3d]/10 px-3.5 py-1 text-xs font-semibold text-[#e7ff3d]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#e7ff3d] opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e7ff3d]" />
            </span>
            First batch · Offline · Kochi
          </span>

          <h3 className="mt-6 font-serif text-4xl leading-[1.1] text-white sm:text-5xl">
            SalesX{" "}
            <span className="bg-linear-to-r from-[#38bdf8] to-[#8b9cff] bg-clip-text italic text-transparent">
              Founders
            </span>{" "}
            Batch
          </h3>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            {FOUNDERS_BATCH.description}
          </p>

          {/* Key facts */}
          <div className="mt-8 grid max-w-lg gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Batch starts
              </p>
              <p className="mt-2 font-serif text-3xl text-white">1 Nov</p>
              <p className="text-sm text-white/55">2026</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Founders only
              </p>
              <p className="mt-2 font-serif text-3xl text-white">50 seats</p>
              <div aria-hidden className="mt-3 grid w-fit grid-cols-10 gap-1">
                {Array.from({ length: 50 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]/50"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <CheckEligibilityButton
              programTitle={FOUNDERS_BATCH.title}
              programSlug={FOUNDERS_BATCH.slug}
              className="cursor-pointer rounded-full bg-[#e7ff3d] px-7 py-3.5 text-sm font-bold text-[#0b0e14] shadow-[0_10px_30px_-10px_#e7ff3d] transition hover:bg-white"
            />
            <p className="max-w-xs text-xs leading-relaxed text-white/50">
              We review every application and share next steps with selected
              founders.
            </p>
          </div>
        </div>
        {/* Right: the journey (animated, scroll-triggered) */}
        <CoverJourney modules={FOUNDERS_BATCH.modules} />
      </div>
    </article>
  );
}

// ---------- Online: AI simulation & role-play learning ----------
function OnlinePanel() {
  return (
    <article className={panelClass}>
      <Glows />

      <div className="relative grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        {/* Left: pitch + waitlist */}
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3.5 py-1 text-xs font-semibold text-[#38bdf8]">
            <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
            Online · Anywhere
          </span>

          <h3 className="mt-6 font-serif text-4xl leading-[1.1] text-white sm:text-5xl">
            AI simulation &{" "}
            <span className="bg-linear-to-r from-[#38bdf8] to-[#8b9cff] bg-clip-text italic text-transparent">
              role-play
            </span>{" "}
            learning
          </h3>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            Rehearse real sales conversations with AI buyers, get scored on
            every call, and repeat until it sticks. Learn at your own pace, from
            any location.
          </p>

          <ul className="mt-8 space-y-3">
            {ONLINE_PROGRAM.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 text-[15px] text-white/85"
              >
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/10 text-xs text-[#38bdf8]"
                >
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>

          {/* Make clear this is a structured program, not just a chat */}
          <p className="mt-8 max-w-lg rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/65">
            <span className="font-semibold text-white">Not just a chat.</span>{" "}
            Every drill sits inside a structured track, is scored on clear
            skills, and moves you up a level as you improve.
          </p>

          <div className="mt-8">
            <WaitlistButton
              programTitle={ONLINE_PROGRAM.title}
              programSlug={ONLINE_PROGRAM.slug}
              className="cursor-pointer rounded-full bg-[#38bdf8] px-7 py-3.5 text-sm font-bold text-[#04121f] shadow-[0_10px_30px_-10px_#38bdf8] transition hover:bg-white"
            />
          </div>
        </div>

        {/* Right: one sample drill */}
        <RolePlayDemo />
      </div>

      {/* How the program works */}
      <div className="relative mt-12 border-t border-white/10 pt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#38bdf8]">
          How the program works
        </p>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ONLINE_PROGRAM.steps.map((st, i) => (
            <li
              key={st.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#38bdf8]/40 bg-[#0b0e14] text-xs font-bold text-[#38bdf8]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="mt-4 text-[15px] font-bold text-white">
                {st.title}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                {st.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

// ---------- Three levels of selling skill ----------
function LevelsSection() {
  return (
    <section className="mt-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#38bdf8]">
        Levels
      </p>
      <h3 className="mt-3 font-serif text-3xl leading-tight text-white sm:text-4xl">
        Three levels of{" "}
        <span className="bg-linear-to-r from-[#38bdf8] to-[#8b9cff] bg-clip-text italic text-transparent">
          selling skill
        </span>
      </h3>
      <p className="mt-3 max-w-xl text-sm text-white/60 sm:text-base">
        Available in both online and offline formats. Start where you are and
        move up.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {LEVELS.map((l, i) => {
          const top = l.bars === 3;
          return (
            <div
              key={l.name}
              className={`${STEP[i]} group rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 ${
                top
                  ? "border-[#8b9cff]/40 bg-linear-to-br from-[#0b0e14] to-[#1e3a8a]/40"
                  : "border-white/10 bg-[#0b0e14] hover:border-[#38bdf8]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5" aria-hidden>
                  {[0, 1, 2].map((b) => (
                    <span
                      key={b}
                      className={`h-1 w-8 rounded-full ${
                        b < l.bars ? "bg-[#38bdf8]" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Level {i + 1}
                </span>
              </div>
              <h4 className="mt-6 text-xl font-bold text-white">{l.name}</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {l.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function FoundersBatch() {
  return (
    <>
      <ProgramsHero />
      <FormatTabs offline={<OfflinePanel />} online={<OnlinePanel />} />
      <LevelsSection />
    </>
  );
}
