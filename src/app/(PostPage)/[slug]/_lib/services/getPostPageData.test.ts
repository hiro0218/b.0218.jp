import { describe, expect, it, vi } from 'vitest';
import type {
  ArticleSummary,
  PopularityDetail,
  Post,
  PostPopularityScores,
  PostSimilarityIndex,
  PostSummary,
  TagCounts,
  TagIndex,
  TagSimilarityScores,
} from '@/types/source';

const POST_WITH_SIMILAR: Post = {
  slug: 'post-with-similar',
  title: 'Post With Similar',
  date: '2024-01-01',
  content: '<p>body</p>',
  tags: ['react'],
};

const POST_WITHOUT_SIMILAR: Post = {
  slug: 'post-without-similar',
  title: 'Post Without Similar',
  date: '2024-01-02',
  content: '<p>body</p>',
  tags: ['rust'],
};

const POST_MULTI_TAG: Post = {
  slug: 'post-multi-tag',
  title: 'Post Multi Tag',
  date: '2024-01-03',
  content: '<p>body</p>',
  tags: ['go', 'react', 'rust'],
};

const POST_LONELY_TAG: Post = {
  slug: 'post-lonely-tag',
  title: 'Post Lonely Tag',
  date: '2024-01-04',
  content: '<p>body</p>',
  tags: ['onlytag'],
};

const POST_WITH_UPDATED: Post = {
  slug: 'post-with-updated',
  title: 'Post With Updated',
  date: '2024-01-05',
  updated: '2024-02-01',
  content: '<p>body</p>',
  tags: ['react'],
};

const POSTS_BY_SLUG: Record<string, Post> = {
  [POST_WITH_SIMILAR.slug]: POST_WITH_SIMILAR,
  [POST_WITHOUT_SIMILAR.slug]: POST_WITHOUT_SIMILAR,
  [POST_MULTI_TAG.slug]: POST_MULTI_TAG,
  [POST_LONELY_TAG.slug]: POST_LONELY_TAG,
  [POST_WITH_UPDATED.slug]: POST_WITH_UPDATED,
};

const POSTS_LIST: PostSummary[] = [
  { slug: 'post-with-similar', title: 'Post With Similar', date: '2024-01-01', tags: ['react'] },
  { slug: 'post-without-similar', title: 'Post Without Similar', date: '2024-01-02', tags: ['rust'] },
  { slug: 'post-multi-tag', title: 'Post Multi Tag', date: '2024-01-03', tags: ['go', 'react', 'rust'] },
  { slug: 'related-by-similarity', title: 'Related Similar', date: '2024-01-05', tags: ['react'] },
  { slug: 'rust-mate-1', title: 'Rust Mate 1', date: '2024-01-06', tags: ['rust'] },
  { slug: 'rust-mate-2', title: 'Rust Mate 2', date: '2024-01-07', tags: ['rust'] },
  { slug: 'react-mate-1', title: 'React Mate 1', date: '2024-01-08', tags: ['react'] },
  { slug: 'react-mate-2', title: 'React Mate 2', date: '2024-01-09', tags: ['react'] },
  { slug: 'post-lonely-tag', title: 'Post Lonely Tag', date: '2024-01-04', tags: ['onlytag'] },
  { slug: 'post-with-updated', title: 'Post With Updated', date: '2024-01-05', updated: '2024-02-01', tags: ['react'] },
];

const TAGS_INDEX: TagIndex = {
  react: ['post-with-similar', 'post-multi-tag', 'related-by-similarity', 'react-mate-1', 'react-mate-2'],
  rust: ['post-without-similar', 'post-multi-tag', 'rust-mate-1', 'rust-mate-2'],
  go: ['post-multi-tag'],
  onlytag: ['post-lonely-tag'],
};

const TAGS_WITH_COUNT: TagCounts[] = [
  { slug: 'react', count: 5 },
  { slug: 'rust', count: 4 },
  { slug: 'go', count: 1 },
  { slug: 'onlytag', count: 1 },
];

const SIMILAR_POSTS_INDEX: PostSimilarityIndex = {
  'post-with-similar': { 'related-by-similarity': 0.9 },
  'post-with-updated': { 'related-by-similarity': 0.7 },
};

const SIMILAR_TAGS_INDEX: TagSimilarityScores = {
  react: { rust: 0.8, go: 0.5 },
};

const POPULARITY_SCORES: PostPopularityScores = {
  'post-with-similar': { total: 100, ga: 80, hatena: 20 } satisfies PopularityDetail,
};

const RECENT_POSTS: ArticleSummary[] = [{ title: 'Recent', slug: 'recent-1', date: '2024/02/02', tags: ['x'] }];

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return { ...actual, cache: <T>(fn: T): T => fn };
});

