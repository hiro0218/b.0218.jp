import Link from 'next/link';
import { FC } from 'react';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';

import { NextPrevPost } from '@/types/source';

type Props = {
  next: NextPrevPost;
  prev: NextPrevPost;
};

const PostPager: FC<Props> = ({ next, prev }) => {
  return (
    <nav className="c-pager">
      {Object.keys(prev).length !== 0 && (
        <Link href={`${prev.slug}.html`}>
          <a className="c-pager__item--prev">
            <div className="c-pager-icon--prev">
              <div className="c-pager-icon__arrow">
                <HiOutlineArrowLeft />
              </div>
            </div>
            <div className="c-pager-main">
              <div className="c-pager__label">Prev</div>
              <div className="c-pager__title">{prev.title}</div>
            </div>
          </a>
        </Link>
      )}
      {Object.keys(next).length !== 0 && (
        <Link href={`${next.slug}.html`}>
          <a className="c-pager__item--next">
            <div className="c-pager-main">
              <div className="c-pager__label">Next</div>
              <div className="c-pager__title">{next.title}</div>
            </div>
            <div className="c-pager-icon--next">
              <div className="c-pager-icon__arrow">
                <HiOutlineArrowRight />
              </div>
            </div>
          </a>
        </Link>
      )}
    </nav>
  );
};

export default PostPager;
