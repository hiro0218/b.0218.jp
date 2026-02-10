/**
 * 転置インデックスを使用した高速検索エンジン
 * @description
 * ビルド時に生成された転置インデックスを利用して、O(1)の検索を実現
 */

// ビルド時に生成された転置インデックスと検索データをインポート
import searchData from '~/dist/search-data.json';
import searchIndex from '~/dist/search-index.json';

import type { SearchResultItem } from '../types';
import { isEmptyQuery } from '../utils/validation';

const MAX_SEARCH_RESULTS = 100;

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

/**
 * 検索用データの型定義（ビルド時生成データ）
 */
interface SearchDataItem {
  slug: string;
  title: string;
  tags: string[];
  tokens: string[];
}

// 型アサーション
const typedSearchIndex = searchIndex as Record<string, string[]>;
const typedSearchData = searchData as SearchDataItem[];

// slug をキーとしたマップを作成（高速参照用）
const searchDataMap = new Map<string, SearchDataItem>(typedSearchData.map((item) => [item.slug, item]));

// 転置インデックスのキー配列をキャッシュ（部分一致検索の毎回アロケーションを回避）
const indexTokenKeys = Object.keys(typedSearchIndex);

/**
 * 検索クエリをトークンに分割（スペース区切り + 正規化）
 */
function tokenizeQuery(query: string): string[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];

  // スペースで分割して空文字を除外
  return normalized.split(WHITESPACE_REGEX).filter((token) => token.length > 0);
}

type MatchType = 'exact' | 'partial';
type TokenMatch = { token: string; matchType: MatchType };
type MatchInfo = { exactMatches: number; partialMatches: number };

/**
 * タグマッチングのスコアを計算
 * @returns スコアとマッチ有無
 */
function calculateTagScore(tags: string[], queryTokens: string[]): { score: number; hasMatch: boolean } {
  let score = 0;
  let hasMatch = false;

  for (const tag of tags) {
    const tagLower = tag.toLowerCase();

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
    const matchCount = queryTokens.filter((qt) => indexToken.includes(qt)).length;
    if (matchCount >= 2) {
      return SCORE.compoundWord;
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
  const matches: TokenMatch[] = [];

  // 完全一致をチェック
  if (typedSearchIndex[queryToken] !== undefined) {
    matches.push({ token: queryToken, matchType: 'exact' });
  }

  // 部分一致検索（完全一致したトークンは除く）
  for (const indexToken of indexTokenKeys) {
    if (indexToken !== queryToken && indexToken.includes(queryToken)) {
      matches.push({ token: indexToken, matchType: 'partial' });
    }
  }

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
 * @param excludeSlugs インデックス検索で既に見つかった記事のslugセット
 * @returns タイトルマッチした記事のリスト（最大100件）
 */
function searchByTitleFallback(searchValue: string, excludeSlugs: Set<string>): SearchResultItem[] {
  const queryLower = searchValue.toLowerCase().trim();
  const results: Array<SearchResultItem & { score: number }> = [];

  for (const data of typedSearchData) {
    if (excludeSlugs.has(data.slug)) continue;

    const titleLower = data.title.toLowerCase();

    if (titleLower.includes(queryLower)) {
      const matchIndex = titleLower.indexOf(queryLower);
      let score = SCORE.titleMatch;

      // 完全一致ボーナス
      if (titleLower === queryLower) {
        score += SCORE.fallbackExactTitle;
      }
      // 単語境界での一致ボーナス（先頭、スペース後、括弧後）
      else if (matchIndex === 0 || titleLower[matchIndex - 1] === ' ' || titleLower[matchIndex - 1] === ']') {
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
  if (isEmptyQuery(searchValue)) {
    return [];
  }

  const queryTokens = tokenizeQuery(searchValue);
  if (queryTokens.length === 0) {
    return [];
  }

  // 1. 転置インデックスから候補記事IDを取得（完全一致 + 部分一致）
  const matchInfo = new Map<string, MatchInfo>();
  const slugToTokens = new Map<string, Set<string>>();
  const slugMatchedQueryTokens = new Map<string, Set<string>>();

  for (const queryToken of queryTokens) {
    for (const { token: indexToken, matchType } of findMatchingTokens(queryToken)) {
      const slugs = typedSearchIndex[indexToken];
      if (!slugs) continue;

      for (const slug of slugs) {
        // マッチタイプごとにカウント
        const info = matchInfo.get(slug) ?? { exactMatches: 0, partialMatches: 0 };
        info[matchType === 'exact' ? 'exactMatches' : 'partialMatches']++;
        matchInfo.set(slug, info);

        // マッチしたindexTokenを記録
        const tokens = slugToTokens.get(slug) ?? new Set();
        tokens.add(indexToken);
        slugToTokens.set(slug, tokens);

        // クエリトークンごとのマッチを記録（AND検索用）
        const matched = slugMatchedQueryTokens.get(slug) ?? new Set();
        matched.add(queryToken);
        slugMatchedQueryTokens.set(slug, matched);
      }
    }
  }

  // 2. 候補記事を取得してスコアリング
  const results: Array<SearchResultItem & { score: number }> = [];
  const queryLower = searchValue.toLowerCase();

  for (const [slug, info] of matchInfo) {
    // AND検索: 複数トークンの場合、すべてのクエリトークンにマッチしない記事を除外
    if (queryTokens.length > 1) {
      const matchedTokens = slugMatchedQueryTokens.get(slug);
      if (!matchedTokens || matchedTokens.size < queryTokens.length) continue;
    }

    const data = searchDataMap.get(slug);
    if (!data) continue;

    // 基本スコア（完全一致は高スコア、部分一致は低スコア）
    let score = info.exactMatches * SCORE.exactMatch + info.partialMatches * SCORE.partialMatch;

    // タイトルマッチボーナス
    const hasTitleMatch = data.title.toLowerCase().includes(queryLower);
    if (hasTitleMatch) {
      score += SCORE.titleMatch;
    }

    // タグマッチングボーナス
    const tagResult = calculateTagScore(data.tags, queryTokens);
    score += tagResult.score;

    // 複数トークンが全て完全一致した場合のボーナス（AND検索）
    if (queryTokens.length > 1 && info.exactMatches === queryTokens.length) {
      score += SCORE.allTokensExact;
    }

    // 複合語マッチボーナス
    if (queryTokens.length > 1) {
      const indexTokens = slugToTokens.get(slug);
      if (indexTokens) {
        score += calculateCompoundWordBonus(indexTokens, queryTokens);
      }
    }

    // matchedIn を決定
    const matchedIn = determineMatchedIn(hasTitleMatch, tagResult.hasMatch);

    // matchType を決定
    const matchType = determineMatchType(info, queryTokens.length);

    results.push({
      slug: data.slug,
      title: data.title,
      tags: data.tags,
      matchedIn,
      matchType,
      score,
    });
  }

  // 3. スコア順にソートして上位N件を返す
  results.sort((a, b) => b.score - a.score);

  // スコアプロパティを除外して返す
  const indexedResults = results.slice(0, MAX_SEARCH_RESULTS).map(({ score, ...item }) => item);

  // 4. タイトル直接検索で補完（インデックス検索で見つからなかった記事を追加）
  const indexedSlugs = new Set(indexedResults.map((r) => r.slug));
  const fallbackResults = searchByTitleFallback(searchValue, indexedSlugs);

  return [...indexedResults, ...fallbackResults].slice(0, MAX_SEARCH_RESULTS);
}
