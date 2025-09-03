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
import type { SearchProps } from '../types';
import { isEmptyQuery } from './validation';

// 検索一致タイプの定義（優先度順）
export type MatchType =
  | 'EXACT' // 完全一致（最優先）
  | 'PARTIAL' // 部分一致（スペースあり）
  | 'EXACT_NO_SPACE' // スペース除去後の完全一致
  | 'PARTIAL_NO_SPACE' // スペース除去後の部分一致
  | 'MULTI_TERM_MATCH' // 複数単語のAND条件一致
  | 'NONE'; // 不一致

// 検索結果アイテムの型定義（優先度情報付き）
type RankedSearchResult = {
  post: SearchProps;
  priority: number;
  matchType: MatchType;
};

export const toLower = (text: string): string => text.toLowerCase();

export const removeSpaces = (text: string): string => text.replace(/\s+/g, '');

export const splitIntoWords = (text: string): string[] => toLower(text).split(' ').filter(Boolean);

/**
 * 検索結果の表示順序を決めるため、マッチタイプに応じた優先度スコアを返す
 * 完全一致を最優先とし、部分一致、複合条件の順で優先度を設定
 */
export const getMatchTypePriority = (matchType: MatchType): number => {
  switch (matchType) {
    case 'EXACT':
      return 100;
    case 'PARTIAL':
      return 80;
    case 'EXACT_NO_SPACE':
      return 60;
    case 'PARTIAL_NO_SPACE':
      return 40;
    case 'MULTI_TERM_MATCH':
      return 50; // AND条件の複合検索は中程度の優先度
    case 'NONE':
      return 0;
    default:
      return 0;
  }
};

/**
 * 検索クエリとテキストの一致パターンを判定し、最も適切なマッチタイプを返す
 * 完全一致から部分一致まで複数のパターンを順次検証
 */
export const getTextMatchType = (text: string, query: string): MatchType => {
  if (!text || !query) {
    return 'NONE';
  }

  const lowerText = toLower(text);
  const lowerQuery = toLower(query);

  // 完全一致（スペースあり）
  if (lowerText === lowerQuery) {
    return 'EXACT';
  }

  // 部分一致（スペースあり）
  if (lowerText.includes(lowerQuery)) {
    return 'PARTIAL';
  }

  // スペースを除去した比較
  const noSpaceText = removeSpaces(lowerText);
  const noSpaceQuery = removeSpaces(lowerQuery);

  // スペース除去後の完全一致
  if (noSpaceText === noSpaceQuery) {
    return 'EXACT_NO_SPACE';
  }

  // スペース除去後の部分一致
  if (noSpaceText.includes(noSpaceQuery)) {
    return 'PARTIAL_NO_SPACE';
  }

  return 'NONE';
};

/**
 * 検索結果のフィルタリング処理で使用するため、マッチタイプをbooleanに変換
 */
export const isTextMatching = (text: string, query: string): boolean => {
  const matchType = getTextMatchType(text, query);
  return matchType !== 'NONE';
};

/**
 * 記事のタグ情報から最適なマッチタイプを取得する
 * 複数タグがある場合は最も優先度の高い一致を採用し、完全一致が見つかれば即座返す
 */
export const getTagMatchType = (post: SearchProps, searchValue: string): MatchType => {
  if (!post.tags || post.tags.length === 0) {
    return 'NONE';
  }

  let bestMatchType: MatchType = 'NONE';

  for (const tag of post.tags) {
    const matchType = getTextMatchType(tag, searchValue);

    if (getMatchTypePriority(matchType) > getMatchTypePriority(bestMatchType)) {
      bestMatchType = matchType;

      if (bestMatchType === 'EXACT') {
        return bestMatchType;
      }
    }
  }

  return bestMatchType;
};

/**
 * 記事タイトルからマッチタイプを取得する
 * タイトルは検索で最も重要な要素のため、単純なテキストマッチングを実行
 */
export const getTitleMatchType = (post: SearchProps, searchValue: string): MatchType => {
  // titleは必須フィールド
  return getTextMatchType(post.title, searchValue);
};

/**
 * スペース区切りの検索クエリをAND条件で処理するため、全てのキーワードを含む記事のみを結果に含める
 * タグとタイトルの両方で検索し、いずれかで一致したキーワードは条件を満たす
 */
