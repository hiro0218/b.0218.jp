'use client';

import { usePathname } from 'next/navigation';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef } from 'react';
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

  // pathnameの変更を保存するためのref
  const previousPathnameRef = useRef(pathname);
  const isInitialMount = useRef(true);
  const dialogRef = useRef(dialog);

  // dialog への参照を常に最新に保つ
  dialogRef.current = dialog;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // 画面遷移時、ダイアログが開いている場合のみ閉じる（検索状態は保持される）
    if (previousPathnameRef.current !== pathname) {
      if (dialogRef.current.isOpen) {
        dialogRef.current.close();
      }
      previousPathnameRef.current = pathname;
    }
  }, [pathname]);

  const contextValue = useMemo<SearchDialogContextType>(
    () => ({
      isOpen: dialog.isOpen,
      isClosing: dialog.isClosing ?? false,
      open: dialog.open,
      close: dialog.close,
      dialogRef: dialog.ref,
    }),
    [dialog.isOpen, dialog.isClosing, dialog.open, dialog.close, dialog.ref],
  );

  return <SearchDialogContext.Provider value={contextValue}>{children}</SearchDialogContext.Provider>;
}

export function useSearchDialog() {
  const context = useContext(SearchDialogContext);

  if (context === undefined) {
    throw new Error('useSearchDialog must be used within SearchDialogProvider');
  }

  return context;
}
