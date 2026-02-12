import type { IpadicFeatures, Tokenizer } from 'kuromoji';
import { describe, expect, it, vi } from 'vitest';
import type { Post } from '@/types/source';
import { generateSearchIndex } from './invertedIndex';

const WHITESPACE_REGEX = /\s+/;

vi.mock('./tokenizer', () => ({
  tokenizeText: vi.fn((text: string) => {
    return text.split(WHITESPACE_REGEX).filter((t) => t.length > 1);
  }),
}));

const mockTokenizer = {} as Tokenizer<IpadicFeatures>;

function createPost(overrides: Partial<Post>): Post {
  return {
    title: 'Default Title',
    slug: 'default',
    date: '2024-01-01',
    content: '',
    tags: [],
    ...overrides,
  } as Post;
}

describe('generateSearchIndex', () => {
  it('転置インデックスと検索用データを生成すること', () => {
    const posts = [
      createPost({ title: 'React入門', slug: 'react-intro', tags: ['react', 'frontend'] }),
      createPost({ title: 'React応用', slug: 'react-advanced', tags: ['react'] }),
    ];

    const { invertedIndex, searchData } = generateSearchIndex(posts, mockTokenizer);

    // react タグで両方の記事が登録される
    expect(invertedIndex['react']).toContain('react-intro');
    expect(invertedIndex['react']).toContain('react-advanced');

    // searchData が正しく生成される
    expect(searchData).toHaveLength(2);
    expect(searchData[0].slug).toBe('react-intro');
    expect(searchData[1].slug).toBe('react-advanced');
  });

  it('slug が未定義の記事をスキップすること', () => {
    const posts = [
      createPost({ title: 'No slug', slug: '', tags: ['test'] }),
      createPost({ title: 'Valid', slug: 'valid', tags: ['test'] }),
    ];

    const { searchData } = generateSearchIndex(posts, mockTokenizer);

    expect(searchData).toHaveLength(1);
    expect(searchData[0].slug).toBe('valid');
  });

  it('空配列の場合、空の結果を返すこと', () => {
    const { invertedIndex, searchData } = generateSearchIndex([], mockTokenizer);

    expect(Object.keys(invertedIndex)).toHaveLength(0);
    expect(searchData).toHaveLength(0);
  });

  it('タグが正規化されて転置インデックスに登録されること', () => {
    const posts = [
      createPost({ title: 'Test', slug: 'post1', tags: ['TypeScript'] }),
      createPost({ title: 'Test2', slug: 'post2', tags: ['typescript'] }),
    ];

    const { invertedIndex } = generateSearchIndex(posts, mockTokenizer);

    // 正規化されたタグ typescript に両方の slug が含まれる
    expect(invertedIndex['typescript']).toContain('post1');
    expect(invertedIndex['typescript']).toContain('post2');
  });

  it('トークンとタグが同じ文字列の場合、slugが重複しないこと', () => {
    const posts = [createPost({ title: 'react hooks', slug: 'post1', tags: ['react'] })];

    const { invertedIndex } = generateSearchIndex(posts, mockTokenizer);

    const reactSlugs = invertedIndex['react'];
    expect(reactSlugs).toEqual([...new Set(reactSlugs)]);
  });
});
