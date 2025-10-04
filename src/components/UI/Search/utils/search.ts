/**
 * 検索機能のコアロジックを提供するモジュール
 * @description
 * 以下の検索条件と優先順位に基づいて記事検索を実行する:
 *
 * 1. 完全一致 (EXACT): 検索語と完全に一致する場合（最優先）
 *    - 例: 検索「React入門」→「React入門」が完全一致
 *
 * 2. 部分一致 (PARTIAL): 検索語を含む場合
 *    - 例: 検索「React」→「React入門」が部分一致
 *
 * 3. スペース除去後の完全一致 (EXACT_NO_SPACE): スペースを除去した後に完全一致
 *    - 例: 検索「React 入門」→「React入門」がスペース除去後に完全一致
 *
 * 4. 複数単語のAND条件一致 (MULTI_TERM_MATCH): 複数の検索語がすべて含まれる場合
 *    - 例: 検索「React Hooks」→「React Hooksの基本」が複数単語一致
 *
 * 5. スペース除去後の部分一致 (PARTIAL_NO_SPACE): スペース除去後に部分一致
 *    - 例: 検索「Re act」→「React」がスペース除去後に部分一致
 *
 * 検索対象:
 * - タイトル: 記事のタイトルを検索
 * - タグ: 記事に付与されたタグを検索
 *
 * 特記事項:
 * - 大文字小文字は区別せず検索
 * - 複数キーワードの場合はAND条件で検索（すべてのキーワードを含む記事を検索）
 * - 検索結果は優先度順にソートされる
 */

import { useMemo } from 'react';
import type { MatchedIn, MatchType, SearchProps, SearchResultItem } from '../types';
import { isEmptyQuery } from './validation';

// 優先度定数の定義
const MATCH_PRIORITY: Record<MatchType, number> = {
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  EXACT: 100,
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  PARTIAL: 80,
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  EXACT_NO_SPACE: 60,
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  MULTI_TERM_MATCH: 50,
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  PARTIAL_NO_SPACE: 40,
  // biome-ignore lint/style/useNamingConvention: MatchType列挙値のキー名
  NONE: 0,
} as const;

// キャッシュ設定
const CACHE_SIZE_LIMIT = 50;
const MAX_SEARCH_RESULTS = 100;

// 正規化されたテキストの型定義
type NormalizedText = {
  standard: string; // 小文字化+トリム
  compact: string; // スペース除去版
};

// 検索結果アイテムの型定義（優先度情報付き）
type RankedSearchResult = {
  post: SearchProps;
  priority: number;
  matchType: MatchType;
  matchedIn: MatchedIn;
};

// テキスト正規化のユーティリティ
const normalizeText = (text: string): NormalizedText => {
  const standard = text.toLowerCase().trim();
  return {
    standard,
    compact: standard.replace(/\s+/g, ''),
  };
};

/**
 * 検索結果の表示順序最適化のため、マッチタイプに応じた優先度スコアを返す
 * @param matchType - 判定されたマッチタイプ
 * @returns 優先度数値（高いほど優先表示、完全一致100〜不一致0）
 */
export const getMatchTypePriority = (matchType: MatchType): number => MATCH_PRIORITY[matchType] ?? 0;

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

  // マッチタイプを優先度順にチェック
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

    // 早期リターン: 完全一致が見つかったら即座に返す
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
  // titleは必須フィールド
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

    // タイトルマッチを先にチェック（早期リターン）
    const titleMatch = titleNorm.standard.includes(termNorm.standard) || titleNorm.compact.includes(termNorm.compact);
    if (titleMatch) return true;

    // タグマッチをチェック
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
 */
