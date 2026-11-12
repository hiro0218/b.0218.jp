import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { getLocalStorage, setLocalStorage } from './safeLocalStorage';

let mockIsSSR = false;
vi.mock('./isSSR', () => ({
  get isSSR() {
    return mockIsSSR;
  },
}));

let mockStorage: Record<string, string> = {};
let consoleSpy: MockInstance;

beforeEach(() => {
  mockStorage = {};
  mockIsSSR = false;
  consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
    },
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('保存した値を取得する場合、パースした値を返す', () => {
  mockStorage['test-key'] = '["a","b"]';

  expect(getLocalStorage<string[]>('test-key')).toEqual(['a', 'b']);
});

test('キーが存在しない場合、null を返す', () => {
  expect(getLocalStorage('non-existent')).toBeNull();
});

test('値が不正な JSON の場合、null を返す', () => {
  mockStorage['test-key'] = 'invalid json';

  expect(getLocalStorage('test-key')).toBeNull();
});

test('localStorage の読み取りが失敗した場合、ログを残して null を返す', () => {
  vi.mocked(localStorage.getItem).mockImplementation(() => {
    throw new Error('Storage access denied');
  });

  expect(getLocalStorage('test-key')).toBeNull();
  expect(consoleSpy).toHaveBeenCalledWith('Failed to get item from storage (test-key):', expect.any(Error));
});

test('値を保存する場合、JSON にして書き込み、true を返す', () => {
  const result = setLocalStorage('test-key', ['a', 'b']);

  expect(result).toBe(true);
  expect(mockStorage['test-key']).toBe('["a","b"]');
});

test('localStorage の書き込みが失敗した場合、ログを残して false を返す', () => {
  vi.mocked(localStorage.setItem).mockImplementation(() => {
    throw new Error('Storage quota exceeded');
  });

  expect(setLocalStorage('test-key', ['a'])).toBe(false);
  expect(consoleSpy).toHaveBeenCalledWith('Failed to set item to storage (test-key):', expect.any(Error));
});

test('サーバーサイドの場合、読み書きせず null と false を返す', () => {
  mockIsSSR = true;

  expect(getLocalStorage('test-key')).toBeNull();
  expect(setLocalStorage('test-key', ['a'])).toBe(false);
  expect(localStorage.getItem).not.toHaveBeenCalled();
  expect(localStorage.setItem).not.toHaveBeenCalled();
});
