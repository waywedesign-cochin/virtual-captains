"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LAND_DOTS } from "./globeDots";

gsap.registerPlugin(ScrollTrigger);

type Location = {
  name: string;
  country: string;
  lon: number;
  lat: number;
};

const LOCATIONS: Location[] = [
  { name: "Dubai", country: "United Arab Emirates", lon: 55.27, lat: 25.2 },
  {
    name: "Abu Dhabi",
    country: "United Arab Emirates",
    lon: 54.37,
    lat: 24.45,
  },
  { name: "Riyadh", country: "Saudi Arabia", lon: 46.72, lat: 24.71 },
  { name: "Doha", country: "Qatar", lon: 51.53, lat: 25.29 },
  { name: "Manama", country: "Bahrain", lon: 50.59, lat: 26.23 },
  { name: "Kuwait City", country: "Kuwait", lon: 47.98, lat: 29.38 },
  { name: "Muscat", country: "Oman", lon: 58.41, lat: 23.59 },
];

/**
 * Camera waypoints the scroll position moves the map/globe through: an
 * establishing world view, a swing into the Gulf, each client city in turn,
 * then a pull-back that leaves every marker on screen at once.
 */
const JOURNEY: { lon: number; lat: number; zoom: number; label?: string }[] = [
  { lon: 14, lat: 16, zoom: 1 },
  { lon: 44, lat: 24, zoom: 1.35, label: "The Gulf" },
  { lon: 55.27, lat: 25.2, zoom: 2.2, label: "Dubai" },
  { lon: 46.72, lat: 24.71, zoom: 2.2, label: "Riyadh" },
  { lon: 51.53, lat: 25.29, zoom: 2.2, label: "Doha" },
  { lon: 58.41, lat: 23.59, zoom: 2.2, label: "Muscat" },
  { lon: 52, lat: 25, zoom: 1.45, label: "Middle East" },
];

const DEG = Math.PI / 180;
const HIGHLIGHT = "#e7ff3d";

