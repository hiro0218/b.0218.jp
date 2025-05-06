'use client';

import { useCallback, useMemo, useState } from 'react';
import debounce from '@/lib/debounce';
import type { onCloseDialogProps, onKeyupEventProps, SearchProps } from './type';
import { executeSearch } from './utils/search';

type SearchResultData = {
  keyword: string;
  suggestions: SearchProps[];
};

const initialSearchResult: SearchResultData = {
  keyword: '',
  suggestions: [],
};

/**
 * 検索データと入力イベントハンドラを提供するカスタムフック
 */
export const useSearchData = (
  archives: SearchProps[],
  closeDialog: onCloseDialogProps,
): {
  searchData: SearchResultData;
  onKeyup: (e: onKeyupEventProps) => void;
} => {
  const [data, setData] = useState<SearchResultData>(initialSearchResult);

  const performSearch = useMemo(() => {
    const search = (value: string) => {
      if (!value) {
        setData(initialSearchResult);
        return;
      }

      const suggestions = executeSearch(archives, value);
      setData({
        keyword: value,
        suggestions,
      });
    };

    return debounce<string>((value: string) => search(value), 300);
  }, [archives]);

  const onKeyup = useCallback(
    (e: onKeyupEventProps): void => {
      if (!(e.currentTarget instanceof HTMLInputElement)) {
        return;
      }

      if (e.key === 'Escape' || e.key === 'Esc') {
        closeDialog();
        return;
      }

      const value = e.currentTarget.value.trim();

      if (e.nativeEvent.isComposing) {
        return;
      }

      if (value === data.keyword) {
        return;
      }

      performSearch(value);
    },
    [closeDialog, data.keyword, performSearch],
  );

  return {
    searchData: data,
    onKeyup,
  };
};
