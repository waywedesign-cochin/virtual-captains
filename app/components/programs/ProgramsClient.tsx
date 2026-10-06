"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

export type ProgramTab = "organisation" | "individual" | "upcoming";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function ProgramsTabs({
  hero,
  organisation,
  individual,
  upcoming,
}: {
  hero: ReactNode;
  organisation: ReactNode;
  individual: ReactNode;
  upcoming: ReactNode;
}) {
  const [tab, setTab] = useState<ProgramTab>("organisation");
  const [switched, setSwitched] = useState(false);

  const select = (t: ProgramTab) => {
    if (t === tab) return;
    setSwitched(true);
    setTab(t);
  };

  const tabClass = (active: boolean) =>
    `cursor-pointer rounded-full px-6 py-3 text-sm font-semibold text-white transition-all ${
      active
        ? "bg-[#2563eb] shadow-lg hover:bg-[#1d4ed8]"
        : "border border-white/20 bg-white/5 hover:bg-white/10"
    }`;

  return (
    <>
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-36 text-center sm:px-10 lg:px-16">
        {hero}

        <div
          role="tablist"
          aria-label="Program audience"
          style={delay(380)}
          className="vc-in mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "organisation"}
            onClick={() => select("organisation")}
            className={tabClass(tab === "organisation")}
          >
            Organisation Curriculum
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "individual"}
            onClick={() => select("individual")}
            className={tabClass(tab === "individual")}
          >
            Individual Coaching
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "upcoming"}
            onClick={() => select("upcoming")}
            className={tabClass(tab === "upcoming")}
          >
            Upcoming Programs
          </button>
        </div>
      </section>

      {/* Program content */}
      <section
        role="tabpanel"
        className={`mx-auto max-w-350 px-6 pb-24 sm:px-10 lg:px-16 ${
          switched ? "vc-switched" : ""
        }`}
      >
        {tab === "organisation"
          ? organisation
          : tab === "individual"
            ? individual
            : upcoming}
      </section>
    </>
  );
}
