import { getDateAndUpdatedToSimpleFormat } from '@/pages/_libs/getDateAndUpdatedToSimpleFormat';
import type { PostListProps, PostProps } from '@/types/source';
import { POST_DISPLAY_LIMIT, UPDATED_POST_DISPLAY_LIMIT } from './constant';

type Props = {
  posts: (PostListProps | PostProps)[];
  options?: {
    withoutContent?: boolean;
  };
};

const filterPosts = ({ posts, options }: Props): PostListProps[] => {
  const { withoutContent = true } = options || {};

  return posts.map((post) => {
    post = {
      ...post,
      ...getDateAndUpdatedToSimpleFormat(post.date, post.updated),
    };

    if (withoutContent && 'content' in post) {
      // 'content' プロパティが存在し、withoutContent が true の場合、content, note, readingTime を除外
      const { content, note, readingTime, ...rest } = post;
      return rest;
    }

    return post;
  });
};

export const getRecentAndUpdatedPosts = ({ posts, options }: Props) => {
  // 最近の投稿を取得
  const recentPosts = posts.slice(0, POST_DISPLAY_LIMIT);
  const filteredRecentPosts = filterPosts({
    posts: recentPosts,
    options,
  });

  // 最近の投稿のスラッグをセットに追加
  const recentSlugs = new Set(recentPosts.map(({ slug }) => slug));

  // 更新された投稿をフィルタリング
  const updatesPosts = posts
    .filter((post) => {
      // 更新日が存在し、作成日より後で、最近の投稿に含まれていない
      return !!post.updated && post.date < post.updated && !recentSlugs.has(post.slug);
    })
    .sort((a, b) => b.updated.localeCompare(a.updated)) // 更新日でソート
    .slice(0, UPDATED_POST_DISPLAY_LIMIT);

  // 更新された投稿をフィルタリング
  const filteredUpdatedPosts = filterPosts({
    posts: updatesPosts,
    options,
  });

  return {
    recentPosts: filteredRecentPosts,
    updatesPosts: filteredUpdatedPosts,
  };
};
