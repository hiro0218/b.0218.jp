import { CaretLeftIcon, CaretRightIcon, ICON_SIZE_XS } from '@/ui/icons';
import { css, styled } from '@/ui/styled/static';
import { DOTS } from '../constant';
import { usePagination } from '../hooks/usePagination';

type PaginationComponentProps = {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
};

export const PaginationComponent = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}: PaginationComponentProps) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // 表示するものがない場合は何も表示しない
  if (totalCount === 0 || paginationRange.length < 2) {
    return null;
  }

  const handleNextPage = () => {
    onPageChange(currentPage + 1);
  };

  const handlePreviousPage = () => {
    onPageChange(currentPage - 1);
  };

  const finalPageNumber = paginationRange[paginationRange.length - 1];

  return (
    <PaginationNav aria-label="ページネーション">
      <ul>
        <li data-arrow>
          <button
            data-arrow-button
            type="button"
            className={paginationButtonStyle}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <CaretLeftIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          </button>
        </li>
        {paginationRange.map((pageNumber, index) => {
          if (typeof pageNumber === 'string' && pageNumber === DOTS) {
            return (
              <li data-ellipsis key={index}>
                <EllipsisIndicator className={paginationButtonStyle}>{DOTS}</EllipsisIndicator>
              </li>
            );
          }

          return (
            <li data-page key={index}>
              <button
                type="button"
                onClick={() => onPageChange(pageNumber as number)}
                disabled={pageNumber === currentPage}
                className={paginationButtonStyle}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
        <li data-progress>
          <PageCountDisplay>
            {currentPage} / {finalPageNumber}
          </PageCountDisplay>
        </li>
        <li data-arrow>
          <button
            data-arrow-button
            type="button"
            className={paginationButtonStyle}
            onClick={handleNextPage}
            disabled={currentPage === finalPageNumber}
          >
            <CaretRightIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          </button>
        </li>
      </ul>
    </PaginationNav>
  );
};

const PaginationNav = styled.nav`
  margin-inline: auto;

  ul {
    display: flex;
    gap: var(--space-1);
    list-style: none;
  }

  li {
    display: flex;
  }

  @media (--isDesktop) {
    [data-progress] {
      display: none;
    }
  }

  @media (--isMobile) {
    [data-arrow] {
      display: block;
    }

    [data-page],
    [data-ellipsis] {
      display: none;
    }
  }
`;

const paginationButtonStyle = css`
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: var(--icon-size-lg);
  align-items: center;
  justify-content: center;
  width: var(--icon-size-lg);
  height: var(--icon-size-lg);
  aspect-ratio: 1;
  font-size: var(--font-size-sm);
  color: var(--color-gray-11);
  cursor: pointer;
  border-radius: var(--border-radius-full);
  transition: background-color 0.1s var(--easing-ease-out);

  &[disabled] {
    color: var(--color-gray-12);
    pointer-events: none;
    cursor: not-allowed;
    background-color: var(--color-gray-5);

    &[data-arrow-button] {
      color: var(--color-gray-11);
      background-color: transparent;
    }
  }

  &:not([disabled]) {
    &:hover {
      background-color: var(--color-gray-4);
    }
    &:active,
    &:focus-visible {
      background-color: var(--color-gray-5);
    }
  }
`;

const EllipsisIndicator = styled.span`
  display: grid;
  place-content: center;
  width: var(--icon-size-lg);
  height: var(--icon-size-lg);
  aspect-ratio: 1;
  line-height: 1;
  color: var(--color-gray-11);
  pointer-events: none;
  user-select: none;
  background-color: transparent;
`;

const PageCountDisplay = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-gray-11);
`;