/** Shortest signed angular distance from a to b, in degrees. */
function angleDelta(a: number, b: number) {
  return ((((b - a) % 360) + 540) % 360) - 180;
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/**
 * "Empowering sales professionals worldwide" — A widescreen, seamlessly blended
 * world map & 3D globe visualization. Features a wide landscape footprint without
 * heavy borders or dark box containers, blending naturally into the section's
 * background gradient just like the original design.
 */
export default function CrossCountry() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const globeWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [viewMode, setViewMode] = useState<"map" | "globe">("map");
  const viewModeRef = useRef<"map" | "globe">("map");
  viewModeRef.current = viewMode;

  const progressRef = useRef(0);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const wrap = globeWrapRef.current;
      if (!canvas || !wrap) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const fontSans =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--font-sans")
          .trim() || "system-ui, sans-serif";

      let width = 0;
      let height = 0;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = wrap.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(wrap);

      const draw = (time: number) => {
        if (!width || !height) return;

        const cx = width / 2;
        const cy = height / 2;
        const mode = viewModeRef.current;

        // --- camera: interpolate along the journey ---------------------
        const t = progressRef.current * (JOURNEY.length - 1);
        const i = Math.min(Math.floor(t), JOURNEY.length - 2);
        const local = smoothstep(t - i);
        const from = JOURNEY[i];
        const to = JOURNEY[i + 1];

        const centerLon = from.lon + angleDelta(from.lon, to.lon) * local;
        const centerLat = from.lat + (to.lat - from.lat) * local;
        const zoom = from.zoom + (to.zoom - from.zoom) * local;

        ctx.clearRect(0, 0, width, height);

        const activeLabel = (() => {
          let best: { label: string; weight: number } | null = null;
          JOURNEY.forEach((wp, index) => {
            if (!wp.label) return;
            const distance = Math.abs(t - index);
            const weight =
              distance <= 0.3 ? 1 : Math.max(0, 1 - (distance - 0.3) / 0.45);
            if (weight > 0 && (!best || weight > best.weight)) {
              best = { label: wp.label, weight };
            }
          });
          return best as { label: string; weight: number } | null;
        })();

        const pulse = 0.5 + 0.5 * Math.sin(time * 0.0022);

        // ===================================================================
        // 1. SEAMLESSLY BLENDED WIDESCREEN WORLD MAP MODE
        // ===================================================================
        if (mode === "map") {
          const baseScale = Math.min(width / 360, height / 155) * 0.98;
          const flatZoom = 1 + (zoom - 1) * 1.35;
          const scale = baseScale * flatZoom;

          const projectFlat = (lon: number, lat: number) => {
            const dLon = angleDelta(centerLon, lon);
            const dLat = lat - centerLat;
            const x = cx + dLon * scale;
            const y = cy - dLat * scale;
            if (x < -20 || x > width + 20 || y < -20 || y > height + 20)
              return null;

            // Soft edge fading so the map seamlessly dissolves into the background gradient
            const edgeFadeX = Math.min(1, Math.min(x, width - x) / 65);
            const edgeFadeY = Math.min(1, Math.min(y, height - y) / 40);
            const edgeAlpha = Math.max(0, edgeFadeX * edgeFadeY);

            return { x, y, depth: 1, edgeAlpha };
          };

          // Faint, seamless latitude/longitude graticules that fade at the borders
          ctx.lineWidth = 1;
          for (let latLine = -60; latLine <= 60; latLine += 30) {
            const pt = projectFlat(centerLon, latLine);
            if (pt && pt.y >= 0 && pt.y <= height) {
              const fade = pt.edgeAlpha;
              if (fade > 0.05) {
                ctx.beginPath();
                ctx.moveTo(width * 0.05, pt.y);
                ctx.lineTo(width * 0.95, pt.y);
                ctx.strokeStyle =
                  latLine === 0
                    ? `rgba(56, 189, 248, ${0.2 * fade})`
                    : `rgba(255, 255, 255, ${0.04 * fade})`;
                ctx.stroke();
              }
            }
          }

          // Land dots with smooth boundary feathering into the page background
          const dotRadius = Math.max(0.85, 1.25 * Math.sqrt(flatZoom));
          for (const [lon, lat] of LAND_DOTS) {
            const pt = projectFlat(lon, lat);
            if (!pt || pt.edgeAlpha <= 0.02) continue;

            ctx.globalAlpha = (0.3 + 0.55 * pt.edgeAlpha);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
          }
          ctx.globalAlpha = 1;

          // Animated connecting flight routes from Dubai hub to client cities
          const dubai = LOCATIONS.find((l) => l.name === "Dubai");
          if (dubai) {
            const pDubai = projectFlat(dubai.lon, dubai.lat);
            if (pDubai && pDubai.edgeAlpha > 0.1) {
              LOCATIONS.forEach((loc, idx) => {
                if (loc.name === "Dubai") return;
                const pDest = projectFlat(loc.lon, loc.lat);
                if (!pDest || pDest.edgeAlpha <= 0.1) return;

                const routeAlpha =
                  Math.min(pDubai.edgeAlpha, pDest.edgeAlpha) * 0.45;

                const midX = (pDubai.x + pDest.x) / 2;
                const midY = (pDubai.y + pDest.y) / 2;
                const dist = Math.hypot(pDest.x - pDubai.x, pDest.y - pDubai.y);
                const arch = Math.min(36, dist * 0.3);
                const ctrlX = midX;
                const ctrlY = midY - arch;

                // Glowing flight arc
                ctx.beginPath();
                ctx.moveTo(pDubai.x, pDubai.y);
                ctx.quadraticCurveTo(ctrlX, ctrlY, pDest.x, pDest.y);
                ctx.strokeStyle = `rgba(56, 189, 248, ${routeAlpha})`;
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 5]);
                ctx.lineDashOffset = -time * 0.03;
                ctx.stroke();
                ctx.setLineDash([]);

                // Traveling light pulse
                const pktProgress = (time * 0.0007 + idx * 0.18) % 1;
                const dotX =
                  (1 - pktProgress) * (1 - pktProgress) * pDubai.x +
                  2 * (1 - pktProgress) * pktProgress * ctrlX +
                  pktProgress * pktProgress * pDest.x;
                const dotY =
                  (1 - pktProgress) * (1 - pktProgress) * pDubai.y +
                  2 * (1 - pktProgress) * pktProgress * ctrlY +
                  pktProgress * pktProgress * pDest.y;

                ctx.beginPath();
                ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
                ctx.fillStyle = HIGHLIGHT;
                ctx.globalAlpha = routeAlpha * 1.8;
                ctx.fill();
                ctx.globalAlpha = 1;
              });
            }
          }

          // Client markers & floating labels
          for (const location of LOCATIONS) {
            const point = projectFlat(location.lon, location.lat);
            if (!point || point.edgeAlpha <= 0.05) continue;

            const isFocused =
              activeLabel?.label === location.name && activeLabel.weight > 0.35;

            // Outer beacon halo
            ctx.globalAlpha =
              (isFocused ? 0.35 + 0.3 * pulse : 0.22) * point.edgeAlpha;
            ctx.beginPath();
            ctx.arc(
              point.x,
              point.y,
              (isFocused ? 12 + 5 * pulse : 6) * Math.min(flatZoom, 1.8),
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = isFocused ? HIGHLIGHT : "#38bdf8";
            ctx.fill();

            // Core dot
            ctx.globalAlpha = point.edgeAlpha;
            ctx.beginPath();
            ctx.arc(point.x, point.y, isFocused ? 4 : 2.8, 0, Math.PI * 2);
            ctx.fillStyle = isFocused ? HIGHLIGHT : "#ffffff";
            ctx.fill();

            if (isFocused) {
              ctx.strokeStyle = "rgba(16,16,16,0.6)";
              ctx.lineWidth = 0.8;
              ctx.stroke();

              const labelAlpha =
                Math.min(1, (activeLabel.weight - 0.35) / 0.65) *
                point.edgeAlpha;
              ctx.globalAlpha = labelAlpha;

              const leader = width < 520 ? 18 : 24;
              const labelY = point.y - leader;
              const isRightSide = point.x > cx;
              const textX = isRightSide
                ? point.x - leader - 14
                : point.x + leader + 14;

              ctx.beginPath();
              if (isRightSide) {
                ctx.moveTo(point.x - 5, point.y - 5);
                ctx.lineTo(point.x - leader, labelY);
                ctx.lineTo(point.x - leader - 8, labelY);
              } else {
                ctx.moveTo(point.x + 5, point.y - 5);
                ctx.lineTo(point.x + leader, labelY);
                ctx.lineTo(point.x + leader + 8, labelY);
              }
              ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
              ctx.lineWidth = 1;
              ctx.stroke();

              ctx.font = `600 13px ${fontSans}`;
              const nameWidth = ctx.measureText(location.name).width;
              ctx.font = `400 11px ${fontSans}`;
              const countryWidth = ctx.measureText(location.country).width;
              const plateWidth = Math.max(nameWidth, countryWidth) + 14;

              const plateX = isRightSide ? textX - plateWidth + 7 : textX - 7;
              const contentX = isRightSide ? textX - plateWidth + 14 : textX;

              ctx.fillStyle = "rgba(255,255,255,0.96)";
              ctx.beginPath();
              ctx.roundRect(plateX, labelY - 17, plateWidth, 34, 4);
              ctx.fill();

              ctx.textAlign = "left";
              ctx.font = `600 13px ${fontSans}`;
              ctx.textBaseline = "bottom";
              ctx.fillStyle = "#101010";
              ctx.fillText(location.name, contentX, labelY - 1);

              ctx.font = `400 11px ${fontSans}`;
              ctx.textBaseline = "top";
              ctx.fillStyle = "rgba(16,16,16,0.65)";
              ctx.fillText(location.country, contentX, labelY + 3);
            }
          }
          ctx.globalAlpha = 1;

          // Region caption for non-city waypoints (e.g. THE GULF)
          if (
            activeLabel &&
            !LOCATIONS.some((l) => l.name === activeLabel.label)
          ) {
            ctx.globalAlpha = activeLabel.weight;
            ctx.font = `500 11px ${fontSans}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.letterSpacing = "0.18em";
            ctx.fillText(activeLabel.label.toUpperCase(), cx, height - 14);
            ctx.letterSpacing = "0px";
            ctx.globalAlpha = 1;
          }
        }

        // ===================================================================
        // 2. SEAMLESSLY BLENDED 3D GLOBE MODE
        // ===================================================================
        else {
          const baseRadius = Math.min(width * 0.42, height * 0.44);
          const radius = baseRadius * zoom;

          const l0 = centerLon * DEG;
          const p0 = centerLat * DEG;
          const sinP0 = Math.sin(p0);
          const cosP0 = Math.cos(p0);

          const projectGlobe = (lon: number, lat: number) => {
            const l = lon * DEG - l0;
            const p = lat * DEG;
            const cosP = Math.cos(p);
            const cosC = sinP0 * Math.sin(p) + cosP0 * cosP * Math.cos(l);
            if (cosC <= 0.02) return null;
            return {
              x: cx + radius * cosP * Math.sin(l),
              y:
                cy -
                radius * (cosP0 * Math.sin(p) - sinP0 * cosP * Math.cos(l)),
              depth: cosC,
            };
          };

          // Globe circular porthole clipping
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
          ctx.clip();

          // Sphere body
          const sphere = ctx.createRadialGradient(
            cx - baseRadius * 0.35,
            cy - baseRadius * 0.4,
            baseRadius * 0.1,
            cx,
            cy,
            baseRadius,
          );
          sphere.addColorStop(0, "rgba(255, 255, 255, 0.2)");
          sphere.addColorStop(0.65, "rgba(255, 255, 255, 0.08)");
          sphere.addColorStop(1, "rgba(255, 255, 255, 0.02)");
          ctx.beginPath();
          ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
          ctx.fillStyle = sphere;
          ctx.fill();

          // Land dots on sphere
          const dotRadius = Math.max(0.75, baseRadius * 0.008 * Math.sqrt(zoom));
          for (const [lon, lat] of LAND_DOTS) {
            const point = projectGlobe(lon, lat);
            if (!point) continue;
            ctx.globalAlpha = 0.25 + 0.75 * point.depth;
            ctx.beginPath();
            ctx.arc(point.x, point.y, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
          }
          ctx.globalAlpha = 1;

          // Client markers on sphere
          for (const location of LOCATIONS) {
            const point = projectGlobe(location.lon, location.lat);
            if (!point) continue;

            const isFocused =
              activeLabel?.label === location.name && activeLabel.weight > 0.35;
            const alpha = Math.min(1, point.depth * 1.6);

            // Halo
            ctx.globalAlpha = alpha * (isFocused ? 0.28 + 0.22 * pulse : 0.2);
            ctx.beginPath();
            ctx.arc(
              point.x,
              point.y,
              (isFocused ? 11 + 5 * pulse : 6) * Math.min(zoom, 1.6),
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = isFocused ? HIGHLIGHT : "rgba(255, 255, 255, 0.6)";
            ctx.fill();

            // Core
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(point.x, point.y, isFocused ? 4 : 2.6, 0, Math.PI * 2);
            ctx.fillStyle = isFocused ? HIGHLIGHT : "#ffffff";
            ctx.fill();

            if (isFocused) {
              ctx.strokeStyle = "rgba(16,16,16,0.55)";
              ctx.lineWidth = 0.8;
              ctx.stroke();

              const labelAlpha = (activeLabel.weight - 0.35) / 0.65;
              ctx.globalAlpha = Math.min(1, labelAlpha) * alpha;

              const leader = width < 480 ? 20 : 26;
              const labelY = point.y - leader;
              const isRightSide = point.x > cx;
              const textX = isRightSide
                ? point.x - leader - 16
                : point.x + leader + 16;

              ctx.beginPath();
              if (isRightSide) {
                ctx.moveTo(point.x - 6, point.y - 6);
                ctx.lineTo(point.x - leader, labelY);
                ctx.lineTo(point.x - leader - 10, labelY);
              } else {
                ctx.moveTo(point.x + 6, point.y - 6);
                ctx.lineTo(point.x + leader, labelY);
                ctx.lineTo(point.x + leader + 10, labelY);
              }
              ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
              ctx.lineWidth = 1;
              ctx.stroke();

              ctx.font = `600 13px ${fontSans}`;
              const nameWidth = ctx.measureText(location.name).width;
              ctx.font = `400 11px ${fontSans}`;
              const countryWidth = ctx.measureText(location.country).width;
              const plateWidth = Math.max(nameWidth, countryWidth) + 14;

              const plateX = isRightSide ? textX - plateWidth + 7 : textX - 7;
              const contentX = isRightSide ? textX - plateWidth + 14 : textX;

              ctx.fillStyle = "rgba(255,255,255,0.96)";
              ctx.beginPath();
              ctx.roundRect(plateX, labelY - 17, plateWidth, 34, 4);
              ctx.fill();

              ctx.textAlign = "left";
              ctx.font = `600 13px ${fontSans}`;
              ctx.textBaseline = "bottom";
              ctx.fillStyle = "#101010";
              ctx.fillText(location.name, contentX, labelY - 1);

              ctx.font = `400 11px ${fontSans}`;
              ctx.textBaseline = "top";
              ctx.fillStyle = "rgba(16,16,16,0.6)";
              ctx.fillText(location.country, contentX, labelY + 3);
            }
          }
          ctx.globalAlpha = 1;

          ctx.restore();

          // Sphere outline
          ctx.beginPath();
          ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Region caption
          if (
            activeLabel &&
            !LOCATIONS.some((l) => l.name === activeLabel.label)
          ) {
            ctx.globalAlpha = activeLabel.weight;
            ctx.font = `500 11px ${fontSans}`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.letterSpacing = "0.18em";
            ctx.fillText(activeLabel.label.toUpperCase(), cx, height - 12);
            ctx.letterSpacing = "0px";
            ctx.globalAlpha = 1;
          }
        }
      };

      let running = false;
      const tick = (time: number) => draw(time);
      const startLoop = () => {
        if (running) return;
        running = true;
        gsap.ticker.add(tick);
      };
      const stopLoop = () => {
        if (!running) return;
        running = false;
        gsap.ticker.remove(tick);
      };

      const visibility = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? startLoop() : stopLoop()),
        { rootMargin: "200px" },
      );
      visibility.observe(sectionRef.current!);

      const mm = gsap.matchMedia();

      if (prefersReducedMotion) {
        gsap.set(
          [headingRef.current, paragraphRef.current, globeWrapRef.current],
          {
            opacity: 1,
            scale: 1,
            y: 0,
          },
        );
        progressRef.current = 1;
        draw(0);
      } else {
        gsap.set(headingRef.current, {
          opacity: 0,
          scale: 0.65,
          y: 20,
          transformOrigin: "center center",
        });
        gsap.set(globeWrapRef.current, {
          opacity: 0,
          scale: 0.85,
          transformOrigin: "center center",
        });
        gsap.set(paragraphRef.current, {
          opacity: 0,
          scale: 0.9,
          y: 15,
          transformOrigin: "center center",
        });

        const intro = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
        intro
          .to(headingRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            keyframes: [
              { scale: 1.16, opacity: 1, y: -4, duration: 0.42, ease: "power2.out" },
              { scale: 0.94, y: 2, duration: 0.22, ease: "sine.inOut" },
              { scale: 1.0, y: 0, duration: 0.21, ease: "power2.out" },
            ],
          })
          .to(
            globeWrapRef.current,
            {
              opacity: 1,
              scale: 1,
              duration: 0.9,
              ease: "power2.out",
            },
            "-=0.4",
          )
          .to(
            paragraphRef.current,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.5",
          );

        // Desktop pins and flies the camera along JOURNEY
        mm.add("(min-width: 1024px)", () => {
          const trigger = ScrollTrigger.create({
            id: "cross-country-pin",
            trigger: sectionRef.current,
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => {
              progressRef.current = self.progress;
            },
          });
          const spacer = (trigger as unknown as { spacer?: HTMLElement }).spacer;
          if (spacer) {
            spacer.style.backgroundColor = "#ffffff";
          }
          return () => trigger.kill();
        });

        mm.add("(max-width: 1023px)", () => {
          const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 85%",
            end: "bottom 15%",
            scrub: 0.6,
            onUpdate: (self) => {
              progressRef.current = self.progress;
            },
          });
          return () => trigger.kill();
        });
      }

      return () => {
        stopLoop();
        visibility.disconnect();
        resizeObserver.disconnect();
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="programs"
      data-nav-section="Cross Country"
      data-nav-theme="light"
      className="relative -mt-0.5 z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-[clamp(24px,4vh,60px)] text-[#101010] sm:px-8 lg:px-16"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #9fc3fa 20%, #205ee0 48%, #0d286e 75%, #050608 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.24) 0.95px, transparent 0.95px)",
          backgroundSize: "10px 10px",
        }}
      />

      <div className="relative z-10 flex w-full max-w-[1920px] flex-col items-center">
        <h2
          ref={headingRef}
          className="max-w-3xl text-center font-serif text-[clamp(1.5rem,1.6vw+1.2vh,2.5rem)] font-normal leading-[1.2] text-[#101010]"
        >
          <span className="block">Empowering sales</span>
          <span className="block">
            professionals{" "}
            <span className="italic text-[#2563eb]">worldwide</span>
          </span>
        </h2>

        {/* Seamlessly blended widescreen canvas container */}
        <div
          ref={globeWrapRef}
          className="relative mt-[clamp(10px,2vh,24px)] flex w-[min(1120px,94vw)] h-[clamp(300px,46vh,420px)] flex-col items-center justify-center"
        >
          {/* Ambient luminous atmospheric glow directly behind the map/globe */}
          <div className="pointer-events-none absolute inset-x-8 -inset-y-6 rounded-full bg-[radial-gradient(ellipse_at_50%_50%,rgba(56,189,248,0.28)_0%,rgba(29,99,237,0.14)_50%,transparent_75%)] blur-3xl -z-10" />

          {/* Floating mode switch pill */}
          <div className="absolute top-0 right-2 z-20 flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-0.5 backdrop-blur-md shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("map")}
              aria-label="Switch to World Map view"
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                viewMode === "map"
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
              </svg>
              <span>World Map</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("globe")}
              aria-label="Switch to 3D Globe view"
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                viewMode === "globe"
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20" />
              </svg>
              <span>3D Globe</span>
            </button>
          </div>

          <canvas ref={canvasRef} className="h-full w-full" />
        </div>

        <p
          ref={paragraphRef}
          className="mx-auto mt-[clamp(10px,2vh,24px)] max-w-150 text-center font-sans text-[13px] leading-relaxed text-white/85 sm:text-[14px]"
        >
          From high-growth markets to global enterprises, we help individuals
          and organisations build sales capabilities that drive real business
          impact.
        </p>
      </div>
    </section>
  );
}
