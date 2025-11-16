import type { Post, PostSummary } from '@/types/source';
import { POST_DISPLAY_LIMIT, UPDATED_POST_DISPLAY_LIMIT } from './constant';
import { getDateAndUpdatedToSimpleFormat } from './getDateAndUpdatedToSimpleFormat';

type Props = {
  posts: (PostSummary | Post)[];
  options?: {
    withoutContent?: boolean;
  };
};

const filterPosts = ({ posts, options }: Props): PostSummary[] => {
  const { withoutContent = true } = options || {};

  return posts.map((post) => {
    const dateFormats = getDateAndUpdatedToSimpleFormat(post.date, post.updated);
    const result: PostSummary = {
      title: post.title,
      slug: post.slug,
      date: dateFormats.date,
      updated: dateFormats.updated,
      tags: post.tags,
    };

    if (!withoutContent && 'content' in post) {
      return { ...result, content: post.content, note: post.note };
    }

    return result;
  });
};

export const getRecentAndUpdatedPosts = ({ posts, options }: Props) => {
  const recentPosts = posts.slice(0, POST_DISPLAY_LIMIT);
  const filteredRecentPosts = filterPosts({
    posts: recentPosts,
    options,
  });

  const recentSlugs = new Set(recentPosts.map(({ slug }) => slug));

  const updatesPosts = posts
    .filter((post) => !!post.updated && post.date < post.updated && !recentSlugs.has(post.slug))
    .toSorted((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, UPDATED_POST_DISPLAY_LIMIT);

  const filteredUpdatedPosts = filterPosts({
    posts: updatesPosts,
    options,
  });

  return {
    recentPosts: filteredRecentPosts,
    updatesPosts: filteredUpdatedPosts,
  };
};