export const isMultiTermMatching = (post: SearchProps, searchTerms: string[]): boolean => {
  return searchTerms.every((term) => {
    // タグでの検索
    if (post.tags && post.tags.length > 0) {
      const hasSimpleTagMatch = post.tags.some((tag) => toLower(tag).includes(toLower(term)));

      if (hasSimpleTagMatch) {
        return true;
      }

      const hasMatchingTag = post.tags.some((tag) => isTextMatching(tag, term));
      if (hasMatchingTag) {
        return true;
      }
    }

    // タイトルでの検索
    const lowerTitle = toLower(post.title);
    const lowerTerm = toLower(term);

    if (lowerTitle.includes(lowerTerm)) {
      return true;
    }

    return isTextMatching(post.title, term);
  });
};

/**
 * 検索クエリの形式に応じて最適なアルゴリズムを選択し、ユーザーの意図に最も近い結果を优先表示する
 * 単一キーワードでは完全一致優先、複数キーワードではAND条件で結果を絞り込み
 */
export const searchPosts = (archives: SearchProps[], searchValue: string): RankedSearchResult[] => {
  // 検索ワードが空の場合は空の結果を返す
  if (isEmptyQuery(searchValue)) {
    return [];
  }

  const results: RankedSearchResult[] = [];
  const searchTerms = splitIntoWords(searchValue);
  const isMultiTermQuery = searchTerms.length > 1;

  // 各投稿に対して検索を実行
  archives.forEach((post) => {
    // 既に結果に追加されたかを管理するフラグ
    let addedToResults = false;

    // 単一キーワード検索：タグまたはタイトルとの一致
    const tagMatchType = getTagMatchType(post, searchValue);
    const titleMatchType = getTitleMatchType(post, searchValue);

    // フレーズ全体での一致（単一キーワード検索）
    if (tagMatchType !== 'NONE' || titleMatchType !== 'NONE') {
      // より優先度の高い一致タイプを採用
      const bestMatchType =
        getMatchTypePriority(tagMatchType) >= getMatchTypePriority(titleMatchType) ? tagMatchType : titleMatchType;

      results.push({
        post,
        matchType: bestMatchType,
        priority: getMatchTypePriority(bestMatchType),
      });

      addedToResults = true;
    }

    // 複数キーワードの場合のAND検索
    if (isMultiTermQuery && !addedToResults && isMultiTermMatching(post, searchTerms)) {
      results.push({
        post,
        matchType: 'MULTI_TERM_MATCH',
        priority: getMatchTypePriority('MULTI_TERM_MATCH'),
      });
    }
  });

  return results;
};

/**
 * 検索結果をソートして件数制限を適用する
 * @param results - ランク付けされた検索結果
 * @param maxResults - 最大結果件数（デフォルト: 100）
 * @returns ソート済みの検索結果配列
 */
const sortAndLimitResults = (results: RankedSearchResult[], maxResults = 100): SearchProps[] => {
  // 優先度順に結果をソート
  const sorted = [...results].sort((a, b) => {
    const priorityDiff = b.priority - a.priority;
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    // 優先度が同じ場合はタイトルでソート
    return (a.post.title || '').localeCompare(b.post.title || '');
  });

  // 結果を最大件数に制限してpostのみを抽出
  return sorted.slice(0, maxResults).map((result) => result.post);
};

/**
 * UIコンポーネントが直接使用するためのラッパー関数
 * 検索結果を上位100件に制限し、優先度順にソートした結果を返す
 * @param archives - 検索対象の投稿配列
 * @param searchValue - 検索クエリ文字列
 * @returns 検索結果の投稿配列
 */
export const executeSearch = (archives: SearchProps[], searchValue: string): SearchProps[] => {
  if (isEmptyQuery(searchValue)) {
    return [];
  }

  // 検索実行
  const rankedResults = searchPosts(archives, searchValue);

  // ソートと件数制限を適用
  return sortAndLimitResults(rankedResults);
};

/**
 * 検索処理のパフォーマンス向上のため、同じクエリの結果をメモリにキャッシュする
 * 連続する同じ検索やバックスペースでの削除時に高速化を実現
 */
export const useSearchWithCache = () => {
  const cache = useMemo(() => new Map<string, SearchProps[]>(), []);

  return useMemo(() => {
    return (archives: SearchProps[], searchValue: string): SearchProps[] => {
      // 空の検索文字列は早期リターン
      if (!searchValue) return [];

      // キャッシュキーの作成（検索値とデータサイズのハッシュ）
      const cacheKey = `${searchValue}-${archives.length}`;

      // キャッシュヒット時はキャッシュから返す
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }

      // 検索実行
      const results = executeSearch(archives, searchValue);

      // 結果をキャッシュに保存（キャッシュサイズ制限）
      if (cache.size > 50) {
        // LRUの代わりに単純にキャッシュをクリア
        cache.clear();
      }
      cache.set(cacheKey, results);

      return results;
    };
  }, [cache]);
};
