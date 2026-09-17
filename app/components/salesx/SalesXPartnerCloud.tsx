"use client";

import React, { useState } from "react";

interface PartnerItem {
  id: string;
  name: string;
  category: string;
  coords: { x: string; y: string };
  delay: string;
}

export default function SalesXPartnerCloud() {
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);

  const partners: PartnerItem[] = [
    { id: "p1", name: "Salesforce CRM", category: "CRM Integration", coords: { x: "-32%", y: "-130%" }, delay: "0.1s" },
    { id: "p2", name: "HubSpot", category: "Inbound Pipeline", coords: { x: "28%", y: "-140%" }, delay: "0.2s" },
    { id: "p3", name: "Gong.io", category: "Conversation Intelligence", coords: { x: "-55%", y: "-70%" }, delay: "0.15s" },
    { id: "p4", name: "Outreach", category: "Sales Engagement", coords: { x: "55%", y: "-70%" }, delay: "0.25s" },
    { id: "p5", name: "Stripe Billing", category: "Revenue Operations", coords: { x: "-68%", y: "0%" }, delay: "0.3s" },
    { id: "p6", name: "Apollo.io", category: "Prospecting Data", coords: { x: "68%", y: "0%" }, delay: "0.35s" },
    { id: "p7", name: "Salesloft", category: "Cadence Automation", coords: { x: "-50%", y: "80%" }, delay: "0.2s" },
    { id: "p8", name: "ZoomInfo", category: "Buyer Intent Signal", coords: { x: "48%", y: "85%" }, delay: "0.4s" },
    { id: "p9", name: "Snowflake", category: "Telemetry Warehouse", coords: { x: "-20%", y: "140%" }, delay: "0.25s" },
    { id: "p10", name: "Slack", category: "Real-time Deal Alerts", coords: { x: "18%", y: "140%" }, delay: "0.3s" },
    { id: "p11", name: "Datadog", category: "Uptime Telemetry", coords: { x: "0%", y: "-170%" }, delay: "0.45s" },
    { id: "p12", name: "Notion", category: "Playbook Knowledge", coords: { x: "-5%", y: "185%" }, delay: "0.5s" },
  ];

  return (
    <section className="relative py-32 sm:py-44 overflow-hidden bg-[#07090e] border-t border-blue-950/40">
      {/* Central Blue Ambient Radial Field */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-187.5 h-125 bg-blue-600/10 blur-[150px] pointer-events-none -z-10" />

      <div className="w-full max-w-350 mx-auto px-4 sm:px-8 lg:px-12 text-center">
        {/* Central Title with Surrounding Floating Cloud */}
        <div className="relative min-h-115 sm:min-h-130 flex items-center justify-center">
          {/* Central Title & Subtitle */}
          <div className="relative z-20 max-w-xl mx-auto px-6 py-8 rounded-3xl bg-[#07090e]/80 backdrop-blur-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-[#38bdf8] backdrop-blur-md mb-4">
              <span>Enterprise Ecosystem</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              Partner Network
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Sync simulation telemetry, readiness scores, and coaching insights
              instantly with your existing revenue stack.
            </p>
          </div>

          {/* Floating Partner Badges (Desktop Orbit Cloud) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            {partners.map((partner) => {
              const isHovered = hoveredPartner === partner.id;
              return (
                <div
                  key={partner.id}
                  className="absolute top-1/2 left-1/2 pointer-events-auto transition-transform duration-700 ease-out"
                  style={{
                    transform: `translate(calc(-50% + ${partner.coords.x}), calc(-50% + ${partner.coords.y}))`,
                  }}
                >
                  <div
                    onMouseEnter={() => setHoveredPartner(partner.id)}
                    onMouseLeave={() => setHoveredPartner(null)}
                    className={`group cursor-pointer rounded-2xl border px-4 py-2 sm:py-2.5 backdrop-blur-xl transition-all duration-300 transform hover:scale-110 shadow-lg ${
                      isHovered
                        ? "border-[#38bdf8] bg-[#0c143d] shadow-[0_0_25px_rgba(56,189,248,0.5)] z-30"
                        : "border-blue-500/25 bg-[#090d29]/80 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#38bdf8] group-hover:animate-ping" />
                      <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                        {partner.name}
                      </span>
                    </div>
                    {isHovered && (
                      <div className="text-[10px] text-[#38bdf8] text-left mt-0.5 font-medium animate-fadeIn">
                        {partner.category}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Grid Layout for partner pills */}
          <div className="md:hidden mt-8 grid grid-cols-2 gap-3 w-full max-w-md mx-auto">
            {partners.slice(0, 8).map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-blue-500/20 bg-[#090e2a] px-3 py-2 text-center text-xs font-semibold text-white shadow"
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
