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
      mokujiList.classList.add('c-mokuji__list');
      refDetail.current.appendChild(mokujiList);
    } else {
      refMokuji.current.style.display = 'none';
    }
  }, [asPath, refContent]);

  return (
    <Root key={asPath} ref={refMokuji} className="c-mokuji">
      <details ref={refDetail}>
        <Summary />
      </details>
    </Root>
  );
};

export default Mokuji;

const Root = styled.div`
  border: 2px solid var(--bg-color--light);
  border-radius: 0.25rem;
  color: var(--color-text--light);
  font-size: var(--font-size-sm);

  a {
    color: inherit;
  }

  ol {
    list-style: none;
    counter-reset: number;

    & li {
      margin-bottom: 0.625rem;
      list-style: none;

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

  .c-mokuji__list {
    margin: 0;
    padding: 0.75rem 1.5rem 1rem;

    > li > a {
      font-weight: 500;
    }
  }
`;

const Summary = styled.summary`
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  user-select: none;

  &::after {
    content: '目次';
  }
`;
