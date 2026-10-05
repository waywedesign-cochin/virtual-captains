"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LAND_DOTS } from "./globeDots";
import DottedBackground from "./DottedBackground";
import { NO_PIN_QUERY, PIN_QUERY } from "./pinQuery";

import { HEADING_REVEAL, HEADING_REVEAL_FROM } from "@/lib/animations/headingReveal";
gsap.registerPlugin(ScrollTrigger);

type Location = {
  name: string;
  country: string;
  lon: number;
  lat: number;
};

const LOCATIONS: Location[] = [
  { name: "Dubai", country: "UAE", lon: 55.27, lat: 25.2 },
  { name: "Muscat", country: "Oman", lon: 58.41, lat: 23.59 },
  { name: "Riyadh", country: "Saudi Arabia", lon: 46.72, lat: 24.71 },
  { name: "Kochi", country: "India", lon: 76.27, lat: 9.93 },
  { name: "Kuala Lumpur", country: "Malaysia", lon: 101.69, lat: 3.14 },
  { name: "London", country: "UK", lon: -0.13, lat: 51.51 },
  { name: "Toronto", country: "Canada", lon: -79.38, lat: 43.65 },
  { name: "New York", country: "US", lon: -74.01, lat: 40.71 },
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
  { lon: 58.41, lat: 23.59, zoom: 2.2, label: "Muscat" },
  { lon: 46.72, lat: 24.71, zoom: 2.2, label: "Riyadh" },
  { lon: 76.27, lat: 9.93, zoom: 2.2, label: "Kochi" },
  { lon: 101.69, lat: 3.14, zoom: 2.2, label: "Kuala Lumpur" },
  { lon: -0.13, lat: 51.51, zoom: 2.2, label: "London" },
  { lon: -79.38, lat: 43.65, zoom: 2.2, label: "Toronto" },
  { lon: -74.01, lat: 40.71, zoom: 2.2, label: "New York" },
  { lon: 14, lat: 22, zoom: 1, label: "Worldwide" },
];

/** Journey waypoints that land on a client city — the phone tour's chips. */
const CITY_STOPS = JOURNEY.flatMap((wp, i) => {
  const loc = LOCATIONS.find((l) => l.name === wp.label);
  return loc ? [{ label: loc.name, country: loc.country, i }] : [];
});

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
 * Leader line + white name plate for the focused city. Prefers to point
 * toward the canvas centre, flips sides when the plate would not fit, and as
 * a last resort clamps the plate inside the canvas — on a ~300px-wide phone
 * canvas the plate is nearly half the width, so it would otherwise be cut off.
 */
