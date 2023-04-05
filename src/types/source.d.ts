type ArticleBaseProps = {
  title: string;
  slug: string;
  date: string;
  updated: string;
  content: string;
};

export type Page = ArticleBaseProps;

export type TermsPostList = Omit<ArticleBaseProps, 'content'> & {
  excerpt: string;
};

export type Post = ArticleBaseProps & {
  note?: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
  noindex?: boolean;
};

export type TagSimilar = {
  [tag: string]: {
    [relatedTag: string]: number;
  };
};
