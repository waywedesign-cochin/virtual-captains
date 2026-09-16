import type {
  AudienceSlide,
  CurriculumModule,
  FooterColumn,
  OrbitLabel,
  PartnerSlot,
} from "@/types";

export const site = {
  name: "Virtual Captains",
  bookACall: { label: "Book A Call", href: "/book-a-call" },
} as const;

/* --------------------------------------------------------------------------
   Hero
   -------------------------------------------------------------------------- */

/**
 * Angles are degrees from the apex of the primary orbit arc. They reproduce
 * the reference node positions (About 258px, SalesX 418, Program 613,
 * Organisations 853, Partner 1064, Resources 1229 at a 1512 frame) while
 * remaining resolution-independent.
 */
export const orbitLabels: ReadonlyArray<OrbitLabel> = [
  { label: "About", href: "/about", angle: -30.8 },
  { label: "SalesX", href: "/salesx", angle: -19.75 },
  { label: "Program", href: "/program", angle: -7.3 },
  { label: "Organisations", href: "/organisations", angle: 7.8 },
  { label: "Partner", href: "/partner", angle: 21.3 },
  { label: "Resources", href: "/resources", angle: 33.0 },
];

export const hero = {
  eyebrow: "Launch Your Career as a",
  headline: ["High-Performing", "Seller"],
  primaryCta: { label: "Apply to Next Cohort", href: "/apply" },
  secondaryCta: { label: "Partner Network", href: "/partner" },
} as const;

/* --------------------------------------------------------------------------
   Curriculum
   -------------------------------------------------------------------------- */

export const curriculum = {
  title: "Curriculum",
  /**
   * NOTE — reconstructed copy. In the reference this statement sits behind the
   * glass cards and its left half is occluded, so the leading words are an
   * informed reading rather than a verbatim transcription. Confirm with the
   * client before launch.
   */
  statement: ["12 Weeks · 100s of Reps", "1 Unstoppable Sales Career"],
} as const;

/**
 * Six cards so the scatter reads as full as the Orchid reference this
 * section's animation is modelled on. The first two are the reference's
 * confirmed copy; the remaining four are placeholder module names that
 * round the sequence out to 12 weeks — flagged below, same convention as
 * the placeholder audience slides. Confirm with the client before launch.
 * The array order drives both the flight stagger and each card's resting
 * slot (see curriculumCardSlots in CurriculumStage), so reordering these
 * changes where a module ends up on screen.
 */
export const curriculumModules: ReadonlyArray<CurriculumModule> = [
  {
    id: "foundations",
    title: "Foundations",
    weeks: "01–03",
    accent: "cyan",
    body: "Sales math, buyer psychology, and the anatomy of a B2B deal. Reading a P&L and understanding a pipeline.",
  },
  {
    id: "rehearse",
    title: "Rehearse",
    weeks: "04–07",
    accent: "pink",
    body: "Daily AI-simulated calls covering discovery, objection handling, and negotiation, paired with transcript reviews from your coach.",
  },
  {
    id: "discovery",
    title: "Discovery",
    weeks: "08–09",
    accent: "cyan",
    body: "Qualification frameworks and multi-stakeholder discovery — finding the real budget, the real timeline, and the real decision-maker.",
    placeholder: true,
  },
  {
    id: "negotiate",
    title: "Negotiate",
    weeks: "10",
    accent: "pink",
    body: "Structuring win-win deals, holding the line on price, and navigating procurement without losing the room.",
    placeholder: true,
  },
  {
    id: "enterprise",
    title: "Enterprise Motion",
    weeks: "11",
    accent: "cyan",
    body: "Selling into complex orgs: champions, economic buyers, and multi-threaded deal cycles that run for months, not days.",
    placeholder: true,
  },
  {
    id: "certify",
    title: "Certify & Place",
    weeks: "12",
    accent: "pink",
    body: "A live-call certification exam, then placement into a partner sales org — your first quota starts here.",
    placeholder: true,
  },
];

/* --------------------------------------------------------------------------
   Partner Network
   -------------------------------------------------------------------------- */

export const partner = {
  title: ["Partner", "Network"],
  hubLabel: "Logos",
  sideHeading: "Get Recruited by Industry Giants Leading the Global Market",
  sideBody: "Our hiring network connects top-performing sellers directly to enterprise SaaS, financial services, logistics, industrial manufacturing, and consumer tech leaders across India, the Middle East, and Southeast Asia."
} as const;

const homeLogos = [
  "/home/AHAD - LOGO.png",
  "/home/MoonHive -Logo.jpg.jpeg",
  "/home/SalesX Logo Final-01.png",
  "/home/SalesX Logo Final-02.png",
  "/home/Sigma Life Unifirm Logo Png (1).png",
  "/home/logo.png",
  "/home/skylark_information_technologies_logo.jpg.jpeg",
  "/home/SalesX Logo Final White.png"
];

/** Eight placeholder slots in a 4 x 2 grid, matching the reference. */
export const partnerSlots: ReadonlyArray<PartnerSlot> = Array.from(
  { length: 8 },
  (_, index): PartnerSlot => ({
    id: `partner-${index + 1}`,
    name: "Logos",
    image: homeLogos[index]
  }),
);

/* --------------------------------------------------------------------------
   Who this is for
   -------------------------------------------------------------------------- */

export const whoThisIsFor = { title: "whoThisIsFor" } as const;

export const audienceSlides: ReadonlyArray<AudienceSlide> = [
  {
    id: "fresh-graduates",
    eyebrow: "Fresh Graduates",
    title: "The High-Velocity On-Ramp",
    body: "Launch directly into high-paying sales, business development, and GTM roles without waiting through months of low-level onboarding.",
    cta: "Enroll Now",
    href: "/apply",
    image: "/inidividuals/wave.webp",
    waveHue: 0,
  },
  {
    id: "career-switchers",
    eyebrow: "Career Switchers",
    title: "The Second-Act Accelerator",
    body: "Convert the domain expertise you already have into quota-carrying revenue work, with a structured bridge from your current craft into enterprise selling.",
    cta: "Enroll Now",
    href: "/apply",
    image: "/inidividuals/wave.webp",
    waveHue: -38,
    placeholder: true,
  },
  {
    id: "working-reps",
    eyebrow: "Working Reps",
    title: "The Quota-Breaker Program",
    body: "Already selling but plateaued. Rebuild your discovery, multithreading and negotiation reps against live scenarios until the numbers move.",
    cta: "Enroll Now",
    href: "/apply",
    image: "/inidividuals/wave.webp",
    waveHue: 42,
    placeholder: true,
  },
];

/* --------------------------------------------------------------------------
   Career CTA
   -------------------------------------------------------------------------- */

export const careerCta = {
  lead: "Your Unstoppable ",
  accent: "Sales Career",
  trail: " Starts Here",
} as const;

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */

export const footerWord = "INDIVIDUALS";

export const footerColumns: ReadonlyArray<FooterColumn> = [
  {
    id: "company",
    links: [
      { label: "About", href: "/about" },
      { label: "Programs", href: "/programs" },
      { label: "Organisation", href: "/organisations" },
      { label: "Partner", href: "/partner" },
    ],
  },
  {
    id: "resources",
    links: [
      { label: "Blogs", href: "/blog" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const footerMeta = {
  product: "SalesX",
  privacy: { label: "Privacy Policy", href: "/privacy" },
  copyright: `© All Rights Reserved by Virtual Captains ${new Date().getFullYear()}`,
  credit: { label: "Built By Way WeDesign", href: "https://waywedesign.com" },
} as const;
