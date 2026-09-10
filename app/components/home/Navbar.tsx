"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BookACallModal from "./BookACallModal";

export const NAV_ITEMS = [
  { label: "About", href: "/about" },
  { label: "SalesX", href: "/salesx" },
  { label: "Programs", href: "/programs" },
  { label: "Organisations", href: "/organisations" },
  { label: "Individuals", href: "/individuals" },
  { label: "Partner", href: "/partner" },
  { label: "Resources", href: "/resources" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

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

  return (
    <>
      {/* Top Segmented Scroll Progress Bar (EchoFi prog-wrap) */}
      <div className="fixed top-0 left-0 right-0 z-60 pointer-events-none h-0.5">
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
                ? "w-full max-w-164 rounded-full bg-linear-to-r from-white/[0.14] via-white/8 to-white/12 bg-[#14151a]/35 hover:bg-[#07080c]/85 hover:from-black/50 hover:via-[#0b0d13]/65 hover:to-black/50 backdrop-blur-2xl border border-white/20 hover:border-white/30 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.4),inset_0_1px_1.5px_0_rgba(255,255,255,0.3)] hover:shadow-[0_20px_45px_-6px_rgba(0,0,0,0.65),inset_0_1px_2px_0_rgba(255,255,255,0.25)] p-2 gap-3 sm:gap-5"
                : "w-full max-w-full rounded-full bg-transparent border border-transparent p-0 gap-4 sm:gap-8"
            }`}
          >
            {/* 1. LEFT: Virtual Captains Logo (.header-logo-wrap) */}
            <div
              className={`flex items-center justify-start shrink-0 transition-all duration-400 ${
                isSticky ? "pl-3 sm:pl-3.5" : "pl-0"
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
                    isSticky ? "h-4.75 sm:h-5.25" : "h-7 sm:h-8"
                  }`}
                  priority
                />
              </Link>
            </div>

            {/* 2. CENTER: Navigation Links / Dots (.header-links-wrap) */}
            {/* TOP STATE: Full Words for distinct pages (.header-links) */}
            {!isSticky && (
              <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`relative py-1 text-[13.5px] lg:text-[14px] tracking-[-0.01em] transition-colors duration-200 select-none ${
                        isActive
                          ? "text-white font-medium shadow-[0_1px_0_0_#e7ff3d]"
                          : "text-white/65 hover:text-white font-normal"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* STICKY STATE: Exactly 7 Minimal Dots representing the 7 Pages */}
            {isSticky && (
              <nav
                className="flex items-center justify-center gap-1 sm:gap-2 px-1"
                aria-label="Pages Navigation"
              >
                {NAV_ITEMS.map((item, index) => {
                  const isActive = pathname === item.href;
                  const isHovered = hoveredIndex === index;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
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
                            ? "h-1.75 w-1.75 bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.95)]"
                            : isActive
                              ? "h-1.5 w-1.5 bg-[#e7ff3d] shadow-[0_0_8px_rgba(231,255,61,0.9)]"
                              : "h-1.25 w-1.25 bg-white/45 group-hover:bg-white/85 group-hover:scale-120"
                        }`}
                      />

                      {/* Tooltip Pill Badge on Hover */}
                      {isHovered && (
                        <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-[#0a0c10]/95 backdrop-blur-xl px-2.5 py-0.5 text-[11px] font-medium text-white shadow-2xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 pointer-events-none z-30">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* 3. RIGHT: "BOOK A CALL" Button + Mobile Toggle (.header-cta-wrap) */}
            <div className="flex items-center justify-end shrink-0 gap-2 sm:gap-3">
              {/* TOP STATE BUTTON: Solid Dark Glass Pill (.btn) */}
              {!isSticky && (
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#111217] hover:bg-[#181920] border border-white/14 hover:border-white/28 px-5 py-2 text-[12px] xl:text-[13px] font-semibold text-white tracking-[0.02em] shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98"
                >
                  BOOK A CALL
                </button>
              )}

              {/* STICKY STATE BUTTON: Vibrant Glow Button */}
              {isSticky && (
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="inline-flex items-center justify-center rounded-full bg-[#e7ff3d] hover:bg-[#d8f030] px-3.5 sm:px-4.5 py-1.5 text-[11px] sm:text-[12px] font-bold text-[#0a0b0d] tracking-[0.02em] shadow-[0_0_16px_rgba(231,255,61,0.4)] transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98 shrink-0"
                >
                  <span className="hidden sm:inline">BOOK A CALL</span>
                  <span className="sm:hidden">BOOK</span>
                </button>
              )}

              {/* Mobile Hamburger Toggle */}
              {!isSticky && (
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/4 text-white transition-colors hover:bg-white/10 cursor-pointer"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <div
                    className={`relative w-4 h-4 transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                      isMobileMenuOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    {/* Center dot */}
                    <span
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white transition-all duration-300 ${
                        isMobileMenuOpen
                          ? "opacity-100 scale-100"
                          : "opacity-100"
                      }`}
                    />
                    {/* Outer dots */}
                    <span
                      className={`absolute w-1 h-1 rounded-full bg-white transition-all duration-300 ${
                        isMobileMenuOpen
                          ? "top-0 left-0"
                          : "top-1/2 left-0 -translate-y-1/2"
                      }`}
                    />
                    <span
                      className={`absolute w-1 h-1 rounded-full bg-white transition-all duration-300 ${
                        isMobileMenuOpen
                          ? "top-0 right-0"
                          : "top-0 left-1/2 -translate-x-1/2"
                      }`}
                    />
                    <span
                      className={`absolute w-1 h-1 rounded-full bg-white transition-all duration-300 ${
                        isMobileMenuOpen
                          ? "bottom-0 left-0"
                          : "bottom-0 left-1/2 -translate-x-1/2"
                      }`}
                    />
                    <span
                      className={`absolute w-1 h-1 rounded-full bg-white transition-all duration-300 ${
                        isMobileMenuOpen
                          ? "bottom-0 right-0"
                          : "top-1/2 right-0 -translate-y-1/2"
                      }`}
                    />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer (Top State) */}
        {!isSticky && isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full inset-x-4 mt-2 bg-[#0d0e12]/95 backdrop-blur-2xl border border-white/12 rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-300 pointer-events-auto">
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-[14px] font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-[#e7ff3d]"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-white/30 text-xs">→</span>
                  </Link>
                );
              })}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsBookingOpen(true);
                  }}
                  className="w-full rounded-xl bg-[#e7ff3d] hover:bg-[#d8f030] py-3 text-center text-[13px] font-bold text-[#0a0b0d] shadow-[0_0_20px_rgba(231,255,61,0.35)] cursor-pointer"
                >
                  BOOK A CALL
                </button>
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
