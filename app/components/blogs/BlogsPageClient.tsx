"use client";

import React, { useEffect, useState } from "react";
import Lenis from "lenis";

import { BlogPost, Category } from "@/sanity/lib/types";
import Navbar from "../home/Navbar";
import { BlogListPage } from "./BlogListPage";
import { MouseFollower } from "./MouseFollower";
import { BookCallModal } from "./BookCallModal";
import SiteFooter from "../home/SiteFooter";

interface BlogsPageClientProps {
  posts: BlogPost[];
  categories: Category[];
}

export function BlogsPageClient({ posts, categories }: BlogsPageClientProps) {
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#141414] flex flex-col selection:bg-[#141414] selection:text-white antialiased font-sans">
      {/* Shared site Navbar — auto-detects /blogs route for light theme */}
      <Navbar />

      {/* pt-20 offsets the fixed Navbar */}
      <div className="flex-1 w-full pt-20 sm:pt-24">
        <BlogListPage
          posts={posts}
          categories={categories}
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
