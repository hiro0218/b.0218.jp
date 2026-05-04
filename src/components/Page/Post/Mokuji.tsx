'use client';

import { usePathname } from 'next/navigation';

import { ChevronDownIcon, ChevronUpIcon, ICON_SIZE_XS } from '@/ui/icons';
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

  /* デスクトップ幅では記事の右外側に追従固定する */
  @media (--isDesktop) {
    /* Container LG 内の片側余白 (Container SM の外側) = Mokuji が利用できる横幅 */
    --mokuji-side-room: calc((var(--sizes-container-lg) - var(--sizes-container-sm)) / 2);
    position: fixed;
    inset-inline-start: calc(50% + var(--sizes-container-sm) / 2 + var(--spacing-4));
    z-index: var(--z-index-base);
    inline-size: calc(var(--mokuji-side-room) - var(--spacing-4));
    max-block-size: calc(100dvh - var(--spacing-3));
    overflow-y: auto;

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
