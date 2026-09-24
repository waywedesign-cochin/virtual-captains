"use client";

import { useId } from "react";

interface DottedBackgroundProps {
  theme?: "light" | "dark";
  opacity?: number;
  className?: string;
  dotColor?: string;
  size?: number;
  cx?: number;
  cy?: number;
  r?: number;
}

/**
 * Standardized Dotted Background Grid component.
 * Reproduces the exact subtle, low-opacity (0.08) dot pattern from the second section (The Promise)
 * consistently across the entire homepage.
 */
export default function DottedBackground({
  theme = "light",
  opacity = 0.16,
  className = "",
  dotColor,
  size = 26,
  cx = 1.2,
  cy = 1.2,
  r = 1.2,
}: DottedBackgroundProps) {
  const rawId = useId();
  const cleanId = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const patternId = `dotPattern-${cleanId}`;
  const fill = dotColor || (theme === "dark" ? "#ffffff" : "#000000");

  return (
    <div className={`pointer-events-none absolute inset-0 z-0 ${className}`}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
