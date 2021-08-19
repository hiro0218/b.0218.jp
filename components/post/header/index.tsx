import { FC } from 'react';

import Heading from '@/components/Heading';
import PostDate from '@/components/post/date';
import PostCategory from '@/components/post/term/category';
import PostTag from '@/components/post/term/tag';
import { Post as PostType } from '@/types/source';

interface Props {
  post: PostType;
}

const PostHeader: FC<Props> = ({ post }) => {
  return (
    <>
      <Heading text={post.title} />

      <div className="c-post-meta">
        <PostDate date={post.date} updated={post.updated} />
        <div className="c-post-meta-separator"></div>
        <PostCategory categories={post.categories} />
      </div>

      <div className="c-post-meta">
        <PostTag tags={post.tags} />
      </div>
    </>
  );
};

export default PostHeader;
