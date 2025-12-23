/**
 * 検索エンジンの統合APIを提供するモジュール
 * @description
 * マッチング、スコアリング、キャッシュを統合し、UIコンポーネント向けの検索APIを提供する
 */

import { useMemo } from 'react';
import type { SearchProps, SearchResultItem } from '../types';
import { isEmptyQuery } from '../utils/validation';
import { findMatchingPosts } from './matchingEngine';
import { sortAndLimitResults } from './scoringEngine';

/**
 * 最大検索結果件数
 */
const MAX_SEARCH_RESULTS = 100;

/**
 * LRU キャッシュを実装するクラス
 * @description
 * 検索結果を最大50件までキャッシュし、最も古いエントリを自動削除する
 */
class SearchCache {
  /**
   * キャッシュサイズの上限
   * @description
   * メモリ使用量を制限するため、LRU方式で最大50件まで保持
   */
  private static readonly CACHE_SIZE_LIMIT = 50;

  private cache = new Map<string, SearchResultItem[]>();

  /**
   * キャッシュからデータを取得する
   * @param key - キャッシュキー
   * @returns キャッシュされたデータ、またはundefined
   */
  get(key: string): SearchResultItem[] | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    const result = this.cache.get(key)!;
    // LRU更新：削除して再追加で最新に
    this.cache.delete(key);
    this.cache.set(key, result);
    return result;
  }

  /**
   * キャッシュにデータを保存する
   * @param key - キャッシュキー
   * @param value - 保存するデータ
   */
  set(key: string, value: SearchResultItem[]): void {
    // サイズ制限チェック
    if (this.cache.size >= SearchCache.CACHE_SIZE_LIMIT && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  /**
   * キャッシュキーを生成する
   * @param searchValue - 検索文字列
   * @param dataSize - データサイズ（記事数）
   * @returns キャッシュキー
   */
  static createKey(searchValue: string, dataSize: number): string {
    return `${searchValue}-${dataSize}`;
  }
}

/**
 * UIコンポーネント用最適化検索API
 * @param archives 検索対象の投稿配列
 * @param searchValue 検索クエリ文字列
 * @returns 優先度順ソート済み検索結果（最大100件）
 */
export const performPostSearch = (archives: SearchProps[], searchValue: string): SearchResultItem[] => {
  if (isEmptyQuery(searchValue)) {
    return [];
  }

  const rankedResults = findMatchingPosts(archives, searchValue);
  return sortAndLimitResults(rankedResults, MAX_SEARCH_RESULTS);
};

/**
 * キャッシュ付き検索フック
 * リアルタイム検索のUX向上のため同一検索語の結果をキャッシュ
 * パフォーマンス制約：LRU方式で最大50件まで保持（メモリ使用量制限）
 * @returns キャッシュ機能付き検索実行関数
 */
export const useSearchWithCache = () => {
  const cache = useMemo(() => new SearchCache(), []);

  return useMemo(() => {
    return (archives: SearchProps[], searchValue: string): SearchResultItem[] => {
      if (!searchValue) return [];

      const cacheKey = SearchCache.createKey(searchValue, archives.length);

      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const results = performPostSearch(archives, searchValue);
      cache.set(cacheKey, results);

      return results;
    };
  }, [cache]);
};
