import type { PortableTextBlock } from "@portabletext/types";

export type BlogCategory = string;

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  publishedDate: string;
  readTime: string;
  featured?: boolean;
  image: string;
  bannerImage?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content?: {
    lead?: string;
    body?: PortableTextBlock[];
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
}

//NEWS TYPES
// Add these alongside your existing BlogPost / Category types,
// e.g. in @/sanity/lib/types.ts

export type NewsSeo = {
  metaTitle?: string;
  metaDescription?: string;
};

export type NewsPost = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  publishedDate: string; // ISO datetime
  readTime: string;
  featured: boolean;
  /**
   * width/height: original pixel size. crop: the editor's crop in the Studio
   * (fractions trimmed from each side) — use `croppedImage()` to apply it.
   */
  image?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  content: {
    lead?: string;
    body: unknown[]; // Portable Text blocks
  };
  seo?: NewsSeo;
};

// CAREER TYPES

export type EmploymentType =
  "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "INTERN" | "TEMPORARY";

export type WorkplaceType = "onsite" | "hybrid" | "remote";

export type CareerSalary = {
  showOnSite?: boolean;
  currency?: string;
  min?: number;
  max?: number;
  unit?: "YEAR" | "MONTH" | "HOUR";
};

/** Card fields — what the Careers listing needs. */
export type CareerSummary = {
  _id: string;
  title: string;
  slug: string;
  department: string;
  /** Display Order set on the department in the Studio, if any */
  departmentOrder?: number | null;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  location: string;
  experience?: string;
  summary: string;
  postedDate: string;
  validThrough?: string;
  featured?: boolean;
};

/** Full job page. Rich-text sections are Portable Text blocks. */
export type Career = CareerSummary & {
  openings?: number;
  aboutRole?: PortableTextBlock[];
  responsibilities?: PortableTextBlock[];
  requirements?: PortableTextBlock[];
  niceToHave?: PortableTextBlock[];
  benefits?: PortableTextBlock[];
  hiringProcess?: string[];
  salary?: CareerSalary;
  seo?: { metaTitle?: string; metaDescription?: string };
  updatedAt: string;
};

export const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACTOR: "Contract",
  INTERN: "Internship",
  TEMPORARY: "Temporary",
};

export const WORKPLACE_TYPE_LABEL: Record<WorkplaceType, string> = {
  onsite: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};

/**
 * The news image as cropped in the Sanity Studio: a CDN URL showing only the
 * crop rectangle (`rect=` + resize), and the cropped size for aspect ratios.
 * Without a crop (or without known dimensions) it's the full image.
 */
export function croppedImage(
  image: NonNullable<NewsPost["image"]>,
  width = 900,
) {
  const { url, crop } = image;
  const w = image.width ?? 0;
  const h = image.height ?? 0;
  if (!w || !h)
    return { src: `${url}?w=${width}&fm=webp&q=80`, width: w, height: h };

  const left = Math.round(w * (crop?.left ?? 0));
  const top = Math.round(h * (crop?.top ?? 0));
  const cw = Math.max(
    1,
    Math.round(w * (1 - (crop?.left ?? 0) - (crop?.right ?? 0))),
  );
  const ch = Math.max(
    1,
    Math.round(h * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0))),
  );
  const rect = crop ? `rect=${left},${top},${cw},${ch}&` : "";
  return {
    src: `${url}?${rect}w=${width}&fm=webp&q=80`,
    width: cw,
    height: ch,
  };
}
