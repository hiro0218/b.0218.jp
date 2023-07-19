import type { GetStaticPaths, GetStaticPathsContext } from 'next';

import { getPostsJson } from '@/lib/posts';

// eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
export const getStaticPathsPost: GetStaticPaths = (context: GetStaticPathsContext) => {
  const posts = getPostsJson();
  const paths = [];

  posts.forEach((post) => {
    paths.push({
      params: { post: `${post.slug}.html` },
    });
  });

  return { paths, fallback: false };
};
