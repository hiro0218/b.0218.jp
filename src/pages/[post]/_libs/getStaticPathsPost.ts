import type { GetStaticPaths } from 'next';

import { getPostsListJson } from '@/lib/posts';

type PostParams = {
  params: {
    post: string;
  };
};

export const getStaticPathsPost: GetStaticPaths = () => {
  const posts = getPostsListJson();
  const paths: PostParams[] = [];

  for (const post of posts.values()) {
    paths.push({
      params: { post: `${post.slug}.html` },
    });
  }

  return { paths, fallback: false };
};
