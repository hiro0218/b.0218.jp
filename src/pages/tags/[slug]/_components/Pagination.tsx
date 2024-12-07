import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { Cluster, Stack } from '@/components/UI/Layout';
import { easeOut } from '@/ui/foundation/easing';
import { CaretLeftIcon, CaretRightIcon, ICON_SIZE_LG, ICON_SIZE_XS } from '@/ui/icons';
import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
import { css, styled } from '@/ui/styled';

type Props = {
  displayCount: number;
  currentPage: number;
  pageNumbers: number[];
  setCurrentPage: (page: number) => void;
};

const QUERY_PAGE_KEY = 'p';

export const DATA_TARGET_POST_LIST_CONTAINER_KEY = 'data-post-list-container';

export const PAGE_RANGE = 5;

const Pagination = memo(function Pagination({ currentPage, displayCount, pageNumbers, setCurrentPage }: Props) {
  const router = useRouter();
  const handlePageChange = useCallback(
    (newPageNumber: number) => {
      setCurrentPage(newPageNumber);
      router.push({ query: { ...router.query, [QUERY_PAGE_KEY]: newPageNumber } }, undefined, { scroll: false });
    },
    [router, setCurrentPage],
  );

  return (
    <PagerComponent aria-label="ページネーション" as="nav" gap={2}>
      <ArrowButton disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} type="button">
        <CaretLeftIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      </ArrowButton>
      <PageNumberContainer>
        {pageNumbers.map((_, i) => {
          const currentNumber = i + 1;
          const key = `page-${currentNumber}`;

          /** 省略判定 */
          const isEllipsis =
            displayCount > 10 &&
            currentNumber > 3 &&
            currentNumber < displayCount - 1 &&
            Math.abs(currentNumber - currentPage) > 1;

          return isEllipsis ? (
            <Ellipsis aria-hidden="true" key={key}>
              ...
            </Ellipsis>
          ) : (
            <PageNumberLabel key={key} tabIndex={1}>
              <input
                checked={currentNumber === currentPage}
                hidden
                name="page"
                onChange={() => handlePageChange(currentNumber)}
                type="radio"
                value={currentPage}
              />
              {currentNumber}
            </PageNumberLabel>
          );
        })}
      </PageNumberContainer>
      <PageProgressNumber>{`${currentPage} / ${displayCount}`}</PageProgressNumber>
      <ArrowButton
        disabled={currentPage === displayCount}
        onClick={() => handlePageChange(currentPage + 1)}
        type="button"
      >
        <CaretRightIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      </ArrowButton>
    </PagerComponent>
  );
});

export const PaginationContainer = ({ displayCount, children }: { displayCount: number; children: ReactNode }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageNumbers = useMemo(() => Array.from({ length: displayCount }).map((_, i) => i + 1), [displayCount]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const paginationProps = useMemo(
    () => ({ displayCount, currentPage, pageNumbers, setCurrentPage }),
    [displayCount, currentPage, pageNumbers, setCurrentPage],
  );

  useEffect(() => {
    const queryPage = (router.query[QUERY_PAGE_KEY] as string) || '1';
    setCurrentPage(Number(queryPage));
  }, [router]);

  if (displayCount === 1) {
    // without pagination
    return (
      <Stack as="section" space={4}>
        {children}
      </Stack>
    );
  }

  return (
    <PostList as="section" pageNumbers={pageNumbers} space={4}>
      {children}
      <Pagination {...paginationProps} />
    </PostList>
  );
};

const PaginationButtonStyle = css`
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: ${ICON_SIZE_LG}px;
  align-items: center;
  justify-content: center;
  width: ${ICON_SIZE_LG}px;
  height: ${ICON_SIZE_LG}px;
  aspect-ratio: 1;
  font-size: var(--font-size-sm);
  color: var(--color-gray-11);
  cursor: pointer;
  border-radius: var(--border-radius-full);
  transition: background-color 0.1s ${easeOut};

  &[disabled] {
    cursor: not-allowed;
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

const ArrowButton = styled.button`
  ${PaginationButtonStyle}
`;

const PageNumberLabel = styled.label`
  ${PaginationButtonStyle}

  &:has(input[type='radio']:checked) {
    color: var(--color-gray-12);
    pointer-events: none;
    background-color: var(--color-gray-5);
  }
`;

const PageNumberContainer = styled(Cluster)`
  ${isMobile} {
    display: none;
  }
`;

const PageProgressNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  color: var(--color-gray-11);

  ${isDesktop} {
    display: none;
  }
`;

const PagerComponent = styled(Cluster)`
  margin-inline: auto;
`;

const Ellipsis = styled.label`
  ${PaginationButtonStyle}

  pointer-events: none;
  user-select: none;
  background-color: transparent;

  & + & {
    display: none;
  }
`;

const PostList = styled(Stack)<{ pageNumbers: number[] }>`
  ${({ pageNumbers }) => {
    return pageNumbers.map((_, i) => {
      const currentNumber = i + 1;
      const show = `n+${(currentNumber - 1) * PAGE_RANGE + 1}`;
      const hide = `-n+${currentNumber * PAGE_RANGE}`;

      return css`
        :has(input[value='${currentNumber}']:checked) {
          [${DATA_TARGET_POST_LIST_CONTAINER_KEY}] > *:not(:nth-of-type(${show}):nth-of-type(${hide})) {
            display: none;
          }
        }
      `;
    });
  }}
`;
