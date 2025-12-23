/**
 * 検索結果のスコアリングとソートを担当するモジュール
 * @description
 * 検索結果の優先度を計算し、最適な順序で表示するためのロジックを提供する
 */

import type { MatchType, RankedSearchResult, SearchResultItem } from '../types';

/**
 * 優先度スコア定数
 * @description
 * 各マッチタイプに割り当てる優先度スコア。
 * スコアが高いほど検索結果の上位に表示される。
 */
const EXACT_MATCH_SCORE = 100; // 完全一致（最優先）
const PARTIAL_MATCH_SCORE = 80; // 部分一致（スペースあり）
const EXACT_NO_SPACE_SCORE = 60; // スペース除去後の完全一致
const MULTI_TERM_MATCH_SCORE = 50; // 複数単語のAND条件一致
const PARTIAL_NO_SPACE_SCORE = 40; // スペース除去後の部分一致
const NO_MATCH_SCORE = 0; // 不一致

/**
 * マッチタイプ別のスコアリングロジック
 *
 * @description
 * 各 MatchType に対応する優先度スコアを定義。
 * スコアが高いほど検索結果の上位に表示される。
 *
 * - EXACT (100): 完全一致（最優先）
 *   検索語とタイトル/タグが完全に一致する場合
 *   例: 検索「React入門」→「React入門」
 *
 * - PARTIAL (80): 部分一致（スペースあり）
 *   検索語がタイトル/タグに含まれる場合
 *   例: 検索「React」→「React入門」
 *
 * - EXACT_NO_SPACE (60): スペース除去後の完全一致
 *   スペースを除去した後に完全一致する場合
 *   例: 検索「React 入門」→「React入門」
 *
 * - MULTI_TERM_MATCH (50): 複数単語のAND条件一致
 *   複数の検索語がすべて含まれる場合
 *   例: 検索「React Hooks」→「React Hooksの基本」
 *
 * - PARTIAL_NO_SPACE (40): スペース除去後の部分一致
 *   スペース除去後に部分一致する場合
 *   例: 検索「Re act」→「React」
 *
 * - NONE (0): 不一致
 *   検索条件に一致しない場合
 */
export const MATCH_PRIORITY: Record<MatchType, number> = {
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  EXACT: EXACT_MATCH_SCORE,
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  PARTIAL: PARTIAL_MATCH_SCORE,
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  EXACT_NO_SPACE: EXACT_NO_SPACE_SCORE,
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  MULTI_TERM_MATCH: MULTI_TERM_MATCH_SCORE,
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  PARTIAL_NO_SPACE: PARTIAL_NO_SPACE_SCORE,
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  NONE: NO_MATCH_SCORE,
} as const;

/**
 * 検索結果の表示順序最適化のため、マッチタイプに応じた優先度スコアを返す
 * @param matchType - 判定されたマッチタイプ
 * @returns 優先度数値（高いほど優先表示、完全一致100〜不一致0）
 */
export const getMatchTypePriority = (matchType: MatchType): number => MATCH_PRIORITY[matchType] ?? 0;

/**
 * 検索結果をソートして件数制限を適用する
 * @param results - ランク付けされた検索結果
 * @param maxResults - 最大結果件数（デフォルト: 100）
 * @returns ソート済みの検索結果配列
 */
export const sortAndLimitResults = (results: RankedSearchResult[], maxResults = 100): SearchResultItem[] => {
  const sorted = results.toSorted((a, b) => {
    const priorityDiff = b.priority - a.priority;
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    const scoreA = a.post.score ?? 0;
    const scoreB = b.post.score ?? 0;
    return scoreB - scoreA;
  });

  return sorted.slice(0, maxResults).map((result) => ({
    ...result.post,
    matchType: result.matchType,
    matchedIn: result.matchedIn,
  }));
};
