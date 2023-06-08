import type { GetStaticPaths, GetStaticPathsContext } from 'next';

import { getPostsJson } from '@/lib/posts';

const posts = getPostsJson();

// eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
export const getStaticPathsPost: GetStaticPaths = (context: GetStaticPathsContext) => {
  const paths = posts.map(({ slug }) => ({
    params: { post: `${slug}.html` },
  }));

  return { paths, fallback: false };
};
