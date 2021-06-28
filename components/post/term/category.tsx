import Link from 'next/link';
import React, { FC } from 'react';

import { Post } from '@/types/source';

type Props = Pick<Post, 'categories'>;

const PostCategory: FC<Props> = ({ categories }) => {
  if (categories.length === 0) return <></>;

  return (
    <div className={'c-post-meta-category'}>
      {categories?.map((category, index) => (
        <div key={index} className={'c-post-meta__item'}>
          <Link href={'/categories/' + category} prefetch={false}>
            <a className={'c-post-meta__link--category'} title={'category: ' + category}>
              {category}
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostCategory;
