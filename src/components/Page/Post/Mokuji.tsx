'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { styled } from '@/ui/styled';

import type { MokujiProps } from './Mokuji/type';
import { useMokuji } from './Mokuji/useMokuji';

export function Mokuji({ refContent }: MokujiProps) {
  const pathname = usePathname();
  const { mokujiContainerRef, mokujiDetailsRef, mokujiListContainerRef } = useMokuji({ refContent });

  return (
    <Root key={pathname} ref={mokujiContainerRef}>
      <Details ref={mokujiDetailsRef}>
        <Summary>
          目次
          <IconContainer>
            <ChevronDownIcon data-disclosure="closed" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
            <ChevronUpIcon data-disclosure="open" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          </IconContainer>
        </Summary>
        <DetailsContent ref={mokujiListContainerRef} />
      </Details>
    </Root>
  );
}

const Root = styled.nav`
  font-size: var(--font-sizes-sm);

  &[data-visible='false'] {
    display: none;
  }

  a {
    display: block;
    padding: var(--spacing-½) var(--spacing-1);
    color: var(--colors-gray-600);
    border-radius: var(--radii-md);
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast),
      transform var(--transition-fast);

    &:hover {
      color: var(--colors-gray-900);
      background-color: var(--colors-gray-a-75);
    }

    &:active {
      transform: scale(0.98);
    }

    &[aria-current='true'] {
      color: var(--colors-gray-900);
      background-color: var(--colors-gray-a-100);

      &:hover {
        background-color: var(--colors-gray-a-100);
      }
    }
  }

  /*
   * 目次の最小幅 (--mokuji-min-inline-size) を本文左右に確保できる viewport でのみ固定配置する。
   * container-lg (max 80rem) が確保される viewport (>= 80rem) で
   * (container-lg - container-article) / 2 = 15rem ≥ mokuji-inline-gap + mokuji-min-inline-size (14.5rem) を満たす。
   */
  @media (--isDesktop) and (min-width: 80rem) {
    /* Container LG 内の片側余白 (Container Article の外側) = Mokuji が利用できる横幅 */
    --mokuji-min-inline-size: 12rem;
    --mokuji-inline-gap: var(--spacing-4);
    --mokuji-block-offset: calc(var(--spacing-5) + var(--spacing-3));
    --mokuji-summary-block-size: var(--spacing-4);
    --mokuji-side-room: calc((var(--sizes-container-lg) - var(--sizes-container-article)) / 2);
    position: fixed;
    inset-block-start: var(--mokuji-block-offset);
    inset-inline-start: calc(50% + var(--sizes-container-article) / 2 + var(--mokuji-inline-gap));
    z-index: var(--z-index-base);
    inline-size: max(var(--mokuji-min-inline-size), calc(var(--mokuji-side-room) - var(--mokuji-inline-gap)));
    isolation: isolate;
  }
`;

const Details = styled.details`
  border: 1px solid var(--colors-gray-a-100);
  border-radius: var(--radii-md);
  transition: background-color var(--transition-slow);

  &:not([open]) {
    &:hover {
      background-color: var(--colors-gray-a-50);
    }
    &:active {
      background-color: var(--colors-gray-a-100);
    }
  }

  &:not([open]) [data-disclosure='closed'],
  &[open] [data-disclosure='open'] {
    opacity: 1;
    transform: scale(1);
  }

  /* 固定配置時は箱の装飾を外し、ラベルとリンクだけを浮かせる */
  @media (--isDesktop) and (min-width: 80rem) {
    border: none;
    border-radius: 0;

    &:not([open]) {
      &:hover,
      &:active {
        background-color: transparent;
      }
    }
  }
`;

const IconContainer = styled.div`
  display: grid;
  place-items: center;
  width: var(--sizes-icon-sm);
  height: var(--sizes-icon-sm);

  [data-disclosure] {
    grid-area: 1 / 1;
    opacity: 0;
    transform: scale(0.25);
    transition:
      opacity var(--transition-slow),
      transform var(--transition-slow);

    @media (prefers-reduced-motion: reduce) {
      transform: none;
      transition: opacity var(--transition-slow);
    }
  }
`;

const Summary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2) var(--spacing-3);
  font-weight: var(--font-weights-bolder);
  cursor: pointer;
  user-select: none;

  /* for Safari */
  &::-webkit-details-marker {
    display: none;
  }

  /* 固定配置時は見出しではなくカテゴリラベルとして控えめに表示する */
  @media (--isDesktop) and (min-width: 80rem) {
    gap: var(--spacing-½);
    justify-content: flex-start;
    min-block-size: var(--mokuji-summary-block-size);
    padding: var(--spacing-½) var(--spacing-1);
    font-size: var(--font-sizes-xs);
    color: var(--colors-gray-600);
    letter-spacing: var(--letter-spacings-md);
    transition:
      color var(--transition-fast),
      transform var(--transition-fast);

    &:hover {
      color: var(--colors-gray-900);
    }
  }
`;

const DetailsContent = styled.div`
  & > ol {
    /* リンク自体の inline padding と合わせて Summary のテキスト位置に揃える */
    padding: 0 var(--spacing-2) var(--spacing-2);
    margin: 0;
  }

  ol {
    list-style: none;

    li {
      list-style: none;

      &:not(:last-child) {
        margin-bottom: var(--spacing-½);
      }
    }

    ol {
      padding-left: var(--spacing-2);
      margin: var(--spacing-½) 0;
    }
  }

  @media (--isDesktop) and (min-width: 80rem) {
    max-block-size: calc(100dvh - var(--mokuji-block-offset) - var(--mokuji-summary-block-size) - var(--spacing-3));
    padding-top: var(--spacing-½);
    overflow-y: auto;
    overscroll-behavior: contain;

    & > ol {
      /* overflow-y: auto のスクロールバーとリンクの間に余白を確保する */
      padding: 0 var(--spacing-1) var(--spacing-2) 0;
    }
  }
`;
