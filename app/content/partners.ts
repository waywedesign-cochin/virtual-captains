/** A client/partner logo for the logo walls (home + SalesX). */
export type Partner = {
  name: string;
  logoSrc: string;
  /** width / height of the trimmed logo file — drives optical sizing */
  ratio: number;
};

/**
 * Optical sizing: logo height as a % of the card's content box, so wide
 * wordmarks and square emblems carry similar visual weight (equal-ish area).
 * A 1:1 logo fills the height; a 5:1 wordmark gets ~45%.
 */
export const logoHeight = (ratio: number) =>
  Math.round(Math.min(100, Math.max(40, Math.sqrt(1.05 / ratio) * 100)));

/**
 * Client & partner logos, one entry per company. Files in public/network/ are
 * cleaned copies of public/clientlogos/ + public/partners/ (background removed,
 * margins trimmed, transparent WebP) so they sit on glass cards. Add new logos
 * here — the home marquee and the SalesX network pick them up automatically.
 */
export const PARTNERS: Partner[] = [
  { name: "ThoughtBox", logoSrc: "/network/thoughtbox.webp", ratio: 1.09 },
  { name: "Cyncly", logoSrc: "/network/cyncly.webp", ratio: 4.21 },
  { name: "MoonHive", logoSrc: "/network/moonhive.webp", ratio: 1.29 },
  { name: "Skylark", logoSrc: "/network/skylark.webp", ratio: 2.38 },
  { name: "AHAD", logoSrc: "/network/ahad.webp", ratio: 3.29 },
  { name: "GMap", logoSrc: "/network/gmap.webp", ratio: 1.88 },
  { name: "KIED", logoSrc: "/network/kied.webp", ratio: 1.93 },
  { name: "Southern Sages", logoSrc: "/network/southern_sages.webp", ratio: 0.74 },
  { name: "Sigma Life Unifirm", logoSrc: "/network/unifirm.webp", ratio: 3.36 },
  { name: "Bangalore Bioinnovation Centre", logoSrc: "/network/bbc.webp", ratio: 2.5 },
  { name: "JSR", logoSrc: "/network/jsr.webp", ratio: 1.81 },
  { name: "Expeed Software", logoSrc: "/network/expeed.webp", ratio: 3.1 },
  { name: "Saaslogic", logoSrc: "/network/saaslogic.webp", ratio: 5.22 },
  { name: "Skybertech", logoSrc: "/network/skybertech.webp", ratio: 3.58 },
  { name: "CleverBrain", logoSrc: "/network/cleverbrain.webp", ratio: 1.88 },
  { name: "Kaniverse", logoSrc: "/network/kaniverse.webp", ratio: 1.47 },
  { name: "Gulf Genuine Power Projects", logoSrc: "/network/ggpl.webp", ratio: 4.32 },
  { name: "GEO Engineering", logoSrc: "/network/geo.webp", ratio: 1.28 },
  { name: "Riyada SME", logoSrc: "/network/riyada.webp", ratio: 1.55 },
  { name: "Startup Park", logoSrc: "/network/startup_park.webp", ratio: 3.8 },
  { name: "WOI India", logoSrc: "/network/woi.webp", ratio: 2.51 },
  { name: "WOI.eco", logoSrc: "/network/woi-eco.webp", ratio: 2.5 },
  { name: "KLBuild", logoSrc: "/network/klbuild.webp", ratio: 1.04 },
  { name: "KMEA", logoSrc: "/network/kmea.webp", ratio: 1.88 },
  { name: "SAFI Institute of Advanced Study", logoSrc: "/network/safi.webp", ratio: 5.85 },
];

