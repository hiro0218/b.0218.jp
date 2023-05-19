import type { GetStaticProps } from 'next';

import { getPostsListJson } from '@/lib/posts';
type PostsProps = ReturnType<typeof getPostsListJson>;
type PostProps = UnpackedArray<PostsProps>;
type ArchiveListProps = Record<number, PostsProps>;

export type ArchiveProps = {
  archives: ArchiveListProps;
  numberOfPosts: number;
};

const getYear = (date: PostProps['date']) => Number(date.slice(0, 4));

const divideByYearArchive = (posts: PostsProps): ArchiveListProps => {
  const result: ArchiveListProps = {};

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const year = getYear(post.date);

    if (!result[year]) {
      result[year] = [];
    }

    result[year].push(post);
  }

  return result;
};

// eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
export const getStaticPropsArchive: GetStaticProps<ArchiveProps> = (context) => {
  const posts = getPostsListJson();
  const archives = divideByYearArchive(posts);

  return {
    props: {
      archives,
      numberOfPosts: posts.length,
    },
  };
};
