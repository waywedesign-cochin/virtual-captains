import { curriculum, curriculumModules } from "@/content/site";
import { CurriculumStage } from "./CurriculumStage";

export function Curriculum() {
  return (
    <section
      id="curriculum"
      className="section relative"
      aria-labelledby="curriculum-heading"
    >
      <CurriculumStage>
        <div className="mx-auto w-full max-w-372 px-4 sm:px-8 lg:px-12 py-[clamp(4rem,10vw,8rem)]">
          {/* Desktop Layout: Sticky Left, Scrolling Right */}
          <div className="hidden lg:flex lg:flex-row lg:items-start lg:justify-between lg:gap-20">
            {/* Left Side: Sticky Text */}
            <div
              className="sticky top-[25vh] w-5/12 pt-8 self-start"
              data-curriculum-group=""
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-4 py-1.5 shadow-[0_0_20px_rgba(56,189,248,0.15)] mb-6">
                <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-pulse shadow-[0_0_8px_#38bdf8]" />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
                  {curriculum.title}
                </p>
              </div>

              <h2
                className="w-full text-left"
                data-curriculum-statement=""
                id="curriculum-heading"
              >
                {curriculum.statement.map((line, index) => (
                  <span
                    key={line}
                    className={
                      index === 0
                        ? "block text-[clamp(2.75rem,4.5vw,4.25rem)] font-medium leading-[1.08] text-white tracking-tight"
                        : "block text-[clamp(1.35rem,2.2vw,1.95rem)] font-sans font-light leading-relaxed text-white/70 mt-4 sm:mt-5"
                    }
                  >
                    {line}
                  </span>
                ))}
              </h2>
            </div>

            {/* Right Side: Scrollable Cards with Timeline */}
            <div className="relative w-7/12 py-16" data-curriculum-stage="">
              {/* Timeline Track */}
              <div className="absolute top-16 bottom-16 left-0 w-px bg-white/10" />

              {/* Timeline Fill - Animated by GSAP */}
              <div
                className="absolute top-16 left-0 w-0.5 ml-[-0.5px] bg-linear-to-b from-[#38bdf8] via-[#8fd0ff] to-[#e7ff3d] origin-top shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                data-timeline-fill=""
              />

              <div className="flex flex-col gap-[clamp(4rem,8vw,8rem)]">
                {curriculumModules.map((module) => {
                  const isCool = module.accent === "cyan";
                  return (
                    <div
                      key={module.id}
                      className="relative pl-16 group"
                      data-curriculum-card={module.id}
                    >
                      {/* Node Dot */}
                      <div
                        className="absolute left-[calc(-5px)] top-12 w-3 h-3 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.15)] group-hover:bg-[#38bdf8] group-hover:shadow-[0_0_12px_#38bdf8] transition-all duration-300"
                        data-timeline-node=""
                      />

                      <article className="relative flex flex-col justify-center p-8 sm:p-10 overflow-hidden rounded-3xl backdrop-blur-2xl bg-linear-to-br from-white/5 via-white/2 to-transparent border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/[0.07] group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)] min-h-56 items-start text-left">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="inline-flex items-center rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-md p-1 shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:border-white/25">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${
                                isCool
                                  ? "bg-[#38bdf8]/20 text-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.25)]"
                                  : "bg-[#e7ff3d]/20 text-[#e7ff3d] shadow-[0_0_10px_rgba(231,255,61,0.25)]"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isCool
                                    ? "bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]"
                                    : "bg-[#e7ff3d] shadow-[0_0_6px_#e7ff3d]"
                                }`}
                              />
                              {module.weeks.includes("–") ? "WEEKS" : "WEEK"}
                            </span>
                            <span className="px-3 py-0.5 font-mono text-sm font-bold text-white tracking-wider">
                              {module.weeks}
                            </span>
                          </div>
                        </div>

                        <h3 className="relative z-10 text-2xl lg:text-3xl font-serif font-medium text-white mb-3 tracking-tight">
                          {module.title}
                        </h3>

                        <p className="relative z-10 text-base leading-relaxed text-white/70 font-light max-w-lg">
                          {module.body}
                        </p>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Layout: Stacked Rail */}
          <div className="block lg:hidden mt-8">
            <div className="flex flex-col items-center mb-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-4 py-1.5 shadow-[0_0_20px_rgba(56,189,248,0.15)] mb-4">
                <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-pulse shadow-[0_0_8px_#38bdf8]" />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
                  {curriculum.title}
                </p>
              </div>

              <h2 className="w-full text-center">
                {curriculum.statement.map((line, index) => (
                  <span
                    key={line}
                    className={
                      index === 0
                        ? "block text-[clamp(2.35rem,8vw,3.25rem)] font-serif font-medium leading-[1.1] text-white tracking-tight"
                        : "block text-[clamp(1.2rem,4.8vw,1.6rem)] font-sans font-light leading-snug text-white/70 mt-3.5"
                    }
                  >
                    {line}
                  </span>
                ))}
              </h2>
            </div>

            <ol className="relative pl-[clamp(1.5rem,6vw,2.5rem)] before:absolute before:top-4 before:bottom-8 before:left-1.25 before:w-px before:bg-white/10">
              {curriculumModules.map((module) => {
                const isCool = module.accent === "cyan";
                return (
                  <li
                    className="relative pb-[clamp(2.5rem,6vw,3.5rem)] before:absolute before:top-6 before:-left-[calc(clamp(1.5rem,6vw,2.5rem)-0.125rem)] before:h-2 before:w-2 before:rounded-full before:bg-[#38bdf8] before:shadow-[0_0_8px_#38bdf8]"
                    key={`rail-${module.id}`}
                    data-curriculum-rail-item=""
                  >
                    <article className="relative flex flex-col justify-center p-6 sm:p-8 overflow-hidden rounded-[20px] backdrop-blur-2xl bg-linear-to-br from-white/5 via-white/2 to-transparent border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.35)] w-full min-h-0 items-start text-left">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="inline-flex items-center rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-md p-0.5 shadow-sm">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg font-mono text-[9px] font-bold uppercase tracking-[0.2em] ${
                              isCool
                                ? "bg-[#38bdf8]/20 text-[#38bdf8]"
                                : "bg-[#e7ff3d]/20 text-[#e7ff3d]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isCool ? "bg-[#38bdf8]" : "bg-[#e7ff3d]"
                              }`}
                            />
                            {module.weeks.includes("–") ? "WEEKS" : "WEEK"}
                          </span>
                          <span className="px-2.5 py-0.5 font-mono text-xs font-bold text-white tracking-wider">
                            {module.weeks}
                          </span>
                        </div>
                      </div>

                      <h3 className="relative z-10 text-xl font-serif font-medium text-white mb-2 tracking-tight">
                        {module.title}
                      </h3>

                      <p className="relative z-10 text-sm leading-relaxed text-white/70 font-light">
                        {module.body}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </CurriculumStage>
    </section>
  );
}
