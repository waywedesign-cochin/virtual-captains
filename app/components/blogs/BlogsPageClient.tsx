"use client";

import React, { useState } from "react";

import { BlogPost, Category } from "@/sanity/lib/types";
import Navbar from "../home/Navbar";
import { BlogListPage } from "./BlogListPage";
import { MouseFollower } from "./MouseFollower";
import BookACallModal from "../home/BookACallModal";
import SiteFooter from "../home/SiteFooter";
import DotGridSpotlight from "../common/DotGridSpotlight";

interface BlogsPageClientProps {
  posts: BlogPost[];
  categories: Category[];
}

/**
 * Blogs listing — dark theme matching the home page (near-black base, blue
 * glow + dot grid, DM Sans). Smooth scrolling comes from the site-wide
 * <SmoothScroll /> in the root layout; a second Lenis instance here used to
 * fight it.
 */
export function BlogsPageClient({ posts, categories }: BlogsPageClientProps) {
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#040507] text-white flex flex-col selection:bg-[#38bdf8] selection:text-black antialiased font-sans overflow-x-clip">
      <Navbar />

      {/* Home-page atmosphere: diagonal blue glow from the top-left + dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[900px]"
        style={{
          background:
            "radial-gradient(120% 70% at -5% -10%, #3f74e6 0%, #1c4fc0 12%, #0c318f 26%, #051d5c 42%, #050b24 60%, #040507 78%)",
        }}
      />
      {/* Home-hero dot grid: dots light up around the cursor, page-wide */}
      <DotGridSpotlight />

      {/* pt offsets the fixed Navbar */}
      <div className="relative flex-1 w-full pt-20 sm:pt-24">
        <BlogListPage
          posts={posts}
          categories={categories}
          onBookCall={() => setIsBookCallOpen(true)}
        />
      </div>

      {/* Mouse Follower "Read article" Bubble */}
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
