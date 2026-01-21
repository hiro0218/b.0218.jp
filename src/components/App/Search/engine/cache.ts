/**
 * LRU キャッシュエンジン
 * @description
 * 検索結果を最大50件までキャッシュし、最も古いエントリを自動削除する
 */
import type { SearchResultItem } from '../types';

export class SearchCache {
  private static readonly CACHE_SIZE_LIMIT = 50;

  private cache = new Map<string, SearchResultItem[]>();

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

  set(key: string, value: SearchResultItem[]): void {
    if (this.cache.size >= SearchCache.CACHE_SIZE_LIMIT && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  static createKey(searchValue: string, dataSize: number): string {
    return `${searchValue}-${dataSize}`;
  }
}
