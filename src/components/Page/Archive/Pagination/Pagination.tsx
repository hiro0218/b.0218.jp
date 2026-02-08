'use client';

import { useId } from 'react';
import { CaretLeftIcon, CaretRightIcon, ICON_SIZE_XS } from '@/ui/icons';
import { css, styled } from '@/ui/styled';
import { useCurrentPage } from './hooks/useCurrentPage';
import { usePagination } from './hooks/usePagination';

type PaginationProps = {
  totalItems: number;
};

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

/**
 * 前へ/次へボタン
 * スクリーンリーダー用に現在ページ情報を含むラベルを提供
 */
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

/**
 * ページ番号ボタン
 * 現在ページはaria-current="page"で明示（WAI-ARIAパターン準拠）
 */
const PageNumberButton = ({ pageNumber, currentPage, onPageChange }: PageNumberButtonProps) => {
  const isCurrentPage = pageNumber === currentPage;

  return (
    <button
      aria-current={isCurrentPage ? 'page' : undefined}
      aria-label={isCurrentPage ? `現在のページ（${pageNumber}ページ）` : `${pageNumber}ページへ移動`}
      className={paginationButtonStyle}
      disabled={isCurrentPage}
      onClick={() => onPageChange(pageNumber)}
      type="button"
    >
      {pageNumber}
    </button>
  );
};

/**
 * ページネーション付きナビゲーションを表示
 *
 * totalItems が 0 件、または 1 ページ以下の場合は null を返す（非表示）
 *
 * @param totalItems - 総アイテム数（0 以上の整数）
 * @returns ページネーション UI、または null
 *
 * @example
 * ```tsx
 * <Pagination totalItems={100} />
 * ```
 */
export function Pagination({ totalItems }: PaginationProps) {
  const { currentPage, totalPages, setPage } = useCurrentPage(totalItems);
  const paginationRange = usePagination({ currentPage, totalPages });
  const statusId = useId();

  if (totalItems === 0 || paginationRange.length < 2) {
    return null;
  }

  return (
    <PaginationNav aria-describedby={statusId} aria-label="ページネーション">
      {/* スクリーンリーダー用の現在位置通知（視覚的には非表示） */}
      <div aria-atomic="true" aria-live="polite" className="sr-only" id={statusId}>
        {totalPages}ページ中{currentPage}ページ目
      </div>

      <ul>
        <li data-paginate="arrow">
          <NavigationButton
            currentPage={currentPage}
            direction="previous"
            onPageChange={setPage}
            totalPages={totalPages}
          />
        </li>
        {paginationRange.map((item, index) =>
          typeof item === 'string' ? (
            <li data-paginate="ellipsis" key={`dots-${index}`}>
              <EllipsisIndicator aria-hidden="true">{item}</EllipsisIndicator>
            </li>
          ) : (
            <li data-paginate="page" key={`page-${item}`}>
              <PageNumberButton currentPage={currentPage} onPageChange={setPage} pageNumber={item} />
            </li>
          ),
        )}
        <li data-paginate="progress">
          <PageCountDisplay>
            {currentPage} / {totalPages}
          </PageCountDisplay>
        </li>
        <li data-paginate="arrow">
          <NavigationButton currentPage={currentPage} direction="next" onPageChange={setPage} totalPages={totalPages} />
        </li>
      </ul>
    </PaginationNav>
  );
}

const PaginationNav = styled.nav`
  container-type: inline-size;

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

  [data-paginate='arrow'] {
    display: block;
  }

  [data-paginate='page'],
  [data-paginate='ellipsis'] {
    display: none;
  }

  @container (min-width: 600px) {
    [data-paginate='arrow'],
    [data-paginate='page'],
    [data-paginate='ellipsis'] {
      display: flex;
    }

    [data-paginate='progress'] {
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

  /* current */
  &[disabled] {
    color: var(--colors-gray-200);
    pointer-events: none;
    cursor: not-allowed;
    background-color: var(--colors-gray-800);

    &[data-arrow-button] {
      color: var(--colors-gray-900);
      background-color: transparent;
    }
  }

  &:not([disabled]) {
    &:hover {
      color: var(--colors-gray-900);
      background-color: var(--colors-gray-100);
    }
    &:active {
      color: var(--colors-gray-900);
      background-color: var(--colors-gray-200);
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
