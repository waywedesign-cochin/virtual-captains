import { post } from "./post";
import { category } from "./category";
import { author } from "./author";
import { blockContentType } from "./blockContent";
import { newsPost } from "./newsPost";
import { youtubeVideo } from "./youtubeVideo";
import { program } from "./program";
import { career } from "./career";
import { careerDepartment } from "./careerDepartment";

export const schema = {
  types: [
    post,
    category,
    author,
    blockContentType,
    newsPost,
    youtubeVideo,
    program,
    career,
    careerDepartment,
  ],
};
