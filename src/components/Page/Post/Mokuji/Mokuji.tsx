import { usePathname } from 'next/navigation';
import { useRef } from 'react';

import { ChevronDownIcon, ChevronUpIcon, ICON_SIZE_XS } from '@/ui/icons';
import { styled } from '@/ui/styled/static';

import type { MokujiProps } from './type';
import { useMokuji } from './useMokuji';

function Mokuji({ refContent }: MokujiProps) {
  const pathname = usePathname();
  const { refMokuji, refDetailContent } = useMokuji({ refContent });
  const refDetails = useRef<HTMLDetailsElement>(null);

  return (
    <Root key={pathname} ref={refMokuji}>
      <Details ref={refDetails}>
        <Summary>
          目次
          <IconContainer>
            <ChevronDownIcon data-disclosure="closed" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
            <ChevronUpIcon data-disclosure="open" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          </IconContainer>
        </Summary>
        <DetailsContent ref={refDetailContent} />
      </Details>
    </Root>
  );
}

export default Mokuji;

const Root = styled.nav`
  a {
    color: var(--colors-gray-12);

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Details = styled.details`
  background-color: var(--colors-gray-a-3);
  border-radius: var(--radii-8);
  transition: background-color 0.2s ease;

  &:not([open]) {
    &:hover {
      background-color: var(--colors-gray-a-4);
    }
    &:active {
      background-color: var(--colors-gray-a-5);
    }
  }

  [data-disclosure] {
    display: none;
  }

  &:not([open]) [data-disclosure='closed'],
  &[open] [data-disclosure='open'] {
    display: block;
  }
`;

const IconContainer = styled.div`
  display: grid;
  place-items: center;
  width: var(--icon-size-md);
  height: var(--icon-size-md);
  background-color: var(--colors-gray-a-3);
  border-radius: var(--radii-full);
`;

const Summary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
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
  padding-top: var(--space-2);

  > ol {
    padding: 0 var(--space-4) var(--space-3) var(--space-4);
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
        margin-bottom: var(--space-1);
      }

      a::before {
        content: counters(number, '-') '. ';
        counter-increment: number;
      }
    }

    & ol {
      padding-left: var(--space-2);
      margin: var(--space-1) 0;
    }
  }
`;
