'use client';

import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get(ARCHIVE_CONFIG.queryKey);
  const itemsPerPage = ARCHIVE_CONFIG.itemsPerPage;

  const totalPages = useMemo(() => calculateTotalPages(totalItems, itemsPerPage), [totalItems, itemsPerPage]);
  const currentPage = parsePageNumber(pageParam, 1, totalPages);

  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete(ARCHIVE_CONFIG.queryKey);
      } else {
        params.set(ARCHIVE_CONFIG.queryKey, String(page));
      }
      const search = params.toString();
      const query = search ? `?${search}` : '';
      router.push(`${window.location.pathname}${query}`);
    },
    [router, searchParams],
  );

  return {
    currentPage,
    totalPages,
    setPage,
  };
};
