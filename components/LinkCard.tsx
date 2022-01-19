import { css } from '@emotion/react';
import Link from 'next/link';
import { FC } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';

import { mobile } from '@/lib/mediaQuery';
import { convertDateToSimpleFormat } from '@/utils/date';

interface Props {
  link: string;
  title: string;
  date: string;
  excerpt?: string;
  target?: boolean;
}

const LinkCard: FC<Props> = ({ link, title, date, excerpt, target = false }) => {
  return (
    <Link href={link} prefetch={false} passHref>
      <a className="link-card" css={cssLinkCard} {...(target && { target: '_blank' })}>
        <div className="link-card-main">
          <h3 className="link-card__title">{title}</h3>
          <div className="link-card__text">
            <time dateTime={date} className="link-card__date">
              {convertDateToSimpleFormat(date)}
            </time>
            {excerpt && <span className="link-card__excerpt">{excerpt}</span>}
          </div>
        </div>
        <div className="link-card-icon">
          <div className="link-card-icon__arrow">
            {target ? (
              /* external */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="1rem"
                height="1rem"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            ) : (
              /* arrow */
              <HiOutlineChevronRight />
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default LinkCard;

const cssLinkCard = css`
  display: flex;
  height: 100%;
  margin: 0 calc(var(--margin-base) * -0.6);
  padding: calc(var(--margin-base) * 0.6) calc(var(--margin-base) * 0.8);
  transition: background-color 0.2s ease, box-shadow 0.4s ease;
  border-radius: 0.25rem;
  font-size: var(--font-size-sm);

  ${mobile} {
    padding: calc(var(--margin-base) * 0.6);
  }

  &:hover {
    background-color: var(--component-backgrounds-4);
    box-shadow: 0 0 0 0.25rem var(--component-backgrounds-4);
  }

  .link-card-main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
    overflow: hidden;
  }

  .link-card__title {
    color: var(--text-12);
    font-size: 1rem;
    line-height: 1.8;
  }

  .link-card__text {
    margin-top: 0.25rem;
    overflow: hidden;
    color: var(--text-11);
    letter-spacing: 0.025em;
    line-height: 1.8;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }

  .link-card__date {
    &:not(:only-child) {
      &::after {
        content: ' — ';
      }
    }
  }

  .link-card-icon {
    display: flex;
    align-items: center;
    padding-left: calc(var(--margin-base) * 0.4);
  }

  .link-card-icon__arrow {
    display: flex;
    align-items: center;
    color: var(--text-11);

    svg {
      width: 1rem;
      height: 1rem;
    }
  }
`;
