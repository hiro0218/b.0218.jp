import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { safeJsonParse, safeJsonStringify } from '@/lib/utils/json';
import { getSessionStorage, removeSessionStorage, setSessionStorage } from './safeSessionStorage';

// isSSRモジュールをモック化
let mockIsSSR = false;
vi.mock('./isSSR', () => ({
  get isSSR() {
    return mockIsSSR;
  },
}));

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

  describe('getSessionStorage', () => {
    test('ストレージから値を取得してパースする', () => {
      mockStorage['test-key'] = '{"name":"test","value":123}';

      const result = getSessionStorage<{ name: string; value: number }>('test-key');
      expect(result).toEqual({ name: 'test', value: 123 });
      expect(sessionStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    test('キーが存在しない場合nullを返す', () => {
      const result = getSessionStorage('non-existent');
      expect(result).toBeNull();
    });

    test('無効なJSONの場合nullを返す', () => {
      mockStorage['test-key'] = 'invalid json';

      const result = getSessionStorage('test-key');
      expect(result).toBeNull();
    });

    test('sessionStorage.getItemがエラーを投げた場合nullを返す', () => {
      vi.mocked(sessionStorage.getItem).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = getSessionStorage('test-key');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get item from storage (test-key):', expect.any(Error));
    });
  });

  describe('setSessionStorage', () => {
    test('値をシリアライズしてストレージに保存する', () => {
      const data = { name: 'test', value: 123 };
      const result = setSessionStorage('test-key', data);

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

      const result = setSessionStorage('test-key', obj);
      expect(result).toBe(false);
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    test('sessionStorage.setItemがエラーを投げた場合falseを返す', () => {
      vi.mocked(sessionStorage.setItem).mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const result = setSessionStorage('test-key', { name: 'test' });
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to set item to storage (test-key):', expect.any(Error));
    });
  });

  describe('removeSessionStorage', () => {
    test('ストレージから値を削除する', () => {
      mockStorage['test-key'] = 'some value';
      const result = removeSessionStorage('test-key');

      expect(result).toBe(true);
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('test-key');
      expect(mockStorage['test-key']).toBeUndefined();
    });

    test('sessionStorage.removeItemがエラーを投げた場合falseを返す', () => {
      vi.mocked(sessionStorage.removeItem).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = removeSessionStorage('test-key');
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

    test('getSessionStorage がアクセス拒否時にnullを返す', () => {
      const result = getSessionStorage('test-key');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get item from storage (test-key):', expect.any(Error));
    });

    test('setSessionStorage がアクセス拒否時にfalseを返す', () => {
      const result = setSessionStorage('test-key', { name: 'test' });
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to set item to storage (test-key):', expect.any(Error));
    });

    test('removeSessionStorage がアクセス拒否時にfalseを返す', () => {
      const result = removeSessionStorage('test-key');
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to remove item from storage (test-key):', expect.any(Error));
    });
  });

  describe('サーバーサイドでの動作', () => {
    beforeEach(() => {
      mockIsSSR = true;
    });

    afterEach(() => {
      mockIsSSR = false;
    });

    test('getSessionStorage がサーバーサイドでnullを返す', () => {
      const result = getSessionStorage('test-key');
      expect(result).toBeNull();
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('setSessionStorage がサーバーサイドでfalseを返す', () => {
      const result = setSessionStorage('test-key', { name: 'test' });
      expect(result).toBe(false);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('removeSessionStorage がサーバーサイドでfalseを返す', () => {
      const result = removeSessionStorage('test-key');
      expect(result).toBe(false);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});
