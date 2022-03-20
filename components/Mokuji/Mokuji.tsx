import styled from '@emotion/styled';
import { Mokuji as MokujiJs } from 'mokuji.js';
import { useRouter } from 'next/router';
import { MutableRefObject, useEffect, useRef } from 'react';

const Mokuji = ({ refContent }: { refContent: MutableRefObject<HTMLDivElement> }) => {
  const { asPath } = useRouter();
  const refMokuji = useRef<HTMLDivElement>(null);
  const refDetail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mokujiList: HTMLOListElement = new MokujiJs(refContent.current, {
      anchorType: true,
      anchorLink: true,
      anchorLinkSymbol: '#',
      anchorLinkBefore: false,
      anchorLinkClassName: 'anchor',
    });

    if (mokujiList?.childNodes.length !== 0) {
      refDetail.current.appendChild(mokujiList);
      refMokuji.current.style.display = 'block';
    }
  }, [asPath, refContent]);

  return (
    <Root key={asPath} ref={refMokuji} style={{ display: 'none' }}>
      <Details ref={refDetail}>
        <Summary />
      </Details>
    </Root>
  );
};

export default Mokuji;

const Root = styled.aside`
  border: 2px solid var(--borders-7);
  border-radius: 0.25rem;
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
  font-weight: 500;
  cursor: pointer;
  user-select: none;

  &::after {
    content: '目次';
  }
`;

const Details = styled.details`
  > ol {
    margin: 0;
    padding: var(--space-md) var(--space-xl);

    > li > a {
      font-weight: 500;
    }
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
`
