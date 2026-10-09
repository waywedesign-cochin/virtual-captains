/** Certificate badges: ISO + QMS on the About page, programme certifications on SalesX. */
export type Certification = {
  id: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  /** Which page shows it: About (ISO + QMS) or SalesX (programme certifications). */
  page: "about" | "salesx";
  /** Drives the badge size so round seals and wide cards look balanced. */
  shape: "round" | "card";
};

export const CERTIFICATIONS: Certification[] = [
  {
    id: "iso-9001",
    page: "about",
    image: "/certificates/iso-9001.webp",
    alt: "ISO 9001:2015 Quality Management System certification",
    width: 784,
    height: 784,
    shape: "round",
  },
  {
    id: "iso-27001",
    page: "about",
    image: "/certificates/iso-27001.webp",
    alt: "ISO/IEC 27001:2022 Information Security Management certification",
    width: 784,
    height: 784,
    shape: "round",
  },
  {
    id: "iso-27701",
    page: "about",
    image: "/certificates/iso-27701.webp",
    alt: "ISO/IEC 27701:2019 Privacy Information Management certification",
    width: 784,
    height: 784,
    shape: "round",
  },
  {
    id: "vc-certified",
    page: "salesx",
    image: "/certificates/vc-certified.webp",
    alt: "VC Certified Sales Professional badge",
    width: 595,
    height: 594,
    shape: "round",
  },
  {
    id: "sxi-card",
    page: "salesx",
    image: "/certificates/sxi-card.webp",
    alt: "SXI Card: Sales Execution Index",
    width: 757,
    height: 470,
    shape: "card",
  },
  {
    id: "egac-accredited",
    page: "about",
    image: "/certificates/egac-round.webp",
    alt: "EGAC Accredited QMS Certification, CAB # 012226",
    width: 784,
    height: 784,
    shape: "round",
  },
  {
    id: "cpd-certified",
    page: "salesx",
    image: "/certificates/cpd-round.webp",
    alt: "CPD Certified: The CPD Certification Service",
    width: 784,
    height: 784,
    shape: "round",
  },
];

export const ABOUT_CERTIFICATIONS = CERTIFICATIONS.filter((c) => c.page === "about");
export const SALESX_CERTIFICATIONS = CERTIFICATIONS.filter((c) => c.page === "salesx");

/** Shared sizes so both pages render the badges identically. */
const ROUND_BADGE_CLASS = "h-24 sm:h-28 lg:h-32 xl:h-36 w-auto";
const CARD_BADGE_CLASS = "h-20 sm:h-24 lg:h-28 xl:h-32 w-auto";

export const badgeClass = (c: Certification) =>
  c.shape === "round" ? ROUND_BADGE_CLASS : CARD_BADGE_CLASS;
