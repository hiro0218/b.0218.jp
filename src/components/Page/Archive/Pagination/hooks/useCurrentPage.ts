'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { ARCHIVE_CONFIG } from '../../constants';
import { calculateTotalPages, parsePageNumber } from '../../utils/parsePageNumber';

type UseCurrentPageResult = {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
};

/**
 * ページネーションの現在ページ管理フック
 * @param totalItems 総アイテム数
 * @returns 現在ページ、総ページ数、ページ設定関数
 */
export const useCurrentPage = (totalItems: number): UseCurrentPageResult => {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get(ARCHIVE_CONFIG.queryKey);
  const currentPage = parsePageNumber(pageParam);
  const itemsPerPage = ARCHIVE_CONFIG.itemsPerPage;

  const totalPages = useMemo(() => calculateTotalPages(totalItems, itemsPerPage), [totalItems, itemsPerPage]);

  const setPage = useCallback((page: number) => {
    const url = new URL(window.location.href);
    if (page === 1) {
      url.searchParams.delete(ARCHIVE_CONFIG.queryKey);
    } else {
      url.searchParams.set(ARCHIVE_CONFIG.queryKey, String(page));
    }
    /** @note Native implementation to avoid ViewTransition interference */
    window.history.pushState({}, '', url.toString());
  }, []);

  return {
    currentPage,
    totalPages,
    setPage,
  };
};
