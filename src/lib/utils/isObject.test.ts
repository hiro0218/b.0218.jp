import { describe, expect, test } from 'vitest';
import { isObject } from './isObject';

describe('isObject', () => {
  test.each([
    [{}, true],
    [{ a: 1 }, true],
    [[], true],
    [null, false],
    [undefined, false],
    ['string', false],
    [42, false],
    [true, false],
  ] as const)('%j の場合、%s を返す', (input, expected) => {
    expect(isObject(input)).toBe(expected);
  });
});
