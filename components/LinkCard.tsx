import Link from 'next/link';
import { FC } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';

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
    <Link href={link}>
      <a className="link-card" {...(target && { target: '_blank' })}>
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
