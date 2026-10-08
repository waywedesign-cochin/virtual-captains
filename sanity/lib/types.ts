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

export type NewsCategory = {
  _id: string;
  title: string;
  slug: string;
};

export type NewsSeo = {
  metaTitle?: string;
  metaDescription?: string;
};

export type NewsPost = {
  _id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  summary: string;
  publishedDate: string; // ISO datetime
  readTime: string;
  featured: boolean;
  image?: { url: string; alt: string };
  content: {
    lead?: string;
    body: unknown[]; // Portable Text blocks
  };
  seo?: NewsSeo;
};

// Frontend-owned design decision, not content: which dot color each
// category renders with. Add a case here whenever a new newsCategory
// is created in the Studio. Falls back to sky if a category is missing.
export const NEWS_CATEGORY_DOT: Record<string, string> = {
  "product-release": "bg-[#38bdf8]",
  partnership: "bg-emerald-400",
  milestone: "bg-[#e7ff3d]",
  company: "bg-fuchsia-400",
};

export function getNewsCategoryDot(categorySlug: string): string {
  return NEWS_CATEGORY_DOT[categorySlug] ?? "bg-[#38bdf8]";
}

// CAREER TYPES

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACTOR"
  | "INTERN"
  | "TEMPORARY";

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
