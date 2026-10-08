import { groq } from "next-sanity";
import type { Career, CareerSummary, NewsCategory, NewsPost } from "./lib/types";
import { client } from "./lib/client";

// Fragment for consistent post shape across queries
const postFields = groq`
  _id,
  title,
  "slug": slug.current,
  "summary": coalesce(summary, excerpt),
  "category": category->title,
  publishedDate,
  readTime,
  featured,
  "image": image.asset->url,
  "bannerImage": bannerImage.asset->url,
  author->{
    name,
    role,
    "avatar": avatar.asset->url
  }
`;

// Get all posts, newest first
export const ALL_POSTS_QUERY = groq`
  *[_type == "post"] | order(publishedDate desc) {
    ${postFields}
  }
`;

// Get a single post by slug, including full content
export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    seo {
      metaTitle,
      metaDescription,
    },
    content {
      lead,
      body[] {
        ...,
        _type == "image" => {
          ...,
          "url": asset->url
        }
      }
    }
  }
`;

// Get featured posts only
export const FEATURED_POSTS_QUERY = groq`
  *[_type == "post" && featured == true] | order(publishedDate desc) {
    ${postFields}
  }
`;

// Get posts filtered by category title (e.g. "Sales Growth")
export const POSTS_BY_CATEGORY_QUERY = groq`
  *[_type == "post" && category->title == $category] | order(publishedDate desc) {
    ${postFields}
  }
`;

// Get all category titles (for building filter tabs)
export const ALL_CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`;

// Get all slugs (for generateStaticParams / SSG)
export const ALL_POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

// Get recent posts excluding the current slug
export const RECENT_POSTS_QUERY = groq`
  *[_type == "post" && slug.current != $slug] | order(publishedDate desc)[0...4] {
    ${postFields}
  }
`;

//NEWS QUERIES

const newsPostProjection = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  category->{
    _id,
    title,
    "slug": slug.current
  },
  summary,
  publishedDate,
  readTime,
  featured,
  image{
    "url": asset->url,
    "alt": coalesce(alt, ^.title)
  },
  content{
    lead,
    body
  },
  seo{
    metaTitle,
    metaDescription,
  }
}`;

export const allNewsQuery = groq`
  *[_type == "newsPost"] | order(publishedDate desc) ${newsPostProjection}
`;

export const newsByCategoryQuery = groq`
  *[_type == "newsPost" && category->slug.current == $categorySlug]
    | order(publishedDate desc) ${newsPostProjection}
`;

export const newsBySlugQuery = groq`
  *[_type == "newsPost" && slug.current == $slug][0] ${newsPostProjection}
