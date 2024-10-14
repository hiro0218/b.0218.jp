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

  for (let i = 0; i < posts.length; i++) {
    paths.push({
      params: { post: `${posts[i].slug}.html` },
    });
  }

  return { paths, fallback: false };
};
