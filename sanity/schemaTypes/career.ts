import { defineArrayMember, defineField, defineType } from "sanity";

/** Values match schema.org JobPosting `employmentType`, so the page can emit
 *  Google-for-Jobs structured data without a lookup table. */
export const EMPLOYMENT_TYPES = [
  { title: "Full-time", value: "FULL_TIME" },
  { title: "Part-time", value: "PART_TIME" },
  { title: "Contract", value: "CONTRACTOR" },
  { title: "Internship", value: "INTERN" },
  { title: "Temporary", value: "TEMPORARY" },
];

export const WORKPLACE_TYPES = [
  { title: "On-site", value: "onsite" },
  { title: "Hybrid", value: "hybrid" },
  { title: "Remote", value: "remote" },
];

export const career = defineType({
  name: "career",
  title: "Career / Job Opening",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "details", title: "Job Details" },
    { name: "compensation", title: "Compensation" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── Overview ────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      group: "overview",
      description: 'e.g. "Senior Sales Trainer"',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "overview",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isOpen",
      title: "Accepting Applications",
      type: "boolean",
      group: "overview",
      description:
        "Turn off to close the role. Closed roles disappear from the Careers page and stop accepting applications.",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "overview",
      description: "Pin this role to the top of the Careers page.",
      initialValue: false,
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      group: "overview",
      options: {
        list: [
          "Sales",
          "Training & Coaching",
          "Marketing",
          "Operations",
          "Technology",
          "Customer Success",
          "Finance & Admin",
          "People & HR",
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "employmentType",
      title: "Employment Type",
      type: "string",
      group: "overview",
      options: { list: EMPLOYMENT_TYPES, layout: "radio" },
      initialValue: "FULL_TIME",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "workplaceType",
      title: "Workplace",
      type: "string",
      group: "overview",
      options: { list: WORKPLACE_TYPES, layout: "radio" },
      initialValue: "onsite",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "overview",
      description: 'City, Country — e.g. "Kochi, India". For remote roles, the region you hire in.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "string",
      group: "overview",
      description: 'e.g. "3–5 years"',
    }),
    defineField({
      name: "openings",
      title: "Number of Openings",
      type: "number",
      group: "overview",
      initialValue: 1,
      validation: (Rule) => Rule.min(1).integer(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "overview",
      description: "One or two lines shown on the job card and at the top of the job page.",
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: "postedDate",
      title: "Posted Date",
      type: "datetime",
      group: "overview",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "validThrough",
      title: "Application Deadline",
      type: "datetime",
      group: "overview",
      description: "Optional. After this date the role is hidden automatically.",
    }),

    // ── Job details (rich text, same editor as the blog) ────────────────
    defineField({
      name: "aboutRole",
      title: "About the Role",
      type: "blockContent",
      group: "details",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "responsibilities",
      title: "Key Responsibilities",
      type: "blockContent",
      group: "details",
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "blockContent",
      group: "details",
      description: "Must-have skills, qualifications and experience.",
    }),
    defineField({
      name: "niceToHave",
      title: "Nice to Have",
      type: "blockContent",
      group: "details",
    }),
    defineField({
      name: "benefits",
      title: "What We Offer",
      type: "blockContent",
      group: "details",
    }),
    defineField({
      name: "hiringProcess",
      title: "Hiring Process",
      type: "array",
      group: "details",
      description: 'Steps in order, e.g. "Intro call", "Role-play round", "Founder chat", "Offer".',
      of: [defineArrayMember({ type: "string" })],
    }),

    // ── Compensation ────────────────────────────────────────────────────
    defineField({
      name: "salary",
      title: "Salary",
      type: "object",
      group: "compensation",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "showOnSite",
          title: "Show salary on the website",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "currency",
          title: "Currency",
          type: "string",
          options: { list: ["INR", "AED", "USD", "SAR", "QAR", "OMR"] },
          initialValue: "INR",
        }),
        defineField({ name: "min", title: "Minimum", type: "number" }),
        defineField({ name: "max", title: "Maximum", type: "number" }),
        defineField({
          name: "unit",
          title: "Per",
          type: "string",
          options: {
            list: [
              { title: "Year", value: "YEAR" },
              { title: "Month", value: "MONTH" },
              { title: "Hour", value: "HOUR" },
            ],
          },
          initialValue: "YEAR",
        }),
      ],
    }),

    // ── SEO ─────────────────────────────────────────────────────────────
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta title",
          type: "string",
          description: 'Falls back to "<Job Title> — <Location>" if left empty.',
          validation: (Rule) => Rule.max(70),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta description",
          type: "text",
          rows: 3,
          description: "Falls back to Summary if left empty.",
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "postedDesc",
      by: [{ field: "postedDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      department: "department",
      location: "location",
      isOpen: "isOpen",
    },
    prepare({ title, department, location, isOpen }) {
      return {
        title,
        subtitle: `${isOpen === false ? "CLOSED · " : ""}${department ?? ""} · ${location ?? ""}`,
      };
    },
  },
});
