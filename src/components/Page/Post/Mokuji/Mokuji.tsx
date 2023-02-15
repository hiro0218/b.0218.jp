import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import { DetailsAccordion } from '@/lib/DetailsAccordion';
import { RxTriangleDown, RxTriangleUp } from '@/ui/icons';
import { styled } from '@/ui/styled';

import { MokujiProps } from './type';
import { useMokuji } from './useMokuji';

const Mokuji = ({ refContent }: MokujiProps) => {
  const { asPath } = useRouter();
  const { refMokuji, refDetailContent } = useMokuji({ refContent });
  const refDetails = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const accordion = new DetailsAccordion(refDetails.current, refDetailContent.current);

    return () => {
      accordion.removeEventListener();
    };
  }, [asPath, refDetailContent]);

  return (
    <Root key={asPath} ref={refMokuji}>
      <Details ref={refDetails}>
        <Summary>
          目次
          <RxTriangleDown size={20} data-disclosure="closed" />
          <RxTriangleUp size={20} data-disclosure="open" />
        </Summary>
        <DetailsContent ref={refDetailContent} />
      </Details>
    </Root>
  );
};

export default Mokuji;

const Root = styled.aside`
  font-size: var(--font-size-sm);

  a {
    color: inherit;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Details = styled.details`
  background-color: var(--component-backgrounds-3);
  border-radius: var(--border-radius-4);
  transition: background-color 0.2s ease;

  &:not([open]):hover {
    background-color: var(--component-backgrounds-4);
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
    padding: 0 var(--space-4) var(--space-3) var(--space-4);
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
      padding-left: 1.25em;
      margin: 0.5rem 0;
    }
  }
`;
