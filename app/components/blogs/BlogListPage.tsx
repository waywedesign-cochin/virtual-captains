import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { BlogPost, Category } from "@/sanity/lib/types";
import { CTASection } from "./CTASection";

interface BlogListPageProps {
  posts: BlogPost[];
  categories: Category[];
  onBookCall: () => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({
  posts = [],
  categories = [],
  onBookCall,
}) => {
  const categoryOptions = useMemo(
    () => ["All", ...categories.map((c) => c.title)],
    [categories],
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Primary featured marquee post
  const featuredPost = useMemo(() => {
    return posts.find((p: BlogPost) => p.featured) || posts[0];
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post: BlogPost) => {
      const matchesCategory =
        selectedCategory === "All" ? true : post.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === ""
          ? true
          : post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [posts, selectedCategory, searchQuery]);

  if (!featuredPost) {
    return (
      <main className="w-full pb-16">
        <div className="text-center py-24">
          <p className="text-[#737373] text-sm">No articles published yet.</p>
        </div>
      </main>
    );
  }

  // Framer-style staggered words animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <main className="w-full pb-16">
      {/* 1. Hero Section with Exact Framer Stagger Entrance */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 max-w-5xl mx-auto px-4 text-center space-y-5">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {/* Eyebrow tag */}
          <motion.div
            variants={wordVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#1d4ed8]/20 bg-linear-to-r from-[#1d4ed8]/8 to-[#0ea5e9]/5 text-[11px] font-semibold tracking-widest uppercase text-[#1d4ed8]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8] animate-pulse" />
            Virtual Captains Blogs
          </motion.div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal tracking-tight leading-[1.08]">
            <span className="block text-[#141414]">
              <motion.span
                variants={wordVariants}
                className="inline-block mr-3 sm:mr-4"
              >
                Ideas,
              </motion.span>
              <motion.span variants={wordVariants} className="inline-block">
                Insights
              </motion.span>
            </span>
            <span className="block">
              <motion.span
                variants={wordVariants}
                className="inline-block mr-3 sm:mr-4 text-[#141414]"
              >
                &amp;
              </motion.span>
              <motion.span
                variants={wordVariants}
                className="inline-block bg-linear-to-r from-[#1d4ed8] via-[#0369a1] to-[#141414] bg-clip-text text-transparent"
              >
                Perspectives
              </motion.span>
            </span>
          </h1>

          {/* Virtual Captains Subtitle */}
          <motion.p
            variants={wordVariants}
            className="text-sm sm:text-base md:text-lg text-[#737373] max-w-xl mx-auto leading-relaxed pt-2"
          >
            Not trends, not theory. Just battle-tested frameworks from the team
            that coaches, simulates, and accelerates elite sales teams.
          </motion.p>
        </motion.div>
      </section>

      {/* 2. Featured Bento Marquee Card */}
      <section className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 mb-16">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] font-bold tracking-widest uppercase bg-linear-to-r from-[#1d4ed8] to-[#0369a1] bg-clip-text text-transparent">
            Featured
          </span>
          <div className="flex-1 h-px bg-linear-to-r from-[#1d4ed8]/30 to-transparent" />
        </div>
        <Link
          href={`/blogs/${featuredPost.slug}`}
          data-cursor="read"
          data-cursor-text="Read article"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] p-6 sm:p-8 lg:p-10 border border-black/4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.12)] transition-all duration-500 cursor-pointer group"
        >
          {/* Left Column Content */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs sm:text-sm font-medium text-[#A4A4A4]">
                {formatDate(featuredPost.publishedDate)}
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#141414] group-hover:text-neutral-600 transition-colors leading-[1.18] tracking-tight">
                {featuredPost.title}
              </h2>

              <p className="text-sm sm:text-base text-[#737373] leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div>
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-black/5 text-[#141414]">
                  {featuredPost.category}
                </span>
              </div>
            </div>

            {/* Author row */}
            <div className="flex items-center justify-between pt-6 border-t border-black/4">
              <div className="flex items-center gap-3">
                <img
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  className="w-9 h-9 rounded-full object-cover border border-black/5"
                />
                <span className="text-xs font-semibold text-[#141414]">
                  By {featuredPost.author.name}
                </span>
              </div>
              <span className="text-xs font-mono text-[#A4A4A4] uppercase tracking-wider">
                {featuredPost.readTime}
              </span>
            </div>
          </div>

          {/* Right Column Image with Parallax / Smooth Zoom */}
          <div className="lg:col-span-6 overflow-hidden rounded-[20px] sm:rounded-3xl aspect-16/10 bg-[#F2EFE9] relative ring-1 ring-black/4">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          </div>
        </Link>
      </section>

      {/* 3. Category Filter Tabs & Search Bar */}
      <section className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 mb-12">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Animated Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1 bg-black/3 rounded-full border border-black/4">
            {categoryOptions.map((cat: string) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none ${
                    isActive
                      ? "text-white"
                      : "text-[#737373] hover:text-[#141414]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterTab"
                      className="absolute inset-0 bg-linear-to-r from-[#1d4ed8] to-[#0369a1] rounded-full shadow-sm shadow-[#1d4ed8]/20"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Real-time Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#A4A4A4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search insights..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-full bg-white border border-black/6 text-[#141414] placeholder-[#A4A4A4] focus:outline-none focus:border-[#141414] transition-colors shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A4A4A4] hover:text-[#141414] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. Grid of Articles */}
      <section className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 mb-24">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[11px] font-bold tracking-widest uppercase bg-linear-to-r from-[#1d4ed8] to-[#0369a1] bg-clip-text text-transparent">
            All Articles
          </span>
          <div className="flex-1 h-px bg-linear-to-r from-[#1d4ed8]/30 to-transparent" />
        </div>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-black/4 space-y-2">
            <p className="text-[#737373] text-sm">
              No articles found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-[#141414] underline cursor-pointer hover:text-black"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredPosts.map((post: BlogPost) => (
              <Link
                key={post._id}
                href={`/blogs/${post.slug}`}
                data-cursor="read"
                data-cursor-text="Read article"
                className="bg-white rounded-3xl sm:rounded-[26px] p-4 sm:p-5 border border-black/5 shadow-[0_10px_25px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
              >
                {/* Blue gradient accent top border on hover */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-[#1d4ed8] via-[#0ea5e9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl sm:rounded-t-[26px]" />

                {/* Top Section: Date, Title, Subtitle/Excerpt, Category Badge */}
                <div className="flex flex-col">
                  {/* Date */}
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#8c8c8c]">
                    {formatDate(post.publishedDate)}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-xl sm:text-[22px] font-normal text-[#141414] group-hover:text-[#1d4ed8] transition-colors leading-[1.24] tracking-tight mt-2.5 mb-1.5 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Subtitle / Excerpt */}
                  <p className="text-xs sm:text-[13px] text-[#666666] leading-relaxed line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>

                  {/* Category Pill & Read Time */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#F0EDE8] text-[#141414]">
                      {post.category}
                    </span>
                    <span className="text-[11px] font-mono text-[#999999]">
                      {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Bottom Section: Article Image */}
                <div className="mt-4 overflow-hidden rounded-2xl aspect-16/11 bg-[#F2EFE9] ring-1 ring-black/4">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 5. Virtual Captains CTA Section with Background Video */}
      <CTASection onBookCall={onBookCall} />
    </main>
  );
};
