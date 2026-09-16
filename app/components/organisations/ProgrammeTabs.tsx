"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function ProgrammeTabs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal text elements
    gsap.from(".prog-text", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });

    // Spread cards animation
    gsap.fromTo(".card-left", 
      { x: 100, opacity: 0, rotation: 5 },
      { 
        scrollTrigger: {
          trigger: ".cards-container",
          start: "top 80%",
        },
        x: 0, 
        opacity: 1, 
        rotation: 0,
        duration: 1, 
        ease: "power3.out" 
      }
    );
    
    gsap.fromTo(".card-right", 
      { x: -100, opacity: 0, rotation: -5 },
      { 
        scrollTrigger: {
          trigger: ".cards-container",
          start: "top 80%",
        },
        x: 0, 
        opacity: 1, 
        rotation: 0,
        duration: 1, 
        ease: "power3.out" 
      }
    );

    gsap.fromTo(".card-center", 
      { y: 50, opacity: 0, scale: 0.9 },
      { 
        scrollTrigger: {
          trigger: ".cards-container",
          start: "top 80%",
        },
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 1, 
        delay: 0.2,
        ease: "back.out(1.5)" 
      }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-white py-24 overflow-hidden">
      <div className="w-full max-w-372 mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-between items-end border-b border-slate-200 pb-4 mb-16 prog-text">
          <h2 className="text-4xl md:text-5xl font-medium text-slate-900 tracking-tight relative">
            <span className="font-bold underline decoration-4 decoration-slate-900 underline-offset-8">Groom</span> Studio
          </h2>
          <div className="flex flex-wrap gap-6 md:gap-10 text-sm md:text-base font-medium text-slate-400 mt-6 md:mt-0">
            <button className="hover:text-slate-800 transition-colors">Sales Audit</button>
            <button className="hover:text-slate-800 transition-colors">Outbound Lead Gen</button>
            <button className="hover:text-slate-800 transition-colors">Sales Training</button>
          </div>
        </div>

        {/* Content Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 prog-text">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold text-slate-800">First-Time Induction & Orientation</span>
              <span className="px-2 py-0.5 rounded-full border border-red-200 text-red-500 text-xs font-bold tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 block"></span>
                Offline
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-[#2563eb] leading-tight">
              Turn New Hires Into Revenue-Ready Reps
            </h3>
          </div>
          <div className="flex items-center">
            <p className="text-slate-600 leading-relaxed">
              Groom Studio Is A First-Of-Its-Kind Offline Sales Agent Onboarding Programme. Induction, Orientation, Brand Immersion, And First-Week Roleplay Come Together In-Studio, So Every New Hire Is Ready For The Floor Before Their First Live Call.
            </p>
          </div>
        </div>

        {/* Stacked Cards */}
        <div className="cards-container relative flex justify-center items-center mb-20 min-h-87.5 md:min-h-100">
          
          {/* Left Card (Green) */}
          <div className="card-left absolute left-0 md:left-[10%] lg:left-[20%] w-70 md:w-80 h-80 bg-emerald-300 rounded-3xl p-8 flex flex-col justify-center text-emerald-900 z-10 shadow-xl opacity-90 transition-transform hover:scale-105 hover:z-30 cursor-default">
            <h4 className="text-xl font-bold text-center mb-4">Handover</h4>
            <p className="text-sm text-center font-medium leading-relaxed">
              Every Agent Walks Away With A Documented Activity Report, Setting Up Their Revenue Manager.
            </p>
          </div>

          {/* Right Card (Orange) */}
          <div className="card-right absolute right-0 md:right-[10%] lg:right-[20%] w-70 md:w-80 h-80 bg-orange-400 rounded-3xl p-8 flex flex-col justify-center text-orange-950 z-10 shadow-xl opacity-90 transition-transform hover:scale-105 hover:z-30 cursor-default">
            <h4 className="text-xl font-bold text-center mb-4">Orientation</h4>
            <p className="text-sm text-center font-medium leading-relaxed">
              Access To Directory, Tooling Setup, Playbook, And Clear Expectations Are Put Into Place During The First Week.
            </p>
          </div>

          {/* Center Card (Blue) */}
          <div className="card-center relative z-20 w-75 md:w-85 h-90 bg-[#3b82f6] rounded-3xl p-8 flex flex-col justify-center text-white shadow-2xl shadow-blue-500/40">
            <div className="bg-white/20 backdrop-blur-md rounded-full py-2 px-6 mx-auto mb-6 inline-block font-bold">
              Induction
            </div>
            <p className="text-base text-center font-medium leading-relaxed">
              New Agents Learn Your Brand, Product, And ICP Straight From Working Sellers, Not Slide Decks.
            </p>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center prog-text">
          <Link href="/book" className="group flex items-center gap-3 bg-white border border-slate-200 rounded-full pl-2 pr-6 py-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            <div className="w-8 h-8 rounded-full bg-green-300 flex items-center justify-center text-green-900 font-bold text-sm">
              Book
            </div>
            <span className="font-semibold text-slate-800">Groom Studio Session</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
