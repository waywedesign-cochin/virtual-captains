import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Clock,
  Calendar,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/sanity/lib/types";
import { CTASection } from "./CTASection";

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.94 0-1.7.76-1.7 1.7 0 .95.76 1.71 1.7 1.71s1.71-.76 1.71-1.71c0-.94-.77-1.7-1.71-1.7Z" />
  </svg>
);

interface BlogSlugPageProps {
  post: BlogPost;
  recentPosts: BlogPost[];
  onNavigateBack: () => void;
  onSelectPost: (slug: string) => void;
  onBookCall: () => void;
}

export const BlogSlugPage: React.FC<BlogSlugPageProps> = ({
  post,
  recentPosts,
  onNavigateBack,
  onSelectPost,
  onBookCall,
}) => {
  const [copied, setCopied] = useState(false);

  // Scroll to top when post changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [post.slug]);

  const recentBlogs = recentPosts;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`"${post.title}" via Virtual Captains`);
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
    );
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
    );
  };

  return (
    <article className="w-full pb-16">
      {/* Breadcrumb */}
      <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-4">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#737373] hover:text-[#1d4ed8] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#1d4ed8]" />
          <span>Back to all articles</span>
        </button>
      </div>

      {/* ── Two-column layout (desktop) ── */}
      <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 py-4 flex gap-10 xl:gap-14 items-start">
        {/* ── LEFT: Main article content ── */}
        <div className="min-w-0 flex-1">
          {/* Header Lockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Category + read time row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-[#1d4ed8] to-[#0369a1] text-white shadow-[0_2px_10px_rgba(29,78,216,0.25)]">
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#737373]">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#737373]">
                <Calendar className="w-3 h-3" />
                {formatDate(post.publishedDate)}
              </span>
            </div>

            {/* Main Title — last word gets blue gradient */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.12]">
              <span className="text-[#141414]">
                {post.title.split(" ").slice(0, -2).join(" ")}{" "}
              </span>
              <span className="bg-linear-to-r from-[#1d4ed8] via-[#0369a1] to-[#141414] bg-clip-text text-transparent">
                {post.title.split(" ").slice(-2).join(" ")}
              </span>
            </h1>

            {/* Author metadata */}
            <div className="flex items-center gap-3.5 pt-2 pb-5">
              <div className="relative w-10 h-10 shrink-0">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#1d4ed8]/20"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-linear-to-br from-[#1d4ed8] to-[#0369a1] border-2 border-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#141414]">
                  {post.author.name}
                </p>
                <p className="text-xs text-[#737373]">{post.author.role}</p>
              </div>
              <div className="h-8 w-px bg-linear-to-b from-transparent via-[#1d4ed8]/30 to-transparent" />
              <div className="text-right">
                <p className="text-xs font-medium text-[#737373]">
                  {formatDate(post.publishedDate)}
                </p>
                <p className="text-[11px] font-mono text-[#A4A4A4] uppercase tracking-wider">
                  {post.readTime}
                </p>
              </div>
            </div>
            {/* Gradient divider */}
            <div className="h-px bg-linear-to-r from-[#1d4ed8]/30 via-[#0ea5e9]/15 to-transparent -mt-4" />
          </motion.div>

          {/* Featured Banner Image — with blue ambient glow */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-6"
          >
            {/* Soft blue glow behind image */}
            <div className="absolute -inset-3 rounded-[36px] bg-linear-to-br from-[#1d4ed8]/10 via-[#0ea5e9]/6 to-transparent blur-xl pointer-events-none" />
            <div className="relative overflow-hidden rounded-3xl sm:rounded-4xl bg-[#F2EFE9] border border-[#1d4ed8]/10 shadow-[0_8px_40px_rgba(29,78,216,0.08)] aspect-video ring-1 ring-[#1d4ed8]/8">
              <img
                src={post.bannerImage || post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Article Prose */}
          <div className="space-y-8 text-[#333333] pt-8 leading-[1.85]">
            {/* Lead Paragraph — with subtle blue left accent */}
            {post.content?.lead && (
              <div className="flex gap-4">
                <div className="w-1 shrink-0 rounded-full bg-linear-to-b from-[#1d4ed8] to-[#0ea5e9]/30 mt-1 mb-1" />
                <p className="text-lg sm:text-xl md:text-2xl text-[#141414] font-serif leading-relaxed font-normal">
                  {post.content.lead}
                </p>
              </div>
            )}

            {/* Dynamic Content Sections */}
            {post.content?.sections?.map((section, idx: number) => (
              <div key={idx} className="space-y-4 pt-2">
                {section.heading && (
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight pt-6 pb-1 bg-linear-to-r from-[#141414] via-[#1d4ed8] to-[#141414] bg-clip-text text-transparent">
                    {section.heading}
                  </h2>
                )}

                {section.paragraphs.map((para: string, pIdx: number) => (
                  <p
                    key={pIdx}
                    className="text-base sm:text-lg text-[#444444] leading-[1.85] font-normal"
                  >
                    {para}
                  </p>
                ))}

                {/* Bullet list */}
                {section.listItems && section.listItems.length > 0 && (
                  <ul className="space-y-3 my-5 pl-2">
                    {section.listItems.map((item: string, lIdx: number) => (
                      <li
                        key={lIdx}
                        className="flex items-start gap-3 text-base sm:text-lg text-[#444444] leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8] mt-3 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Callout quote/box */}
                {section.note && (
                  <div className="p-6 sm:p-7 rounded-2xl bg-white border border-black/6 border-l-4 border-l-[#1d4ed8] shadow-[0_8px_30px_rgb(0,0,0,0.04)] my-6">
                    <p className="text-sm sm:text-base text-[#141414] italic leading-relaxed font-serif">
                      "{section.note}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Social Sharing Row */}
          <div className="pt-10 mt-8 border-t border-black/6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm font-semibold bg-linear-to-r from-[#1d4ed8] to-[#0369a1] bg-clip-text text-transparent">
              Liked it? Share it with your people
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareX}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-100 border border-black/6 text-xs font-medium text-[#141414] transition-colors cursor-pointer shadow-sm"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
                <span>Share on X</span>
              </button>

              <button
                onClick={handleShareLinkedIn}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-100 border border-black/6 text-xs font-medium text-[#141414] transition-colors cursor-pointer shadow-sm"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-100 border border-black/6 text-xs font-medium text-[#141414] transition-colors cursor-pointer shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sticky "Recent Articles" sidebar (desktop only) ── */}
        <aside className="hidden xl:block w-[320px] shrink-0 sticky top-28 self-start">
          {/* Sidebar header */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] font-bold tracking-widest uppercase bg-linear-to-r from-[#1d4ed8] to-[#0369a1] bg-clip-text text-transparent">
              Recent Articles
            </span>
            <div className="flex-1 h-px bg-linear-to-r from-[#1d4ed8]/30 to-transparent" />
          </div>

          {recentBlogs.length > 0 ? (
            <div className="flex flex-col gap-4">
              {recentBlogs.map((recent) => (
                <Link
                  key={recent._id}
                  href={`/blogs/${recent.slug}`}
                  className="group flex gap-3.5 p-3.5 rounded-2xl bg-white border border-black/5 hover:border-[#1d4ed8]/20 hover:shadow-[0_4px_20px_rgba(29,78,216,0.08)] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-[#1d4ed8] to-[#0ea5e9] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                  <div className="shrink-0 w-20 h-16 rounded-xl overflow-hidden bg-[#F2EFE9]">
                    <img
                      src={recent.image}
                      alt={recent.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/5 text-[#555] inline-block mb-1">
                        {recent.category}
                      </span>
                      <h4 className="text-[13px] font-semibold text-[#141414] leading-snug line-clamp-2 group-hover:text-[#1d4ed8] transition-colors">
                        {recent.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#A4A4A4] font-mono mt-1.5">
                      {recent.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center gap-2 py-10 px-5 rounded-2xl bg-white border border-dashed border-black/10">
              <span className="text-2xl">📝</span>
              <p className="text-xs font-medium text-[#737373]">
                More articles coming soon
              </p>
            </div>
          )}

          {/* View all link */}
          <Link
            href="/blogs"
            className="mt-5 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-black/[0.07] text-xs font-semibold text-[#555] hover:text-[#1d4ed8] hover:border-[#1d4ed8]/30 transition-all group"
          >
            <span>View all articles</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </aside>
      </div>

      {/* ── Mobile-only: Recent Articles below article ── */}
      <section className="xl:hidden w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 mt-16 mb-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] font-bold tracking-widest uppercase bg-linear-to-r from-[#1d4ed8] to-[#0369a1] bg-clip-text text-transparent">
            Recent Articles
          </span>
          <div className="flex-1 h-px bg-linear-to-r from-[#1d4ed8]/30 to-transparent" />
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#737373] hover:text-[#141414] transition-colors"
          >
            <span>View all</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {recentBlogs.slice(0, 3).map((recent) => (
            <Link
              key={recent._id}
              href={`/blogs/${recent.slug}`}
              data-cursor="read"
              data-cursor-text="Read article"
              className="bg-white rounded-3xl sm:rounded-[26px] p-4 sm:p-5 border border-black/5 shadow-[0_10px_25px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-[#1d4ed8] via-[#0ea5e9] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl sm:rounded-t-[26px]" />

              {/* Top Section */}
              <div className="flex flex-col">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#8c8c8c]">
                  {formatDate(recent.publishedDate)}
                </span>

                <h4 className="font-serif text-xl sm:text-[22px] font-normal text-[#141414] group-hover:text-[#1d4ed8] transition-colors leading-[1.24] tracking-tight mt-2.5 mb-1.5 line-clamp-2">
                  {recent.title}
                </h4>

                <p className="text-xs sm:text-[13px] text-[#666666] leading-relaxed line-clamp-2 mb-3">
                  {recent.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#F0EDE8] text-[#141414]">
                    {recent.category}
                  </span>
                  <span className="text-[11px] font-mono text-[#999999]">
                    {recent.readTime}
                  </span>
                </div>
              </div>

              {/* Bottom Section: Image */}
              <div className="mt-4 overflow-hidden rounded-2xl aspect-16/11 bg-[#F2EFE9] ring-1 ring-black/4">
                <img
                  src={recent.image}
                  alt={recent.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Subscribe Section */}
      <section className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 mb-24">
        <div className="bg-white rounded-[28px] sm:rounded-4xl p-8 sm:p-12 relative overflow-hidden border border-black/5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)]">
          {/* Subtle blue accent in the corner */}
          <div className="absolute top-0 right-0 w-100 h-100 bg-linear-to-bl from-[#e0e7ff] via-transparent to-transparent opacity-60 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
            <div className="max-w-xl">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#141414]">
                Get more insights in your inbox
              </h3>
            </div>

            <div className="w-full md:w-auto shrink-0">
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative flex-1 sm:w-72">
                  <Mail className="w-4 h-4 text-[#A4A4A4] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-[#F9F8F6] border border-black/6 rounded-full py-3.5 pl-11 pr-4 text-sm text-[#141414] placeholder-[#A4A4A4] focus:outline-none focus:border-[#1d4ed8] focus:bg-white transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-linear-to-r from-[#1d4ed8] to-[#0369a1] hover:from-[#2563eb] hover:to-[#0284c7] text-white text-sm font-semibold rounded-full shadow-[0_4px_14px_rgba(29,78,216,0.2)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection onBookCall={onBookCall} />
    </article>
  );
};
