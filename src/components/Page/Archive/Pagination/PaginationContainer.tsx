'use client';

import { ARCHIVE_CONFIG } from '../constants';
import { useCurrentPage } from './hooks/useCurrentPage';
import { Pagination } from './Pagination';

type PaginationContainerProps = {
  totalItems: number;
};

/**
 * ページネーションコンテナコンポーネント
 * @param totalItems 総アイテム数
 */
export function PaginationContainer({ totalItems }: PaginationContainerProps) {
  const { currentPage, totalPages, setPage } = useCurrentPage(totalItems);

  return (
    <Pagination
      currentPage={currentPage}
      onPageChange={setPage}
      pageSize={ARCHIVE_CONFIG.itemsPerPage}
      totalCount={totalItems}
      totalPages={totalPages}
    />
  );
}
