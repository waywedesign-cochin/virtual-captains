import Link from "next/link";
import { site } from "@/content/site";

interface BookACallButtonProps {
  /** Footer uses a translucent glass treatment instead of the gradient. */
  readonly variant?: "gradient" | "glass" | "yellow" | "white" | "black";
}

export function BookACallButton({ variant = "gradient" }: BookACallButtonProps) {
  let className = "btn-book";
  if (variant === "glass") {
    className = "btn-book btn-book--glass";
  } else if (variant === "yellow") {
    // Premium yellow button matching navbar but larger, with black border
    className = "inline-flex items-center justify-center rounded-full bg-[#e7ff3d] hover:bg-[#d8f030] border border-black px-8 py-4 text-base md:text-lg font-bold text-black tracking-[0.02em] shadow-[0_0_16px_rgba(231,255,61,0.4)] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shrink-0";
  } else if (variant === "white") {
    // White background, black text, and crisp border for high definition on white sections
    className = "inline-flex items-center justify-center rounded-full bg-white hover:bg-slate-50 border border-black/20 hover:border-black/40 px-8 py-4 text-base md:text-lg font-bold text-black tracking-[0.02em] shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.15)] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shrink-0";
  } else if (variant === "black") {
    className = "inline-flex items-center justify-center rounded-full bg-[#111217] hover:bg-[#181920] border border-white/14 hover:border-white/28 px-8 py-4 text-base md:text-lg font-bold text-white tracking-[0.02em] shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shrink-0";
  }

  return (
    <Link
      href={site.bookACall.href}
      className={className}
    >
      <span className="inline-flex items-center gap-2">
        <span>{site.bookACall.label}</span>
        <span className="inline-block text-[0.8em]" aria-hidden="true">&rarr;</span>
      </span>
    </Link>
  );
}
