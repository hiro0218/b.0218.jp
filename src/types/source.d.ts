export type Pages = {
  title: string;
  slug: string;
  date: string;
  updated: string;
  content: string;
};

export type TermsPostList = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
};

export type Post = {
  date: string;
  updated: string;
  note: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  noindex?: boolean;
};
