import { groq } from "next-sanity";

// Fragment for consistent post shape across queries
const postFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
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
    content {
      lead,
      sections[] {
        heading,
        paragraphs,
        listItems,
        note
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
