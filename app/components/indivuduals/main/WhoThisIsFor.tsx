"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { audienceSlides, whoThisIsFor } from "@/content/site";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/animations/gsap";

export function WhoThisIsFor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const copyContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = containerRef.current;
      const wave = waveRef.current;
      if (!section || !wave) return;

      const slides = gsap.utils.toArray<HTMLElement>("[data-who-copy-slide]");
      const imageSlides = gsap.utils.toArray<HTMLElement>("[data-who-image-slide]");
      const dots = gsap.utils.toArray<HTMLButtonElement>("[role='tab']");
      let activeIndex = 0;

      // Initialize slides: first one is visible, others hidden
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          opacity: i === 0 ? 1 : 0,
          pointerEvents: i === 0 ? "auto" : "none",
          zIndex: i === 0 ? 2 : 0,
        });
      });

      imageSlides.forEach((slide, i) => {
        gsap.set(slide, {
          opacity: i === 0 ? 1 : 0,
          zIndex: i === 0 ? 2 : 0,
        });
      });

      function goToSlide(index: number) {
        if (index === activeIndex) return;

        const currentSlide = slides[activeIndex];
        const nextSlide = slides[index];
        const currentImg = imageSlides[activeIndex];
        const nextImg = imageSlides[index];

        // Stop ongoing animations so rapid scrolling doesn't break
        gsap.killTweensOf(slides);
        gsap.killTweensOf(imageSlides);

        // Ensure current is visible to animate out, and next is prepared
        gsap.set(currentSlide, {
          opacity: 1,
          zIndex: 1,
          pointerEvents: "none",
        });
        gsap.set(nextSlide, {
          zIndex: 2,
          pointerEvents: "auto",
          filter: "blur(0px)",
        });

        gsap.set(currentImg, { zIndex: 1, filter: "blur(0px)" });
        gsap.set(nextImg, { zIndex: 2, filter: "blur(0px)" });

        const isForward = index > activeIndex;

        if (isForward) {
          // Forward scroll: old leaves top-left, new enters bottom-right
          gsap.to(currentSlide, {
            opacity: 0,
            x: -80,
            y: -40,
            rotation: -10,
            filter: "blur(12px)",
            duration: 0.6,
            ease: "power2.in",
          });
          gsap.fromTo(
            nextSlide,
            {
              opacity: 0,
              x: 120,
              y: 60,
              rotation: 15,
              scale: 0.9,
              transformOrigin: "bottom right",
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 1.0,
              ease: "back.out(1.2)",
            },
          );

          // Image animation
          gsap.to(currentImg, { opacity: 0, x: -40, filter: "blur(12px)", duration: 0.6, ease: "power2.in" });
          gsap.fromTo(
            nextImg,
            { opacity: 0, x: 40, scale: 0.95 },
            { opacity: 1, x: 0, scale: 1, duration: 1.0, ease: "back.out(1.2)" }
          );
        } else {
          // Backward scroll: old leaves bottom-right, new enters top-left
          gsap.to(currentSlide, {
            opacity: 0,
            x: 120,
            y: 60,
            rotation: 15,
            filter: "blur(12px)",
            duration: 0.6,
            ease: "power2.in",
          });
          gsap.fromTo(
            nextSlide,
            {
              opacity: 0,
              x: -80,
              y: -40,
              rotation: -10,
              scale: 0.9,
              transformOrigin: "bottom right",
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 1.0,
              ease: "back.out(1.2)",
            },
          );

          // Image animation
          gsap.to(currentImg, { opacity: 0, x: 40, filter: "blur(12px)", duration: 0.6, ease: "power2.in" });
          gsap.fromTo(
            nextImg,
            { opacity: 0, x: -40, scale: 0.95 },
            { opacity: 1, x: 0, scale: 1, duration: 1.0, ease: "back.out(1.2)" }
          );
        }

        // Update dots
        dots.forEach((dot, i) => {
          dot.setAttribute("aria-selected", (i === index).toString());
        });

        // Update wave hue
        const nextHue = nextSlide.getAttribute("data-hue");
        if (nextHue && wave) {
          gsap.to(wave, {
            "--wave-hue": `${nextHue}deg`,
            duration: 0.6,
            ease: "power2.out",
          });

          // Also retrigger the wave sweep animation by resetting its keyframe
          const sweep = wave.querySelector(
            ".who__wave-sweep",
          ) as HTMLElement | null;
          if (sweep) {
            sweep.style.animation = "none";
            sweep.offsetHeight; // trigger reflow
            sweep.style.animation = "";
          }
        }

        activeIndex = index;
      }

      // Create the pinning scroll trigger
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // Reduced pinning duration for better UX
        end: `+=${slides.length * 75}%`,
        pin: true,
        snap: {
          snapTo: 1 / (slides.length - 1),
          duration: 0.4,
          ease: "power1.inOut",
        },
        onUpdate: (self) => {
          // Calculate which slide we should be on based on scroll progress with proper thresholds
          const targetIndex = Math.round(self.progress * (slides.length - 1));
          goToSlide(targetIndex);
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      id="who"
      ref={containerRef}
      className="section bg-(--white) text-(--ink) overflow-hidden min-h-screen flex flex-col justify-center pt-20 pb-6 md:pt-24 md:pb-8"
      aria-labelledby="who-heading"
    >
      <div className="frame w-full max-w-372 px-4 sm:px-8 lg:px-12 mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-1.5 mb-3">
          <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#2563eb]">
            Target Profiles
          </span>
        </div>
        <h2
          className="text-center text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-(--ink)"
          id="who-heading"
        >
          Who Is This For
        </h2>

        <div className="w-[85%] mt-6 md:mt-10 max-[1023px]:w-[calc(100%-2*var(--gutter))]">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-x-[min(3.97vw,60px)] items-center max-[1023px]:grid-cols-1 max-[1023px]:gap-y-[clamp(1.5rem,5vw,3rem)] max-[1023px]:justify-items-center max-[1023px]:text-center">
            {/* Wave Graphic */}
            <div
              className="relative w-full overflow-hidden rounded-[28px] h-70 sm:h-87.5 md:h-100 max-[1023px]:max-w-130 max-[767px]:max-w-full shadow-[0_16px_36px_rgba(0,0,0,0.08)] border border-black/5"
              data-who-wave=""
              ref={waveRef}
              style={
                {
                  "--wave-hue": `${audienceSlides[0].waveHue}deg`,
                } as CSSProperties
              }
            >
              {audienceSlides.map((slide) => (
                <div key={slide.id} className="absolute inset-0 w-full h-full will-change-transform" data-who-image-slide="">
                  <Image
                    src={slide.image || "/inidividuals/wave.webp"}
                    alt="who-wave"
                    width={600}
                    height={495}
                    sizes="(max-width: 1023px) 90vw, 42vw"
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>
              ))}
              <span className="who__wave-sweep" aria-hidden="true" />
            </div>

            {/* Text Copy */}
            <div
              ref={copyContainerRef}
              className="relative w-full pt-[min(1.32vw,20px)] max-[1023px]:pt-0"
            >
              {/* Invisible spacer to maintain container height for absolute children */}
              <div className="w-full invisible pointer-events-none opacity-0">
                <p className="grad-text [--grad:var(--grad-audience)] text-2xl md:text-4xl lg:text-5xl font-serif font-normal leading-[1.1] tracking-[-0.01em]">
                  {audienceSlides[0].eyebrow}
                </p>
                <h3 className="mt-2 md:mt-4 text-lg md:text-xl font-medium tracking-[-0.01em]">
                  {audienceSlides[0].title}
                </h3>
                <p className="max-w-[25em] mt-4 md:mt-6 text-sm md:text-base leading-relaxed max-[1023px]:max-w-[46ch]">
                  {audienceSlides[0].body}
                </p>
                <div className="mt-6 md:mt-8">
                  <span className="btn-pill">{audienceSlides[0].cta}</span>
                </div>
              </div>

              {/* Actual slides */}
              {audienceSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="w-full absolute top-0 left-0 will-change-transform"
                  data-who-copy-slide=""
                  data-hue={slide.waveHue}
                >
                  <p
                    className="grad-text [--grad:var(--grad-audience)] text-2xl md:text-4xl lg:text-5xl font-serif font-normal leading-[1.1] tracking-[-0.01em] pb-1.5"
                    data-who-eyebrow=""
                  >
                    {slide.eyebrow}
                  </p>
                  <h3
                    className="mt-2 md:mt-4 text-lg md:text-xl font-serif font-medium tracking-tight text-(--ink)"
                    data-who-slide-title=""
                  >
                    {slide.title}
                  </h3>
                  <p
                    className="max-w-[25em] mt-4 md:mt-6 text-sm md:text-base leading-relaxed text-(--ink-soft) max-[1023px]:max-w-[46ch]"
                    data-who-body=""
                  >
                    {slide.body}
                  </p>
                  <div className="mt-6 md:mt-8 flex items-center justify-start max-[1023px]:justify-center">
                    <Link
                      href={slide.href}
                      className="group inline-flex items-center gap-2 rounded-full bg-[#0a0b0d] hover:bg-[#1c4fc0] text-white px-7 py-3 text-xs sm:text-sm font-semibold tracking-wide shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-200 hover:scale-102 active:scale-98"
                    >
                      <span>{slide.cta}</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex justify-center gap-2 md:gap-3 mt-10 relative z-10"
            role="tablist"
            aria-label="Audience segments"
          >
            {audienceSlides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className="w-3 h-3 border-[1.5px] border-[#b9bec9] rounded-full transition-all duration-300 aria-selected:w-8 aria-selected:bg-[#2563eb] aria-selected:border-[#2563eb]"
                aria-selected={index === 0}
                aria-label={item.eyebrow}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
