"use client";

import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";
import { BlogListPage } from "../components/blogs/BlogListPage";
import { BookCallModal } from "../components/blogs/BookCallModal";
import { MouseFollower } from "../components/blogs/MouseFollower";

export default function BlogsPage() {
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
        <BlogListPage onBookCall={() => setIsBookCallOpen(true)} />
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
