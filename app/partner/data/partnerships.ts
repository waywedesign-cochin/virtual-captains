import { PartnershipModel } from "../types";

export const PARTNERSHIP_MODELS: PartnershipModel[] = [
  {
    id: "academic",
    category: "Academic",
    title: "Academic & Institution Partners",
    description:
      "Co-brand our ISM-certified sales curriculum with your institution. Offer your students a job-ready certification powered by SalesX and backed by real execution experience.",
    features: [
      "Co-branded certification programs",
      "Placement support for your students",
      "White-label curriculum options",
      "Revenue share model available",
    ],
    ctaText: "Explore Academic Partnership",
    iconType: "academic",
    themeColor: "#2563eb",
  },
  {
    id: "corporate",
    category: "Corporate",
    badge: "MOST POPULAR",
    isPopular: true,
    title: "Corporate & Hiring Partners",
    description:
      "Get first access to our pipeline of VC Certified Sales Professionals. Build a dedicated talent channel or let us train your existing team to exceed revenue targets.",
    features: [
      "Priority access to certified graduates",
      "Custom corporate training programs",
      "Dedicated talent pipeline management",
      "Ongoing performance coaching",
    ],
    ctaText: "Become a Hiring Partner",
    iconType: "corporate",
    themeColor: "#1d4ed8",
  },
  {
    id: "brand",
    category: "Brand",
    title: "Brand & Channel Partners",
    description:
      "Align your brand with India's fastest-growing sales training platform. Co-market, co-create content, or sponsor cohorts to reach an ambitious, career-driven audience.",
    features: [
      "Co-marketing campaigns",
      "Sponsored cohorts & events",
      "Content collaboration",
      "Brand visibility across SalesX platform",
    ],
    ctaText: "Explore Brand Partnership",
    iconType: "brand",
    themeColor: "#059669",
  },
];
