'use client';

import { createContext, type ReactNode, useContext } from 'react';
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
