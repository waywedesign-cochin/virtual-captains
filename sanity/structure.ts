import type { StructureResolver } from "sanity/structure";

const groupedTypes = [
  "post",
  "category",
  "author",
  "newsPost",
  "newsCategory",
  "youtubeVideo",
  "program",
  "career",
  "careerDepartment",
];

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
        .title("Programs")
        .schemaType("program")
        .child(
          S.documentTypeList("program")
            .title("Programs")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),

      S.listItem()
        .title("Careers")
        .child(
          S.list()
            .title("Careers")
            .items([
              S.listItem()
                .title("Job Openings")
                .schemaType("career")
                .child(
                  S.documentTypeList("career")
                    .title("Job Openings")
                    .defaultOrdering([{ field: "postedDate", direction: "desc" }]),
                ),
              S.listItem()
                .title("Departments")
                .schemaType("careerDepartment")
                .child(
                  S.documentTypeList("careerDepartment")
                    .title("Departments")
                    .defaultOrdering([
                      { field: "order", direction: "asc" },
                      { field: "title", direction: "asc" },
                    ]),
                ),
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
