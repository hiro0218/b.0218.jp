import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  getFromSession,
  removeFromSession,
  safeJsonParse,
  safeJsonStringify,
  setToSession,
} from './safeSessionStorage';

describe('safeSessionStorage', () => {
  let mockStorage: Record<string, string> = {};
  let consoleSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage = {};
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: vi.fn((key: string) => mockStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockStorage[key];
        }),
        clear: vi.fn(() => {
          Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
        }),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('safeJsonParse', () => {
    test('有効なJSONをパースする', () => {
      const result = safeJsonParse<{ name: string }>('{"name":"test"}');
      expect(result).toEqual({ name: 'test' });
    });

    test('nullを受け取った場合nullを返す', () => {
      const result = safeJsonParse(null);
      expect(result).toBeNull();
    });

    test('無効なJSONの場合nullを返す', () => {
      const result = safeJsonParse('invalid json');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse JSON:', expect.any(SyntaxError));
    });
  });

  describe('safeJsonStringify', () => {
    test('オブジェクトをJSON文字列に変換する', () => {
      const result = safeJsonStringify({ name: 'test', value: 123 });
      expect(result).toBe('{"name":"test","value":123}');
    });

    test('undefinedの場合nullを返す', () => {
      const result = safeJsonStringify(undefined);
      expect(result).toBeNull();
    });

    test('関数の場合nullを返す', () => {
      const result = safeJsonStringify(() => 'test');
      expect(result).toBeNull();
    });

    test('Symbolの場合nullを返す', () => {
      const result = safeJsonStringify(Symbol('test'));
      expect(result).toBeNull();
    });

    test('循環参照の場合nullを返す', () => {
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

  describe('getFromSession', () => {
    test('ストレージから値を取得してパースする', () => {
      mockStorage['test-key'] = '{"name":"test","value":123}';

      const result = getFromSession<{ name: string; value: number }>('test-key');
      expect(result).toEqual({ name: 'test', value: 123 });
      expect(sessionStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    test('キーが存在しない場合nullを返す', () => {
      const result = getFromSession('non-existent');
      expect(result).toBeNull();
    });

    test('無効なJSONの場合nullを返す', () => {
      mockStorage['test-key'] = 'invalid json';

      const result = getFromSession('test-key');
      expect(result).toBeNull();
    });

    test('sessionStorage.getItemがエラーを投げた場合nullを返す', () => {
      vi.mocked(sessionStorage.getItem).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = getFromSession('test-key');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get item from storage (test-key):', expect.any(Error));
    });
  });

  describe('setToSession', () => {
    test('値をシリアライズしてストレージに保存する', () => {
      const data = { name: 'test', value: 123 };
      const result = setToSession('test-key', data);

      expect(result).toBe(true);
      expect(sessionStorage.setItem).toHaveBeenCalledWith('test-key', '{"name":"test","value":123}');
      expect(mockStorage['test-key']).toBe('{"name":"test","value":123}');
    });

    test('シリアライズに失敗した場合falseを返す', () => {
      interface CircularObj {
        name: string;
        self?: CircularObj;
      }
      const obj: CircularObj = { name: 'test' };
      obj.self = obj;

      const result = setToSession('test-key', obj);
      expect(result).toBe(false);
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    test('sessionStorage.setItemがエラーを投げた場合falseを返す', () => {
      vi.mocked(sessionStorage.setItem).mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const result = setToSession('test-key', { name: 'test' });
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to set item to storage (test-key):', expect.any(Error));
    });
  });

  describe('removeFromSession', () => {
    test('ストレージから値を削除する', () => {
      mockStorage['test-key'] = 'some value';
      const result = removeFromSession('test-key');

      expect(result).toBe(true);
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('test-key');
      expect(mockStorage['test-key']).toBeUndefined();
    });

    test('sessionStorage.removeItemがエラーを投げた場合falseを返す', () => {
      vi.mocked(sessionStorage.removeItem).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = removeFromSession('test-key');
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to remove item from storage (test-key):', expect.any(Error));
    });
  });

  describe('ストレージアクセス拒否時の動作（Safari プライベートモードなど）', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'sessionStorage', {
        get: () => {
          throw new Error('Storage access denied');
        },
        configurable: true,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    test('getFromSession がアクセス拒否時にnullを返す', () => {
      const result = getFromSession('test-key');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get item from storage (test-key):', expect.any(Error));
    });

    test('setToSession がアクセス拒否時にfalseを返す', () => {
      const result = setToSession('test-key', { name: 'test' });
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to set item to storage (test-key):', expect.any(Error));
    });

    test('removeFromSession がアクセス拒否時にfalseを返す', () => {
      const result = removeFromSession('test-key');
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to remove item from storage (test-key):', expect.any(Error));
    });
  });

  describe('サーバーサイドでの動作', () => {
    let originalWindow: typeof globalThis.window;

    beforeEach(() => {
      originalWindow = globalThis.window;
      // biome-ignore lint/performance/noDelete: テスト環境でwindowオブジェクトを削除する必要があるため
      delete globalThis.window;
    });

    afterEach(() => {
      globalThis.window = originalWindow;
    });

    test('getFromSession がサーバーサイドでnullを返す', () => {
      const result = getFromSession('test-key');
      expect(result).toBeNull();
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('setToSession がサーバーサイドでfalseを返す', () => {
      const result = setToSession('test-key', { name: 'test' });
      expect(result).toBe(false);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('removeFromSession がサーバーサイドでfalseを返す', () => {
      const result = removeFromSession('test-key');
      expect(result).toBe(false);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});
