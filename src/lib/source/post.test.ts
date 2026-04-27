import { describe, expect, test } from 'vitest';
import { getPostBySlug, getPostsListJson } from './post';

describe('getPostBySlug', () => {
  test.each([
    '../escape',
    'foo/bar',
    '',
    'with space',
    'foo.bar',
    'foo%20bar',
  ])('スラグパターンに合わない slug "%s" の場合、ファイルアクセスせずに null を返す', (slug) => {
    expect(getPostBySlug(slug)).toBeNull();
  });
});

describe('getPostsListJson', () => {
  test('複数回呼び出した場合、同一参照を返す', () => {
    expect(getPostsListJson()).toBe(getPostsListJson());
  });
});
