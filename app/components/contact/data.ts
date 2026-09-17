// Central content for the Contact page.
//
// Sourced from Virtual Captains' own public site (virtualcaptains.com) as of
// Sep 2026: the two office addresses and the India map coordinates come from
// their live /contact/ page, and the WhatsApp number from their /about/
// page. No public email address was found anywhere on their site — swap in
// a real inbox before shipping (search for "PLACEHOLDER" below).

export const siteNavLinks = [
  { label: "About", href: "/about" },
  { label: "SalesX", href: "/salesx" },
  { label: "Programs", href: "/programs" },
  { label: "Organisations", href: "/organisations" },
  { label: "Individuals", href: "/individuals" },
  { label: "Partner", href: "/partner" },
  { label: "Resources", href: "/resources" },
] as const;

export type Office = {
  id: string;
  flag: string;
  country: string;
  tag: string;
  addressLines: string[];
  mapsHref: string;
  /** Position on the decorative globe graphic, as % of its bounding box. */
  pin: { top: string; left: string };
};

export const offices: Office[] = [
  {
    id: "india",
    flag: "🇮🇳",
    country: "India",
    tag: "Headquarters",
    addressLines: [
      "Kairali Apartments, Shihab Thangal Road,",
      "Panampilly Nagar, Ernakulam,",
      "Kerala 682015, India",
    ],
    // Coordinates as published on Virtual Captains' own embedded map.
    mapsHref: "https://www.google.com/maps/search/?api=1&query=9.9552795,76.2960201",
    pin: { top: "58%", left: "68%" },
  },
  {
    id: "uae",
    flag: "🇦🇪",
    country: "United Arab Emirates",
    tag: "Regional Office",
    addressLines: [
      "Techno Hub, A1, A5 Building,",
      "Dubai Digital Park,",
      "Dubai Silicon Oasis, UAE",
    ],
    // No public precise coordinates — search by address instead of guessing lat/lng.
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "Techno Hub A1 A5 Building Dubai Digital Park Dubai Silicon Oasis UAE"
      ),
    pin: { top: "46%", left: "56%" },
  },
];

export const quickContacts = [
  {
    id: "whatsapp",
    label: "Chat on WhatsApp",
    value: "+91 85901 40169",
    href: "https://wa.me/918590140169",
    icon: "whatsapp" as const,
  },
  {
    id: "email",
    label: "Email us",
    // PLACEHOLDER — no public email is listed on virtualcaptains.com; replace
    // with a real monitored inbox before this page goes live.
    value: "hello@virtualcaptains.com",
    href: "mailto:hello@virtualcaptains.com",
    icon: "mail" as const,
  },
] as const;

export const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/virtual-captains/" },
  { label: "Instagram", href: "https://www.instagram.com/virtualcaptains/" },
  { label: "YouTube", href: "https://www.youtube.com/@VirtualCaptains" },
] as const;

export const trustStats = [
  { value: "15,000+", label: "Professionals trained" },
  { value: "500+", label: "Sales teams coached" },
  { value: "8+", label: "Countries served" },
] as const;

export const footerColumns = [
  { heading: "Company", links: ["About", "Programs", "Individuals", "Partner"] },
  { heading: "Resources", links: ["Blogs", "Newsletter", "Contact"] },
] as const;
