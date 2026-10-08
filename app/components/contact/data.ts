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
  { label: "News & Updates", href: "/news-and-updates" },
  { label: "Blogs", href: "/blogs" },
] as const;

export type Office = {
  id: string;
  flag: string;
  country: string;
  tag: string;
  /** Short place label shown on the map window */
  city: string;
  addressLines: string[];
  mapsHref: string;
  /** Google Maps embed URL for the card's map window */
  mapEmbed: string;
  /** Position on the decorative globe graphic, as % of its bounding box. */
  pin: { top: string; left: string };
};

const UAE_QUERY =
  "Techno Hub, A5 Building, Dubai Digital Park, Dubai Silicon Oasis, Dubai";

export const offices: Office[] = [
  {
    id: "india",
    flag: "🇮🇳",
    country: "India",
    tag: "Headquarters",
    city: "Kochi, Kerala",
    addressLines: [
      "Covspace Coworking, G K Tower,",
      "Chakkaraparambu Junction, Thammanam,",
      "Kochi, Kerala 682032, India",
    ],
    mapsHref: "https://www.google.com/maps/search/?api=1&query=Covspace+Coworking%2C+Kochi",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3064.6726778701895!2d76.31464137503104!3d9.989583190115306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d2ee9c18baf%3A0xec3c610ff9ed0ee!2sCovspace%20Coworking!5e1!3m2!1sen!2sin!4v1791458194525!5m2!1sen!2sin",
    pin: { top: "58%", left: "68%" },
  },
  {
    id: "uae",
    flag: "🇦🇪",
    country: "United Arab Emirates",
    tag: "Regional Office",
    city: "Dubai Silicon Oasis",
    addressLines: [
      "Techno Hub, A1, A5 Building,",
      "Dubai Digital Park, Dubai Silicon Oasis,",
      "Dubai, United Arab Emirates",
    ],
    // Map + directions both search for Techno Hub inside A5 Building, so the
    // pin lands on the office itself rather than the building's centre.
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(UAE_QUERY),
    mapEmbed: `https://maps.google.com/maps?q=${encodeURIComponent(UAE_QUERY)}&z=17&output=embed`,
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

export { SOCIAL_PROFILES as socialLinks } from "@/app/lib/seo";

export const trustStats = [
  { value: "15,000+", label: "Professionals trained" },
  { value: "500+", label: "Sales teams coached" },
  { value: "8+", label: "Countries served" },
] as const;

export const footerColumns = [
  { heading: "Company", links: ["About", "Programs", "Individuals", "Partner"] },
  { heading: "Resources", links: ["Blogs", "Newsletter", "Contact"] },
] as const;
