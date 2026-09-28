import { post } from "./post";
import { category } from "./category";
import { author } from "./author";
import { blockContentType } from "./blockContent";

export const schema = {
  types: [post, category, author, blockContentType],
};
