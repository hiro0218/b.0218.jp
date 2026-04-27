import { describe, expect, test } from 'vitest';
import { createEagerSource } from './eagerSource';

type SampleConfig = { name: string; count: number };

const isSampleConfig = (value: unknown): value is SampleConfig => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.name === 'string' && typeof obj.count === 'number';
};

describe('createEagerSource', () => {
  test('正常なデータの場合、検証済みの値を返す', () => {
    const source = createEagerSource({
      data: { name: 'test', count: 1 },
      validate: isSampleConfig,
      label: 'sample',
    });

    expect(source.get()).toEqual({ name: 'test', count: 1 });
  });

  test('検証失敗の場合、label を含むエラーで throw する', () => {
    const source = createEagerSource({
      data: { wrong: 'shape' },
      validate: isSampleConfig,
      label: 'sample',
    });

    expect(() => source.get()).toThrow('[source/sample] Invalid data');
  });

  test('複数回呼び出した場合、同一参照を返す', () => {
    const source = createEagerSource({
      data: { name: 'test', count: 1 },
      validate: isSampleConfig,
      label: 'sample',
    });

    expect(source.get()).toBe(source.get());
  });

  test('一度成功した検証は再実行されない', () => {
    let validateCallCount = 0;
    const validate = (value: unknown): value is SampleConfig => {
      validateCallCount++;
      return isSampleConfig(value);
    };

    const source = createEagerSource({
      data: { name: 'test', count: 1 },
      validate,
      label: 'sample',
    });

    source.get();
    source.get();
    source.get();

    expect(validateCallCount).toBe(1);
  });
});
