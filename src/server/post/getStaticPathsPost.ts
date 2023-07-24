import type { GetStaticPaths } from 'next';

import { getPostsJson } from '@/lib/posts';

export const getStaticPathsPost: GetStaticPaths = () => {
  const posts = getPostsJson();
  const paths = [];

  posts.forEach((post) => {
    paths.push({
      params: { post: `${post.slug}.html` },
    });
  });

  return { paths, fallback: false };
};
