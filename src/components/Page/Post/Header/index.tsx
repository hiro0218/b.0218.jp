import styled from '@emotion/styled';
import { FC } from 'react';

import PostDate from '@/components/Page/Post/Date';
import Heading from '@/components/UI/Heading';
import { Stack } from '@/components/UI/Layout';
import PostTag from '@/components/UI/Tag';
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
      </PostHeaderItem>
      <PostHeaderItem>
        <Stack wrap="wrap" gap="var(--space-x-xs)">
          <PostTag tags={tags} />
        </Stack>
      </PostHeaderItem>
    </PostHeaderContainer>
  );
};

export default PostHeader;

const PostHeaderContainer = styled.div`
  > * + * {
    margin-top: var(--space-xs);
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
