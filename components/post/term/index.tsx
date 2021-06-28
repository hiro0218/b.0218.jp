import React, { FC } from 'react';

import PostCategory from '@/components/post/term/category';
import PostTag from '@/components/post/term/tag';
import { Post } from '@/types/source';

type Props = Pick<Post, 'categories' | 'tags'>;

const PostTerm: FC<Props> = ({ categories, tags }) => {
  return (
    <>
      <PostCategory categories={categories} />
      <PostTag tags={tags} />
    </>
  );
};

export default PostTerm;
