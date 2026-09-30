import type { StructureResolver } from "sanity/structure";

const groupedTypes = ["post", "category", "author", "newsPost", "newsCategory", "youtubeVideo"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Blogs")
        .child(
          S.list()
            .title("Blogs")
            .items([
              S.documentTypeListItem("post").title("Posts"),
              S.documentTypeListItem("category").title("Categories"),
              S.documentTypeListItem("author").title("Authors"),
            ]),
        ),

      S.listItem()
        .title("News")
        .child(
          S.list()
            .title("News")
            .items([
              S.documentTypeListItem("newsPost").title("News Posts"),
              S.documentTypeListItem("newsCategory").title("News Categories"),
            ]),
        ),

      S.listItem()
        .title("YouTube Videos")
        .schemaType("youtubeVideo")
        .child(
          S.documentTypeList("youtubeVideo")
            .title("YouTube Videos")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),

      S.divider(),

      // Everything else
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !groupedTypes.includes(item.getId()!),
      ),
    ]);
