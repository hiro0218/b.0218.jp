import { UPDATED_POST_DISPLAY_LIMIT } from '@/app/_lib/constants';
import { getDateAndUpdatedToSimpleFormat } from '@/app/_lib/getDateAndUpdatedToSimpleFormat';
import { getTagPosts } from '@/app/_lib/getTagPosts';
import type { ArticleSummary } from '@/types/source';

/** 代替記事のメモリキャッシュ */
const alternativePostsCache = new Map<string, ArticleSummary[]>();
const formattedPostsCache = new Map<string, ArticleSummary>();

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

  // キャッシュにある場合はキャッシュから返す
  const cacheKey = `${tag}_${currentSlug}`;
  if (alternativePostsCache.has(cacheKey)) {
    return alternativePostsCache.get(cacheKey) || [];
  }

  // 同一タグの記事を取得
  const tagPosts = getTagPosts(tag);
  if (!tagPosts) {
    alternativePostsCache.set(cacheKey, []);
    return [];
  }

  // 現在の記事を除外し、表示数を制限
  const result = tagPosts.filter((tagPost) => tagPost.slug !== currentSlug).slice(0, UPDATED_POST_DISPLAY_LIMIT);

  // 結果をキャッシュに保存
  alternativePostsCache.set(cacheKey, result);
  return result;
}

export function formatSimilarPosts(posts: ArticleSummary[]): ArticleSummary[] {
  if (!posts || posts.length === 0) {
    return [];
  }

  // 結果配列の初期化
  const result: ArticleSummary[] = [];

  for (const post of posts) {
    const { slug, date, updated } = post;
    const cacheKey = `${slug}_${date}_${updated || ''}`;

    // キャッシュから取得
    if (formattedPostsCache.has(cacheKey)) {
      result.push(formattedPostsCache.get(cacheKey) as ArticleSummary);
      continue;
    }

    // 日付フォーマット処理を適用した新しいオブジェクトを作成
    const formattedPost = {
      ...post,
      ...getDateAndUpdatedToSimpleFormat(date, updated),
    };

    // 結果をキャッシュに保存して再利用可能にする
    formattedPostsCache.set(cacheKey, formattedPost);
    result.push(formattedPost);
  }

  return result;
}
