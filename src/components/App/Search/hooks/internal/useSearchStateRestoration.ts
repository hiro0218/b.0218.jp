import { useCallback, useEffect, useRef } from 'react';
import type { SearchProps, SearchResultItem } from '../../types';

interface UseSearchStateRestorationProps {
  persistState: boolean;
  archives: SearchProps[];
  executeSearch: (query: string) => void;
  setFocusedIndex?: (index: number) => void;
  setResults: (results: SearchResultItem[], query: string) => void;
  loadSearchState: () => { query: string; results: SearchResultItem[]; focusedIndex?: number } | null;
}

/**
 * 検索状態の復元ロジックをカプセル化
 *
 * @description
 * - localStorage から検索状態を読み込み
 * - archives データが揃ったら検索を再実行
 * - focusedIndex も復元
 */
export const useSearchStateRestoration = ({
  persistState,
  archives,
  executeSearch,
  setFocusedIndex,
  setResults,
  loadSearchState,
}: UseSearchStateRestorationProps) => {
  const savedStateRef = useRef<ReturnType<typeof loadSearchState>>(null);
  const hasHydratedResultsRef = useRef(false);
  const hasExecutedRestorationRef = useRef(false);

  const tryRestoreSearchState = useCallback(() => {
    if (!persistState) return;

    const savedState = savedStateRef.current ?? loadSearchState();
    if (!savedState?.query) return;

    // 初回ハイドレーション: キャッシュされた結果を即座に表示
    if (!hasHydratedResultsRef.current) {
      setResults(savedState.results ?? [], savedState.query);
      hasHydratedResultsRef.current = true;
      savedStateRef.current = savedState;
    }

    if (!archives.length) {
      return;
    }

    if (hasExecutedRestorationRef.current) {
      return;
    }

    // archives データが揃ったら検索を再実行
    executeSearch(savedState.query);
    if (setFocusedIndex && savedState.focusedIndex !== undefined) {
      setFocusedIndex(savedState.focusedIndex);
    }
    hasExecutedRestorationRef.current = true;
  }, [archives.length, executeSearch, loadSearchState, persistState, setFocusedIndex, setResults]);

  // 初回マウント時の状態初期化
  // biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行
  useEffect(() => {
    if (!persistState) return;

    savedStateRef.current = loadSearchState();
    hasHydratedResultsRef.current = false;
    hasExecutedRestorationRef.current = false;
    tryRestoreSearchState();
  }, []);

  // archives データの変化を監視して復元を試行
  useEffect(() => {
    tryRestoreSearchState();
  }, [tryRestoreSearchState]);
};
