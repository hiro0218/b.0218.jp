import type { Post } from '@/types/source';

export type SearchProps = Pick<Post, 'title' | 'tags' | 'slug'>;

export type OnCloseDialogProps = () => void;

export type SearchResultData = {
  keyword: string;
  suggestions: SearchProps[];
  focusedIndex: number;
};

export type KeyboardNavigationReturn = {
  isNavigationKey: (key: string) => boolean;
};
