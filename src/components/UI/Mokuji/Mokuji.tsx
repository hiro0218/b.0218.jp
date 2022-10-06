import { Mokuji as MokujiJs } from 'mokuji.js';
import { useRouter } from 'next/router';
import { MutableRefObject, useEffect, useRef } from 'react';

import { styled } from '@/ui/styled';

const Mokuji = ({ refContent }: { refContent: MutableRefObject<HTMLDivElement> }) => {
  const { asPath } = useRouter();
  const refMokuji = useRef<HTMLDivElement>(null);
  const refDetail = useRef<HTMLDetailsElement>(null);
  const refFirstRender = useRef(true);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (refFirstRender.current) {
        refFirstRender.current = false;
        return;
      }
    }

    requestAnimationFrame(() => {
      const mokujiList = MokujiJs(refContent.current, {
        anchorType: true,
        anchorLink: true,
        anchorLinkSymbol: '#',
        anchorLinkBefore: false,
        anchorLinkClassName: 'anchor',
        anchorContainerTagName: 'ol',
      });

      if (mokujiList.childNodes.length !== 0) {
        refDetail.current.appendChild(mokujiList);
        refMokuji.current.style.display = 'block';
      } else {
        refMokuji.current.style.display = 'none';
      }
    });
  }, [asPath, refContent]);

  return (
    <Root key={asPath} ref={refMokuji}>
      <Details ref={refDetail}>
        <Summary />
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
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-md);
  cursor: pointer;
  user-select: none;

  &::after {
    content: '目次';
  }
`;

const Details = styled.details`
  transition: background-color 0.2s ease;
  border-radius: 0.25rem;
  background-color: var(--backgrounds-2);

  &:not([open]):hover {
    background-color: var(--component-backgrounds-3);
  }

  > ol {
    margin: 0;
    padding: 0 var(--space-lg) var(--space-lg);

    /* > li > a {} */
  }

  ol {
    list-style: none;
    counter-reset: number;

    & li {
      list-style: none;

      &:not(:last-child) {
        margin-bottom: var(--space-xs);
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
