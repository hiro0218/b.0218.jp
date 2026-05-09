'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { styled } from '@/ui/styled';

import type { MokujiProps } from './Mokuji/type';
import { useMokuji } from './Mokuji/useMokuji';

export function Mokuji({ refContent }: MokujiProps) {
  const pathname = usePathname();
  const { mokujiContainerRef, mokujiListContainerRef } = useMokuji({ refContent });

  return (
    <Root key={pathname} ref={mokujiContainerRef}>
      <Details>
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
  &[data-visible='false'] {
    display: none;
  }

  a {
    color: var(--colors-gray-800);
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast);

    &:hover {
      background-color: var(--colors-gray-a-50);
    }

    &[aria-current='true'] {
      color: var(--colors-gray-900);
      background-color: var(--colors-gray-a-100);

      &:hover {
        background-color: var(--colors-gray-a-100);
      }

      &::before {
        color: var(--colors-gray-900);
      }
    }
  }

  /*
   * 目次の最小幅 (--mokuji-min-inline-size) を本文左右に確保できる viewport でのみ固定配置する。
   * 下限 ≒ (container-sm + 2 × (mokuji-inline-gap + mokuji-min-inline-size)) / 0.9。
   * 「2 ×」は本文中央配置のため両側分必要、「/ 0.9」は container-lg の clamp(..., 90vw, ...) 由来。
   */
  @media (--isDesktop) and (min-width: 77rem) {
    /* Container LG 内の片側余白 (Container SM の外側) = Mokuji が利用できる横幅 */
    --mokuji-min-inline-size: 12rem;
    --mokuji-inline-gap: var(--spacing-4);
    --mokuji-block-offset: calc(var(--spacing-5) + var(--spacing-3));
    --mokuji-summary-block-size: var(--spacing-5);
    --mokuji-side-room: calc((var(--sizes-container-lg) - var(--sizes-container-sm)) / 2);
    position: fixed;
    inset-block-start: var(--mokuji-block-offset);
    inset-inline-start: calc(50% + var(--sizes-container-sm) / 2 + var(--mokuji-inline-gap));
    z-index: var(--z-index-base);
    inline-size: max(var(--mokuji-min-inline-size), calc(var(--mokuji-side-room) - var(--mokuji-inline-gap)));

    font-size: var(--font-sizes-sm);
    isolation: isolate;
  }
`;

const Details = styled.details`
  background-color: var(--colors-gray-a-50);
  border: 1px solid var(--colors-gray-a-100);
  border-radius: var(--radii-sm);
  transition: background-color var(--transition-slow);

  &:not([open]) {
    &:hover {
      background-color: var(--colors-gray-a-100);
    }
    &:active {
      background-color: var(--colors-gray-a-200);
    }
  }

  &:not([open]) [data-disclosure='closed'],
  &[open] [data-disclosure='open'] {
    opacity: 1;
    transform: scale(1);
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
  font-weight: var(--font-weights-bold);
  cursor: pointer;
  user-select: none;

  /* for Safari */
  &::-webkit-details-marker {
    display: none;
  }
`;

const DetailsContent = styled.div`
  padding-top: var(--spacing-1);

  @media (--isDesktop) and (min-width: 77rem) {
    min-block-size: 0;
    max-block-size: calc(100dvh - var(--mokuji-block-offset) - var(--mokuji-summary-block-size) - var(--spacing-3));
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  & > ol {
    padding: 0 var(--spacing-4) var(--spacing-3) var(--spacing-3);
    margin: 0;
  }

  ol {
    list-style: none;
    counter-reset: number;

    li {
      list-style: none;

      &:not(:last-child) {
        margin-bottom: var(--spacing-1);
      }

      & > a::before {
        margin-right: 0.5em;
        color: var(--colors-gray-600);
        content: counters(number, '-') '. ';
        counter-increment: number;
      }
    }

    ol {
      padding-left: var(--spacing-2);
      margin: var(--spacing-1) 0;
    }
  }
`;
