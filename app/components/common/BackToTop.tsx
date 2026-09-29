"use client";

type BackToTopProps = {
  /** "dark" for footers on dark backgrounds, "light" for light ones. */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Round "back to top" arrow used in every footer. Scrolls through Lenis when
 * it's running so the trip up matches the rest of the site's smooth scroll.
 */
export default function BackToTop({ tone = "dark", className = "" }: BackToTopProps) {
  const scrollUp = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.__lenis && !reduce) {
      window.__lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  };

  const toneClass =
    tone === "dark"
      ? "border-white/20 bg-white/5 text-white hover:border-[#e7ff3d] hover:bg-[#e7ff3d] hover:text-black focus-visible:outline-white"
      : "border-black/15 bg-black/5 text-black hover:border-black hover:bg-black hover:text-white focus-visible:outline-black";

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="Back to top"
      title="Back to top"
      className={`group inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 ${toneClass} ${className}`}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
