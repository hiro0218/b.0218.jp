import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { clearOldCache, getLocalStorage, removeLocalStorage, setLocalStorage } from './safeLocalStorage';

// isSSRモジュールをモック化
let mockIsSSR = false;
vi.mock('./isSSR', () => ({
  get isSSR() {
    return mockIsSSR;
  },
}));

describe('safeLocalStorage', () => {
  let mockStorage: Record<string, string> = {};
  let consoleSpy: MockInstance;
  let consoleWarnSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage = {};
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    Object.defineProperty(window, 'localStorage', {
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
        get length() {
          return Object.keys(mockStorage).length;
        },
        key: vi.fn((index: number) => {
          const keys = Object.keys(mockStorage);
          return keys[index] ?? null;
        }),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getLocalStorage', () => {
    test('ストレージから値を取得してパースする', () => {
      mockStorage['test-key'] = '{"name":"test","value":123}';

      const result = getLocalStorage<{ name: string; value: number }>('test-key');
      expect(result).toEqual({ name: 'test', value: 123 });
      expect(localStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    test('キーが存在しない場合nullを返す', () => {
      const result = getLocalStorage('non-existent');
      expect(result).toBeNull();
    });

    test('無効なJSONの場合nullを返す', () => {
      mockStorage['test-key'] = 'invalid json';

      const result = getLocalStorage('test-key');
      expect(result).toBeNull();
    });

    test('localStorage.getItemがエラーを投げた場合nullを返す', () => {
      vi.mocked(localStorage.getItem).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = getLocalStorage('test-key');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get item from localStorage (test-key):', expect.any(Error));
    });
  });

  describe('setLocalStorage', () => {
    test('値をシリアライズしてストレージに保存する', () => {
      const data = { name: 'test', value: 123 };
      const result = setLocalStorage('test-key', data);

      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('test-key', '{"name":"test","value":123}');
      expect(mockStorage['test-key']).toBe('{"name":"test","value":123}');
    });

    test('シリアライズに失敗した場合falseを返す', () => {
      interface CircularObj {
        name: string;
        self?: CircularObj;
      }
      const obj: CircularObj = { name: 'test' };
      obj.self = obj;

      const result = setLocalStorage('test-key', obj);
      expect(result).toBe(false);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('localStorage.setItemがエラーを投げた場合falseを返す', () => {
      vi.mocked(localStorage.setItem).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = setLocalStorage('test-key', { name: 'test' });
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to set item to localStorage (test-key):', expect.any(Error));
    });

    test('QuotaExceededError発生時にonQuotaExceededコールバックを実行する', () => {
      const onQuotaExceeded = vi.fn();
      vi.mocked(localStorage.setItem).mockImplementation(() => {
        const error = new DOMException('QuotaExceededError');
        Object.defineProperty(error, 'name', { value: 'QuotaExceededError' });
        throw error;
      });

      const result = setLocalStorage('test-key', { name: 'test' }, { onQuotaExceeded });

      expect(result).toBe(false);
      expect(onQuotaExceeded).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith('localStorage quota exceeded for key: test-key');
    });
  });

  describe('removeLocalStorage', () => {
    test('ストレージから値を削除する', () => {
      mockStorage['test-key'] = 'some value';
      const result = removeLocalStorage('test-key');

      expect(result).toBe(true);
      expect(localStorage.removeItem).toHaveBeenCalledWith('test-key');
      expect(mockStorage['test-key']).toBeUndefined();
    });

    test('localStorage.removeItemがエラーを投げた場合falseを返す', () => {
      vi.mocked(localStorage.removeItem).mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = removeLocalStorage('test-key');
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to remove item from localStorage (test-key):', expect.any(Error));
    });
  });

  describe('clearOldCache', () => {
    beforeEach(() => {
      mockStorage = {
        'v1.0.0_posts-list': 'old-data-1',
        'v2.0.0_posts-list': 'current-data',
        'v1.0.0_popular': 'old-data-2',
        'other-key': 'other-data',
      };
    });

    test('パターンに一致するキーを削除する', () => {
      clearOldCache('v1.0.0', 'v2.0.0_posts-list');

      expect(mockStorage['v1.0.0_posts-list']).toBeUndefined();
      expect(mockStorage['v1.0.0_popular']).toBeUndefined();
      expect(mockStorage['v2.0.0_posts-list']).toBe('current-data');
      expect(mockStorage['other-key']).toBe('other-data');
    });

    test('除外キーを保持する', () => {
      clearOldCache('posts-list', 'v2.0.0_posts-list');

      expect(mockStorage['v1.0.0_posts-list']).toBeUndefined();
      expect(mockStorage['v2.0.0_posts-list']).toBe('current-data');
      expect(mockStorage['v1.0.0_popular']).toBe('old-data-2');
      expect(mockStorage['other-key']).toBe('other-data');
    });

    test('パターン指定なしの場合は除外キー以外すべて削除', () => {
      clearOldCache(undefined, 'v2.0.0_posts-list');

      expect(mockStorage['v1.0.0_posts-list']).toBeUndefined();
      expect(mockStorage['v1.0.0_popular']).toBeUndefined();
      expect(mockStorage['other-key']).toBeUndefined();
      expect(mockStorage['v2.0.0_posts-list']).toBe('current-data');
    });

    test('エラー発生時にエラーログを出力する', () => {
      // localStorage.length にアクセスするとエラーを投げるケース
      Object.defineProperty(window, 'localStorage', {
        get: () => {
          throw new Error('Storage access error');
        },
        configurable: true,
      });

      clearOldCache('pattern');

      expect(consoleSpy).toHaveBeenCalledWith('Failed to clear old cache:', expect.any(Error));
    });
  });

  describe('ストレージアクセス拒否時の動作（Safari プライベートモードなど）', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', {
        get: () => {
          throw new Error('Storage access denied');
        },
        configurable: true,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    test('getLocalStorage がアクセス拒否時にnullを返す', () => {
      const result = getLocalStorage('test-key');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to get item from localStorage (test-key):', expect.any(Error));
    });

    test('setLocalStorage がアクセス拒否時にfalseを返す', () => {
      const result = setLocalStorage('test-key', { name: 'test' });
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to set item to localStorage (test-key):', expect.any(Error));
    });

    test('removeLocalStorage がアクセス拒否時にfalseを返す', () => {
      const result = removeLocalStorage('test-key');
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to remove item from localStorage (test-key):', expect.any(Error));
    });
  });

  describe('サーバーサイドでの動作', () => {
    beforeEach(() => {
      mockIsSSR = true;
    });

    afterEach(() => {
      mockIsSSR = false;
    });

    test('getLocalStorage がサーバーサイドでnullを返す', () => {
      const result = getLocalStorage('test-key');
      expect(result).toBeNull();
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('setLocalStorage がサーバーサイドでfalseを返す', () => {
      const result = setLocalStorage('test-key', { name: 'test' });
      expect(result).toBe(false);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('removeLocalStorage がサーバーサイドでfalseを返す', () => {
      const result = removeLocalStorage('test-key');
      expect(result).toBe(false);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('clearOldCache がサーバーサイドで何もしない', () => {
      clearOldCache('pattern');
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});
