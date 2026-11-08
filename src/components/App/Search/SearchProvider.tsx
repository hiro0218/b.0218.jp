'use client';

import { usePathname } from 'next/navigation';
import { createContext, type ReactNode, use, useEffect, useEffectEvent, useRef, useState } from 'react';
import { loadSearchEngine } from './engineLoader';
import { isImeComposing, SEARCH_SHORTCUT_KEY } from './keyboard';
import type { SearchDialog } from './SearchDialog';
import type { PopularPost } from './types';

type Status = 'closed' | 'open' | 'closing';

type SearchOpener = {
  open: () => void;
  /** ダイアログと検索データを先に読み始める。ボタンへの hover・focus で呼ぶ */
  prefetch: () => void;
};

const SearchOpenerContext = createContext<SearchOpener | undefined>(undefined);

const importSearchDialog = () => import('./SearchDialog');

// 先読みの失敗を報告しない。開く操作（open）が読み込み直し、そこで失敗を報告するため
const prefetch = () => {
  importSearchDialog().catch(() => {});
  loadSearchEngine().catch(() => {});
};

// 閉じているときは「閉じる途中」へ進めない。画面遷移のたびに呼ばれ、進めると、閉じたはずのダイアログが描画される
const toClosing = (status: Status): Status => (status === 'open' ? 'closing' : status);

type SearchProviderProps = {
  /** 検索ダイアログを開いた直後（未入力）に候補として出す、よく読まれている記事 */
  popularPosts: PopularPost[];
  children: ReactNode;
};

/**
 * @summary 検索ダイアログの持ち主。読み込み・開閉・「/」のショートカット・画面遷移で閉じる動きを受け持つ。
 */
export function SearchProvider({ popularPosts, children }: SearchProviderProps) {
  const [status, setStatus] = useState<Status>('closed');
  const [LoadedDialog, setLoadedDialog] = useState<typeof SearchDialog | null>(null);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  // React.lazy と Suspense を使わない。fallback を一度出すと、先読み済みでも React の throttle（FALLBACK_THROTTLE_MS = 300）で表示が約 300 ms 遅れる。
  // 開いてから読み込む順にしない。失敗すると開いた状態が残り、/ キーも「開いている」と判定されて再試行できない
  const open = () => {
    prefetch();
    importSearchDialog()
      .then((loaded) => {
        setLoadedDialog(() => loaded.SearchDialog);
        setStatus('open');
      })
      .catch((error) => console.error('Failed to load SearchDialog:', error));
  };

  useEffect(() => {
    if (previousPathname.current === pathname) return;

    previousPathname.current = pathname;
    setStatus(toClosing);
  }, [pathname]);

  // listener を status ごとに登録し直さない。useEffectEvent で最新の status を読めるので、登録は 1 回で済む
  const handleShortcut = useEffectEvent((event: KeyboardEvent) => {
    if (status !== 'closed' || event.key !== SEARCH_SHORTCUT_KEY || isImeComposing(event)) return;

    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

    event.preventDefault();
    open();
  });

  useEffect(() => {
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <SearchOpenerContext value={{ open, prefetch }}>
      {children}
      {LoadedDialog && status !== 'closed' ? (
        <LoadedDialog
          isClosing={status === 'closing'}
          onClosedAction={() => setStatus('closed')}
          onRequestCloseAction={() => setStatus(toClosing)}
          popularPosts={popularPosts}
        />
      ) : null}
    </SearchOpenerContext>
  );
}

export function useSearchOpener(): SearchOpener {
  const opener = use(SearchOpenerContext);

  if (opener === undefined) {
    throw new Error('useSearchOpener must be used within SearchProvider');
  }

  return opener;
}
