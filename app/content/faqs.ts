/**
 * FAQ content for the FAQ section shown above the footer on every page
 * except Home. Edit questions/answers here; each page picks which tab opens
 * first (see FaqSection's `defaultGroup`).
 */
export type FaqItem = { q: string; a: string };
export type FaqGroupId = "salesx" | "organisations" | "individuals";
export type FaqGroup = { id: FaqGroupId; label: string; title: string; items: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "salesx",
    label: "SalesX",
    title: "Frequently Asked Questions",
    items: [
      {
        q: "What is SalesX by Virtual Captains?",
        a: "SalesX is a sales development platform that helps individuals practise, assess, and improve their sales capabilities through AI-supported simulations and human evaluation.",
      },
      {
        q: "How does AI-powered sales practice improve selling skills?",
        a: "AI-supported simulations let users practise customer conversations, respond to objections, and explore different sales scenarios. Feedback helps identify skill gaps and areas for improvement.",
      },
      {
        q: "Is SalesX suitable for freshers who want to start a career in sales?",
        a: "SalesX can help aspiring sales professionals and fresh graduates develop practical skills in customer conversations, communication, objection handling, and sales readiness.",
      },
      {
        q: "Can experienced sales professionals benefit from SalesX?",
        a: "Yes. Experienced sales professionals can use structured practice and assessment to identify skill gaps, refine their sales approach, and strengthen their performance in customer conversations.",
      },
      {
        q: "How does SalesX assess sales readiness?",
        a: "Sales readiness can be assessed through simulated sales conversations, practical exercises, and structured feedback to identify strengths and areas requiring further development.",
      },
    ],
  },
  {
    id: "organisations",
    label: "For Organisations",
    title: "Frequently Asked Questions",
    items: [
      {
        q: "How can organisations improve their sales team performance?",
        a: "Organisations can improve sales performance by identifying capability gaps, strengthening sales processes, and providing practical training and coaching tailored to their business goals.",
      },
      {
        q: "How can a business identify gaps in its sales process?",
        a: "A sales audit can review the sales pipeline, lead qualification, team capabilities, customer interactions, and conversion metrics to identify weaknesses and prioritise improvements.",
      },
      {
        q: "How can B2B companies generate qualified leads?",
        a: "B2B companies can improve lead generation by defining their ideal customer profile, identifying relevant decision-makers, and using targeted outreach supported by consistent qualification and follow-up.",
      },
      {
        q: "Can sales training be customised for our organisation?",
        a: "Sales development programmes can be tailored to your team's experience, products, target customers, sales cycle, and business objectives to address specific capability gaps.",
      },
      {
        q: "How can organisations measure the effectiveness of sales training?",
        a: "Organisations can track assessment results, improvements in demonstrated sales skills, and relevant business metrics such as conversion rates and pipeline progression.",
      },
    ],
  },
  {
    id: "individuals",
    label: "For Individuals",
    title: "Frequently Asked Questions",
    items: [
      {
        q: "Who can benefit from sales development programmes at Virtual Captains?",
        a: "Students, fresh graduates, aspiring sales professionals, and experienced individuals can explore sales development programmes suited to their experience and learning goals.",
      },
      {
        q: "Can I practise sales conversations before starting a sales job?",
        a: "Yes. Simulated sales scenarios let you practise customer conversations, respond to objections, and develop confidence in handling common sales situations.",
      },
      {
        q: "What sales skills can I develop through practical training?",
        a: "Practical sales development can help strengthen prospecting, customer discovery, active listening, objection handling, negotiation, follow-up, and closing skills.",
      },
      {
        q: "Will I receive feedback on my sales performance?",
        a: "Sales practice and structured evaluation can help you understand your strengths, recognise skill gaps, and identify areas to improve in customer conversations.",
      },
      {
        q: "How can I get started with Virtual Captains?",
        a: "Explore the available programmes and contact Virtual Captains to discuss your experience, development goals, and the most suitable option for your needs.",
      },
    ],
  },
];
