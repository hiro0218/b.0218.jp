import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { safeJsonParse, safeJsonStringify } from './json';

describe('json utilities', () => {
  let consoleSpy: MockInstance;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('safeJsonParse', () => {
    test('有効な JSON をパースする', () => {
      const result = safeJsonParse<{ name: string }>(JSON.stringify({ name: 'test' }));
      expect(result).toEqual({ name: 'test' });
    });

    test('null を受け取った場合 null を返す', () => {
      const result = safeJsonParse(null);
      expect(result).toBeNull();
    });

    test('空文字列の場合 null を返す', () => {
      const result = safeJsonParse('');
      expect(result).toBeNull();
    });

    test('無効な JSON の場合 null を返す', () => {
      const result = safeJsonParse('invalid json');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse JSON:', expect.any(SyntaxError));
    });

    test('null 値をパースする', () => {
      const result = safeJsonParse<null>('null');
      expect(result).toBeNull();
    });
  });

  describe('safeJsonStringify', () => {
    test('オブジェクトを JSON 文字列に変換する', () => {
      const result = safeJsonStringify({ name: 'test', value: 123 });
      expect(result).toBe('{"name":"test","value":123}');
    });

    test('undefined の場合 null を返す', () => {
      const result = safeJsonStringify(undefined);
      expect(result).toBeNull();
    });

    test('関数の場合 null を返す', () => {
      const result = safeJsonStringify(() => 'test');
      expect(result).toBeNull();
    });

    test('Symbol の場合 null を返す', () => {
      const result = safeJsonStringify(Symbol('test'));
      expect(result).toBeNull();
    });

    test('循環参照の場合 null を返す', () => {
      interface CircularObj {
        name: string;
        self?: CircularObj;
      }
      const obj: CircularObj = { name: 'test' };
      obj.self = obj;

      const result = safeJsonStringify(obj);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to stringify JSON:', expect.any(TypeError));
    });
  });
});
