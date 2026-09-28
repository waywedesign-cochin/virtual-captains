import { notFound } from "next/navigation";
import { clientFetch } from "@/sanity/lib/client";
import {
  POST_BY_SLUG_QUERY,
  RECENT_POSTS_QUERY,
  ALL_POST_SLUGS_QUERY,
} from "@/sanity/queries";
import { BlogPost } from "@/sanity/lib/types";
import { BlogPostPageClient } from "@/app/components/blogs/BlogPostPageClient";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await clientFetch<string[]>({
    query: ALL_POST_SLUGS_QUERY,
    tags: ["post"],
  });

  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [post, recentPosts] = await Promise.all([
    clientFetch<BlogPost | null>({
      query: POST_BY_SLUG_QUERY,
      params: { slug },
      tags: ["post"],
    }),
    clientFetch<BlogPost[]>({
      query: RECENT_POSTS_QUERY,
      params: { slug },
      tags: ["post"],
    }),
  ]);

  if (!post) {
    notFound();
  }

  return <BlogPostPageClient post={post} recentPosts={recentPosts} />;
}