function drawCityLabel(
  ctx: CanvasRenderingContext2D,
  point: { x: number; y: number },
  location: Location,
  width: number,
  fontSans: string,
  lineAlpha: number,
) {
  const leader = width < 520 ? 18 : 24;
  const gap = 14;

  // One line: the country name
  ctx.font = `600 13px ${fontSans}`;
  const plateWidth = ctx.measureText(location.country).width + 16;

  const fitsLeft = point.x - leader - gap - plateWidth + 7 >= 4;
  const fitsRight = point.x + leader + gap + plateWidth - 7 <= width - 4;
  const towardCenter = point.x > width / 2 ? "left" : "right";
  const side =
    towardCenter === "left"
      ? fitsLeft || !fitsRight
        ? "left"
        : "right"
      : fitsRight || !fitsLeft
        ? "right"
        : "left";

  const labelY = Math.max(21, point.y - leader);
  const dir = side === "left" ? -1 : 1;

  ctx.beginPath();
  ctx.moveTo(point.x + dir * 5, point.y - 5);
  ctx.lineTo(point.x + dir * leader, labelY);
  ctx.lineTo(point.x + dir * (leader + 8), labelY);
  ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();

  const textX = point.x + dir * (leader + gap);
  const rawPlateX = side === "left" ? textX - plateWidth + 7 : textX - 7;
  const plateX = Math.min(Math.max(rawPlateX, 4), width - plateWidth - 4);
  const contentX = plateX + 7;

  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.beginPath();
  ctx.roundRect(plateX, labelY - 13, plateWidth, 26, 4);
  ctx.fill();

  ctx.textAlign = "left";
  ctx.font = `600 13px ${fontSans}`;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#101010";
  ctx.fillText(location.country, contentX + 1, labelY + 1);
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
  const canvasBoxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [viewMode, setViewMode] = useState<"map" | "globe">("map");
  const viewModeRef = useRef<"map" | "globe">("map");
  viewModeRef.current = viewMode;

  const progressRef = useRef(0);

  // Phones/tablets: the camera tours the cities on its own (no pin), and the
  // city chips under the map show / jump to the current stop.
  const [stop, setStop] = useState<number | null>(null);
  const tourRef = useRef<gsap.core.Timeline | null>(null);
  const tourProxy = useRef({ p: 0 });
  const tourVisible = useRef(false);

  const goToStop = (i: number) => {
    const last = JOURNEY.length - 1;
    setStop(i);
    const tl = tourRef.current;
    if (!tl) {
      // Reduced motion: jump straight there
      progressRef.current = i / last;
      return;
    }
    tl.pause();
    gsap.to(tourProxy.current, {
      p: i / last,
      duration: 0.9,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: () => {
        progressRef.current = tourProxy.current.p;
      },
      onComplete: () => {
        tl.seek(`at${i}`);
        if (tourVisible.current) tl.play();
      },
    });
  };

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const box = canvasBoxRef.current;
      if (!canvas || !box) return;

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

      // Layout size (clientWidth), not getBoundingClientRect: the stage is
      // mid scale-in when this first runs, and a transformed rect would size
      // the backing store too small and leave the map blurry.
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = box.clientWidth;
        height = box.clientHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(box);

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
        // Marker halos are sized for a ~1100px canvas; shrink them on phones
        // so a focused city doesn't swallow its neighbours.
        const markerScale = Math.max(0.6, Math.min(1, width / 720));

        // ===================================================================
        // 1. SEAMLESSLY BLENDED WIDESCREEN WORLD MAP MODE
        // ===================================================================
        if (mode === "map") {
          const baseScale = Math.min(width / 360, height / 155) * 0.98;
          const flatZoom = 1 + (zoom - 1) * 1.35;
          const scale = baseScale * flatZoom;
          // Fixed 65px/40px feathering ate ~45% of a phone-width map
          const fadeX = Math.min(65, width * 0.1);
          const fadeY = Math.min(40, height * 0.12);

          const projectFlat = (lon: number, lat: number) => {
            const dLon = angleDelta(centerLon, lon);
            const dLat = lat - centerLat;
            const x = cx + dLon * scale;
            const y = cy - dLat * scale;
            if (x < -20 || x > width + 20 || y < -20 || y > height + 20)
              return null;

            // Soft edge fading so the map seamlessly dissolves into the background gradient
            const edgeFadeX = Math.min(1, Math.min(x, width - x) / fadeX);
            const edgeFadeY = Math.min(1, Math.min(y, height - y) / fadeY);
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
              (isFocused ? 12 + 5 * pulse : 6) *
                Math.min(flatZoom, 1.8) *
                markerScale,
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

              ctx.globalAlpha =
                Math.min(1, (activeLabel.weight - 0.35) / 0.65) *
                point.edgeAlpha;
              drawCityLabel(ctx, point, location, width, fontSans, 0.75);
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
            // Every city stays visible against the white land dots: lime beacon,
            // gently pulsing; the focused one is larger.
            ctx.globalAlpha = alpha * (isFocused ? 0.28 + 0.22 * pulse : 0.22 + 0.14 * pulse);
            ctx.beginPath();
            ctx.arc(
              point.x,
              point.y,
              (isFocused ? 11 + 5 * pulse : 8 + 2 * pulse) *
                Math.min(zoom, 1.6) *
                markerScale,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = HIGHLIGHT;
            ctx.fill();

            // Core
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(point.x, point.y, isFocused ? 4 : 3.2, 0, Math.PI * 2);
            ctx.fillStyle = HIGHLIGHT;
            ctx.fill();

            if (isFocused) {
              ctx.strokeStyle = "rgba(16,16,16,0.55)";
              ctx.lineWidth = 0.8;
              ctx.stroke();

              const labelAlpha = (activeLabel.weight - 0.35) / 0.65;
              ctx.globalAlpha = Math.min(1, labelAlpha) * alpha;
              drawCityLabel(ctx, point, location, width, fontSans, 0.6);
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
          ...HEADING_REVEAL_FROM,
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
            ...HEADING_REVEAL,
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

        // Desktop: Pinned camera journey — no curtain exit
        mm.add(PIN_QUERY, () => {
          const pinTl = gsap.timeline({
            scrollTrigger: {
              id: "cross-country-pin",
              trigger: sectionRef.current,
              start: "top top",
              end: () => "+=" + ((typeof window !== "undefined" ? window.innerHeight : 900) * 4.0),
              pin: true,
              anticipatePin: 1,
              scrub: 0.6,
              onUpdate: (self) => {
                progressRef.current = self.progress;
              },
            },
          });

          // Give room for the camera journey
          pinTl.to({}, { duration: 3.2 });

          return () => pinTl.kill();
        });

        mm.add(NO_PIN_QUERY, () => {
          gsap.set(sectionRef.current, { clearProps: "transform" });

          // Scroll-scrubbing squeezed the whole tour into one swipe on a
          // phone, so here it plays by itself: fly to each stop, hold on
          // cities long enough to read the label, rest on the wide view,
          // loop. Plays only while the section is on screen.
          const last = JOURNEY.length - 1;
          const proxy = tourProxy.current;
          const sync = () => {
            progressRef.current = proxy.p;
          };
          proxy.p = 0;
          sync();

          const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true });
          tl.call(() => setStop(null));
          JOURNEY.forEach((_, i) => {
            if (i === 0) return;
            const isCity = CITY_STOPS.some((c) => c.i === i);
            // Chip lights as the flight starts, in step with the city label
            tl.call(() => setStop(isCity ? i : null));
            tl.to(proxy, { p: i / last, duration: isCity ? 1.1 : 1.3, ease: "power2.inOut", onUpdate: sync });
            tl.addLabel(`at${i}`);
            tl.to({}, { duration: isCity ? 1.8 : i === last ? 2.6 : 0.5 });
          });
          tl.call(() => {
            proxy.p = 0;
            sync();
          });
          tourRef.current = tl;

          const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 25%",
            // Measure after the pinned sections above add their spacers
            refreshPriority: -1,
            onToggle: (self) => {
              tourVisible.current = self.isActive;
              if (self.isActive) tl.play();
              else tl.pause();
            },
          });
          return () => {
            trigger.kill();
            tl.kill();
            tourRef.current = null;
            tourVisible.current = false;
            setStop(null);
          };
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
      data-nav-theme="dark"
      className="relative z-10 flex min-h-0 pin:min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-10 sm:py-14 pin:py-[clamp(24px,4vh,60px)] text-white sm:px-8 pin:px-16"
      style={{
        background:
          "linear-gradient(180deg, #040507 0%, #050b24 25%, #051d5c 60%, #0c318f 100%)",
      }}
    >
      {/* Subtle Dotted Background Grid (matching second section) */}
      <DottedBackground theme="dark" />

      <div className="relative z-10 flex w-full max-w-[1920px] flex-col items-center">
        <h2
          ref={headingRef}
          className="max-w-3xl text-center font-sans text-[clamp(1.5rem,1.6vw+1.2vh,2.5rem)] font-normal leading-[1.2] text-white"
        >
          <span className="block">Empowering Sales</span>
          <span className="block">
            Professionals{" "}
            <span className="italic text-[#2563eb]">Worldwide</span>
          </span>
        </h2>

        {/* Seamlessly blended widescreen canvas stage */}
        <div
          ref={globeWrapRef}
          className="relative mt-[clamp(12px,2vh,24px)] flex w-full max-w-[1120px] flex-col items-center"
        >
          {/* Mode switch — sits in the flow above the map on phones/tablets
              (it covered the map there), floats top-right on desktop where
              the widescreen map leaves room for it */}
          <div
            role="group"
            aria-label="Map style"
            className="relative z-20 flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 shadow-sm backdrop-blur-md pin:absolute pin:right-2 pin:top-0 pin:p-0.5"
          >
            <button
              type="button"
              onClick={() => setViewMode("map")}
              aria-pressed={viewMode === "map"}
              className={`flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[12px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 pin:min-h-6 pin:px-2.5 pin:text-[11px] ${
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
              aria-pressed={viewMode === "globe"}
              className={`flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[12px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 pin:min-h-6 pin:px-2.5 pin:text-[11px] ${
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

          {/* Height tracks width on phones but is also capped by viewport
              height, so a landscape phone still fits heading + map + copy */}
          <div
            ref={canvasBoxRef}
            className="relative mt-4 h-[clamp(260px,min(88vw,56svh),440px)] w-full pin:mt-0 pin:h-[clamp(260px,38vh,420px)]"
          >
            {/* Ambient luminous atmospheric glow directly behind the map/globe */}
            <div className="pointer-events-none absolute inset-x-8 -inset-y-6 rounded-full bg-[radial-gradient(ellipse_at_50%_50%,rgba(56,189,248,0.28)_0%,rgba(29,99,237,0.14)_50%,transparent_75%)] blur-3xl -z-10" />

            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`${viewMode === "map" ? "World map" : "Globe"} highlighting our client cities: ${LOCATIONS.map((l) => l.name).join(", ")}`}
              className="absolute inset-0 h-full w-full"
            />
          </div>

          {/* Phones/tablets: city chips — follow the auto tour, tap to jump */}
          <div
            role="group"
            aria-label="Client cities"
            className="mt-4 flex flex-wrap justify-center gap-2 pin:hidden"
          >
            {CITY_STOPS.map((c) => {
              const on = stop === c.i;
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => goToStop(c.i)}
                  aria-pressed={on}
                  className={`min-h-9 cursor-pointer rounded-full border px-3.5 text-[12.5px] font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    on
                      ? "border-[#e7ff3d] bg-[#e7ff3d] text-[#0a0b0d] shadow-[0_0_16px_rgba(231,255,61,0.35)]"
                      : "border-white/20 bg-white/5 text-white/75"
                  }`}
                >
                  {c.country}
                </button>
              );
            })}
          </div>
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

