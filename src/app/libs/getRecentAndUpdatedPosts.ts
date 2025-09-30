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

    // contentがある場合の処理を分離
    if (!withoutContent && 'content' in post) {
      return { ...result, content: post.content, note: post.note };
    }

    return result;
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
