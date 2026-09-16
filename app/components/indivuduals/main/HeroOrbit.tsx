import { orbitLabels } from "@/content/site";
import {
  arcPath,
  LABEL_OFFSET,
  ORBIT_VIEWBOX,
  PRIMARY_ARC,
  pointOffArc,
  pointOnArc,
  SECONDARY_ARC,
} from "@/lib/orbit";

/**
 * The orbit is a system, not decoration: three arcs share one geometric family,
 * and every node and label is derived from the primary arc's circle, so they
 * stay locked together however the frame scales.
 *
 * Phase 3 attaches the draw-on animation to `[data-orbit-arc]`,
 * `[data-orbit-node]` and `[data-orbit-label]`.
 */
export function HeroOrbit() {
  return (
    <svg
      className="hero__orbit"
      viewBox={`0 0 ${ORBIT_VIEWBOX.width} ${ORBIT_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* ── Arc base track gradients ─────────────────────────────────── */}
        {/* Full opacity in center, fade to transparent at both edges so
            the line appears to emerge from nothing at the sides and glow
            brightly in the middle — matching the Fringe.us aesthetic. */}
        <linearGradient id="orbitArcGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#cfe4ff" stopOpacity="0" />
          <stop offset="6%"   stopColor="#cfe4ff" stopOpacity="0.06" />
          <stop offset="20%"  stopColor="#cfe4ff" stopOpacity="0.35" />
          <stop offset="38%"  stopColor="#e0eeff" stopOpacity="0.7" />
          <stop offset="50%"  stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="62%"  stopColor="#e0eeff" stopOpacity="0.7" />
          <stop offset="80%"  stopColor="#cfe4ff" stopOpacity="0.35" />
          <stop offset="94%"  stopColor="#cfe4ff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#cfe4ff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="orbitArcGradientSoft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#bcd8ff" stopOpacity="0" />
          <stop offset="8%"   stopColor="#bcd8ff" stopOpacity="0.04" />
          <stop offset="24%"  stopColor="#bcd8ff" stopOpacity="0.22" />
          <stop offset="42%"  stopColor="#d4eaff" stopOpacity="0.5" />
          <stop offset="50%"  stopColor="#e8f2ff" stopOpacity="0.65" />
          <stop offset="58%"  stopColor="#d4eaff" stopOpacity="0.5" />
          <stop offset="76%"  stopColor="#bcd8ff" stopOpacity="0.22" />
          <stop offset="92%"  stopColor="#bcd8ff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#bcd8ff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="orbitArcGradientFaint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#a9caff" stopOpacity="0" />
          <stop offset="30%"  stopColor="#a9caff" stopOpacity="0.08" />
          <stop offset="50%"  stopColor="#a9caff" stopOpacity="0.2" />
          <stop offset="70%"  stopColor="#a9caff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#a9caff" stopOpacity="0" />
        </linearGradient>

        <radialGradient id="orbitNodeGlow">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#bcd8ff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#bcd8ff" stopOpacity="0" />
        </radialGradient>

        {/* ── Torch Beam Gradients ────────────────────────── */}
        {/* The comet paths are now fully drawn but masked by a travelling
            "torch" rectangle. These gradients define the color of the illuminated line. */}
        <linearGradient id="orbitCometTrail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="50%"  stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.75" />
        </linearGradient>

        <linearGradient id="orbitCometGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#60a5fa" stopOpacity="0.5" />
          <stop offset="50%"  stopColor="#bfdbfe" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.5" />
        </linearGradient>

        {/* The torch mask has soft blended edges (black -> white -> black).
            When this sweeps across the SVG, it smoothly reveals the path. */}
        <linearGradient id="torchMaskGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="black" />
          <stop offset="25%" stopColor="white" />
          <stop offset="75%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </linearGradient>

        <mask id="torchMaskPrimary">
          <rect x="-100%" y="-10%" width="300%" height="120%" fill="black" />
          <rect className="orbit__torch-spot" data-orbit-torch="primary" x="-400" y="0" width="400" height="1500" fill="url(#torchMaskGradient)" />
        </mask>
        <mask id="torchMaskSecondary">
          <rect x="-100%" y="-10%" width="300%" height="120%" fill="black" />
          <rect className="orbit__torch-spot" data-orbit-torch="secondary" x="-500" y="0" width="500" height="1500" fill="url(#torchMaskGradient)" />
        </mask>

        {/* Gaussian blur for ambient glow halo */}
        <filter id="orbitCometBloom" x="-50%" y="-400%" width="200%" height="900%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
        </filter>
      </defs>

      {/* One group for the whole system: the ambient drift is applied here so
          a label can never separate from its node. */}
      <g data-orbit-system="">
        <path
          className="orbit__arc orbit__arc--secondary"
          d={arcPath(SECONDARY_ARC)}
          data-orbit-arc="secondary"
        />
        <path
          className="orbit__arc orbit__arc--primary"
          d={arcPath(PRIMARY_ARC)}
          data-orbit-arc="primary"
        />

        {/* Travelling sparks — two layers per arc:
              1. `.orbit__comet-bloom` — wide, blurred ambient halo (drawn first)
              2. `.orbit__comet`        — sharp crisp laser core on top
            Both share the same `d` so they ride exactly the same curve. */}

        {/* — Secondary arc ---- */}
        <g mask="url(#torchMaskSecondary)">
          <path
            className="orbit__comet-bloom"
            d={arcPath(SECONDARY_ARC)}
            data-orbit-comet-bloom="secondary"
          />
          <path
            className="orbit__comet"
            d={arcPath(SECONDARY_ARC)}
            data-orbit-comet="secondary"
          />
        </g>

        {/* — Primary arc ------ */}
        <g mask="url(#torchMaskPrimary)">
          <path
            className="orbit__comet-bloom"
            d={arcPath(PRIMARY_ARC)}
            data-orbit-comet-bloom="primary"
          />
          <path
            className="orbit__comet"
            d={arcPath(PRIMARY_ARC)}
            data-orbit-comet="primary"
          />
        </g>

        {orbitLabels.map((item) => {
          const node = pointOnArc(PRIMARY_ARC, item.angle);
          const label = pointOffArc(PRIMARY_ARC, item.angle, LABEL_OFFSET);

          return (
            <g key={item.label} data-orbit-item={item.label}>
              <circle
                className="orbit__node-glow"
                cx={node.x}
                cy={node.y}
                r={13}
                data-orbit-node-glow=""
              />
              <circle
                className="orbit__node"
                cx={node.x}
                cy={node.y}
                r={4.2}
                data-orbit-node=""
              />
              {/* Plain SVG anchor rather than next/link: an <a> inside the SVG
                  namespace is the reliable form, and these are six top-level
                  nav destinations where prefetch buys little. */}
              <a href={item.href}>
                <text
                  className="orbit__label"
                  x={label.x}
                  y={label.y}
                  data-orbit-label=""
                >
                  {item.label}
                </text>
              </a>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
