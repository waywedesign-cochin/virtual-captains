import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons/Image";

// Photos shown in the "Gallery" view of the News & Updates page.
// Newest photo date shows first; 6 photos per page.
export const galleryPhoto = defineType({
  name: "galleryPhoto",
  title: "Gallery Photo",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the photo for screen readers, e.g. “Founders batch on day one in Kochi”.",
          validation: (Rule) => Rule.required().max(140),
        }),
      ],
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional. Shown on the photo and in the full-size view.",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "date",
      title: "Photo Date",
      type: "date",
      description: "Newest dates show first in the gallery.",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    { title: "Newest First", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "caption", alt: "image.alt", date: "date", media: "image" },
    prepare: ({ title, alt, date, media }) => ({
      title: title || alt || "Untitled photo",
      subtitle: date,
      media,
    }),
  },
});
