import { defineField, defineType } from "sanity";

/** Departments for job openings. Each one with open roles becomes a filter
 *  tab on the Careers page, so new teams can be added without code. */
export const careerDepartment = defineType({
  name: "careerDepartment",
  title: "Career Department",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Sales", "Training & Coaching", "Marketing"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Optional. Lower numbers show first in the Careers page tabs; others follow A–Z.",
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }, { field: "title", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", order: "order" },
    prepare: ({ title, order }) => ({ title, subtitle: order != null ? `Order ${order}` : undefined }),
  },
});
