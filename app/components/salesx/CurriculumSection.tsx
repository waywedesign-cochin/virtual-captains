"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Stage = {
  title: string;
  tagline: string;
  body: string;
};

type Track = {
  key: "students" | "professionals" | "founders";
  tab: string;
  blurb: string;
  heading: string;
  accent: string;
  meta: string;
  outcome: string;
  stages: Stage[];
};

const TRACKS: Track[] = [
  {
    key: "students",
    tab: "Students",
    blurb: "Campus to offer",
    heading: "From campus",
    accent: "to offer.",
    meta: "Students & fresh graduates",
    outcome: "An offer, not just an interview.",
    stages: [
      {
        title: "Foundations",
        tagline: "Find your voice",
        body: "Stage fear, the self-intro and your 60-second personal pitch. Plus how a sales team really works: pipeline, targets and the maths behind a deal.",
      },
      {
        title: "Rehearse",
        tagline: "Practise the real thing",
        body: "Live roleplays of cold calls, discovery and objections, then mock interviews where you pitch yourself. Your coach reviews every rep.",
      },
      {
        title: "Evaluate",
        tagline: "Get scored under pressure",
        body: "Timed simulations like The Twenty-Second VP, scored on composure, framing and intent. Written feedback, then targeted reps to redo.",
      },
      {
        title: "Clear & Place",
        tagline: "Walk out hireable",
        body: "Earn your VC Skill Card, review your portfolio with hiring partners and line up placement interviews.",
      },
    ],
  },
  {
    key: "professionals",
    tab: "Professionals",
    blurb: "Job to promotion",
    heading: "From doing the job",
    accent: "to owning the room.",
    meta: "Working professionals",
    outcome: "Growth your manager can see.",
    stages: [
      {
        title: "Diagnose",
        tagline: "Find the gap",
        body: "The 14-question assessment shows which of the five skills is holding your numbers back. We start there, not at page one.",
      },
      {
        title: "Rehearse",
        tagline: "Fix it on real scenarios",
        body: "Roleplays built from your world: stakeholder pushback, a price objection, negotiating scope or your own raise.",
      },
      {
        title: "Evaluate",
        tagline: "Prove it in the room",
        body: "Multi-stakeholder simulations like Three Voices, scored by practitioners, with written feedback and reps to redo.",
      },
      {
        title: "Certify & Advance",
        tagline: "Show the result",
        body: "A scored Skill Card band to take into your next review, plus a plan for the conversations that come after it.",
      },
    ],
  },
  {
    key: "founders",
    tab: "Founders",
    blurb: "Product to first sale",
    heading: "From builder",
    accent: "to first seller.",
    meta: "Founders & entrepreneurs",
    outcome: "A pipeline, not just a product.",
    stages: [
      {
        title: "Foundations",
        tagline: "Your sales story",
        body: "Who buys, why they buy and what it's worth to them. Startup sales maths: pipeline, conversion and the deals you need.",
      },
      {
        title: "Rehearse",
        tagline: "Sell your own product",
        body: "Outreach that gets replies, discovery with real buyer personas and pricing conversations, all rehearsed on your actual offer.",
      },
      {
        title: "Evaluate",
        tagline: "Pitch it end to end",
        body: "The Full-Cycle Closer on your own product: first contact to signed deal, scored and reviewed by a practitioner.",
      },
      {
        title: "Launch",
        tagline: "Make it repeatable",
        body: "Leave with your Skill Card and a sales playbook you can run tomorrow, and hand to your first sales hire.",
      },
    ],
  },
];

