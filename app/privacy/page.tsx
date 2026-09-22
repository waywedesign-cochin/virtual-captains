import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | Virtual Captains",
  description:
    "Learn how Virtual Captains collects, uses, and protects your personal information and privacy when visiting our website or using our services.",
};

const SECTIONS = [
  {
    number: "01",
    title: "Collection of Information",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        We collect personal information from our website visitors when they fill
        out contact forms or sign up for our newsletter. The information we
        collect may include your name, email address, phone number, company name,
        and other relevant details.
      </p>
    ),
  },
  {
    number: "02",
    title: "Use of Information",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        We use the information we collect to respond to your inquiries, provide
        you with our services, and send you marketing communications if you have
        opted-in to receive them. We may also use your information to improve our
        website and services, and to comply with any legal obligations.
      </p>
    ),
  },
  {
    number: "03",
    title: "Sharing of Information",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        We do not sell, trade, or transfer your personal information to third
        parties. However, we may share your information with our trusted
        third-party service providers who assist us in providing our services
        and improving our website. We require these providers to protect your
        information in accordance with our privacy policy and applicable laws.
      </p>
    ),
  },
  {
    number: "04",
    title: "Cookies and Analytics",
    content: (
      <div className="space-y-3.5 text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        <p>
          We use cookies and similar technologies to track website usage and
          improve our website and services.
        </p>
        <p>
          We may also use third-party analytics tools, such as Google Analytics,
          to analyze website traffic and user behavior. These tools may use
          cookies and other technologies to collect information about your use of
          our website.
        </p>
      </div>
    ),
  },
  {
    number: "05",
    title: "Security",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        We take reasonable measures to protect the personal information we
        collect from unauthorized access, use, and disclosure. However, no method
        of transmission over the Internet or electronic storage is 100% secure,
        and we cannot guarantee absolute security of your information.
      </p>
    ),
  },
  {
    number: "06",
    title: "Your Rights",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        You have the right to access, modify, or delete the personal
        information we have collected about you. You may also opt-out of
        receiving marketing communications from us at any time. To exercise
        these rights, please contact us using the information provided on our
        website.
      </p>
    ),
  },
  {
    number: "07",
    title: "Changes to this Policy",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        We reserve the right to update or modify this privacy policy at any time.
        Any changes will be reflected on this page and will be effective
        immediately upon posting.
      </p>
    ),
  },
  {
    number: "08",
    title: "Contact Us",
    content: (
      <div className="space-y-4">
        <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
          If you have any questions or concerns about our privacy policy or the
          information we collect, please contact us using the information
          provided on our website.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#e5ff00] hover:bg-[#d4ee00] text-black px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-[0_0_20px_rgba(229,255,0,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Contact Support & Legal</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#020B25] text-white selection:bg-[#e5ff00] selection:text-black">
      <Navbar />

      {/* Ambient Cosmic Glow Backgrounds */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-radial from-[#0f3591]/25 via-[#07194a]/15 to-transparent blur-[160px]" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-radial from-[#1a4fc8]/15 to-transparent blur-[160px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[650px] h-[650px] bg-radial from-[#0a2a80]/20 to-transparent blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-32 sm:pt-40 pb-20 sm:pb-28">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-[#e5ff00]">Privacy Policy</span>
        </nav>

        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 mb-5 shadow-[0_0_16px_rgba(229,255,0,0.12)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e5ff00] shadow-[0_0_6px_#e5ff00]" />
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#e5ff00]">
            Legal &amp; Privacy
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white font-sans leading-[1.12]">
          Privacy Policy
        </h1>

        {/* Introductory Overview Card */}
        <div className="mt-8 sm:mt-10 rounded-2xl border border-white/12 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <p className="text-base sm:text-lg text-slate-200 font-sans leading-relaxed">
            At{" "}
            <span className="text-white font-medium">Virtual Captains</span>, we
            are committed to protecting the privacy and personal information of
            our website visitors and clients. This privacy policy outlines how
            we collect, use, and protect the information you provide to us
            through our website.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="mt-10 sm:mt-12 space-y-6 sm:space-y-8">
          {SECTIONS.map((section) => (
            <section
              key={section.number}
              id={`section-${section.number}`}
              className="rounded-2xl border border-white/10 bg-[#030d2d]/60 backdrop-blur-lg p-6 sm:p-8 transition-colors duration-200 hover:border-white/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs font-semibold text-[#e5ff00] bg-[#e5ff00]/10 border border-[#e5ff00]/30 rounded-md px-2 py-0.5 select-none">
                  {section.number}
                </span>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-white font-sans">
                  {section.title}
                </h2>
              </div>
              <div className="pl-0 sm:pl-9">{section.content}</div>
            </section>
          ))}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
