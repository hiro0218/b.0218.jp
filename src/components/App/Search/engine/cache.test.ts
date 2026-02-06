import { describe, expect, it } from 'vitest';
import type { SearchResultItem } from '../types';
import { SearchCache } from './cache';

const createItem = (slug: string): SearchResultItem => ({
  title: `Title ${slug}`,
  tags: [],
  slug,
  matchType: 'EXACT',
  matchedIn: 'title',
});

describe('SearchCache', () => {
  /* ================================================================ */
  /*  get                                                              */
  /* ================================================================ */
  describe('get', () => {
    it('存在しないキーの場合、undefined を返す', () => {
      const cache = new SearchCache();

      const result = cache.get('nonexistent');

      expect(result).toBeUndefined();
    });

    it('set したエントリを get で取得できる', () => {
      const cache = new SearchCache();
      const items = [createItem('post-1')];

      cache.set('key-1', items);
      const result = cache.get('key-1');

      expect(result).toEqual(items);
    });

    it('get したエントリが LRU の最新位置に移動する', () => {
      const cache = new SearchCache();
      const items1 = [createItem('post-1')];
      const items2 = [createItem('post-2')];
      const items3 = [createItem('post-3')];

      cache.set('key-1', items1);
      cache.set('key-2', items2);
      cache.set('key-3', items3);

      // key-1 を get して最新位置に移動
      cache.get('key-1');

      // キャッシュを容量上限まで埋める（key-2 が最古になっているはず）
      for (let i = 4; i <= 50; i++) {
        cache.set(`key-${i}`, [createItem(`post-${i}`)]);
      }

      // 51個目を追加 → 最古の key-2 が evict される
      cache.set('key-51', [createItem('post-51')]);

      expect(cache.get('key-2')).toBeUndefined();
      expect(cache.get('key-1')).toEqual(items1);
      expect(cache.get('key-3')).toEqual(items3);
    });
  });

  /* ================================================================ */
  /*  set                                                              */
  /* ================================================================ */
  describe('set', () => {
    it('既存キーの上書き時は eviction が発生しない', () => {
      const cache = new SearchCache();

      // 50件埋める
      for (let i = 1; i <= 50; i++) {
        cache.set(`key-${i}`, [createItem(`post-${i}`)]);
      }

      // 既存の key-50 を上書き → eviction は発生しない
      const updatedItems = [createItem('updated-50')];
      cache.set('key-50', updatedItems);

      expect(cache.get('key-1')).toEqual([createItem('post-1')]);
      expect(cache.get('key-50')).toEqual(updatedItems);
    });

    it('容量上限未満の場合、eviction が発生しない', () => {
      const cache = new SearchCache();

      cache.set('key-1', [createItem('post-1')]);
      cache.set('key-2', [createItem('post-2')]);

      expect(cache.get('key-1')).toEqual([createItem('post-1')]);
      expect(cache.get('key-2')).toEqual([createItem('post-2')]);
    });
  });

  /* ================================================================ */
  /*  createKey                                                        */
  /* ================================================================ */
  describe('createKey', () => {
    it('searchValue と dataSize を結合したキーを生成する', () => {
      const key = SearchCache.createKey('react', 100);

      expect(key).toBe('react-100');
    });
  });

  /* ================================================================ */
  /*  境界値                                                           */
  /* ================================================================ */
  describe('境界値', () => {
    it('連続 eviction で複数エントリが順に削除される', () => {
      const cache = new SearchCache();

      for (let i = 1; i <= 50; i++) {
        cache.set(`key-${i}`, [createItem(`post-${i}`)]);
      }

      // 2件追加 → key-1, key-2 が順に evict
      cache.set('new-1', [createItem('new-1')]);
      cache.set('new-2', [createItem('new-2')]);

      expect(cache.get('key-1')).toBeUndefined();
      expect(cache.get('key-2')).toBeUndefined();
      expect(cache.get('key-3')).toBeDefined();
      expect(cache.get('new-1')).toBeDefined();
      expect(cache.get('new-2')).toBeDefined();
    });
  });
});
