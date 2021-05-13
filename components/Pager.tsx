import Link from 'next/link';
import React, { FC } from 'react';

import style from '@/styles/Components/pager.module.css';
import { NextPrevPost } from '@/types/source';

type Props = {
  next: NextPrevPost;
  prev: NextPrevPost;
};

const Pager: FC<Props> = ({ next, prev }) => {
  return (
    <nav className={style['c-pager']}>
      {Object.keys(prev).length !== 0 && (
        <Link href={`${prev.slug}.html`}>
          <a className={style['c-pager__item--prev']}>
            <div className={style['c-pager-icon--prev']}>
              <div className={style['c-pager-icon__arrow']}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
            </div>
            <div className={style['c-pager-main']}>
              <div className={style['c-pager__label']}>Prev</div>
              <div className={style['c-pager__title']}>{prev.title}</div>
            </div>
          </a>
        </Link>
      )}
      {Object.keys(next).length !== 0 && (
        <Link href={`${next.slug}.html`}>
          <a className={style['c-pager__item--next']}>
            <div className={style['c-pager-main']}>
              <div className={style['c-pager__label']}>Next</div>
              <div className={style['c-pager__title']}>{next.title}</div>
            </div>
            <div className={style['c-pager-icon--next']}>
              <div className={style['c-pager-icon__arrow']}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </a>
        </Link>
      )}
    </nav>
  );
};

export default Pager;
