"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { FAQ_GROUPS, type FaqGroupId } from "@/app/content/faqs";

/**
 * FAQ accordion shown just above the footer (one question set per page).
 *
 * Blending: by default the section has NO background, so the page colour runs
 * straight through it into the footer. Pass `background` only where the page
 * needs a specific fill, and `tone="light"` on light pages (Organisations).
 * Also emits FAQPage structured data for search engines.
 */
export function FaqSection({
  group,
  tone = "dark",
  background,
}: {
  group: FaqGroupId;
  tone?: "dark" | "light";
  /** Optional CSS background (colour or gradient) to match the page. */
  background?: string;
}) {
  const data = FAQ_GROUPS.find((g) => g.id === group)!;
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  const light = tone === "light";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  const t = light
    ? {
        eyebrow: "border-[#1d4ed8]/20 bg-[#1d4ed8]/8 text-[#1d4ed8]",
        dot: "bg-[#2563eb]",
        title: "text-[#0b1530]",
        card: "border-white/70 bg-white/70 shadow-[0_10px_30px_-12px_rgba(15,40,110,0.18)]",
        cardOpen: "border-[#2563eb]/25 bg-white shadow-[0_18px_40px_-14px_rgba(29,78,216,0.28)]",
        num: "text-[#0b1530]/55",
        numOpen: "text-[#1d4ed8]",
        divider: "bg-[#0b1530]/15",
        q: "text-[#0b1530]",
        a: "text-[#0b1530]/65",
        answerBox: "bg-[#f1f5ff]",
        btn: "border-[#0b1530]/10 bg-white text-[#1d4ed8]",
        btnOpen: "bg-linear-to-br from-[#1d4ed8] to-[#2563eb] text-white shadow-[0_6px_18px_-4px_rgba(37,99,235,0.6)]",
      }
    : {
        eyebrow: "border-[#38bdf8]/30 bg-[#1d4ed8]/15 text-[#7dd3fc]",
        dot: "bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]",
        title: "text-white",
        card: "border-white/10 bg-white/[0.04]",
        cardOpen: "border-[#38bdf8]/35 bg-white/[0.07] shadow-[0_20px_45px_-20px_rgba(29,78,216,0.55)]",
        num: "text-white/45",
        numOpen: "text-[#38bdf8]",
        divider: "bg-white/15",
        q: "text-white",
        a: "text-white/65",
        answerBox: "bg-white/[0.04]",
        btn: "border-white/15 bg-white/5 text-white",
        btnOpen: "bg-linear-to-br from-[#1d4ed8] to-[#38bdf8] text-white shadow-[0_6px_18px_-4px_rgba(56,189,248,0.6)]",
      };

  return (
    <section
      data-faq=""
      aria-labelledby={`${baseId}-title`}
      className="relative w-full pt-20 pb-28 sm:pt-24 sm:pb-36"
      style={background ? { background } : undefined}
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-8">
        <div className="text-center">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 ${t.eyebrow}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
              FAQ
            </span>
          </span>
          <h2
            id={`${baseId}-title`}
            className={`mt-5 font-sans text-3xl font-semibold leading-tight tracking-tight sm:text-4xl ${t.title}`}
          >
            {data.title}
          </h2>
        </div>

        <ul className="mt-10 flex flex-col gap-3 sm:mt-12 sm:gap-4">
          {data.items.map((it, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            return (
              <li
                key={it.q}
                className={`rounded-2xl border backdrop-blur-md transition-all duration-300 ${isOpen ? t.cardOpen : t.card}`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8] sm:gap-5 sm:px-7 sm:py-6"
                  >
                    <span
                      className={`w-7 shrink-0 font-mono text-base font-medium tabular-nums transition-colors sm:text-lg ${isOpen ? t.numOpen : t.num}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className={`h-6 w-px shrink-0 ${t.divider}`} />
                    <span className={`flex-1 text-base font-medium leading-snug sm:text-lg ${t.q}`}>
                      {it.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-300 ${isOpen ? `${t.btnOpen} border-transparent` : t.btn}`}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                </h3>

                {/* answer: smooth height via the grid 0fr → 1fr trick */}
                <div
                  id={panelId}
                  role="region"
                  aria-label={it.q}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`mx-5 mb-5 rounded-xl px-5 py-4 text-sm leading-relaxed sm:mx-7 sm:mb-6 sm:text-[15px] ${t.answerBox} ${t.a}`}
                    >
                      {it.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
