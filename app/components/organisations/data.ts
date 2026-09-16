// Central content/config for the Organisations landing page.
// Swap image URLs for real brand assets before shipping to production.

export const navLinks = [
  { label: "About", href: "/about" },
  { label: "SalesX", href: "/salesx" },
  { label: "Programs", href: "/programs" },
  { label: "Individuals", href: "/individuals" },
  { label: "Partner", href: "/partner" },
  { label: "Resources", href: "/resources" },
] as const;

export type Avatar = {
  id: number;
  src: string;
  alt: string;
  top: string;
  left: string;
  size: number;
  badge: "green" | "blue";
  floatDelay: number;
};

export const orbitAvatars: Avatar[] = [
  {
    id: 1,
    src: "https://i.pravatar.cc/160?img=13",
    alt: "Sales agent portrait",
    top: "6%",
    left: "24%",
    size: 64,
    badge: "green",
    floatDelay: 0,
  },
  {
    id: 2,
    src: "https://i.pravatar.cc/160?img=32",
    alt: "Sales agent portrait",
    top: "12%",
    left: "62%",
    size: 58,
    badge: "blue",
    floatDelay: 0.4,
  },
  {
    id: 3,
    src: "https://i.pravatar.cc/160?img=51",
    alt: "Sales agent portrait",
    top: "18%",
    left: "88%",
    size: 62,
    badge: "blue",
    floatDelay: 0.8,
  },
  {
    id: 4,
    src: "https://i.pravatar.cc/160?img=47",
    alt: "Sales agent portrait",
    top: "21%",
    left: "42%",
    size: 70,
    badge: "green",
    floatDelay: 1.2,
  },
  {
    id: 5,
    src: "https://i.pravatar.cc/160?img=5",
    alt: "Sales agent portrait",
    top: "60%",
    left: "9%",
    size: 66,
    badge: "green",
    floatDelay: 1.6,
  },
  {
    id: 6,
    src: "https://i.pravatar.cc/160?img=68",
    alt: "Sales agent portrait",
    top: "70%",
    left: "31%",
    size: 60,
    badge: "blue",
    floatDelay: 2,
  },
  {
    id: 7,
    src: "https://i.pravatar.cc/160?img=33",
    alt: "Sales agent portrait",
    top: "66%",
    left: "53%",
    size: 64,
    badge: "green",
    floatDelay: 0.6,
  },
  {
    id: 8,
    src: "https://i.pravatar.cc/160?img=59",
    alt: "Sales agent portrait",
    top: "78%",
    left: "73%",
    size: 58,
    badge: "blue",
    floatDelay: 1.1,
  },
  {
    id: 9,
    src: "https://i.pravatar.cc/160?img=15",
    alt: "Sales agent portrait",
    top: "94%",
    left: "31%",
    size: 56,
    badge: "green",
    floatDelay: 1.9,
  },
];

export const programTabs = [
  "Groom Studio",
  "Sales Audit",
  "Outbound Lead Gen",
  "Sales Training",
] as const;

export type ProgramCard = {
  id: string;
  badge: string;
  title: string;
  description: string;
  highlight: string;
  bgClass: string; // exact hex/class matching the design: mint #82d6c3, blue #2f70ed, terracotta #db8364
};

export type ProgrammeItem = {
  id: string;
  tabTitle: string;
  badgeCategory: string;
  badgeMode: string;
  badgeModeType: "offline" | "audit" | "growth" | "training";
  title: string;
  description: string;
  ctaText: string;
  ctaAction: string;
  accentColor: string;
  cards: ProgramCard[];
};

