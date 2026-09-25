
import { ALL_POSTS_QUERY, ALL_CATEGORIES_QUERY } from "@/sanity/queries";
import { BlogPost, Category } from "@/sanity/lib/types";
import { BlogsPageClient } from "../components/blogs/BlogsPageClient";
import { clientFetch } from "@/sanity/lib/client";


export default async function BlogsPage() {
  const [posts, categories] = await Promise.all([
    clientFetch<BlogPost[]>({ query: ALL_POSTS_QUERY, tags: ["post"] }),
    clientFetch<Category[]>({ query: ALL_CATEGORIES_QUERY, tags: ["category"] }),
  ]);

  return <BlogsPageClient posts={posts} categories={categories} />;
}