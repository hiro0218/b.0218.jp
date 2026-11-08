/** タブを閉じても残す値（この端末に保存する設定・履歴）に使う */

import { isSSR } from '@/lib/browser/isSSR';
import { safeJsonParse, safeJsonStringify } from '@/lib/utils/json';

/**
 * @returns 失敗時・サーバーサイド・ストレージアクセス拒否時は null
 */
export const getLocalStorage = <T>(key: string): T | null => {
  if (isSSR) {
    return null;
  }

  let stored: string | null = null;
  try {
    stored = localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get item from storage (${key}):`, error);
    return null;
  }

  return safeJsonParse<T>(stored);
};

/**
 * @returns サーバーサイド・ストレージアクセス拒否時は false
 */
export const setLocalStorage = <T>(key: string, value: T): boolean => {
  if (isSSR) {
    return false;
  }

  const serialized = safeJsonStringify(value);
  if (!serialized) return false;

  try {
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to set item to storage (${key}):`, error);
    return false;
  }

  return true;
};
