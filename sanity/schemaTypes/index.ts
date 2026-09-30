import { post } from "./post";
import { category } from "./category";
import { author } from "./author";
import { blockContentType } from "./blockContent";
import { newsPost } from "./newsPost";
import { newsCategory } from "./newsCategory";
import { youtubeVideo } from "./youtubeVideo";

export const schema = {
  types: [post, category, author, blockContentType, newsPost, newsCategory, youtubeVideo],
};
