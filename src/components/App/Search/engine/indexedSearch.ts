/**
 * ビルド時に生成された転置インデックスを利用して、O(1)の検索を実現
 */

import { normalizeSearchToken, type SearchDataItem, type SearchIndex } from '@/lib/search';
import { QUERY_WHITESPACE_REGEX } from '../constants';
import type { SearchResultItem } from '../types';
import { isEmptyQuery } from '../utils/validation';
import type { SearchDataPayload } from './types';

const MAX_SEARCH_RESULTS = 100;
const MATCHING_TOKEN_CACHE_SIZE = 200;

const SCORE = {
  exactMatch: 10,
  partialMatch: 3,
  titleMatch: 50,
  tagExact: 30,
  tagPartial: 15,
  tagContains: 10,
  allTokensExact: 20,
  compoundWord: 40,
  fallbackExactTitle: 30,
  fallbackWordBoundary: 20,
  fallbackEarlyPosition: 10,
} as const;

interface NormalizedSearchDataItem extends SearchDataItem {
  titleLower: string;
  tagsLower: string[];
}

let initialized = false;
let typedSearchIndex: SearchIndex = {};
let normalizedSearchData: NormalizedSearchDataItem[] = [];
let indexTokenKeys: string[] = [];
let indexTokensByFirstChar = new Map<string, string[]>();
let matchingTokenCache = new Map<string, TokenMatch[]>();

/**
 * 検索エンジンを初期化（二重初期化防止付き）
 */
export function initializeSearchEngine(data: SearchDataPayload): void {
  if (initialized) return;

  typedSearchIndex = data.searchIndex;
  normalizedSearchData = data.searchData.map((item) => ({
    ...item,
    titleLower: normalizeSearchToken(item.title),
    tagsLower: item.tags.map(normalizeSearchToken),
  }));
  indexTokenKeys = Object.keys(typedSearchIndex);
  indexTokensByFirstChar = new Map<string, string[]>();
  matchingTokenCache = new Map<string, TokenMatch[]>();

  for (const token of indexTokenKeys) {
    const firstChar = token[0];
    if (!firstChar) continue;

    const bucket = indexTokensByFirstChar.get(firstChar);
    if (bucket) {
      bucket.push(token);
    } else {
      indexTokensByFirstChar.set(firstChar, [token]);
    }
  }

  initialized = true;
}

export function isSearchEngineReady(): boolean {
  return initialized;
}

/**
 * 検索エンジンの状態をリセット（テスト専用）
 */
export function resetSearchEngine(): void {
  initialized = false;
  typedSearchIndex = {};
  normalizedSearchData = [];
  indexTokenKeys = [];
  indexTokensByFirstChar = new Map();
  matchingTokenCache = new Map();
}

function tokenizeQuery(query: string): string[] {
  const normalized = normalizeSearchToken(query);
  if (!normalized) return [];

  const tokens = normalized.split(QUERY_WHITESPACE_REGEX).filter((token) => token.length > 0);
  return [...new Set(tokens)];
}

type MatchType = 'exact' | 'partial';
type TokenMatch = { token: string; matchType: MatchType };
type MatchInfo = { exactMatches: number; partialMatches: number };
type ScoredSearchResult = SearchResultItem & { id: number; score: number; order: number };

function getOrCreateSet<TKey, TValue>(map: Map<TKey, Set<TValue>>, key: TKey): Set<TValue> {
  let value = map.get(key);
  if (!value) {
    value = new Set<TValue>();
    map.set(key, value);
  }
  return value;
}

function getIndexedItemIds(token: string): number[] | undefined {
  if (!Object.hasOwn(typedSearchIndex, token)) return undefined;

  const itemIds = typedSearchIndex[token];
  return Array.isArray(itemIds) ? itemIds : undefined;
}

function isBetterScoredResult(candidate: ScoredSearchResult, current: ScoredSearchResult): boolean {
  return candidate.score > current.score || (candidate.score === current.score && candidate.order < current.order);
}

function findWorstScoredResultIndex(results: ScoredSearchResult[]): number {
  let worstIndex = 0;

  for (let i = 1; i < results.length; i++) {
    if (isBetterScoredResult(results[worstIndex], results[i])) {
      worstIndex = i;
    }
  }

  return worstIndex;
}

function addTopScoredResult(results: ScoredSearchResult[], result: ScoredSearchResult): void {
  if (results.length < MAX_SEARCH_RESULTS) {
    results.push(result);
    return;
  }

  const worstIndex = findWorstScoredResultIndex(results);
  if (isBetterScoredResult(result, results[worstIndex])) {
    results[worstIndex] = result;
  }
}

