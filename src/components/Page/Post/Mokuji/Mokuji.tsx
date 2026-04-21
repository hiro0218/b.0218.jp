'use client';

import { usePathname } from 'next/navigation';

import { ChevronDownIcon, ChevronUpIcon, ICON_SIZE_XS } from '@/ui/icons';
import { styled } from '@/ui/styled';

import type { MokujiProps } from './type';
import { useMokuji } from './useMokuji';

function Mokuji({ refContent }: MokujiProps) {
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

export default Mokuji;

const Root = styled.nav`
  &[data-visible='false'] {
    display: none;
  }

  a {
    color: var(--colors-gray-900);

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Details = styled.details`
  background-color: var(--colors-gray-a-100);
  border-radius: var(--radii-md);
  transition: background-color var(--transition-slow);

  &:not([open]) {
    &:hover {
      background-color: var(--colors-gray-a-200);
    }
    &:active {
      background-color: var(--colors-gray-a-300);
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
  width: var(--sizes-icon-md);
  height: var(--sizes-icon-md);

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
  font-size: var(--font-sizes-md);
  font-weight: var(--font-weights-bold);
  cursor: pointer;
  user-select: none;

  /* for Safari */
  &::-webkit-details-marker {
    display: none;
  }
`;

const DetailsContent = styled.div`
  padding-top: var(--spacing-2);

  > ol {
    padding: 0 var(--spacing-4) var(--spacing-3) var(--spacing-4);
    margin: 0;

    > li > a {
      font-weight: var(--font-weights-bold);
    }
  }

  ol {
    list-style: none;
    counter-reset: number;

    & li {
      list-style: none;

      &:not(:last-child) {
        margin-bottom: var(--spacing-1);
      }

      a::before {
        content: counters(number, '-') '. ';
        counter-increment: number;
      }
    }

    & ol {
      padding-left: var(--spacing-2);
      margin: var(--spacing-1) 0;
    }
  }
`;
