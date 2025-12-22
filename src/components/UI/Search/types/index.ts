import type { Post } from '@/types/source';

export type SearchProps = Pick<Post, 'title' | 'tags' | 'slug'> & {
  score?: number;
};

/**
 * @see src/components/UI/Search/utils/search.ts
 */
export type MatchType = 'EXACT' | 'PARTIAL' | 'EXACT_NO_SPACE' | 'PARTIAL_NO_SPACE' | 'MULTI_TERM_MATCH' | 'NONE';

export type MatchedIn = 'title' | 'tag' | 'both';

export type SearchResultItem = SearchProps & {
  matchType: MatchType;
  matchedIn: MatchedIn;
};

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
