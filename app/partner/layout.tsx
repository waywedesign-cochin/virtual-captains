import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// The partner page itself is a client component, so its metadata lives here.
// Canonical is /partner-with-us (the nav's /partner shows the same page).
export const metadata: Metadata = pageMetadata({
  title: "Partner With Us",
  description:
    "Partner with Virtual Captains and SalesX: academic and institution partnerships, corporate and hiring partnerships, and brand and channel partnerships across the SalesX ecosystem.",
  path: "/partner-with-us",
});

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
