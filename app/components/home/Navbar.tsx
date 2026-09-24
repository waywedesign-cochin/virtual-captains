"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BookACallModal from "./BookACallModal";
import { ChevronDown, ArrowRight, ChevronRight, Newspaper, BookOpen } from "lucide-react";

export interface NavDropdownChild {
  label: string;
  href: string;
  description?: string;
  badge?: string;
  badgeColor?: "cyan" | "lime";
  iconType?: "news" | "blog";
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavDropdownChild[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "SalesX", href: "/salesx" },
  { label: "Programs", href: "/programs" },
  { label: "Organisations", href: "/organisations" },
  { label: "Individuals", href: "/individuals" },
  { label: "Partner with Us", href: "/partner" },
  {
    label: "Resources",
    href: "#",
    children: [
      {
        label: "Blogs & Perspectives",
        href: "/blogs",
        description: "Tactical sales frameworks & playbooks",
        badge: "INSIGHTS",
        badgeColor: "lime",
        iconType: "blog",
      },
      {
        label: "News & Updates",
        href: "/news-and-updates",
        description: "Company announcements & platform milestones",
        badge: "LATEST",
        badgeColor: "cyan",
        iconType: "news",
      },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const isLightPage = Boolean(
    pathname?.startsWith("/blog") || pathname?.startsWith("/blogs")
  );
  const [isSticky, setIsSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(true);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Scroll listener for sticky capsule state and top progress line
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;
      setScrollProgress(progress);
      setIsSticky(scrollY > 40);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const connectHref = pathname === "/contact" ? "#contact-form" : "/contact";

  const handleConnectClick = (e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    if (pathname === "/contact") {
      e.preventDefault();
      const el = document.getElementById("contact-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Top Segmented Scroll Progress Bar (EchoFi prog-wrap) */}
      <div
        className={`fixed top-0 left-0 right-0 z-60 pointer-events-none h-0.5 transition-opacity duration-200 ${
          scrollProgress > 0.005 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-full bg-linear-to-r from-[#38bdf8] via-[#e7ff3d] to-[#38bdf8] origin-left transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(231,255,61,0.5)]"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.4) 1px, transparent 1px, transparent 8px)",
          }}
        />
      </div>

      {/* Main Navigation Header (EchoFi .header-group) */}
      <header
        className={`fixed inset-x-0 top-0 z-50 pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isSticky ? "pt-3 sm:pt-4" : "pt-5 sm:pt-6"
        }`}
      >
        <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12 flex justify-center">
          {/*
            ECHOFI SIGNATURE MORPHING HEADER GRID (.header-grid):
            - In Top State: Spans full container width, transparent background, clean spacing
            - In Sticky State: Shrinks into a centered 656px capsule pill with blur(27px),
              containing Logo (left), 7 Page Dots (center), and CTA Button (right)
          */}
          <div
            className={`pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-between ${
              isSticky
                ? isLightPage
                  ? "w-full max-w-164 rounded-full bg-[#F9F8F6]/90 hover:bg-white/95 backdrop-blur-2xl border border-black/10 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.1),inset_0_1px_1.5px_0_rgba(255,255,255,0.8)] p-1.5 sm:p-2 px-3 sm:px-4 gap-2 sm:gap-5"
                  : "w-full max-w-164 rounded-full bg-linear-to-r from-white/[0.14] via-white/8 to-white/12 bg-[#14151a]/35 hover:bg-[#07080c]/85 hover:from-black/50 hover:via-[#0b0d13]/65 hover:to-black/50 backdrop-blur-2xl border border-white/20 hover:border-white/30 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.4),inset_0_1px_1.5px_0_rgba(255,255,255,0.3)] hover:shadow-[0_20px_45px_-6px_rgba(0,0,0,0.65),inset_0_1px_2px_0_rgba(255,255,255,0.25)] p-1.5 sm:p-2 px-3 sm:px-4 gap-2 sm:gap-5"
                : isLightPage
                  ? "w-full max-w-full rounded-full bg-[#F9F8F6]/85 backdrop-blur-xl border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] py-3 px-6 sm:px-8 gap-4 sm:gap-8"
                  : "w-full max-w-full rounded-full bg-transparent border border-transparent p-0 gap-4 sm:gap-8"
            }`}
          >
            {/* 1. LEFT: Virtual Captains Logo (.header-logo-wrap) */}
            <div
              className={`flex items-center justify-start shrink-0 transition-all duration-400 ${
                isSticky ? "pl-1 sm:pl-2" : "pl-0"
              }`}
            >
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center select-none group cursor-pointer"
                aria-label="Virtual Captains Home"
              >
                <Image
                  src="/wlogo.png"
                  alt="Virtual Captains"
                  width={140}
                  height={28}
                  className={`w-auto object-contain transition-all duration-400 group-hover:scale-102 ${
                    isSticky ? "h-4.5 sm:h-5.25" : "h-7 sm:h-8"
                  }`}
                  style={isLightPage ? { filter: "brightness(0)" } : undefined}
                  priority
                />
              </Link>
            </div>

            {/* 2. CENTER: Navigation Links / Dots (.header-links-wrap) */}
            {/* TOP STATE: Full Words for distinct pages (.header-links) */}
            {!isSticky && pathname !== '/individuals' && (
              <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8.5">
                {NAV_ITEMS.map((item) => {
                  const isChildActive = item.children?.some(
                    (child) => pathname === child.href || pathname.startsWith(child.href)
                  );
                  const isActive =
                    pathname === item.href ||
                    (item.href === "/partner" && pathname === "/partner-with-us") ||
                    Boolean(isChildActive);
                  const hasChildren = Boolean(item.children && item.children.length > 0);
                  const isOpen = activeDropdown === item.label;

                  if (hasChildren) {
                    return (
                      <div
                        key={item.label}
                        className="relative py-1 select-none"
                        onMouseEnter={() => handleDropdownEnter(item.label)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {/* Interactive Trigger Capsule with smooth hover glow */}
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(isOpen ? null : item.label)}
                          className={`group/trigger flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            isOpen
                              ? isLightPage
                                ? "bg-black/8 text-[#141414] border border-black/15 shadow-sm"
                                : "bg-white/12 text-white border border-white/20 shadow-[0_0_18px_rgba(56,189,248,0.22)]"
                              : isActive
                              ? isLightPage
                                ? "text-[#141414] font-semibold bg-blue-50/60 border border-blue-200/60 shadow-[0_1px_0_0_#1d4ed8]"
                                : "text-white font-medium bg-white/8 border border-white/15 shadow-[0_1px_0_0_#e7ff3d]"
                              : isLightPage
                              ? "text-[#555555] hover:text-[#1d4ed8] hover:bg-blue-50/50 border border-transparent"
                              : "text-white/70 hover:text-white hover:bg-white/6 border border-transparent"
                          }`}
                          aria-expanded={isOpen}
                          aria-label={`${item.label} menu`}
                        >
                          <span className="text-[13.5px] lg:text-[14px] tracking-[-0.01em]">
                            {item.label}
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
                              isOpen
                                ? "rotate-180 text-[#0284c7]"
                                : isLightPage
                                ? "text-[#737373] group-hover/trigger:text-[#1d4ed8]"
                                : "text-white/45 group-hover/trigger:text-white"
                            }`}
                          />
                        </button>

                        {/* Minimalist Ultra-Luxury Dropdown Menu Card */}
                        {isOpen && (
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 animate-in fade-in zoom-in-95 duration-200"
                            onMouseEnter={() => handleDropdownEnter(item.label)}
                            onMouseLeave={handleDropdownLeave}
                          >
                            {/* Invisible hover bridge to prevent premature closing */}
                            <div className="absolute -top-3 inset-x-0 h-3 pointer-events-auto" />

                            <div className={`w-85 sm:w-91.25 rounded-[22px] p-2 sm:p-2.5 relative overflow-hidden flex flex-col gap-1 ${
                              isLightPage
                                ? "bg-white/95 backdrop-blur-3xl border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                                : "bg-[#070913]/95 backdrop-blur-3xl border border-white/16 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.14),inset_0_1px_1.5px_rgba(255,255,255,0.25)]"
                            }`}>
                              {/* Glowing specular top edge highlight */}
                              <div className="absolute top-0 inset-x-8 h-px bg-linear-to-r from-transparent via-[#38bdf8] to-transparent opacity-80" />

                              {/* Ambient radial color glows */}
                              <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />
                              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#e7ff3d]/6 rounded-full blur-3xl pointer-events-none" />

                              {/* Dropdown Options */}
                              <div className="flex flex-col gap-1 relative z-10">
                                {item.children?.map((child) => {
                                  const isChildCurrent = pathname === child.href;
                                  const isLime = child.badgeColor === "lime";

                                  return (
                                    <Link
                                      key={child.label}
                                      href={child.href}
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setIsMobileMenuOpen(false);
                                      }}
                                      className={`group/child relative flex items-start gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-200 border ${
                                        isChildCurrent
                                          ? isLightPage
                                            ? "bg-blue-50/80 border-blue-200/80 shadow-xs"
                                            : "bg-white/12 border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                                          : isLightPage
                                          ? "hover:bg-blue-50/70 hover:border-blue-200/60 border-transparent hover:shadow-[0_2px_10px_rgba(29,78,216,0.06)]"
                                          : "hover:bg-white/8 hover:border-white/12 border-transparent"
                                      }`}
                                    >
                                      {/* Visual Glowing Icon Box */}
                                      <div
                                        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/child:scale-105 ${
                                          isLightPage
                                            ? "bg-black/4 border border-black/8 text-[#555] group-hover/child:bg-blue-100/70 group-hover/child:border-blue-300/80 group-hover/child:text-[#1d4ed8] group-hover/child:shadow-[0_0_12px_rgba(29,78,216,0.2)]"
                                            : isLime
                                            ? "bg-linear-to-br from-[#e7ff3d]/20 via-[#84cc16]/15 to-emerald-500/20 border border-[#e7ff3d]/40 text-[#e7ff3d] shadow-[0_0_12px_rgba(231,255,61,0.2)] group-hover/child:shadow-[0_0_18px_rgba(231,255,61,0.4)]"
                                            : "bg-linear-to-br from-[#1d4ed8]/35 via-[#0f67d6]/25 to-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.25)] group-hover/child:shadow-[0_0_18px_rgba(56,189,248,0.45)]"
                                        }`}
                                      >
                                        {child.iconType === "blog" ? (
                                          <BookOpen className={`w-5 h-5 transition-colors ${isLightPage ? "text-[#555] group-hover/child:text-[#1d4ed8]" : "text-[#e7ff3d]"}`} />
                                        ) : (
                                          <Newspaper className={`w-5 h-5 transition-colors ${isLightPage ? "text-[#555] group-hover/child:text-[#1d4ed8]" : "text-[#38bdf8]"}`} />
                                        )}
                                      </div>

                                      {/* Text & Metadata */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-2">
                                            <span
                                              className={`text-[13.5px] font-semibold tracking-tight transition-colors ${
                                                isLightPage
                                                  ? "text-[#141414] group-hover/child:text-[#1d4ed8]"
                                                  : isLime
                                                  ? "text-white group-hover/child:text-[#e7ff3d]"
                                                  : "text-white group-hover/child:text-[#38bdf8]"
                                              }`}
                                            >
                                              {child.label}
                                            </span>
                                            {child.badge && (
                                              <span
                                                className={`text-[8.5px] font-bold tracking-wider px-1.5 py-0.2 rounded-md uppercase border ${
                                                  isLightPage
                                                    ? child.iconType === "blog"
                                                      ? "bg-blue-50 border-blue-200 text-[#1d4ed8]"
                                                      : "bg-cyan-50 border-cyan-200 text-[#0284c7]"
                                                    : isLime
                                                    ? "bg-[#e7ff3d]/15 border-[#e7ff3d]/35 text-[#e7ff3d]"
                                                    : "bg-[#38bdf8]/15 border-[#38bdf8]/35 text-[#38bdf8]"
                                                }`}
                                              >
                                                {child.badge}
                                              </span>
                                            )}
                                          </div>
                                          <ArrowRight
                                            className={`w-4 h-4 transition-all duration-200 group-hover/child:translate-x-1 ${
                                              isLightPage
                                                ? "text-black/25 group-hover/child:text-[#1d4ed8]"
                                                : isLime
                                                ? "text-white/30 group-hover/child:text-[#e7ff3d]"
                                                : "text-white/30 group-hover/child:text-[#38bdf8]"
                                            }`}
                                          />
                                        </div>
                                        {child.description && (
                                          <p className={`text-[11px] transition-colors leading-relaxed mt-0.5 line-clamp-1 ${
                                            isLightPage
                                              ? "text-[#737373] group-hover/child:text-[#2563eb]"
                                              : "text-white/50 group-hover/child:text-white/80"
                                          }`}>
                                            {child.description}
                                          </p>
                                        )}
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`relative py-1 text-[13.5px] lg:text-[14px] tracking-[-0.01em] transition-colors duration-200 select-none ${
                        isActive
                          ? isLightPage
                            ? "text-[#141414] font-semibold shadow-[0_2px_0_0_#1d4ed8]"
                            : "text-white font-medium shadow-[0_1px_0_0_#e7ff3d]"
                          : isLightPage
                          ? "text-[#555555] hover:text-[#1d4ed8] font-normal"
                          : "text-white/65 hover:text-white font-normal"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* STICKY STATE: Exactly 7 Minimal Dots representing the 7 Pages (Desktop / Tablet only) */}
            {isSticky && (
              <nav
                className="hidden md:flex items-center justify-center gap-1 sm:gap-2 px-1"
                aria-label="Pages Navigation"
              >
                {NAV_ITEMS.map((item, index) => {
                  const isChildActive = item.children?.some(
                    (child) => pathname === child.href || pathname.startsWith(child.href)
                  );
                  const isActive =
                    pathname === item.href ||
                    (item.href === "/partner" && pathname === "/partner-with-us") ||
                    Boolean(isChildActive);
                  const isHovered = hoveredIndex === index;
                  const hasChildren = Boolean(item.children && item.children.length > 0);
                  const isOpen = activeDropdown === item.label;
                  const targetHref =
                    item.children && item.children.length > 0
                      ? item.children[0].href
                      : item.href;

                  if (hasChildren) {
                    return (
                      <div
                        key={item.label}
                        className="relative h-8 min-w-6 sm:min-w-7 flex items-center justify-center select-none"
                        onMouseEnter={() => {
                          setHoveredIndex(index);
                          handleDropdownEnter(item.label);
                        }}
                        onMouseLeave={() => {
                          setHoveredIndex(null);
                          handleDropdownLeave();
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(isOpen ? null : item.label)}
                          className="h-full w-full flex items-center justify-center cursor-pointer group"
                          aria-expanded={isOpen}
                          aria-label={`${item.label} menu`}
                        >
                          {/* Minimal Dot (.header-link-dot) */}
                          <span
                            className={`block rounded-full transition-all duration-200 ${
                              isOpen
                                ? isLightPage
                                  ? "h-2 w-2 bg-[#0284c7] scale-125 shadow-[0_0_10px_rgba(2,132,199,0.9)]"
                                  : "h-2 w-2 bg-[#38bdf8] scale-125 shadow-[0_0_10px_rgba(56,189,248,0.95)]"
                                : isHovered
                                ? isLightPage
                                  ? "h-1.75 w-1.75 bg-[#141414] scale-125 shadow-[0_0_8px_rgba(0,0,0,0.4)]"
                                  : "h-1.75 w-1.75 bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.95)]"
                                : isActive
                                ? isLightPage
                                  ? "h-1.5 w-1.5 bg-[#0284c7] shadow-[0_0_8px_rgba(2,132,199,0.8)]"
                                  : "h-1.5 w-1.5 bg-[#e7ff3d] shadow-[0_0_8px_rgba(231,255,61,0.9)]"
                                : isLightPage
                                ? "h-1.25 w-1.25 bg-black/35 group-hover:bg-black/75 group-hover:scale-120"
                                : "h-1.25 w-1.25 bg-white/45 group-hover:bg-white/85 group-hover:scale-120"
                            }`}
                          />
                        </button>

                        {/* Tooltip Pill Badge on Hover (only when dropdown is closed) */}
                        {isHovered && !isOpen && (
                          <span className={`absolute -bottom-9 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[11px] font-medium shadow-2xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 pointer-events-none z-30 ${
                            isLightPage
                              ? "border border-black/10 bg-white text-[#141414]"
                              : "border border-white/15 bg-[#0a0c10]/95 backdrop-blur-xl text-white"
                          }`}>
                            {item.label}
                          </span>
                        )}

                        {/* Sticky State Dropdown Menu Card */}
                        {isOpen && (
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 animate-in fade-in zoom-in-95 duration-200"
                            onMouseEnter={() => handleDropdownEnter(item.label)}
                            onMouseLeave={handleDropdownLeave}
                          >
                            {/* Hover bridge to prevent closing while moving mouse down */}
                            <div className="absolute -top-3 inset-x-0 h-3 pointer-events-auto" />

                            <div className={`w-[320px] sm:w-87.5 rounded-[22px] p-2 sm:p-2.5 relative overflow-hidden flex flex-col gap-1 ${
                              isLightPage
                                ? "bg-white/95 backdrop-blur-3xl border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                                : "bg-[#070913]/95 backdrop-blur-3xl border border-white/16 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.14),inset_0_1px_1.5px_rgba(255,255,255,0.25)]"
                            }`}>
                              {/* Glowing specular top edge highlight */}
                              <div className="absolute top-0 inset-x-8 h-px bg-linear-to-r from-transparent via-[#38bdf8] to-transparent opacity-80" />

                              {/* Ambient radial color glows */}
                              <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />
                              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#e7ff3d]/6 rounded-full blur-3xl pointer-events-none" />

                              {/* Header label */}
                              <div className="px-3 pt-1 pb-0.5 text-[10px] font-mono uppercase tracking-wider text-[#A4A4A4]">
                                Resources
                              </div>

                              {/* Dropdown Options */}
                              <div className="flex flex-col gap-1 relative z-10">
                                {item.children?.map((child) => {
                                  const isChildCurrent = pathname === child.href;
                                  const isLime = child.badgeColor === "lime";

                                  return (
                                    <Link
                                      key={child.label}
                                      href={child.href}
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        setIsMobileMenuOpen(false);
                                      }}
                                      className={`group/child relative flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 border ${
                                        isChildCurrent
                                          ? isLightPage
                                            ? "bg-blue-50/80 border-blue-200/80 shadow-xs"
                                            : "bg-white/12 border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                                          : isLightPage
                                          ? "hover:bg-blue-50/70 hover:border-blue-200/60 border-transparent hover:shadow-[0_2px_10px_rgba(29,78,216,0.06)]"
                                          : "hover:bg-white/8 hover:border-white/12 border-transparent"
                                      }`}
                                    >
                                      {/* Visual Glowing Icon Box */}
                                      <div
                                        className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/child:scale-105 ${
                                          isLightPage
                                            ? "bg-black/4 border border-black/8 text-[#555] group-hover/child:bg-blue-100/70 group-hover/child:border-blue-300/80 group-hover/child:text-[#1d4ed8] group-hover/child:shadow-[0_0_12px_rgba(29,78,216,0.2)]"
                                            : isLime
                                            ? "bg-linear-to-br from-[#e7ff3d]/20 via-[#84cc16]/15 to-emerald-500/20 border border-[#e7ff3d]/40 text-[#e7ff3d] shadow-[0_0_12px_rgba(231,255,61,0.2)] group-hover/child:shadow-[0_0_18px_rgba(231,255,61,0.4)]"
                                            : "bg-linear-to-br from-[#1d4ed8]/35 via-[#0f67d6]/25 to-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.25)] group-hover/child:shadow-[0_0_18px_rgba(56,189,248,0.45)]"
                                        }`}
                                      >
                                        {child.iconType === "blog" ? (
                                          <BookOpen className={`w-4.5 h-4.5 transition-colors ${isLightPage ? "text-[#555] group-hover/child:text-[#1d4ed8]" : "text-[#e7ff3d]"}`} />
                                        ) : (
                                          <Newspaper className={`w-4.5 h-4.5 transition-colors ${isLightPage ? "text-[#555] group-hover/child:text-[#1d4ed8]" : "text-[#38bdf8]"}`} />
                                        )}
                                      </div>

                                      {/* Text & Metadata */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-2">
                                            <span
                                              className={`text-[13px] font-semibold tracking-tight transition-colors ${
                                                isLightPage
                                                  ? "text-[#141414] group-hover/child:text-[#1d4ed8]"
                                                  : isLime
                                                  ? "text-white group-hover/child:text-[#e7ff3d]"
                                                  : "text-white group-hover/child:text-[#38bdf8]"
                                              }`}
                                            >
                                              {child.label}
                                            </span>
                                            {child.badge && (
                                              <span
                                                className={`text-[8.5px] font-bold tracking-wider px-1.5 py-0.2 rounded-md uppercase border ${
                                                  isLightPage
                                                    ? child.iconType === "blog"
                                                      ? "bg-blue-50 border-blue-200 text-[#1d4ed8]"
                                                      : "bg-cyan-50 border-cyan-200 text-[#0284c7]"
                                                    : isLime
                                                    ? "bg-[#e7ff3d]/15 border-[#e7ff3d]/35 text-[#e7ff3d]"
                                                    : "bg-[#38bdf8]/15 border-[#38bdf8]/35 text-[#38bdf8]"
                                                }`}
                                              >
                                                {child.badge}
                                              </span>
                                            )}
                                          </div>
                                          <ArrowRight
                                            className={`w-3.5 h-3.5 transition-all duration-200 group-hover/child:translate-x-1 ${
                                              isLightPage
                                                ? "text-black/25 group-hover/child:text-[#1d4ed8]"
                                                : "text-white/35 group-hover/child:text-white"
                                            }`}
                                          />
                                        </div>
                                        <p
                                          className={`text-[11px] leading-relaxed line-clamp-1 mt-0.5 transition-colors ${
                                            isLightPage ? "text-[#737373] group-hover/child:text-[#2563eb]" : "text-white/55"
                                          }`}
                                        >
                                          {child.description}
                                        </p>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={targetHref}
                      onClick={() => setIsMobileMenuOpen(false)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="relative h-8 min-w-6 sm:min-w-7 flex items-center justify-center select-none cursor-pointer group"
                      aria-label={item.label}
                    >
                      {/* Minimal Dot (.header-link-dot) */}
                      <span
                        className={`block rounded-full transition-all duration-200 ${
                          isHovered
                            ? isLightPage
                              ? "h-1.75 w-1.75 bg-[#1d4ed8] scale-125 shadow-[0_0_8px_rgba(29,78,216,0.6)]"
                              : "h-1.75 w-1.75 bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.95)]"
                            : isActive
                              ? isLightPage
                                ? "h-1.5 w-1.5 bg-[#1d4ed8] shadow-[0_0_8px_rgba(29,78,216,0.8)]"
                                : "h-1.5 w-1.5 bg-[#e7ff3d] shadow-[0_0_8px_rgba(231,255,61,0.9)]"
                              : isLightPage
                              ? "h-1.25 w-1.25 bg-black/35 group-hover:bg-[#1d4ed8] group-hover:scale-120"
                              : "h-1.25 w-1.25 bg-white/45 group-hover:bg-white/85 group-hover:scale-120"
                        }`}
                      />

                      {/* Tooltip Pill Badge on Hover */}
                      {isHovered && (
                        <span className={`absolute -bottom-9 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[11px] font-medium shadow-2xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 pointer-events-none z-30 ${
                          isLightPage
                            ? "border border-blue-200/80 bg-white text-[#1d4ed8] shadow-md"
                            : "border border-white/15 bg-[#0a0c10]/95 backdrop-blur-xl text-white"
                        }`}>
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* 3. RIGHT: "CONNECT" Button + Mobile Toggle (.header-cta-wrap) */}
            <div className="flex items-center justify-end shrink-0 gap-2 sm:gap-3">
              {/* TOP STATE BUTTON: Solid Dark Glass Pill (.btn) */}
              {!isSticky && (
                <Link
                  href={connectHref}
                  onClick={handleConnectClick}
                  className={`hidden sm:inline-flex items-center justify-center rounded-full px-5 py-2 text-[12px] xl:text-[13px] font-semibold tracking-[0.02em] transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98 ${
                    isLightPage
                      ? "bg-linear-to-r from-[#1d4ed8] via-[#2563eb] to-[#0ea5e9] hover:brightness-110 text-white shadow-[0_4px_16px_rgba(29,78,216,0.35)] hover:shadow-[0_6px_22px_rgba(29,78,216,0.5)] border border-white/20"
                      : "bg-linear-to-r from-[#8fd0ff]/70 via-[#0f67d6]/95 to-[#0c5df5] hover:brightness-110 border border-white/15 hover:border-white/30 text-white shadow-[0_4px_16px_rgba(15,103,214,0.3)]"
                  }`}
                >
                  LET'S CONNECT
                </Link>
              )}

              {/* STICKY STATE BUTTON: Vibrant Glow Button */}
              {isSticky && (
                <Link
                  href={connectHref}
                  onClick={handleConnectClick}
                  className={`inline-flex items-center justify-center rounded-full px-3 sm:px-4.5 py-1.5 text-[11px] sm:text-[12px] font-bold tracking-[0.02em] transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98 shrink-0 ${
                    isLightPage
                      ? "bg-linear-to-r from-[#1d4ed8] via-[#2563eb] to-[#0ea5e9] hover:brightness-110 text-white shadow-[0_4px_14px_rgba(29,78,216,0.35)] hover:shadow-[0_4px_18px_rgba(29,78,216,0.5)] border border-white/15"
                      : "bg-[#e7ff3d] hover:bg-[#d8f030] text-[#0a0b0d] shadow-[0_0_16px_rgba(231,255,61,0.4)]"
                  }`}
                >
                  <span className="hidden sm:inline">LET'S CONNECT</span>
                  <span className="sm:hidden">CONNECT</span>
                </Link>
              )}

              {/* Mobile Hamburger Toggle (Always available on mobile screens) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden relative flex items-center justify-center rounded-full transition-all cursor-pointer shrink-0 ${
                  isLightPage
                    ? "border border-black/15 bg-black/5 text-[#141414] hover:bg-black/10"
                    : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                } ${isSticky ? "h-8 w-8" : "h-10 w-10"}`}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <div
                  className={`relative w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                    isMobileMenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  {/* Center dot */}
                  <span
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-all duration-300 ${
                      isLightPage ? "bg-[#141414]" : "bg-white"
                    } ${
                      isMobileMenuOpen
                        ? "opacity-100 scale-100"
                        : "opacity-100"
                    }`}
                  />
                  {/* Outer dots */}
                  <span
                    className={`absolute w-1 h-1 rounded-full transition-all duration-300 ${
                      isLightPage ? "bg-[#141414]" : "bg-white"
                    } ${
                      isMobileMenuOpen
                        ? "top-0 left-0"
                        : "top-1/2 left-0 -translate-y-1/2"
                    }`}
                  />
                  <span
                    className={`absolute w-1 h-1 rounded-full transition-all duration-300 ${
                      isLightPage ? "bg-[#141414]" : "bg-white"
                    } ${
                      isMobileMenuOpen
                        ? "top-0 right-0"
                        : "top-0 left-1/2 -translate-x-1/2"
                    }`}
                  />
                  <span
                    className={`absolute w-1 h-1 rounded-full transition-all duration-300 ${
                      isLightPage ? "bg-[#141414]" : "bg-white"
                    } ${
                      isMobileMenuOpen
                        ? "bottom-0 left-0"
                        : "bottom-0 left-1/2 -translate-x-1/2"
                    }`}
                  />
                  <span
                    className={`absolute w-1 h-1 rounded-full transition-all duration-300 ${
                      isLightPage ? "bg-[#141414]" : "bg-white"
                    } ${
                      isMobileMenuOpen
                        ? "bottom-0 right-0"
                        : "top-1/2 right-0 -translate-y-1/2"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer (Accessible in both top and sticky states) */}
        {isMobileMenuOpen && (
          <div
            className={`lg:hidden absolute inset-x-4 rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-300 pointer-events-auto z-50 ${
              isLightPage
                ? "bg-[#F9F8F6]/95 backdrop-blur-2xl border border-black/10 text-[#141414]"
                : "bg-[#0d0e12]/95 backdrop-blur-2xl border border-white/12 text-white"
            } ${isSticky ? "top-full mt-3 max-w-md mx-auto" : "top-full mt-2"}`}
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isChildActive = item.children?.some(
                  (child) => pathname === child.href || pathname.startsWith(child.href)
                );
                const isActive =
                  pathname === item.href ||
                  (item.href === "/partner" && pathname === "/partner-with-us") ||
                  Boolean(isChildActive);
                const hasChildren = Boolean(item.children && item.children.length > 0);

                if (hasChildren) {
                  return (
                    <div
                      key={item.label}
                      className={`flex flex-col rounded-2xl overflow-hidden transition-all duration-300 border ${
                        isLightPage
                          ? "bg-black/3 border-black/8"
                          : "bg-white/4 border-white/10"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setIsMobileResourcesOpen(!isMobileResourcesOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 text-[14px] font-medium transition-colors cursor-pointer text-left"
                        aria-expanded={isMobileResourcesOpen}
                      >
                        <span
                          className={`font-semibold tracking-tight ${
                            isActive
                              ? isLightPage ? "text-[#0284c7]" : "text-[#e7ff3d]"
                              : isLightPage ? "text-[#141414] hover:text-black" : "text-white/90 hover:text-white"
                          }`}
                        >
                          {item.label}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isMobileResourcesOpen
                              ? isLightPage ? "rotate-180 text-[#0284c7]" : "rotate-180 text-[#38bdf8]"
                              : isLightPage ? "text-black/40" : "text-white/60"
                          }`}
                        />
                      </button>

                      {isMobileResourcesOpen && (
                        <div className={`px-2.5 pb-2.5 flex flex-col gap-2 pt-1 border-t animate-in fade-in duration-200 ${
                          isLightPage ? "border-black/6" : "border-white/6"
                        }`}>
                          {item.children?.map((child) => {
                            const isChildCurrent = pathname === child.href;
                            const isLime = child.badgeColor === "lime";

                            return (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all border ${
                                  isChildCurrent
                                    ? isLightPage
                                      ? "bg-black/6 border-black/10 shadow-sm"
                                      : "bg-white/12 border-white/20 shadow-sm"
                                    : isLightPage
                                    ? "bg-black/2 hover:bg-black/5 border-black/5"
                                    : "bg-black/30 hover:bg-white/8 border-white/6"
                                }`}
                              >
                                <div
                                  className={`shrink-0 w-9.5 h-9.5 rounded-lg flex items-center justify-center ${
                                    isLime
                                      ? "bg-linear-to-br from-[#e7ff3d]/20 to-emerald-500/20 border border-[#e7ff3d]/40"
                                      : "bg-linear-to-br from-[#1d4ed8]/35 to-[#38bdf8]/20 border border-[#38bdf8]/40"
                                  }`}
                                >
                                  {child.iconType === "blog" ? (
                                    <BookOpen className="w-4.5 h-4.5 text-[#e7ff3d]" />
                                  ) : (
                                    <Newspaper className="w-4.5 h-4.5 text-[#38bdf8]" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`text-[13px] font-semibold ${
                                        isLightPage ? "text-[#141414]" : "text-white"
                                      }`}>
                                        {child.label}
                                      </span>
                                      {child.badge && (
                                        <span
                                          className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded uppercase border ${
                                            isLime
                                              ? "bg-[#e7ff3d]/15 border-[#e7ff3d]/35 text-[#e7ff3d]"
                                              : "bg-[#38bdf8]/15 border-[#38bdf8]/35 text-[#38bdf8]"
                                          }`}
                                        >
                                          {child.badge}
                                        </span>
                                      )}
                                    </div>
                                    <ArrowRight
                                      className={`w-3.5 h-3.5 ${
                                        isLime ? "text-[#e7ff3d]" : "text-[#38bdf8]"
                                      }`}
                                    />
                                  </div>
                                  {child.description && (
                                    <p className={`text-[11px] mt-0.5 line-clamp-1 ${
                                      isLightPage ? "text-[#737373]" : "text-white/50"
                                    }`}>
                                      {child.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-[14px] font-medium transition-colors ${
                      isActive
                        ? isLightPage
                          ? "bg-black/[0.07] text-[#141414] font-semibold"
                          : "bg-white/10 text-[#e7ff3d]"
                        : isLightPage
                        ? "text-[#555555] hover:bg-black/4 hover:text-[#141414]"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isLightPage ? "text-black/25" : "text-white/30"}`} />
                  </Link>
                );
              })}

              <div className="pt-2">
                <Link
                  href={connectHref}
                  onClick={handleConnectClick}
                  className={`w-full flex items-center justify-center rounded-xl py-3 text-center text-[13px] font-bold cursor-pointer transition-all ${
                    isLightPage
                      ? "bg-linear-to-r from-[#1d4ed8] via-[#2563eb] to-[#0ea5e9] hover:brightness-110 text-white shadow-[0_4px_16px_rgba(29,78,216,0.35)]"
                      : "bg-[#e7ff3d] hover:bg-[#d8f030] text-[#0a0b0d] shadow-[0_0_20px_rgba(231,255,61,0.35)]"
                  }`}
                >
                  LET'S CONNECT
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Book A Call Modal Dialog */}
      <BookACallModal
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}
