import { defineField, defineType } from "sanity";

export const newsCategory = defineType({
  name: "newsCategory",
  title: "News Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        'e.g. "Product Release", "Partnership", "Milestone", "Company"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 48 },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
