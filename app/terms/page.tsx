import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";

export const metadata: Metadata = {
  title: "Terms & Conditions | Virtual Captains",
  description:
    "Review the terms, conditions, and service guidelines governing the use of Virtual Captains websites, training platforms, simulations, and enterprise services.",
};

const SECTIONS = [
  {
    number: "01",
    title: "Acceptance of Terms",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        By accessing or using the Virtual Captains website, training platforms,
        simulations, software products (including SalesX), and related services,
        you agree to be bound by these Terms &amp; Conditions and our Privacy Policy.
        If you do not agree with any part of these terms, you must discontinue your
        use of our website and services immediately.
      </p>
    ),
  },
  {
    number: "02",
    title: "Description of Services",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        Virtual Captains provides sales strategy consulting, organizational
        enablement programs, practical virtual coaching, conversational
        intelligence telemetry, and simulation technologies designed to develop
        and scale high-performing sales professionals and revenue teams. We
        reserve the right to modify, enhance, or temporarily suspend any feature
        of our digital platforms or training curricula to improve quality and
        relevance.
      </p>
    ),
  },
  {
    number: "03",
    title: "User Accounts & Access Responsibilities",
    content: (
      <div className="space-y-3.5 text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        <p>
          When creating an account or enrolling in our cohorts and enterprise
          training sessions, you agree to provide true, accurate, and complete
          information. You are solely responsible for safeguarding your login
          credentials and for any activity that occurs under your account.
        </p>
        <p>
          You agree not to share, license, resell, or distribute your account
          access to any unauthorized third party, nor attempt to reverse-engineer,
          decompile, or extract the underlying models, prompts, and source code of
          our simulation engines.
        </p>
      </div>
    ),
  },
  {
    number: "04",
    title: "Intellectual Property Rights",
    content: (
      <div className="space-y-3.5 text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        <p>
          All content provided through Virtual Captains—including but not
          limited to training frameworks, behavioral playbooks, objection
          teardowns, simulation roleplay scenarios, interactive media, text,
          graphics, logos, and software code—is the proprietary intellectual
          property of Virtual Captains and protected by applicable copyright,
          trademark, and intellectual property laws.
        </p>
        <p>
          Clients and enrolled participants are granted a limited,
          non-exclusive, non-transferable, and revocable license to view and utilize
          the materials strictly for their internal training and personal sales
          development during the term of their enrollment.
        </p>
      </div>
    ),
  },
  {
    number: "05",
    title: "Enterprise Engagements & Master Services Agreements",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        Specific engagements with corporate clients—including dedicated
        cohorts, sales floor audits, custom simulation environments, and
        enterprise SLAs—are governed by an executed Master Services Agreement
        (MSA), Statement of Work (SOW), or Enterprise Agreement. In the event of
        any conflict between these general website Terms and a signed commercial
        agreement, the terms of the signed agreement shall prevail.
      </p>
    ),
  },
  {
    number: "06",
    title: "Limitation of Liability & Warranty Disclaimer",
    content: (
      <div className="space-y-3.5 text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        <p>
          Our services and simulation software are provided on an &ldquo;as is&rdquo;
          and &ldquo;as available&rdquo; basis. While our methodologies and frameworks
          are validated through extensive industry experience, commercial sales
          outcomes depend on diverse factors including client execution, individual
          aptitude, and broader market conditions. Virtual Captains does not
          guarantee specific financial earnings or quota attainment.
        </p>
        <p>
          To the fullest extent permitted by law, Virtual Captains, its
          officers, employees, and affiliates shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages
          arising out of your access to or inability to access our services.
        </p>
      </div>
    ),
  },
  {
    number: "07",
    title: "Third-Party Tools & External Integrations",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        Our platforms may integrate with or provide links to third-party tools,
        such as CRM systems, calendar scheduling software, payment processors,
        and analytics providers. We do not control or assume responsibility for
        the privacy practices or terms of third-party platforms, and your
        interactions with them are governed by their respective policies.
      </p>
    ),
  },
  {
    number: "08",
    title: "Suspension & Termination",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        We reserve the right to suspend or terminate your access to our website,
        cohort platforms, or simulation tools at our sole discretion, without
        prior notice, in the event of a breach of these Terms, non-payment of
        agreed fees, unauthorized intellectual property copying, or conduct that
        harms the integrity or security of our services.
      </p>
    ),
  },
  {
    number: "09",
    title: "Governing Law & Dispute Resolution",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        These Terms &amp; Conditions shall be governed by and construed in
        accordance with the laws of the jurisdictions where Virtual Captains
        operates, without giving effect to any principles of conflicts of law.
        Any legal proceeding arising out of or related to these terms shall be
        submitted to the exclusive jurisdiction of the competent courts.
      </p>
    ),
  },
  {
    number: "10",
    title: "Modifications to Terms",
    content: (
      <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
        We reserve the right to update or amend these Terms &amp; Conditions at
        any time. Any modifications will be posted directly to this page with an
        updated effective date. Your continued use of our website and services
        following the publication of revised terms constitutes your binding
        acceptance of those changes.
      </p>
    ),
  },
  {
    number: "11",
    title: "Contact & Inquiries",
    content: (
      <div className="space-y-4">
        <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
          If you have questions, feedback, or legal inquiries regarding these
          Terms &amp; Conditions, please reach out to our team via our contact
          channels.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#e5ff00] hover:bg-[#d4ee00] text-black px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-[0_0_20px_rgba(229,255,0,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Contact Legal Team</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    ),
  },
];

export default function TermsPage() {
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
          <span className="text-[#e5ff00]">Terms &amp; Conditions</span>
        </nav>

        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 mb-5 shadow-[0_0_16px_rgba(229,255,0,0.12)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e5ff00] shadow-[0_0_6px_#e5ff00]" />
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#e5ff00]">
            Legal &amp; Compliance
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white font-sans leading-[1.12]">
          Terms &amp; Conditions
        </h1>

        {/* Introductory Overview Card */}
        <div className="mt-8 sm:mt-10 rounded-2xl border border-white/12 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <p className="text-base sm:text-lg text-slate-200 font-sans leading-relaxed">
            Welcome to{" "}
            <span className="text-white font-medium">Virtual Captains</span>.
            These Terms &amp; Conditions govern your access to and use of our
            websites, sales training platforms, simulation environments
            (including SalesX), and enterprise consulting services. Please read
            these terms carefully before engaging with our services.
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
