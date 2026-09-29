import { defineField, defineType } from "sanity";

export const newsPost = defineType({
  name: "newsPost",
  title: "News Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "newsCategory" }],
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "Shown on the card, and as the lead paragraph on the detail page.",
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: "publishedDate",
      title: "Published Date",
      type: "datetime",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "string",
      group: "content",
      description: 'e.g. "3 min read"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "content",
      description:
        'Show this post in the hero "Featured" slot on the news page.',
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Banner Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Optional. Falls back to the post title if left empty.",
        }),
      ],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      group: "content",
      fields: [
        defineField({
          name: "lead",
          title: "Lead paragraph",
          type: "text",
          rows: 3,
          description:
            "Optional — larger standfirst shown above the body. Falls back to Summary if left empty.",
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "blockContent", // reuse the same rich-text schema your blog's post.content.body uses
        }),
      ],
    }),
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
          description: "Falls back to Title if left empty.",
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
  preview: {
    select: {
      title: "title",
      category: "category.title",
      media: "image",
    },
    prepare({ title, category, media }) {
      return {
        title,
        subtitle: category,
        media,
      };
    },
  },
});
