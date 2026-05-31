/**
 * search.json を dynamic import で読み込む。
 * 同期的なキャッシュアクセスにより、performIndexedSearch の同期性を維持。
 */

import { initializeSearchEngine, isSearchEngineReady } from './indexedSearch';
import type { SearchDataPayload } from './types';

let loadPromise: Promise<SearchDataPayload> | null = null;
let cachedData: SearchDataPayload | null = null;

const readyListeners = new Set<() => void>();

function notifyReady(): void {
  for (const listener of readyListeners) {
    listener();
  }
}

/**
 * `useSyncExternalStore` の subscribe として使用する。データロード完了時にリスナーへ通知する。
 */
export function subscribeSearchDataReady(listener: () => void): () => void {
  readyListeners.add(listener);
  return () => {
    readyListeners.delete(listener);
  };
}

/**
 * 検索データをプリロード（二重ロード防止付き）
 */
export function preloadSearchData(): Promise<SearchDataPayload> {
  if (cachedData) return Promise.resolve(cachedData);
  if (loadPromise) return loadPromise;

  loadPromise = import('~/dist/search.json')
    .then((m) => {
      cachedData = m.default;
      notifyReady();
      return cachedData;
    })
    .catch((error) => {
      loadPromise = null;
      throw error;
    });

  return loadPromise;
}

export async function loadAndInitializeSearch(): Promise<void> {
  const data = await preloadSearchData();
  initializeSearchEngine(data);
}

export function ensureSearchEngineSync(): boolean {
  if (isSearchEngineReady()) return true;
  if (!cachedData) return false;
  initializeSearchEngine(cachedData);
  return true;
}

export function isSearchDataReady(): boolean {
  return cachedData !== null;
}
