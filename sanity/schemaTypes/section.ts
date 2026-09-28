import { defineField, defineType } from "sanity";

export const section = defineType({
  name: "section",
  title: "Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "listItems",
      title: "List Items",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Untitled section" };
    },
  },
});
