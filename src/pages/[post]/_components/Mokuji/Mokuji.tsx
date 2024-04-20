import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { DetailsAccordion } from '@/lib/DetailsAccordion';
import { ChevronDownIcon, ChevronUpIcon, ICON_SIZE_XS } from '@/ui/icons';
import { styled } from '@/ui/styled';

import type { MokujiProps } from './type';
import { useMokuji } from './useMokuji';

function Mokuji({ refContent }: MokujiProps) {
  const pathname = usePathname();
  const { refMokuji, refDetailContent } = useMokuji({ refContent });
  const refDetails = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!refDetails.current) return;
    if (!refDetailContent.current) return;

    const accordion = new DetailsAccordion(refDetails.current, refDetailContent.current);

    return () => {
      accordion.removeEventListener();
    };
  }, [pathname, refDetailContent]);

  return (
    <Root key={pathname} ref={refMokuji}>
      <Details ref={refDetails}>
        <Summary>
          目次
          <ChevronDownIcon data-disclosure="closed" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          <ChevronUpIcon data-disclosure="open" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
        </Summary>
        <DetailsContent ref={refDetailContent} />
      </Details>
    </Root>
  );
}

export default Mokuji;

const Root = styled.nav`
  a {
    color: inherit;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Details = styled.details`
  background-color: var(--component-backgrounds-3);
  border-radius: var(--border-radius-8);
  transition: background-color 0.2s ease;

  &:not([open]) {
    &:hover {
      background-color: var(--component-backgrounds-4);
    }
    &:active {
      background-color: var(--component-backgrounds-5);
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

const Summary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  user-select: none;

  // for Safari
  &::-webkit-details-marker {
    display: none;
  }
`;

const DetailsContent = styled.div`
  padding-top: var(--space-2);

  > ol {
    padding: 0 var(--space-3) var(--space-3) var(--space-3);
    margin: 0;

    > li > a {
      font-weight: var(--font-weight-bold);
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

      &::before {
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
