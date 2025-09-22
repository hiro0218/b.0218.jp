'use client';

import { ARCHIVE_CONFIG } from '../constants';
import { useCurrentPage } from './hooks/useCurrentPage';
import { PaginationView } from './views/PaginationView';

type PaginationProps = {
  totalItems: number;
};

/**
 * ページネーションコンポーネント
 * @param totalItems 総アイテム数
 */
export function Pagination({ totalItems }: PaginationProps) {
  const { currentPage, totalPages, setPage } = useCurrentPage(totalItems);

  return (
    <PaginationView
      currentPage={currentPage}
      onPageChange={setPage}
      pageSize={ARCHIVE_CONFIG.itemsPerPage}
      totalCount={totalItems}
      totalPages={totalPages}
    />
  );
}
