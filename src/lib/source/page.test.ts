import { describe, expect, test } from 'vitest';
import { getPagesJson } from './page';

describe('getPagesJson', () => {
  test('複数回呼び出した場合、同一参照を返す', () => {
    expect(getPagesJson()).toBe(getPagesJson());
  });
});
