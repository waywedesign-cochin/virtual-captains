// Central content/config for the Organisations landing page.
// Swap image URLs for real brand assets before shipping to production —
// these point at open-source placeholder services (pravatar.cc, Unsplash)
// so the page renders fully out of the box.

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
  /** position expressed as % of the orbit container, so it stays responsive */
  top: string;
  left: string;
  size: number;
  badge: "green" | "blue";
  floatDelay: number;
};

// Positions approximate the reference composition: a loose scatter of
// nine avatars around three concentric "radar" rings.
export const orbitAvatars: Avatar[] = [
  { id: 1, src: "https://i.pravatar.cc/160?img=13", alt: "Sales agent portrait", top: "6%", left: "24%", size: 64, badge: "green", floatDelay: 0 },
  { id: 2, src: "https://i.pravatar.cc/160?img=32", alt: "Sales agent portrait", top: "12%", left: "62%", size: 58, badge: "blue", floatDelay: 0.4 },
  { id: 3, src: "https://i.pravatar.cc/160?img=51", alt: "Sales agent portrait", top: "18%", left: "88%", size: 62, badge: "blue", floatDelay: 0.8 },
  { id: 4, src: "https://i.pravatar.cc/160?img=47", alt: "Sales agent portrait", top: "21%", left: "42%", size: 70, badge: "green", floatDelay: 1.2 },
  { id: 5, src: "https://i.pravatar.cc/160?img=5", alt: "Sales agent portrait", top: "60%", left: "9%", size: 66, badge: "green", floatDelay: 1.6 },
  { id: 6, src: "https://i.pravatar.cc/160?img=68", alt: "Sales agent portrait", top: "70%", left: "31%", size: 60, badge: "blue", floatDelay: 2 },
  { id: 7, src: "https://i.pravatar.cc/160?img=33", alt: "Sales agent portrait", top: "66%", left: "53%", size: 64, badge: "green", floatDelay: 0.6 },
  { id: 8, src: "https://i.pravatar.cc/160?img=59", alt: "Sales agent portrait", top: "78%", left: "73%", size: 58, badge: "blue", floatDelay: 1.1 },
  { id: 9, src: "https://i.pravatar.cc/160?img=15", alt: "Sales agent portrait", top: "94%", left: "31%", size: 56, badge: "green", floatDelay: 1.9 },
];

export const programTabs = ["Sales Audit", "Outbound Lead Gen", "Sales Training"] as const;

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
