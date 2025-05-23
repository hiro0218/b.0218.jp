import { CaretLeftIcon, CaretRightIcon, ICON_SIZE_XS } from '@/ui/icons';
import { css, styled } from '@/ui/styled/static';
import { DOTS } from './constant';
import { usePagination } from './usePagination';

type PaginationProps = {
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
}: PaginationProps) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <Nav aria-label="ページネーション">
      <ul>
        <li data-arrow>
          <button
            className={buttonStyle}
            data-arrow-button
            disabled={currentPage === 1}
            onClick={onPrevious}
            type="button"
          >
            <CaretLeftIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          </button>
        </li>
        {paginationRange.map((pageNumber, index) => {
          if (typeof pageNumber === 'string' && pageNumber === DOTS) {
            return (
              <li data-ellipsis key={index}>
                <Ellipsis className={buttonStyle}>{DOTS}</Ellipsis>
              </li>
            );
          }

          return (
            <li data-page key={index}>
              <button
                className={buttonStyle}
                disabled={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber as number)}
                type="button"
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
        <li data-progress>
          <Progress>
            {currentPage} / {lastPage}
          </Progress>
        </li>
        <li data-arrow>
          <button
            className={buttonStyle}
            data-arrow-button
            disabled={currentPage === lastPage}
            onClick={onNext}
            type="button"
          >
            <CaretRightIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          </button>
        </li>
      </ul>
    </Nav>
  );
};

const Nav = styled.nav`
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

const buttonStyle = css`
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

const Ellipsis = styled.span`
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

const Progress = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-gray-11);
`;