export const allProgrammes: ProgrammeItem[] = [
  {
    id: "groom-studio",
    tabTitle: "Groom Studio",
    badgeCategory: "First-Time Induction & Orientation",
    badgeMode: "Offline",
    badgeModeType: "offline",
    title: "Every New Hire Prepared Before Their First Call",
    description:
      "Groom Studio is a first-of-its-kind offline sales agent onboarding programme. Induction, orientation, brand immersion, and first-week roleplay come together in-studio, so every new hire is ready for the floor before their first live call.",
    ctaText: "Book Groom Studio Session",
    ctaAction: "/book?program=groom-studio",
    accentColor: "#2563eb",
    cards: [
      {
        id: "gs-handover",
        badge: "Manager Transition",
        title: "Handover",
        description:
          "Every Agent Walks Away With A Documented Activity Report, Setting Up Their Revenue Manager.",
        highlight: "Verified Day-One Output",
        bgClass: "bg-[#82d6c3]",
      },
      {
        id: "gs-induction",
        badge: "Core Immersion",
        title: "Induction",
        description:
          "New Agents Learn Your Brand, Product, And ICP Straight From Working Sellers, Not Slide Decks.",
        highlight: "Live Roleplay & Scenarios",
        bgClass: "bg-[#2f70ed]",
      },
      {
        id: "gs-orientation",
        badge: "Week 01 Setup",
        title: "Orientation",
        description:
          "Directory, Tooling, Playbook, And Clear Manager Expectations All Fall Into Place Within The First Week.",
        highlight: "100% Floor Readiness",
        bgClass: "bg-[#db8364]",
      },
      {
        id: "gs-roleplay",
        badge: "Simulated Floor",
        title: "Roleplay Studio",
        description:
          "Realistic objection drills, dialer simulations, and live coaching before reps ever touch a live customer lead.",
        highlight: "Zero Risk Practice",
        bgClass: "bg-[#71c4f0]",
      },
    ],
  },
  {
    id: "sales-audit",
    tabTitle: "Sales Audit",
    badgeCategory: "Funnel & Conversation Diagnostic",
    badgeMode: "Diagnostic",
    badgeModeType: "audit",
    title: "Uncover Hidden Friction Leaking Your Pipeline Revenue",
    description:
      "A forensic diagnostic of your entire revenue engine. From recorded sales calls to conversion drop-offs and tooling friction, we identify exactly where deals stall and deliver turnkey remedies.",
    ctaText: "Schedule Sales Audit",
    ctaAction: "/book?program=sales-audit",
    accentColor: "#0ea5e9",
    cards: [
      {
        id: "sa-funnel",
        badge: "Pipeline Forensics",
        title: "Funnel Diagnostic",
        description:
          "Stage-By-Stage Drop-Off Analysis Locating Exact Bottlenecks From Lead Capture To Closed-Won.",
        highlight: "Conversion Drop-off Mapping",
        bgClass: "bg-[#78cadc]",
      },
      {
        id: "sa-call",
        badge: "Speech & Pitch",
        title: "Call Intelligence",
        description:
          "Deep Audit Of 100+ Live Sales Call Recordings Evaluating Objection Handling, Clarity, And Closing Leverage.",
        highlight: "Scored Benchmark Matrix",
        bgClass: "bg-[#0284c7]",
      },
      {
        id: "sa-action",
        badge: "Revenue Roadmap",
        title: "Action Blueprint",
        description:
          "Prioritized 30-Day Corrective Roadmap With Revised Pitch Scripts, Objection Cheatsheets, And Cadences.",
        highlight: "Immediate Win Milestones",
        bgClass: "bg-[#93a2e8]",
      },
      {
        id: "sa-cadence",
        badge: "Process Review",
        title: "Tech Stack Audit",
        description:
          "Assessment Of CRM Adoption, Dialer Efficiency, And Email Sequence Response Rates Across The Rep Floor.",
        highlight: "Workflow Speed Gain",
        bgClass: "bg-[#65bfa7]",
      },
    ],
  },
  {
    id: "outbound-lead-gen",
    tabTitle: "Outbound Lead Gen",
    badgeCategory: "Dedicated Pipeline Engine",
    badgeMode: "Turnkey SDR",
    badgeModeType: "growth",
    title: "High-Intent Enterprise Pipeline Delivered to Your Reps",
    description:
      "We build and orchestrate multi-touch outbound sales engines. Precision account research, cold calling, and bespoke email cadences that deliver qualified decision-maker meetings straight to your calendar.",
    ctaText: "Launch Outbound Engine",
    ctaAction: "/book?program=outbound-lead-gen",
    accentColor: "#f97316",
    cards: [
      {
        id: "ob-targeting",
        badge: "Account Precision",
        title: "Target Discovery",
        description:
          "Multi-Source Buyer Intent Enrichment Pinpointing Verified Decision-Makers Matching Your Ideal Profile.",
        highlight: "Zero Waste Account Lists",
        bgClass: "bg-[#d98bb8]",
      },
      {
        id: "ob-cadence",
        badge: "Multi-Touch Motion",
        title: "Outbound Engine",
        description:
          "High-Cadence Phone, Email, And LinkedIn Sequences Converting Cold Prospects Into Enthusiastic Buyers.",
        highlight: "3.2x Average Meeting Yield",
        bgClass: "bg-[#ea580c]",
      },
      {
        id: "ob-handoff",
        badge: "Sales Handoff",
        title: "Qualified Meetings",
        description:
          "Strict BANT-Verified Prospects Booked Directly Onto Your Account Executives' Diaries With Complete Logs.",
        highlight: "Guaranteed Show-Up Rate",
        bgClass: "bg-[#e2936a]",
      },
      {
        id: "ob-personalization",
        badge: "Hyper-Relevant",
        title: "Contextual Outreach",
        description:
          "Dynamic Pitch Angles Tailored To Specific Industry Triggers, Funding Rounds, And Executive Movements.",
        highlight: "High Response Ratio",
        bgClass: "bg-[#d8a85c]",
      },
    ],
  },
  {
    id: "sales-training",
    tabTitle: "Sales Training",
    badgeCategory: "Continuous Capability Uplift",
    badgeMode: "Mastery",
    badgeModeType: "training",
    title: "Transform Average Reps into Predictable High Performers",
    description:
      "Battle-tested sales workshops and live call coaching tailored to your product value. We train frontline reps to command negotiations, overcome complex objections, and defend deal margins without discounting.",
    ctaText: "Enroll in Sales Training",
    ctaAction: "/book?program=sales-training",
    accentColor: "#8b5cf6",
    cards: [
      {
        id: "st-objection",
        badge: "Live Tactical",
        title: "Objection Mastery",
        description:
          "Instinctive Frameworks Turning Knee-Jerk Pushbacks, Budget Freezes, And Stalls Into Closing Opportunities.",
        highlight: "Live Simulation Drills",
        bgClass: "bg-[#b89fe8]",
      },
      {
        id: "st-closing",
        badge: "Value Realization",
        title: "Deal Closing",
        description:
          "Mastering Multi-Stakeholder Consensus, Champion Empowerment, And Margin Defense In High-Stakes Deals.",
        highlight: "Margin Protection Playbook",
        bgClass: "bg-[#7c3aed]",
      },
      {
        id: "st-coaching",
        badge: "Leadership Framework",
        title: "Manager Cadence",
        description:
          "Equip Revenue Leaders With Structured 1-On-1 Inspection Templates, Sprint Reviews, And Coaching Models.",
        highlight: "Sustained Team Retention",
        bgClass: "bg-[#82d6c3]",
      },
      {
        id: "st-discovery",
        badge: "Strategic Questioning",
        title: "Deep Discovery",
        description:
          "Frameworks To Uncover Business Pain, Quantify Operational Loss, And Position Deals As Non-Discretionary.",
        highlight: "Higher Average Deal Size",
        bgClass: "bg-[#60a5fa]",
      },
    ],
  },
];

export const groomCards = [
  {
    id: "induction",
    title: "Induction",
    description:
      "New agents learn your brand, product, and ICP straight from working sellers, not slide decks.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    gradient: "from-[#E8916A] to-[#C96A47]",
  },
  {
    id: "orientation",
    title: "Orientation",
    description:
      "Territory, tooling, playbook, and manager expectations all fall into place within the first week.",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    gradient: "from-[#5FAE93] to-[#3C7C63]",
  },
] as const;

export const footerColumns = [
  {
    heading: "Company",
    links: ["About", "Programs", "Individuals", "Partner"],
  },
  {
    heading: "Resources",
    links: ["Blogs", "Newsletter", "Contact"],
  },
] as const;