function compareScoredResults(a: ScoredSearchResult, b: ScoredSearchResult): number {
  return b.score - a.score || a.order - b.order;
}

function toSearchResult({ id: _id, score: _score, order: _order, ...item }: ScoredSearchResult): SearchResultItem {
  return item;
}

function calculateTagScore(tagsLower: string[], queryTokens: string[]): { score: number; hasMatch: boolean } {
  let score = 0;
  let hasMatch = false;

  for (const tagLower of tagsLower) {
    for (const queryToken of queryTokens) {
      if (tagLower === queryToken) {
        score += SCORE.tagExact;
        hasMatch = true;
      } else if (tagLower.includes(queryToken)) {
        score += SCORE.tagPartial;
        hasMatch = true;
      } else if (queryToken.includes(tagLower)) {
        score += SCORE.tagContains;
        hasMatch = true;
      }
    }
  }

  return { score, hasMatch };
}

/**
 * 複合語マッチボーナスを計算（例: 「word press」→「wordpress」）
 */
function calculateCompoundWordBonus(indexTokens: Set<string>, queryTokens: string[]): number {
  for (const indexToken of indexTokens) {
    let matchCount = 0;
    for (const queryToken of queryTokens) {
      if (!indexToken.includes(queryToken)) continue;

      matchCount++;
      if (matchCount >= 2) {
        return SCORE.compoundWord;
      }
    }
  }
  return 0;
}

function determineMatchedIn(hasTitleMatch: boolean, hasTagMatch: boolean): 'title' | 'tag' | 'both' {
  if (hasTitleMatch && hasTagMatch) return 'both';
  if (hasTagMatch) return 'tag';
  return 'title';
}

function determineMatchType(info: MatchInfo, queryTokenCount: number): SearchResultItem['matchType'] {
  if (queryTokenCount > 1 && info.exactMatches > 0) return 'MULTI_TERM_MATCH';
  if (info.exactMatches > 0) return 'EXACT';
  if (info.partialMatches > 0) return 'PARTIAL';
  return 'NONE';
}

/**
 * クエリトークンにマッチするインデックストークンを検索する。
 *
 * 部分一致は性能のため、先頭文字が同じ indexToken のみを走査する。
 * 例: `script` クエリでは `javascript` (先頭 `j`) はヒットしない。
 * 先頭文字に該当する bucket が無い場合は全 indexTokenKeys を走査する fallback がある。
 */
function findMatchingTokens(queryToken: string): TokenMatch[] {
  const cachedMatches = matchingTokenCache.get(queryToken);
  if (cachedMatches) {
    return cachedMatches;
  }

  const matches: TokenMatch[] = [];

  if (getIndexedItemIds(queryToken) !== undefined) {
    matches.push({ token: queryToken, matchType: 'exact' });
  }

  // 部分一致は性能のため、先頭文字が同じ indexToken のみを走査する（fallback あり）
  const candidateTokens = indexTokensByFirstChar.get(queryToken[0]) ?? indexTokenKeys;
  for (const indexToken of candidateTokens) {
    if (indexToken !== queryToken && indexToken.includes(queryToken)) {
      matches.push({ token: indexToken, matchType: 'partial' });
    }
  }

  if (matchingTokenCache.size >= MATCHING_TOKEN_CACHE_SIZE) {
    const firstKey = matchingTokenCache.keys().next().value;
    if (firstKey) {
      matchingTokenCache.delete(firstKey);
    }
  }
  matchingTokenCache.set(queryToken, matches);

  return matches;
}

/**
 * タイトル直接検索（補完用）。インデックス検索で見つからなかった記事を補完する。
 */
function searchByTitleFallback(searchValue: string, excludeIds: Set<number>): SearchResultItem[] {
  const queryLower = normalizeSearchToken(searchValue);
  const results: Array<SearchResultItem & { score: number }> = [];

  for (let itemId = 0; itemId < normalizedSearchData.length; itemId++) {
    if (excludeIds.has(itemId)) continue;

    const data = normalizedSearchData[itemId];
    if (!data) continue;

    const matchIndex = data.titleLower.indexOf(queryLower);
    if (matchIndex !== -1) {
      let score = SCORE.titleMatch;

      if (data.titleLower === queryLower) {
        score += SCORE.fallbackExactTitle;
      }
      // 単語境界での一致ボーナス (先頭、スペース後、括弧内 `[X` および括弧後 `] X`)
      else if (
        matchIndex === 0 ||
        data.titleLower[matchIndex - 1] === ' ' ||
        data.titleLower[matchIndex - 1] === '[' ||
        data.titleLower[matchIndex - 1] === ']'
      ) {
        score += SCORE.fallbackWordBoundary;
      }

      score += Math.max(0, SCORE.fallbackEarlyPosition - Math.floor(matchIndex / 10));

      results.push({
        slug: data.slug,
        title: data.title,
        tags: data.tags,
        matchedIn: 'title',
        matchType: 'PARTIAL',
        score,
      });
    }
  }

  // 同点の場合はタイトル順
  results.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return a.title.localeCompare(b.title, 'ja');
  });

  return results.slice(0, MAX_SEARCH_RESULTS).map(({ score, ...item }) => item);
}

