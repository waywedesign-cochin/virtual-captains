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

        <div className="frame w-full max-w-372 mx-auto">
          <div
            className="grid grid-cols-[39.95%_22.61%_24.96%_12.48%] items-start px-[6.35%_9.39%] max-[1023px]:grid-cols-2 max-[1023px]:gap-y-[clamp(2rem,6vw,3rem)] max-[1023px]:px-(--gutter) max-[600px]:grid-cols-1"
            data-footer-grid=""
          >
            <div className="[--logo-mark:clamp(3.5rem,5.32vw,5.03125rem)] [--logo-word:clamp(1.5rem,2.35vw,2.21875rem)] mt-[clamp(1rem,2.05vw,1.9375rem)] max-[1023px]:col-span-full max-[1023px]:mt-0">
              <Logo />
            </div>

            {footerColumns.map((column) => (
              <nav
                className="flex flex-col gap-[clamp(0.6rem,1.17vw,1.104rem)] text-(length:--fs-footer-link) text-[rgba(255,255,255,0.94)]"
                key={column.id}
                aria-label={column.id}
              >
                {column.links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.label}
                    className="w-fit transition-opacity duration-(--dur-fast) ease-(--ease-out-expo) hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}

            <div>
              <p className="mt-[max(-0.875rem,-0.93vw)] text-(length:--fs-footer-product) font-normal tracking-[-0.01em]">
                {footerMeta.product}
              </p>
              <div className="mt-[clamp(0.75rem,1.3vw,1.25rem)]">
                <BookACallButton variant="glass" />
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-between gap-[1rem_2rem] flex-wrap mt-[clamp(3rem,6.41vw,6.0625rem)] px-[18.45%_13.95%] text-(length:--fs-meta) text-(--footer-muted) max-[1023px]:justify-start max-[1023px]:px-(--gutter) max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-3"
            data-footer-bar=""
          >
            <Link
              href={footerMeta.privacy.href}
              className="underline underline-offset-[3px] transition-colors duration-(--dur-fast) ease-(--ease-out-expo) hover:text-[#3f68c8]"
            >
              {footerMeta.privacy.label}
            </Link>
            <p>{footerMeta.copyright}</p>
            <a
              href={footerMeta.credit.href}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-[3px] transition-colors duration-(--dur-fast) ease-(--ease-out-expo) hover:text-[#3f68c8]"
            >
              {footerMeta.credit.label}
            </a>
          </div>
        </div>
      </FooterStage>
    </footer>
  );
}
