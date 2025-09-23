'use client';

import { usePathname } from 'next/navigation';
import { createContext, type ReactNode, useContext, useEffect, useRef } from 'react';
import { useDialog } from '@/hooks/useDialog';
import { getFromSession } from '@/lib/safeSessionStorage';

type SearchDialogContextType = {
  isOpen: boolean;
  isClosing: boolean;
  open: () => void;
  close: () => void;
  dialogRef: React.RefObject<HTMLDialogElement>;
};

const SearchDialogContext = createContext<SearchDialogContextType | undefined>(undefined);

const SEARCH_STATE_KEY = 'search-state';

type SearchState = {
  query?: string;
  isOpen?: boolean;
};

export function SearchDialogProvider({ children }: { children: ReactNode }) {
  const dialog = useDialog<HTMLDialogElement>();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  // 保存された検索状態を確認し、必要に応じてダイアログを開く
  useEffect(() => {
    const searchState = getFromSession<SearchState>(SEARCH_STATE_KEY);
    if (searchState?.isOpen && searchState?.query) {
      dialog.open();
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathnameの変更時のみ実行
  useEffect(() => {
    // 初回レンダリング時はスキップ
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    // 検索状態がある場合はダイアログを維持、ない場合は閉じる
    if (dialog.isOpen) {
      const searchState = getFromSession<SearchState>(SEARCH_STATE_KEY);
      if (!searchState?.query) {
        dialog.close();
      }
    }
  }, [pathname]);

  const contextValue: SearchDialogContextType = {
    isOpen: dialog.isOpen,
    isClosing: dialog.isClosing ?? false,
    open: dialog.open,
    close: dialog.close,
    dialogRef: dialog.ref,
  };

  return <SearchDialogContext.Provider value={contextValue}>{children}</SearchDialogContext.Provider>;
}

export function useSearchDialog() {
  const context = useContext(SearchDialogContext);

  if (context === undefined) {
    throw new Error('useSearchDialog must be used within SearchDialogProvider');
  }

  return context;
}
