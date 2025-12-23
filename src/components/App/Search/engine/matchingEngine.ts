/**
 * 検索マッチングロジックを担当するモジュール
 * @description
 * テキストのマッチング判定、タグ/タイトルマッチング、複数キーワード検索を提供する
 */

import type { MatchedIn, MatchType, RankedSearchResult, SearchProps } from '../types';
import { isEmptyQuery } from '../utils/validation';
import { getMatchTypePriority } from './scoringEngine';

/**
 * 正規化されたテキストの型定義
 * @internal
 */
type NormalizedText = {
  standard: string; // 小文字化+トリム
  compact: string; // スペース除去版
};

/**
 * テキスト正規化のユーティリティ
 * @internal
 */
const normalizeText = (text: string): NormalizedText => {
  const standard = text.toLowerCase().trim();
  return {
    standard,
    compact: standard.replace(/\s+/g, ''),
  };
};

/**
 * 検索精度向上のため検索クエリとテキストの一致パターンを判定し最適なマッチタイプを返す
 * @param text - 検索対象のテキスト
 * @param query - 検索クエリ
 * @returns 一致パターンのタイプ
 */
export const getTextMatchType = (text: string, query: string): MatchType => {
  if (!text || !query) return 'NONE';

  const textNorm = normalizeText(text);
  const queryNorm = normalizeText(query);

  if (textNorm.standard === queryNorm.standard) return 'EXACT';
  if (textNorm.compact === queryNorm.compact) return 'EXACT_NO_SPACE';
  if (textNorm.standard.includes(queryNorm.standard)) return 'PARTIAL';
  if (textNorm.compact.includes(queryNorm.compact)) return 'PARTIAL_NO_SPACE';

  return 'NONE';
};

/**
 * 検索結果のフィルタリング処理効率化のため、マッチタイプをboolean値に変換
 * @param text - 検索対象のテキスト
 * @param query - 検索クエリ
 * @returns 一致する場合true、一致しない場合false
 */
export const isTextMatching = (text: string, query: string): boolean => {
  return getTextMatchType(text, query) !== 'NONE';
};

/**
 * 記事検索での重要度順位付けのため記事のタグ情報から最適なマッチタイプを取得
 * @param post - 検索対象の記事データ
 * @param searchValue - 検索クエリ
 * @returns タグマッチングで得られた最も優先度の高いマッチタイプ
 * @note 複数タグがある場合は最も優先度の高い一致を採用し、完全一致が見つかれば即座返す
 */
export const getTagMatchType = (post: SearchProps, searchValue: string): MatchType => {
  if (!post.tags || post.tags.length === 0) {
    return 'NONE';
  }

  let bestMatchType: MatchType = 'NONE';
  let bestPriority = 0;

  for (const tag of post.tags) {
    const matchType = getTextMatchType(tag, searchValue);
    const priority = getMatchTypePriority(matchType);

    if (matchType === 'EXACT') {
      return 'EXACT';
    }

    if (priority > bestPriority) {
      bestMatchType = matchType;
      bestPriority = priority;
    }
  }

  return bestMatchType;
};

/**
 * 記事タイトルでの検索優先度確保のため記事タイトルからマッチタイプを取得
 * @param post - 検索対象の記事データ
 * @param searchValue - 検索クエリ
 * @returns タイトルマッチングで得られたマッチタイプ
 * @note タイトルは検索で最も重要な要素のため、単純なテキストマッチングを実行
 */
export const getTitleMatchType = (post: SearchProps, searchValue: string): MatchType => {
  return getTextMatchType(post.title, searchValue);
};

/**
 * 複数キーワード検索のAND条件実現のため全てのキーワードが含まれるかを判定
 * @param post - 検索対象の記事データ
 * @param searchTerms - 検索キーワードの配列
 * @returns 全てのキーワードが一致する場合true
 */
export const isMultiTermMatching = (post: SearchProps, searchTerms: string[]): boolean => {
  const titleNorm = normalizeText(post.title);

  return searchTerms.every((term) => {
    const termNorm = normalizeText(term);

    const titleMatch = titleNorm.standard.includes(termNorm.standard) || titleNorm.compact.includes(termNorm.compact);
    if (titleMatch) return true;

    return (
      post.tags?.some((tag) => {
        const tagNorm = normalizeText(tag);
        return tagNorm.standard.includes(termNorm.standard) || tagNorm.compact.includes(termNorm.compact);
      }) ?? false
    );
  });
};

/**
 * 単一キーワードでのマッチングを判定
 * @internal
 */
const matchSingleTerm = (post: SearchProps, searchValue: string): RankedSearchResult | null => {
  const tagMatchType = getTagMatchType(post, searchValue);
  const titleMatchType = getTitleMatchType(post, searchValue);

  if (tagMatchType === 'NONE' && titleMatchType === 'NONE') {
    return null;
  }

  const matchedIn: MatchedIn =
    tagMatchType !== 'NONE' && titleMatchType !== 'NONE' ? 'both' : tagMatchType !== 'NONE' ? 'tag' : 'title';

  const bestMatchType =
    getMatchTypePriority(tagMatchType) >= getMatchTypePriority(titleMatchType) ? tagMatchType : titleMatchType;

  return {
    post,
    matchType: bestMatchType,
    matchedIn,
    priority: getMatchTypePriority(bestMatchType),
  };
};

/**
 * 複数キーワードでのマッチングを判定
 * @internal
 */
const matchMultipleTerms = (post: SearchProps, searchTerms: string[]): RankedSearchResult | null => {
  if (!isMultiTermMatching(post, searchTerms)) {
    return null;
  }

  // 複数単語検索の場合は、タイトルとタグの両方にマッチする可能性が高い
  const matchedIn: MatchedIn = 'both';

  return {
    post,
    matchType: 'MULTI_TERM_MATCH',
    matchedIn,
    priority: getMatchTypePriority('MULTI_TERM_MATCH'),
  };
};

/**
 * 高精度検索実現のため最適なアルゴリズムを選択しユーザー意図に最も近い結果を優先表示
 * @param archives - 検索対象の記事配列
 * @param searchValue - 検索クエリ文字列
 * @returns 優先度情報付きの検索結果配列（RankedSearchResult[]）
 * @note 単一キーワードでは完全一致優先、複数キーワードではAND条件で結果を絞り込み
 */
export const findMatchingPosts = (archives: SearchProps[], searchValue: string): RankedSearchResult[] => {
  if (isEmptyQuery(searchValue)) {
    return [];
  }

  const results: RankedSearchResult[] = [];
  const searchTerms = searchValue.toLowerCase().split(' ').filter(Boolean);
  const isMultiTermQuery = searchTerms.length > 1;

  for (const post of archives) {
    const singleMatch = matchSingleTerm(post, searchValue);
    if (singleMatch) {
      results.push(singleMatch);
      continue;
    }

    if (isMultiTermQuery) {
      const multiMatch = matchMultipleTerms(post, searchTerms);
      if (multiMatch) {
        results.push(multiMatch);
      }
    }
  }

  return results;
};
