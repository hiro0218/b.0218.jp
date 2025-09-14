import type { Post } from '@/types/source';

export type SearchProps = Pick<Post, 'title' | 'tags' | 'slug'>;

export type OnCloseDialogProps = () => void;

export type SearchResultData = {
  keyword: string;
  suggestions: SearchProps[];
  focusedIndex: number;
};

export type SearchDOMRefsReturn = {
  updateDOMRefs: () => void;
  focusInput: () => void;
  scrollToFocusedElement: (targetElement: HTMLElement) => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export type KeyboardNavigationReturn = {
  isNavigationKey: (key: string) => boolean;
};
