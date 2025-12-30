'use client';

import { type ReactNode, useId } from 'react';
import { CaretLeftIcon, CaretRightIcon, ICON_SIZE_XS } from '@/ui/icons';
import { css, styled } from '@/ui/styled';
import { ARCHIVE_CONFIG } from '../../constants';
import type { PaginationViewProps } from '../../types';
import { usePagination } from '../hooks/usePagination';

type NavigationButtonProps = {
  direction: 'previous' | 'next';
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageNumberButtonProps = {
  pageNumber: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

type EllipsisItemProps = {
  children: ReactNode;
};

const NavigationButton = ({ direction, currentPage, totalPages, onPageChange }: NavigationButtonProps) => {
  const isPrevious = direction === 'previous';
  const targetPage = isPrevious ? currentPage - 1 : currentPage + 1;
  const isDisabled = isPrevious ? currentPage <= 1 : currentPage >= totalPages;
  const Icon = isPrevious ? CaretLeftIcon : CaretRightIcon;
  const label = isPrevious ? `前のページへ（現在${currentPage}ページ）` : `次のページへ（現在${currentPage}ページ）`;

  return (
    <button
      aria-label={label}
      className={paginationButtonStyle}
      data-arrow-button
      disabled={isDisabled}
      onClick={() => onPageChange(targetPage)}
      type="button"
    >
      <Icon aria-hidden="true" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
    </button>
  );
};

const PageNumberButton = ({ pageNumber, currentPage, onPageChange }: PageNumberButtonProps) => {
  const isCurrentPage = pageNumber === currentPage;
  const ariaLabel = isCurrentPage ? `現在のページ（${pageNumber}ページ）` : `${pageNumber}ページへ移動`;

  return (
    <button
      aria-current={isCurrentPage ? 'page' : undefined}
      aria-label={ariaLabel}
      className={paginationButtonStyle}
      disabled={isCurrentPage}
      onClick={() => onPageChange(pageNumber)}
      type="button"
    >
      {pageNumber}
    </button>
  );
};

const EllipsisItem = ({ children }: EllipsisItemProps) => (
  <EllipsisIndicator aria-hidden="true" className={paginationButtonStyle}>
    {children}
  </EllipsisIndicator>
);

/**
 * ページネーションUIコンポーネント
 * @param onPageChange ページ変更ハンドラー
 * @param totalCount 総アイテム数
 * @param totalPages 総ページ数
 * @param siblingCount 現在ページの両側に表示する兄弟ページ数
 * @param currentPage 現在のページ番号
 * @param pageSize ページサイズ
 */
export const PaginationView = ({
  onPageChange,
  totalCount,
  totalPages,
  siblingCount = 1,
  currentPage,
  pageSize,
}: PaginationViewProps) => {
  const { paginationRange } = usePagination({
    currentPage,
    totalCount,
    totalPages,
    siblingCount,
    pageSize,
  });

  const id = useId();
  const paginationId = `pagination-${id}`;

  if (totalCount === 0 || paginationRange.length < 2) {
    return null;
  }

  return (
    <PaginationNav aria-describedby={`${paginationId}-status`} aria-label="ページネーション">
      <div aria-atomic="true" aria-live="polite" className="sr-only" id={`${paginationId}-status`}>
        {totalPages}ページ中{currentPage}ページ目
      </div>

      <ul>
        <li data-paginate="arrow">
          <NavigationButton
            currentPage={currentPage}
            direction="previous"
            onPageChange={onPageChange}
            totalPages={totalPages}
          />
        </li>
        {paginationRange.map((pageNumber, index) => {
          if (typeof pageNumber === 'string' && pageNumber === ARCHIVE_CONFIG.dots) {
            return (
              <li data-paginate="ellipsis" key={`dots-${index}`}>
                <EllipsisItem>{ARCHIVE_CONFIG.dots}</EllipsisItem>
              </li>
            );
          }

          return (
            <li data-paginate="page" key={`page-${pageNumber}`}>
              <PageNumberButton
                currentPage={currentPage}
                onPageChange={onPageChange}
                pageNumber={pageNumber as number}
              />
            </li>
          );
        })}
        <li data-paginate="progress">
          <PageCountDisplay>
            {currentPage} / {totalPages}
          </PageCountDisplay>
        </li>
        <li data-paginate="arrow">
          <NavigationButton
            currentPage={currentPage}
            direction="next"
            onPageChange={onPageChange}
            totalPages={totalPages}
          />
        </li>
      </ul>
    </PaginationNav>
  );
};

const PaginationNav = styled.nav`
  ul {
    display: flex;
    gap: var(--spacing-1);
    align-items: center;
    justify-content: center;
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
  font-variant-numeric: tabular-nums;
  color: var(--colors-gray-900);
  cursor: pointer;
  border-radius: var(--radii-full);
  transition: background-color 0.1s var(--easings-ease-out-expo);

  &[disabled] {
    color: var(--colors-gray-1000);
    pointer-events: none;
    cursor: not-allowed;
    background-color: var(--colors-gray-300);

    &[data-arrow-button] {
      color: var(--colors-gray-900);
      background-color: transparent;
    }
  }

  &:not([disabled]) {
    &:hover {
      color: var(--colors-gray-1000);
      background-color: var(--colors-gray-200);
    }
    &:active {
      color: var(--colors-gray-1000);
      background-color: var(--colors-gray-300);
    }
    &:focus-visible {
      color: var(--colors-gray-1000);
      background-color: var(--colors-gray-300);
      box-shadow:
        0 0 0 2px var(--colors-gray-25),
        0 0 0 4px var(--colors-gray-800);
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
  color: var(--colors-gray-900);
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
  color: var(--colors-gray-900);
`;
