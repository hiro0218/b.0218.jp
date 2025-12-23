import { describe, expect, test } from 'vitest';
import { areAllValid, isEmptyQuery, isValidValue } from './validation';

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

  describe('isValidValue', () => {
    test('有効な文字列の場合はtrueを返す', () => {
      expect(isValidValue('test')).toBe(true);
      expect(isValidValue(' test ')).toBe(true);
    });

    test('空文字またはスペースのみの場合はfalseを返す', () => {
      expect(isValidValue('')).toBe(false);
      expect(isValidValue('  ')).toBe(false);
    });

    test('空でない配列の場合はtrueを返す', () => {
      expect(isValidValue(['item'])).toBe(true);
      expect(isValidValue([1, 2, 3])).toBe(true);
    });

    test('空配列の場合はfalseを返す', () => {
      expect(isValidValue([])).toBe(false);
    });

    test('nullまたはundefinedの場合はfalseを返す', () => {
      expect(isValidValue(null)).toBe(false);
      expect(isValidValue(undefined)).toBe(false);
    });

    test('その他の有効な値の場合はtrueを返す', () => {
      expect(isValidValue(0)).toBe(true);
      expect(isValidValue(false)).toBe(true);
      expect(isValidValue({})).toBe(true);
    });
  });

  describe('areAllValid', () => {
    test('すべての値が有効な場合はtrueを返す', () => {
      expect(areAllValid('test', [1], 123)).toBe(true);
    });

    test('いずれかの値が無効な場合はfalseを返す', () => {
      expect(areAllValid('test', null, 123)).toBe(false);
      expect(areAllValid('test', '', [1])).toBe(false);
      expect(areAllValid('test', [], 'value')).toBe(false);
    });

    test('引数なしの場合はtrueを返す', () => {
      expect(areAllValid()).toBe(true);
    });
  });
});
