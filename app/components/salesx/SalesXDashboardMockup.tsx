"use client";

import React, { useState } from "react";

interface SalesXDashboardMockupProps {
  variant?: "full" | "compact" | "hero";
  className?: string;
  onActionClick?: () => void;
}

export default function SalesXDashboardMockup({
  variant = "full",
  className = "",
  onActionClick,
}: SalesXDashboardMockupProps) {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "projects", label: "Projects", icon: "folder" },
    { id: "tasks", label: "Tasks", icon: "clipboard" },
    { id: "data", label: "Data", icon: "database" },
    { id: "reports", label: "Reports", icon: "barchart" },
    { id: "settings", label: "Settings", icon: "gear" },
  ];

  const renderIcon = (type: string, active: boolean = false) => {
    const strokeColor = active ? "#ffffff" : "#94a3b8";
    switch (type) {
      case "home":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case "folder":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        );
      case "clipboard":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case "database":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth={2}>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        );
      case "barchart":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case "gear":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={strokeColor} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const isCompact = variant === "compact";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-500/25 bg-[#090d1f] text-white shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(37,99,235,0.2)] backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-blue-900/30 px-3 sm:px-5 py-2.5 sm:py-3 bg-[#070a1a]/95">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle navigation"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-0.5 font-black tracking-wider text-xs sm:text-base">
            <span className="text-white tracking-widest font-sans font-bold">SALES</span>
            <span className="text-[#00d2ff] drop-shadow-[0_0_10px_rgba(0,210,255,0.85)] font-sans font-extrabold text-sm sm:text-lg">
              X
            </span>
          </div>
        </div>

        {/* Center: Search pill */}
        <div className="flex items-center gap-2 rounded-full border border-blue-900/50 bg-[#0b1026]/90 px-3 py-1 text-xs text-slate-400 w-36 sm:w-52 md:w-64 focus-within:border-[#00d2ff]/60 transition-colors">
          <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-slate-500 text-[11px] truncate">Search...</span>
        </div>

        {/* Right: Help & Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="flex text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Help"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="9" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth={3} />
            </svg>
          </button>
          <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-[10px] sm:text-[11px] font-bold text-white shadow-[0_0_12px_rgba(59,130,246,0.6)]">
            AD
          </div>
        </div>
      </div>

      {/* Main Body with Sidebar + Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-24 sm:w-32 md:w-40 shrink-0 border-r border-blue-900/30 bg-[#060818]/90 p-2 sm:p-2.5 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[10px] sm:text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.4)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {renderIcon(item.icon, isActive)}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Main Content Area */}
        <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col gap-3 overflow-hidden bg-linear-to-b from-[#080b20]/90 via-[#060919]/95 to-[#050714]">
          {/* Welcome Back Header */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Welcome Back!
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Here&apos;s your overview
              </p>
            </div>
          </div>

          {/* Featured Metric Card (Total Tasks 55) */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-blue-500/30 bg-linear-to-r from-[#0a1233]/90 via-[#0e1742]/80 to-[#121c4e]/90 p-3 sm:p-4 md:p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            {/* Ambient Wave Graphic */}
            <svg
              className="absolute right-0 bottom-0 top-0 h-full w-2/3 pointer-events-none opacity-30"
              viewBox="0 0 400 150"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0 100 C100 60, 200 130, 300 70 C350 40, 380 90, 400 60 L400 150 L0 150 Z"
                fill="url(#waveGrad)"
              />
              <path
                d="M0 100 C100 60, 200 130, 300 70 C350 40, 380 90, 400 60"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative z-10 flex flex-row items-center justify-between gap-3">
              {/* Left stat: Total Tasks */}
              <div>
                <span className="text-[10px] sm:text-xs font-medium text-slate-400">
                  Total Tasks
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                    55
                  </span>
                </div>
                <p className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5">
                  Items in queue for review
                </p>
              </div>

              {/* Right stat: Avg Processing Time + Button */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 text-right">
                  <button
                    type="button"
                    className="p-0.5 text-slate-400 hover:text-white transition-colors"
                    aria-label="Refresh stats"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">1 days</div>
                    <div className="text-[8px] sm:text-[10px] text-slate-400">Avg. Processing Time</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onActionClick}
                  className="inline-flex items-center gap-1 rounded-full bg-[#1d4ed8] hover:bg-[#2563eb] px-3 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-white shadow-[0_0_14px_rgba(29,78,216,0.6)] transition-all transform hover:scale-105"
                >
                  <span>View Details</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Two Column Row: Recent Activity & Upcoming Tasks */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Recent Activity */}
            <div className="rounded-xl border border-blue-900/30 bg-[#090d24]/70 p-2.5 sm:p-3 flex flex-col justify-between min-h-20 sm:min-h-24">
              <div className="flex items-center gap-1.5 border-b border-blue-950/60 pb-1.5">
                <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-200">Recent Activity</span>
              </div>
              <div className="flex flex-col items-center justify-center py-1.5 text-center">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-950/80 text-slate-500 mb-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-[9px] sm:text-[10px] font-medium text-slate-300">No recent activity</div>
                <div className="text-[8px] sm:text-[9px] text-slate-500">Activity will appear here once available.</div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="rounded-xl border border-blue-900/30 bg-[#090d24]/70 p-2.5 sm:p-3 flex flex-col justify-between min-h-20 sm:min-h-24">
              <div className="flex items-center gap-1.5 border-b border-blue-950/60 pb-1.5">
                <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-200">Upcoming Tasks</span>
              </div>
              <div className="flex flex-col items-center justify-center py-1.5 text-center">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-950/80 text-slate-500 mb-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="text-[9px] sm:text-[10px] font-medium text-slate-300">No upcoming tasks</div>
                <div className="text-[8px] sm:text-[9px] text-slate-500">You&apos;re all caught up!</div>
              </div>
            </div>
          </div>

          {/* Announcements Row */}
          {!isCompact && (
            <div className="rounded-xl border border-blue-900/30 bg-[#090d24]/70 p-2.5 sm:p-3">
              <div className="flex items-center gap-1.5 border-b border-blue-950/60 pb-1">
                <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-200">Announcements</span>
              </div>
              <div className="pt-1.5 text-left">
                <div className="text-[9px] sm:text-[10px] font-medium text-slate-300">No announcements</div>
                <div className="text-[8px] sm:text-[9px] text-slate-500">Check back later for updates.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
