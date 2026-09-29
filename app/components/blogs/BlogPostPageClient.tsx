"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/home/Navbar";
import SiteFooter from "../../components/home/SiteFooter";
import DotGridSpotlight from "../../components/common/DotGridSpotlight";
import { BlogSlugPage } from "../../components/blogs/BlogSlugPage";
import BookACallModal from "../../components/home/BookACallModal";
import { MouseFollower } from "../../components/blogs/MouseFollower";
import { BlogPost } from "@/sanity/lib/types";

interface BlogPostPageClientProps {
  post: BlogPost;
  recentPosts: BlogPost[];
}

/**
 * Blog article — same dark theme as the /blogs listing and the home page.
 * Smooth scrolling comes from the site-wide <SmoothScroll /> in the root
 * layout (a second Lenis instance here used to fight it).
 */
export function BlogPostPageClient({
  post,
  recentPosts,
}: BlogPostPageClientProps) {
  const router = useRouter();
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  const handleSelectPost = (nextSlug: string) => {
    router.push(`/blogs/${nextSlug}`);
  };

  return (
    <div className="relative min-h-screen bg-[#040507] text-white flex flex-col selection:bg-[#38bdf8] selection:text-black antialiased font-sans overflow-x-clip">
      <Navbar />

      {/* Home-page atmosphere: diagonal blue glow + dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[800px]"
        style={{
          background:
            "radial-gradient(110% 60% at -5% -10%, #3f74e6 0%, #1c4fc0 12%, #0c318f 26%, #051d5c 42%, #050b24 60%, #040507 78%)",
        }}
      />
      {/* Home-hero dot grid: dots light up around the cursor, page-wide */}
      <DotGridSpotlight />

      {/* pt offsets the fixed Navbar */}
      <div className="relative flex-1 w-full pt-20 sm:pt-24">
        <BlogSlugPage
          post={post}
          recentPosts={recentPosts}
          onNavigateBack={() => router.push("/blogs")}
          onSelectPost={handleSelectPost}
          onBookCall={() => setIsBookCallOpen(true)}
        />
      </div>

      <MouseFollower />

      {/* Same "Book a Call" popup as the home page and the rest of the site */}
      <BookACallModal
        open={isBookCallOpen}
        onClose={() => setIsBookCallOpen(false)}
      />

      {/* Same footer as the home page (dark → blue) */}
      <SiteFooter showCTA={false} theme="light-blue" />
    </div>
  );
}
