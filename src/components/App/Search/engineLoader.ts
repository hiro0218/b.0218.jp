import { createSearchEngine, type SearchEngine } from './engine';

// 失敗した Promise は enginePromise に残さず、次の呼び出しでやり直す。
// 残すと、通信の一時的な失敗が再読み込みまで続くため
let enginePromise: Promise<SearchEngine> | null = null;
let loadedEngine: SearchEngine | null = null;

/** 失敗した場合を除き、何度呼んでも読み込みは 1 回だけ行う */
export function loadSearchEngine(): Promise<SearchEngine> {
  enginePromise ??= import('~/dist/search.json').then(
    ({ default: payload }) => {
      loadedEngine = createSearchEngine(payload);
      return loadedEngine;
    },
    (error) => {
      enginePromise = null;
      throw error;
    },
  );

  return enginePromise;
}

export function getLoadedSearchEngine(): SearchEngine | null {
  return loadedEngine;
}
