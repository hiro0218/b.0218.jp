import styled from '@emotion/styled';
import { FC } from 'react';

import Heading from '@/components/Heading';
import { Stack } from '@/components/Layout';
import PostDate from '@/components/post/date';
import PostCategory from '@/components/post/term/category';
import PostTag from '@/components/PostTag';
import { Post as PostType } from '@/types/source';

interface Props {
  post: PostType;
}

const PostHeader: FC<Props> = ({ post }) => {
  const tags = post.tags?.map((slug) => ({ slug }));

  return (
    <PostHeaderContainer>
      <PostHeaderItem>
        <Heading text={post.title} />
      </PostHeaderItem>
      <PostHeaderItem>
        <PostDate date={post.date} updated={post.updated} />
        <PostHeaderReadingTime>{post.readingTime}</PostHeaderReadingTime>
        <PostHeaderSeparator />
        <PostCategory categories={post.categories} />
      </PostHeaderItem>
      <PostHeaderItem>
        <Stack wrap="wrap" gap="var(--space-xx-sm)">
          <PostTag tags={tags} />
        </Stack>
      </PostHeaderItem>
    </PostHeaderContainer>
  );
};

export default PostHeader;

const PostHeaderContainer = styled.div`
  > * + * {
    margin-top: var(--space-x-sm);
  }
`;

const PostHeaderItem = styled.div`
  display: flex;
  align-items: center;
`;

const PostHeaderReadingTime = styled.div`
  color: var(--text-11);
  font-size: var(--font-size-md);

  &::before {
    content: '・';
    margin: 0 calc(var(--margin-base) * 0.25);
  }
`;

const PostHeaderSeparator = styled.div`
  width: 2ch;
  height: 1px;
  margin: 0 12px;
  background-color: var(--text-11);
`;
