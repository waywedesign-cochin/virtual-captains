import Link from "next/link";
import { footerColumns, footerMeta } from "@/content/site";
import { BookACallButton } from "../ui/BookACallButton";
import { Logo } from "../ui/Logo";
import { FooterStage } from "./FooterStage";

interface FooterProps {
  scrollingWord?: string;
}

export function Footer({ scrollingWord = "INDIVIDUALS" }: FooterProps) {
  // If the word is long (like ORGANISATIONS), we want a slightly smaller base font size
  const isLongWord = scrollingWord.length > 11;
  const wordFontSize = isLongWord 
    ? "clamp(2rem, 6vw, 6rem)" // Further reduced
    : "clamp(2.5rem, 8vw, 7.5rem)"; // Reduced from original

  return (
    <footer
      className="section relative pt-[clamp(10rem,17.39vw,16.4375rem)] pb-[clamp(3rem,8.4vw,7.9375rem)] bg-(image:--footer-atmosphere) text-(--white) max-[1023px]:pt-[clamp(8rem,30vw,16rem)]"
    >
      <FooterStage>
        <div className="absolute top-[max(-4.125rem,-4.365vw)] left-0 w-full overflow-hidden whitespace-nowrap pointer-events-none select-none" data-footer-word="">
          <div 
            className="inline-block"
            style={{ 
              fontSize: wordFontSize,
              animation: "footerMarquee 30s linear infinite",
            }}
          >
            {[...Array(4)].map((_, i) => (
              <span key={i} className="inline-flex items-center">
                <span className="font-bold leading-none tracking-[-0.012em] text-(--white) px-8">
                  {scrollingWord}
                </span>
                <span className="text-(--white) opacity-50 text-[0.5em]">
                  •
                </span>
              </span>
            ))}
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes footerMarquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}} />
        </div>

        <div className="frame w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 lg:gap-12 items-start"
            data-footer-grid=""
          >
            <div className="[--logo-mark:clamp(3.5rem,5.32vw,5.03125rem)] [--logo-word:clamp(1.5rem,2.35vw,2.21875rem)] mt-[clamp(1rem,2.05vw,1.9375rem)] max-[1023px]:col-span-full max-[1023px]:mt-0">
              <Logo />
            </div>

            {footerColumns.map((column) => (
              <nav
                className="flex flex-col gap-[clamp(0.6rem,1.17vw,1.104rem)] text-sm text-white/80"
                key={column.id}
                aria-label={column.id}
              >
                {column.links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.label}
                    className="w-fit transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}

            <div>
              <p className="text-sm font-medium text-white/90 tracking-tight">
                {footerMeta.product}
              </p>
              <div className="mt-4">
                <BookACallButton variant="white" />
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-between gap-4 flex-wrap mt-[clamp(3rem,6vw,5rem)] border-t border-white/10 pt-6 text-xs text-white/50"
            data-footer-bar=""
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Link
                href={footerMeta.privacy.href}
                className="underline underline-offset-[3px] transition-colors duration-200 hover:text-white"
              >
                {footerMeta.privacy.label}
              </Link>
              <span className="text-white/30 select-none">·</span>
              <Link
                href={footerMeta.terms.href}
                className="underline underline-offset-[3px] transition-colors duration-200 hover:text-white"
              >
                {footerMeta.terms.label}
              </Link>
              <span className="text-white/30 select-none">·</span>
              <Link
                href={footerMeta.refund.href}
                className="underline underline-offset-[3px] transition-colors duration-200 hover:text-white"
              >
                {footerMeta.refund.label}
              </Link>
              <span className="text-white/30 select-none">·</span>
              <Link
                href={footerMeta.disclaimer.href}
                className="underline underline-offset-[3px] transition-colors duration-200 hover:text-white"
              >
                {footerMeta.disclaimer.label}
              </Link>
            </div>
            <p>{footerMeta.copyright}</p>
            <a
              href={footerMeta.credit.href}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-[3px] transition-colors duration-200 hover:text-white"
            >
              {footerMeta.credit.label}
            </a>
          </div>
        </div>
      </FooterStage>
    </footer>
  );
}
