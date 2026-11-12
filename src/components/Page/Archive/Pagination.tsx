import { CaretLeftIcon, CaretRightIcon, DotsThreeIcon } from '@phosphor-icons/react/ssr';
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

type PaginationItem = PaginationPageItem | PaginationEllipsisItem;

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /** URL の規則（1 ページ目の URL の正規化など）は、呼び出し側が決める */
  getPageHref: (page: number) => string;
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
  const Icon = isPrevious ? CaretLeftIcon : CaretRightIcon;
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

const PAGINATION_ELLIPSIS = '...';

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, idx) => idx + start);
}

// 前後の数（siblingCount）を変数にしない。呼び出しは 1 通りで、変数にすると各枠の数を式で求めることになり、読み取りにくい
function getPaginationRange(currentPage: number, totalPages: number): (number | typeof PAGINATION_ELLIPSIS)[] {
  if (totalPages <= 6) return range(1, totalPages);
  if (currentPage <= 3) return [...range(1, 5), PAGINATION_ELLIPSIS, totalPages];
  if (currentPage >= totalPages - 3) return [1, PAGINATION_ELLIPSIS, ...range(totalPages - 4, totalPages)];

  return [1, PAGINATION_ELLIPSIS, currentPage - 1, currentPage, currentPage + 1, PAGINATION_ELLIPSIS, totalPages];
}

/**
 * @param currentPage 1 始まりのページ番号
 */
export function Pagination({ currentPage, totalPages, getPageHref }: PaginationProps) {
  if (totalPages < 2) {
    return null;
  }

  const previousHref = currentPage > 1 ? getPageHref(currentPage - 1) : null;
  const nextHref = currentPage < totalPages ? getPageHref(currentPage + 1) : null;
  const items = getPaginationRange(currentPage, totalPages).map((item, index): PaginationItem => {
    if (item === PAGINATION_ELLIPSIS) {
      return { type: 'ellipsis', key: `ellipsis-${index}` };
    }

    return { type: 'page', page: item, href: getPageHref(item), isCurrent: item === currentPage };
  });

  return (
    <PaginationNav aria-label="ページネーション">
      {/* スクリーンリーダー用の現在位置通知（視覚的には非表示） */}
      <div aria-atomic="true" aria-live="polite" className="sr-only">
        {totalPages}ページ中{currentPage}ページ目
      </div>

      <ul>
        <li data-paginate="arrow">
          <NavigationButton currentPage={currentPage} direction="previous" href={previousHref} />
        </li>
        {items.map((item) =>
          item.type === 'ellipsis' ? (
            <li data-paginate="ellipsis" key={item.key}>
              <EllipsisIndicator aria-hidden="true">
                <DotsThreeIcon />
              </EllipsisIndicator>
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
          <NavigationButton currentPage={currentPage} direction="next" href={nextHref} />
        </li>
      </ul>
    </PaginationNav>
  );
}

const PaginationNav = styled.nav`
  container-type: inline-size;

  ul {
    display: flex;
    gap: var(--spacing-100);
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
  padding: 0 var(--spacing-100);
  font-size: var(--font-sizes-sm);
  color: var(--colors-gray-900);
`;
