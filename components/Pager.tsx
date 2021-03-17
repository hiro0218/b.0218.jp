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
        <Link href={prev.path}>
          <a className={style['c-pager__item--prev']}>
            <div className={style['c-pager__title']}>{prev.title}</div>
          </a>
        </Link>
      )}
      {Object.keys(next).length !== 0 && (
        <Link href={next.path}>
          <a className={style['c-pager__item--next']}>
            <div className={style['c-pager__title']}>{next.title}</div>
          </a>
        </Link>
      )}
    </nav>
  );
};

export default Pager;
