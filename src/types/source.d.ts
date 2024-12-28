type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type ArticleBaseProps = {
  title: string;
  slug: string;
  date: string;
  updated?: string | undefined;
  content: string;
};

export type PageProps = ArticleBaseProps;

export type TermsPostListProps = Optional<Omit<ArticleBaseProps, 'content'>, 'updated'>;

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

export type PostListProps = Optional<Pick<PostProps, 'title' | 'slug' | 'date' | 'updated' | 'tags'>, 'updated'>;

export type PostPopularProps = {
  [slug: string]: number;
};
