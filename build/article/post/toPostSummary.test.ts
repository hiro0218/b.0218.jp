import { describe, expect, it } from 'vitest';
import type { Post } from '@/types/source';
import { toPostSummary } from './toPostSummary';

describe('toPostSummary', () => {
  it('記事本文と投稿専用メタデータを除外すること', () => {
    const posts: Post[] = [
      {
        title: 'Test',
        slug: 'test',
        date: '2024-01-01',
        updated: '2024-01-02',
        content: '<p>body</p>',
        note: 'memo',
        noindex: true,
        tags: ['a'],
      },
    ];

    const result = toPostSummary(posts);

    expect(result).toEqual([
      {
        title: 'Test',
        slug: 'test',
        date: '2024-01-01',
        updated: '2024-01-02',
        tags: ['a'],
      },
    ]);
  });

  it('入力記事を変更しないこと', () => {
    const posts: Post[] = [
      {
        title: 'Keep',
        slug: 'keep',
        date: '2024-01-01',
        content: 'body',
        note: 'memo',
        tags: ['a'],
      },
    ];

    toPostSummary(posts);

    expect(posts[0].content).toBe('body');
    expect(posts[0].note).toBe('memo');
  });

  it('空配列の場合、空配列を返すこと', () => {
    expect(toPostSummary([])).toEqual([]);
  });
});
