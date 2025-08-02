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
import type { SearchProps } from '@/components/UI/Search/type';

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

/**
 * 文字列を小文字に変換する
 */
export const toLower = (text: string): string => text.toLowerCase();

/**
 * 文字列からスペースを除去する
 */
export const removeSpaces = (text: string): string => text.replace(/\s+/g, '');

/**
 * 文字列を単語に分割する
 */
export const splitIntoWords = (text: string): string[] => toLower(text).split(' ').filter(Boolean);

/**
 * マッチタイプの優先度をスコアに変換する
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
 * 厳密な文字列一致判定を行う（一致タイプを返す）
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
 * テキストが検索クエリに一致するか判定する（真偽値）
 */
export const isTextMatching = (text: string, query: string): boolean => {
  const matchType = getTextMatchType(text, query);
  return matchType !== 'NONE';
};

/**
 * タグに基づいて検索を実行し、一致タイプを返す
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
 * タイトルに基づいて検索を実行し、一致タイプを返す
 */
export const getTitleMatchType = (post: SearchProps, searchValue: string): MatchType => {
  // titleは必須フィールド
  return getTextMatchType(post.title, searchValue);
};

/**
 * 複数の検索語をAND条件で検索し、一致するかを判定する
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
 * 最適な検索ロジックを選択し実行する
 * 投稿データを検索し、優先度情報付きの結果を返す
 */
export const searchPosts = (archives: SearchProps[], searchValue: string): RankedSearchResult[] => {
  // 検索ワードが空の場合は空の結果を返す
  if (!searchValue) {
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
 * 投稿を検索するロジックを実行する
 */
export const executeSearch = (archives: SearchProps[], searchValue: string): SearchProps[] => {
  if (!searchValue) {
    return [];
  }

  // 検索結果は最大100件に制限
  const MaxResults = 100;

  const rankedResults = searchPosts(archives, searchValue);

  // 優先度順に結果をソート
  rankedResults.sort((a, b) => {
    const priorityDiff = b.priority - a.priority;
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return (a.post.title || '').localeCompare(b.post.title || '');
  });

  // 結果を最大件数に制限
  return rankedResults.slice(0, MaxResults).map((result) => result.post);
};

/**
 * 検索機能にmemoizationを適用するフック
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
