"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { audienceSlides, whoThisIsFor } from "@/content/site";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/animations/gsap";
import { useHeadingZoom } from "@/components/about/useHeadingZoom";

export function WhoThisIsFor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const copyContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useHeadingZoom(headingRef);

  useGSAP(
    () => {
      const section = containerRef.current;
      const wave = waveRef.current;
      if (!section || !wave) return;

      const slides = gsap.utils.toArray<HTMLElement>("[data-who-copy-slide]");
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

      function goToSlide(index: number) {
        if (index === activeIndex) return;

        const currentSlide = slides[activeIndex];
        const nextSlide = slides[index];

        // Stop ongoing animations so rapid clicks/scrolls don't stack up
        const nextLines = Array.from(nextSlide.children) as HTMLElement[];
        gsap.killTweensOf([...slides, ...nextLines]);

        // Only opacity + transform are animated (GPU-composited). The old
        // blur/rotate fly-out repainted the whole slide every frame.
        const dir = index > activeIndex ? 1 : -1;

        gsap.set(currentSlide, { zIndex: 1, pointerEvents: "none" });
        gsap.set(nextSlide, { zIndex: 2, pointerEvents: "auto", opacity: 1, x: 0, y: 0 });

        // 1. Outgoing copy: quick fade + lift away in the travel direction
        gsap.to(currentSlide, {
          opacity: 0,
          y: -14 * dir,
          duration: 0.3,
          ease: "power2.in",
        });

        // 2. Incoming copy: its lines (name, title, body, CTA) rise in one
        //    after another — an editorial reveal rather than a block swap
        gsap.fromTo(
          nextLines,
          { opacity: 0, y: 18 * dir },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.06,
            delay: 0.18,
          },
        );

        // Update dots
        dots.forEach((dot, i) => {
          dot.setAttribute("aria-selected", (i === index).toString());
        });

        activeIndex = index;
      }

      // Phones/tablets: a timed carousel (restarted by every manual change)
      // instead of scroll-pinning. Paused while the section is off screen.
      let autoplay: number | undefined;
      let onScreen = false;
      const isPinned = () => window.matchMedia("(min-width: 1024px)").matches;
      const restartAutoplay = () => {
        window.clearTimeout(autoplay);
        if (!onScreen || isPinned()) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        autoplay = window.setTimeout(() => {
          goToSlide((activeIndex + 1) % slides.length);
          restartAutoplay();
        }, 6000);
      };
      const goManual = (index: number) => {
        goToSlide(index);
        restartAutoplay();
      };

      // Attach click listeners to tab dots so users can click between profiles
      const onDotClick = dots.map((dot, i) => {
        const handler = () => goManual(i);
        dot.addEventListener("click", handler);
        return handler;
      });

      // Swipe between profiles on touch screens
      let touchX: number | null = null;
      const onTouchStart = (e: TouchEvent) => {
        touchX = e.touches[0].clientX;
      };
      const onTouchEnd = (e: TouchEvent) => {
        if (touchX === null || isPinned()) return;
        const dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) < 40) return;
        goManual((activeIndex + (dx < 0 ? 1 : -1) + slides.length) % slides.length);
      };
      section.addEventListener("touchstart", onTouchStart, { passive: true });
      section.addEventListener("touchend", onTouchEnd);

      const visibility = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen) restartAutoplay();
          else window.clearTimeout(autoplay);
        },
        { threshold: 0.35 },
      );
      visibility.observe(section);

      // Desktop only: pin and scroll through the profiles
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        window.clearTimeout(autoplay);
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          anticipatePin: 1,
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
      });


      return () => {
        window.clearTimeout(autoplay);
        visibility.disconnect();
        section.removeEventListener("touchstart", onTouchStart);
        section.removeEventListener("touchend", onTouchEnd);
        dots.forEach((dot, i) => dot.removeEventListener("click", onDotClick[i]));
      };
    },
    { scope: containerRef },
  );

  return (
    <section
      id="who"
      ref={containerRef}
      className="section bg-(--white) text-(--ink) overflow-hidden flex flex-col justify-center py-12 sm:py-16 lg:min-h-screen lg:pt-20 lg:pb-6"
      aria-labelledby="who-heading"
    >
      <div className="frame w-full max-w-372 px-4 sm:px-8 lg:px-12 mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-1.5 mb-3">
          <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
          <span className="type-eyebrow text-[#2563eb]">
            Target Profiles
          </span>
        </div>
        <h2
          ref={headingRef}
          className="text-center type-h2 font-medium text-(--ink)"
          id="who-heading"
        >
          Who Is This For
        </h2>

        {/* Below 1024px two layouts:
              portrait (> 500px tall)  → stacked & centred
              rotated phone (≤ 500px)  → image + copy side by side (the
                                         desktop grid), with a shorter image
            Arbitrary media variants are used because the max-* breakpoint
            variants aren't generated in this project. */}
        <div className="w-[85%] mt-4 md:mt-6 [@media(max-width:1023px)]:w-full [@media(max-width:1023px)_and_(max-height:500px)]:mt-5">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-x-[min(3.97vw,60px)] items-center [@media(max-width:1023px)_and_(min-height:501px)]:grid-cols-1 [@media(max-width:1023px)_and_(min-height:501px)]:gap-y-[clamp(1.5rem,5vw,3rem)] [@media(max-width:1023px)_and_(min-height:501px)]:justify-items-center [@media(max-width:1023px)_and_(min-height:501px)]:text-center [@media(max-width:1023px)_and_(max-height:500px)]:gap-x-6">
            {/* Wave Graphic */}
            <div
              className="relative w-full overflow-hidden rounded-[28px] h-60 sm:h-72 md:h-80 [@media(max-width:1023px)_and_(min-height:501px)]:max-w-130 [@media(max-height:500px)]:h-50 [@media(max-height:500px)]:rounded-2xl"
              data-who-wave=""
              ref={waveRef}
              style={
                {
                  "--wave-hue": `${audienceSlides[0].waveHue}deg`,
                } as CSSProperties
              }
            >
              <video
                src="/inidividuals/1212.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                aria-hidden="true"
                tabIndex={-1}
                className="absolute inset-0 h-full w-full object-cover mix-blend-multiply [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_78%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_78%)]"
              />
            </div>

            {/* Text Copy */}
            {/* Slides share one grid cell, so the box is always as tall as
                the tallest slide (no spacer sized to slide 1 only) */}
            <div
              ref={copyContainerRef}
              className="relative grid w-full pt-[min(1.32vw,20px)] [@media(max-width:1023px)]:pt-0"
            >
              {audienceSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="col-start-1 row-start-1 w-full will-change-transform"
                  data-who-copy-slide=""
                  data-hue={slide.waveHue}
                >
                  <p
                    className="grad-text [--grad:var(--grad-audience)] type-display font-normal pb-1.5"
                    data-who-eyebrow=""
                  >
                    {slide.eyebrow}
                  </p>
                  <h3
                    className="mt-2 md:mt-4 type-h3 font-medium text-(--ink)"
                    data-who-slide-title=""
                  >
                    {slide.title}
                  </h3>
                  <p
                    className="max-w-[25em] mt-4 md:mt-6 type-body text-(--ink-soft) [@media(max-width:1023px)_and_(min-height:501px)]:mx-auto [@media(max-width:1023px)_and_(min-height:501px)]:max-w-[46ch] [@media(max-height:500px)]:mt-2"
                    data-who-body=""
                  >
                    {slide.body}
                  </p>
                  {/* Centred by default (stacked phones/tablets); left-aligned
                      beside the image on desktop and rotated phones */}
                  <div className="mt-6 md:mt-8 flex items-center justify-center lg:justify-start [@media(max-height:500px)]:justify-start [@media(max-height:500px)]:mt-4">
                    <Link
                      href={slide.href}
                      className="group inline-flex items-center gap-2 rounded-full bg-[#0a0b0d] hover:bg-[#1c4fc0] text-white px-7 py-3 text-xs sm:text-sm font-semibold tracking-wide shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-200 hover:scale-102 active:scale-98"
                    >
                      <span>{slide.cta}</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex justify-center gap-2 md:gap-3 mt-6 relative z-10"
            role="tablist"
            aria-label="Audience segments"
          >
            {audienceSlides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className="group flex h-7 cursor-pointer items-center justify-center px-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/60"
                aria-selected={index === 0}
                aria-label={item.eyebrow}
              >
                <span className="block h-3 w-3 rounded-full border-[1.5px] border-[#b9bec9] transition-all duration-300 group-aria-selected:w-8 group-aria-selected:border-[#2563eb] group-aria-selected:bg-[#2563eb]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
