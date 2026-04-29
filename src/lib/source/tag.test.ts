import { describe, expect, test } from 'vitest';
import { getTagsJson, getTagsWithCount } from './tag';

describe('getTagsJson', () => {
  test('複数回呼び出した場合、同一参照を返す', () => {
    expect(getTagsJson()).toBe(getTagsJson());
  });
});

describe('getTagsWithCount', () => {
  test('複数回呼び出した場合、同一参照を返す', () => {
    expect(getTagsWithCount()).toBe(getTagsWithCount());
  });
});
