import { groq } from "next-sanity";
import { NewsCategory, NewsPost } from "./lib/types";
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
    return await client.fetch<YouTubeVideoDoc[]>(YOUTUBE_VIDEOS_QUERY, {}, {
      next: { revalidate: 60, tags: ["youtubeVideo"] },
    });
  } catch {
    return [];
  }
}
