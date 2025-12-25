'use client';

import { useCallback, useMemo } from 'react';

import { clearOldCache, getLocalStorage, setLocalStorage } from '@/lib/browser/safeLocalStorage';

/**
 * localStorage ベースの汎用キャッシュフック
 *
 * @param baseKey - キャッシュキーのベース名（例: "posts-list"）
 * @returns キャッシュ操作インターフェース
 *
 * @description
 * - ビルドID で自動バージョニング
 * - 古いビルドのキャッシュは自動削除
 * - 型安全なキャッシュの取得・保存
 */
export const useDataCache = <T>(baseKey: string) => {
  const storageKey = useMemo(() => `${process.env.BUILD_ID}_${baseKey}`, [baseKey]);

  const getCachedData = useCallback((): T | null => {
    return getLocalStorage<T>(storageKey);
  }, [storageKey]);

  const setCachedData = useCallback(
    (data: T): void => {
      setLocalStorage(storageKey, data);
    },
    [storageKey],
  );

  const clearOld = useCallback((): void => {
    clearOldCache(baseKey, storageKey);
  }, [baseKey, storageKey]);

  return {
    getCachedData,
    setCachedData,
    clearOldCache: clearOld,
  };
};
