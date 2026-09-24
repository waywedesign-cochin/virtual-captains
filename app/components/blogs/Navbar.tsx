import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { RollingButton } from './RollingButton';

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onBookCall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath = '/blog',
  onNavigate,
  onBookCall,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mainNavItems = [
    { label: 'About', href: '/about' },
    { label: 'SalesX', href: '/salesx' },
    { label: 'Programs', href: '/programs' },
    { label: 'Organisations', href: '/organisations' },
    { label: 'Individuals', href: '/individuals' },
    { label: 'Partner with Us', href: '/partner' },
  ];

  const resourcesDropdown = [
    {
      label: 'Blogs & Perspectives',
      href: '/blogs',
      description: 'Tactical sales frameworks & playbooks',
    },
    {
      label: 'News & Updates',
      href: '/news-and-updates',
      description: 'Company announcements & platform milestones',
    },
  ];

  const isResourcesActive =
    currentPath.startsWith('/blog') || currentPath.startsWith('/news-and-updates');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (href: string) => {
    if (onNavigate && href.startsWith('/blog')) {
      onNavigate(href);
    }
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#F9F8F6]/85 border-b border-black/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Virtual Captains Official Brand Logo */}
        <Link
          href="/"
          className="flex items-center select-none group cursor-pointer focus:outline-none"
          aria-label="Virtual Captains Home"
        >
          <Image
            src="/home/logo.png"
            alt="Virtual Captains"
            width={160}
            height={36}
            className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Center: Frosted Capsule Nav with Smooth Animated Pill */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 bg-black/3 p-1.5 rounded-full border border-black/4">
          {mainNavItems.map((item) => {
            const isActive =
              currentPath === item.href ||
              (item.href === '/partner' && currentPath === '/partner-with-us');

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => handleLinkClick(item.href)}
                className={`relative px-3.5 py-1.5 text-xs sm:text-[13px] font-medium transition-colors cursor-pointer rounded-full flex items-center gap-1.5 select-none ${
                  isActive ? 'text-[#141414]' : 'text-[#737373] hover:text-[#141414]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="blogNavPill"
                    className="absolute inset-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-black/4"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}

          {/* Resources Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`relative px-3.5 py-1.5 text-xs sm:text-[13px] font-medium transition-colors cursor-pointer rounded-full flex items-center gap-1.5 select-none ${
                isResourcesActive ? 'text-[#141414]' : 'text-[#737373] hover:text-[#141414]'
              }`}
            >
              {isResourcesActive && (
                <motion.div
                  layoutId="blogNavPill"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-black/4"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10">Resources</span>
              <ChevronDown
                className={`relative z-10 w-3.5 h-3.5 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-[#141414]' : 'text-[#737373]'
                }`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute top-full right-0 mt-2 w-72 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-black/6 p-2 z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#A4A4A4]">
                    Resources
                  </div>
                  {resourcesDropdown.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => handleLinkClick(child.href)}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-200/60 transition-colors cursor-pointer block group"
                    >
                      <div className="text-xs font-semibold text-[#141414] group-hover:text-[#1d4ed8] flex items-center justify-between transition-colors">
                        <span>{child.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#1d4ed8]" />
                      </div>
                      <p className="text-[11px] text-[#737373] group-hover:text-[#2563eb] mt-0.5 transition-colors">{child.description}</p>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right: Book a Call CTA */}
        <div className="hidden md:flex items-center">
          <RollingButton
            text="Book a call"
            onClick={onBookCall}
            variant="blue"
            size="md"
          />
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-2.5">
          <RollingButton
            text="Book a call"
            onClick={onBookCall}
            variant="blue"
            size="sm"
            showArrow={false}
          />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#141414] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#F9F8F6] border-b border-black/6 px-4 pt-2 pb-6 space-y-1 overflow-hidden"
          >
            {mainNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => handleLinkClick(item.href)}
                className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-medium text-[#555555] hover:text-[#141414] hover:bg-black/3 transition-colors cursor-pointer block"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-black/5">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#A4A4A4]">
                Resources
              </div>
              {resourcesDropdown.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => handleLinkClick(child.href)}
                  className="w-full text-left py-2 px-3 rounded-xl text-sm font-medium text-[#141414] hover:bg-blue-50/70 hover:text-[#1d4ed8] transition-colors cursor-pointer block"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
