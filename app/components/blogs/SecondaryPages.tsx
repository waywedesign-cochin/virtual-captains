import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Send, Sparkles } from 'lucide-react';

interface SimplePageProps {
  onBackToBlog: () => void;
  onNavigate: (path: string) => void;
  onBookCall: () => void;
}

export const WorksPage: React.FC<SimplePageProps> = ({ onBackToBlog, onBookCall }) => {
  const projects = [
    {
      title: 'Aetherion OS',
      category: 'Design Systems & Spatial UI',
      year: '2026',
      desc: 'Next-generation desktop windowing paradigm and fluid spatial interactions for enterprise workstation users.',
      metric: '+140% Daily User Focus Retention',
      image: '/assets/blog/crafting_interfaces.jpg',
    },
    {
      title: 'Verve Financial',
      category: 'Brand Direction & Web Platform',
      year: '2025',
      desc: 'Architecting an obsidian aesthetic with microsecond reactive execution charts for European fintech powerhouse.',
      metric: '€4.2B In Transaction Volume Flow',
      image: '/assets/blog/convert_scale.png',
    },
    {
      title: 'Solstice Health',
      category: 'Mobile Touch Architecture',
      year: '2025',
      desc: 'Tactile biometric tracking interface optimized for low-friction daily health entries and physician sync.',
      metric: '4.9 App Store Rating Across 300K Reviews',
      image: '/assets/blog/brands_digital.png',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4 max-w-2xl">
        <button
          onClick={onBackToBlog}
          className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#141414] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog</span>
        </button>
        <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#141414] tracking-tight">
          Selected Works
        </h1>
        <p className="text-[#737373] text-sm sm:text-base leading-relaxed">
          A curated selection of programs, strategic frameworks, and enterprise sales transformations engineered at Virtual Captains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            data-cursor="work"
            data-cursor-text="Open Project"
            className="p-6 rounded-[28px] bg-white border border-black/4 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all space-y-4 group flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl aspect-16/10 bg-[#F2EFE9]">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-[#A4A4A4]">
                <span className="text-[#141414] font-medium bg-black/5 px-2.5 py-0.5 rounded-full">
                  {proj.category}
                </span>
                <span>{proj.year}</span>
              </div>
              <h3 className="text-xl font-serif font-normal text-[#141414] group-hover:text-neutral-600 transition-colors">
                {proj.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                {proj.desc}
              </p>
            </div>
            <div className="pt-3 border-t border-black/4 text-xs font-medium text-emerald-700">
              {proj.metric}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AboutPage: React.FC<SimplePageProps> = ({ onBackToBlog, onBookCall }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <button
        onClick={onBackToBlog}
        className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#141414] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Blog</span>
      </button>

      <div className="space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-[#141414] tracking-tight leading-[1.1]">
          We believe strategy is the invisible foundation of great design.
        </h1>
        <p className="text-[#555555] text-lg sm:text-xl leading-relaxed font-normal">
          Virtual Captains was founded on a singular conviction: sales organizations succeed when behavioral psychology, rigorous simulation, and real-world execution intersect.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-black/6">
        <div className="p-6 bg-white rounded-2xl border border-black/4 space-y-1 shadow-sm">
          <p className="text-3xl font-serif font-normal text-[#141414]">40+</p>
          <p className="text-xs text-[#737373]">Ventures Advised</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-black/4 space-y-1 shadow-sm">
          <p className="text-3xl font-serif font-normal text-[#141414]">12</p>
          <p className="text-xs text-[#737373]">Design Honors</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-black/4 space-y-1 shadow-sm">
          <p className="text-3xl font-serif font-normal text-[#141414]">100%</p>
          <p className="text-xs text-[#737373]">In-House Craft</p>
        </div>
      </div>
    </div>
  );
};

export const PricingPage: React.FC<SimplePageProps> = ({ onBackToBlog, onBookCall }) => {
  const plans = [
    {
      name: 'Design Advisory',
      price: '$4,500',
      period: '/ month',
      desc: 'Weekly strategic design sprints, UX audits, and product direction for early-stage founders.',
      features: ['Bi-weekly architecture reviews', 'Direct Slack access', 'Figma design teardowns', 'No long-term lock-in'],
    },
    {
      name: 'Full Studio Sprint',
      price: '$9,800',
      period: '/ month',
      featured: true,
      desc: 'End-to-end design & frontend engineering for category-defining web products and identity systems.',
      features: ['Full design system in Figma', 'Next.js & Tailwind implementation', 'Micro-interactions & animations', 'Priority 48h turnaround'],
    },
    {
      name: 'Custom Engagement',
      price: 'Custom',
      period: '',
      desc: 'Bespoke multi-quarter design partnerships for enterprise scale digital transformations.',
      features: ['Dedicated studio team', 'Executive branding sessions', 'Multi-platform rollouts', 'On-site workshops'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4 max-w-2xl">
        <button
          onClick={onBackToBlog}
          className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#141414] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog</span>
        </button>
        <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#141414] tracking-tight">
          Transparent Pricing &amp; Engagements
        </h1>
        <p className="text-[#737373] text-sm sm:text-base leading-relaxed">
          Predictable monthly retainers or dedicated project scopes. No hidden overhead.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-4xl bg-white border transition-all space-y-6 flex flex-col justify-between ${
              plan.featured
                ? 'border-[#141414] shadow-xl relative'
                : 'border-black/5 shadow-sm'
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-[#141414] text-white text-[10px] font-semibold uppercase tracking-wider">
                Most Popular
              </span>
            )}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal text-[#141414]">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-serif font-normal text-[#141414]">{plan.price}</span>
                <span className="text-xs text-[#737373]">{plan.period}</span>
              </div>
              <p className="text-xs text-[#737373] leading-relaxed">{plan.desc}</p>
              <ul className="space-y-2.5 pt-4 border-t border-black/4">
                {plan.features.map((f, fIdx) => (
                  <li key={fIdx} className="text-xs text-[#444444] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#141414] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={onBookCall}
              className={`w-full py-3 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                plan.featured
                  ? 'bg-[#141414] text-white hover:bg-neutral-800'
                  : 'bg-[#F4F2EE] hover:bg-neutral-200 text-[#141414]'
              }`}
            >
              Get started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ServicesPage: React.FC<SimplePageProps> = ({ onBackToBlog, onBookCall }) => {
  const services = [
    {
      num: '01',
      title: 'Digital Direction & Product Strategy',
      desc: 'Mapping market incentives, cognitive frameworks, and high-leverage conversion mechanics before a single pixel is arranged.',
    },
    {
      num: '02',
      title: 'Living Kinetic Brand Systems',
      desc: 'Dynamic design systems engineered as living software token repositories rather than dormant static style manuals.',
    },
    {
      num: '03',
      title: 'Full-Stack Fluid Web Engineering',
      desc: 'Zero-latency React & Next.js architectures with strict compositor discipline, 120fps motion, and accessible dark surfaces.',
    },
    {
      num: '04',
      title: 'AI Heuristic Integration',
      desc: 'Synthesizing deliberate intelligence into editorial pipelines, automated validation loops, and customer journeys.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4 max-w-2xl">
        <button
          onClick={onBackToBlog}
          className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#141414] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog</span>
        </button>
        <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#141414] tracking-tight">
          Capabilities &amp; Services
        </h1>
        <p className="text-[#737373] text-sm sm:text-base leading-relaxed">
          We partner with select venture-backed startups and category leaders to build definitive digital products.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((svc, idx) => (
          <div
            key={idx}
            className="p-8 rounded-[28px] bg-white border border-black/4 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <span className="text-xs font-mono text-[#A4A4A4] font-semibold">{svc.num}</span>
            <h3 className="text-2xl font-serif font-normal text-[#141414]">
              {svc.title}
            </h3>
            <p className="text-sm text-[#737373] leading-relaxed">{svc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