const matchSingleTerm = (post: SearchProps, searchValue: string): RankedSearchResult | null => {
  const tagMatchType = getTagMatchType(post, searchValue);
  const titleMatchType = getTitleMatchType(post, searchValue);

  if (tagMatchType === 'NONE' && titleMatchType === 'NONE') {
    return null;
  }

  // マッチした場所を判定
  const matchedIn: MatchedIn =
    tagMatchType !== 'NONE' && titleMatchType !== 'NONE' ? 'both' : tagMatchType !== 'NONE' ? 'tag' : 'title';

  // より優先度の高い一致タイプを採用
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
  // 検索ワードが空の場合は空の結果を返す
  if (isEmptyQuery(searchValue)) {
    return [];
  }

  const results: RankedSearchResult[] = [];
  const searchTerms = searchValue.toLowerCase().split(' ').filter(Boolean);
  const isMultiTermQuery = searchTerms.length > 1;

  // 各投稿に対して検索を実行
  for (const post of archives) {
    // 単一キーワード検索
    const singleMatch = matchSingleTerm(post, searchValue);
    if (singleMatch) {
      results.push(singleMatch);
      continue; // 既にマッチしたら次の投稿へ
    }

    // 複数キーワードの場合のAND検索
    if (isMultiTermQuery) {
      const multiMatch = matchMultipleTerms(post, searchTerms);
      if (multiMatch) {
        results.push(multiMatch);
      }
    }
  }

  return results;
};

/**
 * 検索結果をソートして件数制限を適用する
 * @param results - ランク付けされた検索結果
 * @param maxResults - 最大結果件数（デフォルト: 100）
 * @returns ソート済みの検索結果配列
 */
const sortAndLimitResults = (results: RankedSearchResult[], maxResults = 100): SearchResultItem[] => {
  // 優先度順に結果をソート
  const sorted = [...results].sort((a, b) => {
    const priorityDiff = b.priority - a.priority;
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    // 優先度が同じ場合はタイトルでソート
    return (a.post.title || '').localeCompare(b.post.title || '');
  });

  // 結果を最大件数に制限してSearchResultItem形式に変換
  return sorted.slice(0, maxResults).map((result) => ({
    ...result.post,
    matchType: result.matchType,
    matchedIn: result.matchedIn,
  }));
};

/**
 * UIコンポーネントでの検索結果表示のため最適化された高速検索APIを提供
 * @param archives - 検索対象の投稿配列
 * @param searchValue - 検索クエリ文字列
 * @returns 優先度順にソートされた検索結果配列（最大100件）
 * @note UIの応答性確保のため結果件数を100件に制限し、優先度順ソートを適用
 */
export const performPostSearch = (archives: SearchProps[], searchValue: string): SearchResultItem[] => {
  if (isEmptyQuery(searchValue)) {
    return [];
  }

  // 検索実行
  const rankedResults = findMatchingPosts(archives, searchValue);

  // ソートと件数制限を適用
  return sortAndLimitResults(rankedResults, MAX_SEARCH_RESULTS);
};

/**
 * 検索処理のパフォーマンス向上のため、同じクエリの結果をメモリにキャッシュする
 * 連続する同じ検索やバックスペースでの削除時に高速化を実現
 * LRU風の実装で古いエントリーから削除し、メモリ効率を最適化
 */
export const useSearchWithCache = () => {
  const cache = useMemo(() => new Map<string, SearchResultItem[]>(), []);

  return useMemo(() => {
    return (archives: SearchProps[], searchValue: string): SearchResultItem[] => {
      // 空の検索文字列は早期リターン
      if (!searchValue) return [];

      // キャッシュキーの作成（検索値とデータサイズのハッシュ）
      const cacheKey = `${searchValue}-${archives.length}`;

      // キャッシュヒット時は最新として更新（LRU）
      if (cache.has(cacheKey)) {
        const result = cache.get(cacheKey)!;
        // MapはLRU風に動作：削除して再追加で最新に
        cache.delete(cacheKey);
        cache.set(cacheKey, result);
        return result;
      }

      // 検索実行
      const results = performPostSearch(archives, searchValue);

      // キャッシュサイズ制限：最も古いエントリーを削除
      if (cache.size >= CACHE_SIZE_LIMIT) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      cache.set(cacheKey, results);

      return results;
    };
  }, [cache]);
};
