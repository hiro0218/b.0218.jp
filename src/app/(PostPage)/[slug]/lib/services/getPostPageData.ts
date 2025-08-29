import { getRecentAndUpdatedPosts } from '@/app/libs/getRecentAndUpdatedPosts';
import type { ArticleSummary, Post } from '@/types/source';
import { getPost, getSimilarPosts, getSimilarTags, getTagsWithCountFromSlugs } from '../data';
import { formatPostData, formatSimilarPosts, getAlternativePosts } from '../utils';

/** 投稿ページの戻り値の型定義 */
interface PostPageData {
  post: ReturnType<typeof formatPostData>;
  similarPost: ArticleSummary[];
  similarTags: Array<{ slug: string; count: number }>;
  recentPosts: ArticleSummary[];
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

  // 基本投稿データの取得
  const post = getPost(normalizedSlug) as Post | null;

  // 投稿が存在しない場合は早期リターン
  if (!post) {
    return null;
  }

  // タグデータの取得
  const tagsWithCount = getTagsWithCountFromSlugs(post.tags);
  const formattedPost = formatPostData(post, tagsWithCount);
  const tag = post.tags?.[0];

  // 必要なデータを個別に取得
  // 最新記事の取得
  const allPosts = getPost() as Post[];

  // 関連タグの取得
  const similarTags = tag ? getSimilarTags(tag) : [];

  // 類似記事の取得
  const rawSimilarPost = getSimilarPosts(normalizedSlug);

  // 最新記事の整形
  const { recentPosts } = getRecentAndUpdatedPosts({
    posts: allPosts,
  });

  // 類似記事の整形
  let similarPost = formatSimilarPosts(rawSimilarPost);
  // 類似記事が少ない場合は代替の記事を取得
  similarPost = getAlternativePosts(similarPost, tag, normalizedSlug);

  // 結果の組み立て
  return {
    post: formattedPost,
    similarPost,
    similarTags,
    recentPosts,
  } satisfies PostPageData;
}
