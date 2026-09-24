"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

const FOUNDER_IMAGE = "/about/founder.webp";

export default function AboutFounder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // Client-side luxury studio portrait processing:
    // Seamlessly cuts out the stark white background of founder.webp
    // so she sits immersed in the dark cathedral arch studio environment!
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = FOUNDER_IMAGE;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // BFS flood fill from the borders to ONLY remove background around her
        // and strictly preserve all portrait skin, eyes, and attire details.
        const visited = new Uint8Array(w * h);
        const queue: number[] = [];

        // Seed with border pixels with high brightness (> 215)
        for (let x = 0; x < w; x++) {
          const idxTop = x * 4;
          if ((data[idxTop] + data[idxTop + 1] + data[idxTop + 2]) / 3 > 215) {
            queue.push(x, 0);
            visited[x] = 1;
          }
        }
        for (let y = 0; y < h; y++) {
          const idxLeft = y * w * 4;
          if (
            (data[idxLeft] + data[idxLeft + 1] + data[idxLeft + 2]) / 3 >
            215
          ) {
            queue.push(0, y);
            visited[y * w] = 1;
          }
          const idxRight = (y * w + (w - 1)) * 4;
          if (
            (data[idxRight] + data[idxRight + 1] + data[idxRight + 2]) / 3 >
            215
          ) {
            queue.push(w - 1, y);
            visited[y * w + (w - 1)] = 1;
          }
        }

        let head = 0;
        while (head < queue.length) {
          const cx = queue[head++];
          const cy = queue[head++];
          const idx = (cy * w + cx) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const brightness = (r + g + b) / 3;

          if (brightness > 215) {
            if (brightness > 242) {
              data[idx + 3] = 0; // Pure transparent
            } else {
              // Smooth anti-aliased edge feathering
              data[idx + 3] = Math.round(((242 - brightness) / 27) * 255);
            }

            const neighbors = [
              [cx + 1, cy],
              [cx - 1, cy],
              [cx, cy + 1],
              [cx, cy - 1],
            ];
            for (let i = 0; i < 4; i++) {
              const nx = neighbors[i][0];
              const ny = neighbors[i][1];
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                const nPos = ny * w + nx;
                if (!visited[nPos]) {
                  visited[nPos] = 1;
                  const nIdx = nPos * 4;
                  const nB = (data[nIdx] + data[nIdx + 1] + data[nIdx + 2]) / 3;
                  if (nB > 210) {
                    queue.push(nx, ny);
                  }
                }
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setCutoutUrl(canvas.toDataURL("image/webp", 0.95));
      } catch (err) {
        console.warn("Portrait cutout fallback:", err);
      }
    };
  }, []);

  // Motion Scroll Hook: tracks progress through pinned scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* --------------------------------------------------------------------------
     GPU Scroll Choreography:
     1. Off-Screen Entrance & Settle Stage (progress: 0.00 -> 0.22):
        - Portrait enters from OUTSIDE the screen below (heroY: 90vh -> 0vh)
        - Starts commanding & slightly larger (scale: 1.40 -> 1.0)
        - Fades in smoothly from outer space (opacity: 0 -> 1.0)
        - Settles perfectly into the current centered framed arch position
     2. Center Full-Size Pause (progress: 0.22 -> 0.28):
        - Rests centered at current framed size (y: 0, scale: 1.0, x: 0)
     3. Glide to Left (progress: 0.28 -> 0.46):
        - Glides from center (x: 0) -> left (x: -285px)
        - Stays at full current size (scale: 1.0)
     4. Story Reveal on the Right (progress: 0.46 -> 0.60):
        - Portrait is safely settled on the left
        - Story column smoothly fades in (opacity: 0 -> 1, x: 25 -> 0)
     5. Permanent Locked Reading Stage (progress: 0.60 -> 1.00):
        - Everything stays 100% solid, crisp, and readable
     -------------------------------------------------------------------------- */
  const heroY = useTransform(scrollYProgress, (progress: number) => {
    if (progress <= 0.0) return "90vh";
    if (progress >= 0.22) return "0vh";
    const t = progress / 0.22;
    // Cubic ease-out deceleration: sweeps smoothly in from outer screen and settles
    const easeOut = 1 - Math.pow(1 - t, 3);
    return `${(90 * (1 - easeOut)).toFixed(2)}vh`;
  });

  const heroScale = useTransform(scrollYProgress, (progress: number) => {
    if (progress <= 0.0) return 1.4;
    if (progress >= 0.22) return 1.0;
    const t = progress / 0.22;
    // Cubic ease-out deceleration: zooms down fluidly and settles into current size
    const easeOut = 1 - Math.pow(1 - t, 3);
    return 1.4 - 0.4 * easeOut;
  });

  const heroOpacity = useTransform(scrollYProgress, (progress: number) => {
    if (progress <= 0.0) return 0;
    if (progress >= 0.12) return 1.0;
    const t = progress / 0.12;
    return 1 - Math.pow(1 - t, 2);
  });

  const heroX = useTransform(scrollYProgress, (progress: number) => {
    if (progress < 0.28) return 0;
    if (progress >= 0.46) return -285;
    const t = (progress - 0.28) / (0.46 - 0.28);
    // Smoothstep easing for a fluid glide
    const ease = t * t * (3 - 2 * t);
    return -285 * ease;
  });

  // Story ONLY starts fading in after portrait has already slid out of the way!
  const storyContainerOpacity = useTransform(
    scrollYProgress,
    (progress: number) => {
      if (progress < 0.46) return 0;
      if (progress >= 0.60) return 1;
      const t = (progress - 0.46) / (0.60 - 0.46);
      return t * t * (3 - 2 * t);
    },
  );

  const storyContainerX = useTransform(scrollYProgress, (progress: number) => {
    if (progress < 0.46) return 25;
    if (progress >= 0.60) return 0;
    const t = (progress - 0.46) / (0.60 - 0.46);
    const ease = t * t * (3 - 2 * t);
    return 25 * (1 - ease);
  });

  return (
    <section
      id="founder-experience-section"
      role="region"
      aria-label="Founder Roshna Saffar Experience"
      className="relative z-20 w-full bg-[#020B25] text-white"
    >
      {/* ====================================================================
         MOBILE & TABLET VIEW (< 1024px): Responsive Vertical Layout
         ==================================================================== */}
      <div className="block lg:hidden relative w-full overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 select-none bg-[#020B25]">
        {/* Continuous Dot Grid System matching the page canvas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.065) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient Cosmic Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-137.5 h-100 bg-radial from-[#15388c]/40 via-[#081b4e]/20 to-transparent blur-[130px] pointer-events-none -z-10" />

        <div className="w-full max-w-xl mx-auto px-5 sm:px-8 flex flex-col items-center text-center relative z-10">
          {/* Top Kicker */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 mb-6 shadow-[0_0_16px_rgba(243,252,0,0.12)]">
            <span className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-[#D08817] to-[#F3FC00] shadow-[0_0_6px_#F3FC00]" />
            <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent">
              Founder &amp; Executive Leader
            </span>
          </div>

          {/* Luxury Arch Portrait */}
          <div className="relative flex flex-col items-center mb-8">
            <div className="relative w-56 h-72">
              {/* Soft Photographic Backlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 rounded-t-full rounded-b-3xl bg-radial from-blue-600/30 via-indigo-950/25 to-transparent blur-2xl -z-10"
              />

              {/* Jewelry-Grade Precision Glass Rim */}
              <div className="relative h-full w-full rounded-t-full rounded-b-2xl p-[1.5px] bg-linear-to-b from-white/35 via-white/15 to-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                <div className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-2xl bg-linear-to-b from-[#0e2456] via-[#071333] to-[#020819]">
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full bg-blue-500/25 blur-2xl pointer-events-none" />
                  <Image
                    src={cutoutUrl || FOUNDER_IMAGE}
                    alt="Roshna Saffar — Founder of Virtual Captains"
                    fill
                    sizes="280px"
                    priority
                    unoptimized={Boolean(cutoutUrl)}
                    className="h-full w-full object-cover object-bottom select-none pointer-events-none transition-opacity duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#020819] via-[#020819]/60 to-transparent pointer-events-none z-10" />
                  <div className="absolute top-0 inset-x-0 h-20 bg-linear-to-b from-white/15 to-transparent pointer-events-none rounded-t-full" />
                </div>
              </div>
            </div>

            {/* Attribution Below Arch */}
            <p className="font-serif italic font-normal text-white text-xl tracking-wide mt-4">
              Roshna Saffar
            </p>
            <p className="text-[11px] font-mono uppercase tracking-[0.22em] bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent mt-0.5 font-semibold">
              Founder · Virtual Captains
            </p>
          </div>

          {/* Founder's Story & Credo Card */}
          <div className="w-full text-left p-6 sm:p-7 rounded-2xl border border-white/15 bg-linear-to-br from-white/6 via-white/2 to-transparent backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] space-y-4">
            <h3 className="text-xl sm:text-2xl font-normal tracking-tight text-white font-sans">
              Built on 16+ Years of{" "}
              <span className="font-bold bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent">
                Enterprise Execution
              </span>
            </h3>

            <p className="text-sm text-slate-200/90 font-sans leading-relaxed">
              With 16+ years of leadership in enterprise sales across the Middle
              East, South Asia, and Southeast Asia, Roshna built Virtual
              Captains around a fundamental belief:
            </p>

            <div className="relative my-3 p-4 rounded-xl border border-white/10 bg-white/4">
              <div className="absolute left-0 inset-y-0 w-1 bg-linear-to-b from-[#F3FC00] via-[#D08817] to-transparent rounded-l" />
              <p className="font-serif italic text-base bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent leading-snug">
                &ldquo;Sales capability isn&rsquo;t built by knowing more
                theory. It&rsquo;s built through practice, evaluation and
                real-world execution.&rdquo;
              </p>
              <p className="mt-2 text-xs text-amber-200/80 font-sans italic">
                &ldquo;The best sales strategy is authenticity and
                sincerity.&rdquo;
              </p>
            </div>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Today, she leads Virtual Captains across sales strategy, sales
              enablement, and execution, while spearheading SalesX to empower
              the next generation of sales professionals.
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================================
         DESKTOP VIEW (>= 1024px): Symmetrically Centered Pinned Stage
         Starts zoomed in CENTER, then glides to LEFT.
         Story only reveals on the RIGHT once portrait has cleared the path!
         ==================================================================== */}
      <div className="hidden lg:block">
        <div
          ref={containerRef}
          id="pinned-scroll-container"
          className="relative h-[280vh] w-full"
        >
          {/* STICKY VIEWPORT STAGE */}
          <div
            id="pinned-sticky-stage"
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              width: "100%",
            }}
            className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#020B25]"
          >
            {/* Continuous Dot Grid System matching the page canvas */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-20"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.065) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Ambient Cosmic Background Nebula */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-250 h-162.5 bg-radial from-[#0f3591]/35 via-[#07194a]/20 to-transparent blur-[170px] pointer-events-none -z-10" />

            {/* ── 1. CATHEDRAL ARCH PORTRAIT: Enters from outer screen, settles in CENTER, then glides to LEFT ── */}
            <motion.div
              id="hero-portrait-stage"
              style={{
                position: "absolute",
                left: "50%",
                top: "calc(50% + 46px)",
                x: heroX,
                y: heroY,
                scale: heroScale,
                opacity: heroOpacity,
                marginLeft: -130,
                marginTop: -205,
                zIndex: 25,
              }}
              className="flex flex-col items-center pointer-events-auto will-change-transform"
            >
              {/* The Cathedral Arch Frame (260px x 350px) */}
              <div className="relative w-65 h-87.5">
                {/* Soft Atmospheric Deep Blue Backlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-8 rounded-t-full rounded-b-3xl bg-radial from-blue-600/30 via-indigo-950/20 to-transparent blur-3xl -z-10"
                />

                {/* Precision Jewelry Glass Rim (Clean, elegant, premium) */}
                <div className="relative h-full w-full rounded-t-full rounded-b-2xl p-[1.5px] bg-linear-to-b from-white/35 via-white/15 to-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
                  {/* Inner Dark Studio Chamber */}
                  <div className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-2xl bg-linear-to-b from-[#0e2456] via-[#071333] to-[#020819]">
                    {/* Interior spotlight behind silhouette */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-blue-500/25 blur-3xl pointer-events-none" />

                    {/* Portrait Image */}
                    <Image
                      src={cutoutUrl || FOUNDER_IMAGE}
                      alt="Roshna Saffar — Founder of Virtual Captains"
                      fill
                      sizes="320px"
                      priority
                      unoptimized={Boolean(cutoutUrl)}
                      className="h-full w-full object-cover object-bottom select-none pointer-events-none transition-opacity duration-300"
                    />

                    {/* Bottom Cinematic Vignette to blend black blazer into arch base */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#020819] via-[#020819]/60 to-transparent pointer-events-none z-10" />

                    {/* Top Specular Glass Reflection */}
                    <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-white/12 to-transparent pointer-events-none rounded-t-full" />
                  </div>
                </div>
              </div>

              {/* Attribution Below Arch */}
              <div className="mt-4 flex flex-col items-center text-center select-none">
                <p className="font-serif italic font-normal text-white text-2xl lg:text-[26px] tracking-wide">
                  Roshna Saffar
                </p>
                <div className="inline-flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-mono uppercase tracking-[0.24em] bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent font-semibold">
                    Founder · Virtual Captains
                  </span>
                </div>
              </div>
            </motion.div>

            {/* ── 2. RIGHT-SIDE NARRATIVE STORY: Placed safely BELOW navbar with calc(50% + 46px) ── */}
            <motion.div
              id="story-column-stage"
              style={{
                position: "absolute",
                left: "50%",
                marginLeft: 40,
                top: "calc(50% + 46px)",
                y: "-50%",
                x: storyContainerX,
                opacity: storyContainerOpacity,
                zIndex: 30,
              }}
              className="w-125 max-w-125 pointer-events-auto will-change-transform"
            >
              <div className="flex flex-col items-start text-left">
                {/* Kicker Pill */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/4 backdrop-blur-md px-3.5 py-1 mb-3.5 shadow-[0_0_16px_rgba(243,252,0,0.08)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-[#D08817] to-[#F3FC00] animate-pulse shadow-[0_0_6px_#F3FC00]" />
                  <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent">
                    Leadership &amp; Vision
                  </span>
                </div>

                {/* Section Headline */}
                <h2 className="text-2xl sm:text-[1.85rem] lg:text-[2.1rem] font-normal tracking-tight text-white font-sans leading-[1.22]">
                  Built on 16+ Years of{" "}
                  <span className="font-bold bg-linear-to-r from-[#D08817] to-[#F3FC00] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(243,252,0,0.25)]">
                    Enterprise Execution
                  </span>
                </h2>

                {/* Bio Paragraph */}
                <p className="mt-3 text-[13.5px] lg:text-[14.5px] text-slate-200/90 font-sans leading-relaxed">
                  With 16+ years of leadership in enterprise sales across the
                  Middle East, South Asia, and Southeast Asia, Roshna built
                  Virtual Captains around a fundamental belief:
                </p>

                {/* Featured Pull-Quote Card */}
                <div className="relative my-3.5 w-full p-4.5 sm:p-5 rounded-2xl border border-white/12 bg-linear-to-br from-white/7 via-white/2.5 to-transparent backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.45)] overflow-hidden group">
                  {/* Subtle Corner Ambient Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-[#F3FC00]/10 via-[#D08817]/10 to-transparent blur-2xl pointer-events-none" />

                  {/* Left Golden Accent Line */}
                  <div className="absolute left-0 inset-y-0 w-1 bg-linear-to-b from-[#F3FC00] via-[#D08817] to-transparent" />

                  <p className="font-serif italic text-base sm:text-lg lg:text-[19px] font-normal text-white leading-relaxed">
                    &ldquo;Sales capability isn&rsquo;t built by knowing more
                    theory. It&rsquo;s built through practice, evaluation and
                    real-world execution.&rdquo;
                  </p>

                  <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <p className="text-xs sm:text-[12.5px] text-amber-200/80 font-sans italic">
                      &ldquo;The best sales strategy is authenticity and
                      sincerity.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Role Description */}
                <p className="text-[13px] lg:text-[14px] text-slate-300 leading-relaxed font-sans">
                  Today, she leads Virtual Captains across sales strategy, sales
                  enablement, and execution, while spearheading SalesX to train
                  and develop the next generation of high-performing sales
                  leaders.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
