type ArticleBaseProps = {
  title: string;
  slug: string;
  date: string;
  updated: string;
  content: string;
};

export type PageProps = ArticleBaseProps;

export type TermsPostListProps = Omit<ArticleBaseProps, 'content'>;

export type PostProps = ArticleBaseProps & {
  note?: string;
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

export type PostListProps = Pick<PostProps, 'title' | 'slug' | 'date' | 'updated' | 'tags'>;

export type PostPopularProps = {
  [slug: string]: number;
};