const STATS = [
  { value: "40", label: "hours of practice" },
  { value: "4", label: "stages" },
  { value: "1", label: "skill for life" },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CurriculumSection() {
  const [activeKey, setActiveKey] = useState<Track["key"]>("students");
  const [openStage, setOpenStage] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const prevStage = useRef(0);
  const lastKey = useRef<Track["key"]>("students");
  const track = TRACKS.find((t) => t.key === activeKey) ?? TRACKS[0];

  const selectTrack = (key: Track["key"]) => {
    if (key === activeKey) return;
    prevStage.current = 0;
    setActiveKey(key);
    setOpenStage(0);
  };

  // 1) Track switch: new heading + stages ease in (skipped on first load)
  useGSAP(
    () => {
      if (lastKey.current === activeKey) return;
      lastKey.current = activeKey;
      if (prefersReducedMotion()) return;
      gsap.from("[data-head], [data-stage]", {
        y: 18,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
    },
    { scope: root, dependencies: [activeKey] },
  );

  // 2) Step select: one small timeline, runs only on click
  useGSAP(
    () => {
      const from = prevStage.current;
      const to = openStage;
      if (from === to) return;
      prevStage.current = to;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // collapse old body, expand new body
      tl.to(
        `[data-body="${from}"]`,
        { height: 0, opacity: 0, duration: 0.35, ease: "power2.inOut" },
        0,
      )
        .to(
          `[data-body="${to}"]`,
          { height: "auto", opacity: 1, duration: 0.5 },
          0.05,
        )
        .fromTo(
          `[data-body-text="${to}"]`,
          { y: 12 },
          { y: 0, duration: 0.5 },
          0.15,
        );

      // accent bar + node
      tl.to(`[data-bar="${from}"]`, { scaleY: 0, duration: 0.3 }, 0)
        .to(`[data-bar="${to}"]`, { scaleY: 1, duration: 0.4 }, 0.1)
        .to(`[data-node="${from}"]`, { scale: 1, duration: 0.3 }, 0)
        .fromTo(
          `[data-node="${to}"]`,
          { scale: 0.9 },
          { scale: 1.1, duration: 0.5, ease: "back.out(2.4)" },
          0.1,
        )
        .fromTo(
          `[data-ring="${to}"]`,
          { scale: 1, opacity: 0.7 },
          { scale: 1.9, opacity: 0, duration: 0.8, ease: "power2.out" },
          0.1,
        );

      // connector lines fill (or drain) one after another
      if (to > from) {
        for (let k = from; k < to; k++) {
          tl.to(
            `[data-fill="${k}"]`,
            { scaleY: 1, duration: 0.3, ease: "none" },
            (k - from) * 0.22,
          );
        }
      } else {
        for (let k = from - 1; k >= to; k--) {
          tl.to(
            `[data-fill="${k}"]`,
            { scaleY: 0, duration: 0.25, ease: "none" },
            (from - 1 - k) * 0.18,
          );
        }
      }

      if (prefersReducedMotion()) tl.progress(1);
    },
    { scope: root, dependencies: [openStage] },
  );

  return (
    <section
      id="curriculum"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
    >
      {/* soft glows */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#2563eb]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#38bdf8]/10 blur-3xl" />

      <div
        ref={root}
        className="relative mx-auto grid max-w-350 gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20"
      >
        {/* LEFT: sticky control panel */}
        <div className="self-start lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-[#38bdf8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
            Your curriculum
          </div>

          <h2 className="mt-6 font-serif text-4xl leading-[1.1] text-white sm:text-5xl">
            Same discipline.{" "}
            <span className="bg-linear-to-r from-[#38bdf8] to-[#8b9cff] bg-clip-text italic text-transparent">
              Your own climb.
            </span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
            Rep after rep, one skill you&apos;ll use for life. Pick the path
            that matches where you are.
          </p>

          {/* stats */}
          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3"
              >
                <p className="font-serif text-3xl text-white">{s.value}</p>
                <p className="mt-0.5 text-xs leading-tight text-white/55">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* track selector */}
          <div
            role="tablist"
            aria-label="Choose your track"
            className="mt-8 flex max-w-md flex-col gap-2"
          >
            {TRACKS.map((t) => {
              const active = t.key === activeKey;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectTrack(t.key)}
                  className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border px-5 py-4 text-left transition ${
                    active
                      ? "border-[#38bdf8]/50 bg-[#38bdf8]/10"
                      : "border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/6"
                  }`}
                >
                  <span
                    className={`absolute inset-y-0 left-0 w-1 bg-linear-to-b from-[#38bdf8] to-[#2563eb] transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span>
                    <span className="block text-base font-semibold text-white">
                      {t.tab}
                    </span>
                    <span className="block text-sm text-white/55">
                      {t.blurb}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`text-lg transition ${
                      active
                        ? "translate-x-0 text-[#38bdf8]"
                        : "-translate-x-1 text-white/30 group-hover:translate-x-0"
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: timeline (remounts per track so the default state is always stage 01) */}
        <div key={track.key}>
          <p
            data-head
            className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45"
          >
            {track.meta}
          </p>
          <h3
            data-head
            className="mt-3 font-serif text-3xl text-white sm:text-4xl"
          >
            {track.heading}{" "}
            <span className="italic text-[#38bdf8]">{track.accent}</span>
          </h3>

          <ol className="mt-10">
            {track.stages.map((stage, i) => {
              const isOpen = i === openStage;
              const reached = i <= openStage;
              const isLast = i === track.stages.length - 1;
              return (
                <li key={stage.title + i} data-stage className="relative pl-16">
                  {/* connector to next node */}
                  {!isLast && (
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-5 top-11 w-px overflow-hidden bg-white/10"
                    >
                      <span
                        data-fill={i}
                        className="absolute inset-0 bg-linear-to-b from-[#38bdf8] to-[#2563eb]"
                        style={{
                          transformOrigin: "top",
                          transform: "scaleY(0)",
                        }}
                      />
                    </span>
                  )}

                  {/* node */}
                  <span aria-hidden className="absolute left-0 top-0 h-10 w-10">
                    <span
                      data-ring={i}
                      className="absolute inset-0 rounded-full border border-[#38bdf8]"
                      style={{ opacity: 0 }}
                    />
                    <span
                      data-node={i}
                      className={`relative flex h-full w-full items-center justify-center rounded-full border text-sm font-semibold transition-[background-color,border-color,color,box-shadow] duration-500 ${
                        reached
                          ? "border-transparent bg-linear-to-br from-[#38bdf8] to-[#2563eb] text-white shadow-[0_0_24px_-4px_#38bdf8]"
                          : "border-white/15 bg-[#07090e] text-white/50"
                      }`}
                      style={{ transform: i === 0 ? "scale(1.1)" : "none" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>

                  <button
                    onClick={() => setOpenStage(i)}
                    aria-expanded={isOpen}
                    className={`relative mb-4 w-full overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-500 ${
                      isOpen
                        ? "border-white/15 bg-white/[0.07]"
                        : "border-transparent hover:bg-white/4"
                    }`}
                  >
                    {/* accent bar */}
                    <span
                      aria-hidden
                      data-bar={i}
                      className="absolute bottom-5 left-0 top-5 w-0.75 rounded-full bg-linear-to-b from-[#38bdf8] to-[#2563eb]"
                      style={{
                        transformOrigin: "center",
                        transform: i === 0 ? "scaleY(1)" : "scaleY(0)",
                      }}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4
                          className={`text-xl font-semibold transition-colors duration-300 ${
                            isOpen ? "text-white" : "text-white/70"
                          }`}
                        >
                          {stage.title}
                        </h4>
                        <p
                          className={`mt-1 font-serif text-lg italic transition-colors duration-300 ${
                            isOpen ? "text-[#8b9cff]" : "text-[#8b9cff]/60"
                          }`}
                        >
                          {stage.tagline}
                        </p>
                      </div>
                      {isLast && (
                        <span className="shrink-0 rounded-full bg-[#38bdf8]/15 px-3 py-1 text-xs font-semibold text-[#38bdf8]">
                          Finish line
                        </span>
                      )}
                    </div>

                    {/* body: height/opacity driven by GSAP */}
                    <div
                      data-body={i}
                      aria-hidden={!isOpen}
                      className="overflow-hidden"
                      style={{
                        height: i === 0 ? "auto" : 0,
                        opacity: i === 0 ? 1 : 0,
                      }}
                    >
                      <p
                        data-body-text={i}
                        className="pt-3 text-[15px] leading-relaxed text-white/70"
                        style={{
                          transform: i === 0 ? "none" : "translateY(12px)",
                        }}
                      >
                        {stage.body}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* outcome */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-3xl border border-white/10 bg-linear-to-br from-[#2563eb]/25 to-[#38bdf8]/10 p-6">
            <div className="min-w-55 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                The outcome
              </p>
              <p className="mt-1.5 font-serif text-2xl italic text-white">
                {track.outcome}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/salesx"
                className="whitespace-nowrap text-sm font-semibold text-white/80 hover:text-white"
              >
                Full SalesX curriculum →
              </Link>
              <Link
                href="/individuals"
                className="whitespace-nowrap rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#1d4ed8]"
              >
                Start this path
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
