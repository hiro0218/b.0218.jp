/**
 * 検索データの遅延読み込み・キャッシュ・プリロードAPI
 * @description
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
 * 検索データの準備完了を購読する。
 * @description
 * `useSyncExternalStore` の subscribe として使用する。データロード完了時にリスナーへ通知する。
 * @returns 購読解除関数
 */
export function subscribeSearchDataReady(listener: () => void): () => void {
  readyListeners.add(listener);
  return () => {
    readyListeners.delete(listener);
  };
}

/**
 * 検索データをプリロード（二重ロード防止付き）
 * @returns ロード済みデータの Promise
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

/**
 * 同期キャッシュからエンジン初期化を試行
 * @returns エンジン初期化済みなら true
 */
export function ensureSearchEngineSync(): boolean {
  if (isSearchEngineReady()) return true;
  if (!cachedData) return false;
  initializeSearchEngine(cachedData);
  return true;
}

export function isSearchDataReady(): boolean {
  return cachedData !== null;
}
