import { describe, expect, it } from 'vitest';
import type { Post } from '@/types/source';
import { removePostsData } from './removePostData';

describe('removePostsData', () => {
  it('note と content が undefined になること', () => {
    const posts: Partial<Post>[] = [
      { title: 'Test', slug: 'test', content: '<p>body</p>', note: 'memo' },
      { title: 'Test2', slug: 'test2', content: '<p>body2</p>' },
    ];

    const result = removePostsData(posts);

    expect(result[0].content).toBeUndefined();
    expect(result[0].note).toBeUndefined();
    expect(result[1].content).toBeUndefined();
    expect(result[1].note).toBeUndefined();
  });

  it('title や slug など他のフィールドは保持されること', () => {
    const posts: Partial<Post>[] = [
      { title: 'Keep', slug: 'keep', date: '2024-01-01', content: 'remove', tags: ['a'] },
    ];

    const result = removePostsData(posts);

    expect(result[0].title).toBe('Keep');
    expect(result[0].slug).toBe('keep');
    expect(result[0].date).toBe('2024-01-01');
    expect(result[0].tags).toEqual(['a']);
  });

  it('空配列の場合、空配列を返すこと', () => {
    const result = removePostsData([]);

    expect(result).toEqual([]);
  });
});
