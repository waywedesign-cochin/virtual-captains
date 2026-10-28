// Shared by the eligibility form (BookACallModal) and /api/applications,
// which re-reads the answer text from here so the team email can't be spoofed.

export const ELIGIBILITY_ROLES = [
  "Founder / Business Owner",
  "Sales Head / Manager",
  "Sales Professional",
  "Other business role",
] as const;

export const QUIZ_INTRO =
  "A brief insight exercise to understand your approach to real-world situations.";

export const QUIZ: { title: string; question: string; options: string[] }[] = [
  {
    title: "Communicating with Impact",
    question:
      "You have 30 seconds to introduce an unfamiliar business opportunity to a potential prospect. How would you approach the conversation?",
    options: [
      "Deliver a concise introduction covering the opportunity, its key benefits, and its purpose.",
      "Provide a broader overview to ensure the prospect understands the opportunity before making a judgement.",
      "Identify the prospect's likely priorities and communicate the most relevant value proposition.",
      "Begin by understanding the prospect's interests before deciding what information to share.",
    ],
  },
  {
    title: "Responding to Rejection",
    question:
      "After reaching out to five prospects, four decline the opportunity and one does not respond. What would be your next course of action?",
    options: [
      "Take a brief pause to regain focus before resuming the planned outreach.",
      "Evaluate the interactions, identify potential improvements, and refine the approach before continuing outreach.",
      "Reconsider the target audience and explore whether a different prospect segment may respond better.",
      "Maintain the current approach and continue engaging new prospects, recognising that rejection is part of the process.",
    ],
  },
  {
    title: "Understanding Buying Hesitation",
    question:
      'A prospect expresses interest but says, "I need some time to think about it," without providing further details. How would you proceed?',
    options: [
      "Acknowledge their position and agree on an appropriate time to reconnect.",
      "Reinforce the opportunity's key benefits to help them evaluate its potential value.",
      "Respect their decision and leave the next step entirely to the prospect.",
      "Explore the factors influencing their hesitation to understand what they need before making a decision.",
    ],
  },
  {
    title: "Exercising Judgement Under Uncertainty",
    question:
      "During a prospect conversation, you receive a question for which you do not have a confirmed answer. How would you handle it?",
    options: [
      "Use the information available to formulate a preliminary response while avoiding unsupported claims.",
      "Consult an experienced colleague before providing a response to the prospect.",
      "Acknowledge the information gap, clarify the prospect's requirement, and commit to following up with an accurate response.",
      "Share the information you can verify and clearly identify what requires further confirmation.",
    ],
  },
  {
    title: "Applying Feedback to Performance",
    question:
      "During a practice session, your trainer identifies a weakness in your approach and asks you to make an immediate adjustment. How would you respond?",
    options: [
      "Acknowledge the feedback and incorporate it into subsequent practice.",
      "Reflect on the feedback independently before deciding how best to adjust your approach.",
      "Clarify the specific improvement required, apply the feedback, and demonstrate the revised approach in the next attempt.",
      "Explain the reasoning behind your original approach and discuss how it could be improved.",
    ],
  },
];

export const LETTERS = ["A", "B", "C", "D"];

/** Answers are option indexes (0–3), one per question. */
export const isValidAnswers = (a: unknown): a is number[] =>
  Array.isArray(a) &&
  a.length === QUIZ.length &&
  a.every((v, i) => Number.isInteger(v) && v >= 0 && v < QUIZ[i].options.length);
