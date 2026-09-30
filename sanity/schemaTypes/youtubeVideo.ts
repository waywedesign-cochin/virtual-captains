import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";
import { getYouTubeId } from "../lib/youtube";

// Videos shown in the About page's "Recent & Upcoming Videos" panel.
// Publishing here updates the live site within seconds.
export const youtubeVideo = defineType({
  name: "youtubeVideo",
  title: "YouTube Video",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Recent (already on YouTube)", value: "recent" },
          { title: "Upcoming (coming soon)", value: "upcoming" },
        ],
        layout: "radio",
      },
      initialValue: "recent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "YouTube Link",
      type: "url",
      description:
        "Paste the normal link from YouTube's Share button, e.g. https://youtu.be/ulkbdVqfCNI. Optional for upcoming videos.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["https", "http"] }).custom((value, context) => {
          const status = (context.document as { status?: string } | undefined)?.status;
          if (!value) {
            return status === "recent" ? "A recent video needs its YouTube link" : true;
          }
          return getYouTubeId(value) ? true : "That doesn't look like a YouTube video link";
        }),
    }),
    defineField({
      name: "premiereDate",
      title: "Premiere Date",
      type: "datetime",
      description: "Shown on upcoming videos, e.g. “Premieres 12 Oct”.",
      hidden: ({ document }) => document?.status !== "upcoming",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers show first. The first recent video plays in the main player.",
      initialValue: 10,
    }),
  ],
  orderings: [
    { title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", status: "status", order: "order" },
    prepare: ({ title, status, order }) => ({
      title,
      subtitle: `${status === "upcoming" ? "Upcoming" : "Recent"} · Order ${order ?? "–"}`,
      media: PlayIcon,
    }),
  },
});
