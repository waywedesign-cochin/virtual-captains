"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Lenis from "lenis";
import Navbar from "../../components/home/Navbar";
import SiteFooter from "../../components/home/SiteFooter";
import { BlogSlugPage } from "../../components/blogs/BlogSlugPage";
import { BookCallModal } from "../../components/blogs/BookCallModal";
import { MouseFollower } from "../../components/blogs/MouseFollower";
import { BLOG_POSTS, BlogPost } from "../blogData";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  // Unwrap params (Next.js 15+ async params)
  useEffect(() => {
    params.then(({ slug }) => setSlug(slug));
  }, [params]);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  // Wait for slug to resolve
  if (!slug) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[#1d4ed8] border-t-transparent animate-spin" />
      </div>
    );
  }

  const post: BlogPost | undefined = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const handleSelectPost = (nextSlug: string) => {
    router.push(`/blogs/${nextSlug}`);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#141414] flex flex-col selection:bg-[#141414] selection:text-white antialiased font-sans">
      {/* Shared site Navbar — auto-detects /blogs/* route for light theme */}
      <Navbar />

      {/* pt-20 offsets the fixed Navbar */}
      <div className="flex-1 w-full pt-20 sm:pt-24">
        <BlogSlugPage
          post={post}
          onNavigateBack={() => router.push("/blogs")}
          onSelectPost={handleSelectPost}
          onBookCall={() => setIsBookCallOpen(true)}
        />
      </div>

      {/* Mouse Follower "Read article" Bubble */}
      <MouseFollower />

      {/* Interactive Book a Call Modal */}
      <BookCallModal
        isOpen={isBookCallOpen}
        onClose={() => setIsBookCallOpen(false)}
      />

      {/* Footer */}
      <SiteFooter showCTA={false} />
    </div>
  );
}
