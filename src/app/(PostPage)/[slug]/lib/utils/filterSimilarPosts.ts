import { UPDATED_POST_DISPLAY_LIMIT } from '@/app/_lib/constants';
import { getDateAndUpdatedToSimpleFormat } from '@/app/_lib/getDateAndUpdatedToSimpleFormat';
import { getTagPosts } from '@/app/_lib/getTagPosts';
import type { ArticleSummary } from '@/types/source';

/**
 * 類似記事が不足している場合に同一タグから代替記事を取得する
 *
 * @param similarPosts - 元の類似記事の配列
 * @param tag - 記事に関連するタグのスラッグ
 * @param currentSlug - 現在表示中の記事のスラッグ
 * @returns 類似記事または代替記事の配列
 */
export function getAlternativePosts(
  similarPosts: ArticleSummary[],
  tag: string,
  currentSlug: string,
): ArticleSummary[] {
  // 既に類似記事がある場合や、タグがない場合は元の配列をそのまま返す
  if (similarPosts.length > 0 || !tag) {
    return similarPosts;
  }

  // 同一タグの記事を取得
  const tagPosts = getTagPosts(tag);
  if (!tagPosts) {
    return [];
  }

  // 現在の記事を除外し、表示数を制限
  return tagPosts.filter((tagPost) => tagPost.slug !== currentSlug).slice(0, UPDATED_POST_DISPLAY_LIMIT);
}

export function formatSimilarPosts(posts: ArticleSummary[]): ArticleSummary[] {
  if (!posts || posts.length === 0) {
    return [];
  }

  return posts.map((post) => ({
    ...post,
    ...getDateAndUpdatedToSimpleFormat(post.date, post.updated),
  }));
}
