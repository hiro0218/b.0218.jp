import { getPostsPopular } from '@/lib/post/derived';
import { getPostsListJson } from '@/lib/source/post';
import type { Post, PostSummary } from '@/types/source';
import { formatPostSummary } from './summary';

const RECENT_POST_DISPLAY_LIMIT = 6;
const IGNORED_POPULAR_POST_SLUGS = new Set(['20141105125846', '20171223014544']);
const IGNORED_POST_TAGS = new Set(['名探偵コナン']);

const createPostsMap = (posts: ReturnType<typeof getPostsListJson>) => {
  return new Map(posts.map((post) => [post.slug, post]));
};

// getPostsPopular() 自体は dist 側でキャッシュ済みだが、そこから作る人気度降順の
// slug 配列は list.ts 独自の派生計算のため、呼び出しのたびに再ソートしないようここでメモ化する。
let sortedPopularSlugsCache: string[] | undefined;
const getSortedPopularSlugs = (): string[] => {
  sortedPopularSlugsCache ??= Object.entries(getPostsPopular())
    .sort(([, a], [, b]) => b.total - a.total)
    .map(([slug]) => slug);
  return sortedPopularSlugsCache;
};

export const isIgnoredPostTag = (tag: string): boolean => {
  return IGNORED_POST_TAGS.has(tag);
};

export const getFilteredPosts = (): PostSummary[] => {
  return getPostsListJson().filter((post) => !post.tags.some(isIgnoredPostTag));
};

const sliceRecentPosts = (posts: (PostSummary | Post)[]): PostSummary[] => {
  return posts.slice(0, RECENT_POST_DISPLAY_LIMIT).map(formatPostSummary);
};

export const getPopularPost = (posts: ReturnType<typeof getPostsListJson>, displayLimit: number): PostSummary[] => {
  const postsMap = createPostsMap(posts);

  return getSortedPopularSlugs()
    .filter((slug) => !IGNORED_POPULAR_POST_SLUGS.has(slug))
    .map((slug) => postsMap.get(slug))
    .filter((post) => post !== undefined)
    .map(formatPostSummary)
    .slice(0, displayLimit);
};

// モジュールロード時点の即時評価だと vi.mock で dist 依存を差し替える前に実行され
// テスト不能だった。呼び出し時まで評価を遅延しメモ化する (SSG はビルド時に一度しか
// 呼ばないため、遅延化しても結果は同一)。
let recentPostsCache: PostSummary[] | undefined;
export const getRecentPosts = (): PostSummary[] => {
  recentPostsCache ??= sliceRecentPosts(getFilteredPosts());
  return recentPostsCache;
};
