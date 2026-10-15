import { AE, IN, MY, OM } from "country-flag-icons/react/3x2";

/**
 * SVG country flag. Emoji flags (🇮🇳) don't render on Windows — it shows the
 * letters "IN" instead — so flags are drawn as SVGs that look the same everywhere.
 */
const FLAGS = { AE, IN, MY, OM };

export type FlagCode = keyof typeof FLAGS;

export default function CountryFlag({
  code,
  className = "",
}: {
  code: FlagCode;
  className?: string;
}) {
  const Flag = FLAGS[code];
  return (
    <Flag
      aria-hidden="true"
      className={`inline-block aspect-[3/2] rounded-[2px] ${className}`}
    />
  );
}
