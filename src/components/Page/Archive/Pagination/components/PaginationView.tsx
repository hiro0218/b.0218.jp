import { useCallback, useEffect, useRef } from 'react';
import { CaretLeftIcon, CaretRightIcon, ICON_SIZE_XS } from '@/ui/icons';
import { css, styled } from '@/ui/styled';
import { DOTS } from '../hooks/constant';
import { usePagination } from '../hooks/usePagination';

type PaginationViewProps = {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
};

export const PaginationView = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}: PaginationViewProps) => {
  const { paginationRange, lastPageNumber } = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // Create unique ID for this pagination instance
  const paginationId = `pagination-${Math.random().toString(36).substr(2, 9)}`;
  const navRef = useRef<HTMLElement>(null);

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Only handle keyboard events when pagination is focused
      if (!navRef.current?.contains(event.target as Node)) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentPage > 1) {
            onPageChange(currentPage - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentPage < lastPageNumber) {
            onPageChange(currentPage + 1);
          }
          break;
        case 'Home':
          event.preventDefault();
          onPageChange(1);
          break;
        case 'End':
          event.preventDefault();
          onPageChange(lastPageNumber);
          break;
      }
    },
    [currentPage, lastPageNumber, onPageChange],
  );

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return nothing if there's nothing to display
  if (totalCount === 0 || paginationRange.length < 2) {
    return null;
  }

  const goToNextPage = () => {
    onPageChange(currentPage + 1);
  };

  const goToPreviousPage = () => {
    onPageChange(currentPage - 1);
  };

  return (
    <PaginationNav
      aria-describedby={`${paginationId}-status`}
      aria-label="Pagination navigation"
      ref={navRef}
      role="navigation"
    >
      {/* Screen reader live region for page changes */}
      <div aria-atomic="true" aria-live="polite" className="sr-only" id={`${paginationId}-status`}>
        Page {currentPage} of {lastPageNumber}
      </div>

      <ul role="list">
        <li data-paginate="arrow">
          <button
            aria-label={`Go to previous page, currently on page ${currentPage}`}
            className={paginationButtonStyle}
            data-arrow-button
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
            type="button"
          >
            <CaretLeftIcon aria-hidden="true" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          </button>
        </li>
        {paginationRange.map((pageNumber, index) => {
          if (typeof pageNumber === 'string' && pageNumber === DOTS) {
            return (
              <li data-paginate="ellipsis" key={index}>
                <EllipsisIndicator aria-hidden="true" className={paginationButtonStyle}>
                  {DOTS}
                </EllipsisIndicator>
              </li>
            );
          }

          const isCurrentPage = pageNumber === currentPage;
          return (
            <li data-paginate="page" key={index}>
              <button
                aria-current={isCurrentPage ? 'page' : undefined}
                aria-label={isCurrentPage ? `Current page, page ${pageNumber}` : `Go to page ${pageNumber}`}
                className={paginationButtonStyle}
                disabled={isCurrentPage}
                onClick={() => onPageChange(pageNumber as number)}
                type="button"
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
        <li data-paginate="progress">
          <PageCountDisplay aria-label={`Page ${currentPage} of ${lastPageNumber}`}>
            {currentPage} / {lastPageNumber}
          </PageCountDisplay>
        </li>
        <li data-paginate="arrow">
          <button
            aria-label={`Go to next page, currently on page ${currentPage}`}
            className={paginationButtonStyle}
            data-arrow-button
            disabled={currentPage === lastPageNumber}
            onClick={goToNextPage}
            type="button"
          >
            <CaretRightIcon aria-hidden="true" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
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
    gap: var(--spacing-1);
    list-style: none;
  }

  li {
    display: flex;
  }


  @media (--isDesktop) {
    [data-paginate='progress'] {
      display: none;
    }
  }

  @media (--isMobile) {
    [data-paginate='arrow'] {
      display: block;
    }

    [data-paginate='page'],
    [data-paginate='ellipsis'] {
      display: none;
    }
  }
`;

const paginationButtonStyle = css`
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: var(--sizes-icon-lg);
  align-items: center;
  justify-content: center;
  width: var(--sizes-icon-lg);
  height: var(--sizes-icon-lg);
  aspect-ratio: 1;
  font-size: var(--font-sizes-sm);
  color: var(--colors-gray-11);
  cursor: pointer;
  border-radius: var(--radii-full);
  transition: background-color 0.1s var(--easings-ease-out);

  &[disabled] {
    color: var(--colors-gray-12);
    pointer-events: none;
    cursor: not-allowed;
    background-color: var(--colors-gray-5);

    &[data-arrow-button] {
      color: var(--colors-gray-11);
      background-color: transparent;
    }
  }

  &:not([disabled]) {
    &:hover {
      color: var(--colors-gray-12);
      background-color: var(--colors-gray-4);
    }
    &:active {
      color: var(--colors-gray-12);
      background-color: var(--colors-gray-5);
    }
    &:focus-visible {
      color: var(--colors-gray-12);
      outline: 2px solid var(--colors-gray-8);
      outline-offset: 2px;
      background-color: var(--colors-gray-5);
    }
  }
`;

const EllipsisIndicator = styled.span`
  display: grid;
  place-content: center;
  width: var(--sizes-icon-lg);
  height: var(--sizes-icon-lg);
  aspect-ratio: 1;
  line-height: 1;
  color: var(--colors-gray-11);
  pointer-events: none;
  user-select: none;
  background-color: transparent;
`;

const PageCountDisplay = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--spacing-1);
  font-size: var(--font-sizes-sm);
  color: var(--colors-gray-11);
`;
