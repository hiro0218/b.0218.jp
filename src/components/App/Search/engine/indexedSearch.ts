/**
 * 転置インデックスを使用した高速検索エンジン
 * @description
 * ビルド時に生成された転置インデックスを利用して、O(1)の検索を実現
 */

import { normalizeSearchToken, type SearchDataItem, type SearchIndex } from '@/lib/search';
import type { SearchResultItem } from '../types';
import { isEmptyQuery } from '../utils/validation';
import type { SearchDataPayload } from './types';

const MAX_SEARCH_RESULTS = 100;
const MATCHING_TOKEN_CACHE_SIZE = 200;

/** スコアリング定数 */
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

/** クエリトークン分割用正規表現 */
const WHITESPACE_REGEX = /\s+/;

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

/**
 * 検索クエリをトークンに分割（スペース区切り + 正規化）
 */
function tokenizeQuery(query: string): string[] {
  const normalized = normalizeSearchToken(query);
  if (!normalized) return [];

  // スペースで分割して空文字を除外し、重複トークンを排除
  const tokens = normalized.split(WHITESPACE_REGEX).filter((token) => token.length > 0);
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

/**
 * タグマッチングのスコアを計算
 * @returns スコアとマッチ有無
 */
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

/**
 * matchedIn を決定
 */
function determineMatchedIn(hasTitleMatch: boolean, hasTagMatch: boolean): 'title' | 'tag' | 'both' {
  if (hasTitleMatch && hasTagMatch) return 'both';
  if (hasTagMatch) return 'tag';
  return 'title';
}

/**
 * matchType を決定
 */
function determineMatchType(info: MatchInfo, queryTokenCount: number): SearchResultItem['matchType'] {
  if (queryTokenCount > 1 && info.exactMatches > 0) return 'MULTI_TERM_MATCH';
  if (info.exactMatches > 0) return 'EXACT';
  if (info.partialMatches > 0) return 'PARTIAL';
  return 'NONE';
}

/**
 * クエリトークンにマッチするインデックストークンを検索
 */
function findMatchingTokens(queryToken: string): TokenMatch[] {
  const cachedMatches = matchingTokenCache.get(queryToken);
  if (cachedMatches) {
    return cachedMatches;
  }

  const matches: TokenMatch[] = [];

  // 完全一致をチェック
  if (typedSearchIndex[queryToken] !== undefined) {
    matches.push({ token: queryToken, matchType: 'exact' });
  }

  // 部分一致検索（完全一致したトークンは除く）
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
 * タイトル直接検索（補完用）
 * @description
 * 全記事のタイトルに対して部分一致検索を実行し、
 * インデックス検索で見つからなかった記事を補完する。
 * マッチ位置に応じたスコアリングで結果を順位付けする。
 *
 * @param searchValue 検索クエリ文字列
 * @param excludeIds インデックス検索で既に見つかった記事IDセット
 * @returns タイトルマッチした記事のリスト（最大100件）
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

      // 完全一致ボーナス
      if (data.titleLower === queryLower) {
        score += SCORE.fallbackExactTitle;
      }
      // 単語境界での一致ボーナス（先頭、スペース後、括弧後）
      else if (matchIndex === 0 || data.titleLower[matchIndex - 1] === ' ' || data.titleLower[matchIndex - 1] === ']') {
        score += SCORE.fallbackWordBoundary;
      }

      // 早期出現ボーナス（タイトル先頭に近いほど高スコア）
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

  // スコア順にソート（同点の場合はタイトル順）
  results.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return a.title.localeCompare(b.title, 'ja');
  });

  // スコアプロパティを除外して返す
  return results.slice(0, MAX_SEARCH_RESULTS).map(({ score, ...item }) => item);
}

/**
 * 転置インデックスを使った高速検索（部分一致対応）
 *
 * @param searchValue 検索クエリ文字列
 * @returns 優先度順ソート済み検索結果（最大100件）
 */
export function performIndexedSearch(searchValue: string): SearchResultItem[] {
  if (!initialized) return [];

  if (isEmptyQuery(searchValue)) {
    return [];
  }

  const queryTokens = tokenizeQuery(searchValue);
  if (queryTokens.length === 0) {
    return [];
  }

  // 1. 転置インデックスから候補記事IDを取得（完全一致 + 部分一致）
  const matchInfo = new Map<number, MatchInfo>();
  const itemIdToTokens = new Map<number, Set<string>>();
  const itemIdMatchedQueryTokens = new Map<number, Set<string>>();

  for (const queryToken of queryTokens) {
    for (const { token: indexToken, matchType } of findMatchingTokens(queryToken)) {
      const itemIds = typedSearchIndex[indexToken];
      if (!itemIds) continue;

      for (const itemId of itemIds) {
        // マッチタイプごとにカウント
        let info = matchInfo.get(itemId);
        if (!info) {
          info = { exactMatches: 0, partialMatches: 0 };
          matchInfo.set(itemId, info);
        }
        info[matchType === 'exact' ? 'exactMatches' : 'partialMatches']++;

        // マッチしたindexTokenを記録
        getOrCreateSet(itemIdToTokens, itemId).add(indexToken);

        // クエリトークンごとのマッチを記録（AND検索用）
        getOrCreateSet(itemIdMatchedQueryTokens, itemId).add(queryToken);
      }
    }
  }

  // 2. 候補記事を取得してスコアリング
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

    // 基本スコア（完全一致は高スコア、部分一致は低スコア）
    let score = info.exactMatches * SCORE.exactMatch + info.partialMatches * SCORE.partialMatch;

    // タイトルマッチボーナス
    const hasTitleMatch = data.titleLower.includes(queryLower);
    if (hasTitleMatch) {
      score += SCORE.titleMatch;
    }

    // タグマッチングボーナス
    const tagResult = calculateTagScore(data.tagsLower, queryTokens);
    score += tagResult.score;

    // 複数トークンが全て完全一致した場合のボーナス（AND検索）
    if (queryTokens.length > 1 && info.exactMatches === queryTokens.length) {
      score += SCORE.allTokensExact;
    }

    // 複合語マッチボーナス
    if (queryTokens.length > 1) {
      const indexTokens = itemIdToTokens.get(itemId);
      if (indexTokens) {
        score += calculateCompoundWordBonus(indexTokens, queryTokens);
      }
    }

    // matchedIn を決定
    const matchedIn = determineMatchedIn(hasTitleMatch, tagResult.hasMatch);

    // matchType を決定
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

  // スコアプロパティを除外して返す
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
