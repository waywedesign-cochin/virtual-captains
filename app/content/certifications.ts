/** Certificate badges shown on the About page and the SalesX footer. */
export type Certification = {
  id: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  /** Height classes, so the round seal and the wide card look balanced side by side. */
  sizeClass: string;
};

export const CERTIFICATIONS: Certification[] = [
  {
    id: "vc-certified",
    image: "/certificates/vc-certified.webp",
    alt: "VC Certified Sales Professional badge",
    width: 595,
    height: 594,
    sizeClass: "h-36 sm:h-44 lg:h-52 xl:h-60",
  },
  {
    id: "sxi-card",
    image: "/certificates/sxi-card.webp",
    alt: "SXI Card: Sales Execution Index",
    width: 757,
    height: 470,
    sizeClass: "h-28 sm:h-34 lg:h-40 xl:h-46",
  },
];
