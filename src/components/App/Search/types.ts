import type { Post } from '@/types/source';

/**
 * 検索対象の記事データ
 */
export type SearchProps = Pick<Post, 'title' | 'tags' | 'slug'> & {
  score?: number;
};

/**
 * マッチタイプ
 *
 * @description
 * 検索結果のマッチパターンを表す型。
 * 優先度順: EXACT > PARTIAL > EXACT_NO_SPACE > MULTI_TERM_MATCH > PARTIAL_NO_SPACE > NONE
 */
export type MatchType = 'EXACT' | 'PARTIAL' | 'EXACT_NO_SPACE' | 'PARTIAL_NO_SPACE' | 'MULTI_TERM_MATCH' | 'NONE';

/**
 * マッチした場所
 */
export type MatchedIn = 'title' | 'tag' | 'both';

/**
 * 検索結果アイテム
 */
export type SearchResultItem = SearchProps & {
  matchType: MatchType;
  matchedIn: MatchedIn;
};

/**
 * 優先度情報付きの検索結果の型定義
 * @internal
 */
export type RankedSearchResult = {
  post: SearchProps;
  priority: number;
  matchType: MatchType;
  matchedIn: MatchedIn;
};

/**
 * 検索状態（永続化用）
 */
export interface SearchState {
  results: SearchResultItem[];
  query: string;
  focusedIndex?: number;
}

export type OnCloseDialogProps = () => void;

/**
 * Facade Pattern により、複雑な内部実装を隠蔽し、
 * シンプルで使いやすい API を提供
 */
export interface UseSearchFacadeOptions {
  onClose: () => void;
  dialogRef?: React.RefObject<HTMLDialogElement>;
  options?: {
    /**
     * @default true
     */
    persistState?: boolean;
    /**
     * @default 300
     */
    debounceMs?: number;
  };
}

export interface UseSearchFacadeReturn {
  results: SearchResultItem[];
  query: string;
  /**
   * -1 の場合はフォーカスなし
   */
  focusedIndex: number;

  ui: {
    inputProps: {
      onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    };
    /**
     * キーボードナビゲーション（矢印キー、Enter、Escape）を有効化
     */
    containerProps: React.DOMAttributes<HTMLElement>;
    /**
     * キーボードナビゲーション時のフォーカス制御に使用
     *
     * @param index - 結果のインデックス
     * @param element - null の場合は ref を削除
     *
     * @example
     * ```tsx
     * <div ref={(el) => search.ui.setResultRef(index, el)}>
     * ```
     */
    setResultRef: (index: number, element: HTMLDivElement | null) => void;
  };

  actions: {
    /**
     * onClose コールバックを実行し、内部状態をリセット
     */
    close: () => void;
  };
}
