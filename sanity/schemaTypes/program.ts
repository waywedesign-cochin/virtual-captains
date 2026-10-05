import { defineField, defineType } from "sanity";

export const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description:
        "Also stored on payments. Don't change it after programs have been sold.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string",
      options: {
        list: [
          { title: "Students & Freshers", value: "students" },
          { title: "Working Professionals", value: "professionals" },
          { title: "Founders", value: "founders" },
          { title: "Organisations", value: "organisations" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "level",
      title: "Level",
      type: "string",
      options: { list: ["Basic", "Intermediate", "Expert", "All levels"] },
    }),
    defineField({ name: "hours", title: "Total hours", type: "number" }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      description: 'e.g. "10 days", "2 weeks"',
    }),
    defineField({
      name: "priceInr",
      title: "Price (₹, whole rupees)",
      type: "number",
      description:
        "Charged online via Razorpay and shown on the card. Leave empty for 'Contact us' programs.",
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: "image",
      title: "Cover image (optional)",
      type: "image",
      description:
        "Optional. If empty, the card is shown without a cover image.",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Up to 4 are shown on the card.",
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "featured",
      title: "Featured (highlighted blue card)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first. Empty goes last.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "audience", media: "image" },
  },
});
