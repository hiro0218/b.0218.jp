type ArticleBaseProps = {
  title: string;
  slug: string;
  date: string;
  updated: string;
  content: string;
};

export type Pages = ArticleBaseProps;

export type TermsPostList = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
};

export type Post = ArticleBaseProps & {
  note?: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
  noindex?: boolean;
};
