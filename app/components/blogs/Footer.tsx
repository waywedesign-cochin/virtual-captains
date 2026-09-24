import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
  onBookCall: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onBookCall }) => {
  return (
    <footer className="w-full bg-[#F9F8F6] pt-8 pb-12 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Massive Gradient-Masked Wordmark */}
        <div className="relative flex justify-center items-center py-4 sm:py-8 overflow-hidden">
          {/* Subtle Watermark Behind */}
          <span className="absolute font-serif text-[18vw] sm:text-[20vw] font-normal tracking-[-0.04em] text-[#141414]/[0.04] leading-none pointer-events-none select-none">
            orionix
          </span>

          {/* Front Gradient-Masked Wordmark */}
          <div className="orionix-gradient-mask w-full flex justify-center">
            <h2 className="font-serif text-[18vw] sm:text-[20vw] font-normal tracking-[-0.04em] text-[#141414] leading-none text-center select-none">
              orionix
            </h2>
          </div>
        </div>

        {/* Navigation & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-black/[0.06]">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <button
              onClick={() => onNavigate('/blog')}
              className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            >
              <img
                src="/assets/blog/orionix_logo.svg"
                alt="Orionix Studio"
                className="h-6 w-auto object-contain"
              />
            </button>
            <p className="text-xs sm:text-sm text-[#737373] max-w-sm leading-relaxed">
              Orionix is an independent digital design & engineering studio crafting high-impact digital experiences, living brand systems, and converted web platforms.
            </p>
          </div>

          {/* Directory Links */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#A4A4A4]">
              Studio
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/works')}
                  className="text-[#555555] hover:text-[#141414] transition-colors cursor-pointer"
                >
                  Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="text-[#555555] hover:text-[#141414] transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pricing')}
                  className="text-[#555555] hover:text-[#141414] transition-colors cursor-pointer"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/services')}
                  className="text-[#555555] hover:text-[#141414] transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog')}
                  className="text-[#141414] font-medium transition-colors cursor-pointer"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Social / Consultation */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#A4A4A4]">
              Connect
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#555555]">
              <li>
                <a
                  href="https://x.com/madebykota"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#141414] transition-colors"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#141414] transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://behance.net"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#141414] transition-colors"
                >
                  Behance
                </a>
              </li>
              <li>
                <a
                  href="https://dribbble.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#141414] transition-colors"
                >
                  Dribbble
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-black/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#A4A4A4]">
          <p>© 2026 Orionix. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Independent Design &amp; Technology</span>
            <span>•</span>
            <button onClick={onBookCall} className="hover:text-[#141414] transition-colors cursor-pointer">
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
