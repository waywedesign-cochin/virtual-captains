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
            post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [posts, selectedCategory, searchQuery]);

  if (!featuredPost) {
    return (
      <main className="w-full pb-16">
        <div className="text-center py-24">
          <p className="text-white/60 text-sm">No articles published yet.</p>
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
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/5 backdrop-blur-md font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-[#38bdf8] shadow-[0_0_16px_rgba(56,189,248,0.15)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse shadow-[0_0_6px_#38bdf8]" />
            Virtual Captains Blogs
          </motion.div>

          <h1 className="font-sans text-[clamp(2.5rem,1.6rem+4vw,4.75rem)] font-medium tracking-tight leading-[1.06]">
            <span className="block text-white">
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
                className="inline-block mr-3 sm:mr-4 text-white"
              >
                &amp;
              </motion.span>
              <motion.span
                variants={wordVariants}
                className="inline-block italic bg-linear-to-r from-[#8fd0ff] via-[#38bdf8] to-[#4d82f5] bg-clip-text text-transparent pr-1"
              >
                Perspectives
              </motion.span>
            </span>
          </h1>

          {/* Virtual Captains Subtitle */}
          <motion.p
            variants={wordVariants}
            className="text-[15px] sm:text-base md:text-lg text-white/65 max-w-xl mx-auto leading-relaxed pt-2"
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
          <span className="font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-[#38bdf8]">
            Featured
          </span>
          <div className="flex-1 h-px bg-linear-to-r from-[#38bdf8]/35 to-transparent" />
        </div>
        <Link
          href={`/blogs/${featuredPost.slug}`}
          data-cursor="read"
          data-cursor-text="Read article"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-[28px] sm:rounded-[36px] lg:rounded-[40px] p-5 sm:p-8 lg:p-10 border border-white/10 bg-linear-to-br from-white/[0.07] via-white/3 to-transparent backdrop-blur-xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] hover:border-white/20 hover:shadow-[0_28px_70px_-20px_rgba(29,78,216,0.45)] transition-all duration-500 cursor-pointer group"
        >
          {/* Left Column Content */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">
                {formatDate(featuredPost.publishedDate)}
              </span>

              <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-medium text-white group-hover:text-[#8fd0ff] transition-colors leading-[1.18] tracking-tight">
                {featuredPost.title}
              </h2>

              <p className="text-[15px] sm:text-base text-white/65 leading-relaxed line-clamp-3">
                {featuredPost.summary}
              </p>

              <div>
                <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium border border-white/15 bg-white/5 text-white/85">
                  {featuredPost.category}
                </span>
              </div>
            </div>

            {/* Author row */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/15"
                />
                <span className="text-xs font-semibold text-white/90">
                  By {featuredPost.author.name}
                </span>
              </div>
              <span className="text-xs font-mono text-white/50 uppercase tracking-wider">
                {featuredPost.readTime}
              </span>
            </div>
          </div>

          {/* Right Column Image with Parallax / Smooth Zoom */}
          <div className="lg:col-span-6 overflow-hidden rounded-[20px] sm:rounded-3xl aspect-16/10 bg-white/5 relative ring-1 ring-white/10">
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
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/4 rounded-3xl sm:rounded-full border border-white/10">
            {categoryOptions.map((cat: string) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative min-h-10 px-4 rounded-full text-[13px] sm:text-sm font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]/60 ${
                    isActive ? "text-black" : "text-white/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterTab"
                      className="absolute inset-0 bg-white rounded-full shadow-[0_0_20px_rgba(143,208,255,0.35)]"
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
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search insights..."
              className="w-full min-h-10 pl-9 pr-8 text-[13px] sm:text-sm rounded-full bg-white/5 border border-white/12 text-white placeholder-white/40 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
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
          <span className="font-mono text-[11px] font-semibold tracking-[0.25em] uppercase text-[#38bdf8]">
            All Articles
          </span>
          <div className="flex-1 h-px bg-linear-to-r from-[#38bdf8]/35 to-transparent" />
        </div>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white/4 rounded-3xl border border-white/10 space-y-2">
            <p className="text-white/60 text-sm">
              No articles found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-white underline cursor-pointer hover:text-[#8fd0ff]"
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
                className="rounded-3xl sm:rounded-[26px] p-4 sm:p-5 border border-white/10 bg-linear-to-b from-white/6 to-white/2 backdrop-blur-xl shadow-[0_16px_40px_-18px_rgba(0,0,0,0.7)] hover:border-white/20 hover:shadow-[0_24px_50px_-18px_rgba(29,78,216,0.45)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
              >
                {/* Blue gradient accent top border on hover */}
                <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-[#38bdf8] via-[#8fd0ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl sm:rounded-t-[26px]" />

                {/* Top Section: Date, Title, Subtitle/Excerpt, Category Badge */}
                <div className="flex flex-col">
                  {/* Date */}
                  <span className="text-[11px] font-mono uppercase tracking-widest text-white/45">
                    {formatDate(post.publishedDate)}
                  </span>

                  {/* Title */}
                  <h3 className="font-sans text-xl sm:text-[22px] font-medium text-white group-hover:text-[#8fd0ff] transition-colors leading-[1.24] tracking-tight mt-2.5 mb-1.5 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Subtitle / Excerpt */}
                  <p className="text-sm text-white/60 leading-relaxed line-clamp-2 mb-3">
                    {post.summary}
                  </p>

                  {/* Category Pill & Read Time */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium border border-white/12 bg-white/5 text-white/80">
                      {post.category}
                    </span>
                    <span className="text-[11px] font-mono text-white/45">
                      {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Bottom Section: Article Image */}
                <div className="mt-4 overflow-hidden rounded-2xl aspect-16/11 bg-white/5 ring-1 ring-white/10">
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
