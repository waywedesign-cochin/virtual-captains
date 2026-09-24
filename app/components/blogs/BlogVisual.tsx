import React from 'react';

interface BlogVisualProps {
  type: string;
  className?: string;
  aspect?: '16:9' | '4:3' | 'custom';
  accent?: string;
}

export const BlogVisual: React.FC<BlogVisualProps> = ({
  type,
  className = '',
  aspect = '16:9',
  accent = '#6366f1',
}) => {
  const aspectClass =
    aspect === '16:9'
      ? 'aspect-[16/9]'
      : aspect === '4:3'
      ? 'aspect-[4/3]'
      : '';

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0c0e12] border border-white/5 select-none ${aspectClass} ${className}`}
    >
      {/* Dynamic ambient backdrop glow */}
      <div
        className="absolute inset-0 opacity-40 blur-3xl pointer-events-none transition-opacity duration-700 group-hover:opacity-70"
        style={{
          background: `radial-gradient(circle at 60% 40%, ${accent} 0%, transparent 65%)`,
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-subtle opacity-60" />

      {/* Domain-specific vector artworks matching Orionix design agency standards */}
      {type === 'wireframe' && (
        <svg
          className="absolute inset-0 w-full h-full p-6 sm:p-10"
          viewBox="0 0 600 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle blueprint frame */}
          <rect
            x="40"
            y="30"
            width="520"
            height="280"
            rx="12"
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 4"
          />
          {/* Main layout wireframe blocks */}
          <rect
            x="70"
            y="60"
            width="140"
            height="18"
            rx="4"
            fill="rgba(255,255,255,0.12)"
          />
          <rect
            x="70"
            y="95"
            width="320"
            height="32"
            rx="6"
            fill="rgba(255,255,255,0.22)"
          />
          <rect
            x="70"
            y="140"
            width="260"
            height="12"
            rx="3"
            fill="rgba(255,255,255,0.07)"
          />
          <rect
            x="70"
            y="160"
            width="200"
            height="12"
            rx="3"
            fill="rgba(255,255,255,0.07)"
          />

          {/* Focal graphic box */}
          <rect
            x="360"
            y="80"
            width="170"
            height="180"
            rx="10"
            fill="rgba(99,102,241,0.1)"
            stroke="rgba(99,102,241,0.4)"
          />
          <circle
            cx="445"
            cy="150"
            r="40"
            stroke="rgba(99,102,241,0.6)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <circle cx="445" cy="150" r="16" fill="rgba(99,102,241,0.5)" />

          {/* Connecting vector data line */}
          <path
            d="M 270 170 L 360 170"
            stroke="rgba(99,102,241,0.6)"
            strokeWidth="2"
          />
          <circle cx="270" cy="170" r="4" fill="#6366f1" />
          <circle cx="360" cy="170" r="4" fill="#6366f1" />

          {/* Bottom layout cards */}
          <rect
            x="70"
            y="210"
            width="80"
            height="50"
            rx="6"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.08)"
          />
          <rect
            x="160"
            y="210"
            width="80"
            height="50"
            rx="6"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.08)"
          />
          <rect
            x="250"
            y="210"
            width="80"
            height="50"
            rx="6"
            fill="rgba(99,102,241,0.15)"
            stroke="rgba(99,102,241,0.3)"
          />
        </svg>
      )}

      {type === 'brand' && (
        <svg
          className="absolute inset-0 w-full h-full p-6 sm:p-8"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dynamic kinetic rings */}
          <circle
            cx="200"
            cy="150"
            r="90"
            stroke="rgba(168,85,247,0.3)"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          <circle
            cx="200"
            cy="150"
            r="60"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="150"
            r="35"
            fill="rgba(168,85,247,0.15)"
            stroke="rgba(168,85,247,0.8)"
            strokeWidth="2"
          />

          {/* Precision crosshairs */}
          <line
            x1="80"
            y1="150"
            x2="320"
            y2="150"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <line
            x1="200"
            y1="40"
            x2="200"
            y2="260"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />

          {/* Floating brand markers */}
          <rect
            x="270"
            y="90"
            width="60"
            height="24"
            rx="4"
            fill="rgba(168,85,247,0.2)"
            stroke="rgba(168,85,247,0.5)"
          />
          <rect
            x="70"
            y="190"
            width="50"
            height="20"
            rx="4"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.1)"
          />
        </svg>
      )}

      {type === 'interface' && (
        <svg
          className="absolute inset-0 w-full h-full p-6 sm:p-8"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Oscilloscope tactile curve */}
          <path
            d="M 50 180 C 110 180, 130 90, 180 90 C 230 90, 250 210, 300 210 C 330 210, 360 160, 380 160"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 50 180 C 110 180, 130 90, 180 90 C 230 90, 250 210, 300 210 C 330 210, 360 160, 380 160 L 380 270 L 50 270 Z"
            fill="url(#cyanGlow)"
            opacity="0.15"
          />
          <defs>
            <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Damping indicators */}
          <circle cx="180" cy="90" r="5" fill="#06b6d4" />
          <circle cx="300" cy="210" r="5" fill="#06b6d4" />
          <line
            x1="180"
            y1="90"
            x2="180"
            y2="250"
            stroke="rgba(6,182,212,0.3)"
            strokeDasharray="3 3"
          />
        </svg>
      )}

      {type === 'systems' && (
        <svg
          className="absolute inset-0 w-full h-full p-6 sm:p-8"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Token hierarchy node network */}
          <rect
            x="60"
            y="60"
            width="80"
            height="40"
            rx="6"
            fill="rgba(16,185,129,0.15)"
            stroke="rgba(16,185,129,0.4)"
          />
          <rect
            x="200"
            y="130"
            width="90"
            height="44"
            rx="6"
            fill="rgba(16,185,129,0.25)"
            stroke="rgba(16,185,129,0.7)"
          />
          <rect
            x="60"
            y="200"
            width="80"
            height="40"
            rx="6"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.12)"
          />

          <path
            d="M 140 80 H 170 V 152 H 200"
            stroke="rgba(16,185,129,0.5)"
            strokeWidth="1.5"
          />
          <path
            d="M 140 220 H 170 V 152 H 200"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />
          <circle cx="200" cy="152" r="3" fill="#10b981" />
        </svg>
      )}

      {type === 'darkmode' && (
        <svg
          className="absolute inset-0 w-full h-full p-6 sm:p-8"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stepped elevation stairs */}
          <rect
            x="60"
            y="170"
            width="280"
            height="80"
            rx="8"
            fill="#121418"
            stroke="rgba(255,255,255,0.06)"
          />
          <rect
            x="90"
            y="130"
            width="220"
            height="80"
            rx="8"
            fill="#181b22"
            stroke="rgba(255,255,255,0.1)"
          />
          <rect
            x="120"
            y="90"
            width="160"
            height="80"
            rx="8"
            fill="#212631"
            stroke="rgba(255,255,255,0.18)"
          />
          <circle
            cx="200"
            cy="130"
            r="20"
            fill="rgba(148,163,184,0.15)"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {type === 'ai' && (
        <svg
          className="absolute inset-0 w-full h-full p-6 sm:p-8"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Neural constellation mesh */}
          <circle cx="120" cy="90" r="5" fill="#f59e0b" />
          <circle cx="280" cy="80" r="4" fill="rgba(245,158,11,0.6)" />
          <circle cx="200" cy="150" r="8" fill="#f59e0b" />
          <circle cx="100" cy="210" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="300" cy="220" r="6" fill="#f59e0b" />

          <line
            x1="120"
            y1="90"
            x2="200"
            y2="150"
            stroke="rgba(245,158,11,0.4)"
            strokeWidth="1.5"
          />
          <line
            x1="280"
            y1="80"
            x2="200"
            y2="150"
            stroke="rgba(245,158,11,0.4)"
            strokeWidth="1.5"
          />
          <line
            x1="100"
            y1="210"
            x2="200"
            y2="150"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
          <line
            x1="300"
            y1="220"
            x2="200"
            y2="150"
            stroke="rgba(245,158,11,0.4)"
            strokeWidth="1.5"
          />
        </svg>
      )}

      {/* Subtle bottom edge shadow and hairline highlight */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#08090a]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
    </div>
  );
};
