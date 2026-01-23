import { useCallback, useEffect, useRef } from 'react';
import type { SearchResultItem } from '../../types';

interface UseSearchStateRestorationProps {
  persistState: boolean;
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
 * - 転置インデックスを使った検索を即座に再実行
 * - focusedIndex も復元
 */
export const useSearchStateRestoration = ({
  persistState,
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

    if (hasExecutedRestorationRef.current) {
      return;
    }

    // 転置インデックスは常に利用可能なため、即座に検索を再実行
    executeSearch(savedState.query);
    if (setFocusedIndex && savedState.focusedIndex !== undefined) {
      setFocusedIndex(savedState.focusedIndex);
    }
    hasExecutedRestorationRef.current = true;
  }, [executeSearch, loadSearchState, persistState, setFocusedIndex, setResults]);

  // 初回マウント時の状態初期化
  // biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行
  useEffect(() => {
    if (!persistState) return;

    savedStateRef.current = loadSearchState();
    hasHydratedResultsRef.current = false;
    hasExecutedRestorationRef.current = false;
    tryRestoreSearchState();
  }, []);

  // 復元を試行
  useEffect(() => {
    tryRestoreSearchState();
  }, [tryRestoreSearchState]);
};
