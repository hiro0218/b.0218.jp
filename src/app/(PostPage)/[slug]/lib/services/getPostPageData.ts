import { getRecentAndUpdatedPosts } from '@/app/_lib/getRecentAndUpdatedPosts';
import { getPostsPopular } from '@/lib/data/posts';
import { isPost, isPostArray } from '@/lib/guards';
import type { ArticleSummary, PopularityDetail } from '@/types/source';
import { getPost, getPostsByTag, getSimilarPosts, getSimilarTags, getTagsWithCountFromSlugs } from '../data';
import { formatPostData, formatSimilarPosts, getAlternativePosts } from '../utils';

// 最新記事は全ページで同一のため、モジュールレベルでキャッシュ
const allPostsForCache = getPost();
const { recentPosts: cachedRecentPosts } =
  Array.isArray(allPostsForCache) && isPostArray(allPostsForCache)
    ? getRecentAndUpdatedPosts(allPostsForCache)
    : { recentPosts: [] };

/** 投稿ページの戻り値の型定義 */
interface PostPageData {
  post: ReturnType<typeof formatPostData>;
  similarPost: ArticleSummary[];
  similarTags: Array<{ slug: string; count: number }>;
  recentPosts: ArticleSummary[];
  sameTagPosts: ArticleSummary[];
  mostPopularTag?: { slug: string; count: number };
  popularity?: PopularityDetail;
}

/**
 * 投稿ページに必要なデータを取得し整形する
 *
 * @param slug - 投稿スラッグ
 * @returns 整形された投稿データと関連情報
 */
export function getPostPageData(slug: string): PostPageData | null {
  // スラッグを正規化（.html拡張子を削除）
  const normalizedSlug = slug.replace('.html', '');

  // 基本投稿データの取得と型検証
  const post = getPost(normalizedSlug);

  if (Array.isArray(post)) {
    console.error('[getPostPageData] Unexpected array returned for single post query');
    return null;
  }

  if (!isPost(post)) {
    console.error('[getPostPageData] Invalid post data structure');
    return null;
  }

  // タグデータの取得
  const tagsWithCount = getTagsWithCountFromSlugs(post.tags);
  const formattedPost = formatPostData(post, tagsWithCount);
  const tag = post.tags?.[0];

  // 関連タグの取得
  const similarTags = tag ? getSimilarTags(tag) : [];

  // 類似記事の取得
  const rawSimilarPost = getSimilarPosts(normalizedSlug);

  // 類似記事の整形
  let similarPost = formatSimilarPosts(rawSimilarPost);
  // 類似記事が少ない場合は代替の記事を取得
  similarPost = getAlternativePosts(similarPost, tag, normalizedSlug);

  // 人気度データの取得
  const popularityScores = getPostsPopular();
  const popularity = popularityScores[normalizedSlug];

  // 記事数が最も多いタグの記事を取得
  const mostPopularTagCandidate =
    tagsWithCount.length > 0 ? tagsWithCount.toSorted((a, b) => b.count - a.count)[0] : null;
  const rawSameTagPosts = mostPopularTagCandidate ? getPostsByTag(mostPopularTagCandidate.slug, normalizedSlug, 4) : [];
  // 日付フォーマットを整形
  const sameTagPosts = formatSimilarPosts(rawSameTagPosts);
  // 記事が取得できた場合のみmostPopularTagを設定
  const mostPopularTag = sameTagPosts.length > 0 ? mostPopularTagCandidate : undefined;

  // 結果の組み立て
  return {
    post: formattedPost,
    similarPost,
    similarTags,
    recentPosts: cachedRecentPosts,
    sameTagPosts,
    mostPopularTag,
    popularity,
  } satisfies PostPageData;
}
