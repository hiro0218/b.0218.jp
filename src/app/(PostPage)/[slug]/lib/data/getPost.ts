import { getPostsJson, getTagsWithCount } from '@/lib/data/posts';

const posts = getPostsJson();
const tagDataWithCount = getTagsWithCount();
const postsMap = new Map(posts.map((post) => [post.slug, post]));

const tagDataWithCountBySlug: Record<string, (typeof tagDataWithCount)[number]> = {};
for (let i = 0; i < tagDataWithCount.length; i++) {
  const tag = tagDataWithCount[i];
  tagDataWithCountBySlug[tag.slug] = tag;
}

/**
 * 投稿データを取得する関数
 * @param slug - 投稿のスラッグ（nullの場合は全投稿を返す）
 * @returns 指定されたスラッグの投稿、全投稿の配列、または該当データがない場合はnull
 * @example
 * // 特定の投稿を取得
 * const post = getPost('sample-post');
 * // 全投稿を取得
 * const allPosts = getPost();
 */
export function getPost(slug?: string | null) {
  if (!slug) {
    return posts;
  }

  const normalizedSlug = slug.replace('.html', '');

  return postsMap.get(normalizedSlug) || null;
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

  return slugs.map((slug) => tagDataWithCountBySlug[slug]).filter(Boolean);
}
