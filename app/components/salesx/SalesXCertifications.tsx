import Image from "next/image";
import {
  SALESX_CERTIFICATIONS,
  badgeClass,
} from "@/app/content/certifications";

/**
 * Certificate badges taken from the old SalesX footer, over the same giant
 * "Certifications" marquee as the About page. The background fades from the
 * SalesX page colour (#030614) into the top of the site footer's
 * "light-blue" theme (#040507), so there is no visible seam between them.
 */
export default function SalesXCertifications() {
  return (
    <section
      aria-label="Certifications"
      className="relative overflow-hidden bg-linear-to-b from-salesx-bg via-salesx-bg to-[#040507] py-16 sm:py-24 lg:py-28 text-white select-none"
    >
      <h2 className="sr-only">Certifications</h2>

      {/* Giant "Certifications" marquee scrolling behind the badges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 z-0 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap opacity-40"
      >
        <div className="salesx-cert-marquee inline-flex items-center will-change-transform">
          {/* 8 items (two 4-item cycles) for a gapless loop */}
          {[...Array(8)].map((_, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="px-6 font-serif text-5xl font-light italic leading-none tracking-tight text-[#344E8F] sm:px-10 sm:text-7xl md:text-8xl lg:px-14 lg:text-[9.5rem] xl:text-[12.5rem]">
                Certifications
              </span>
              <span className="text-xl text-[#344E8F]/40 sm:text-3xl lg:text-5xl">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-372 flex-wrap items-center justify-center gap-6 px-4 sm:gap-10 sm:px-8 lg:gap-14 lg:px-12">
        {SALESX_CERTIFICATIONS.map((item) => (
          <Image
            key={item.id}
            src={item.image}
            alt={item.alt}
            width={item.width}
            height={item.height}
            className={badgeClass(item)}
          />
        ))}
      </div>

      <style>{`
        .salesx-cert-marquee { animation: salesxCertMarquee 36s linear infinite; }
        @keyframes salesxCertMarquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .salesx-cert-marquee { animation: none; }
        }
      `}</style>
    </section>
  );
}
