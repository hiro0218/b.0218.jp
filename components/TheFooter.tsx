import { css } from '@emotion/react';
import Link from 'next/link';
import { FC } from 'react';

export const TheFooter: FC = () => {
  return (
    <footer className="footer" css={cssFooter}>
      <div className="footer-container">
        <div className="footer-menu-list" role="list">
          <div className="footer-menu-list__item" role="listitem">
            <Link href="/about" prefetch={false}>
              <a>about</a>
            </Link>
          </div>
          <div className="footer-menu-list__item" role="listitem">
            <Link href="/archive" prefetch={false}>
              <a>archive</a>
            </Link>
          </div>
        </div>
        <small>© hiro</small>
      </div>
    </footer>
  );
};

const cssFooter = css`
  position: sticky;
  top: 100vh;
  margin-top: calc(var(--margin-base) * 4);
  padding: calc(var(--margin-base) * 2) 0;
  background: var(--bg-color--lighter);
  color: var(--color-text--light);
  line-height: 1;

  .footer-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: var(--container-width);
    margin: 0 auto;
    transition: padding 0.1s ease-in-out;

    @media (max-width: 959px) {
      padding: 0 5vw;
    }
  }

  .footer-menu-list {
    display: inline-flex;
  }

  .footer-menu-list__item {
    &:not(:first-child) {
      margin-left: 1em;
    }
  }

  a {
    color: inherit;

    &:hover {
      text-decoration-line: underline;
    }
  }

  small {
    font-size: 1rem;
  }
`;
