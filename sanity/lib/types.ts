export type BlogCategory = string;

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedDate: string;
  readTime: string;
  featured?: boolean;
  image: string;
  bannerImage?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content?: {
    lead: string;
    sections: {
      heading?: string;
      paragraphs: string[];
      listItems?: string[];
      note?: string;
    }[];
  };
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
}
