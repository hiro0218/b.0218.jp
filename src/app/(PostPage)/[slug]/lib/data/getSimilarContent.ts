import { TAG_VIEW_LIMIT } from '@/constants';
import { getPostsJson, getSimilarPosts as getSimilarPostsJson, getSimilarTag, getTagsJson } from '@/lib/data/posts';
import type { ArticleSummary } from '@/types/source';

const LIMIT_TAG_LIST = 10;

const cachedSimilarPosts = getSimilarPostsJson();
const cachedPosts = getPostsJson();
const cachedTagData = getTagsJson();
const cachedSimilarTags = getSimilarTag();

// 投稿検索のパフォーマンス向上のため、O(n)のfind()をO(1)のMap検索に置き換える
const postsMap = new Map<string, ArticleSummary>();
for (let i = 0; i < cachedPosts.length; i++) {
  const post = cachedPosts[i];
  postsMap.set(post.slug, {
    title: post.title,
    slug: post.slug,
    date: post.date,
    updated: post.updated,
  });
}

function getSimilarPostMapping(slug: string) {
  for (let i = 0; i < cachedSimilarPosts.length; i++) {
    const item = cachedSimilarPosts[i];
    if (slug in item) {
      return item[slug];
    }
  }
  return null;
}

/**
 * 指定された投稿に関連性の高い他の記事を取得する
 * @param slug - 投稿のスラッグ
 * @returns 関連記事のリスト
 * @example
 * const relatedPosts = getSimilarPosts('react-hooks');
 */
export function getSimilarPosts(slug: string): ArticleSummary[] {
  const similarPostSlugs = getSimilarPostMapping(slug);

  if (!similarPostSlugs) {
    return [];
  }

  const results: ArticleSummary[] = [];
  const slugs = Object.keys(similarPostSlugs);

  for (let i = 0; i < slugs.length; i++) {
    const postSlug = slugs[i];
    const post = postsMap.get(postSlug);
    if (post) {
      results.push(post);
    }
  }

  return results;
}

function getTagPostsMapping(slug: string): string[] {
  return cachedTagData[slug] || [];
}

/**
 * 指定されたタグに関連する類似タグを記事数順で取得する
 * @param tag - タグ名
 * @returns 類似タグのリスト
 * @example
 * const relatedTags = getSimilarTags('javascript');
 */
export function getSimilarTags(tag: string) {
  if (!tag) {
    return [];
  }

  const similarTagsList = cachedSimilarTags[tag];
  if (!similarTagsList) {
    return [];
  }

  const tagSlugs = Object.keys(similarTagsList);
  const validTags: { slug: string; count: number }[] = [];

  for (let i = 0; i < tagSlugs.length; i++) {
    const slug = tagSlugs[i];
    const tagPosts = getTagPostsMapping(slug);
    if (tagPosts.length >= TAG_VIEW_LIMIT) {
      validTags.push({ slug, count: tagPosts.length });
    }
  }

  const sortedValidTags = validTags.toSorted((a, b) => b.count - a.count);

  return sortedValidTags.slice(0, LIMIT_TAG_LIST);
}

/**
 * 指定されたタグに属する記事を取得する
 * @param tagSlug - タグのスラッグ
 * @param excludeSlug - 除外する記事のスラッグ（通常は現在の記事）
 * @param limit - 取得件数の上限（デフォルト: 4）
 * @returns 記事のリスト
 * @example
 * const posts = getPostsByTag('javascript', 'current-post-slug', 4);
 */
export function getPostsByTag(tagSlug: string, excludeSlug: string, limit = 4): ArticleSummary[] {
  const postSlugs = getTagPostsMapping(tagSlug);

  if (!postSlugs || postSlugs.length === 0) {
    return [];
  }

  const results: ArticleSummary[] = [];

  for (let i = 0; i < postSlugs.length; i++) {
    const slug = postSlugs[i];
    if (slug === excludeSlug) {
      continue;
    }

    const post = postsMap.get(slug);
    if (post) {
      results.push(post);
    }

    if (results.length >= limit) {
      break;
    }
  }

  return results;
}
