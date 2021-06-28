import Link from 'next/link';
import React, { FC } from 'react';

import style from '@/styles/Components/post-meta.module.css';
import { Post } from '@/types/source';

type Props = Pick<Post, 'categories'>;

const PostCategory: FC<Props> = ({ categories }) => {
  return (
    <>
      {categories?.length !== 0 && (
        <div className={style['c-post-meta']}>
          {categories?.map((category, index) => (
            <div key={index} className={style['c-post-meta__item--separator']}>
              <Link href={'/categories/' + category} prefetch={false}>
                <a className={style['c-post-meta__link--category']}>{category}</a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PostCategory;
