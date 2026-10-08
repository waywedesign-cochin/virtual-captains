import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";
import { client } from "@/sanity/lib/client";

// Public pages only — duplicates (/partner, /resources/*), redirects
// (/disclaimer), the studio and placeholders are left out on purpose.
const PAGES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/salesx", priority: 0.9, changeFrequency: "monthly" },
  { path: "/individuals", priority: 0.9, changeFrequency: "monthly" },
  { path: "/organisations", priority: 0.9, changeFrequency: "monthly" },
  { path: "/programs", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/partner-with-us", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/blogs", priority: 0.7, changeFrequency: "weekly" },
  { path: "/news-and-updates", priority: 0.6, changeFrequency: "weekly" },
  { path: "/careers", priority: 0.6, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/refund", priority: 0.2, changeFrequency: "yearly" },
];

export const revalidate = 3600;

const SECTION: Record<string, string> = { post: "blogs", newsPost: "news-and-updates", career: "careers" };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = PAGES.map((p) => ({
    url: `${SITE_URL}${p.path === "/" ? "" : p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  // Blog posts, news articles and open job roles from Sanity, so new ones are picked up
  // automatically (their page metadata itself is managed in Sanity).
  let content: MetadataRoute.Sitemap = [];
  try {
    const docs = await client.fetch<{ type: string; slug: string; updated: string }[]>(
      `*[(_type in ["post", "newsPost"] || (_type == "career" && isOpen != false && (!defined(validThrough) || validThrough > now()))) && defined(slug.current)]{ "type": _type, "slug": slug.current, "updated": _updatedAt }`,
    );
    content = docs.map((d) => ({
      url: `${SITE_URL}/${SECTION[d.type] ?? "news-and-updates"}/${d.slug}`,
      lastModified: new Date(d.updated),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Sanity unreachable at build time: the static pages still ship
  }

  return [...pages, ...content];
}
