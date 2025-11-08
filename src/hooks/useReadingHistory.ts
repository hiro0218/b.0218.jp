import { useCallback } from 'react';

import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/lib/browser/safeLocalStorage';
import type { ReadingHistoryInput, ReadingHistoryItem } from '@/types/source';

const STORAGE_KEY = 'reading-history';
const MAX_HISTORY_ITEMS = 20;

/**
 * 閲覧履歴を管理するカスタムフック
 * - localStorage に履歴を保存
 * - 最大20件を維持（古いものから削除）
 * - 同一記事の重複を排除（再閲覧時は最新の位置に移動）
 */
export const useReadingHistory = () => {
  /**
   * localStorage から履歴を取得
   */
  const getHistory = useCallback((): ReadingHistoryItem[] => {
    const history = getLocalStorage<ReadingHistoryItem[]>(STORAGE_KEY);
    return Array.isArray(history) ? history : [];
  }, []);

  /**
   * 履歴に新しいアイテムを追加
   * - 同一 slug の既存アイテムは削除
   * - 新しいアイテムを先頭に追加
   * - 最大件数を超えた場合は古いものを削除
   */
  const addToHistory = useCallback(
    (item: ReadingHistoryInput) => {
      const currentHistory = getHistory();

      // 同一記事の既存エントリを削除
      const filteredHistory = currentHistory.filter((entry) => entry.slug !== item.slug);

      // 新しいエントリを先頭に追加
      const newHistory: ReadingHistoryItem[] = [
        {
          ...item,
          viewedAt: Date.now(),
        },
        ...filteredHistory,
      ];

      // 最大件数を超えた場合は古いものを削除
      const trimmedHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);

      setLocalStorage(STORAGE_KEY, trimmedHistory);
    },
    [getHistory],
  );

  /**
   * 履歴をクリア
   */
  const clearHistory = useCallback(() => {
    removeLocalStorage(STORAGE_KEY);
  }, []);

  return {
    getHistory,
    addToHistory,
    clearHistory,
  };
};
