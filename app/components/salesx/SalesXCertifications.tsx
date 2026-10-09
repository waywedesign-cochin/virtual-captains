import Image from "next/image";
import {
  CARD_BADGE_CLASS,
  CARD_CERTIFICATIONS,
  ROUND_BADGE_CLASS,
  ROUND_CERTIFICATIONS,
} from "@/app/content/certifications";

/**
 * Certificate badges taken from the old SalesX footer. The background fades
 * from the SalesX page colour (#030614) into the top of the site footer's
 * "light-blue" theme (#040507), so there is no visible seam between them.
 */
export default function SalesXCertifications() {
  return (
    <section
      aria-label="Certifications"
      className="relative overflow-hidden bg-linear-to-b from-salesx-bg via-salesx-bg to-[#040507] pt-16 pb-20 sm:pt-24 sm:pb-28 text-white"
    >
      <h2 className="sr-only">Certifications</h2>


      <div className="relative z-10 mx-auto flex w-full max-w-372 flex-col items-center gap-8 px-4 sm:gap-10 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14">
          {ROUND_CERTIFICATIONS.map((item) => (
            <Image
              key={item.id}
              src={item.image}
              alt={item.alt}
              width={item.width}
              height={item.height}
              className={ROUND_BADGE_CLASS}
            />
          ))}
        </div>
        {CARD_CERTIFICATIONS.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {CARD_CERTIFICATIONS.map((item) => (
              <Image
                key={item.id}
                src={item.image}
                alt={item.alt}
                width={item.width}
                height={item.height}
                className={CARD_BADGE_CLASS}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
