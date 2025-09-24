import { TAG_VIEW_LIMIT } from '@/constant';
import { getPostsJson, getSimilarPosts as getSimilarPostsJson, getSimilarTag, getTagsJson } from '@/lib/posts';
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
    // 記事数が少ないタグは関連性が低いため除外する
    if (tagPosts.length >= TAG_VIEW_LIMIT) {
      validTags.push({ slug, count: tagPosts.length });
    }
  }

  validTags.sort((a, b) => b.count - a.count);

  return validTags.slice(0, LIMIT_TAG_LIST);
}
