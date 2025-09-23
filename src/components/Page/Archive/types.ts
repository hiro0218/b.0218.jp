export interface PaginationViewProps {
  onPageChange: (page: number) => void;
  totalCount: number;
  totalPages: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
}
