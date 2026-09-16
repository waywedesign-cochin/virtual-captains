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
              <div className="inline-flex items-center gap-3 mb-8">
                <span className="w-8 h-px bg-white/30" />
                <p className="text-sm font-medium text-white/50 tracking-[0.25em] uppercase">
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
                        ? "block text-[clamp(2rem,3.5vw,3.25rem)] font-serif font-light leading-[1.1] text-white tracking-tight"
                        : "block text-[clamp(1.5rem,2.5vw,2.25rem)] font-sans font-light leading-snug text-white/60 mt-4"
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
                className="absolute top-16 left-0 w-0.5 ml-[-0.5px] bg-linear-to-b from-(--cyan) to-(--pink) origin-top shadow-[0_0_10px_rgba(62,198,245,0.5)]"
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
                      className="absolute left-[calc(-4px)] top-12 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.1)] group-hover:bg-(--cyan) group-hover:shadow-[0_0_0_6px_rgba(62,198,245,0.2)] transition-all duration-500"
                      data-timeline-node=""
                    />

                    <article
                      className="relative flex flex-col justify-center p-10 overflow-hidden rounded-2xl backdrop-blur-xl bg-white/2 border border-white/8 hover:bg-white/4 hover:border-white/15 hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 min-h-56 items-start text-left"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <span className={`text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isCool ? "text-(--cyan) border-(--cyan)/20 bg-(--cyan)/5" : "text-(--pink) border-(--pink)/20 bg-(--pink)/5"}`}>
                          Weeks {module.weeks}
                        </span>
                      </div>
                      
                      <h3 className="relative z-10 text-2xl lg:text-3xl font-medium text-white/90 mb-3 tracking-tight">
                        {module.title}
                      </h3>
                      
                      <p className="relative z-10 text-base leading-relaxed text-white/60 font-light max-w-lg">
                        {module.body}
                      </p>
                    </article>
                  </div>
                )})}
              </div>
            </div>
          </div>

          {/* Mobile Layout: Stacked Rail */}
          <div className="block lg:hidden mt-8">
            <div className="flex flex-col items-center mb-12">
              <span className="w-8 h-px bg-white/30 mb-4" />
              <p className="text-xs font-medium text-white/50 tracking-[0.25em] uppercase mb-6">
                {curriculum.title}
              </p>
              <h2 className="w-full text-center">
                {curriculum.statement.map((line, index) => (
                  <span
                    key={line}
                    className={
                      index === 0
                        ? "block text-[clamp(2rem,7vw,2.5rem)] font-serif font-light leading-[1.1] text-white tracking-tight"
                        : "block text-[clamp(1.25rem,5vw,1.5rem)] font-sans font-light leading-snug text-white/60 mt-3"
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
                  className="relative pb-[clamp(3rem,8vw,4rem)] before:absolute before:top-6 before:-left-[calc(clamp(1.5rem,6vw,2.5rem)-0.125rem)] before:h-1.75 before:w-1.75 before:rounded-full before:bg-white/50 before:shadow-[0_0_0_4px_rgba(255,255,255,0.05)]"
                  key={`rail-${module.id}`}
                  data-curriculum-rail-item=""
                >
                  <article
                    className="relative flex flex-col justify-center p-8 overflow-hidden rounded-2xl backdrop-blur-xl bg-white/2 border border-white/8 w-full min-h-0 items-start text-left"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${isCool ? "text-(--cyan) border-(--cyan)/20 bg-(--cyan)/5" : "text-(--pink) border-(--pink)/20 bg-(--pink)/5"}`}>
                        Weeks {module.weeks}
                      </span>
                    </div>

                    <h3 className="relative z-10 text-xl font-medium text-white/90 mb-3 tracking-tight">
                      {module.title}
                    </h3>
                    
                    <p className="relative z-10 text-sm leading-relaxed text-white/60 font-light">
                      {module.body}
                    </p>
                  </article>
                </li>
              )})}
            </ol>
          </div>
        </div>
      </CurriculumStage>
    </section>
  );
}

