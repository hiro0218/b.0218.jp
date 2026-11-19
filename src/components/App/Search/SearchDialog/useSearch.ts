import { useRouter } from 'next/navigation';
import {
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { SearchResult } from '@/components/App/Search/engine';
import { getLoadedSearchEngine, loadSearchEngine } from '@/components/App/Search/engineLoader';
import { isImeComposing } from '@/components/App/Search/keyboard';
import type { PopularPost, SearchMode, SearchOption } from '@/components/App/Search/types';
import { useTimeout } from '@/hooks/useTimeout';
import { getLocalStorage, setLocalStorage } from '@/lib/browser/safeLocalStorage';
import { getSessionStorage, removeSessionStorage, setSessionStorage } from '@/lib/browser/safeSessionStorage';
import { normalizeSearchToken } from '@/lib/search';
import { isObject } from '@/lib/utils/isObject';
import { isStringArray } from '@/lib/utils/isStringArray';
import { convertPostSlugToPath } from '@/lib/utils/url';

const DEBOUNCE_MS = 300;

const SEARCH_STATE_KEY = 'search-state';
const SEARCH_STATE_EXPIRY_MS = 30 * 60 * 1000;

const RECENT_SEARCHES_KEY = 'recent-searches';
const MAX_RECENT_SEARCHES = 5;

function readSavedQuery(): string {
  const saved = getSessionStorage<unknown>(SEARCH_STATE_KEY);
  if (saved === null) return '';

  if (
    !isObject(saved) ||
    typeof saved.query !== 'string' ||
    saved.query === '' ||
    typeof saved.timestamp !== 'number' ||
    !Number.isFinite(saved.timestamp) ||
    Date.now() - saved.timestamp > SEARCH_STATE_EXPIRY_MS
  ) {
    removeSessionStorage(SEARCH_STATE_KEY);
    return '';
  }

  return saved.query;
}

function readRecentQueries(): string[] {
  const stored = getLocalStorage<unknown>(RECENT_SEARCHES_KEY);
  return isStringArray(stored) ? stored.slice(0, MAX_RECENT_SEARCHES) : [];
}

// 画面の state を元に新しい一覧を作らない。別のタブが保存した語を、開いた時点の古い一覧で上書きして失う。書き込みの直前に読み直す
function rememberQuery(query: string) {
  const key = normalizeSearchToken(query);
  const next = [query, ...readRecentQueries().filter((recent) => normalizeSearchToken(recent) !== key)].slice(
    0,
    MAX_RECENT_SEARCHES,
  );

  setLocalStorage(RECENT_SEARCHES_KEY, next);
}

function searchLoaded(query: string): SearchResult[] | null {
  return query === '' ? null : (getLoadedSearchEngine()?.search(query) ?? null);
}

const toRecentOption = (query: string, index: number): SearchOption => ({
  kind: 'recent',
  id: `search-recent-${index}`,
  query,
});

const toPostOption = ({ slug, title, matchedTag }: SearchResult): SearchOption => ({
  kind: 'post',
  id: `search-result-${slug}`,
  slug,
  title,
  matchedTag,
});

function scrollRowIntoView(list: HTMLElement, row: HTMLElement) {
  const styles = getComputedStyle(list);
  const paddingStart = Number.parseFloat(styles.scrollPaddingBlockStart || styles.scrollPaddingTop) || 0;
  const paddingEnd = Number.parseFloat(styles.scrollPaddingBlockEnd || styles.scrollPaddingBottom) || 0;
  const listRect = list.getBoundingClientRect();
  const rowRect = row.getBoundingClientRect();
  const upperEdge = listRect.top + paddingStart;
  const lowerEdge = listRect.bottom - paddingEnd;
  const isAbove = rowRect.top < upperEdge;
  const isBelow = rowRect.bottom > lowerEdge;

  if (isAbove || isBelow) {
    const offset = isAbove ? rowRect.top - upperEdge : rowRect.bottom - lowerEdge;
    list.scrollTo({ top: list.scrollTop + offset, behavior: 'auto' });
  }

  // 一覧のスクロールだけにしない。低い画面（SearchDialog の 20rem 未満）は、一覧が自分ではスクロールせず、外側の面がスクロールする。
  // scrollIntoView だけにしない。行の scroll-margin と一覧の scroll-padding が重なり、↑↓ で選んだ行が端から止まる位置が 8px から 16px に変わる
  row.scrollIntoView({ block: 'nearest' });
}

type UseSearchOptions = {
  popularPosts: PopularPost[];
  inputRef: RefObject<HTMLInputElement | null>;
  /** 実際に閉じるのは呼び出し側で、閉じるアニメーションのあと */
  onRequestClose: () => void;
};

export function useSearch({ popularPosts, inputRef, onRequestClose }: UseSearchOptions) {
  const listId = useId();
  const router = useRouter();
  const timeout = useTimeout();
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef(new Map<number, HTMLElement>());

  // 保存済みの語（前回の検索・最近の検索）を、開いている間に読み直さない。ダイアログは開くたびに mount し直されるので、初期化の 1 回だけ読めば足りる
  const [recentQueries] = useState(readRecentQueries);
  const [restoredQuery] = useState(readSavedQuery);
  const [inputValue, setInputValue] = useState(restoredQuery);
  const [query, setQuery] = useState(restoredQuery);
  const [results, setResults] = useState(() => searchLoaded(restoredQuery));
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // rows の順を、描画の順（最近の検索 → 記事）と変えない。変えると、↑↓ で移る順が見た目の順とずれる
  const mode: SearchMode = query === '' ? 'suggestions' : 'results';
  const rows: SearchOption[] =
    mode === 'suggestions'
      ? [...recentQueries.map(toRecentOption), ...popularPosts.map(toPostOption)]
      : (results ?? []).map(toPostOption);

  useEffect(() => {
    if (query === '' || results !== null) return;

    let isStale = false;
    loadSearchEngine()
      .then((engine) => {
        if (!isStale) setResults(engine.search(query));
      })
      .catch((error) => console.error('Failed to load search engine:', error));

    return () => {
      isStale = true;
    };
  }, [query, results]);

  useEffect(() => {
    if (query !== '') setSessionStorage(SEARCH_STATE_KEY, { query, timestamp: Date.now() });
  }, [query]);

  // 結果の先頭を自動で選ばない。自動で選ぶと、入力の途中で入れ替わる結果の先頭を、Enter が開いてしまうため。↓ を押したときに初めて結果へ入る。
  // biome-ignore lint/correctness/useExhaustiveDependencies: results を依存配列から外さない。何も選んでいないまま結果が入れ替わっても、一覧を先頭へ戻す契機にしているため
  useLayoutEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [results]);

  useLayoutEffect(() => {
    if (focusedIndex === -1) {
      listRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const row = rowRefs.current.get(focusedIndex);
    if (!listRef.current || !row) return;

    inputRef.current?.focus({ preventScroll: true });
    scrollRowIntoView(listRef.current, row);
  }, [focusedIndex, inputRef]);

  const run = (nextQuery: string) => {
    setQuery(nextQuery);
    setResults(searchLoaded(nextQuery));
    setFocusedIndex(-1);
  };

  const reset = () => {
    timeout.cancel();
    setQuery('');
    setResults(null);
    setFocusedIndex(-1);
    removeSessionStorage(SEARCH_STATE_KEY);
  };

  const commit = (value: string) => {
    const trimmed = value.trim();
    if (trimmed === '') {
      reset();
      return;
    }

    timeout.cancel();
    run(trimmed);
  };

  const changeInput = (value: string) => {
    setInputValue(value);

    const trimmed = value.trim();
    if (trimmed === '') {
      reset();
      return;
    }

    if (trimmed === query) {
      // 実行済みの語へ戻ったとき、予約済みの古い検索を残さない。後から発火して、入力欄と結果が食い違う
      timeout.cancel();
      return;
    }

    setFocusedIndex(-1);
    timeout.schedule(() => run(trimmed), DEBOUNCE_MS);
  };

  const clear = () => {
    setInputValue('');
    reset();
    inputRef.current?.focus({ preventScroll: true });
  };

  const close = () => {
    timeout.cancel();
    onRequestClose();
  };

  // クリックで行へ移った焦点を、行に残さない。続けて打てなくなるため
  const searchRecent = (recentQuery: string) => {
    setInputValue(recentQuery);
    commit(recentQuery);
    inputRef.current?.focus({ preventScroll: true });
  };

  // ここで移動しない。クリックは Link が、Enter は router.push が移動するため
  const selectPost = () => {
    if (query !== '') rememberQuery(query);
    close();
  };

  const setRowRef = useCallback((index: number, element: HTMLElement | null) => {
    if (element) {
      rowRefs.current.set(index, element);
    } else {
      rowRefs.current.delete(index);
    }
  }, []);

  // キー操作を入力欄だけに付けない。クリックで焦点が行へ移ることがあり、そのときにキー操作を受けられなくなる
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (isImeComposing(event.nativeEvent)) {
      // 変換中の Esc を既定のままにしない。ダイアログの cancel が先に走り、変換の取り消しでなく、ダイアログが閉じてしまうため
      if (event.key === 'Escape') event.preventDefault();
      return;
    }

    const count = rows.length;
    // 行が無いときは preventDefault しない。0 件のときに、入力欄の Home・End（カーソルの移動）まで止めると、語を直せなくなるため
    const moveTo = (index: number) => {
      if (count === 0) return;

      event.preventDefault();
      setFocusedIndex(index);
    };

    switch (event.key) {
      case 'ArrowDown':
        // 末尾の ↓ で先頭へ戻らない。↓ を押し続けたとき、末尾で止まらずに先頭へ飛ぶと、一覧の終わりが分からなくなるため
        moveTo(Math.min(focusedIndex + 1, count - 1));
        break;
      case 'ArrowUp':
        // 何も選んでいないときの ↑ は、入力欄のカーソル移動に任せる。先頭の ↑ は、選択を外して入力欄へ戻す
        if (focusedIndex >= 0) moveTo(focusedIndex - 1);
        break;
      case 'Home':
        moveTo(0);
        break;
      case 'End':
        moveTo(count - 1);
        break;
      case 'Enter': {
        event.preventDefault();
        const row = rows[focusedIndex];
        if (!row) {
          commit(inputValue);
        } else if (row.kind === 'recent') {
          searchRecent(row.query);
        } else {
          selectPost();
          router.push(convertPostSlugToPath(row.slug));
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        close();
        break;
    }
  };

  return {
    mode,
    query,
    results,
    rows,
    focusedIndex,
    activeDescendantId: rows[focusedIndex]?.id,
    inputValue,
    listId,
    listRef,
    changeInput,
    clear,
    close,
    handleKeyDown,
    searchRecent,
    selectPost,
    setRowRef,
  };
}
