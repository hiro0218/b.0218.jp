'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { ARCHIVE_CONFIG } from '../../constants';
import { calculateTotalPages, parsePageNumber } from '../../utils/parsePageNumber';

/**
 * ページネーションの現在ページ管理フック
 * @param totalItems 総アイテム数
 * @returns 現在ページ、総ページ数、ページ設定関数
 */
export function useCurrentPage(totalItems: number): {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
} {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get(ARCHIVE_CONFIG.queryKey);

  const totalPages = useMemo(() => calculateTotalPages(totalItems, ARCHIVE_CONFIG.itemsPerPage), [totalItems]);
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

  return { currentPage, totalPages, setPage };
}
