/**
 * 検索エンジンの統合APIを提供するモジュール
 * @description
 * 転置インデックスベースの高速検索とキャッシュを統合し、UIコンポーネント向けの検索APIを提供する
 */

import { useMemo } from 'react';
import type { SearchResultItem } from '../types';
import { isEmptyQuery } from '../utils/validation';
import { SearchCache } from './cache';
import { performIndexedSearch } from './indexedSearch';

/**
 * UIコンポーネント用最適化検索API
 * @description
 * 転置インデックスを利用した高速検索（O(1)）
 * ビルド時に生成された検索インデックスを使用
 *
 * @param searchValue 検索クエリ文字列
 * @returns 優先度順ソート済み検索結果（最大100件）
 */
export const performPostSearch = (searchValue: string): SearchResultItem[] => {
  if (isEmptyQuery(searchValue)) {
    return [];
  }

  return performIndexedSearch(searchValue);
};

/**
 * キャッシュ付き検索フック
 * @description
 * リアルタイム検索のUX向上のため同一検索語の結果をキャッシュ
 * パフォーマンス制約：LRU方式で最大50件まで保持（メモリ使用量制限）
 *
 * @note React Compilerはクラスインスタンス生成や関数定義の最適化を行わないため、useMemoが必要
 * @returns キャッシュ機能付き検索実行関数
 */
export const useSearchWithCache = () => {
  const cache = useMemo(() => new SearchCache(), []);

  return useMemo(() => {
    return (searchValue: string): SearchResultItem[] => {
      if (!searchValue) return [];

      const cacheKey = SearchCache.createKey(searchValue, 0);

      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const results = performPostSearch(searchValue);
      cache.set(cacheKey, results);

      return results;
    };
  }, [cache]);
};
