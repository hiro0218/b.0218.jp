import type { PostListProps, PostProps } from '@/types/source';

import { POST_DISPLAY_LIMIT, UPDATED_POST_DISPLAY_LIMIT } from './constant';

type Props = {
  posts: (PostListProps | PostProps)[];
  options?: {
    withoutContent?: boolean;
  };
};

const filterPosts = ({ posts, options }: Props) => {
  const { withoutContent = true } = options || {};

  return posts.map((post) => {
    if ('content' in post && withoutContent) {
      const { content, note, readingTime, ...rest } = post;
      return rest;
    }

    return post;
  });
};

export const getRecentAndUpdatedPosts = ({ posts, options }: Props) => {
  const recentPosts = filterPosts({ posts: posts.slice(0, POST_DISPLAY_LIMIT), options });
  const recentSlugs = new Set(recentPosts.map(({ slug }) => slug));
  const updatesPosts = filterPosts({
    posts: posts
      .filter((post) => !!post.updated && post.date < post.updated && !recentSlugs.has(post.slug))
      .sort((a, b) => b.updated.localeCompare(a.updated))
      .slice(0, UPDATED_POST_DISPLAY_LIMIT),
    options,
  });

  return {
    recentPosts,
    updatesPosts,
  };
};
