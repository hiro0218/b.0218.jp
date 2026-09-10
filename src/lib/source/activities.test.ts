import { describe, expect, test } from 'vitest';
import { getActivitiesJson } from './activities';

describe('getActivitiesJson', () => {
  test('複数回呼び出した場合、同一参照を返す', () => {
    expect(getActivitiesJson()).toBe(getActivitiesJson());
  });
});
