"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface SalesXHeroVideoProps {
  videoSrc?: string;
  posterSrc?: string;
  className?: string;
}

export default function SalesXHeroVideo({
  videoSrc = "/salesx/m.mp4",
  posterSrc = "/salesx/dashboard-preview.png",
  className = "",
}: SalesXHeroVideoProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
  const [durationStr, setDurationStr] = useState("00:00");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync playback time and progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      setProgress((current / total) * 100);

      const curM = Math.floor(current / 60);
      const curS = Math.floor(current % 60);
      const totM = Math.floor(total / 60);
      const totS = Math.floor(total % 60);
      setCurrentTimeStr(
        `${String(curM).padStart(2, "0")}:${String(curS).padStart(2, "0")}`,
      );
      setDurationStr(
        `${String(totM).padStart(2, "0")}:${String(totS).padStart(2, "0")}`,
      );
    }
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <div
        className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-500/30 bg-[#070a1a]/95 text-white shadow-[0_25px_70px_-15px_rgba(20,50,150,0.6)] backdrop-blur-2xl transition-all duration-300 ${className}`}
        style={{
          boxShadow:
            "0 0 60px -10px rgba(56, 189, 248, 0.25), 0 20px 40px rgba(0, 0, 0, 0.8)",
        }}
      >
        {/* Top Window Bar */}
        <div className="flex items-center justify-between border-b border-blue-900/40 bg-[#0b0f2a]/90 px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="ml-2 font-mono text-[10px] sm:text-xs text-slate-400">
              SALESX_HERO_ACCELERATION_ENGINE.webm
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-[#38bdf8]">
              <span
                className={`h-1.5 w-1.5 rounded-full bg-[#38bdf8] ${isPlaying ? "animate-ping" : ""}`}
              />
              {isPlaying ? "LIVE 4K RENDER" : "VIDEO PAUSED"}
            </span>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Expand Demo Lightbox"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              <span className="hidden md:inline">Full View</span>
            </button>
          </div>
        </div>

        {/* Video Viewport with Exact Mockup Overlays */}
        <div className="relative aspect-video w-full bg-[#050713] overflow-hidden flex items-center justify-center group/video select-none">
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            muted={isMuted}
            autoPlay
            loop
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-cover"
          />

          {/* Top Center Floating Badge: [ SALESX | Virtual Captains ] matching user screenshot */}
          <div className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="flex items-center gap-3 sm:gap-4 rounded-full border border-white/20 bg-[#0a0f2d]/80 px-4 sm:px-6 py-1.5 sm:py-2 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
              {/* SALESX Logo */}
              <div className="flex items-center font-sans">
                <span className="font-extrabold tracking-wider text-white text-xs sm:text-sm">
                  SALES
                </span>
                <span className="text-[#38bdf8] font-black text-sm sm:text-base ml-0.5">
                  X
                </span>
              </div>

              {/* Vertical divider */}
              <span className="h-4 sm:h-5 w-px bg-white/25" />

              {/* Virtual Captains Brand */}
              <div className="flex items-center gap-1.5">
                <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                  <Image
                    src="/home/logo.png"
                    alt="Virtual Captains"
                    fill
                    sizes="(max-width: 640px) 16px, 20px"
                    className="object-contain brightness-150"
                  />
                </div>
                <div className="text-left leading-tight">
                  <div className="text-[10px] sm:text-xs font-bold text-white">
                    Virtual
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-white/90">
                    Captains
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Floating Badge: [ India's first sales execution-backed training program | Enroll Now ] */}
          <div className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 z-20">
            <div className="flex items-center gap-2.5 sm:gap-4 rounded-full border border-white/20 bg-[#0a0f26]/85 px-3.5 sm:px-5 py-2 sm:py-2.5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
              <div className="text-left font-sans pr-1">
                <p className="text-[9px] sm:text-xs font-medium text-white/95 leading-tight">
                  India&apos;s first sales
                </p>
                <p className="text-[9px] sm:text-xs font-medium text-white/95 leading-tight">
                  execution-backed
                </p>
                <p className="text-[9px] sm:text-xs font-medium text-white/95 leading-tight">
                  training program
                </p>
              </div>

              <Link
                href="/individuals"
                className="inline-flex items-center justify-center rounded-full bg-white hover:bg-slate-100 px-3.5 sm:px-5 py-1.5 sm:py-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer select-none shrink-0"
              >
                <span className="text-[#f97316] font-extrabold text-xs sm:text-sm">
                  Enroll
                </span>
                <span className="text-[#6366f1] font-extrabold text-xs sm:text-sm ml-1">
                  Now
                </span>
              </Link>
            </div>
          </div>

          {/* Center Play / Pause Floating Overlay on Hover */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`absolute inset-0 m-auto h-14 w-14 sm:h-18 sm:w-18 rounded-full bg-black/50 hover:bg-blue-600/80 border border-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 z-30 cursor-pointer shadow-[0_0_30px_rgba(56,189,248,0.5)] ${
              isPlaying
                ? "opacity-0 group-hover/video:opacity-100"
                : "opacity-100"
            }`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Video Player Control Bar */}
        <div className="flex flex-col border-t border-blue-900/40 bg-[#0a0e27] px-3 sm:px-5 py-2 sm:py-3">
          {/* Scrubber Bar */}
          <div
            className="group relative h-1.5 w-full cursor-pointer rounded-full bg-blue-950 hover:h-2.5 transition-all"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              setProgress(Math.round(pos * 100));
            }}
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-600 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -mt-2 h-4 w-4 rounded-full bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>

          {/* Controls row */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="text-white hover:text-[#38bdf8] transition-colors p-1"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Toggle mute"
              >
                {isMuted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                )}
              </button>

              <span className="font-mono text-[11px] text-slate-400">
                {currentTimeStr} / {durationStr}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 px-2.5 py-1 text-[11px] font-medium text-[#38bdf8] transition-colors cursor-pointer"
              >
                <span>Full View</span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Fullscreen"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-5xl rounded-3xl border border-blue-500/40 bg-[#070a1a] p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-blue-900/40">
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-[#38bdf8] animate-pulse" />
                <h3 className="font-bold text-white text-base sm:text-lg">
                  SalesX Revenue Acceleration Engine
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="my-4 aspect-video rounded-2xl overflow-hidden bg-black border border-blue-500/20 shadow-2xl relative">
              <video
                src={videoSrc}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