vi.mock('@/lib/source/post', () => ({
  getPostBySlug: vi.fn((slug: string) => POSTS_BY_SLUG[slug] ?? null),
  getPostsListJson: () => POSTS_LIST,
}));

vi.mock('@/lib/source/tag', () => ({
  getTagsJson: () => TAGS_INDEX,
  getTagsWithCount: () => TAGS_WITH_COUNT,
}));

vi.mock('@/lib/post/derived', () => ({
  getPostsPopular: () => POPULARITY_SCORES,
  getSimilarPosts: () => SIMILAR_POSTS_INDEX,
}));

vi.mock('@/lib/tag/derived', () => ({
  getSimilarTag: () => SIMILAR_TAGS_INDEX,
}));

vi.mock('@/lib/post/list', () => ({
  recentPosts: RECENT_POSTS,
}));

const { getPostPageData } = await import('./getPostPageData');

describe('getPostPageData', () => {
  it('post が存在しない場合、null を返す', () => {
    expect(getPostPageData('missing')).toBeNull();
  });

  it('.html 拡張子を正規化して post を取得する', () => {
    const data = getPostPageData(`${POST_WITH_SIMILAR.slug}.html`);

    expect(data?.post.slug).toBe(POST_WITH_SIMILAR.slug);
  });

  it('date と updated を表示用フォーマットへ整形し、meta に raw 値を残す', () => {
    const data = getPostPageData(POST_WITH_UPDATED.slug);

    expect(data?.post.date).toBe('2024/01/05');
    expect(data?.post.updated).toBe('2024/02/01');
    expect(data?.post.meta).toEqual({ publishedTime: '2024-01-05', modifiedTime: '2024-02-01' });
  });

  it('tags は count >= TAG_VIEW_LIMIT のとき isNavigable=true になる', () => {
    const data = getPostPageData(POST_MULTI_TAG.slug);

    expect(data?.post.tagsWithCount).toEqual([
      { slug: 'go', count: 1, isNavigable: false },
      { slug: 'react', count: 5, isNavigable: true },
      { slug: 'rust', count: 4, isNavigable: true },
    ]);
  });

  it('類似記事インデックスに entry がある場合、その slug 群を similarPost として返す', () => {
    const data = getPostPageData(POST_WITH_SIMILAR.slug);

    expect(data?.similarPost.map((post) => post.slug)).toEqual(['related-by-similarity']);
  });

  it('類似記事インデックスに entry が無い場合、先頭タグの他記事で補完する', () => {
    const data = getPostPageData(POST_WITHOUT_SIMILAR.slug);

    const slugs = data?.similarPost.map((post) => post.slug) ?? [];
    expect(slugs).not.toContain(POST_WITHOUT_SIMILAR.slug);
    expect(slugs).toEqual(expect.arrayContaining(['post-multi-tag', 'rust-mate-1', 'rust-mate-2']));
  });

  it('similarTags は count >= TAG_VIEW_LIMIT のタグだけを count 降順で返す', () => {
    const data = getPostPageData(POST_WITH_SIMILAR.slug);

    expect(data?.similarTags).toEqual([{ slug: 'rust', count: 4, isNavigable: true }]);
  });

  it('mostPopularTag は post の tags の中で count が最大のタグを選ぶ', () => {
    const data = getPostPageData(POST_MULTI_TAG.slug);

    expect(data?.mostPopularTag?.slug).toBe('react');
    expect(data?.sameTagPosts.map((post) => post.slug)).not.toContain(POST_MULTI_TAG.slug);
  });

  it('mostPopularTag の同タグ記事が自分のみの場合、mostPopularTag は undefined となり sameTagPosts は空になる', () => {
    const data = getPostPageData(POST_LONELY_TAG.slug);

    expect(data?.mostPopularTag).toBeUndefined();
    expect(data?.sameTagPosts).toEqual([]);
  });

  it('popularityScores に entry がある場合、popularity を含める', () => {
    const data = getPostPageData(POST_WITH_SIMILAR.slug);

    expect(data?.popularity).toEqual({ total: 100, ga: 80, hatena: 20 });
  });

  it('popularityScores に entry が無い場合、popularity は undefined', () => {
    const data = getPostPageData(POST_LONELY_TAG.slug);

    expect(data?.popularity).toBeUndefined();
  });

  it('recentPosts はモジュール外の参照をそのまま含める', () => {
    const data = getPostPageData(POST_WITH_SIMILAR.slug);

    expect(data?.recentPosts).toBe(RECENT_POSTS);
  });
});
