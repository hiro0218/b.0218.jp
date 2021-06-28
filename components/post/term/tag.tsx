import Link from 'next/link';
import React, { FC } from 'react';

import style from '@/styles/Components/post-meta.module.css';
import { Post } from '@/types/source';

type Props = Pick<Post, 'tags'>;

const PostTag: FC<Props> = ({ tags }) => {
  return (
    <>
      {tags?.length !== 0 && (
        <div className={style['c-post-meta']}>
          {tags?.map((tag, index) => (
            <div key={index} className={style['c-post-meta__item--separator']}>
              <Link href={'/tags/' + tag} prefetch={false}>
                <a className={style['c-post-meta__link--tag']}>
                  <span className={style['c-post-meta__tag-prefix']} aria-hidden="true">
                    #
                  </span>
                  {tag}
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PostTag;
