import { describe, expect, test } from 'vitest';
import { isEmptyQuery } from './validation';

describe('validation utilities', () => {
  describe('isEmptyQuery', () => {
    test('空文字の場合はtrueを返す', () => {
      expect(isEmptyQuery('')).toBe(true);
    });

    test('スペースのみの場合はtrueを返す', () => {
      expect(isEmptyQuery('  ')).toBe(true);
      expect(isEmptyQuery('\t\n')).toBe(true);
    });

    test('nullまたはundefinedの場合はtrueを返す', () => {
      expect(isEmptyQuery(null)).toBe(true);
      expect(isEmptyQuery(undefined)).toBe(true);
    });

    test('有効な文字列の場合はfalseを返す', () => {
      expect(isEmptyQuery('search')).toBe(false);
      expect(isEmptyQuery(' search ')).toBe(false);
      expect(isEmptyQuery('JavaScript')).toBe(false);
    });
  });
});
