import type { ReactNode } from "react";

/**
 * Glowing blue gradient rim with soft side glows — shared by the job
 * overview card and the application form. Brightens while anything inside
 * has focus. The child should be rounded `rounded-[26.5px]` to sit inside
 * the 1.5px rim.
 */
export function BlueFrame({
  children,
  className = "",
  glow = true,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className={`group/frame relative ${className}`}>
      {glow && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-6 top-1/4 h-1/2 w-28 rounded-full bg-[#1d4ed8]/35 opacity-70 blur-[70px] transition-opacity duration-500 group-focus-within/frame:opacity-100"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 bottom-1/5 h-1/2 w-28 rounded-full bg-[#38bdf8]/25 opacity-70 blur-[70px] transition-opacity duration-500 group-focus-within/frame:opacity-100"
          />
        </>
      )}
      <div className="relative rounded-[28px] bg-linear-to-br from-[#1d4ed8]/80 via-[#38bdf8]/20 to-[#38bdf8]/60 p-[1.5px] shadow-[0_30px_80px_-30px_rgba(29,78,216,0.6)] transition-shadow duration-500 group-focus-within/frame:shadow-[0_0_60px_-10px_rgba(56,189,248,0.45)]">
        {children}
      </div>
    </div>
  );
}