export function performIndexedSearch(searchValue: string): SearchResultItem[] {
  if (!initialized) return [];

  if (isEmptyQuery(searchValue)) {
    return [];
  }

  const queryTokens = tokenizeQuery(searchValue);
  if (queryTokens.length === 0) {
    return [];
  }

  // 1. 転置インデックスから候補記事IDを取得
  const matchInfo = new Map<number, MatchInfo>();
  const itemIdToTokens = new Map<number, Set<string>>();
  const itemIdMatchedQueryTokens = new Map<number, Set<string>>();

  for (const queryToken of queryTokens) {
    for (const { token: indexToken, matchType } of findMatchingTokens(queryToken)) {
      const itemIds = getIndexedItemIds(indexToken);
      if (!itemIds) continue;

      for (const itemId of itemIds) {
        let info = matchInfo.get(itemId);
        if (!info) {
          info = { exactMatches: 0, partialMatches: 0 };
          matchInfo.set(itemId, info);
        }
        info[matchType === 'exact' ? 'exactMatches' : 'partialMatches']++;

        getOrCreateSet(itemIdToTokens, itemId).add(indexToken);

        // AND検索用：クエリトークンごとのマッチを記録
        getOrCreateSet(itemIdMatchedQueryTokens, itemId).add(queryToken);
      }
    }
  }

  // 2. 候補記事をスコアリング
  const results: ScoredSearchResult[] = [];
  const queryLower = normalizeSearchToken(searchValue);
  let resultOrder = 0;

  for (const [itemId, info] of matchInfo) {
    // AND検索: 複数トークンの場合、すべてのクエリトークンにマッチしない記事を除外
    if (queryTokens.length > 1) {
      const matchedTokens = itemIdMatchedQueryTokens.get(itemId);
      if (!matchedTokens || matchedTokens.size < queryTokens.length) continue;
    }

    const data = normalizedSearchData[itemId];
    if (!data) continue;

    let score = info.exactMatches * SCORE.exactMatch + info.partialMatches * SCORE.partialMatch;

    const hasTitleMatch = data.titleLower.includes(queryLower);
    if (hasTitleMatch) {
      score += SCORE.titleMatch;
    }

    const tagResult = calculateTagScore(data.tagsLower, queryTokens);
    score += tagResult.score;

    // AND検索で全トークンが完全一致した場合のボーナス
    if (queryTokens.length > 1 && info.exactMatches === queryTokens.length) {
      score += SCORE.allTokensExact;
    }

    if (queryTokens.length > 1) {
      const indexTokens = itemIdToTokens.get(itemId);
      if (indexTokens) {
        score += calculateCompoundWordBonus(indexTokens, queryTokens);
      }
    }

    const matchedIn = determineMatchedIn(hasTitleMatch, tagResult.hasMatch);
    const matchType = determineMatchType(info, queryTokens.length);

    addTopScoredResult(results, {
      id: itemId,
      slug: data.slug,
      title: data.title,
      tags: data.tags,
      matchedIn,
      matchType,
      score,
      order: resultOrder++,
    });
  }

  // 3. スコア順にソートして上位N件を返す
  results.sort(compareScoredResults);

  const indexedResults = results.map(toSearchResult);

  if (indexedResults.length >= MAX_SEARCH_RESULTS) {
    return indexedResults;
  }

  // 4. タイトル直接検索で補完（インデックス検索で見つからなかった記事を追加）
  // fallback に到達するのは indexedResults が 100 件未満の場合だけなので、results は候補全件を含む。
  const indexedIds = new Set(results.map((result) => result.id));
  const fallbackResults = searchByTitleFallback(searchValue, indexedIds);

  return [...indexedResults, ...fallbackResults].slice(0, MAX_SEARCH_RESULTS);
}
