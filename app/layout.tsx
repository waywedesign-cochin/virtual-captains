import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "./styles/index.css";
import SmoothScroll from "./components/SmoothScroll";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Virtual Captains",
  description: "Best Sales Engagement Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white overflow-x-clip font-sans">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