`;

export const newsCategoriesQuery = groq`
  *[_type == "newsCategory"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`;

// --- Fetch helpers -----------------------------------------------------

export async function getAllNews(): Promise<NewsPost[]> {
  return client.fetch(allNewsQuery);
}

export async function getNewsByCategory(
  categorySlug: string,
): Promise<NewsPost[]> {
  return client.fetch(newsByCategoryQuery, { categorySlug });
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  return client.fetch(newsBySlugQuery, { slug });
}

export async function getNewsCategories(): Promise<NewsCategory[]> {
  return client.fetch(newsCategoriesQuery);
}

// ── YouTube videos (About page "Recent & Upcoming Videos") ──
export type YouTubeVideoDoc = {
  _id: string;
  title: string;
  status: "recent" | "upcoming";
  url?: string;
  premiereDate?: string;
};

export const YOUTUBE_VIDEOS_QUERY = groq`
  *[_type == "youtubeVideo" && defined(title)] | order(coalesce(order, 999) asc, _createdAt desc) {
    _id,
    title,
    status,
    url,
    premiereDate
  }
`;

// Server render: short safety-net cache; the About page also listens live
// in the browser, so a publish shows up within seconds either way.
export async function getYouTubeVideos(): Promise<YouTubeVideoDoc[]> {
  try {
    return await client.fetch<YouTubeVideoDoc[]>(
      YOUTUBE_VIDEOS_QUERY,
      {},
      {
        next: { revalidate: 60, tags: ["youtubeVideo"] },
      },
    );
  } catch {
    return [];
  }
}

// ── Programs (Programs page + Razorpay price lookup) ──
export type ProgramDoc = {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  audience: "students" | "professionals" | "founders" | "organisations";
  level?: string;
  hours?: number;
  duration?: string;
  format?: string;
  priceInr?: number | null;
  image?: { url: string; alt?: string };
  highlights?: string[];
  outcome?: string;
  featured?: boolean;
};

export const PROGRAMS_QUERY = groq`
  *[_type == "program" && defined(slug.current)]
    | order(coalesce(order, 999) asc, _createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    tagline,
    description,
    audience,
    level,
    hours,
    duration,
    format,
    priceInr,
    "image": select(defined(image.asset) => { "url": image.asset->url, "alt": image.alt }),
    highlights,
    outcome,
    featured
  }
`;

export async function getPrograms(): Promise<ProgramDoc[]> {
  try {
    return await client.fetch<ProgramDoc[]>(
      PROGRAMS_QUERY,
      {},
      {
        next: { revalidate: 60, tags: ["program"] },
      },
    );
  } catch {
    return [];
  }
}

// Price used for payments. Always read live (no CDN, no Next cache) so the
// amount charged is never stale.
const PROGRAM_PRICE_QUERY = groq`
  *[_type == "program" && slug.current == $slug][0].priceInr
`;

/** Price in whole rupees, or null if the program has no online price. */
export async function getProgramPrice(slug: string): Promise<number | null> {
  const price = await client
    .withConfig({ useCdn: false })
    .fetch<number | null>(PROGRAM_PRICE_QUERY, { slug }, { cache: "no-store" });
  return Number.isInteger(price) && (price as number) > 0
    ? (price as number)
    : null;
}

// ── Careers (Careers page + job detail pages) ──

// Live roles only: switched on in the Studio and not past their deadline.
const OPEN_CAREER_FILTER = /* groq */ `_type == "career" && isOpen != false && defined(slug.current) && (!defined(validThrough) || validThrough > now())`;

const careerCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  // name from the department document; old plain-text values still work
  "department": coalesce(department->title, department),
  "departmentOrder": department->order,
  employmentType,
  workplaceType,
  location,
  experience,
  summary,
  postedDate,
  validThrough,
  featured
`;

const careerBody = /* groq */ `[]{
  ...,
  _type == "image" => { ..., "url": asset->url }
}`;

export const allCareersQuery = groq`
  *[${OPEN_CAREER_FILTER}] | order(featured desc, postedDate desc) { ${careerCardFields} }
`;

export const careerBySlugQuery = groq`
  *[${OPEN_CAREER_FILTER} && slug.current == $slug][0] {
    ${careerCardFields},
    openings,
    "aboutRole": aboutRole${careerBody},
    "responsibilities": responsibilities${careerBody},
    "requirements": requirements${careerBody},
    "niceToHave": niceToHave${careerBody},
    "benefits": benefits${careerBody},
    hiringProcess,
    salary,
    seo { metaTitle, metaDescription },
    "updatedAt": _updatedAt
  }
`;

// Short cache so a publish (or a role being closed) shows up within a minute.
const CAREER_FETCH = { next: { revalidate: 60, tags: ["career"] } };

export async function getAllCareers(): Promise<CareerSummary[]> {
  try {
    return await client.fetch<CareerSummary[]>(allCareersQuery, {}, CAREER_FETCH);
  } catch {
    return [];
  }
}

export async function getCareerBySlug(slug: string): Promise<Career | null> {
  return client.fetch<Career | null>(careerBySlugQuery, { slug }, CAREER_FETCH);
}

// ── Gallery photos (News & Updates page, "Gallery" view) ──
export const GALLERY_PAGE_SIZE = 6;

export type GalleryPhoto = {
  _id: string;
  url: string;
  alt: string;
  caption?: string;
  date: string;
  width: number;
  height: number;
  lqip?: string;
};

export const GALLERY_PAGE_QUERY = groq`{
  "total": count(*[_type == "galleryPhoto" && defined(image.asset)]),
  "photos": *[_type == "galleryPhoto" && defined(image.asset)]
    | order(date desc, _createdAt desc) [$start...$end] {
      _id,
      "url": image.asset->url,
      "alt": coalesce(image.alt, caption, "Virtual Captains photo"),
      caption,
      date,
      "width": image.asset->metadata.dimensions.width,
      "height": image.asset->metadata.dimensions.height,
      "lqip": image.asset->metadata.lqip
    }
}`;

// One page of photos, newest first. `page` is 1-based.
export async function getGalleryPage(
  page: number,
): Promise<{ total: number; photos: GalleryPhoto[] }> {
  const start = (page - 1) * GALLERY_PAGE_SIZE;
  try {
    return await client.fetch(
      GALLERY_PAGE_QUERY,
      { start, end: start + GALLERY_PAGE_SIZE },
      { next: { revalidate: 60, tags: ["galleryPhoto"] } },
    );
  } catch {
    return { total: 0, photos: [] };
  }
}
