import Link from 'next/link';
import React, { FC } from 'react';

import { Post } from '@/types/source';

type Props = Pick<Post, 'tags'>;

const PostTag: FC<Props> = ({ tags }) => {
  if (tags.length === 0) return <></>;

  return (
    <div className={'c-post-meta-tag'}>
      {tags?.map((tag, index) => (
        <div key={index} className={'c-post-meta__item'}>
          <Link href={'/tags/' + tag} prefetch={false}>
            <a className={'c-post-meta__link--tag'} title={'tag'}>
              {tag}
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostTag;
