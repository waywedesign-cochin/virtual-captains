/**
 * Partner Network connector system.
 *
 * Four strokes, each with its own job and its own gradient, matching the
 * reference: a near-white feed dropping out of the Curriculum timeline into the
 * hub; the container's top run and left wall at a steady electric blue; the
 * floor, which carries a white-hot bloom around x≈650 before fading out to the
 * right; and the release hairline running out of the white node.
 *
 * That bloom is not decoration — it is where the reference implies the network
 * is being energised, and Phase 5 animates it travelling as the logos emerge.
 */
export function PartnerLines() {
  return (
    <svg
      className="partner__lines"
      viewBox="0 0 1512 919"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="partnerFeedGradient"
          x1="665"
          y1="0"
          x2="665"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#d8f0ff" stopOpacity="0.94" />
          <stop offset="100%" stopColor="#d8f0ff" stopOpacity="0.94" />
        </linearGradient>

        <linearGradient
          id="partnerContainerGradient"
          x1="665"
          y1="240"
          x2="110"
          y2="520"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#eaf6ff" stopOpacity="0.8" />
          <stop offset="14%" stopColor="#5cc0f5" stopOpacity="0.5" />
          <stop offset="42%" stopColor="#1a9beb" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#1a9beb" stopOpacity="0.36" />
        </linearGradient>

        <linearGradient
          id="partnerFloorGradient"
          x1="110"
          y1="783"
          x2="1080"
          y2="783"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1a9beb" stopOpacity="0.5" />
          <stop offset="32%" stopColor="#2ba6f0" stopOpacity="0.56" />
          <stop offset="53%" stopColor="#f2f9ff" stopOpacity="0.97" />
          <stop offset="61%" stopColor="#7ecbff" stopOpacity="0.86" />
          <stop offset="71%" stopColor="#1aa4f2" stopOpacity="0.68" />
          <stop offset="87%" stopColor="#1a9beb" stopOpacity="0.42" />
          <stop offset="97%" stopColor="#1a9beb" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1a9beb" stopOpacity="0" />
        </linearGradient>

        <linearGradient
          id="partnerReleaseGradient"
          x1="770"
          y1="326"
          x2="1080"
          y2="326"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1a9beb" stopOpacity="0.4" />
          <stop offset="72%" stopColor="#1a9beb" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#1a9beb" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Desktop composition. */}
      <g className="partner__lines-group partner__lines-group--wide">
        <path className="line--feed" data-partner-line="feed" d="M665.5 0 V 100" />

        {/* Out of the hub, left along the top, then down the left wall. */}
        <path
          className="line--container"
          data-partner-line="container"
          d="M665.5 222 V 290 Q 665.5 322.5 633 322.5 H 160 Q 112.5 322.5 112.5 370 V 727"
        />

        {/* The floor, carrying the bloom. */}
        <path
          className="line--floor"
          data-partner-line="floor"
          d="M112.5 727 Q 112.5 782.5 167 782.5 H 1080"
        />

        <path
          className="line--release"
          data-partner-line="release"
          d="M770 326.5 H 1080"
        />
      </g>

      {/* Compact composition. Straight runs and rounded corners only, so the
          stretched viewBox never reveals a distorted curve. */}
      <g className="partner__lines-group partner__lines-group--compact">
        <path className="line--feed" data-partner-line="feed" d="M756.5 0 V 150" />
        <path
          className="line--container"
          data-partner-line="container"
          d="M756.5 300 V 336 Q 756.5 372.5 720 372.5 H 230 Q 180.5 372.5 180.5 422 V 812"
        />
        <path
          className="line--floor"
          data-partner-line="floor"
          d="M180.5 812 Q 180.5 866.5 234 866.5 H 1332"
        />
      </g>
    </svg>
  );
}
