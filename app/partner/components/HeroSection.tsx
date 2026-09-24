"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import { PartnershipModel } from "../types";
import {
  ChevronDown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Handshake,
  School,
  Building,
  Megaphone,
  GraduationCap,
  Briefcase,
  CheckCircle2,
} from "./Icons";

interface HeroSectionProps {
  models: PartnershipModel[];
  onSelectModel: (model: PartnershipModel) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  models,
  onSelectModel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMobileCard, setActiveMobileCard] = useState<number>(1); // Default to Corporate (Most Popular)
  const [progressVal, setProgressVal] = useState<number>(0);

  // Scroll tracking across the sticky section height (260vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 22,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      setProgressVal(v);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Layer 1 (Monumental Typography) fades and scales
  const titleOpacity = useTransform(smoothProgress, [0, 0.28], [1, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.28], [0, -75]);
  const titleScale = useTransform(smoothProgress, [0, 0.28], [1, 0.93]);
  const titlePointerEvents = useTransform(smoothProgress, (v) => (v < 0.25 ? "auto" : "none"));

  // Background subtle zoom
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.07]);

  // Layer 2 (Cards Master Container)
  const cardsLayerOpacity = useTransform(smoothProgress, [0.22, 0.42], [0, 1]);
  const cardsLayerY = useTransform(smoothProgress, [0.22, 0.42], [80, 0]);
  const cardsLayerScale = useTransform(smoothProgress, [0.22, 0.42], [0.94, 1]);
  const cardsPointerEvents = useTransform(smoothProgress, (v) => (v > 0.3 ? "auto" : "none"));

  // Card 1 (Academic)
  const card1Y = useTransform(smoothProgress, [0.23, 0.42], [70, 0]);
  const card1Opacity = useTransform(smoothProgress, [0.23, 0.38], [0, 1]);
  const card1Scale = useTransform(smoothProgress, [0.23, 0.42], [0.92, 1]);

  // Card 2 (Corporate - Most Popular)
  const card2Y = useTransform(smoothProgress, [0.27, 0.46], [85, 0]);
  const card2Opacity = useTransform(smoothProgress, [0.26, 0.41], [0, 1]);
  const card2Scale = useTransform(smoothProgress, [0.27, 0.46], [0.94, 1]);

  // Card 3 (Brand)
  const card3Y = useTransform(smoothProgress, [0.31, 0.5], [100, 0]);
  const card3Opacity = useTransform(smoothProgress, [0.29, 0.44], [0, 1]);
  const card3Scale = useTransform(smoothProgress, [0.31, 0.5], [0.92, 1]);


  const scrollToCards = () => {
    if (!containerRef.current || typeof window === "undefined") return;
    const targetOffset = containerRef.current.offsetTop + containerRef.current.offsetHeight * 0.65;
    window.scrollTo({ top: targetOffset, behavior: "smooth" });
  };

  // 14 vertical column heights that form the architectural archway
  const columnHeights = [
    88, 82, 74, 65, 54, 44, 38, 38, 44, 54, 65, 74, 82, 88,
  ];

  const academicModel = models[0];
  const corporateModel = models[1];
  const brandModel = models[2];

  return (
    <div
      ref={containerRef}
      id="hero-experience"
      className="relative w-full h-[260vh] select-none"
    >
      {/* ========================================================================= */}
      {/* PINNED STAGE VIEWPORT (Fixed to screen across all devices)                 */}
      {/* ========================================================================= */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-[#040507]">
        {/* ========================================================================= */}
        {/* SHARED BACKGROUND: Stepped Columns in Virtual Captains Home Navy / Cyan   */}
        {/* ========================================================================= */}
        <motion.div
          style={{ scale: bgScale }}
          className="absolute inset-0 pointer-events-none overflow-hidden select-none origin-center"
        >
          {/* Upper dark navy ambient glow */}
          <div className="absolute top-0 left-0 right-0 h-36 sm:h-52 bg-linear-to-b from-[#03091e]/90 via-[#0a1a4a]/40 to-transparent z-10" />

          {/* 14 Staggered Pleated Vertical Columns (Deep Sapphire -> Royal Blue -> Sky Blue) */}
          <div className="absolute inset-0 flex h-full w-full">
            {columnHeights.map((heightPercent, idx) => {
              const isCenter = idx === 6 || idx === 7;
              const isNearCenter = idx >= 4 && idx <= 9;
              return (
                <div
                  key={idx}
                  className="flex-1 h-full flex flex-col items-center relative overflow-hidden"
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full relative transition-all duration-700 ${
                      isCenter
                        ? "bg-linear-to-b from-[#0b1c4d] via-[#1d4ed8] to-[#38bdf8]"
                        : isNearCenter
                        ? "bg-linear-to-b from-[#081538] via-[#1e40af] to-[#2563eb]"
                        : "bg-linear-to-b from-[#050e26] via-[#1e3a8a] to-[#1d4ed8]"
                    }`}
                  >
                    <div className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-[#38bdf8]/40 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-size-[10px_10px] opacity-35 mix-blend-overlay" />
                    <div className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-[#040507] via-[#040507]/80 to-transparent" />
                  </div>
                  <div className="flex-1 w-full bg-[#040507]" />
                </div>
              );
            })}
          </div>

          {/* Central radial sunburst (Cyan & Sky-Blue & subtle electric lime highlight) */}
          <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-85 xs:w-[480px] sm:w-175 md:w-212.5 lg:w-275 xl:w-325 h-75 sm:h-125 lg:h-162.5 bg-linear-to-t from-[#2563eb]/40 via-[#38bdf8]/30 to-[#e7ff3d]/15 rounded-full blur-[100px] sm:blur-[135px] mix-blend-screen pointer-events-none" />

          {/* Bottom smooth fade to black */}
          <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-linear-to-t from-[#040507] via-[#040507]/85 to-transparent z-10" />
        </motion.div>

        {/* ========================================================================= */}
        {/* LAYER 1: MONUMENTAL TYPOGRAPHY ("GROW TOGETHER WITH SALESX")              */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: titleOpacity,
            y: titleY,
            scale: titleScale,
            pointerEvents: titlePointerEvents,
          }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-3 xs:px-4 sm:px-6 pt-16 sm:pt-20 md:pt-0 select-none"
        >
          {/* Sub-badge matching image */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 backdrop-blur-md mb-3 sm:mb-4 text-[#38bdf8] text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-md"
          >
            <Handshake className="w-3 h-3 text-[#38bdf8]" />
            <span>PARTNERSHIPS</span>
          </motion.div>

          {/* Monumental Title (Refined, proportional scale) */}
          <div className="w-full max-w-5xl mx-auto">
            <h1 className="font-sans font-black text-[7.5vw] xs:text-[7vw] sm:text-[5.5vw] md:text-[4vw] lg:text-[3.2rem] xl:text-[3.8rem] leading-[0.92] tracking-tighter uppercase text-white drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]">
              <span className="block tracking-[-0.03em]">GROW TOGETHER</span>
              <span className="block tracking-[-0.03em] text-transparent bg-clip-text bg-linear-to-b from-white via-slate-100 to-[#38bdf8]">
                WITH SALESX
              </span>
              <span className="block text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-300 font-normal tracking-tight normal-case mt-1 sm:mt-1.5">
                by Virtual Captains
              </span>
            </h1>
          </div>

          <p className="mt-3 sm:mt-4 max-w-lg text-slate-300/85 text-xs sm:text-[13px] md:text-sm font-normal leading-relaxed px-4">
            Whether you&apos;re an institution, a brand, or an enterprise, we have a partnership model built for you. Let&apos;s create impact together.
          </p>

          {/* Prompt to scroll */}
          <button
            onClick={scrollToCards}
            className="group flex flex-col items-center gap-1 mt-4 sm:mt-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll down to reveal partnership models"
          >
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#38bdf8] group-hover:text-[#e7ff3d] transition-colors">
              Scroll to reveal models
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-md"
            >
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#38bdf8] group-hover:text-white transition-colors" />
            </motion.div>
          </button>
        </motion.div>

        {/* ========================================================================= */}
        {/* LAYER 2: 3 PARTNERSHIP CARDS (Compact, Sleek, High-Contrast Cards)         */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: cardsLayerOpacity,
            y: cardsLayerY,
            scale: cardsLayerScale,
            pointerEvents: cardsPointerEvents,
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-2 xs:px-3 sm:px-5 md:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-0 py-3 sm:py-5 select-none"
        >
          {/* Header pill badge */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563eb]/20 border border-[#38bdf8]/40 backdrop-blur-md text-[#38bdf8] text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-[#e7ff3d]" />
              <span>CHOOSE YOUR COLLABORATION MODEL</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DESKTOP & TABLET VIEW: 3 Glassmorphic Cards                                */}
          {/* ========================================================================= */}
          <div className="hidden md:grid relative w-full max-w-260 2xl:max-w-275 mx-auto md:grid-cols-3 md:gap-3 lg:gap-4 xl:gap-4.5 items-stretch">
            {/* ----------------------------------------------------------------------- */}
            {/* CARD 1: ACADEMIC & INSTITUTION PARTNERS */}
            {/* ----------------------------------------------------------------------- */}
            <motion.div
              style={{
                y: card1Y,
                opacity: card1Opacity,
                scale: card1Scale,
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative group rounded-[22px] lg:rounded-[26px] p-4.5 sm:p-5 lg:p-5.5 xl:p-6 flex flex-col justify-between overflow-hidden bg-slate-900/50 backdrop-blur-2xl border border-white/15 hover:border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 min-h-95 lg:min-h-100 xl:min-h-105"
            >
              {/* Subtle ambient glass glow & top sheen */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/25 transition-all duration-500" />
              <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

              <div className="relative z-10">
                {/* Icon Box */}
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.2)] mb-3 lg:mb-3.5">
                  <School className="w-5 h-5 lg:w-5.5 lg:h-5.5" />
                </div>

                {/* Title */}
                <h3 className="font-sans font-black text-[17px] lg:text-[1.15rem] xl:text-[1.25rem] text-white leading-snug tracking-tight mb-2 drop-shadow-sm">
                  {academicModel.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-[11px] lg:text-[11.5px] xl:text-xs leading-relaxed mb-3.5">
                  {academicModel.description}
                </p>

                {/* Bullet Points */}
                <ul className="space-y-2 mb-4">
                  {academicModel.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[11px] lg:text-[11.5px] font-medium text-slate-200 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectModel(academicModel)}
                className="relative z-10 w-full mt-auto py-2.5 px-3.5 rounded-xl bg-linear-to-r from-[#1d4ed8] to-[#2563eb] hover:from-[#2563eb] hover:to-[#38bdf8] text-white font-bold text-[11px] lg:text-xs tracking-wide border border-white/20 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{academicModel.ctaText}</span>
              </button>
            </motion.div>

            {/* ----------------------------------------------------------------------- */}
            {/* CARD 2: CORPORATE & HIRING PARTNERS (Featured / Most Popular)           */}
            {/* ----------------------------------------------------------------------- */}
            <motion.div
              style={{
                y: card2Y,
                opacity: card2Opacity,
                scale: card2Scale,
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative group rounded-[22px] lg:rounded-[26px] p-4.5 sm:p-5 lg:p-5.5 xl:p-6 flex flex-col justify-between overflow-visible bg-linear-to-b from-[#102454]/80 via-[#0b1736]/70 to-[#050b1a]/80 backdrop-blur-2xl border-2 border-[#38bdf8]/70 hover:border-[#38bdf8] shadow-[0_25px_60px_rgba(37,99,235,0.35),inset_0_1px_2px_rgba(255,255,255,0.3)] transition-all duration-300 min-h-95 lg:min-h-100 xl:min-h-105"
            >
              {/* Top ambient highlight + glow */}
              <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#38bdf8]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#38bdf8]/30 transition-all duration-500" />
              <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-[#38bdf8] to-transparent" />

              {/* "MOST POPULAR" Badge */}
              <div className="absolute top-3.5 right-3.5 z-20">
                <span className="bg-linear-to-r from-[#e7ff3d] to-[#d8f030] text-[#040817] text-[8.5px] lg:text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-[0_0_15px_rgba(231,255,61,0.4)]">
                  MOST POPULAR
                </span>
              </div>

              <div className="relative z-10">
                {/* Icon Box */}
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-[#2563eb]/25 border border-[#38bdf8]/50 flex items-center justify-center text-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.35)] mb-3 lg:mb-3.5">
                  <Building className="w-5 h-5 lg:w-5.5 lg:h-5.5" />
                </div>

                {/* Title */}
                <h3 className="font-sans font-black text-[17px] lg:text-[1.15rem] xl:text-[1.25rem] text-white leading-snug tracking-tight mb-2 drop-shadow-sm">
                  {corporateModel.title}
                </h3>

                {/* Description */}
                <p className="text-blue-100/90 text-[11px] lg:text-[11.5px] xl:text-xs leading-relaxed mb-3.5">
                  {corporateModel.description}
                </p>

                {/* Bullet Points */}
                <ul className="space-y-2 mb-4">
                  {corporateModel.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[11px] lg:text-[11.5px] font-medium text-white leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectModel(corporateModel)}
                className="relative z-10 w-full mt-auto py-2.5 px-3.5 rounded-xl bg-linear-to-r from-[#2563eb] via-[#38bdf8] to-[#2563eb] hover:brightness-110 text-white font-black text-[11px] lg:text-xs tracking-wide border border-white/30 shadow-xl shadow-blue-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{corporateModel.ctaText}</span>
              </button>
            </motion.div>

            {/* ----------------------------------------------------------------------- */}
            {/* CARD 3: BRAND & CHANNEL PARTNERS */}
            {/* ----------------------------------------------------------------------- */}
            <motion.div
              style={{
                y: card3Y,
                opacity: card3Opacity,
                scale: card3Scale,
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative group rounded-[22px] lg:rounded-[26px] p-4.5 sm:p-5 lg:p-5.5 xl:p-6 flex flex-col justify-between overflow-hidden bg-slate-900/50 backdrop-blur-2xl border border-white/15 hover:border-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 min-h-95 lg:min-h-100 xl:min-h-105"
            >
              {/* Subtle ambient glass glow & top sheen */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-500" />
              <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-emerald-400/30 to-transparent" />

              <div className="relative z-10">
                {/* Icon Box */}
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)] mb-3 lg:mb-3.5">
                  <Megaphone className="w-5 h-5 lg:w-5.5 lg:h-5.5" />
                </div>

                {/* Title */}
                <h3 className="font-sans font-black text-[17px] lg:text-[1.15rem] xl:text-[1.25rem] text-white leading-snug tracking-tight mb-2 drop-shadow-sm">
                  {brandModel.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-[11px] lg:text-[11.5px] xl:text-xs leading-relaxed mb-3.5">
                  {brandModel.description}
                </p>

                {/* Bullet Points */}
                <ul className="space-y-2 mb-4">
                  {brandModel.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[11px] lg:text-[11.5px] font-medium text-slate-200 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectModel(brandModel)}
                className="relative z-10 w-full mt-auto py-2.5 px-3.5 rounded-xl bg-linear-to-r from-[#059669] to-[#10b981] hover:from-[#10b981] hover:to-[#34d399] text-white font-bold text-[11px] lg:text-xs tracking-wide border border-white/20 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>{brandModel.ctaText}</span>
              </button>
            </motion.div>
          </div>

          {/* ========================================================================= */}
          {/* MOBILE VIEW (< md / phone & small screen): Compact Card Switcher          */}
          {/* ========================================================================= */}
          <div className="md:hidden w-full max-w-77.5 xs:max-w-[330px] sm:max-w-87.5 flex flex-col items-center">
            {/* Quick-switch Tab Buttons on Mobile */}
            <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur-md rounded-full mb-2.5 border border-white/15 max-w-full">
              {[
                { label: "1. Academic", id: 0 },
                { label: "2. Corporate", id: 1 },
                { label: "3. Brand", id: 2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMobileCard(tab.id)}
                  className={`px-2 xs:px-2.5 py-1 rounded-full text-[9px] xs:text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeMobileCard === tab.id
                      ? "bg-[#2563eb] text-white shadow-sm shadow-blue-500/40"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mobile Card Stage */}
            <div className="w-full relative min-h-90 xs:min-h-[380px]">
              <AnimatePresence mode="wait">
                {models.map((m, idx) => {
                  if (activeMobileCard !== idx) return null;
                  const isCorporate = idx === 1;
                  const isBrand = idx === 2;

                  return (
                    <motion.div
                      key={`mob-card-${m.id}`}
                      initial={{ opacity: 0, x: -14, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 14, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative w-full rounded-[22px] p-4.5 xs:p-5 flex flex-col justify-between shadow-2xl backdrop-blur-2xl overflow-hidden min-h-90 xs:min-h-[380px] ${
                        isCorporate
                          ? "bg-linear-to-b from-[#102454]/85 via-[#0b1736]/75 to-[#050b1a]/85 border-2 border-[#38bdf8]/70 shadow-[0_20px_50px_rgba(37,99,235,0.35),inset_0_1px_2px_rgba(255,255,255,0.3)]"
                          : isBrand
                          ? "bg-slate-900/60 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]"
                          : "bg-slate-900/60 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]"
                      }`}
                    >
                      {/* Top ambient highlight line */}
                      <div className={`absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent ${
                        isCorporate ? "via-[#38bdf8]" : isBrand ? "via-emerald-400/40" : "via-white/30"
                      } to-transparent`} />

                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-md ${
                            idx === 0
                              ? "bg-blue-500/15 border border-blue-400/30 text-[#38bdf8]"
                              : idx === 1
                              ? "bg-[#2563eb]/25 border border-[#38bdf8]/50 text-[#38bdf8]"
                              : "bg-emerald-500/15 border border-emerald-400/30 text-emerald-400"
                          }`}>
                            {idx === 0 && <School className="w-4.5 h-4.5" />}
                            {idx === 1 && <Building className="w-4.5 h-4.5" />}
                            {idx === 2 && <Megaphone className="w-4.5 h-4.5" />}
                          </div>
                          {m.badge && (
                            <span className="bg-linear-to-r from-[#e7ff3d] to-[#d8f030] text-[#040817] text-[8px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(231,255,61,0.4)]">
                              {m.badge}
                            </span>
                          )}
                        </div>

                        <h3 className="font-sans font-black text-lg text-white leading-tight mb-1.5 drop-shadow-sm">
                          {m.title}
                        </h3>
                        <p className={`text-[11px] leading-relaxed mb-3 ${isCorporate ? "text-blue-100/90" : "text-slate-300"}`}>
                          {m.description}
                        </p>

                        <ul className="space-y-1.5 mb-3">
                          {m.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2 text-[11px] font-medium text-slate-200">
                              <CheckCircle2
                                className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                                  idx === 1
                                    ? "text-[#38bdf8]"
                                    : idx === 2
                                    ? "text-emerald-400"
                                    : "text-[#38bdf8]"
                                }`}
                              />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => onSelectModel(m)}
                        className={`w-full mt-auto py-2.5 px-3.5 rounded-xl font-bold text-[11px] uppercase tracking-wide border border-white/20 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer ${
                          isCorporate
                            ? "bg-linear-to-r from-[#2563eb] via-[#38bdf8] to-[#2563eb] text-white shadow-blue-500/30"
                            : isBrand
                            ? "bg-linear-to-r from-[#059669] to-[#10b981] text-white shadow-emerald-600/30"
                            : "bg-linear-to-r from-[#1d4ed8] to-[#2563eb] text-white shadow-blue-600/30"
                        }`}
                      >
                        <span>{m.ctaText}</span>
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Mobile Navigation Dots & Arrows */}
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => setActiveMobileCard((prev) => (prev > 0 ? prev - 1 : 2))}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition-transform cursor-pointer"
                aria-label="Previous model"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMobileCard(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeMobileCard === idx ? "w-6 bg-[#38bdf8]" : "w-2 bg-white/30"
                    }`}
                    aria-label={`Show model ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveMobileCard((prev) => (prev < 2 ? prev + 1 : 0))}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition-transform cursor-pointer"
                aria-label="Next model"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
