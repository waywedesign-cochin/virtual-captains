import type { PortableTextBlock } from "@portabletext/types";

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
  detailTitle?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content?: {
    lead?: string;
    body?: PortableTextBlock[];
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
}
