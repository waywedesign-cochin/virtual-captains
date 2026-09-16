import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  readonly className?: string;
}

/**
 * Wordmark. Now using the wlogo.png from the public folder.
 */
export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={className ? `logo ${className} flex items-center gap-2` : "logo flex items-center gap-2"} aria-label="Virtual Captains — home">
      <Image
        src="/wlogo.png"
        alt="Virtual Captains"
        width={160}
        height={40}
        className="logo__mark object-contain w-auto h-8 md:h-10"
        priority
      />
    </Link>
  );
}
