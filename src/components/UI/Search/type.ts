/** biome-ignore-all lint/style/useNamingConvention: temp */
import type { KeyboardEvent } from 'react';

import type { PostProps } from '@/types/source';

export type SearchProps = Pick<PostProps, 'title' | 'tags' | 'slug'>;

export type onCloseDialogProps = () => void;

export type onKeyupEventProps = KeyboardEvent<HTMLInputElement>;

export type onKeyupProps = (e: onKeyupEventProps) => void;

/**
 * 検索結果データの型定義
 */
export type SearchResultData = {
  keyword: string;
  suggestions: SearchProps[];
  focusedIndex: number;
};

/**
 * DOM参照管理フックの戻り値型
 */
export type SearchDOMRefsReturn = {
  updateDOMRefs: () => void;
  focusInput: () => void;
  scrollToFocusedElement: (targetElement: HTMLElement) => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

/**
 * キーボードナビゲーションフックの戻り値型
 */
export type KeyboardNavigationReturn = {
  isNavigationKey: (key: string) => boolean;
};

/**
 * 検索実行フックの戻り値型
 */
export type SearchExecutionReturn = {
  searchFunction: (value: string) => void;
  debouncedSearch: (value: string) => void;
};
