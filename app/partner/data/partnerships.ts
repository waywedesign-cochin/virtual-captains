import { PartnershipModel } from "../types";

export const PARTNERSHIP_MODELS: PartnershipModel[] = [
  {
    id: "academic",
    category: "Academic",
    title: "Academic & Institution Partners",
    number: "01",
    verb: "Educate",
    headline: "Shape the Next Generation of Sales Talent.",
    description:
      "Give students practical sales skills through an ISM-certified SalesX curriculum, co-branded certification programs, and placement support that prepares them for real-world sales careers.",
    features: [
      "Co-branded certification programs",
      "Placement support for your students",
      "White-label curriculum options",
      "Revenue share model available",
    ],
    ctaText: "Explore Academic Partnership",
    iconType: "academic",
    themeColor: "#38bdf8",
  },
  {
    id: "corporate",
    category: "Corporate",
    badge: "MOST POPULAR",
    isPopular: true,
    title: "Corporate & Hiring Partners",
    number: "02",
    verb: "Build",
    headline: "Turn Stalled Deals Into Moving Pipeline.",
    description:
      "Strengthen your sales team with certified sales professionals, dedicated talent pipelines, corporate sales training, and ongoing coaching built around performance.",
    features: [
      "Priority access to certified graduates",
      "Custom corporate training programs",
      "Dedicated talent pipeline management",
      "Ongoing performance coaching",
    ],
    ctaText: "Become a Hiring Partner",
    iconType: "corporate",
    themeColor: "#38bdf8",
  },
  {
    id: "brand",
    category: "Brand",
    title: "Brand & Channel Partners",
    number: "03",
    verb: "Amplify",
    headline: "Place Your Brand in Front of the Right Buyers.",
    description:
      "Reach relevant business audiences through co-marketing campaigns, sponsored cohorts, content collaborations, and visibility across the SalesX ecosystem.",
    features: [
      "Co-marketing campaigns",
      "Sponsored cohorts & events",
      "Content collaboration",
      "Brand visibility across SalesX platform",
    ],
    ctaText: "Explore Brand Partnership",
    iconType: "brand",
    themeColor: "#38bdf8",
  },
];
