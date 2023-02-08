import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import { DetailsAccordion } from '@/lib/DetailsAccordion';
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
        <Summary>目次</Summary>
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

const Summary = styled.summary`
  display: flex;
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

  &::after {
    content: '';
    display: list-item;
    list-style: disclosure-closed;
  }

  [open] &::after {
    list-style-type: disclosure-open;
  }
`;

const Details = styled.details`
  transition: background-color 0.2s ease;
  border-radius: var(--border-radius-4);
  background-color: var(--component-backgrounds-3);

  &:not([open]):hover {
    background-color: var(--component-backgrounds-4);
  }
`;

const DetailsContent = styled.div`
  padding-top: var(--space-2);

  > ol {
    margin: 0;
    padding: 0 var(--space-4) var(--space-3) var(--space-4);

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
      margin: 0.5rem 0;
      padding-left: 1.25em;
    }
  }
`;
