'use client';

import { usePathname } from 'next/navigation';
import { createContext, type ReactNode, useContext, useEffect } from 'react';
import { useDialog } from '@/hooks/useDialog';

type SearchDialogContextType = {
  isOpen: boolean;
  isClosing: boolean;
  open: () => void;
  close: () => void;
  dialogRef: React.RefObject<HTMLDialogElement>;
};

const SearchDialogContext = createContext<SearchDialogContextType | undefined>(undefined);

export function SearchDialogProvider({ children }: { children: ReactNode }) {
  const dialog = useDialog<HTMLDialogElement>();
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathnameの変更時のみ実行
  useEffect(() => {
    // 画面遷移時はダイアログを閉じる（検索状態は保持される）
    if (dialog.isOpen) {
      dialog.close();
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
