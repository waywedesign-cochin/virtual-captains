import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/home/Navbar";
import SiteFooter from "../components/home/SiteFooter";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Disclaimer | Virtual Captains",
  description:
    "Review the Refund Policy, Cancellation Guidelines, and Earnings & AI Simulation Disclaimers for Virtual Captains programs and platforms.",
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-[#020B25] text-white selection:bg-[#e5ff00] selection:text-black">
      <Navbar />

      {/* Ambient Cosmic Glow Backgrounds */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-radial from-[#0f3591]/25 via-[#07194a]/15 to-transparent blur-[160px]" />
        <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] bg-radial from-[#1a4fc8]/15 to-transparent blur-[160px]" />
        <div className="absolute top-[65%] left-[-10%] w-[650px] h-[650px] bg-radial from-[#0a2a80]/20 to-transparent blur-[160px]" />
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
          <span className="text-[#e5ff00]">Refund / Cancellation &amp; Disclaimer</span>
        </nav>

        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 mb-5 shadow-[0_0_16px_rgba(229,255,0,0.12)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e5ff00] shadow-[0_0_6px_#e5ff00]" />
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#e5ff00]">
            Legal &amp; Transparency
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white font-sans leading-[1.12]">
          Refund / Cancellation Policy &amp; Disclaimer
        </h1>

        {/* Introductory Overview Card */}
        <div className="mt-8 sm:mt-10 rounded-2xl border border-white/12 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <p className="text-base sm:text-lg text-slate-200 font-sans leading-relaxed">
            At{" "}
            <span className="text-white font-medium">Virtual Captains</span>, we
            are committed to building real, transformative sales capabilities
            through our cohort training, conversational AI simulations (SalesX),
            and enterprise consulting. This page outlines our comprehensive{" "}
            <strong className="text-white">Refund Policy</strong>,{" "}
            <strong className="text-white">Cancellation Terms</strong>, and{" "}
            <strong className="text-white">Professional &amp; Simulation Disclaimers</strong>.
          </p>
        </div>

        {/* Quick Navigation Anchor Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3 p-1.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
          <a
            href="#refund-policy"
            className="flex-1 min-w-[140px] text-center px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            1. Refund Policy
          </a>
          <a
            href="#cancellation-policy"
            className="flex-1 min-w-[140px] text-center px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            2. Cancellation Policy
          </a>
          <a
            href="#disclaimer"
            className="flex-1 min-w-[140px] text-center px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            3. Disclaimer
          </a>
        </div>

        {/* ====================================================================
           PART 1: REFUND POLICY
           ==================================================================== */}
        <div id="refund-policy" className="mt-14 sm:mt-16 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-[#e5ff00] text-black font-bold text-xs">
              01
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              Refund Policy
            </h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#030d2d]/60 backdrop-blur-lg p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-[#e5ff00] font-sans mb-3">
                1.1 Individual Cohort Programs &amp; Sales Training
              </h3>
              <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                For individual participants enrolled in our structured cohort
                programs (such as our 12-week sales cohorts), refund requests
                must be submitted within <strong>7 days</strong> of program
                commencement. To be eligible for a refund, the participant must
                have completed less than 20% of the live workshops and digital
                exercises. After 7 days, or upon accessing 20% or more of the
                curriculum, course fees become non-refundable due to limited
                cohort seats and reserved mentor allocations.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#030d2d]/60 backdrop-blur-lg p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-[#e5ff00] font-sans mb-3">
                1.2 SalesX Platform &amp; Software Subscriptions
              </h3>
              <div className="space-y-3 text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                <p>
                  <strong>Monthly Subscriptions:</strong> Monthly software plans
                  may be cancelled at any time prior to the next renewal date.
                  Fees for the active monthly billing cycle are non-refundable.
                </p>
                <p>
                  <strong>Annual Subscriptions:</strong> Annual software plans
                  include a <strong>14-day money-back guarantee</strong> from
                  the initial purchase date, provided simulation usage does not
                  exceed the starter threshold of 5 completed roleplay
                  simulations.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#030d2d]/60 backdrop-blur-lg p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-[#e5ff00] font-sans mb-3">
                1.3 Enterprise Engagements &amp; Custom Studios
              </h3>
              <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                Corporate engagements—including dedicated sales induction studios,
                floor audits, custom buyer-persona engineering, and enterprise
                consulting—involve upfront resource allocation and bespoke asset
                creation. As such, deposit payments and milestone fees for
                enterprise clients are non-refundable and governed strictly by
                the refund and termination provisions in the executed Master
                Services Agreement (MSA) or Statement of Work (SOW).
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#030d2d]/60 backdrop-blur-lg p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-[#e5ff00] font-sans mb-3">
                1.4 Refund Processing Timeline
              </h3>
              <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                Approved refunds are processed to the original payment method
                within <strong>7 to 10 business days</strong> from written
                approval. Any non-refundable gateway processing fees deducted by
                external payment providers (such as Stripe or regional banking
                railways) are subject to payment gateway terms.
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================================
           PART 2: CANCELLATION POLICY
           ==================================================================== */}
        <div id="cancellation-policy" className="mt-14 sm:mt-16 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-[#e5ff00] text-black font-bold text-xs">
              02
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              Cancellation Policy
            </h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#030d2d]/60 backdrop-blur-lg p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-[#e5ff00] font-sans mb-3">
                2.1 Participant Cohort Cancellations &amp; Deferrals
              </h3>
              <div className="space-y-3 text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                <p>
                  <strong>14+ Days Notice:</strong> If you cancel your
                  enrollment at least 14 days prior to cohort kickoff, you are
                  eligible for a 100% refund (minus payment processing fees) or a
                  free deferral to the following cohort.
                </p>
                <p>
                  <strong>7 to 13 Days Notice:</strong> Cancellations made
                  between 7 and 13 days before cohort start are eligible for a 50%
                  refund or a 100% credit transfer to a subsequent cohort.
                </p>
                <p>
                  <strong>Less than 7 Days Notice:</strong> Cancellations made
                  under 7 days before commencement are non-refundable; however,
                  participants may request a cohort deferral subject to seat
                  availability.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#030d2d]/60 backdrop-blur-lg p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-[#e5ff00] font-sans mb-3">
                2.2 1-on-1 Coaching &amp; Sales Floor Audit Sessions
              </h3>
              <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                Individual advisory, coaching, or executive audit sessions must
                be cancelled or rescheduled at least <strong>24 hours</strong> in
                advance of the confirmed calendar time. Sessions cancelled with
                less than 24 hours notice may be forfeited and charged at full
                rate.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#030d2d]/60 backdrop-blur-lg p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-[#e5ff00] font-sans mb-3">
                2.3 Cancellation by Virtual Captains
              </h3>
              <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                In the unlikely event that Virtual Captains cancels a cohort,
                event, or scheduled program due to emergency circumstances,
                enrolled participants will immediately be offered a{" "}
                <strong>100% full refund</strong> or priority placement in an
                upcoming session at no additional cost.
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================================
           PART 3: DISCLAIMER
           ==================================================================== */}
        <div id="disclaimer" className="mt-14 sm:mt-16 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-[#e5ff00] text-black font-bold text-xs">
              03
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              Disclaimer
            </h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#030d2d]/60 backdrop-blur-lg p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-[#e5ff00] font-sans mb-3">
                3.1 Sales Performance &amp; Earnings Disclaimer
              </h3>
              <div className="space-y-3 text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                <p>
                  Virtual Captains provides sales training, coaching methodologies,
                  and conversational simulations. While our strategies and
                  curricula are built upon 16+ years of validated enterprise sales
                  execution across international markets, individual and corporate
                  sales results depend on factors beyond our control—including
                  individual commitment, market demand, product quality, pricing,
                  and execution discipline.
                </p>
                <p>
                  Virtual Captains makes <strong>no guarantee, warranty, or
                  representation</strong> of specific quota attainment, deal close
                  rates, or financial revenue. Testimonials, reviews, and case
                  studies reflect the unique experiences of individual clients and
                  should not be construed as guarantees of identical future
                  performance.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#030d2d]/60 backdrop-blur-lg p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-[#e5ff00] font-sans mb-3">
                3.2 AI Simulation &amp; Generative Technology Disclaimer
              </h3>
              <div className="space-y-3 text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                <p>
                  Our SalesX platform and virtual roleplay modules incorporate
                  generative artificial intelligence and natural language models
                  to simulate realistic enterprise buyer dynamics and objection
                  handling.
                </p>
                <p>
                  These simulations are designed strictly for educational,
                  muscle-memory, and training purposes. AI-generated dialogue and
                  virtual buyer personas may occasionally generate unexpected,
                  inaccurate, or simulated responses. Simulation feedback scores and
                  telemetry indicators represent educational benchmarks and do not
                  constitute certified psychological, legal, or occupational
                  evaluations.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#030d2d]/60 backdrop-blur-lg p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-semibold text-[#e5ff00] font-sans mb-3">
                3.3 Professional &amp; Legal Advice Disclaimer
              </h3>
              <p className="text-slate-300 font-sans leading-relaxed text-sm sm:text-base">
                The information, materials, and frameworks shared by Virtual
                Captains do not constitute formal legal, accounting, tax, or
                financial advice. Clients and users should consult their own
                licensed legal and financial professionals regarding specific
                commercial contracts, regulatory compliance, and business
                decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Support Help Box */}
        <div className="mt-14 sm:mt-16 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 text-center flex flex-col items-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-white font-sans mb-2">
            Questions Regarding Refunds or Cancellations?
          </h3>
          <p className="text-slate-300 font-sans text-sm sm:text-base max-w-lg mb-6 leading-relaxed">
            Our support and operations teams are available to assist you with
            cohort rescheduling, subscription management, or policy inquiries.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#e5ff00] hover:bg-[#d4ee00] text-black px-7 py-3 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-[0_0_20px_rgba(229,255,0,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Submit a Support Request</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
