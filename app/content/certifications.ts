/** Certificate badges shown on the About page and the SalesX footer. */
export type Certification = {
  id: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  /** Round seals sit together in one row; cards go on their own row below. */
  shape: "round" | "card";
};

export const CERTIFICATIONS: Certification[] = [
  {
    id: "vc-certified",
    image: "/certificates/vc-certified.webp",
    alt: "VC Certified Sales Professional badge",
    width: 595,
    height: 594,
    shape: "round",
  },
  {
    id: "iso-9001",
    image: "/certificates/iso-9001.webp",
    alt: "ISO 9001:2015 Quality Management System certification",
    width: 784,
    height: 784,
    shape: "round",
  },
  {
    id: "iso-27001",
    image: "/certificates/iso-27001.webp",
    alt: "ISO/IEC 27001:2022 Information Security Management certification",
    width: 784,
    height: 784,
    shape: "round",
  },
  {
    id: "iso-27701",
    image: "/certificates/iso-27701.webp",
    alt: "ISO/IEC 27701:2019 Privacy Information Management certification",
    width: 784,
    height: 784,
    shape: "round",
  },
  {
    id: "sxi-card",
    image: "/certificates/sxi-card.webp",
    alt: "SXI Card: Sales Execution Index",
    width: 757,
    height: 470,
    shape: "card",
  },
];

export const ROUND_CERTIFICATIONS = CERTIFICATIONS.filter((c) => c.shape === "round");
export const CARD_CERTIFICATIONS = CERTIFICATIONS.filter((c) => c.shape === "card");

/** Shared sizes so both pages render the badges identically. */
export const ROUND_BADGE_CLASS = "h-32 sm:h-36 lg:h-40 xl:h-48 w-auto";
export const CARD_BADGE_CLASS = "h-28 sm:h-32 lg:h-36 xl:h-40 w-auto";
