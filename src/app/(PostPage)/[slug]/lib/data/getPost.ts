import { TAG_VIEW_LIMIT } from '@/constants';
import { getPostBySlug, getTagsWithCount } from '@/lib/data/posts';
import type { Post } from '@/types/source';

const tagDataWithCount = getTagsWithCount();

const tagDataWithCountBySlug: Record<string, (typeof tagDataWithCount)[number]> = {};
for (let i = 0; i < tagDataWithCount.length; i++) {
  const tag = tagDataWithCount[i];
  tagDataWithCountBySlug[tag.slug] = tag;
}

/**
 * 投稿データを取得する関数
 * @param slug - 投稿のスラッグ
 * @returns 指定されたスラッグの投稿、または該当データがない場合はnull
 * @example
 * const post = getPost('sample-post');
 */
export function getPost(slug: string): Post | null {
  const normalizedSlug = slug.replace('.html', '');
  return getPostBySlug(normalizedSlug);
}

/**
 * タグデータをスラッグ配列から取得する
 *
 * @param slugs - タグのスラッグ配列
 * @returns 指定されたスラッグに対応するタグオブジェクトの配列
 * @example
 * // 複数のタグを取得
 * const tags = getTagsWithCountFromSlugs(['javascript', 'typescript']);
 */
export function getTagsWithCountFromSlugs(slugs: string[]) {
  if (!slugs || slugs.length === 0) {
    return [];
  }

  return slugs
    .map((slug) => tagDataWithCountBySlug[slug])
    .filter(Boolean)
    .map((tag) => ({ ...tag, isNavigable: tag.count >= TAG_VIEW_LIMIT }));
}
