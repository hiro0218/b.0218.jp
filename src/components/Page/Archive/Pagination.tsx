import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { css, styled } from '@/ui/styled';

type PaginationPageItem = {
  type: 'page';
  page: number;
  href: string;
  isCurrent: boolean;
};

type PaginationEllipsisItem = {
  type: 'ellipsis';
  key: string;
};

export type PaginationModel = {
  currentPage: number;
  totalPages: number;
  previousHref: string | null;
  nextHref: string | null;
  items: (PaginationPageItem | PaginationEllipsisItem)[];
};

type PaginationProps = {
  pagination: PaginationModel;
};

type NavigationButtonProps = {
  direction: 'previous' | 'next';
  currentPage: number;
  href: string | null;
};

type PageNumberButtonProps = {
  item: PaginationPageItem;
};

/**
 * 前へ/次へボタン
 * スクリーンリーダー用に現在ページ情報を含むラベルを提供
 */
const NavigationButton = ({ direction, currentPage, href }: NavigationButtonProps) => {
  const isPrevious = direction === 'previous';
  const Icon = isPrevious ? ChevronLeftIcon : ChevronRightIcon;
  const label = isPrevious ? `前のページへ（現在${currentPage}ページ）` : `次のページへ（現在${currentPage}ページ）`;
  const icon = <Icon aria-hidden="true" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />;

  if (!href) {
    // span + aria-disabled は generic role で警告になるため、操作不能な矢印は native disabled に任せる。
    return (
      <button aria-label={label} className={paginationButtonStyle} data-arrow-button disabled type="button">
        <span className="sr-only">{label}</span>
        {icon}
      </button>
    );
  }

  return (
    <Link aria-label={label} className={paginationButtonStyle} data-arrow-button href={href} prefetch={false}>
      {icon}
    </Link>
  );
};

/**
 * ページ番号ボタン
 * 現在ページはaria-current="page"で明示（WAI-ARIAパターン準拠）
 */
const PageNumberButton = ({ item }: PageNumberButtonProps) => {
  if (item.isCurrent) {
    return (
      <span aria-current="page" className={paginationButtonStyle}>
        <span className="sr-only">現在のページ: </span>
        {item.page}
      </span>
    );
  }

  return (
    <Link aria-label={`${item.page}ページへ移動`} className={paginationButtonStyle} href={item.href} prefetch={false}>
      {item.page}
    </Link>
  );
};

/**
 * ページネーション付きナビゲーションを表示
 *
 * 表示モデルが 1 ページ以下の場合は null を返す（非表示）
 *
 * @param pagination ページネーション表示モデル
 * @returns ページネーション UI、または null
 *
 * @example
 * ```tsx
 * <Pagination pagination={pagination} />
 * ```
 */
export function Pagination({ pagination }: PaginationProps) {
  const { currentPage, totalPages } = pagination;

  if (totalPages < 2 || pagination.items.length < 2) {
    return null;
  }

  return (
    <PaginationNav aria-label="ページネーション">
      {/* スクリーンリーダー用の現在位置通知（視覚的には非表示） */}
      <div aria-atomic="true" aria-live="polite" className="sr-only">
        {totalPages}ページ中{currentPage}ページ目
      </div>

      <ul>
        <li data-paginate="arrow">
          <NavigationButton currentPage={currentPage} direction="previous" href={pagination.previousHref} />
        </li>
        {pagination.items.map((item) =>
          item.type === 'ellipsis' ? (
            <li data-paginate="ellipsis" key={item.key}>
              <EllipsisIndicator aria-hidden="true">...</EllipsisIndicator>
            </li>
          ) : (
            <li data-paginate="page" key={`page-${item.page}`}>
              <PageNumberButton item={item} />
            </li>
          ),
        )}
        <li data-paginate="progress">
          <PageCountDisplay>
            {currentPage} / {totalPages}
          </PageCountDisplay>
        </li>
        <li data-paginate="arrow">
          <NavigationButton currentPage={currentPage} direction="next" href={pagination.nextHref} />
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
  padding: 0;
  font-family: inherit;
  font-size: var(--font-sizes-sm);
  font-variant-numeric: tabular-nums;
  color: var(--colors-gray-900);
  text-decoration: none;
  appearance: none;
  cursor: pointer;
  background-color: transparent;
  border: 0;
  border-radius: var(--radii-full);
  transition: background-color var(--transition-fast);

  /* current */
  &[aria-current='page'],
  &:disabled {
    color: var(--colors-gray-200);
    pointer-events: none;
    cursor: not-allowed;
    background-color: var(--colors-gray-800);

    &[data-arrow-button] {
      color: var(--colors-gray-900);
      background-color: transparent;
    }
  }

  &:not([aria-current='page']):not(:disabled) {
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
