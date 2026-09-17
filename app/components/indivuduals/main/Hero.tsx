import Image from "next/image";
import Link from "next/link";
import { hero } from "@/content/site";
import { HeroOrbit } from "./HeroOrbit";
import { HeroStage } from "./HeroStage";
import { HeroCTA } from "./HeroCTA";

export function Hero() {
  return (
    <section className="section hero" aria-labelledby="hero-heading">
      <HeroStage>
        <div className="hero__halo" aria-hidden="true" />

        <div className="hero__figure" aria-hidden="true">
          <Image
            src="/inidividuals/silhouette.webp"
            alt=""
            width={1512}
            height={941}
            priority
            sizes="100vw"
          />
        </div>

        <HeroOrbit />

        <div className="hero__copy text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-4 py-1.5 shadow-[0_0_20px_rgba(56,189,248,0.15)] mb-3">
            <span className="h-2 w-2 rounded-full bg-[#e7ff3d] animate-pulse shadow-[0_0_8px_#e7ff3d]" />
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
              {hero.eyebrow}
            </p>
          </div>
          <h1 className="hero__headline font-serif text-white tracking-tight" id="hero-heading">
            {hero.headline.map((line, index) => (
              <span
                key={line}
                className={index === 0 ? "block font-light" : "block italic text-[#8fd0ff] drop-shadow-[0_0_30px_rgba(143,208,255,0.45)]"}
              >
                {line}
              </span>
            ))}
          </h1>
        </div>

        <div className="hero__cta">
          {/* Vector 3 (Dipping frame line) */}
          <svg
            className="hero__cta-frame"
            viewBox="0 0 1284 89"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ctaFrameGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1168D2" />
                <stop offset="16.8%" stopColor="#377BFB" />
                <stop offset="34.6%" stopColor="#F6FBFF" />
                <stop offset="50.5%" stopColor="#059EF6" />
                <stop offset="84.1%" stopColor="#0C57D1" />
                <stop offset="100%" stopColor="#0632AB" />
              </linearGradient>
              <linearGradient
                id="ctaFrameMovingGrad"
                gradientUnits="userSpaceOnUse"
                x1="-400"
                y1="0"
                x2="0"
                y2="0"
                className="hero__cta-mask-rect"
              >
                <stop offset="0%" stopColor="#1168D2" stopOpacity="0" />
                <stop offset="25%" stopColor="#377BFB" stopOpacity="1" />
                <stop offset="50%" stopColor="#059EF6" stopOpacity="1" />
                <stop offset="75%" stopColor="#0C57D1" stopOpacity="1" />
                <stop offset="100%" stopColor="#0632AB" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Dim background track */}
            <path
              d="M0 0.5H131.6C149.4 0.5 166.5 7.7 178.9 20.5L221.2 64.0C236.1 79.3 256.5 88 277.9 88H942.6C960.1 88 976.9 81.0 989.3 68.6L1038.1 19.8C1050.5 7.4 1067.3 0.5 1084.8 0.5H1284"
              stroke="var(--hairline-dim)"
              strokeWidth="1"
              fill="none"
            />
            {/* Bright moving part */}
            <path
              d="M0 0.5H131.6C149.4 0.5 166.5 7.7 178.9 20.5L221.2 64.0C236.1 79.3 256.5 88 277.9 88H942.6C960.1 88 976.9 81.0 989.3 68.6L1038.1 19.8C1050.5 7.4 1067.3 0.5 1084.8 0.5H1284"
              stroke="url(#ctaFrameMovingGrad)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>

          <HeroCTA
            primaryHref={hero.primaryCta.href}
            primaryLabel={hero.primaryCta.label}
            secondaryHref={hero.secondaryCta.href}
            secondaryLabel={hero.secondaryCta.label}
          />

          {/* Vector 6 (Straight underline) */}
          <div className="hero__cta-underline" aria-hidden="true">
            <svg
              viewBox="0 0 1284 1"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="ctaUnderlineMovingGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1168D2" stopOpacity="0" />
                  <stop offset="25%" stopColor="#377BFB" stopOpacity="1" />
                  <stop offset="50%" stopColor="#059EF6" stopOpacity="1" />
                  <stop offset="75%" stopColor="#0C57D1" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0632AB" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Dim background track */}
              <path
                d="M0 0.5H1284"
                stroke="var(--hairline-dim)"
                strokeWidth="1"
                fill="none"
              />
              {/* Bright moving part (animated rect since it's a straight line) */}
              <rect
                className="hero__cta-mask-rect"
                x="-400"
                y="-0.25"
                width="400"
                height="1.5"
                fill="url(#ctaUnderlineMovingGrad)"
              />
            </svg>
          </div>
        </div>
      </HeroStage>
    </section>
  );
}
