import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "./styles/index.css";
import SmoothScroll from "./components/SmoothScroll";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "./lib/seo";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

const DEFAULT_DESCRIPTION =
  "Virtual Captains builds revenue-ready sellers and sales teams through SalesX simulation training, sales consulting and total sales floor management across the Middle East and Asia.";

// Site-wide defaults; every page adds its own title, description and canonical
// URL through pageMetadata() in app/lib/seo.ts.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Sales Training, SalesX & Sales Floor Management`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "Virtual Captains",
    "SalesX",
    "sales training",
    "sales simulation",
    "B2B sales course",
    "sales floor management",
    "sales consulting",
    "corporate sales training",
    "sales career",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: "/",
    title: `${SITE_NAME} | Sales Training, SalesX & Sales Floor Management`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Sales Training, SalesX & Sales Floor Management`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#020B25",
};

// Organization structured data — helps Google show the brand panel/logo
const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/wlogo.png`,
  sameAs: [
    "https://www.linkedin.com/company/virtual-captains/",
    "https://www.instagram.com/virtualcaptains/",
    "https://www.youtube.com/@VirtualCaptains",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white overflow-x-clip font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
