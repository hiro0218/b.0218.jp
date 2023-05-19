type ArticleBaseProps = {
  title: string;
  slug: string;
  date: string;
  updated: string;
  content: string;
};

export type PageProps = ArticleBaseProps;

export type TermsPostListProps = Omit<ArticleBaseProps, 'content'> & {
  excerpt: string;
};

export type PostProps = ArticleBaseProps & {
  note?: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
  noindex?: boolean;
};

export type TagsListProps = Record<string, string[]>;

export type TagSimilarProps = {
  [tag: string]: {
    [relatedTag: string]: number;
  };
};

export type PostSimilarProps = {
  [slug: string]: {
    [slug: string]: number;
  };
}[];

export type PostListProps = Pick<Post, 'title' | 'slug' | 'date' | 'updated' | 'excerpt' | 'tags'>;
